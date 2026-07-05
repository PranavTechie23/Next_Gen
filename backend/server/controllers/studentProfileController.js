const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParseModule = require('pdf-parse');
const aiConfigService = require('../utils/aiConfigService');
const { toProtectedUploadUrl, normalizeUploadUrl } = require('../utils/uploadUrls');
const {
    normalizeEducationEntries,
    educationEntryToLines,
    parseMarksPercent,
} = require('../utils/educationUtils');
let _pdfjsLegacy = null;

// Ensure upload directory exists for storing resumes
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure upload directory exists for storing avatars
const avatarUploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarUploadDir)) {
    fs.mkdirSync(avatarUploadDir, { recursive: true });
}

// --------------------------------------------------
// MULTER CONFIGURATION FOR RESUME UPLOAD
// --------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const userId = req.user ? req.user.id : 'unknown';
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ext === '.pdf' ? ext : '.pdf';
        cb(null, `resume-${userId}-${uniqueSuffix}${safeExt}`);
    }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const COMMON_SKILLS = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c', 'react', 'node.js',
    'node', 'express', 'sql', 'mysql', 'mongodb', 'aws', 'docker', 'kubernetes',
    'html', 'css', 'git', 'github', 'next.js', 'tailwind', 'postgresql', 'redis'
];
const SKILL_STOPWORDS = new Set([
    'technical skills', 'skills', 'skill', 'core concepts', 'concepts', 'core',
    'programming languages', 'programming language', 'languages', 'language',
    'tools & technologies', 'tools and technologies', 'tools', 'technologies',
    'web technologies', 'database', 'databases'
]);

const ensureResumeParsedTable = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS resume_parsed_data (
            student_id BIGINT PRIMARY KEY,
            full_name VARCHAR(255) NULL,
            email VARCHAR(255) NULL,
            phone VARCHAR(50) NULL,
            linkedin_url VARCHAR(500) NULL,
            github_url VARCHAR(500) NULL,
            inferred_role VARCHAR(120) NULL,
            inferred_role_confidence INT NULL,
            skills_json JSON NULL,
            sections_json JSON NULL,
            raw_text LONGTEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Backward-compatible: add new column if table existed earlier.
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN sections_json JSON NULL`);
    } catch (_) {
        // ignore if already exists
    }
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN inferred_role VARCHAR(120) NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN inferred_role_confidence INT NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN target_role VARCHAR(150) NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN target_role_match INT NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN missing_skills_for_target JSON NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN last_llm_eval_at DATETIME NULL`);
    } catch (_) {}
    try {
        await db.execute(`ALTER TABLE resume_parsed_data ADD COLUMN parse_quality INT NULL`);
    } catch (_) {}
};

const isSameCalendarDay = (a, b) => {
    const d1 = a instanceof Date ? a : new Date(a);
    const d2 = b instanceof Date ? b : new Date(b);
    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
    return d1.getFullYear() === d2.getFullYear()
        && d1.getMonth() === d2.getMonth()
        && d1.getDate() === d2.getDate();
};

const hadLlmEvalToday = (lastLlmEvalAt) => {
    if (!lastLlmEvalAt) return false;
    return isSameCalendarDay(lastLlmEvalAt, new Date());
};

const sanitizeTargetRole = (role = '') => String(role || '')
    .replace(/[\r\n{}<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

/** Skills must appear in resume text — blocks keyword-stuffed skill lists. */
const verifySkillsAgainstResumeText = (skills = [], rawText = '', max = 20) => {
    const textLower = String(rawText || '').toLowerCase();
    if (!textLower) return [];
    return (Array.isArray(skills) ? skills : [])
        .map((s) => String(s || '').trim())
        .filter(Boolean)
        .filter((skill) => textLower.includes(skill.toLowerCase()))
        .slice(0, max);
};

const uniq = (arr = []) => Array.from(new Set(arr.filter(Boolean)));
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value)));

const safeJsonValue = (v, fallback) => {
    if (v === null || v === undefined) return fallback;
    if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return fallback; }
    }
    // mysql2 may return JSON columns as objects already
    if (typeof v === 'object') return v;
    return fallback;
};

const normalizeResumeText = (raw = '') => {
    // Fix common PDF text artifacts:
    // - Windows newlines
    // - hyphenated line breaks: "Program-\nming" -> "Programming"
    // - excessive whitespace
    let t = String(raw || '');
    t = t.replace(/\r/g, '\n');
    t = t.replace(/-\n(\w)/g, '$1');
    t = t.replace(/[ \t]+\n/g, '\n');
    t = t.replace(/\n{3,}/g, '\n\n');
    t = t.replace(/[ \t]{2,}/g, ' ');
    return t.trim();
};

// PDF/resume templates often render hyperlinks as visible glyphs instead of URLs:
// - LaTeX hyperref / Google Docs: "§ 2" next to GitHub links
// - Canva/Notion exports: "↗" before credential or project links
const PDF_LINK_ARTIFACT_RE = /(?:\s*\u00A7\s*\d+\s*|\s*§\s*\d+\s*|\s*[\u2197\u2198\u2192\u21D2\u27A1\u2794\u27A4\uFFEB]\s*|\s*\(\s*(?:link|url|source|demo|live|github|portfolio)\s*\)\s*)/gi;
const URL_IN_TEXT_RE = /https?:\/\/[^\s)>\]"'|,]+/gi;
const DATE_RANGE_IN_TITLE_RE = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:present|ongoing|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4})\b/gi;
const YEAR_RANGE_IN_TITLE_RE = /\b\d{4}\s*[-–—]\s*(?:present|ongoing|\d{4})\b/gi;
const PROJECT_PLATFORM_RE = /\((github|gitlab|bitbucket|vercel|netlify|render|portfolio|live|demo|source)\)/gi;

const stripPdfLinkArtifacts = (raw = '') =>
    String(raw || '')
        .replace(PDF_LINK_ARTIFACT_RE, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const extractUrlsFromText = (raw = '') => {
    const matches = String(raw || '').match(URL_IN_TEXT_RE) || [];
    return uniq(matches.map((u) => u.replace(/[.,;]+$/, '')));
};

const hadPdfLinkArtifact = (raw = '') =>
    /(?:\u00A7|§\s*\d|[\u2197\u2198\u2192\u21D2\u27A1\u2794\u27A4\uFFEB])/i.test(String(raw || ''));

const cleanResumeLine = (raw = '') => {
    const original = String(raw || '').trim();
    const urls = extractUrlsFromText(original);
    let text = stripPdfLinkArtifacts(original.replace(URL_IN_TEXT_RE, ' '));
    text = text
        .replace(/^[•\-\u2022]\s*/, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    return { text, urls, hadLinkArtifact: hadPdfLinkArtifact(original) };
};

const pickBestUrl = (urls = []) => {
    const list = uniq(urls.filter(Boolean));
    if (!list.length) return null;
    return (
        list.find((u) => /github|gitlab|bitbucket|vercel|netlify|render|portfolio|demo|live/i.test(u)) ||
        list.find((u) => /coursera|udemy|linkedin|credly|hackerrank|leetcode/i.test(u)) ||
        list[0]
    );
};

const sanitizeProjectTitle = (rawTitle = '', extraUrls = [], linkPool = null) => {
    const { text, urls, hadLinkArtifact } = cleanResumeLine(rawTitle);
    let title = text
        .replace(PROJECT_PLATFORM_RE, '')
        .replace(DATE_RANGE_IN_TITLE_RE, '')
        .replace(YEAR_RANGE_IN_TITLE_RE, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+[-–—]\s*$/, '')
        .trim();

    const candidateUrls = uniq([...urls, ...extraUrls]);
    let url = pickBestUrl(candidateUrls);
    if (!url && hadLinkArtifact && linkPool) {
        url = linkPool.take();
    }
    return { title: title || 'Project', url: url || null };
};

const sanitizeCertificationEntry = (rawLine = '', linkPool = null) => {
    const { text, urls, hadLinkArtifact } = cleanResumeLine(rawLine);
    let label = text.replace(/\s{2,}/g, ' ').trim();
    let url = pickBestUrl(urls);
    if (!url && hadLinkArtifact && linkPool) {
        url = linkPool.take();
    }
    if (!url) return label;
    return { label, url };
};

const createPdfLinkPool = (hyperlinks = [], consumedFromText = []) => {
    const consumed = new Set(consumedFromText.filter(Boolean));
    const queue = hyperlinks
        .map((h) => (typeof h === 'string' ? h : h?.url))
        .filter((u) => u && /^https?:\/\//i.test(u) && !consumed.has(u));
    return {
        take: () => {
            const next = queue.shift() || null;
            if (next) consumed.add(next);
            return next;
        },
        remaining: () => queue.slice(),
    };
};

const extractPdfHyperlinks = async (fileBuffer) => {
    const links = [];
    try {
        if (!_pdfjsLegacy) {
            _pdfjsLegacy = await import('pdfjs-dist/legacy/build/pdf.mjs');
        }
        const loadingTask = _pdfjsLegacy.getDocument({ data: fileBuffer, verbosity: 0 });
        const pdf = await loadingTask.promise;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const annotations = await page.getAnnotations({ intent: 'display' });
            for (const ann of annotations) {
                if (String(ann?.subtype || '').toLowerCase() !== 'link') continue;
                let url = ann.url || ann.unsafeUrl || null;
                if (!url && typeof ann.uri === 'string') url = ann.uri;
                if (!url || !/^https?:\/\//i.test(String(url))) continue;
                links.push({ url: String(url).trim(), page: pageNum, rect: ann.rect || [] });
            }
        }
    } catch (_) {
        // Non-fatal: text-only parsing still works.
    }
    return links;
};

const extractTextFromPdfPageLayoutAware = (content) => {
    // Reconstruct logical lines using PDF text item coordinates.
    // This preserves headings/bullets far better than plain "join(' ')"
    // and significantly improves section parsing quality.
    const items = Array.isArray(content?.items) ? content.items : [];
    if (!items.length) return '';

    const enriched = items
        .map((it) => {
            const str = it && typeof it.str === 'string' ? it.str : '';
            if (!str.trim()) return null;
            const tr = Array.isArray(it.transform) ? it.transform : [];
            const x = Number(tr[4] || 0);
            const y = Number(tr[5] || 0);
            return { str, x, y };
        })
        .filter(Boolean);

    if (!enriched.length) return '';

    // Group by y-coordinate with a small tolerance.
    const LINE_Y_TOL = 2.5;
    const lines = [];
    for (const it of enriched) {
        let line = lines.find((l) => Math.abs(l.y - it.y) <= LINE_Y_TOL);
        if (!line) {
            line = { y: it.y, items: [] };
            lines.push(line);
        }
        line.items.push(it);
    }

    // PDFs usually have higher y at top; sort top->bottom.
    lines.sort((a, b) => b.y - a.y);

    const rendered = lines.map((line) => {
        line.items.sort((a, b) => a.x - b.x);
        const parts = [];
        let prevX = null;
        for (const item of line.items) {
            // Insert a space on visible horizontal gaps.
            if (prevX !== null && item.x - prevX > 8) {
                parts.push(' ');
            }
            parts.push(item.str);
            prevX = item.x + item.str.length * 4; // rough width estimate
        }
        return parts.join('').replace(/\s{2,}/g, ' ').trim();
    }).filter(Boolean);

    return rendered.join('\n');
};

const {
    scoreExtractedTextQuality,
    scoreParsedResumeQuality,
} = require('../utils/resumeQuality');
const dashboardMetricsService = require('../utils/dashboardMetricsService');

const tryLlmInferRole = async ({ rawText = '', skills = [], sections = {} }) => {
    const payload = {
        skills: Array.isArray(skills) ? skills.slice(0, 50) : [],
        projects: Array.isArray(sections?.projects) ? sections.projects.slice(0, 8) : [],
        experience: Array.isArray(sections?.experience) ? sections.experience.slice(0, 12) : [],
        certifications: Array.isArray(sections?.certifications) ? sections.certifications.slice(0, 12) : [],
        summary: String(sections?.summary || '').slice(0, 700),
        raw_text_excerpt: String(rawText || '').slice(0, 2000),
    };

    const template = await aiConfigService.getPrompt('resume_role_inference', 'Classify the student\'s BEST-FIT placement role from this resume.\nResume data: {{data}}');
    const prompt = template.replace('{{data}}', JSON.stringify(payload));

    try {
        const parsed = await aiConfigService.callAI({ prompt });
        if (!parsed || !parsed.role) return null;
        return parsed;
    } catch (err) {
        console.error('[Profile] LLM role inference failed:', err.message);
        return null;
    }
};

const inferRoleFromResumeNlp = ({ rawText = '', skills = [], sections = {} }) => {
    const bag = [
        String(rawText || ''),
        ...(Array.isArray(skills) ? skills : []),
        ...(Array.isArray(sections?.projects) ? sections.projects.map((p) => (typeof p === 'string' ? p : p?.title || '')) : []),
        ...(Array.isArray(sections?.experience) ? sections.experience : []),
        ...(Array.isArray(sections?.certifications) ? sections.certifications : []),
    ].join(' ').toLowerCase();

    const roles = [
        { title: 'Frontend Developer', signals: ['react', 'next.js', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'ui', 'frontend'] },
        { title: 'Backend Developer', signals: ['node.js', 'express', 'java', 'spring', 'api', 'microservice', 'redis', 'sql', 'postgres', 'backend', 'server'] },
        { title: 'Full Stack Developer', signals: ['react', 'node.js', 'express', 'api', 'mongodb', 'sql', 'full stack', 'frontend', 'backend'] },
        { title: 'Data / ML Engineer', signals: ['python', 'pandas', 'numpy', 'machine learning', 'tensorflow', 'pytorch', 'scikit', 'analytics', 'data'] },
        { title: 'DevOps / Cloud Engineer', signals: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform', 'devops', 'cloud'] },
        { title: 'Software Engineer', signals: ['dsa', 'algorithm', 'problem solving', 'oop', 'c++', 'java', 'software'] },
    ];

    const scoreRole = (role) => {
        let score = 0;
        for (const sig of role.signals) {
            const key = String(sig || '').toLowerCase();
            if (!key) continue;
            if (bag.includes(key)) score += 1;
        }
        // avoid always predicting full-stack unless both FE and BE signals are present
        if (role.title === 'Full Stack Developer') {
            const hasFe = /(react|next\.js|html|css|frontend|javascript|typescript)/i.test(bag);
            const hasBe = /(node\.js|express|backend|api|server|sql|mongodb|postgres)/i.test(bag);
            if (!(hasFe && hasBe)) score -= 2;
        }
        return Math.max(0, score);
    };

    const scored = roles.map((r) => ({ ...r, score: scoreRole(r) })).sort((a, b) => b.score - a.score);
    const top = scored[0];
    const second = scored[1];
    const margin = Math.max(0, (top?.score || 0) - (second?.score || 0));
    const confidence = clamp(40 + (top?.score || 0) * 8 + margin * 6, 35, 96);
    return {
        role: top?.score > 0 ? top.title : 'Software Engineer',
        confidence: Math.round(confidence),
    };
};

const parseResumeText = (rawText = '', context = {}) => {
    const text = normalizeResumeText(rawText);
    const hyperlinks = Array.isArray(context?.hyperlinks) ? context.hyperlinks : [];
    const linkPool = createPdfLinkPool(hyperlinks, extractUrlsFromText(text));
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';
    const cleanListLine = (line = '') => cleanResumeLine(line).text;
    const isNoiseLine = (line = '') => {
        const l = String(line || '').trim();
        if (!l) return true;
        if (/^[-–—\s]*\d+\s*(?:of)?\s*\d+\s*[-–—\s]*$/i.test(l)) return true;
        if (/^page\s*\d+/i.test(l)) return true;
        return false;
    };

    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-\s]?)?(?:\d[-\s]?){10,14}/);
    const linkedInMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
    const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i);

    const lowerText = text.toLowerCase();

    const SECTION_ALIASES = new Map([
        ['professional summary', 'summary'],
        ['summary', 'summary'],
        ['objective', 'summary'],
        ['education', 'education'],
        ['projects', 'projects'],
        ['project', 'projects'],
        ['experience', 'experience'],
        ['work experience', 'experience'],
        ['internship', 'experience'],
        ['certifications', 'certifications'],
        ['certification', 'certifications'],
        ['technical skills', 'skills'],
        ['skills', 'skills'],
        ['achievements', 'achievements'],
        ['extra-curricular activities', 'extracurricular'],
        ['extracurricular activities', 'extracurricular'],
        ['languages', 'languages'],
        ['hobbies & interests', 'interests'],
        ['hobbies and interests', 'interests'],
    ]);

    const normalizeHeading = (s) => s.toLowerCase().replace(/[^a-z&\s]/g, '').replace(/\s+/g, ' ').trim();
    const isHeadingLine = (line) => {
        const n = normalizeHeading(line);
        return SECTION_ALIASES.has(n);
    };

    // More robust: find headings even when PDF doesn't preserve clean newlines.
    // We'll build a "section map" using heading occurrences in the full text too.
    const buildSectionSlices = () => {
        const candidates = Array.from(SECTION_ALIASES.keys())
            .sort((a, b) => b.length - a.length) // longer first
            .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        // IMPORTANT: match headings only when the whole line is a heading.
        // This avoids false section switches for phrases like "user experience".
        const re = new RegExp(`^\\s*(${candidates.join('|')})\\s*$`, 'igm');
        const hits = [];
        let m;
        while ((m = re.exec(text)) !== null) {
            hits.push({ idx: m.index, raw: m[1] });
        }
        // If no hits, fall back to line-based logic only.
        if (hits.length === 0) return null;

        const slices = [];
        for (let i = 0; i < hits.length; i++) {
            const start = hits[i].idx;
            const end = i + 1 < hits.length ? hits[i + 1].idx : text.length;
            const key = SECTION_ALIASES.get(normalizeHeading(hits[i].raw));
            if (!key) continue;
            const body = text.slice(start, end);
            // Remove the heading itself from the body
            const bodyNoHeading = body.replace(new RegExp(`^\\s*${hits[i].raw}\\s*\\n`, 'i'), '').trim();
            slices.push({ key, body: bodyNoHeading });
        }
        return slices;
    };

    const sections = {
        summary: [],
        education: [],
        projects: [],
        experience: [],
        certifications: [],
        skills: [],
        achievements: [],
        extracurricular: [],
        languages: [],
        interests: [],
        other: []
    };

    const slices = buildSectionSlices();
    if (slices) {
        for (const s of slices) {
            const bodyLines = s.body.split('\n').map((l) => l.trim()).filter(Boolean);
            sections[s.key].push(...bodyLines);
        }
    } else {
        let current = 'other';
        for (const line of lines) {
            if (isHeadingLine(line)) {
                current = SECTION_ALIASES.get(normalizeHeading(line));
                continue;
            }
            // Skip obvious page counters
            if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(line) || /^\d+\s*$/.test(line)) continue;
            sections[current].push(line);
        }
    }

    const extractBullets = (arr) =>
        arr
            .map((l) => cleanListLine(l))
            .filter((l) => l && !isNoiseLine(l));

    const normalizeSkillToken = (token = '') => {
        let t = String(token || '').trim();
        if (!t) return null;
        // Remove parentheses noise + normalize punctuation that appears in PDFs (":", "•", etc.)
        t = t
            .replace(/\([^)]*\)/g, ' ')
            .replace(/[•|]/g, ' ')
            .replace(/[:]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
        const lower = t.toLowerCase();
        if (!lower || SKILL_STOPWORDS.has(lower)) return null;
        if (lower.length < 2 || lower.length > 35) return null;
        if (/^\d+$/.test(lower)) return null;
        if (/^[^a-zA-Z0-9]+$/.test(lower)) return null;
        if (lower.split(/\s+/).length > 4) return null;
        if (/(basic queries|crud operations|strong interest|seeking an internship)/i.test(lower)) return null;
        // Drop generic/non-skill tokens that commonly leak from PDF parsing.
        if (/(^learn$|^learning$|^object$|^language$|^languages$|^core$|^concepts$|^tools$|^technologies$)/i.test(lower)) return null;
        if (/(^core concepts$|^programming languages$|^web development$|^ai\s*\/\s*ml|^ai\s*&\s*ml)/i.test(lower)) return null;

        const canonicalMap = new Map([
            ['js', 'JavaScript'],
            ['javascript', 'JavaScript'],
            ['ts', 'TypeScript'],
            ['typescript', 'TypeScript'],
            ['c++', 'C++'],
            ['c', 'C'],
            ['sql', 'SQL'],
            ['html', 'HTML'],
            ['css', 'CSS'],
            ['oop', 'OOP'],
            ['dbms', 'DBMS'],
            ['github', 'GitHub'],
            ['git', 'Git'],
            ['node.js', 'Node.js'],
            ['node', 'Node.js'],
            ['react', 'React'],
            ['next.js', 'Next.js'],
            ['tailwind', 'TailwindCSS'],
            ['tailwind css', 'TailwindCSS'],
        ]);
        if (canonicalMap.has(lower)) return canonicalMap.get(lower);
        return t.replace(/\b\w/g, (ch) => ch.toUpperCase());
    };

    const parseSkillsFromSection = () => {
        const skillLines = extractBullets(sections.skills);
        const tokens = [];
        for (const line of skillLines) {
            const rhs = line.match(/^[A-Za-z &/]+[:\-]\s*(.+)$/)?.[1] || line;
            const split = rhs
                .split(/[,\u2022|/]/g)
                .map((t) => t.trim())
                .filter(Boolean);
            for (const s of split) {
                const normalized = normalizeSkillToken(s);
                if (normalized) tokens.push(normalized);
            }
        }
        return uniq(tokens);
    };

    // IMPORTANT: skills should come from the Technical Skills section only.
    // Inferring skills from the entire resume text can add non-mentioned/noisy tokens.
    const sectionSkills = parseSkillsFromSection();
    const allSkills = uniq([...sectionSkills]);

    const summaryText = extractBullets(sections.summary).join(' ');

    const parseProjectBlocks = () => {
        const projectLines = sections.projects
            .map((l) => String(l || '').trim())
            .filter((l) => l && !isNoiseLine(l));
        const projects = [];
        let currentProject = null;
        const startsWithActionVerb = (line = '') =>
            /^(built|developed|implemented|designed|created|integrated|engineered|deployed|optimized|managed|handled)\b/i.test(String(line).trim());

        const isLikelyTitleLine = (l) => {
            const line = cleanResumeLine(l).text;
            if (!line || line.length < 6 || line.length > 180) return false;
            if (/^[•\-\u2022]/.test(String(l || '').trim())) return false;
            if (/\.$/.test(line)) return false;
            if (startsWithActionVerb(line)) return false;

            // Common project-title signals.
            const hasSignal = /github|vercel|ongoing|\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|react|node|python|java|api|tailwind|docker|mongodb|mysql|postgres/i.test(line);
            if (hasSignal) return true;

            // Fallback heuristic: "Title Case words" style lines are often project names.
            const words = line.split(/\s+/).filter(Boolean);
            const titleCaseWords = words.filter((w) => /^[A-Z][a-zA-Z0-9+.#-]*$/.test(w)).length;
            return words.length >= 2 && words.length <= 12 && titleCaseWords >= Math.ceil(words.length * 0.5);
        };

        for (const rawLine of projectLines) {
            if (isLikelyTitleLine(rawLine) && !String(rawLine || '').trim().startsWith('•')) {
                if (currentProject) projects.push(currentProject);
                const { title, url } = sanitizeProjectTitle(rawLine, [], linkPool);
                currentProject = { title, bullets: [], url };
            } else if (currentProject) {
                const bulletMeta = cleanResumeLine(rawLine);
                currentProject.bullets.push(bulletMeta.text);
                const bulletUrl = pickBestUrl(bulletMeta.urls);
                if (!currentProject.url && bulletUrl) currentProject.url = bulletUrl;
            }
        }
        if (currentProject) projects.push(currentProject);

        // If no title lines were detected but project section has content,
        // keep one inferred project so projects are not silently lost.
        if (projects.length === 0 && projectLines.length > 0) {
            const [firstRaw, ...restRaw] = projectLines;
            const firstProject = sanitizeProjectTitle(firstRaw, [], linkPool);
            projects.push({
                title: firstProject.title || 'Project',
                url: firstProject.url,
                bullets: restRaw.map((l) => cleanResumeLine(l).text).slice(0, 8),
            });
        }
        return projects.slice(0, 10).map((p) => ({
            title: p.title,
            bullets: (Array.isArray(p.bullets) ? p.bullets : []).filter(Boolean).slice(0, 10),
            ...(p.url ? { url: p.url } : {}),
        }));
    };

    const parseCertificationList = (arr, max = 25) =>
        arr
            .map((l) => String(l || '').trim())
            .filter((l) => l && !isNoiseLine(l))
            .map((rawLine) => sanitizeCertificationEntry(rawLine, linkPool))
            .filter((entry) => {
                const label = typeof entry === 'string' ? entry : entry?.label;
                return String(label || '').length >= 3;
            })
            .slice(0, max);

    const parseSimpleList = (arr, max = 20) => extractBullets(arr).slice(0, max);
    const parseAchievementList = (arr, max = 25) =>
        extractBullets(arr)
            .filter((x) => !/^[-–—\s]*\d+\s*(?:of)?\s*\d+\s*[-–—\s]*$/i.test(String(x)))
            .filter((x) => String(x).length >= 6)
            .slice(0, max);

    const extractLikelyName = () => {
        const headerWindow = lines.slice(0, 8);
        const blocked = /(summary|education|skills|experience|projects|certification|address|phone|email|linkedin|developer|engineer|intern|student|bachelor|master|analyst)/i;
        for (const raw of headerWindow) {
            const line = String(raw || '').trim();
            if (!line || blocked.test(line) || line.includes('@') || /\d{3,}/.test(line)) continue;
            if (!/^[a-zA-Z][a-zA-Z\s.'-]{2,59}$/.test(line)) continue;
            const parts = line.split(/\s+/).filter(Boolean);
            if (parts.length < 2 || parts.length > 4) continue;
            return line.replace(/\b\w/g, (c) => c.toUpperCase());
        }
        return null;
    };

    const fullName = extractLikelyName() || (firstLine && !firstLine.includes('@') && firstLine.length < 80 ? firstLine : null);

    const parsedProjects = parseProjectBlocks();
    const parsedExperience = parseSimpleList(sections.experience, 25);

    // Safety rebalance:
    // If projects ended up empty, recover likely project entries from experience lines.
    const rebalanceProjectsFromExperience = (projectsArr, experienceArr) => {
        const projectsOut = Array.isArray(projectsArr) ? [...projectsArr] : [];
        const experienceOut = Array.isArray(experienceArr) ? [...experienceArr] : [];
        if (projectsOut.length > 0 || experienceOut.length === 0) {
            return { projects: projectsOut, experience: experienceOut };
        }

        const looksProjectish = (line = '') =>
            /project|clone|portal|app|application|dashboard|website|api|react|node|python|java|tailwind|mongodb|mysql|gemini/i.test(String(line));
        const startsWithActionVerb = (line = '') =>
            /^(built|developed|implemented|designed|created|integrated|engineered|deployed|optimized|managed)\b/i.test(String(line).trim());

        const recovered = [];
        const keptExperience = [];
        let i = 0;
        while (i < experienceOut.length) {
            const line = String(experienceOut[i] || '').trim();
            const next = String(experienceOut[i + 1] || '').trim();

            const titleCandidate = looksProjectish(line) && !startsWithActionVerb(line);
            if (titleCandidate) {
                const bullets = [];
                let j = i + 1;
                while (j < experienceOut.length && startsWithActionVerb(experienceOut[j])) {
                    bullets.push(String(experienceOut[j] || '').trim());
                    j += 1;
                }
                if (bullets.length > 0 || looksProjectish(next)) {
                    const sanitized = sanitizeProjectTitle(line, [], linkPool);
                    recovered.push({
                        title: sanitized.title,
                        bullets: bullets.map((b) => cleanResumeLine(b).text).slice(0, 8),
                        ...(sanitized.url ? { url: sanitized.url } : {}),
                    });
                    i = j;
                    continue;
                }
            }

            keptExperience.push(line);
            i += 1;
        }

        if (recovered.length > 0) {
            return {
                projects: recovered.slice(0, 10),
                experience: keptExperience.slice(0, 25),
            };
        }
        return { projects: projectsOut, experience: experienceOut };
    };

    const rebalanced = rebalanceProjectsFromExperience(parsedProjects, parsedExperience);
    const educationBundle = normalizeEducationEntries([], parseSimpleList(sections.education, 20));

    return {
        fullName,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : null,
        linkedinUrl: linkedInMatch ? linkedInMatch[0] : null,
        githubUrl: githubMatch ? githubMatch[0] : null,
        skills: allSkills,
        sections: {
            summary: summaryText || null,
            education: educationBundle.education,
            education_entries: educationBundle.education_entries,
            projects: rebalanced.projects,
            experience: rebalanced.experience,
            certifications: parseCertificationList(sections.certifications, 25),
            achievements: parseAchievementList(sections.achievements, 25),
            extracurricular: parseSimpleList(sections.extracurricular, 25),
            languages: parseSimpleList(sections.languages, 10),
            interests: parseSimpleList(sections.interests, 15),
        },
        rawText: text.slice(0, 20000)
    };
};

const extractPdfTextCandidates = async (fileBuffer) => {
    const candidates = [];

    // Scan 1 + 2 + 3: pdf.js plain/layout/hybrid
    try {
        if (!_pdfjsLegacy) {
            // pdfjs-dist legacy build is ESM-only in recent versions; load via dynamic import.
            _pdfjsLegacy = await import('pdfjs-dist/legacy/build/pdf.mjs');
        }
        const loadingTask = _pdfjsLegacy.getDocument({ data: fileBuffer, verbosity: 0 });
        const pdf = await loadingTask.promise;
        let plainText = '';
        let layoutAwareText = '';
        let hybridPageText = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const strings = content.items.map((it) => (it && it.str ? it.str : '')).filter(Boolean);
            plainText += strings.join(' ') + '\n';
            layoutAwareText += extractTextFromPdfPageLayoutAware(content) + '\n\n';
            const chunked = strings
                .join(' | ')
                .replace(/\s{2,}/g, ' ')
                .replace(/\|\s*\|/g, '|')
                .trim();
            hybridPageText += chunked + '\n';
        }
        const normalizedPlain = normalizeResumeText(plainText);
        const normalizedLayout = normalizeResumeText(layoutAwareText);
        const normalizedHybrid = normalizeResumeText(hybridPageText.replace(/\s*\|\s*/g, ' '));

        if (normalizedPlain.length > 40) {
            candidates.push({ source: 'pdfjs_plain', text: normalizedPlain, quality: scoreExtractedTextQuality(normalizedPlain) });
        }
        if (normalizedLayout.length > 40) {
            candidates.push({ source: 'pdfjs_layout', text: normalizedLayout, quality: scoreExtractedTextQuality(normalizedLayout) });
        }
        if (normalizedHybrid.length > 40) {
            candidates.push({ source: 'pdfjs_hybrid', text: normalizedHybrid, quality: scoreExtractedTextQuality(normalizedHybrid) });
        }
    } catch (e) {
        // Continue with other scanners
    }

    // Scan 4: pdf-parse fallback parser.
    if (typeof pdfParseModule === 'function') {
        try {
            const parsed = await pdfParseModule(fileBuffer);
            const t = normalizeResumeText(parsed?.text || '');
            if (t.length > 40) candidates.push({ source: 'pdf_parse', text: t, quality: scoreExtractedTextQuality(t) });
        } catch (_) {}
    }

    if (pdfParseModule && typeof pdfParseModule.PDFParse === 'function') {
        try {
            const parser = new pdfParseModule.PDFParse({ data: fileBuffer });
            try {
                const parsed = await parser.getText();
                const t = normalizeResumeText(parsed?.text || '');
                if (t.length > 40) candidates.push({ source: 'pdf_parse_v2', text: t, quality: scoreExtractedTextQuality(t) });
            } finally {
                if (typeof parser.destroy === 'function') {
                    await parser.destroy();
                }
            }
        } catch (_) {}
    }

    const resolvedCandidates = await Promise.all(candidates.map(async (c) => ({
        ...c,
        quality: await c.quality
    })));

    return resolvedCandidates.sort((a, b) => (b.quality || 0) - (a.quality || 0));
};

const mergeParsedResumeCandidates = (parsedCandidates = []) => {
    if (!parsedCandidates.length) return parseResumeText('');
    const ordered = [...parsedCandidates].sort((a, b) => (b.score || 0) - (a.score || 0));
    const base = JSON.parse(JSON.stringify(ordered[0].parsed));
    const listSections = ['education', 'experience', 'achievements', 'extracurricular', 'languages', 'interests'];

    const projectKey = (p) => String(p?.title || p?.name || '').toLowerCase().trim();
    const certKey = (c) => (typeof c === 'string' ? c : String(c?.label || '')).toLowerCase().trim();

    for (let i = 1; i < ordered.length; i++) {
        const p = ordered[i].parsed || {};
        base.skills = uniq([...(base.skills || []), ...(p.skills || [])]).slice(0, 80);
        base.fullName = base.fullName || p.fullName || null;
        base.email = base.email || p.email || null;
        base.phone = base.phone || p.phone || null;
        base.linkedinUrl = base.linkedinUrl || p.linkedinUrl || null;
        base.githubUrl = base.githubUrl || p.githubUrl || null;
        const baseSummary = String(base?.sections?.summary || '');
        const candidateSummary = String(p?.sections?.summary || '');
        if (candidateSummary.length > baseSummary.length) {
            base.sections.summary = candidateSummary;
        }

        const baseProjects = Array.isArray(base?.sections?.projects) ? base.sections.projects : [];
        const extraProjects = Array.isArray(p?.sections?.projects) ? p.sections.projects : [];
        const projectMap = new Map();
        for (const proj of [...baseProjects, ...extraProjects]) {
            const key = projectKey(proj);
            if (!key) continue;
            const existing = projectMap.get(key);
            if (!existing) {
                projectMap.set(key, proj);
                continue;
            }
            projectMap.set(key, {
                ...existing,
                ...proj,
                title: existing.title || proj.title,
                url: existing.url || proj.url || null,
                bullets: uniq([...(existing.bullets || []), ...(proj.bullets || [])]).slice(0, 10),
            });
        }
        base.sections.projects = Array.from(projectMap.values()).slice(0, 40);

        const baseCerts = Array.isArray(base?.sections?.certifications) ? base.sections.certifications : [];
        const extraCerts = Array.isArray(p?.sections?.certifications) ? p.sections.certifications : [];
        const certMap = new Map();
        for (const cert of [...baseCerts, ...extraCerts]) {
            const key = certKey(cert);
            if (!key) continue;
            const existing = certMap.get(key);
            if (!existing) {
                certMap.set(key, cert);
                continue;
            }
            if (typeof existing === 'string' && typeof cert === 'object' && cert?.url) {
                certMap.set(key, cert);
            } else if (typeof existing === 'object' && !existing.url && typeof cert === 'object' && cert?.url) {
                certMap.set(key, { ...existing, url: cert.url });
            }
        }
        base.sections.certifications = Array.from(certMap.values()).slice(0, 40);

        const baseEdu = Array.isArray(base?.sections?.education_entries) ? base.sections.education_entries : [];
        const extraEdu = Array.isArray(p?.sections?.education_entries) ? p.sections.education_entries : [];
        const eduMap = new Map();
        for (const entry of [...baseEdu, ...extraEdu]) {
            const key = `${entry?.level || 'other'}::${String(entry?.institute || '').toLowerCase()}::${String(entry?.degreeOrBoard || '').toLowerCase()}`;
            if (!key.replace(/::/g, '')) continue;
            if (!eduMap.has(key)) {
                eduMap.set(key, entry);
                continue;
            }
            const existing = eduMap.get(key);
            eduMap.set(key, {
                ...existing,
                ...entry,
                marks: existing?.marks || entry?.marks || undefined,
                years: existing?.years || entry?.years || undefined,
                details: uniq([...(existing?.details || []), ...(entry?.details || [])]).slice(0, 10),
            });
        }
        const mergedEduEntries = Array.from(eduMap.values()).slice(0, 12);
        base.sections.education_entries = mergedEduEntries;
        base.sections.education = uniq([
            ...(Array.isArray(base?.sections?.education) ? base.sections.education : []),
            ...(Array.isArray(p?.sections?.education) ? p.sections.education : []),
            ...mergedEduEntries.flatMap(educationEntryToLines),
        ]).slice(0, 40);

        for (const sectionKey of listSections) {
            const a = Array.isArray(base?.sections?.[sectionKey]) ? base.sections[sectionKey] : [];
            const b = Array.isArray(p?.sections?.[sectionKey]) ? p.sections[sectionKey] : [];
            base.sections[sectionKey] = uniq([...a, ...b]).slice(0, 40);
        }
    }
    return base;
};

const extractPdfText = async (fileBuffer) => {
    const candidates = await extractPdfTextCandidates(fileBuffer);
    return candidates[0]?.text || '';
};

const ensureAchievementsTable = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS student_achievements (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            student_id BIGINT NOT NULL,
            achievement_text VARCHAR(1000) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (student_id)
        )
    `);
};


// --------------------------------------------------
// STEP 1: CREATE / UPDATE PROFILE API
// Route: PUT /api/student/profile
// --------------------------------------------------
const upsertProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { linkedin_url, github_url, address } = req.body;

        // Basic validation: at least one field should be provided to update (optional, but good practice)
        if (!linkedin_url && !github_url && !address) {
            return res.status(400).json({ 
                message: "Please provide at least one field to update (linkedin_url, github_url, or address)." 
            });
        }

        // Upsert Logic (Insert if not exists, Update if exists)
        // Using ON DUPLICATE KEY UPDATE since student_id is the PRIMARY KEY
        const query = `
            INSERT INTO student_profiles (student_id, linkedin_url, github_url, address)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                linkedin_url = COALESCE(VALUES(linkedin_url), linkedin_url),
                github_url = COALESCE(VALUES(github_url), github_url),
                address = COALESCE(VALUES(address), address)
        `;

        await db.execute(query, [studentId, linkedin_url || null, github_url || null, address || null]);

        res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error upserting profile:", error);
        res.status(500).json({ message: "Internal server error while updating profile." });
    }
};

// --------------------------------------------------
// STEP 2: GET STUDENT PROFILE
// Route: GET /api/student/profile
// --------------------------------------------------
const getProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        await ensureResumeParsedTable();
        await ensureAchievementsTable();

        const [[studentRow]] = await db.execute(`
            SELECT
                s.user_id,
                s.roll_number,
                s.current_cgpa,
                s.active_backlogs,
                u.email AS user_email,
                u.created_at AS user_created_at,
                d.id AS department_id,
                d.name AS department_name,
                sp.resume_url,
                sp.avatar_url,
                sp.linkedin_url,
                sp.github_url,
                sp.address,
                sp.full_name AS profile_full_name,
                sp.phone AS profile_phone,
                sp.bio AS profile_bio,
                rp.full_name,
                rp.email AS parsed_email,
                rp.phone AS parsed_phone,
                rp.linkedin_url AS parsed_linkedin_url,
                rp.github_url AS parsed_github_url,
                rp.inferred_role,
                rp.inferred_role_confidence,
                rp.target_role,
                rp.target_role_match,
                rp.missing_skills_for_target,
                rp.last_llm_eval_at,
                rp.skills_json,
                rp.sections_json
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            LEFT JOIN resume_parsed_data rp ON s.user_id = rp.student_id
            WHERE s.user_id = ?
            LIMIT 1
        `, [studentId]);

        if (!studentRow) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        const [skillsRows] = await db.execute(`
            SELECT sk.name
            FROM student_skills ss
            JOIN skills sk ON ss.skill_id = sk.id
            WHERE ss.student_id = ?
        `, [studentId]);

        const [projectRows] = await db.execute(`
            SELECT id, title, description, project_link
            FROM projects
            WHERE student_id = ?
        `, [studentId]);

        const parsedSkills = safeJsonValue(studentRow.skills_json, []);
        const parsedSections = safeJsonValue(studentRow.sections_json, {});

        const [achievementRows] = await db.execute(
            'SELECT achievement_text FROM student_achievements WHERE student_id = ? ORDER BY id ASC',
            [studentId]
        );
        const manualAchievements = achievementRows.map((r) => r.achievement_text);

        const dashboardMetrics = await dashboardMetricsService.calculateForStudent(studentId);

        res.status(200).json({
            message: "Profile retrieved successfully",
            user: {
                email: studentRow.user_email,
                created_at: studentRow.user_created_at
            },
            student: {
                user_id: studentRow.user_id,
                roll_number: studentRow.roll_number,
                current_cgpa: studentRow.current_cgpa,
                active_backlogs: studentRow.active_backlogs
            },
            department: {
                id: studentRow.department_id,
                name: studentRow.department_name
            },
            profile: {
                resume_url: normalizeUploadUrl(studentRow.resume_url),
                linkedin_url: studentRow.linkedin_url || studentRow.parsed_linkedin_url,
                github_url: studentRow.github_url || studentRow.parsed_github_url,
                address: studentRow.address,
                full_name: studentRow.profile_full_name || studentRow.full_name,
                phone: studentRow.profile_phone || studentRow.parsed_phone,
                bio: studentRow.profile_bio || null,
                avatar_url: normalizeUploadUrl(studentRow.avatar_url) || "",
            },
            skills: skillsRows,
            projects: projectRows,
            achievements: manualAchievements,
            resumeParsed: {
                email: studentRow.parsed_email,
                phone: studentRow.parsed_phone,
                linkedin_url: studentRow.parsed_linkedin_url,
                github_url: studentRow.parsed_github_url,
                inferred_role: studentRow.inferred_role,
                inferred_role_confidence: studentRow.inferred_role_confidence,
                target_role: studentRow.target_role,
                target_role_match: studentRow.target_role_match,
                missing_skills_for_target: safeJsonValue(studentRow.missing_skills_for_target, []),
                last_llm_eval_at: studentRow.last_llm_eval_at,
                llm_eval_available_today: !hadLlmEvalToday(studentRow.last_llm_eval_at),
                skills: parsedSkills,
                sections: parsedSections
            },
            dashboardMetrics,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error while fetching profile." });
    }
};

const getDashboardMetrics = async (req, res) => {
    try {
        const metrics = await dashboardMetricsService.calculateForStudent(req.user.id);
        if (!metrics) {
            return res.status(404).json({ message: "Student profile not found." });
        }
        return res.status(200).json({ dashboardMetrics: metrics });
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return res.status(500).json({ message: "Internal server error while fetching metrics." });
    }
};

// --------------------------------------------------
// STEP 3: RESUME UPLOAD API
// Route: POST /api/student/profile/resume
// --------------------------------------------------
const uploadResume = async (req, res) => {
    try {
        // Multer attaches the `file` object to req
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required and must be a PDF." });
        }

        const studentId = req.user.id;
        
        // Generate a public-facing URL path for the database
        const resumeUrl = toProtectedUploadUrl(req.file.filename, 'resumes');

        // Upsert logic just for the resume_url to handle cases where profile doesn't exist yet!
        const query = `
            INSERT INTO student_profiles (student_id, resume_url)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE resume_url = VALUES(resume_url)
        `;

        await db.execute(query, [studentId, resumeUrl]);

        // Parse PDF text and extract useful fields for dashboard auto-fill.
        await ensureResumeParsedTable();

        const [existingRows] = await db.execute(
            'SELECT last_llm_eval_at, target_role, target_role_match, missing_skills_for_target FROM resume_parsed_data WHERE student_id = ? LIMIT 1',
            [studentId]
        );
        const existingParsed = existingRows[0] || {};
        const skipLlmEval = hadLlmEvalToday(existingParsed.last_llm_eval_at);
        const resetTargetRoleEval = !skipLlmEval;

        const fileBuffer = fs.readFileSync(req.file.path);
        let parsedText = '';
        let pdfHyperlinks = [];
        try {
            pdfHyperlinks = await extractPdfHyperlinks(fileBuffer);
            parsedText = await extractPdfText(fileBuffer);
        } catch (parseError) {
            console.warn('Resume parsing failed, saving file without parsed data:', parseError?.message || parseError);
        }

        let parsedResume = parseResumeText(parsedText || '', { hyperlinks: pdfHyperlinks });
        try {
            const extractedCandidates = await extractPdfTextCandidates(fileBuffer);
            const parsedCandidates = await Promise.all(extractedCandidates
                .map(async (cand) => {
                    const parsed = parseResumeText(cand.text || '', { hyperlinks: pdfHyperlinks });
                    const parsingQuality = await scoreParsedResumeQuality(parsed);
                    const extractionQuality = await cand.quality; // quality is a promise now
                    return {
                        source: cand.source,
                        parsed,
                        score: extractionQuality * 0.45 + parsingQuality * 0.55
                    };
                }));
            
            parsedCandidates.sort((a, b) => b.score - a.score);

            if (parsedCandidates.length > 0) {
                parsedResume = mergeParsedResumeCandidates(parsedCandidates.slice(0, 4));
                parsedResume.rawText = parsedCandidates[0]?.parsed?.rawText || parsedText || '';
            }
        } catch (multiScanError) {
            console.warn('Multi-scan resume merge failed, using primary parse:', multiScanError?.message || multiScanError);
        }

        const resumeRawText = parsedResume.rawText || parsedText || '';
        const parseQuality = await scoreParsedResumeQuality(parsedResume);

        const fallbackRole = inferRoleFromResumeNlp({
            rawText: resumeRawText,
            skills: parsedResume.skills || [],
            sections: parsedResume.sections || {},
        });
        // Inferred role uses NLP only; the single daily LLM call is reserved for target-role evaluation.
        const inferredRole = fallbackRole;

        const verifiedSkills = verifySkillsAgainstResumeText(
            parsedResume.skills || [],
            resumeRawText,
            20
        );
        parsedResume.skills = verifiedSkills;

        const targetRoleParams = resetTargetRoleEval
            ? [null, null, null]
            : [
                existingParsed.target_role ?? null,
                existingParsed.target_role_match ?? null,
                existingParsed.missing_skills_for_target ?? null,
            ];

        await db.execute(`
            INSERT INTO resume_parsed_data
                (student_id, full_name, email, phone, linkedin_url, github_url, inferred_role, inferred_role_confidence, target_role, target_role_match, missing_skills_for_target, skills_json, sections_json, raw_text, parse_quality)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                email = VALUES(email),
                phone = VALUES(phone),
                linkedin_url = VALUES(linkedin_url),
                github_url = VALUES(github_url),
                inferred_role = VALUES(inferred_role),
                inferred_role_confidence = VALUES(inferred_role_confidence),
                target_role = VALUES(target_role),
                target_role_match = VALUES(target_role_match),
                missing_skills_for_target = VALUES(missing_skills_for_target),
                skills_json = VALUES(skills_json),
                sections_json = VALUES(sections_json),
                raw_text = VALUES(raw_text),
                parse_quality = VALUES(parse_quality)
        `, [
            studentId,
            parsedResume.fullName,
            parsedResume.email,
            parsedResume.phone,
            parsedResume.linkedinUrl,
            parsedResume.githubUrl,
            inferredRole.role,
            inferredRole.confidence,
            ...targetRoleParams,
            JSON.stringify(verifiedSkills),
            JSON.stringify(parsedResume.sections || {}),
            resumeRawText,
            Math.round(parseQuality * 100),
        ]);

        await syncSchoolMarksFromEducation(
            studentId,
            parsedResume?.sections?.education_entries || []
        );

        // Auto-update profile links when they are missing.
        await db.execute(`
            UPDATE student_profiles
            SET
                linkedin_url = COALESCE(linkedin_url, ?),
                github_url = COALESCE(github_url, ?)
            WHERE student_id = ?
        `, [parsedResume.linkedinUrl, parsedResume.githubUrl, studentId]);

        if (parseQuality >= 0.25 && verifiedSkills.length > 0) {
            for (const skillName of verifiedSkills) {
                const [existingSkill] = await db.execute('SELECT id FROM skills WHERE LOWER(name) = LOWER(?) LIMIT 1', [skillName]);
                let skillId;
                if (existingSkill.length > 0) {
                    skillId = existingSkill[0].id;
                } else {
                    const [newSkill] = await db.execute('INSERT INTO skills (name) VALUES (?)', [skillName]);
                    skillId = newSkill.insertId;
                }

                await db.execute(`
                    INSERT IGNORE INTO student_skills (student_id, skill_id)
                    VALUES (?, ?)
                `, [studentId, skillId]);
            }
        }

        res.status(200).json({ 
            message: skipLlmEval
                ? "Resume parsed successfully. AI role evaluation is limited to once per day — your earlier score is still active."
                : "Resume uploaded successfully.",
            resume_url: resumeUrl,
            llm_eval_available: !skipLlmEval,
            parse_quality: Math.round(parseQuality * 100),
            resume_parsed: {
                full_name: parsedResume.fullName,
                email: parsedResume.email,
                phone: parsedResume.phone,
                linkedin_url: parsedResume.linkedinUrl,
                github_url: parsedResume.githubUrl,
                inferred_role: inferredRole.role,
                inferred_role_confidence: inferredRole.confidence,
                skills: verifiedSkills,
                sections: parsedResume.sections
            }
        });

    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({ message: "Internal server error while uploading resume." });
    }
};

// Error handling middleware specific for multer errors in this controller
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

const normalizeLineArray = (arr, max = 40) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((x) => String(x || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, max);
};

const normalizeProjectsArray = (arr, maxProjects = 20) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((p) => {
            const title = stripPdfLinkArtifacts(String(p?.title || '').replace(/\s+/g, ' ').trim());
            const bullets = normalizeLineArray(p?.bullets, 10);
            const url = String(p?.url || '').trim();
            if (!title && bullets.length === 0) return null;
            return {
                title: title || 'Project',
                bullets,
                ...(url && /^https?:\/\//i.test(url) ? { url } : {}),
            };
        })
        .filter(Boolean)
        .slice(0, maxProjects);
};

const normalizeCertificationsArray = (arr, max = 40) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((entry) => {
            if (typeof entry === 'string') {
                const label = stripPdfLinkArtifacts(entry.replace(/\s+/g, ' ').trim());
                return label || null;
            }
            const label = stripPdfLinkArtifacts(String(entry?.label || entry?.name || '').replace(/\s+/g, ' ').trim());
            const url = String(entry?.url || '').trim();
            if (!label) return null;
            return url && /^https?:\/\//i.test(url) ? { label, url } : label;
        })
        .filter(Boolean)
        .slice(0, max);
};

const normalizeCustomSections = (arr, maxSections = 10) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((s) => {
            const title = String(s?.title || '').replace(/\s+/g, ' ').trim();
            const lines = normalizeLineArray(s?.lines, 40);
            if (!title) return null;
            return { title, lines };
        })
        .filter(Boolean)
        .slice(0, maxSections);
};

const syncSchoolMarksFromEducation = async (studentId, educationEntries = []) => {
    const ssc = educationEntries.find((e) => e.level === 'ssc');
    const hsc = educationEntries.find((e) => e.level === 'hsc');
    const diploma = educationEntries.find((e) => e.level === 'diploma');
    
    const tenth = ssc?.marks ? parseMarksPercent(ssc.marks) : null;
    const twelfth = hsc?.marks ? parseMarksPercent(hsc.marks) : null;
    const diplomaMarks = diploma?.marks ? parseMarksPercent(diploma.marks) : null;
    
    if (tenth === null && twelfth === null && diplomaMarks === null) return;

    const updates = [];
    const values = [];
    if (tenth !== null) {
        updates.push('tenth_marks = ?');
        values.push(tenth);
    }
    if (twelfth !== null) {
        updates.push('twelfth_marks = ?');
        values.push(twelfth);
    }
    if (diplomaMarks !== null) {
        updates.push('diploma_marks = ?');
        values.push(diplomaMarks);
    }
    
    if (!updates.length) return;

    values.push(studentId);
    await db.execute(`UPDATE students SET ${updates.join(', ')} WHERE user_id = ?`, values);
};

// PUT /api/student/profile/resume-sections
const updateResumeSections = async (req, res) => {
    try {
        const studentId = req.user.id;
        await ensureResumeParsedTable();

        const incoming = req.body?.sections || {};
        const [rows] = await db.execute(
            'SELECT sections_json FROM resume_parsed_data WHERE student_id = ? LIMIT 1',
            [studentId]
        );
        const existingSections = safeJsonValue(rows?.[0]?.sections_json, {});

        const educationBundle = normalizeEducationEntries(
            incoming.education_entries,
            incoming.education
        );

        const mergedSections = {
            ...(existingSections || {}),
            projects: normalizeProjectsArray(incoming.projects),
            experience: normalizeLineArray(incoming.experience, 50),
            extracurricular: normalizeLineArray(incoming.extracurricular, 50),
            education: educationBundle.education,
            education_entries: educationBundle.education_entries,
            certifications: normalizeCertificationsArray(incoming.certifications, 40),
            custom_sections: normalizeCustomSections(incoming.custom_sections, 12),
        };

        await db.execute(
            `
            INSERT INTO resume_parsed_data (student_id, sections_json)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE sections_json = VALUES(sections_json)
            `,
            [studentId, JSON.stringify(mergedSections)]
        );

        await syncSchoolMarksFromEducation(studentId, educationBundle.education_entries);

        return res.status(200).json({
            message: 'Resume sections updated successfully.',
            sections: mergedSections,
        });
    } catch (error) {
        console.error('Error updating resume sections:', error);
        return res.status(500).json({ message: 'Failed to update resume sections.' });
    }
};

// --------------------------------------------------
// AVATAR UPLOAD
// --------------------------------------------------
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarUploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user ? req.user.id : 'unknown';
        const extMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
        };
        const ext = extMap[file.mimetype] || '.jpg';
        cb(null, `avatar-${userId}-${Date.now()}${ext}`);
    }
});

const avatarFileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed!'), false);
    }
};

const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB
});

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const studentId = req.user.id;
        const avatarUrl = toProtectedUploadUrl(req.file.filename, 'avatars');

        // Remove old avatar file if it exists
        const [existing] = await db.execute(
            'SELECT avatar_url FROM student_profiles WHERE student_id = ?',
            [studentId]
        );
        if (existing.length && existing[0].avatar_url) {
            const oldFilename = path.basename(String(existing[0].avatar_url));
            const oldPath = path.join(avatarUploadDir, oldFilename);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await db.execute(
            `INSERT INTO student_profiles (student_id, avatar_url)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)`,
            [studentId, avatarUrl]
        );

        return res.status(200).json({
            message: 'Avatar uploaded successfully.',
            avatar_url: avatarUrl
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        return res.status(500).json({ message: 'Internal server error while uploading avatar.' });
    }
};

// POST /api/student/profile/target-role
const evaluateTargetRole = async (req, res) => {
    try {
        const studentId = req.user.id;
        const sanitizedRole = sanitizeTargetRole(req.body?.target_role);

        if (!sanitizedRole) {
            return res.status(400).json({ message: "target_role is required." });
        }

        await ensureResumeParsedTable();
        const [rows] = await db.execute(
            `SELECT raw_text, skills_json, target_role, target_role_match, missing_skills_for_target, last_llm_eval_at
             FROM resume_parsed_data WHERE student_id = ?`,
            [studentId]
        );

        if (!rows.length || !rows[0].raw_text) {
            return res.status(404).json({ message: "No resume found. Please upload a resume first." });
        }

        const row = rows[0];
        const rawText = row.raw_text;

        if (hadLlmEvalToday(row.last_llm_eval_at)) {
            const cachedMatch = row.target_role_match;
            const cachedRole = row.target_role || sanitizedRole;
            let missingSkills = [];
            try {
                missingSkills = typeof row.missing_skills_for_target === 'string'
                    ? JSON.parse(row.missing_skills_for_target)
                    : (row.missing_skills_for_target || []);
            } catch (_) {
                missingSkills = [];
            }

            return res.status(200).json({
                message: "AI role evaluation is limited to once per day. Showing your most recent evaluation.",
                cached: true,
                llm_eval_available: false,
                evaluation: {
                    target_role_match: cachedMatch,
                    missing_skills: Array.isArray(missingSkills) ? missingSkills : [],
                    feedback: cachedMatch != null
                        ? `Your ${cachedRole} alignment score (${cachedMatch}%) from today's evaluation is still active.`
                        : "You already used today's AI evaluation. Upload again tomorrow for a fresh score.",
                },
            });
        }

        const systemPrompt = `You are a strict technical hiring manager recruiting for a "${sanitizedRole}".
You will be provided with a candidate's resume text.
Evaluate this resume against the standard industry requirements for a "${sanitizedRole}".

You MUST return a JSON object with the following exact structure:
{
  "target_role_match": <integer 0-100 representing the overall fit>,
  "missing_skills": ["skill1", "skill2", "skill3"],
  "feedback": "A short 1-2 sentence constructive feedback on what the candidate should improve for this specific role."
}`;
        
        let llmResult = await aiConfigService.callAI({
            prompt: `Candidate Resume:\n${rawText.slice(0, 6000)}`,
            systemPrompt,
            temperature: 0.1
        });

        let evaluationSource = 'llm';
        if (!llmResult || typeof llmResult.target_role_match !== 'number') {
            console.warn("[evaluateTargetRole] AI call failed or no API key. Using heuristic fallback.");
            evaluationSource = 'heuristic';
            const skills = (() => {
                try { return JSON.parse(row.skills_json || '[]'); } catch (_) { return []; }
            })();
            const skillCount = Array.isArray(skills) ? skills.length : 0;
            llmResult = {
                target_role_match: clamp(Math.round(40 + Math.min(skillCount, 15) * 2.5), 35, 75),
                missing_skills: ["System Design", "Docker", "AWS"],
                feedback: "Automated heuristic score — configure GROQ_API_KEY for full LLM evaluation.",
            };
        }

        const targetRoleMatch = Math.round(clamp(Number(llmResult.target_role_match), 0, 100));

        if (evaluationSource === 'llm') {
            await db.execute(
                `UPDATE resume_parsed_data 
                 SET target_role = ?, target_role_match = ?, missing_skills_for_target = ?, last_llm_eval_at = NOW()
                 WHERE student_id = ?`,
                [
                    sanitizedRole,
                    targetRoleMatch,
                    JSON.stringify(llmResult.missing_skills || []),
                    studentId,
                ]
            );
        } else {
            await db.execute(
                `UPDATE resume_parsed_data 
                 SET target_role = ?, target_role_match = ?, missing_skills_for_target = ?
                 WHERE student_id = ?`,
                [
                    sanitizedRole,
                    targetRoleMatch,
                    JSON.stringify(llmResult.missing_skills || []),
                    studentId,
                ]
            );
        }

        return res.status(200).json({
            message: evaluationSource === 'llm'
                ? "Target role evaluated successfully."
                : "Heuristic score applied — LLM evaluation unavailable.",
            cached: false,
            llm_eval_available: evaluationSource !== 'llm',
            evaluation_source: evaluationSource,
            evaluation: { ...llmResult, target_role_match: targetRoleMatch },
        });

    } catch (error) {
        console.error('Error evaluating target role:', error);
        return res.status(500).json({ message: 'Internal server error during evaluation.' });
    }
};

module.exports = {
    upsertProfile,
    getProfile,
    getDashboardMetrics,
    uploadResume,
    updateResumeSections,
    evaluateTargetRole,
    resumeUploadMiddleware: upload.single('resume'),
    uploadErrorHandler,
    avatarUploadMiddleware: avatarUpload.single('avatar'),
    uploadAvatar
};

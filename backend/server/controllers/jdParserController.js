const db = require('../config/db');
const multer = require('multer');
const pdfParseModule = require('pdf-parse');
const aiConfigService = require('../utils/aiConfigService');
const { getTenantScope } = require('../middleware/institutionScope');

const JD_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

/* ~1,500 tokens — safe headroom within llama-3.1-8b-instant's context window */
const MAX_EXCERPT_CHARS = 6000;

/* ─────────────────────────────────────────────────────────────────────────────
 * PDF
 * ───────────────────────────────────────────────────────────────────────────── */

const parsePdfBuffer = async (buffer) => {
    if (typeof pdfParseModule === 'function') {
        return pdfParseModule(buffer);
    }
    if (pdfParseModule?.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        return { text: result?.text || '' };
    }
    throw new Error('PDF parser is not available on the server.');
};

/* ─────────────────────────────────────────────────────────────────────────────
 * UPLOAD MIDDLEWARE
 * ───────────────────────────────────────────────────────────────────────────── */

const jdUploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: JD_UPLOAD_MAX_BYTES },
    fileFilter: (_req, file, cb) => {
        if (file?.mimetype === 'application/pdf') return cb(null, true);
        return cb(new Error('Only PDF files are allowed.'), false);
    },
}).single('jd');

const jdUploadErrorHandler = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ message: err.message || 'Invalid upload.' });
    }
    return next();
};

/* ─────────────────────────────────────────────────────────────────────────────
 * FILTER NORMALISATION & EXTRACTION
 * ───────────────────────────────────────────────────────────────────────────── */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const normalizeFilters = (raw) => {
    const minCgpa = Number(raw?.minCgpa ?? raw?.cgpa ?? 7);
    const maxBacklogs = Number(raw?.maxBacklogs ?? raw?.backlogs ?? 0);
    const skills = Array.isArray(raw?.skills)
        ? raw.skills.map((s) => String(s).trim()).filter(Boolean).slice(0, 20)
        : [];
    const branches = Array.isArray(raw?.branches)
        ? raw.branches.map((b) => String(b).trim()).filter(Boolean).slice(0, 10)
        : [];

    return {
        cgpa: clamp(Number.isFinite(minCgpa) ? minCgpa : 7, 5, 10),
        backlogs: clamp(Number.isFinite(maxBacklogs) ? maxBacklogs : 0, 0, 10),
        skills,
        branches,
    };
};

/* TODO: load from platform_config so TPOs can extend without a deploy */
const extractFiltersHeuristic = (text) => {
    const t = String(text || '');

    let cgpa = 7;
    const cgpaMatch =
        t.match(/(?:cgpa|gpa)\s*(?:of\s*)?(?:>|>=|at least|minimum|min\.?)\s*(\d(?:\.\d)?)/i) ||
        t.match(/(\d(?:\.\d)?)\s*(?:cgpa|gpa)/i);
    if (cgpaMatch) {
        const n = parseFloat(cgpaMatch[1]);
        if (Number.isFinite(n)) cgpa = clamp(n, 5, 10);
    }

    let backlogs = 0;
    const backlogMatch =
        t.match(/(?:no|zero|0)\s*backlogs?/i) ||
        t.match(/backlogs?\s*(?:allowed|maximum|max\.?|<=?)\s*(\d+)/i) ||
        t.match(/(?:maximum|max\.?)\s*(\d+)\s*backlogs?/i);
    if (/no\s*backlogs?/i.test(t) || /zero\s*backlogs?/i.test(t)) {
        backlogs = 0;
    } else if (backlogMatch?.[1]) {
        backlogs = clamp(parseInt(backlogMatch[1], 10), 0, 10);
    }

    const skillCandidates = [
        'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'SQL',
        'AWS', 'Docker', 'Kubernetes', 'Spring', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL',
        'Machine Learning', 'Data Structures', 'Algorithms',
    ];
    const lower = t.toLowerCase();
    const skills = skillCandidates.filter((s) => lower.includes(s.toLowerCase()));

    const branchCandidates = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'AIML', 'CS'];
    const branches = branchCandidates.filter((b) => new RegExp(`\\b${b}\\b`, 'i').test(t));

    return normalizeFilters({ minCgpa: cgpa, maxBacklogs: backlogs, skills, branches });
};

/* ─────────────────────────────────────────────────────────────────────────────
 * HELPERS
 * ───────────────────────────────────────────────────────────────────────────── */

const isAiConfigured = async () => {
    if (!process.env.GROQ_API_KEY) return false;
    const settings = await aiConfigService.getSettings();
    return Boolean(settings?.model);
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ROUTE HANDLERS
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * GET /api/TPO/jd/stats
 */
const getJdParseStats = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const [rows] = await db.query(
            `SELECT COUNT(*) AS count
             FROM audit_logs al
             JOIN users u ON u.id = al.actor_user_id
             WHERE al.action_type = 'JD_PARSED'
               AND u.institution_id = ?`,
            [scope.institutionId]
        );

        return res.status(200).json({
            parseCount: Number(rows[0]?.count || 0),
            aiConfigured: await isAiConfigured(),
        });
    } catch (error) {
        console.error('getJdParseStats error:', error);
        return res.status(500).json({ message: 'Failed to load JD parser statistics.' });
    }
};

/**
 * POST /api/TPO/jd/parse — multipart field: jd (PDF)
 *
 * Response `source` values:
 *   'ai'          — AI configured and returned a usable result
 *   'ai_fallback' — AI configured but returned nothing usable; heuristic used
 *   'heuristic'   — AI not configured; heuristic was the only option
 */
const parseJobDescription = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        if (!req.file?.buffer) {
            return res.status(400).json({ message: 'A PDF job description file is required.' });
        }

        let parsed;
        try {
            parsed = await parsePdfBuffer(req.file.buffer);
        } catch (err) {
            console.error('parseJobDescription PDF error:', err.message);
            return res.status(422).json({ message: 'Failed to read the PDF file.' });
        }

        const text = String(parsed?.text || '').replace(/\s+/g, ' ').trim();
        if (text.length < 80) {
            return res.status(422).json({
                message:
                    'Could not extract enough text from this PDF. ' +
                    'Use a text-based (not scanned image-only) PDF.',
            });
        }

        if (text.length > MAX_EXCERPT_CHARS) {
            console.warn(
                `parseJobDescription: JD truncated from ${text.length} to ${MAX_EXCERPT_CHARS} chars.`
            );
        }
        const excerpt = text.slice(0, MAX_EXCERPT_CHARS);

        const aiReady = await isAiConfigured();
        let filters = null;
        let source = 'heuristic';

        if (aiReady) {
            try {
                const aiResult = await aiConfigService.callAI({
                    systemPrompt:
                        'You extract campus placement eligibility criteria from job descriptions. ' +
                        'Output only valid JSON with keys minCgpa, maxBacklogs, ' +
                        'skills (array of strings), branches (array of strings). ' +
                        'No explanation, no markdown — raw JSON only.',
                    prompt: `Job description text:\n\n${excerpt}\n\nReturn JSON only.`,
                });

                if (
                    aiResult !== null &&
                    typeof aiResult === 'object' &&
                    !Array.isArray(aiResult) &&
                    (aiResult.minCgpa != null || aiResult.skills?.length)
                ) {
                    filters = normalizeFilters(aiResult);
                    source = 'ai';
                } else {
                    console.warn('parseJobDescription: AI returned unusable result.', { aiResult });
                }
            } catch (aiErr) {
                console.error('parseJobDescription: AI extraction failed.', aiErr.message);
            }
        }

        if (!filters) {
            filters = extractFiltersHeuristic(excerpt);
            source = aiReady ? 'ai_fallback' : 'heuristic';
        }

        try {
            await db.execute(
                `INSERT INTO audit_logs (actor_user_id, action_type, target_table, description)
                 VALUES (?, 'JD_PARSED', 'jd_parser', ?)`,
                [req.user.id, `institution:${scope.institutionId}`]
            );
        } catch (auditErr) {
            console.error('parseJobDescription: Audit log INSERT failed.', auditErr.message);
        }

        return res.status(200).json({
            filters,
            source,
            aiConfigured: aiReady,
        });
    } catch (error) {
        console.error('parseJobDescription error:', error);
        return res.status(500).json({ message: 'Failed to parse job description.' });
    }
};

module.exports = {
    jdUploadMiddleware,
    jdUploadErrorHandler,
    getJdParseStats,
    parseJobDescription,
};
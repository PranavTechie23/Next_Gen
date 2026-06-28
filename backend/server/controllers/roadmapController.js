const db = require('../config/db');
const multer = require('multer');
const pdfParseModule = require('pdf-parse');
const aiConfigService = require('../utils/aiConfigService');

/* ─────────────────────────────────────────────────────────────────────────────
 * UTILITIES
 * ───────────────────────────────────────────────────────────────────────────── */

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const safeJsonValue = (v, fallback) => {
    if (v === null || v === undefined) return fallback;
    if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return fallback; }
    }
    if (typeof v === 'object') return v;
    return fallback;
};

const avg = (...vals) => {
    const nums = vals.filter((v) => Number.isFinite(Number(v))).map(Number);
    if (nums.length === 0) return null;
    return clamp(Math.round(nums.reduce((a, b) => a + b, 0) / nums.length));
};

const toNumOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

/* ─────────────────────────────────────────────────────────────────────────────
 * PDF
 * ───────────────────────────────────────────────────────────────────────────── */

/* FIX (Issue 1): pdfParseModule was imported but uploadAmcatReport called the
 * undefined `pdfParse` — a guaranteed runtime crash on every upload request. */
const parsePdfBuffer = async (buffer) => {
    if (typeof pdfParseModule === 'function') return pdfParseModule(buffer);
    if (pdfParseModule?.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        return { text: result?.text || '' };
    }
    throw new Error('PDF parser unavailable.');
};

/* ─────────────────────────────────────────────────────────────────────────────
 * SCHEMA — run once at startup, not on every request
 *
 * FIX (Issues 2 & 3): The original ran CREATE TABLE IF NOT EXISTS inside every
 * hot-path handler (getRoadmap, getStudentPerformance, upsertStudentPerformance).
 * DDL inside request handlers adds latency on every call and hammers the DB
 * with schema checks under load. Call initSchema() once during app startup instead.
 * ───────────────────────────────────────────────────────────────────────────── */

const initSchema = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS student_performance_metrics (
            student_id        BIGINT PRIMARY KEY,
            amcat_quant       INT            NULL,
            amcat_verbal      INT            NULL,
            amcat_logical     INT            NULL,
            endsem_percentage DECIMAL(5,2)   NULL,
            mock_interview_score INT         NULL,
            coding_test_score INT            NULL,
            updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS resume_parsed_data (
            student_id    BIGINT PRIMARY KEY,
            skills_json   JSON NULL,
            sections_json JSON NULL,
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS roadmap_cache (
            student_id   INT PRIMARY KEY,
            llm_data     JSON,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
};

/* ─────────────────────────────────────────────────────────────────────────────
 * UPLOAD MIDDLEWARE
 * ───────────────────────────────────────────────────────────────────────────── */

const amcatUploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file?.mimetype === 'application/pdf') return cb(null, true);
        return cb(new Error('Only PDF files are allowed.'), false);
    },
}).single('report');

const amcatUploadErrorHandler = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ message: err.message || 'Invalid upload.' });
    }
    return next();
};

/* ─────────────────────────────────────────────────────────────────────────────
 * AMCAT SCORE EXTRACTION
 * ───────────────────────────────────────────────────────────────────────────── */

const extractScoreByLabel = (text, labelRegex) => {
    const re = new RegExp(`${labelRegex.source}[\\s\\S]{0,60}?(\\d{1,3})\\s*\\/\\s*100`, 'i');
    const m = String(text || '').match(re);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? clamp(n, 0, 100) : null;
};

/* ─────────────────────────────────────────────────────────────────────────────
 * DATA ACCESS
 * ───────────────────────────────────────────────────────────────────────────── */

const getStudentPerformance = async (studentId) => {
    const [rows] = await db.execute(
        `SELECT student_id, amcat_quant, amcat_verbal, amcat_logical,
                endsem_percentage, mock_interview_score, coding_test_score
         FROM student_performance_metrics
         WHERE student_id = ?`,
        [studentId]
    );
    return rows[0] ?? null;
};

const upsertStudentPerformance = async (studentId, patch = {}) => {
    /* FIX (Issue 7): endsem_percentage previously bypassed toNumOrNull and used
     * manual null-coalescing without the isFinite guard, unlike every other field. */
    const payload = {
        amcat_quant:          toNumOrNull(patch.amcat_quant),
        amcat_verbal:         toNumOrNull(patch.amcat_verbal),
        amcat_logical:        toNumOrNull(patch.amcat_logical),
        endsem_percentage:    toNumOrNull(patch.endsem_percentage),
        mock_interview_score: toNumOrNull(patch.mock_interview_score),
        coding_test_score:    toNumOrNull(patch.coding_test_score),
    };

    await db.execute(
        `INSERT INTO student_performance_metrics
             (student_id, amcat_quant, amcat_verbal, amcat_logical,
              endsem_percentage, mock_interview_score, coding_test_score)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
             amcat_quant          = VALUES(amcat_quant),
             amcat_verbal         = VALUES(amcat_verbal),
             amcat_logical        = VALUES(amcat_logical),
             endsem_percentage    = VALUES(endsem_percentage),
             mock_interview_score = VALUES(mock_interview_score),
             coding_test_score    = VALUES(coding_test_score)`,
        [
            studentId,
            payload.amcat_quant,
            payload.amcat_verbal,
            payload.amcat_logical,
            payload.endsem_percentage,
            payload.mock_interview_score,
            payload.coding_test_score,
        ]
    );

    return getStudentPerformance(studentId);
};

/* ─────────────────────────────────────────────────────────────────────────────
 * LLM PERSONALIZATION
 * ───────────────────────────────────────────────────────────────────────────── */

const tryLlmPersonalization = async ({ profileRow, resumeParsedRow, performanceRow, computed }) => {
    const sections   = safeJsonValue(resumeParsedRow?.sections_json, {});
    const skills     = safeJsonValue(resumeParsedRow?.skills_json, []);
    const topFocus   = Array.isArray(computed?.summary?.focus)        ? computed.summary.focus.slice(0, 3)        : [];
    const baseTasks  = Array.isArray(computed?.roadmap?.next30Days)   ? computed.roadmap.next30Days.slice(0, 3)   : [];

    const payload = {
        profile: {
            cgpa:     Number(profileRow?.current_cgpa    ?? 0),
            backlogs: Number(profileRow?.active_backlogs ?? 0),
        },
        performance: {
            amcat_quant:          Number(performanceRow?.amcat_quant          ?? 0),
            amcat_verbal:         Number(performanceRow?.amcat_verbal         ?? 0),
            amcat_logical:        Number(performanceRow?.amcat_logical        ?? 0),
            endsem_percentage:    Number(performanceRow?.endsem_percentage    ?? 0),
            mock_interview_score: Number(performanceRow?.mock_interview_score ?? 0),
            coding_test_score:    Number(performanceRow?.coding_test_score    ?? 0),
        },
        resume: {
            skills:                Array.isArray(skills) ? skills.slice(0, 40) : [],
            projects_count:        Array.isArray(sections?.projects)       ? sections.projects.length       : 0,
            experience_count:      Array.isArray(sections?.experience)     ? sections.experience.length     : 0,
            certifications_count:  Array.isArray(sections?.certifications) ? sections.certifications.length : 0,
            achievements_count:    Array.isArray(sections?.achievements)   ? sections.achievements.length   : 0,
        },
        focus:          topFocus,
        baseline_tasks: baseTasks,
    };

    const template = await aiConfigService.getPrompt(
        'roadmap_personalization',
        'You are a placement mentor. Generate exactly 3 personalized actions for this student.\nStudent data: {{data}}'
    );
    const prompt = template.replace('{{data}}', JSON.stringify(payload));

    try {
        const parsed = await aiConfigService.callAI({ prompt });
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

        const recs = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
        return recs
            .slice(0, 3)
            .map((r, idx) => ({
                id:            `llm-${idx + 1}`,
                title:         String(r?.title        || '').slice(0, 90),
                description:   String(r?.description  || '').slice(0, 180),
                category:      String(r?.category     || 'skills'),
                priority:      ['critical', 'high', 'medium'].includes(String(r?.priority || '').toLowerCase())
                                   ? String(r.priority).toLowerCase()
                                   : 'high',
                estimatedTime: String(r?.estimatedTime || '2 weeks'),
                impact:        ['High', 'Medium', 'Low'].includes(String(r?.impact || '')) ? r.impact : 'Medium',
                completion:    clamp(Number(r?.completion ?? 15), 5, 80),
            }))
            .filter((r) => r.title && r.description);
    } catch (err) {
        console.error('[Roadmap] LLM personalization failed:', err.message);
        return null;
    }
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ROADMAP COMPUTATION (rule-based)
 * ───────────────────────────────────────────────────────────────────────────── */

const computeRoadmap = ({ profileRow, resumeParsedRow, performanceRow }) => {
    const sections = safeJsonValue(resumeParsedRow?.sections_json, {});
    const skills   = safeJsonValue(resumeParsedRow?.skills_json, []);

    const skillsCount  = Array.isArray(skills)                  ? skills.length                  : 0;
    const projectsCount = Array.isArray(sections?.projects)     ? sections.projects.length       : 0;
    const expCount      = Array.isArray(sections?.experience)   ? sections.experience.length     : 0;
    const certsCount    = Array.isArray(sections?.certifications)? sections.certifications.length: 0;

    const cgpa       = Number(profileRow?.current_cgpa             ?? 0);
    const backlogs   = Number(profileRow?.active_backlogs          ?? 0);
    const amcatQ     = Number(performanceRow?.amcat_quant          ?? 0);
    const amcatV     = Number(performanceRow?.amcat_verbal         ?? 0);
    const amcatL     = Number(performanceRow?.amcat_logical        ?? 0);
    const endsemPct  = Number(performanceRow?.endsem_percentage    ?? 0);
    const mockScore  = Number(performanceRow?.mock_interview_score ?? 0);
    const codingTest = Number(performanceRow?.coding_test_score    ?? 0);

    const academics      = clamp((cgpa / 10) * 100 - backlogs * 15);
    const portfolio      = clamp(projectsCount * 12 + expCount * 10 + certsCount * 6);
    const skillsMastery  = clamp(100 * (1 - Math.exp(-skillsCount / 12)));
    const aptitude       = clamp((amcatQ + amcatV + amcatL) / 3 || 0);

    const gapAcademics = clamp(100 - Math.max(academics, endsemPct || 0));
    const gapSkills    = clamp(100 - skillsMastery);
    const gapPortfolio = clamp(100 - portfolio);
    const gapAptitude  = clamp(100 - aptitude);
    const gapCoding    = clamp(100 - (codingTest || 0));
    const gapInterview = clamp(100 - (mockScore  || 0));

    const focus = [
        { key: 'academics', score: gapAcademics, title: 'Academics & Consistency' },
        { key: 'skills',    score: gapSkills,    title: 'Core Skills Depth' },
        { key: 'portfolio', score: gapPortfolio, title: 'Projects / Internships Portfolio' },
        { key: 'aptitude',  score: gapAptitude,  title: 'Aptitude (AMCAT)' },
        { key: 'coding',    score: gapCoding,    title: 'Coding Tests (DSA)' },
        { key: 'interview', score: gapInterview, title: 'Interview Readiness' },
    ].sort((a, b) => b.score - a.score);

    const topFocus = focus.slice(0, 3);

    const mkModules = (names) =>
        names.map((name, idx) => ({ name, status: idx === 0 ? 'in-progress' : 'pending' }));

    const trackProgress = (gap) => clamp(100 - gap);

    const tracks = [
        {
            id: 'coding', title: 'Coding & DSA',
            description: 'Improve problem solving + timed contest performance',
            progress: trackProgress(gapCoding), iconKey: 'code',
            modules: mkModules(['Arrays/Strings', 'Recursion', 'Trees/Graphs', 'DP', 'Mock Contests']),
        },
        {
            id: 'aptitude', title: 'Aptitude (AMCAT)',
            description: 'Quant + logical + verbal for screening rounds',
            progress: trackProgress(gapAptitude), iconKey: 'target',
            modules: mkModules(['Quant Basics', 'Logical Reasoning', 'Verbal', 'Timed Sets']),
        },
        {
            id: 'portfolio', title: 'Portfolio (Projects / Internships)',
            description: 'Build proof-of-work to boost shortlist probability',
            progress: trackProgress(gapPortfolio), iconKey: 'briefcase',
            modules: mkModules(['Project 1', 'Project 2', 'Resume Polish', 'LinkedIn/GitHub']),
        },
        {
            id: 'interview', title: 'Interview Prep',
            description: 'Communicate clearly and handle core CS questions',
            progress: trackProgress(gapInterview), iconKey: 'users',
            modules: mkModules(['HR', 'OOP/DBMS/OS', 'System Basics', 'Mock Interviews']),
        },
    ];

    const tasks7  = [];
    const tasks30 = [];
    const tasks90 = [];
    const pushTask = (bucket, t) => bucket.push({ ...t, id: `${t.category}-${bucket.length + 1}` });

    pushTask(tasks7, {
        category: 'portfolio',
        title: 'Update resume with 2 quantified bullets per project',
        reason: 'Boosts shortlist conversion immediately',
        effortHours: 2,
    });
    pushTask(tasks7, {
        category: 'coding',
        title: 'Solve 12 DSA problems (easy/medium mix) + revise patterns',
        reason: 'Build momentum and pattern recognition',
        effortHours: 6,
    });
    if (gapAptitude >= 40) {
        pushTask(tasks7, {
            category: 'aptitude',
            title: 'Take 2 timed AMCAT-style sets (Quant + Logical)',
            reason: 'Your aptitude gap is high; screening rounds need this',
            effortHours: 3,
        });
    }

    const task30Map = {
        academics: { category: 'academics', title: 'Create a weekly end-sem plan (3 subjects) + 2 revision cycles',         reason: 'CGPA/endsem stability directly impacts eligibility',        effortHours: 12 },
        skills:    { category: 'skills',    title: 'Master 1 stack end-to-end and ship a feature',                           reason: 'Depth beats breadth; improves interview confidence',         effortHours: 16 },
        portfolio: { category: 'portfolio', title: 'Ship 1 strong project with README, demo, and tests',                    reason: 'Adds real proof-of-work for shortlists',                     effortHours: 20 },
        aptitude:  { category: 'aptitude',  title: 'Complete a 4-week AMCAT plan (Quant/Logical/Verbal) + weekly mocks',    reason: 'Raises screening pass rate',                                 effortHours: 14 },
        coding:    { category: 'coding',    title: 'Complete 120 problems + 6 timed contests',                              reason: 'Directly improves coding test score',                        effortHours: 24 },
        interview: { category: 'interview', title: 'Do 4 mock interviews (HR + Tech) and document feedback',                reason: 'Closes communication and structure gaps',                    effortHours: 8  },
    };
    topFocus.forEach((f) => {
        if (task30Map[f.key]) pushTask(tasks30, task30Map[f.key]);
    });

    pushTask(tasks90, { category: 'portfolio', title: 'Complete 2 projects + 1 internship/real-client contribution', reason: 'Maximizes placement probability through strong portfolio', effortHours: 60 });
    pushTask(tasks90, { category: 'coding',    title: 'Reach consistent medium/hard solving and do company-tag sets', reason: 'Targets product/company shortlists',                       effortHours: 50 });
    pushTask(tasks90, { category: 'interview', title: 'Build a personal interview playbook (STAR stories + CS notes)', reason: 'Makes interview performance repeatable',                  effortHours: 18 });

    return {
        summary: {
            inputs: {
                cgpa, backlogs, skillsCount, projectsCount, expCount, certsCount,
                amcat: { quant: amcatQ || null, verbal: amcatV || null, logical: amcatL || null },
                endsem_percentage:    endsemPct  || null,
                mock_interview_score: mockScore  || null,
                coding_test_score:    codingTest || null,
            },
            focus: topFocus,
        },
        tracks,
        roadmap: { next7Days: tasks7, next30Days: tasks30, next90Days: tasks90 },
    };
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ROUTE HANDLERS
 * ───────────────────────────────────────────────────────────────────────────── */

/* GET /api/student/roadmap */
exports.getRoadmap = async (req, res) => {
    try {
        const studentId = req.user.id;

        /* FIX (Issue 4): All db.execute calls return [rows, fields]. The original
         * mixed destructuring styles — some inside IIFEs, profile left as the raw
         * tuple. Destructure uniformly here for consistency and clarity. */
        const [
            [profileRows],
            [resumeRows],
            [cacheRows],
            performance,
        ] = await Promise.all([
            db.execute(
                `SELECT user_id AS student_id, current_cgpa, active_backlogs
                 FROM students WHERE user_id = ? LIMIT 1`,
                [studentId]
            ),
            db.execute(
                `SELECT student_id, skills_json, sections_json
                 FROM resume_parsed_data WHERE student_id = ?`,
                [studentId]
            ),
            db.execute(
                `SELECT llm_data, last_updated FROM roadmap_cache WHERE student_id = ?`,
                [studentId]
            ),
            getStudentPerformance(studentId),
        ]);

        const profileRow      = profileRows[0]  ?? null;
        const resumeParsedRow = resumeRows[0]   ?? null;
        const cacheRow        = cacheRows[0]    ?? null;

        const computed = computeRoadmap({ profileRow, resumeParsedRow, performanceRow: performance });

        /* FIX (Issue 5): safeJsonValue already exists in this file — use it
         * consistently instead of an ad-hoc typeof check. */
        const llmRecommendations = cacheRow?.llm_data
            ? safeJsonValue(cacheRow.llm_data, [])
            : [];

        const cacheStale = !cacheRow ||
            (Date.now() - new Date(cacheRow.last_updated).getTime()) > 24 * 60 * 60 * 1000;

        const hasApiKeys = !!(process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY);

        if (hasApiKeys && (llmRecommendations.length === 0 || cacheStale)) {
            /* Background refresh — intentionally not awaited */
            (async () => {
                try {
                    const freshRecs = await tryLlmPersonalization({
                        profileRow, resumeParsedRow, performanceRow: performance, computed,
                    }) ?? [];

                    if (freshRecs.length > 0) {
                        await db.execute(
                            `INSERT INTO roadmap_cache (student_id, llm_data) VALUES (?, ?)
                             ON DUPLICATE KEY UPDATE
                                 llm_data     = VALUES(llm_data),
                                 last_updated = CURRENT_TIMESTAMP`,
                            [studentId, JSON.stringify(freshRecs)]
                        );
                    }
                } catch (bgErr) {
                    console.error(`[Roadmap] Background refresh failed for student ${studentId}:`, bgErr.message);
                }
            })();
        }

        return res.json({
            performance: performance ?? {
                student_id:           studentId,
                amcat_quant:          null,
                amcat_verbal:         null,
                amcat_logical:        null,
                endsem_percentage:    null,
                mock_interview_score: null,
                coding_test_score:    null,
            },
            computed: {
                ...computed,
                llmRecommendations,
                llmPersonalizationEnabled: hasApiKeys,
            },
        });
    } catch (err) {
        console.error('getRoadmap error:', err);
        return res.status(500).json({ message: 'Failed to compute roadmap.' });
    }
};

/* PUT /api/student/performance */
exports.upsertPerformance = async (req, res) => {
    try {
        const updated = await upsertStudentPerformance(req.user.id, req.body ?? {});
        return res.json({ performance: updated });
    } catch (err) {
        console.error('upsertPerformance error:', err);
        return res.status(500).json({ message: 'Failed to update performance metrics.' });
    }
};

/* POST /api/student/performance/amcat-report */
exports.uploadAmcatReport = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!req.file?.buffer) {
            return res.status(400).json({ message: 'AMCAT report PDF file is required.' });
        }

        let parsed;
        try {
            parsed = await parsePdfBuffer(req.file.buffer);
        } catch (err) {
            console.error('uploadAmcatReport PDF error:', err.message);
            return res.status(422).json({ message: 'Failed to read the PDF file.' });
        }

        const text       = String(parsed?.text || '').replace(/\r/g, '\n');
        const firstChunk = text.slice(0, 8000);

        const scores = {
            criticalReasoning:    extractScoreByLabel(firstChunk, /critical\s*reasoning/i),
            cppProgramming:       extractScoreByLabel(firstChunk, /c\+\+\s*programming/i),
            quantitativeAbility:  extractScoreByLabel(firstChunk, /quantitative\s*ability/i),
            englishComprehension: extractScoreByLabel(firstChunk, /english\s*comprehension/i),
            logicalAbility:       extractScoreByLabel(firstChunk, /logical\s*ability/i),
            automata:             extractScoreByLabel(firstChunk, /automata/i),
            managerialInbasket:   extractScoreByLabel(firstChunk, /managerial\s*in-?basket\s*simulation/i),
        };

        if (Object.values(scores).every((v) => v === null)) {
            return res.status(422).json({
                message: 'Could not detect AMCAT section scores from this PDF. Please upload a report with visible score tiles.',
            });
        }

        const patch = {
            amcat_quant:          scores.quantitativeAbility,
            amcat_verbal:         scores.englishComprehension,
            amcat_logical:        avg(scores.logicalAbility, scores.criticalReasoning),
            coding_test_score:    avg(scores.cppProgramming, scores.automata),
            mock_interview_score: scores.managerialInbasket,
        };

        const updated = await upsertStudentPerformance(studentId, patch);

        return res.json({
            message:             'AMCAT report parsed and performance updated.',
            extracted_scores:    scores,
            mapped_performance:  patch,
            performance:         updated,
        });
    } catch (err) {
        console.error('uploadAmcatReport error:', err);
        return res.status(500).json({ message: 'Failed to parse AMCAT report.' });
    }
};

exports.initSchema            = initSchema;
exports.amcatUploadMiddleware = amcatUploadMiddleware;
exports.amcatUploadErrorHandler = amcatUploadErrorHandler;
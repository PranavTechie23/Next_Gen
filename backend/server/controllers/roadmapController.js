const db = require('../config/db');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const safeJsonValue = (v, fallback) => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }
  if (typeof v === 'object') return v;
  return fallback;
};

const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

// Optional Llama providers (free/low-cost):
// - GROQ (recommended): set GROQ_API_KEY
// - OpenRouter: set OPENROUTER_API_KEY + (optional) OPENROUTER_MODEL
const openRouterModel = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

const tryGroqPersonalization = async ({ profileRow, resumeParsedRow, performanceRow, computed }) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const sections = safeJsonValue(resumeParsedRow?.sections_json, {});
  const skills = safeJsonValue(resumeParsedRow?.skills_json, []);
  const topFocus = Array.isArray(computed?.summary?.focus) ? computed.summary.focus.slice(0, 3) : [];
  const defaultTasks = Array.isArray(computed?.roadmap?.next30Days) ? computed.roadmap.next30Days.slice(0, 3) : [];

  const payload = {
    profile: {
      cgpa: Number(profileRow?.current_cgpa ?? 0),
      backlogs: Number(profileRow?.active_backlogs ?? 0),
    },
    performance: {
      amcat_quant: Number(performanceRow?.amcat_quant ?? 0),
      amcat_verbal: Number(performanceRow?.amcat_verbal ?? 0),
      amcat_logical: Number(performanceRow?.amcat_logical ?? 0),
      endsem_percentage: Number(performanceRow?.endsem_percentage ?? 0),
      mock_interview_score: Number(performanceRow?.mock_interview_score ?? 0),
      coding_test_score: Number(performanceRow?.coding_test_score ?? 0),
    },
    resume: {
      skills: Array.isArray(skills) ? skills.slice(0, 40) : [],
      projects_count: Array.isArray(sections?.projects) ? sections.projects.length : 0,
      experience_count: Array.isArray(sections?.experience) ? sections.experience.length : 0,
      certifications_count: Array.isArray(sections?.certifications) ? sections.certifications.length : 0,
      achievements_count: Array.isArray(sections?.achievements) ? sections.achievements.length : 0,
    },
    focus: topFocus,
    baseline_tasks: defaultTasks,
  };

  const prompt = `
You are a placement mentor. Generate exactly 3 personalized actions for this student.
Return strict JSON with this schema:
{
  "recommendations": [
    {
      "title": "string (max 90 chars)",
      "description": "string (max 180 chars)",
      "category": "coding|aptitude|interview|portfolio|academics|skills",
      "priority": "critical|high|medium",
      "estimatedTime": "string like 1 week / 4 weeks",
      "impact": "High|Medium|Low",
      "completion": number (10-60)
    }
  ]
}
Rules:
- No generic advice; tie to input profile and gaps.
- Keep language concise and actionable.
- Do not include markdown.
Student data:
${JSON.stringify(payload)}
  `.trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You output only valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    const recs = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
    const normalized = recs
      .slice(0, 3)
      .map((r, idx) => ({
        id: `llm-${idx + 1}`,
        title: String(r?.title || '').slice(0, 90),
        description: String(r?.description || '').slice(0, 180),
        category: String(r?.category || 'skills'),
        priority: ['critical', 'high', 'medium'].includes(String(r?.priority || '').toLowerCase())
          ? String(r.priority).toLowerCase()
          : 'high',
        estimatedTime: String(r?.estimatedTime || '2 weeks'),
        impact: ['High', 'Medium', 'Low'].includes(String(r?.impact || '')) ? r.impact : 'Medium',
        completion: clamp(Number(r?.completion ?? 15), 5, 80),
      }))
      .filter((r) => r.title && r.description);

    return normalized.length > 0 ? normalized : null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const tryOpenRouterPersonalization = async ({ profileRow, resumeParsedRow, performanceRow, computed }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const sections = safeJsonValue(resumeParsedRow?.sections_json, {});
  const skills = safeJsonValue(resumeParsedRow?.skills_json, []);
  const topFocus = Array.isArray(computed?.summary?.focus) ? computed.summary.focus.slice(0, 3) : [];
  const defaultTasks = Array.isArray(computed?.roadmap?.next30Days) ? computed.roadmap.next30Days.slice(0, 3) : [];

  const payload = {
    profile: {
      cgpa: Number(profileRow?.current_cgpa ?? 0),
      backlogs: Number(profileRow?.active_backlogs ?? 0),
    },
    performance: {
      amcat_quant: Number(performanceRow?.amcat_quant ?? 0),
      amcat_verbal: Number(performanceRow?.amcat_verbal ?? 0),
      amcat_logical: Number(performanceRow?.amcat_logical ?? 0),
      endsem_percentage: Number(performanceRow?.endsem_percentage ?? 0),
      mock_interview_score: Number(performanceRow?.mock_interview_score ?? 0),
      coding_test_score: Number(performanceRow?.coding_test_score ?? 0),
    },
    resume: {
      skills: Array.isArray(skills) ? skills.slice(0, 40) : [],
      projects_count: Array.isArray(sections?.projects) ? sections.projects.length : 0,
      experience_count: Array.isArray(sections?.experience) ? sections.experience.length : 0,
      certifications_count: Array.isArray(sections?.certifications) ? sections.certifications.length : 0,
      achievements_count: Array.isArray(sections?.achievements) ? sections.achievements.length : 0,
    },
    focus: topFocus,
    baseline_tasks: defaultTasks,
  };

  const prompt = `
You are a placement mentor. Generate exactly 3 personalized actions for this student.
Return strict JSON with this schema:
{
  "recommendations": [
    {
      "title": "string (max 90 chars)",
      "description": "string (max 180 chars)",
      "category": "coding|aptitude|interview|portfolio|academics|skills",
      "priority": "critical|high|medium",
      "estimatedTime": "string like 1 week / 4 weeks",
      "impact": "High|Medium|Low",
      "completion": number (10-60)
    }
  ]
}
Rules:
- No generic advice; tie to input profile and gaps.
- Keep language concise and actionable.
- Do not include markdown.
Student data:
${JSON.stringify(payload)}
  `.trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optional but recommended by OpenRouter
        'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'campus-career-platform',
      },
      body: JSON.stringify({
        model: openRouterModel,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You output only valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    const recs = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
    const normalized = recs
      .slice(0, 3)
      .map((r, idx) => ({
        id: `llm-${idx + 1}`,
        title: String(r?.title || '').slice(0, 90),
        description: String(r?.description || '').slice(0, 180),
        category: String(r?.category || 'skills'),
        priority: ['critical', 'high', 'medium'].includes(String(r?.priority || '').toLowerCase())
          ? String(r.priority).toLowerCase()
          : 'high',
        estimatedTime: String(r?.estimatedTime || '2 weeks'),
        impact: ['High', 'Medium', 'Low'].includes(String(r?.impact || '')) ? r.impact : 'Medium',
        completion: clamp(Number(r?.completion ?? 15), 5, 80),
      }))
      .filter((r) => r.title && r.description);

    return normalized.length > 0 ? normalized : null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const ensureStudentPerformanceTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS student_performance_metrics (
      student_id BIGINT PRIMARY KEY,
      amcat_quant INT NULL,
      amcat_verbal INT NULL,
      amcat_logical INT NULL,
      endsem_percentage DECIMAL(5,2) NULL,
      mock_interview_score INT NULL,
      coding_test_score INT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const ensureResumeParsedDataTable = async () => {
  // Roadmap reads resume_parsed_data; ensure it exists even if resume was never uploaded.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS resume_parsed_data (
      student_id BIGINT PRIMARY KEY,
      skills_json JSON NULL,
      sections_json JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const getStudentPerformance = async (studentId) => {
  await ensureStudentPerformanceTable();
  const [rows] = await db.execute(
    `SELECT student_id, amcat_quant, amcat_verbal, amcat_logical, endsem_percentage, mock_interview_score, coding_test_score
     FROM student_performance_metrics
     WHERE student_id = ?`,
    [studentId]
  );
  return rows && rows[0] ? rows[0] : null;
};

const upsertStudentPerformance = async (studentId, patch = {}) => {
  await ensureStudentPerformanceTable();

  const toNumOrNull = (v) => {
    if (v === '' || v === undefined) return null;
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const payload = {
    amcat_quant: toNumOrNull(patch.amcat_quant),
    amcat_verbal: toNumOrNull(patch.amcat_verbal),
    amcat_logical: toNumOrNull(patch.amcat_logical),
    endsem_percentage: patch.endsem_percentage === '' ? null : (patch.endsem_percentage ?? null),
    mock_interview_score: toNumOrNull(patch.mock_interview_score),
    coding_test_score: toNumOrNull(patch.coding_test_score),
  };

  await db.execute(
    `
      INSERT INTO student_performance_metrics
        (student_id, amcat_quant, amcat_verbal, amcat_logical, endsem_percentage, mock_interview_score, coding_test_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        amcat_quant = VALUES(amcat_quant),
        amcat_verbal = VALUES(amcat_verbal),
        amcat_logical = VALUES(amcat_logical),
        endsem_percentage = VALUES(endsem_percentage),
        mock_interview_score = VALUES(mock_interview_score),
        coding_test_score = VALUES(coding_test_score)
    `,
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

const amcatUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file?.mimetype === 'application/pdf') return cb(null, true);
    return cb(new Error('Only PDF files are allowed.'), false);
  },
}).single('report');

const amcatUploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message || 'Invalid upload.' });
  }
  return next();
};

const extractScoreByLabel = (text, labelRegex) => {
  const t = String(text || '');
  const re = new RegExp(`${labelRegex.source}[\\s\\S]{0,60}?(\\d{1,3})\\s*\\/\\s*100`, 'i');
  const m = t.match(re);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? clamp(n, 0, 100) : null;
};

const avg = (...vals) => {
  const nums = vals.filter((v) => Number.isFinite(Number(v))).map((v) => Number(v));
  if (nums.length === 0) return null;
  return clamp(Math.round(nums.reduce((a, b) => a + b, 0) / nums.length), 0, 100);
};

const computeRoadmap = ({ profileRow, resumeParsedRow, performanceRow }) => {
  const sections = safeJsonValue(resumeParsedRow?.sections_json, {});
  const skills = safeJsonValue(resumeParsedRow?.skills_json, []);

  const skillsCount = Array.isArray(skills) ? skills.length : 0;
  const projectsCount = Array.isArray(sections?.projects) ? sections.projects.length : 0;
  const expCount = Array.isArray(sections?.experience) ? sections.experience.length : 0;
  const certsCount = Array.isArray(sections?.certifications) ? sections.certifications.length : 0;

  const cgpa = Number(profileRow?.current_cgpa ?? 0);
  const backlogs = Number(profileRow?.active_backlogs ?? 0);

  const amcatQ = Number(performanceRow?.amcat_quant ?? 0);
  const amcatV = Number(performanceRow?.amcat_verbal ?? 0);
  const amcatL = Number(performanceRow?.amcat_logical ?? 0);
  const endsemPct = Number(performanceRow?.endsem_percentage ?? 0);
  const mockInterview = Number(performanceRow?.mock_interview_score ?? 0);
  const codingTest = Number(performanceRow?.coding_test_score ?? 0);

  // Normalize scores (assume 0-100 where applicable; AMCAT often varies, but we treat as 0-100 input in v1 UI)
  const academics = clamp((cgpa / 10) * 100 - backlogs * 15);
  const portfolio = clamp(projectsCount * 12 + expCount * 10 + certsCount * 6);
  const skillsMastery = clamp(100 * (1 - Math.exp(-skillsCount / 12)));
  const aptitude = clamp((amcatQ + amcatV + amcatL) / 3 || 0);
  const interview = clamp(mockInterview || 0);
  const coding = clamp(codingTest || 0);

  // Gap scores: higher = needs more focus
  const gapAcademics = clamp(100 - Math.max(academics, endsemPct || 0));
  const gapSkills = clamp(100 - skillsMastery);
  const gapPortfolio = clamp(100 - portfolio);
  const gapAptitude = clamp(100 - aptitude);
  const gapCoding = clamp(100 - coding);
  const gapInterview = clamp(100 - interview);

  const focus = [
    { key: 'academics', score: gapAcademics, title: 'Academics & Consistency' },
    { key: 'skills', score: gapSkills, title: 'Core Skills Depth' },
    { key: 'portfolio', score: gapPortfolio, title: 'Projects / Internships Portfolio' },
    { key: 'aptitude', score: gapAptitude, title: 'Aptitude (AMCAT)' },
    { key: 'coding', score: gapCoding, title: 'Coding Tests (DSA)' },
    { key: 'interview', score: gapInterview, title: 'Interview Readiness' },
  ].sort((a, b) => b.score - a.score);

  const topFocus = focus.slice(0, 3);

  const mkModules = (names) =>
    names.map((name, idx) => ({
      name,
      status: idx === 0 ? 'in-progress' : 'pending',
    }));

  // Progress is inverse of gap, but keep sane defaults if missing scores.
  const trackProgress = (gap) => clamp(100 - gap);

  const tracks = [
    {
      id: 'coding',
      title: 'Coding & DSA',
      description: 'Improve problem solving + timed contest performance',
      progress: trackProgress(gapCoding),
      iconKey: 'code',
      modules: mkModules(['Arrays/Strings', 'Recursion', 'Trees/Graphs', 'DP', 'Mock Contests']),
    },
    {
      id: 'aptitude',
      title: 'Aptitude (AMCAT)',
      description: 'Quant + logical + verbal for screening rounds',
      progress: trackProgress(gapAptitude),
      iconKey: 'target',
      modules: mkModules(['Quant Basics', 'Logical Reasoning', 'Verbal', 'Timed Sets']),
    },
    {
      id: 'portfolio',
      title: 'Portfolio (Projects / Internships)',
      description: 'Build proof-of-work to boost shortlist probability',
      progress: trackProgress(gapPortfolio),
      iconKey: 'briefcase',
      modules: mkModules(['Project 1', 'Project 2', 'Resume Polish', 'LinkedIn/GitHub']),
    },
    {
      id: 'interview',
      title: 'Interview Prep',
      description: 'Communicate clearly and handle core CS questions',
      progress: trackProgress(gapInterview),
      iconKey: 'users',
      modules: mkModules(['HR', 'OOP/DBMS/OS', 'System Basics', 'Mock Interviews']),
    },
  ];

  const tasks7 = [];
  const tasks30 = [];
  const tasks90 = [];

  const pushTask = (bucket, t) => bucket.push({ ...t, id: `${t.category}-${bucket.length + 1}` });

  // Always include quick wins
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

  // 30 day: focus top gaps
  topFocus.forEach((f) => {
    if (f.key === 'academics') {
      pushTask(tasks30, {
        category: 'academics',
        title: 'Create a weekly end-sem plan (3 subjects) + 2 revision cycles',
        reason: 'CGPA/endsem stability directly impacts eligibility',
        effortHours: 12,
      });
    }
    if (f.key === 'skills') {
      pushTask(tasks30, {
        category: 'skills',
        title: 'Master 1 stack end-to-end (frontend/back/backend/db) and ship a feature',
        reason: 'Depth beats breadth; improves interview confidence',
        effortHours: 16,
      });
    }
    if (f.key === 'portfolio') {
      pushTask(tasks30, {
        category: 'portfolio',
        title: 'Ship 1 strong project with README, demo, and tests',
        reason: 'Adds real proof-of-work for shortlists',
        effortHours: 20,
      });
    }
    if (f.key === 'aptitude') {
      pushTask(tasks30, {
        category: 'aptitude',
        title: 'Complete a 4-week AMCAT plan (Quant/Logical/Verbal) + weekly mocks',
        reason: 'Raises screening pass rate',
        effortHours: 14,
      });
    }
    if (f.key === 'coding') {
      pushTask(tasks30, {
        category: 'coding',
        title: 'Complete 120 problems + 6 timed contests',
        reason: 'Directly improves coding test score',
        effortHours: 24,
      });
    }
    if (f.key === 'interview') {
      pushTask(tasks30, {
        category: 'interview',
        title: 'Do 4 mock interviews (HR + Tech) and document feedback',
        reason: 'Closes communication and structure gaps',
        effortHours: 8,
      });
    }
  });

  // 90 day: build long-term assets
  pushTask(tasks90, {
    category: 'portfolio',
    title: 'Complete 2 projects + 1 internship/real-client contribution',
    reason: 'Maximizes placement probability through strong portfolio',
    effortHours: 60,
  });
  pushTask(tasks90, {
    category: 'coding',
    title: 'Reach consistent medium/hard solving and do company-tag sets',
    reason: 'Targets product/company shortlists',
    effortHours: 50,
  });
  pushTask(tasks90, {
    category: 'interview',
    title: 'Build a personal interview playbook (STAR stories + CS notes)',
    reason: 'Makes interview performance repeatable',
    effortHours: 18,
  });

  const summary = {
    inputs: {
      cgpa,
      backlogs,
      skillsCount,
      projectsCount,
      expCount,
      certsCount,
      amcat: { quant: amcatQ || null, verbal: amcatV || null, logical: amcatL || null },
      endsem_percentage: endsemPct || null,
      mock_interview_score: mockInterview || null,
      coding_test_score: codingTest || null,
    },
    focus: topFocus,
  };

  return {
    summary,
    tracks,
    roadmap: {
      next7Days: tasks7,
      next30Days: tasks30,
      next90Days: tasks90,
    },
  };
};

// GET /api/student/roadmap
exports.getRoadmap = async (req, res) => {
  try {
    const studentId = req.user.id;

    const performance = await getStudentPerformance(studentId);

    // Academics/backlogs are stored on `students` (see studentProfileController.getProfile join).
    const [profileRows] = await db.execute(
      `SELECT user_id AS student_id, current_cgpa, active_backlogs
       FROM students
       WHERE user_id = ?
       LIMIT 1`,
      [studentId]
    );
    const profileRow = profileRows && profileRows[0] ? profileRows[0] : null;

    await ensureResumeParsedDataTable();
    const [resumeRows] = await db.execute(
      `SELECT student_id, skills_json, sections_json
       FROM resume_parsed_data
       WHERE student_id = ?`,
      [studentId]
    );
    const resumeParsedRow = resumeRows && resumeRows[0] ? resumeRows[0] : null;

    const computed = computeRoadmap({ profileRow, resumeParsedRow, performanceRow: performance });
    const llmRecommendations =
      (await tryGroqPersonalization({ profileRow, resumeParsedRow, performanceRow: performance, computed })) ||
      (await tryOpenRouterPersonalization({ profileRow, resumeParsedRow, performanceRow: performance, computed })) ||
      [];

    return res.json({
      performance: performance || {
        student_id: studentId,
        amcat_quant: null,
        amcat_verbal: null,
        amcat_logical: null,
        endsem_percentage: null,
        mock_interview_score: null,
        coding_test_score: null,
      },
      computed: {
        ...computed,
        llmRecommendations,
        llmPersonalizationEnabled: !!process.env.GROQ_API_KEY || !!process.env.OPENROUTER_API_KEY,
      },
    });
  } catch (err) {
    console.error('getRoadmap error', err);
    return res.status(500).json({ message: 'Failed to compute roadmap' });
  }
};

// PUT /api/student/performance
exports.upsertPerformance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const updated = await upsertStudentPerformance(studentId, req.body || {});
    return res.json({ performance: updated });
  } catch (err) {
    console.error('upsertPerformance error', err);
    return res.status(500).json({ message: 'Failed to update performance metrics' });
  }
};

// POST /api/student/performance/amcat-report
exports.uploadAmcatReport = async (req, res) => {
  try {
    const studentId = req.user.id;
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'AMCAT report PDF file is required.' });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = String(parsed?.text || '').replace(/\r/g, '\n');
    const firstChunk = text.slice(0, 8000); // score grid is usually on first page/header

    const scores = {
      criticalReasoning: extractScoreByLabel(firstChunk, /critical\s*reasoning/i),
      cppProgramming: extractScoreByLabel(firstChunk, /c\+\+\s*programming/i),
      quantitativeAbility: extractScoreByLabel(firstChunk, /quantitative\s*ability/i),
      englishComprehension: extractScoreByLabel(firstChunk, /english\s*comprehension/i),
      logicalAbility: extractScoreByLabel(firstChunk, /logical\s*ability/i),
      automata: extractScoreByLabel(firstChunk, /automata/i),
      managerialInbasket: extractScoreByLabel(firstChunk, /managerial\s*in-?basket\s*simulation/i),
    };

    const patch = {
      amcat_quant: scores.quantitativeAbility,
      amcat_verbal: scores.englishComprehension,
      amcat_logical: avg(scores.logicalAbility, scores.criticalReasoning),
      coding_test_score: avg(scores.cppProgramming, scores.automata),
      mock_interview_score: scores.managerialInbasket,
    };

    const foundCount = Object.values(scores).filter((v) => v !== null).length;
    if (foundCount === 0) {
      return res.status(422).json({
        message: 'Could not detect AMCAT section scores from this PDF. Please upload a report with visible score tiles.',
      });
    }

    const updated = await upsertStudentPerformance(studentId, patch);
    return res.json({
      message: 'AMCAT report parsed and performance updated.',
      extracted_scores: scores,
      mapped_performance: patch,
      performance: updated,
    });
  } catch (err) {
    console.error('uploadAmcatReport error', err);
    return res.status(500).json({ message: 'Failed to parse AMCAT report.' });
  }
};

exports.amcatUploadMiddleware = amcatUploadMiddleware;
exports.amcatUploadErrorHandler = amcatUploadErrorHandler;


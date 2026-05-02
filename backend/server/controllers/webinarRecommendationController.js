const db = require('../config/db');

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const normalize = (s) => String(s || '').toLowerCase();

const KEYWORD_TOPIC_MAP = [
  { topic: 'DSA / Coding', keywords: ['dsa', 'leetcode', 'algorithm', 'data structure', 'arrays', 'dp', 'graphs', 'coding'] },
  { topic: 'Aptitude / AMCAT', keywords: ['aptitude', 'amcat', 'quant', 'reasoning', 'verbal'] },
  { topic: 'DBMS / SQL', keywords: ['dbms', 'sql', 'database', 'normalization', 'index', 'transaction'] },
  { topic: 'OS / CN', keywords: ['operating system', 'os', 'computer networks', 'cn', 'tcp', 'http'] },
  { topic: 'System Design', keywords: ['system design', 'scalability', 'distributed', 'load balancer', 'cache'] },
  { topic: 'Web Dev (Frontend)', keywords: ['react', 'frontend', 'javascript', 'css', 'html', 'next.js'] },
  { topic: 'Backend', keywords: ['node', 'express', 'api', 'backend', 'microservices'] },
  { topic: 'Resume / Projects', keywords: ['resume', 'portfolio', 'project', 'github', 'linkedin'] },
  { topic: 'Interview Prep', keywords: ['interview', 'hr', 'mock', 'behavioral', 'communication'] },
];

const inferTopicsFromSignals = (signals) => {
  const topics = [];
  const push = (topic, score, reason) => topics.push({ topic, score, reason });

  if ((signals.avgCgpa ?? 0) < 6.5) push('Academics consistency', 60, 'Low average CGPA');
  if ((signals.backlogsCount ?? 0) > 0) push('Academics consistency', 70, 'Many students have backlogs');
  if ((signals.resumeMissingCount ?? 0) > 0) push('Resume / Projects', 75, 'Many students have not uploaded resumes');
  if ((signals.lowSkillsCount ?? 0) > 0) push('DSA / Coding', 65, 'Many students have low skills count');

  // Always recommend baseline placement topics
  push('Interview Prep', 55, 'Always beneficial for placements');
  push('Aptitude / AMCAT', 50, 'Screening rounds need aptitude');
  push('DBMS / SQL', 45, 'Core CS topic used in interviews');

  // De-duplicate by topic keeping max score
  const best = new Map();
  for (const t of topics) {
    const existing = best.get(t.topic);
    if (!existing || existing.score < t.score) best.set(t.topic, t);
  }
  return Array.from(best.values()).sort((a, b) => b.score - a.score).slice(0, 6);
};

const scoreWebinar = (webinar, targetTopics) => {
  const text = normalize(`${webinar.title} ${webinar.speaker_name || ''} ${webinar.summary || ''}`);
  let score = 0;
  const reasons = [];

  for (const t of targetTopics) {
    const map = KEYWORD_TOPIC_MAP.find((m) => m.topic === t.topic);
    if (!map) continue;
    const hit = map.keywords.some((k) => text.includes(normalize(k)));
    if (hit) {
      score += t.score;
      reasons.push(`Matches ${t.topic}`);
    }
  }

  // boost upcoming sooner webinars
  if (webinar.starts_at) {
    const dt = new Date(webinar.starts_at);
    const days = (dt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (Number.isFinite(days) && days >= 0) {
      score += clamp(20 - days, 0, 20);
    }
  }

  return { score, reasons: Array.from(new Set(reasons)) };
};

// GET /api/dept/webinars/recommendations
exports.getDeptWebinarRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [headRows] = await db.execute('SELECT department_id FROM tpo_heads WHERE user_id = ?', [userId]);
    if (!headRows?.length) {
      return res.status(403).json({ message: 'Access denied. Not a valid department head.' });
    }
    const deptId = headRows[0].department_id;

    // Signals from department students
    let hasResumeParsed = true;
    try {
      await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
    } catch {
      hasResumeParsed = false;
    }

    const [studentRows] = await db.execute(
      `
      SELECT
        s.user_id,
        s.current_cgpa,
        s.active_backlogs,
        (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS manual_skills_count,
        ${hasResumeParsed ? `COALESCE((SELECT JSON_LENGTH(rp.skills_json) FROM resume_parsed_data rp WHERE rp.student_id = s.user_id), 0)` : '0'} AS resume_skills_count,
        (SELECT CASE WHEN sp.resume_url IS NULL OR sp.resume_url = '' THEN 1 ELSE 0 END FROM student_profiles sp WHERE sp.student_id = s.user_id LIMIT 1) AS resume_missing
      FROM students s
      WHERE s.department_id = ?
      `,
      [deptId]
    );

    const total = studentRows.length || 0;
    const avgCgpa = total > 0 ? studentRows.reduce((a, r) => a + Number(r.current_cgpa || 0), 0) / total : 0;
    const backlogsCount = studentRows.filter((r) => Number(r.active_backlogs || 0) > 0).length;
    const resumeMissingCount = studentRows.filter((r) => Number(r.resume_missing || 0) === 1).length;
    const lowSkillsCount = studentRows.filter((r) => (Number(r.manual_skills_count || 0) + Number(r.resume_skills_count || 0)) < 5).length;

    const signals = { totalStudents: total, avgCgpa, backlogsCount, resumeMissingCount, lowSkillsCount };
    const targetTopics = inferTopicsFromSignals(signals);

    const [webinarRows] = await db.execute(
      `SELECT id, title, summary, speaker_name, starts_at, meeting_link AS link
       FROM webinars
       WHERE starts_at >= NOW()
         AND status IN ('PUBLISHED', 'COMPLETED')
       ORDER BY starts_at ASC
       LIMIT 100`
    );

    const scored = (webinarRows || [])
      .map((w) => {
        const s = scoreWebinar(w, targetTopics);
        return { ...w, score: s.score, matchReasons: s.reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // If no webinars exist, return suggested topics so TPO can schedule them.
    const suggestedTopics = targetTopics.map((t) => ({
      topic: t.topic,
      priority: t.score,
      reason: t.reason,
    }));

    return res.json({
      department_id: deptId,
      signals,
      targetTopics,
      recommendations: scored,
      suggestedTopics,
    });
  } catch (e) {
    console.error('getDeptWebinarRecommendations error', e);
    return res.status(500).json({ message: 'Failed to generate webinar recommendations' });
  }
};


const db = require('../config/db');

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const toCsv = (rows) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const headerSet = new Set();
  safeRows.forEach((r) => Object.keys(r || {}).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);

  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [];
  lines.push(headers.map(esc).join(','));
  for (const r of safeRows) {
    const line = headers.map((h) => esc(r?.[h]));
    lines.push(line.join(','));
  }
  return lines.join('\n');
};

const sendReport = (req, res, filenameBase, payload) => {
  const format = String(req.query.format || 'json').toLowerCase();
  if (format === 'csv') {
    const csv = toCsv(payload?.rows || payload || []);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
    return res.status(200).send(csv);
  }
  return res.status(200).json(payload);
};

// GET /api/admin/reports/placement
exports.getPlacementReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        YEAR(a.applied_at) AS year,
        COUNT(*) AS total_applications,
        COUNT(DISTINCT a.student_id) AS unique_applicants,
        COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS selected_students,
        ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avg_selected_ctc_lpa,
        ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS max_selected_ctc_lpa
      FROM applications a
      JOIN job_postings jp ON a.job_id = jp.id
      GROUP BY YEAR(a.applied_at)
      ORDER BY year DESC
    `);

    return sendReport(req, res, 'placement_report', { rows });
  } catch (e) {
    console.error('getPlacementReport error', e);
    return res.status(500).json({ message: 'Failed to generate placement report' });
  }
};

// GET /api/admin/reports/branch-performance
exports.getBranchPerformanceReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        d.name AS department,
        COUNT(DISTINCT s.user_id) AS total_students,
        COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS selected_students,
        ROUND(AVG(s.current_cgpa), 2) AS avg_cgpa,
        SUM(CASE WHEN s.active_backlogs > 0 THEN 1 ELSE 0 END) AS students_with_backlogs
      FROM departments d
      LEFT JOIN students s ON s.department_id = d.id
      LEFT JOIN applications a ON a.student_id = s.user_id
      GROUP BY d.id
      ORDER BY total_students DESC
    `);

    const rowsWithRate = (rows || []).map((r) => {
      const total = Number(r.total_students || 0);
      const selected = Number(r.selected_students || 0);
      const rate = total > 0 ? (selected / total) * 100 : 0;
      return { ...r, placement_rate_pct: Number(rate.toFixed(2)) };
    });

    return sendReport(req, res, 'branch_performance', { rows: rowsWithRate });
  } catch (e) {
    console.error('getBranchPerformanceReport error', e);
    return res.status(500).json({ message: 'Failed to generate branch performance report' });
  }
};

// GET /api/admin/reports/company-analysis
exports.getCompanyAnalysisReport = async (req, res) => {
  try {
    // Prefer company_hiring_stats if present, fallback to applications-based rollup.
    let hasCompanyStatsTable = true;
    try {
      await db.query(`SELECT 1 FROM company_hiring_stats LIMIT 1`);
    } catch {
      hasCompanyStatsTable = false;
    }

    if (hasCompanyStatsTable) {
      const [rows] = await db.query(`
        SELECT
          company_name AS company,
          year,
          COALESCE(role, 'Unknown') AS role,
          ROUND(AVG(ctc_lpa), 2) AS avg_ctc_lpa,
          SUM(selected_count) AS selected_count
        FROM company_hiring_stats
        GROUP BY company_name, year, COALESCE(role, 'Unknown')
        ORDER BY year DESC, selected_count DESC
      `);
      return sendReport(req, res, 'company_analysis', { rows });
    }

    const [rows] = await db.query(`
      SELECT
        r.company_name AS company,
        YEAR(a.applied_at) AS year,
        jp.job_title AS role,
        ROUND(AVG(jp.package_value), 2) AS avg_ctc_lpa,
        COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS selected_count
      FROM applications a
      JOIN job_postings jp ON a.job_id = jp.id
      JOIN recruitment_drives rd ON jp.drive_id = rd.id
      JOIN recruiters r ON rd.recruiter_id = r.id
      WHERE a.status = 'SELECTED'
      GROUP BY r.company_name, YEAR(a.applied_at), jp.job_title
      ORDER BY year DESC, selected_count DESC
    `);

    return sendReport(req, res, 'company_analysis', { rows });
  } catch (e) {
    console.error('getCompanyAnalysisReport error', e);
    return res.status(500).json({ message: 'Failed to generate company analysis report' });
  }
};

// GET /api/admin/reports/at-risk-students
exports.getAtRiskStudentsReport = async (req, res) => {
  try {
    // At-risk heuristic:
    // - cgpa < 6.0 OR active_backlogs > 0 OR missing resume OR low skills (<5)
    let hasResumeParsed = true;
    try {
      await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
    } catch {
      hasResumeParsed = false;
    }

    const [rows] = await db.query(`
      SELECT
        s.user_id AS student_id,
        s.roll_number,
        d.name AS department,
        u.email,
        s.current_cgpa,
        s.active_backlogs,
        (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS manual_skills_count,
        ${hasResumeParsed ? `(SELECT CASE WHEN rp.student_id IS NULL THEN 0 ELSE 1 END FROM resume_parsed_data rp WHERE rp.student_id = s.user_id LIMIT 1)` : '0'} AS has_resume
      FROM students s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN departments d ON d.id = s.department_id
    `);

    const enriched = (rows || [])
      .map((r) => {
        const cgpa = Number(r.current_cgpa || 0);
        const backlogs = Number(r.active_backlogs || 0);
        const skills = Number(r.manual_skills_count || 0);
        const hasResume = Number(r.has_resume || 0) === 1;

        const riskReasons = [];
        if (cgpa > 0 && cgpa < 6.0) riskReasons.push('Low CGPA');
        if (backlogs > 0) riskReasons.push('Active backlogs');
        if (!hasResume) riskReasons.push('Resume not uploaded');
        if (skills < 5) riskReasons.push('Low skills count');

        const riskScore = clamp(
          (cgpa > 0 ? (6.0 - Math.min(cgpa, 6.0)) * 25 : 10) +
            backlogs * 20 +
            (!hasResume ? 25 : 0) +
            (skills < 5 ? (5 - skills) * 6 : 0),
          0,
          100
        );

        return {
          ...r,
          risk_score: Number(riskScore.toFixed(0)),
          risk_reasons: riskReasons.join('; '),
        };
      })
      .filter((r) => r.risk_score >= 25)
      .sort((a, b) => Number(b.risk_score) - Number(a.risk_score));

    return sendReport(req, res, 'at_risk_students', { rows: enriched });
  } catch (e) {
    console.error('getAtRiskStudentsReport error', e);
    return res.status(500).json({ message: 'Failed to generate at-risk students report' });
  }
};

// GET /api/admin/reports/student-readiness
exports.getStudentReadinessReport = async (req, res) => {
  try {
    let hasResumeParsed = true;
    try {
      await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
    } catch {
      hasResumeParsed = false;
    }

    const [rows] = await db.query(`
      SELECT
        s.user_id AS student_id,
        s.roll_number,
        d.name AS department,
        u.email,
        s.current_cgpa,
        s.active_backlogs,
        (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS manual_skills_count,
        (SELECT COUNT(*) FROM projects p WHERE p.student_id = s.user_id) AS projects_count,
        ${hasResumeParsed ? `COALESCE((SELECT JSON_LENGTH(rp.skills_json) FROM resume_parsed_data rp WHERE rp.student_id = s.user_id), 0)` : '0'} AS resume_skills_count
      FROM students s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN departments d ON d.id = s.department_id
      ORDER BY s.current_cgpa DESC
    `);

    const enriched = (rows || []).map((r) => {
      const cgpa = Number(r.current_cgpa || 0);
      const backlogs = Number(r.active_backlogs || 0);
      const skills = Number(r.manual_skills_count || 0) + Number(r.resume_skills_count || 0);
      const projects = Number(r.projects_count || 0);

      const academics = clamp((cgpa / 10) * 100 - backlogs * 15);
      const skillsScore = clamp(100 * (1 - Math.exp(-skills / 12)));
      const portfolio = clamp(projects * 12);
      const readiness = clamp(academics * 0.5 + skillsScore * 0.3 + portfolio * 0.2);

      return {
        ...r,
        total_skills_count: skills,
        readiness_score: Number(readiness.toFixed(0)),
      };
    });

    return sendReport(req, res, 'student_readiness', { rows: enriched });
  } catch (e) {
    console.error('getStudentReadinessReport error', e);
    return res.status(500).json({ message: 'Failed to generate student readiness report' });
  }
};

// POST /api/admin/reports/custom
exports.getCustomReport = async (req, res) => {
  try {
    const { reportType } = req.body || {};
    // v1: map to existing reports (extend later)
    switch (reportType) {
      case 'placement':
        return exports.getPlacementReport(req, res);
      case 'student_readiness':
        return exports.getStudentReadinessReport(req, res);
      case 'company_analysis':
        return exports.getCompanyAnalysisReport(req, res);
      case 'branch_performance':
        return exports.getBranchPerformanceReport(req, res);
      case 'at_risk_students':
        return exports.getAtRiskStudentsReport(req, res);
      default:
        return res.status(400).json({ message: 'Unknown reportType' });
    }
  } catch (e) {
    console.error('getCustomReport error', e);
    return res.status(500).json({ message: 'Failed to generate custom report' });
  }
};

// GET /api/admin/reports/shortlisted
exports.getShortlistedStudentsReport = async (req, res) => {
  try {
    const { minCgpa, maxBacklogs, skills } = req.query;
    
    let query = `
      SELECT 
        s.user_id AS student_id,
        s.roll_number,
        u.email,
        sp.full_name,
        d.name AS branch,
        s.current_cgpa,
        s.active_backlogs
      FROM students s
      JOIN users u ON u.id = s.user_id
      JOIN student_profiles sp ON sp.student_id = s.user_id
      LEFT JOIN departments d ON d.id = s.department_id
      WHERE s.current_cgpa >= ?
      AND s.active_backlogs <= ?
    `;
    
    const queryParams = [
      parseFloat(minCgpa || 0),
      parseInt(maxBacklogs || 99)
    ];

    if (skills) {
      const skillList = Array.isArray(skills) ? skills : skills.split(',');
      if (skillList.length > 0) {
        query += ` AND EXISTS (
          SELECT 1 FROM student_skills ss 
          JOIN skills sk ON ss.skill_id = sk.id
          WHERE ss.student_id = s.user_id
          AND sk.name IN (${skillList.map(() => '?').join(',')})
        )`;
        queryParams.push(...skillList);
      }
    }

    const [rows] = await db.query(query, queryParams);

    return sendReport(req, res, 'shortlisted_students', { rows });
  } catch (e) {
    console.error('getShortlistedStudentsReport error', e);
    return res.status(500).json({ message: 'Failed to generate shortlisted students report' });
  }
};

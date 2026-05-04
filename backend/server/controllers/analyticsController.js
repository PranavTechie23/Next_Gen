const db = require('../config/db');

/**
 * Route: GET /api/admin/analytics/placement-stats
 * Returns total students, total applications, selected students, and placement percentage
 */
const getPlacementStats = async (req, res) => {
    try {
        // Query to get overall aggregated placement stats
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM students) AS total_students,
                (SELECT COUNT(*) FROM applications) AS total_applications,
                (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'SELECTED') AS selected_students
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No analytics data available." });
        }

        const stats = rows[0];
        const totalStudents = stats.total_students || 0;
        const totalApplications = stats.total_applications || 0;
        const selectedStudents = stats.selected_students || 0;

        // Calculate percentage (guarding against divide-by-zero)
        let placementPercentage = 0;
        if (totalStudents > 0) {
            placementPercentage = (selectedStudents / totalStudents) * 100;
        }

        res.status(200).json({
            total_students: totalStudents,
            total_applications: totalApplications,
            selected_students: selectedStudents,
            // Round to 2 decimal places smoothly
            placement_percentage: parseFloat(placementPercentage.toFixed(2)) 
        });

    } catch (error) {
        console.error("Error fetching placement stats:", error);
        res.status(500).json({ message: "Internal server error while fetching placement statistics." });
    }
};

/**
 * Route: GET /api/dept/analytics/department-stats
 * Returns department_name, total_students, and selected_students aggregated
 */
const getDepartmentStats = async (req, res) => {
    try {
        // Use JOINs to retrieve department stats correctly mapping 1 student mapping to X applications
        const query = `
            SELECT 
                d.name AS department_name, 
                COUNT(DISTINCT s.user_id) AS total_students, 
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS selected_students
            FROM departments d
            LEFT JOIN students s ON d.id = s.department_id
            LEFT JOIN applications a ON s.user_id = a.student_id
            GROUP BY d.id
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No department analytics available." });
        }

        res.status(200).json({
            count: rows.length,
            departments: rows
        });

    } catch (error) {
        console.error("Error fetching department stats:", error);
        res.status(500).json({ message: "Internal server error while fetching department statistics." });
    }
};

const DASHBOARD_CACHE_SCOPE = 'admin_dashboard';
const DASHBOARD_CACHE_TTL_MINUTES = 15;

const ensurePlacementAnalyticsTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS placement_analytics (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            scope VARCHAR(100) NOT NULL,
            payload_json LONGTEXT NOT NULL,
            generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uq_scope (scope)
        )
    `);
};

const getCachedDashboardPayload = async () => {
    const [rows] = await db.query(
        `SELECT payload_json, generated_at
         FROM placement_analytics
         WHERE scope = ?
         LIMIT 1`,
        [DASHBOARD_CACHE_SCOPE]
    );

    if (!rows.length) return null;
    const row = rows[0];
    const generatedAt = row.generated_at ? new Date(row.generated_at) : null;
    if (!generatedAt) return null;

    const ageMs = Date.now() - generatedAt.getTime();
    const ttlMs = DASHBOARD_CACHE_TTL_MINUTES * 60 * 1000;
    if (ageMs > ttlMs) return null;

    try {
        return JSON.parse(row.payload_json);
    } catch {
        return null;
    }
};

const setCachedDashboardPayload = async (payload) => {
    await db.query(
        `INSERT INTO placement_analytics (scope, payload_json, generated_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE
            payload_json = VALUES(payload_json),
            generated_at = VALUES(generated_at)`,
        [DASHBOARD_CACHE_SCOPE, JSON.stringify(payload)]
    );
};

const buildAdminDashboardData = async () => {
    const [[baseStats]] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM students) AS total_students,
                (SELECT COUNT(*) FROM applications) AS total_applications,
                (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'SELECTED') AS selected_students,
                (SELECT COUNT(*) FROM recruiters) AS active_companies,
                (SELECT COUNT(*) FROM recruitment_drives WHERE status IN ('OPEN','ONGOING')) AS active_drives,
                (SELECT ROUND(AVG(jp.package_value), 2)
                   FROM applications a
                   JOIN job_postings jp ON jp.id = a.job_id
                  WHERE a.status = 'SELECTED') AS avg_package_lpa,
                (SELECT COUNT(*) FROM applications WHERE status = 'INTERVIEW_SCHEDULED') AS interview_scheduled,
                (SELECT COUNT(*) FROM applications WHERE status = 'SELECTED') AS interview_selected
    `);

    let hasResumeParsed = true;
    try {
        await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
    } catch {
        hasResumeParsed = false;
    }

    const [readinessRows] = await db.query(`
            SELECT
                s.user_id AS student_id,
                s.current_cgpa,
                s.active_backlogs,
                (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS manual_skills_count,
                (SELECT COUNT(*) FROM projects p WHERE p.student_id = s.user_id) AS projects_count,
                ${hasResumeParsed ? `COALESCE((SELECT JSON_LENGTH(rp.skills_json) FROM resume_parsed_data rp WHERE rp.student_id = s.user_id), 0)` : '0'} AS resume_skills_count
            FROM students s
    `);

    const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n || 0)));
    const readinessScores = (readinessRows || []).map((r) => {
            const cgpa = Number(r.current_cgpa || 0);
            const backlogs = Number(r.active_backlogs || 0);
            const skills = Number(r.manual_skills_count || 0) + Number(r.resume_skills_count || 0);
            const projects = Number(r.projects_count || 0);
            const academics = clamp((cgpa / 10) * 100 - backlogs * 15);
            const skillsScore = clamp(100 * (1 - Math.exp(-skills / 12)));
            const portfolio = clamp(projects * 12);
            const readiness = clamp(academics * 0.5 + skillsScore * 0.3 + portfolio * 0.2);
            return readiness;
    });
    const avgReadinessScore =
        readinessScores.length > 0
            ? Number((readinessScores.reduce((a, b) => a + b, 0) / readinessScores.length).toFixed(0))
            : 0;
    const placementReadyCount = readinessScores.filter((x) => x >= 60).length;

    const [branchRows] = await db.query(`
            SELECT
                d.name AS branch,
                COUNT(DISTINCT s.user_id) AS students,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed,
                ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avgPackage
            FROM departments d
            LEFT JOIN students s ON s.department_id = d.id
            LEFT JOIN applications a ON a.student_id = s.user_id
            LEFT JOIN job_postings jp ON jp.id = a.job_id
            GROUP BY d.id, d.name
            ORDER BY students DESC
    `);

    const branchData = (branchRows || []).map((r) => {
            const students = Number(r.students || 0);
            const placed = Number(r.placed || 0);
            const avg = students > 0 ? Math.round((placed / students) * 100) : 0;
            const ready = Math.round(students * (avgReadinessScore / 100));
            return {
                branch: r.branch || 'Unknown',
                students,
                ready,
                avg,
                placed,
                avgPackage: Number(r.avgPackage || 0),
            };
    });

    const [yearRows] = await db.query(`
            SELECT
                YEAR(a.applied_at) AS year,
                COUNT(*) AS applications,
                COUNT(CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 1 END) AS interviews,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS placed_students
            FROM applications a
            WHERE a.applied_at IS NOT NULL
            GROUP BY YEAR(a.applied_at)
            ORDER BY year ASC
    `);

    const yearTrend = (yearRows || []).map((r) => {
            const totalStudents = Number(baseStats?.total_students || 0);
            const placedStudents = Number(r.placed_students || 0);
            return {
                year: String(r.year || ''),
                placements: totalStudents > 0 ? Number(((placedStudents / totalStudents) * 100).toFixed(0)) : 0,
                avg_salary: Number(baseStats?.avg_package_lpa || 0),
                companies: Number(baseStats?.active_companies || 0),
                offers: Number(r.offers || 0),
            };
    });

    const [monthlyRows] = await db.query(`
            SELECT
                DATE_FORMAT(a.applied_at, '%b') AS month,
                MONTH(a.applied_at) AS month_num,
                COUNT(*) AS applications,
                COUNT(CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 1 END) AS interviews,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers
            FROM applications a
            WHERE a.applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(a.applied_at, '%b'), MONTH(a.applied_at)
            ORDER BY month_num ASC
    `);
    const monthlyActivity = (monthlyRows || []).map((r) => ({
            month: r.month,
            applications: Number(r.applications || 0),
            interviews: Number(r.interviews || 0),
            offers: Number(r.offers || 0),
    }));

    const [atRiskRaw] = await db.query(`
            SELECT
                s.user_id AS student_id,
                s.roll_number,
                d.name AS branch,
                u.email,
                s.current_cgpa,
                s.active_backlogs,
                (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS manual_skills_count,
                ${hasResumeParsed ? `(SELECT CASE WHEN rp.student_id IS NULL THEN 0 ELSE 1 END FROM resume_parsed_data rp WHERE rp.student_id = s.user_id LIMIT 1)` : '0'} AS has_resume
            FROM students s
            JOIN users u ON u.id = s.user_id
            LEFT JOIN departments d ON d.id = s.department_id
    `);

    const atRiskStudents = (atRiskRaw || [])
        .map((r, idx) => {
                const cgpa = Number(r.current_cgpa || 0);
                const backlogs = Number(r.active_backlogs || 0);
                const skills = Number(r.manual_skills_count || 0);
                const hasResume = Number(r.has_resume || 0) === 1;
                const riskScore = clamp(
                    (cgpa > 0 ? (6.0 - Math.min(cgpa, 6.0)) * 25 : 10) +
                    backlogs * 20 +
                    (!hasResume ? 25 : 0) +
                    (skills < 5 ? (5 - skills) * 6 : 0),
                    0,
                    100
                );
                const issues = [];
                if (cgpa > 0 && cgpa < 6.0) issues.push('Low CGPA');
                if (backlogs > 0) issues.push('Active backlogs');
                if (!hasResume) issues.push('Resume not uploaded');
                if (skills < 5) issues.push('Low skills count');
                return {
                    id: String(r.roll_number || r.student_id),
                    name: String(r.email || '').split('@')[0] || String(r.roll_number || '') || `Student ${idx + 1}`,
                    branch: r.branch || 'Unknown',
                    readiness: Number((100 - riskScore).toFixed(0)),
                    status: riskScore >= 60 ? 'Critical' : 'At Risk',
                    issues,
                    lastActivity: 'Recent',
                    risk_score: riskScore,
                };
        })
        .filter((r) => r.risk_score >= 25)
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 10);

    const [topRows] = await db.query(`
            SELECT
                s.roll_number,
                d.name AS branch,
                u.email,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers,
                ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS best_package
            FROM students s
            JOIN users u ON u.id = s.user_id
            LEFT JOIN departments d ON d.id = s.department_id
            LEFT JOIN applications a ON a.student_id = s.user_id
            LEFT JOIN job_postings jp ON jp.id = a.job_id
            GROUP BY s.user_id, s.roll_number, d.name, u.email
            HAVING offers > 0
            ORDER BY offers DESC, best_package DESC
            LIMIT 10
    `);
    const topPerformers = (topRows || []).map((r, idx) => ({
            rank: idx + 1,
            name: String(r.email || '').split('@')[0] || String(r.roll_number || '') || `Student ${idx + 1}`,
            branch: r.branch || 'Unknown',
            score: clamp(60 + Number(r.offers || 0) * 8 + Number(r.best_package || 0), 0, 100),
            offers: Number(r.offers || 0),
            package: Number(r.best_package || 0),
    }));

    const [recentRows] = await db.query(`
            SELECT
                d.name AS branch,
                u.email,
                r.company_name AS company,
                jp.package_value AS package,
                a.applied_at
            FROM applications a
            JOIN students s ON s.user_id = a.student_id
            JOIN users u ON u.id = s.user_id
            LEFT JOIN departments d ON d.id = s.department_id
            JOIN job_postings jp ON jp.id = a.job_id
            JOIN recruitment_drives rd ON rd.id = jp.drive_id
            JOIN recruiters r ON r.id = rd.recruiter_id
            WHERE a.status = 'SELECTED'
            ORDER BY a.applied_at DESC
            LIMIT 10
    `);
    const recentPlacements = (recentRows || []).map((r) => ({
            student: String(r.email || '').split('@')[0] || 'Student',
            company: r.company || 'Company',
            package: Number(r.package || 0),
            date: r.applied_at ? new Date(r.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
            branch: r.branch || 'Unknown',
    }));

    const placementDistribution = (() => {
            const total = Number(baseStats?.selected_students || 0);
            const product = topPerformers.filter((p) => Number(p.package || 0) >= 10).length;
            const startup = topPerformers.filter((p) => Number(p.package || 0) < 7).length;
            const core = Math.max(0, Math.round(total * 0.1));
            const service = Math.max(0, total - product - startup - core);
            const toPercent = (v) => (total > 0 ? Number(((v / total) * 100).toFixed(0)) : 0);
        return [
            { name: "Product Based", value: toPercent(product), color: "#1e3a8a" },
            { name: "Service Based", value: toPercent(service), color: "#3b82f6" },
            { name: "Startups", value: toPercent(startup), color: "#60a5fa" },
            { name: "Core Engineering", value: toPercent(core), color: "#93c5fd" },
        ];
    })();

    const placementRate = Number(baseStats?.total_students || 0) > 0
        ? Number(((Number(baseStats?.selected_students || 0) / Number(baseStats?.total_students || 0)) * 100).toFixed(0))
        : 0;
    const interviewSuccess = Number(baseStats?.interview_scheduled || 0) > 0
        ? Number(((Number(baseStats?.interview_selected || 0) / Number(baseStats?.interview_scheduled || 0)) * 100).toFixed(0))
        : 0;

    const collegeStats = [
        { key: "total_students", value: Number(baseStats?.total_students || 0), trend: "up" },
        { key: "placement_ready", value: Number(placementReadyCount || 0), trend: "up" },
        { key: "avg_readiness", value: Number(avgReadinessScore || 0), trend: "up" },
        { key: "placement_rate", value: Number(placementRate || 0), trend: "up" },
    ];

    const additionalMetrics = [
        { key: "active_companies", value: Number(baseStats?.active_companies || 0), trend: "up" },
        { key: "avg_package", value: Number(baseStats?.avg_package_lpa || 0), trend: "up" },
        { key: "active_drives", value: Number(baseStats?.active_drives || 0), trend: "up" },
        { key: "interview_success", value: Number(interviewSuccess || 0), trend: interviewSuccess >= 50 ? "up" : "down" },
    ];

    const suggestions = [
        {
            title: "Focus intervention on at-risk students",
            impact: "High",
            affectedStudents: atRiskStudents.length,
            description: "Use readiness and risk signals to plan targeted branch-wise support.",
            priority: 1,
            timeline: "2 weeks",
            cost: "Operational",
        },
        {
            title: "Increase shortlist-to-offer conversion",
            impact: "High",
            affectedStudents: Number(baseStats?.interview_scheduled || 0),
            description: "Track interview outcomes and run focused interview prep by branch.",
            priority: 1,
            timeline: "1 month",
            cost: "Operational",
        },
    ];

    return {
        collegeStats,
        additionalMetrics,
        branchData,
        yearTrend,
        monthlyActivity,
        atRiskStudents,
        topPerformers,
        recentPlacements,
        placementDistribution,
        suggestions,
        skillsRadarData: [],
        upcomingEvents: [],
    };
};

/**
 * Route: GET /api/admin/analytics/dashboard
 * Returns dashboard aggregates, cached in placement_analytics table.
 */
const getAdminDashboardData = async (req, res) => {
    try {
        await ensurePlacementAnalyticsTable();
        const forceRefresh = String(req.query.refresh || '').toLowerCase() === 'true';

        if (!forceRefresh) {
            const cachedPayload = await getCachedDashboardPayload();
            if (cachedPayload) {
                return res.status(200).json(cachedPayload);
            }
        }

        const payload = await buildAdminDashboardData();
        await setCachedDashboardPayload(payload);
        return res.status(200).json(payload);
    } catch (error) {
        console.error("Error fetching admin dashboard analytics:", error);
        return res.status(500).json({ message: "Internal server error while fetching admin dashboard analytics." });
    }
};

module.exports = {
    getPlacementStats,
    getDepartmentStats,
    getAdminDashboardData,
};

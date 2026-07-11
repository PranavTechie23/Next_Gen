const db = require('../config/db');
const ConfigService = require('../services/ConfigService');
const { serveCachedDashboard } = require('../utils/dashboardCache');
const { getTenantScope, studentInstitutionClause, applicationScopeJoins, dashboardCacheScope } = require('../middleware/institutionScope');

/** Batch year from roll number prefix digits (e.g. CSE26001 → 2026). Requires MySQL 8+. */
const batchYearExpr = (sAlias = 's') =>
    `(2000 + CAST(REGEXP_SUBSTR(${sAlias}.roll_number, '[0-9]{2}', 1, 1) AS UNSIGNED))`;

const parseBranchList = (query = {}) => {
    const raw = query.branch ?? query.branches ?? query.departmentId ?? query.department_id;
    if (raw == null) return [];
    const tokens = Array.isArray(raw)
        ? raw.flatMap((v) => String(v).split(','))
        : String(raw).split(',');
    return tokens
        .map((s) => s.trim())
        .filter((s) => s && s.toLowerCase() !== 'all');
};

const parseDashboardFilters = (query = {}) => {
    const rawYear = query.year;
    let year = null;
    if (rawYear != null && String(rawYear).trim() !== '' && String(rawYear).toLowerCase() !== 'all') {
        const y = parseInt(String(rawYear), 10);
        if (Number.isFinite(y) && y >= 2000 && y <= 2100) year = y;
    }

    const branches = parseBranchList(query);

    return { year, branches };
};

const buildStudentFilterSql = (filters) => {
    if (!filters?.year && !filters?.branches?.length) {
        return { joinsSql: '', andClause: '', params: [] };
    }

    const joins = [];
    const parts = [];
    const params = [];

    if (filters.year) {
        parts.push(`${batchYearExpr('s')} = ?`);
        params.push(filters.year);
    }
    if (filters.branches?.length) {
        const ids = [];
        const names = [];
        for (const token of filters.branches) {
            const branchId = parseInt(token, 10);
            if (Number.isFinite(branchId) && String(branchId) === token) {
                ids.push(branchId);
            } else {
                names.push(token);
            }
        }
        const branchParts = [];
        if (ids.length) {
            branchParts.push(`s.department_id IN (${ids.map(() => '?').join(', ')})`);
            params.push(...ids);
        }
        if (names.length) {
            joins.push('INNER JOIN departments d_fil ON d_fil.id = s.department_id');
            const nameConds = names.map(() => '(d_fil.name = ? OR d_fil.code = ?)').join(' OR ');
            branchParts.push(`(${nameConds})`);
            for (const name of names) {
                params.push(name, name);
            }
        }
        if (branchParts.length) {
            parts.push(branchParts.length === 1 ? branchParts[0] : `(${branchParts.join(' OR ')})`);
        }
    }

    return {
        joinsSql: joins.length ? ` ${joins.join(' ')}` : '',
        andClause: parts.length ? ` AND ${parts.join(' AND ')}` : '',
        params,
    };
};

const filtersSummary = (filters) => ({
    year: filters.year ?? null,
    branches: filters.branches?.length ? filters.branches : null,
});

/**
 * Route: GET /api/TPO/analytics/placement-stats
 * Returns total students, total applications, selected students, and placement percentage
 */
const getPlacementStats = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        const { clause, params } = studentInstitutionClause(scope);

        const query = `
            SELECT 
                (SELECT COUNT(*) FROM students s JOIN users u ON s.user_id = u.id WHERE ${clause}) AS total_students,
                (SELECT COUNT(*) FROM applications a ${applicationScopeJoins()} WHERE ${clause}) AS total_applications,
                (SELECT COUNT(DISTINCT a.student_id) FROM applications a ${applicationScopeJoins()} WHERE a.status = 'SELECTED' AND ${clause}) AS selected_students
        `;

        const [rows] = await db.query(query, [...params, ...params, ...params]);

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

const buildTPODashboardData = async (scope, filters = {}) => {
    if (!scope?.institutionId) {
        const err = new Error('Institution context is required.');
        err.statusCode = 403;
        throw err;
    }
    const { clause, params } = studentInstitutionClause(scope);
    const studentFilter = buildStudentFilterSql(filters);
    const scopedWhere = `${clause}${studentFilter.andClause}`;
    const scopedParams = [...params, ...studentFilter.params];
    const studentFrom = `FROM students s JOIN users u ON s.user_id = u.id${studentFilter.joinsSql}`;
    const appJoin = applicationScopeJoins();
    const appScopedWhere = `${clause}${studentFilter.andClause}`;
    const appFrom = `FROM applications a ${appJoin}${studentFilter.joinsSql}`;

    const repeatParams = (n) => Array.from({ length: n }, () => scopedParams).flat();

    // Run independent queries in parallel for sub-second performance
    const [
        [baseStatsRows],
        [branchRows],
        [yearRows],
        [monthlyRows],
        [topRows],
        [recentRows],
        [topCompanyRows]
    ] = await Promise.all([
        db.query(`
            SELECT
                (SELECT COUNT(*) ${studentFrom} WHERE ${scopedWhere}) AS total_students,
                COUNT(a.id) AS total_applications,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS selected_students,
                COUNT(DISTINCT r.id) AS active_companies,
                COUNT(DISTINCT CASE WHEN rd.status IN ('OPEN','ONGOING') THEN rd.id END) AS active_drives,
                ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN COALESCE(jp.package_value, 0) END), 2) AS avg_package_lpa,
                COUNT(CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 1 END) AS interview_scheduled,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS interview_selected
            ${appFrom}
            LEFT JOIN job_postings jp ON jp.id = a.job_id
            LEFT JOIN recruitment_drives rd ON rd.id = jp.drive_id
            LEFT JOIN recruiters r ON r.id = rd.recruiter_id
            WHERE ${appScopedWhere}
        `, [...scopedParams, ...scopedParams]),
        db.query(`
            SELECT
                d.name AS branch,
                COUNT(DISTINCT s.user_id) AS students,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed,
                ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN COALESCE(jp.package_value, 0) END), 2) AS avgPackage
            FROM departments d
            INNER JOIN students s ON s.department_id = d.id
            INNER JOIN users u ON s.user_id = u.id
            ${studentFilter.joinsSql}
            LEFT JOIN applications a ON a.student_id = s.user_id
            LEFT JOIN job_postings jp ON jp.id = a.job_id
            WHERE ${scopedWhere}
            GROUP BY d.id, d.name
            ORDER BY students DESC
        `, scopedParams),
        db.query(`
            SELECT
                YEAR(a.applied_at) AS year,
                COUNT(*) AS applications,
                COUNT(CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 1 END) AS interviews,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS placed_students
            ${appFrom}
            WHERE a.applied_at IS NOT NULL AND ${appScopedWhere}
            GROUP BY YEAR(a.applied_at)
            ORDER BY year ASC
        `, scopedParams),
        db.query(`
            SELECT
                DATE_FORMAT(a.applied_at, '%b') AS month,
                MONTH(a.applied_at) AS month_num,
                COUNT(*) AS applications,
                COUNT(CASE WHEN a.status = 'INTERVIEW_SCHEDULED' THEN 1 END) AS interviews,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers
            ${appFrom}
            WHERE a.applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND ${appScopedWhere}
            GROUP BY DATE_FORMAT(a.applied_at, '%b'), MONTH(a.applied_at)
            ORDER BY month_num ASC
        `, scopedParams),
        db.query(`
            SELECT
                s.roll_number,
                d.name AS branch,
                u.email,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers,
                ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS best_package
            FROM students s
            JOIN users u ON u.id = s.user_id
            ${studentFilter.joinsSql}
            LEFT JOIN departments d ON d.id = s.department_id
            LEFT JOIN applications a ON a.student_id = s.user_id
            LEFT JOIN job_postings jp ON jp.id = a.job_id
            WHERE ${scopedWhere}
            GROUP BY s.user_id, s.roll_number, d.name, u.email
            HAVING offers > 0
            ORDER BY offers DESC, best_package DESC
            LIMIT 10
        `, scopedParams),
        db.query(`
            SELECT
                d.name AS branch,
                u.email,
                r.company_name AS company,
                jp.package_value AS package,
                a.applied_at
            ${appFrom}
            LEFT JOIN departments d ON d.id = s.department_id
            JOIN job_postings jp ON jp.id = a.job_id
            JOIN recruitment_drives rd ON rd.id = jp.drive_id
            JOIN recruiters r ON r.id = rd.recruiter_id
            WHERE a.status = 'SELECTED' AND ${appScopedWhere}
            ORDER BY a.applied_at DESC
            LIMIT 10
        `, scopedParams),
        db.query(`
            SELECT
                r.company_name AS name,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers
            ${appFrom}
            JOIN job_postings jp ON jp.id = a.job_id
            JOIN recruitment_drives rd ON rd.id = jp.drive_id
            JOIN recruiters r ON r.id = rd.recruiter_id
            WHERE ${appScopedWhere}
            GROUP BY r.company_name
            HAVING offers > 0
            ORDER BY offers DESC
            LIMIT 10
        `, scopedParams)
    ]);
    const baseStats = baseStatsRows[0];

    // Check resume data existence once
    let hasResumeParsed = true;
    try {
        await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
    } catch {
        hasResumeParsed = false;
    }

    const resumeCountJoin = '';

    // One pass for all student signals, with counts pre-aggregated by student.
    const [allStudentsSignals] = await db.query(`
        SELECT
            s.user_id,
            s.roll_number,
            s.current_cgpa,
            s.active_backlogs,
            d.name AS branch,
            u.email,
            (SELECT COUNT(*) FROM student_skills sk WHERE sk.student_id = s.user_id) AS manual_skills_count,
            (SELECT COUNT(*) FROM projects pr WHERE pr.student_id = s.user_id) AS projects_count,
            ${hasResumeParsed ? '(SELECT COUNT(*) FROM resume_parsed_data rp WHERE rp.student_id = s.user_id)' : '0'} AS has_resume
        FROM students s
        JOIN users u ON u.id = s.user_id
        ${studentFilter.joinsSql}
        LEFT JOIN departments d ON d.id = s.department_id
        WHERE ${scopedWhere}
    `, scopedParams);

    // Ensure config is loaded
    await ConfigService.initialize();

    const [wAcademic, wSkills, wPortfolio, minCgpa, minSkills] = await Promise.all([
        ConfigService.getNumber('READINESS_ACADEMIC_WEIGHT', 0.5),
        ConfigService.getNumber('READINESS_SKILLS_WEIGHT', 0.3),
        ConfigService.getNumber('READINESS_PORTFOLIO_WEIGHT', 0.2),
        ConfigService.getNumber('MIN_CGPA_THRESHOLD', 6.0),
        ConfigService.getNumber('MIN_SKILLS_THRESHOLD', 5),
    ]);

    const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n || 0)));

    // Process all signals in memory (O(N))
    let totalReadiness = 0;
    let placementReadyCount = 0;
    const atRiskList = [];

    const studentsCount = allStudentsSignals.length;
    for (const r of allStudentsSignals) {
        const cgpa = Number(r.current_cgpa || 0);
        const backlogs = Number(r.active_backlogs || 0);
        const skills = Number(r.manual_skills_count || 0);
        const projects = Number(r.projects_count || 0);
        const hasResume = Number(r.has_resume || 0) > 0;

        // Readiness Score logic
        const academics = clamp((cgpa / 10) * 100 - backlogs * 15);
        const skillsScore = clamp(100 * (1 - Math.exp(-skills / 12)));
        const portfolio = clamp(projects * 12 + (hasResume ? 20 : 0));
        const readiness = clamp(academics * wAcademic + skillsScore * wSkills + portfolio * wPortfolio);

        totalReadiness += readiness;
        if (readiness >= 60) placementReadyCount++;

        // Risk Signal logic
        const riskScore = clamp(
            (cgpa > 0 ? (minCgpa - Math.min(cgpa, minCgpa)) * 25 : 10) +
            backlogs * 20 +
            (!hasResume ? 25 : 0) +
            (skills < minSkills ? (minSkills - skills) * 6 : 0),
            0,
            100
        );

        if (riskScore >= 25) {
            const issues = [];
            if (cgpa > 0 && cgpa < 6.0) issues.push('Low CGPA');
            if (backlogs > 0) issues.push('Active backlogs');
            if (!hasResume) issues.push('Resume missing');
            if (skills < 5) issues.push('Low skills');

            atRiskList.push({
                id: String(r.roll_number || r.user_id),
                name: String(r.email || '').split('@')[0] || String(r.roll_number || ''),
                branch: r.branch || 'Unknown',
                readiness: Math.round(readiness),
                status: riskScore >= 60 ? 'Critical' : 'At Risk',
                issues,
                risk_score: riskScore
            });
        }
    }

    const avgReadinessScore = studentsCount > 0 ? Math.round(totalReadiness / studentsCount) : 0;
    const atRiskStudents = atRiskList
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 10);

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

    const monthlyActivity = (monthlyRows || []).map((r) => ({
        month: r.month,
        applications: Number(r.applications || 0),
        interviews: Number(r.interviews || 0),
        offers: Number(r.offers || 0),
    }));

    const topPerformers = (topRows || []).map((r, idx) => ({
        rank: idx + 1,
        name: String(r.email || '').split('@')[0] || String(r.roll_number || '') || `Student ${idx + 1}`,
        branch: r.branch || 'Unknown',
        score: clamp(60 + Number(r.offers || 0) * 8 + Number(r.best_package || 0), 0, 100),
        offers: Number(r.offers || 0),
        package: Number(r.best_package || 0),
    }));

    const recentPlacements = (recentRows || []).map((r) => ({
        student: String(r.email || '').split('@')[0] || 'Student',
        company: r.company || 'Company',
        package: Number(r.package || 0),
        date: r.applied_at ? new Date(r.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        branch: r.branch || 'Unknown',
    }));

    const topHiringCompanies = (topCompanyRows || []).map((r) => ({
        name: r.name || 'Unknown',
        offers: Number(r.offers || 0),
    }));

    const placementDistribution = await (async () => {
        const total = Number(baseStats?.selected_students || 0);
        const [prodThresh, startThresh] = await Promise.all([
            ConfigService.getNumber('PRODUCT_PACKAGE_THRESHOLD', 10),
            ConfigService.getNumber('STARTUP_PACKAGE_THRESHOLD', 7),
        ]);

        const product = topPerformers.filter((p) => Number(p.package || 0) >= prodThresh).length;
        const startup = topPerformers.filter((p) => Number(p.package || 0) < startThresh).length;
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
            basis: "This recommendation is based on low readiness scores and the current at-risk student count across branches.",
            priority: 1,
            timeline: "2 weeks",
            cost: "Operational",
        },
        {
            title: "Increase shortlist-to-offer conversion",
            impact: "High",
            affectedStudents: Number(baseStats?.interview_scheduled || 0),
            description: "Track interview outcomes and run focused interview prep by branch.",
            basis: "This recommendation is generated from interview scheduling and offer conversion trends in the dashboard.",
            priority: 1,
            timeline: "1 month",
            cost: "Operational",
        },
    ];

    let upcomingEventsRows = [];
    try {
        const [rows] = await db.query(`
            SELECT id, title, starts_at, starts_at as date, meeting_link, 'Webinar' as type, 0 as attendees, 'TPO' as department_name, 'All' as target_batch, 'webinar' as source_table
            FROM webinars
            WHERE institution_id = ? AND starts_at >= NOW()
            UNION ALL
            SELECT d.id, d.title, d.date as starts_at, d.date, d.meeting_link, d.type, 0 as attendees, dep.name as department_name, d.target_batch, 'dept_event' as source_table
            FROM dept_events d
            JOIN users u ON d.created_by = u.id
            JOIN departments dep ON d.department_id = dep.id
            WHERE u.institution_id = ? AND d.date >= NOW()
            ORDER BY starts_at ASC
            LIMIT 15
        `, [scope.institutionId, scope.institutionId]);
        upcomingEventsRows = rows;
    } catch (e) {
        if (e.code === 'ER_BAD_FIELD_ERROR') {
            const [rows] = await db.query(`
                SELECT id, title, date_time as starts_at, date_time as date, 'Webinar' as type, 0 as attendees, 'TPO' as department_name, 'All' as target_batch
                FROM webinars
                WHERE date_time >= NOW()
                UNION ALL
                SELECT d.id, d.title, d.date as starts_at, d.date, d.meeting_link, d.type, 0 as attendees, 'Department' as department_name, d.target_batch
                FROM dept_events d
                WHERE d.date >= NOW()
                ORDER BY starts_at ASC
                LIMIT 15
            `);
            upcomingEventsRows = rows;
        } else {
            throw e;
        }
    }

    const [announcementsRows] = await db.query(`
        SELECT id, title, message, expires_at, created_at 
        FROM announcements 
        WHERE institution_id = ? 
        ORDER BY created_at DESC 
        LIMIT 15
    `, [scope.institutionId]);

    const formattedEvents = upcomingEventsRows.map(event => ({
        ...event,
        date: new Date(event.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }));

    return {
        collegeStats,
        additionalMetrics,
        branchData,
        yearTrend,
        monthlyActivity,
        atRiskStudents,
        topPerformers,
        recentPlacements,
        topHiringCompanies,
        placementDistribution,
        suggestions,
        skillsRadarData: [],
        upcomingEvents: formattedEvents,
        announcements: announcementsRows,
        appliedFilters: filtersSummary(filters),
        filterMeta: {
            batchYearSource: 'roll_number',
        },
    };
};

/**
 * Route: GET /api/TPO/analytics/dashboard
 * Returns dashboard aggregates, cached in placement_analytics table.
 */
const getAnalyticsFilterOptions = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope?.institutionId) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { clause, params } = studentInstitutionClause(scope);
        const filterYear = parseDashboardFilters({ year: req.query.year }).year;

        const [yearRows] = await db.query(
            `SELECT DISTINCT ${batchYearExpr('s')} AS batch_year
             FROM students s
             JOIN users u ON s.user_id = u.id
             WHERE ${clause}
               AND s.roll_number REGEXP '[0-9]{2}'
             HAVING batch_year IS NOT NULL AND batch_year BETWEEN 2000 AND 2100
             ORDER BY batch_year DESC`,
            params
        );

        let branchSql = `
            SELECT DISTINCT d.id, d.name, d.code, ${batchYearExpr('s')} AS batch_year
            FROM students s
            JOIN users u ON s.user_id = u.id
            INNER JOIN departments d ON d.id = s.department_id
            WHERE ${clause}`;
        const branchParams = [...params];
        if (filterYear) {
            branchSql += ` AND ${batchYearExpr('s')} = ?`;
            branchParams.push(filterYear);
        }
        branchSql += ' ORDER BY d.name ASC';

        const [branchRows] = await db.query(branchSql, branchParams);

        const branches = (branchRows || []).map((r) => ({
            id: r.id,
            name: r.name,
            code: r.code || null,
            batchYear: r.batch_year != null ? Number(r.batch_year) : null,
        }));

        const years = (yearRows || [])
            .map((r) => Number(r.batch_year))
            .filter((y) => Number.isFinite(y));

        return res.status(200).json({
            years: [...new Set(years)].sort((a, b) => b - a),
            branches,
            batchYearNote: 'Batch year is derived from the first two digits in roll_number (e.g. CSE26001 → 2026).',
            scopedToDepartment: scope.departmentId != null,
        });
    } catch (error) {
        console.error('Error fetching analytics filter options:', error);
        return res.status(500).json({ message: 'Internal server error while fetching filter options.' });
    }
};

const getTPODashboardData = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope?.institutionId) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const filters = parseDashboardFilters(req.query);
        const cacheScopeKey = dashboardCacheScope(scope, filters);

        return serveCachedDashboard(req, res, {
            cacheScopeKey,
            buildPayload: () => buildTPODashboardData(scope, filters),
        });
    } catch (error) {
        console.error("Error fetching TPO dashboard analytics:", error);
        const status = error.statusCode === 403 ? 403 : 500;
        const message = status === 403
            ? error.message
            : "Internal server error while fetching TPO dashboard analytics.";
        return res.status(status).json({ message });
    }
};

/**
 * Route: GET /api/TPO/analytics/shortlist-count
 * Returns actual count of students matching JD filters (CGPA, backlogs, skills)
 */
const getShortlistCount = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        const tenantFilter = studentInstitutionClause(scope);

        const { minCgpa = 0, maxBacklogs = 10, skills = "" } = req.query;

        let query = `
            SELECT COUNT(DISTINCT s.user_id) as count
            FROM students s
            JOIN users u ON u.id = s.user_id
            WHERE s.current_cgpa >= ? 
              AND s.active_backlogs <= ?
              AND ${tenantFilter.clause}
        `;

        const params = [parseFloat(minCgpa), parseInt(maxBacklogs, 10), ...tenantFilter.params];

        if (skills) {
            const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
            if (skillList.length > 0) {
                query += ` AND s.user_id IN (
                    SELECT ss.student_id 
                    FROM student_skills ss
                    JOIN skills sk ON ss.skill_id = sk.id
                    WHERE sk.name IN (${skillList.map(() => '?').join(',')})
                    GROUP BY ss.student_id
                    HAVING COUNT(DISTINCT sk.name) = ?
                )`;
                params.push(...skillList, skillList.length);
            }
        }

        const [rows] = await db.query(query, params);
        res.status(200).json({ count: rows[0].count });

    } catch (error) {
        console.error("Error fetching shortlist count:", error);
        res.status(500).json({ message: "Internal server error while fetching shortlist count." });
    }
};

module.exports = {
    getPlacementStats,
    getDepartmentStats,
    getTPODashboardData,
    getAnalyticsFilterOptions,
    getShortlistCount,
};

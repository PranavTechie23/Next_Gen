const db = require('../config/db');

/**
 * AnalyticsService handles complex data aggregation and caching
 */
class AnalyticsService {
    /**
     * Refresh analytics for a specific department
     * @param {number} deptId 
     */
    static async refreshDeptAnalytics(deptId) {
        try {
            console.log(`Refreshing analytics for department ID: ${deptId}`);
            
            // 1. Basic Stats
            const [[stats]] = await db.execute(`
                SELECT 
                    COUNT(*) AS total_students,
                    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed_students,
                    ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avg_package,
                    ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS highest_package
                FROM students s
                LEFT JOIN applications a ON a.student_id = s.user_id
                LEFT JOIN job_postings jp ON jp.id = a.job_id
                WHERE s.department_id = ?
            `, [deptId]);

            // 2. Monthly Trend (Last 6 Months)
            const [monthlyRows] = await db.execute(`
                SELECT 
                    DATE_FORMAT(a.applied_at, '%b') AS month,
                    MONTH(a.applied_at) AS month_num,
                    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS placements
                FROM applications a
                JOIN students s ON s.user_id = a.student_id
                WHERE s.department_id = ? 
                  AND a.applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(a.applied_at, '%b'), MONTH(a.applied_at)
                ORDER BY month_num ASC
            `, [deptId]);

            // 3. Package Distribution
            const [[packageBands]] = await db.execute(`
                SELECT 
                    SUM(CASE WHEN jp.package_value >= 12 THEN 1 ELSE 0 END) AS high,
                    SUM(CASE WHEN jp.package_value >= 7 AND jp.package_value < 12 THEN 1 ELSE 0 END) AS medium,
                    SUM(CASE WHEN jp.package_value > 0 AND jp.package_value < 7 THEN 1 ELSE 0 END) AS entry
                FROM applications a
                JOIN students s ON s.user_id = a.student_id
                JOIN job_postings jp ON jp.id = a.job_id
                WHERE s.department_id = ? AND a.status = 'SELECTED'
            `, [deptId]);

            const totalOffers = (Number(packageBands.high) || 0) + (Number(packageBands.medium) || 0) + (Number(packageBands.entry) || 0);
            const toPct = (val) => totalOffers > 0 ? Math.round((val / totalOffers) * 100) : 0;

            const placementDistribution = [
                { name: "12+ LPA", value: toPct(packageBands.high), color: "#3B82F6" },
                { name: "7-12 LPA", value: toPct(packageBands.medium), color: "#10B981" },
                { name: "<7 LPA", value: toPct(packageBands.entry), color: "#F59E0B" }
            ];

            // 4. Domain Distribution (Industry Type)
            const [domainRows] = await db.execute(`
                SELECT 
                    COALESCE(r.industry_type, 'Others') AS domain,
                    COUNT(DISTINCT a.student_id) AS count
                FROM applications a
                JOIN job_postings jp ON a.job_id = jp.id
                JOIN recruitment_drives rd ON jp.drive_id = rd.id
                JOIN recruiters r ON rd.recruiter_id = r.id
                JOIN students s ON a.student_id = s.user_id
                WHERE s.department_id = ? AND a.status = 'SELECTED'
                GROUP BY COALESCE(r.industry_type, 'Others')
                ORDER BY count DESC
            `, [deptId]);

            const totalDomainOffers = domainRows.reduce((sum, row) => sum + row.count, 0);
            const domainDistribution = domainRows.map(row => ({
                name: row.domain,
                value: totalDomainOffers > 0 ? Math.round((row.count / totalDomainOffers) * 100) : 0
            }));

            // 5. College Comparison
            const [[collegeStats]] = await db.execute(`
                SELECT 
                    COUNT(DISTINCT s.user_id) AS total_students,
                    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed_students,
                    ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avg_package,
                    ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS highest_package
                FROM students s
                LEFT JOIN applications a ON a.student_id = s.user_id
                LEFT JOIN job_postings jp ON jp.id = a.job_id
            `);

            const deptPct = stats.total_students > 0 ? (stats.placed_students / stats.total_students) * 100 : 0;
            const collegePct = collegeStats.total_students > 0 ? (collegeStats.placed_students / collegeStats.total_students) * 100 : 0;

            const comparisonData = [
                { metric: "Placement %", dept: Number(deptPct.toFixed(1)), collegeAvg: Number(collegePct.toFixed(1)) },
                { metric: "Avg Package", dept: Number(stats.avg_package || 0), collegeAvg: Number(collegeStats.avg_package || 0) },
                { metric: "Highest Package", dept: Number(stats.highest_package || 0), collegeAvg: Number(collegeStats.highest_package || 0) }
            ];

            // 6. Skills Radar
            const [skillsRadar] = await db.execute(`
                SELECT 
                    'Department' as type,
                    AVG(spm.coding_test_score) AS coding,
                    AVG(spm.mock_interview_score) AS communication,
                    AVG(spm.amcat_logical) AS aptitude,
                    AVG(spm.amcat_quant) AS quantitative,
                    AVG(spm.amcat_verbal) AS verbal
                FROM student_performance_metrics spm
                JOIN students s ON s.user_id = spm.student_id
                WHERE s.department_id = ?
                UNION ALL
                SELECT 
                    'College' as type,
                    AVG(coding_test_score) AS coding,
                    AVG(mock_interview_score) AS communication,
                    AVG(amcat_logical) AS aptitude,
                    AVG(amcat_quant) AS quantitative,
                    AVG(amcat_verbal) AS verbal
                FROM student_performance_metrics
            `, [deptId]);

            const deptS = skillsRadar.find(r => r.type === 'Department') || {};
            const collegeS = skillsRadar.find(r => r.type === 'College') || {};
            
            const skillsRadarData = [
                { skill: "Coding", dept: Number(deptS.coding || 0), collegeAvg: Number(collegeS.coding || 0) },
                { skill: "Communication", dept: Number(deptS.communication || 0), collegeAvg: Number(collegeS.communication || 0) },
                { skill: "Aptitude", dept: Number(deptS.aptitude || 0), collegeAvg: Number(collegeS.aptitude || 0) },
                { skill: "Quant", dept: Number(deptS.quantitative || 0), collegeAvg: Number(collegeS.quantitative || 0) },
                { skill: "Verbal", dept: Number(deptS.verbal || 0), collegeAvg: Number(collegeS.verbal || 0) }
            ];

            // Final Payload
            const payload = {
                stats: {
                    totalStudents: stats.total_students,
                    placedStudents: stats.placed_students,
                    avgPackage: Number(stats.avg_package || 0),
                    highestPackage: Number(stats.highest_package || 0)
                },
                yearTrend: monthlyRows.map(r => ({ month: r.month, placements: r.placements })),
                placementDistribution,
                domainDistribution,
                comparisonData,
                skillsRadarData,
                generatedAt: new Date().toISOString()
            };

            // Save to Cache
            const scope = `DEPT_${deptId}`;
            await db.execute(`
                INSERT INTO placement_analytics (scope, payload_json, generated_at)
                VALUES (?, ?, NOW())
                ON DUPLICATE KEY UPDATE payload_json = VALUES(payload_json), generated_at = NOW()
            `, [scope, JSON.stringify(payload)]);

            return payload;
        } catch (error) {
            console.error(`Error refreshing analytics for dept ${deptId}:`, error);
            throw error;
        }
    }

    /**
     * Get analytics for a department (returns cache or refreshes if empty)
     * @param {number} deptId 
     */
    static async getDeptAnalytics(deptId) {
        const scope = `DEPT_${deptId}`;
        const [rows] = await db.execute('SELECT payload_json, generated_at FROM placement_analytics WHERE scope = ?', [scope]);

        if (rows.length > 0) {
            const data = JSON.parse(rows[0].payload_json);
            // Optional: If cache is older than 24h, refresh in background
            const age = (Date.now() - new Date(rows[0].generated_at).getTime()) / (1000 * 60 * 60);
            if (age > 24) {
                this.refreshDeptAnalytics(deptId).catch(console.error);
            }
            return data;
        }

        // No cache, force refresh
        return await this.refreshDeptAnalytics(deptId);
    }
}

module.exports = AnalyticsService;

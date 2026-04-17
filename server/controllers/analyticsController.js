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

module.exports = {
    getPlacementStats,
    getDepartmentStats
};

const db = require('../config/db');

/**
 * Get all job postings that the logged-in student is eligible for
 * GET /api/student/jobs
 */
const getEligibleJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch student academic data
        const [studentRows] = await db.query(
            `SELECT user_id, current_cgpa, active_backlogs, department_id, is_debarred, is_placed
             FROM students 
             WHERE user_id = ?`,
            [userId]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student record not found" });
        }

        const student = studentRows[0];

        // 2. Check if student is debarred
        if (student.is_debarred) {
            return res.status(403).json({ message: "Access denied. You are debarred from placements." });
        }

        // 3. Fetch potentially eligible jobs (DB-level filtering)
        // Status must be OPEN, job must be active, CGPA and backlog criteria must be met
        const [jobRows] = await db.query(
            `SELECT 
                j.id,
                j.job_title,
                j.job_description,
                j.location,
                j.package_value,
                j.min_cgpa,
                j.max_backlogs_allowed,
                j.eligible_branches,
                d.drive_name,
                r.company_name
            FROM job_postings j
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE
                d.status = 'OPEN'
                AND j.is_active = TRUE
                AND j.min_cgpa <= ?
                AND j.max_backlogs_allowed >= ?`,
            [student.current_cgpa, student.active_backlogs]
        );

        // 4. Fine-grained filtering in JS (Eligible Branches JSON check)
        const eligibleJobs = jobRows.filter(job => {
            if (!job.eligible_branches) return true; // If no branches specified, assume open to all

            try {
                // In some mysql versions/configs JSON columns come back as objects, in others as strings
                const branches = typeof job.eligible_branches === 'string'
                    ? JSON.parse(job.eligible_branches)
                    : job.eligible_branches;

                // Check if student's department_id is in the eligible branches array
                // If branches is not an array or is empty, assume open to all or handle accordingly
                return Array.isArray(branches) ? branches.includes(student.department_id) : true;
            } catch (e) {
                console.error("Error parsing eligible_branches for job", job.id, e);
                return true;
            }
        });

        res.status(200).json({
            count: eligibleJobs.length,
            jobs: eligibleJobs
        });

    } catch (error) {
        console.error("Error fetching eligible jobs:", error);
        res.status(500).json({ message: "Internal Server Error while fetching eligible jobs" });
    }
};

module.exports = {
    getEligibleJobs
};

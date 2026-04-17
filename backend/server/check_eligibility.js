const db = require('./config/db');

async function check() {
    try {
        const [jobs] = await db.execute(`
            SELECT 
                j.id AS job_id, 
                j.job_title, 
                j.package_value, 
                j.min_cgpa, 
                j.max_backlogs_allowed,
                j.eligible_branches,
                d.status AS drive_status,
                r.company_name
            FROM job_postings j
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE d.status = 'OPEN' 
              AND j.is_active = TRUE
              AND j.min_cgpa <= 9.99
              AND j.max_backlogs_allowed >= 0
        `);

        // Filter by branch 'CSE' if branch filtering exists
        const eligible = jobs.filter(job => {
            if (!job.eligible_branches) return true; // null means all branches
            try {
                const branches = typeof job.eligible_branches === 'string'
                    ? JSON.parse(job.eligible_branches)
                    : job.eligible_branches;
                return branches.includes('CSE');
            } catch (e) {
                return true;
            }
        });

        console.log("Eligible Jobs found strictly for CSE with CGPA 9.99:");
        console.log(JSON.stringify(eligible, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
check();

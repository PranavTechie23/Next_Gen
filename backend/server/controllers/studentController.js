const db = require('../config/db');
const { parsePositiveInt } = require('../utils/validateParams');
const { driveTenantClause, scopeFromInstitutionId } = require('../middleware/institutionScope');

/**
 * Get the profile of the logged-in student
 * GET /api/student/profile
 */
const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch basic info, skills, and projects in parallel for sub-second response
        const [studentInfoRows, skillsRows, projectsRows] = await Promise.all([
            db.execute(`
                SELECT 
                    s.user_id, s.roll_number, s.current_cgpa, s.active_backlogs, 
                    s.tenth_marks, s.twelfth_marks, s.is_academic_data_locked, 
                    s.is_placed, s.current_package_value,
                    s.is_debarred, s.debar_reason, s.debar_lift_date,
                    u.email, u.is_active,
                    d.name AS department_name, d.code AS department_code,
                    sp.resume_url, sp.linkedin_url, sp.github_url, sp.address,
                    sp.full_name, sp.phone, sp.bio
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN departments d ON s.department_id = d.id
                LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
                WHERE s.user_id = ?
            `, [userId]),
            db.execute(`
                SELECT sk.name
                FROM student_skills ss
                JOIN skills sk ON ss.skill_id = sk.id
                WHERE ss.student_id = ?
            `, [userId]),
            db.execute(`
                SELECT id, title, description, project_link
                FROM projects
                WHERE student_id = ?
            `, [userId])
        ]);

        const studentInfo = studentInfoRows[0];
        const skills = skillsRows[0];
        const projects = projectsRows[0];

        if (studentInfo.length === 0) {
            return res.status(404).json({ message: "Student profile not found." });
        }

        const student = studentInfo[0];
        student.skills = skills;
        student.projects = projects;

        res.status(200).json(student);

    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ message: "Internal server error while fetching student profile" });
    }
};

/**
 * Update subjective profile data of the logged-in student
 * PUT /api/student/profile/subjective
 */
const updateStudentSubjectiveProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.user.id;
        const { fullName, phone, bio, resume_url, linkedin_url, github_url, address, skills, projects, achievements } = req.body;

        await connection.beginTransaction();

        // Ensure achievements table exists (safe in runtime for now)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS student_achievements (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                student_id BIGINT NOT NULL,
                achievement_text VARCHAR(1000) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (student_id)
            )
        `);

        // 1. Update student_profiles table
        const profileUpdateFields = [];
        const profileUpdateValues = [];

        if (resume_url !== undefined) { profileUpdateFields.push('resume_url = ?'); profileUpdateValues.push(resume_url); }
        if (linkedin_url !== undefined) { profileUpdateFields.push('linkedin_url = ?'); profileUpdateValues.push(linkedin_url); }
        if (github_url !== undefined) { profileUpdateFields.push('github_url = ?'); profileUpdateValues.push(github_url); }
        if (address !== undefined) { profileUpdateFields.push('address = ?'); profileUpdateValues.push(address); }
        if (fullName !== undefined) { profileUpdateFields.push('full_name = ?'); profileUpdateValues.push(fullName); }
        if (phone !== undefined) { profileUpdateFields.push('phone = ?'); profileUpdateValues.push(phone); }
        if (bio !== undefined) { profileUpdateFields.push('bio = ?'); profileUpdateValues.push(bio); }

        if (profileUpdateFields.length > 0) {
            profileUpdateValues.push(userId);
            // student_profiles uses student_id which maps to users.id
            const [existingProfile] = await connection.execute('SELECT student_id FROM student_profiles WHERE student_id = ?', [userId]);

            if (existingProfile.length > 0) {
                await connection.execute(
                    `UPDATE student_profiles SET ${profileUpdateFields.join(', ')} WHERE student_id = ?`,
                    profileUpdateValues
                );
            } else {
                // If profile doesn't exist, create it (should ideally exist from student creation, but just in case)
                await connection.execute(
                    `INSERT INTO student_profiles (student_id, resume_url, linkedin_url, github_url, address, full_name, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [userId, resume_url || null, linkedin_url || null, github_url || null, address || null, fullName || null, phone || null, bio || null]
                );
            }
        }

        // 2. Update student_skills table
        if (skills && Array.isArray(skills)) {
            // Remove existing skills to replace with new ones
            await connection.execute('DELETE FROM student_skills WHERE student_id = ?', [userId]);

            // De-duplicate incoming skills to avoid duplicate (student_id, skill_id) inserts
            const normalizeSkill = (v) =>
                String(v || '')
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .trim();
            const seenSkills = new Set();

            for (const skill of skills) {
                const { name } = skill;
                if (!name) continue;
                const normalizedName = normalizeSkill(name);
                if (!normalizedName || seenSkills.has(normalizedName)) continue;
                seenSkills.add(normalizedName);

                // Check if skill exists in `skills` table
                let skillId;
                const [existingSkill] = await connection.execute(
                    'SELECT id FROM skills WHERE LOWER(name) = LOWER(?) LIMIT 1',
                    [String(name).trim()]
                );

                if (existingSkill.length > 0) {
                    skillId = existingSkill[0].id;
                } else {
                    // Create new skill
                    const [newSkill] = await connection.execute('INSERT INTO skills (name) VALUES (?)', [String(name).trim()]);
                    skillId = newSkill.insertId;
                }

                // Map student to skill
                await connection.execute(
                    `INSERT IGNORE INTO student_skills (student_id, skill_id)
                     VALUES (?, ?)`,
                    [userId, skillId]
                );
            }
        }

        // 3. Update projects table
        if (projects && Array.isArray(projects)) {
            // Remove existing projects to replace with new ones
            await connection.execute('DELETE FROM projects WHERE student_id = ?', [userId]);

            for (const project of projects) {
                const { title, description, project_link } = project;
                if (!title) continue;

                await connection.execute(
                    'INSERT INTO projects (student_id, title, description, project_link) VALUES (?, ?, ?, ?)',
                    [userId, title, description || null, project_link || null]
                );
            }
        }

        // 4. Update achievements table
        if (achievements && Array.isArray(achievements)) {
            await connection.execute('DELETE FROM student_achievements WHERE student_id = ?', [userId]);
            for (const item of achievements) {
                const text = typeof item === 'string' ? item.trim() : '';
                if (!text) continue;
                await connection.execute(
                    'INSERT INTO student_achievements (student_id, achievement_text) VALUES (?, ?)',
                    [userId, text.slice(0, 1000)]
                );
            }
        }

        await connection.commit();
        res.status(200).json({ message: "Profile updated successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error updating subjective student profile:", error);
        res.status(500).json({ message: "Internal server error while updating profile." });
    } finally {
        connection.release();
    }
};

/**
 * List "OPEN" drives where student meets CGPA and backlog criteria
 * GET /api/student/jobs
 */
const getEligibleJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch student's academic criteria
        const [students] = await db.execute(
            'SELECT current_cgpa, active_backlogs FROM students WHERE user_id = ?',
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: "Student record not found." });
        }

        const student = students[0];
        const cgpa = student.current_cgpa || 0;
        const backlogs = student.active_backlogs || 0;

        const scope = scopeFromInstitutionId(req.user.institution_id);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        const { clause: driveClause, params: driveParams } = driveTenantClause(scope, 'd');

        // 2. Query open jobs directly matching the numeric criteria
        const [jobs] = await db.execute(`
            SELECT 
                j.id AS job_id, 
                j.job_title, 
                j.package_value, 
                j.location, 
                j.min_cgpa, 
                j.max_backlogs_allowed,
                j.eligible_branches,
                d.id AS drive_id, 
                d.drive_name, 
                d.end_date,
                r.company_name
            FROM job_postings j
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE d.status = 'OPEN' 
              AND j.is_active = TRUE
              AND j.min_cgpa <= ?
              AND j.max_backlogs_allowed >= ?
              AND ${driveClause}
            ORDER BY d.end_date ASC
        `, [cgpa, backlogs, ...driveParams]);

        res.status(200).json({
            count: jobs.length,
            jobs: jobs
        });

    } catch (error) {
        console.error("Error fetching eligible jobs:", error);
        res.status(500).json({ message: "Internal server error while fetching jobs" });
    }
};

/**
 * View details of a specific job
 * GET /api/student/jobs/:id
 */
const getJobDetails = async (req, res) => {
    try {
        const jobIdParsed = parsePositiveInt(req.params.id, 'job id');
        if (!jobIdParsed.ok) {
            return res.status(400).json({ message: jobIdParsed.message });
        }
        const jobId = jobIdParsed.value;

        const scope = scopeFromInstitutionId(req.user.institution_id);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        const { clause: driveClause, params: driveParams } = driveTenantClause(scope, 'd');

        const [jobs] = await db.execute(`
            SELECT 
                j.id AS job_id, 
                j.job_title, 
                j.job_description,
                j.package_value, 
                j.location, 
                j.min_cgpa, 
                j.max_backlogs_allowed,
                j.eligible_branches,
                d.id AS drive_id, 
                d.drive_name, 
                d.description AS drive_description,
                d.start_date,
                d.end_date,
                r.company_name,
                r.industry_type,
                r.website
            FROM job_postings j
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE j.id = ? 
              AND d.status = 'OPEN' 
              AND j.is_active = TRUE
              AND ${driveClause}
        `, [jobId, ...driveParams]);

        if (jobs.length === 0) {
            return res.status(404).json({ message: "Job not found or is no longer active." });
        }

        res.status(200).json(jobs[0]);

    } catch (error) {
        console.error("Error fetching job details:", error);
        res.status(500).json({ message: "Internal server error while fetching job details" });
    }
};

/**
 * Apply for a specific job posting
 * POST /api/student/jobs/:id/apply
 * Includes Policy Checks: Debarred status, Academic Criteria, and Dream Offer Rules
 */
const applyForJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobIdParsed = parsePositiveInt(req.params.id, 'job id');
        if (!jobIdParsed.ok) {
            return res.status(400).json({ message: jobIdParsed.message });
        }
        const jobId = jobIdParsed.value;

        // 1. Fetch Student Profile & Status
        const [students] = await db.execute(`
            SELECT 
                current_cgpa, 
                active_backlogs, 
                is_debarred, 
                debar_reason, 
                is_placed, 
                current_package_value 
            FROM students 
            WHERE user_id = ?
        `, [userId]);

        if (students.length === 0) {
            return res.status(404).json({ message: "Student record not found." });
        }

        const student = students[0];

        // Policy Check 1: Is Debarred?
        if (student.is_debarred) {
            return res.status(403).json({ 
                message: "You are currently debarred from placements.", 
                reason: student.debar_reason 
            });
        }

        // 2. Fetch Job Details
        const [jobs] = await db.execute(`
            SELECT 
                j.id, 
                j.min_cgpa, 
                j.max_backlogs_allowed, 
                j.package_value,
                d.status AS drive_status
            FROM job_postings j
            JOIN recruitment_drives d ON j.drive_id = d.id
            WHERE j.id = ? AND j.is_active = TRUE
        `, [jobId]);

        if (jobs.length === 0) {
            return res.status(404).json({ message: "Job not found or inactive." });
        }

        const job = jobs[0];

        // Policy Check 2: Drive Status
        if (job.drive_status !== 'OPEN' && job.drive_status !== 'ONGOING') {
            return res.status(400).json({ message: "This recruitment drive is closed for applications." });
        }

        // Policy Check 3: Academic Criteria
        if ((student.current_cgpa || 0) < job.min_cgpa) {
             return res.status(400).json({ message: "You do not meet the minimum CGPA requirement for this job." });
        }
        
        if ((student.active_backlogs || 0) > job.max_backlogs_allowed) {
             return res.status(400).json({ message: "You have more active backlogs than allowed for this job." });
        }

        // Policy Check 4: Dream Offer Rule
        // If the student is already placed, they can only apply if the new job offers a significantly higher package.
        // Rule: New package must be strictly greater than current package (can inject 1.3x multiplier or Similar here if strict Dream Offer)
        if (student.is_placed) {
            const currentPackage = parseFloat(student.current_package_value || 0);
            const newPackage = parseFloat(job.package_value || 0);

            if (newPackage <= currentPackage) {
                return res.status(403).json({ 
                    message: "Dream Offer Policy Violation: You are already placed and this job's package does not exceed your current offer." 
                });
            }
        }

        // 3. Check if already applied
        const [existingApp] = await db.execute(
            'SELECT id FROM applications WHERE student_id = ? AND job_id = ?',
            [userId, jobId]
        );

        if (existingApp.length > 0) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        // 4. Submit Application
        await db.execute(
            'INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)',
            [userId, jobId, 'APPLIED']
        );

        res.status(201).json({ message: "Successfully applied for the job." });

    } catch (error) {
        console.error("Error applying for job:", error);
        // Handle unique constraint error if multiple rapid requests sneak past the check
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(400).json({ message: "You have already applied for this job." });
        }
        res.status(500).json({ message: "Internal server error while applying for job." });
    }
};

/**
 * View status of all applications for the logged-in student
 * GET /api/student/applications
 */
const getApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const [applications] = await db.execute(`
            SELECT 
                a.id AS application_id, 
                a.status AS application_status, 
                a.current_round, 
                a.applied_at,
                j.id AS job_id, 
                j.job_title, 
                j.package_value,
                d.id AS drive_id, 
                d.drive_name, 
                r.company_name
            FROM applications a
            JOIN job_postings j ON a.job_id = j.id
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE a.student_id = ?
            ORDER BY a.applied_at DESC
        `, [userId]);

        res.status(200).json({
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error while fetching applications" });
    }
};

/**
 * Withdraw an application
 * DELETE /api/student/applications/:id
 */
const withdrawApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const appIdParsed = parsePositiveInt(req.params.id, 'application id');
        if (!appIdParsed.ok) {
            return res.status(400).json({ message: appIdParsed.message });
        }
        const applicationId = appIdParsed.value;

        // Ensure the application belongs to the logged-in student
        const [application] = await db.execute(
            'SELECT id FROM applications WHERE id = ? AND student_id = ?',
            [applicationId, userId]
        );

        if (application.length === 0) {
            return res.status(404).json({ message: "Application not found or unauthorized to withdraw." });
        }

        await db.execute('DELETE FROM applications WHERE id = ?', [applicationId]);

        res.status(200).json({ message: "Application withdrawn successfully." });

    } catch (error) {
        console.error("Error withdrawing application:", error);
        res.status(500).json({ message: "Internal server error while withdrawing application" });
    }
};

/**
 * Get department events for the logged-in student
 * GET /api/student/dept-events
 */
const getDeptEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const [studentResult] = await db.execute(
            'SELECT department_id FROM students WHERE user_id = ?',
            [userId]
        );

        if (studentResult.length === 0) {
            return res.status(404).json({ message: "Student not found." });
        }

        const deptId = studentResult[0].department_id;

        const [events] = await db.execute(
            `SELECT id, title, date, type, meeting_link, mode, target_batch 
             FROM dept_events 
             WHERE department_id = ? 
               AND date >= NOW()
               AND (expires_at IS NULL OR expires_at >= NOW())
             ORDER BY date ASC`,
            [deptId]
        );

        res.status(200).json(events);
    } catch (error) {
        console.error("Error in getDeptEvents (Student):", error);
        res.status(500).json({ message: "Internal server error while fetching department events" });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find institution_id for this student
        const [userResult] = await db.query('SELECT institution_id FROM users WHERE id = ?', [userId]);
        if (userResult.length === 0 || !userResult[0].institution_id) {
            return res.status(403).json({ message: "Institution context missing" });
        }
        
        const institutionId = userResult[0].institution_id;
        
        const [announcements] = await db.query(
            `SELECT id, title, message, is_important, created_at, expires_at 
             FROM announcements 
             WHERE institution_id = ? 
               AND (expires_at IS NULL OR expires_at >= NOW())
             ORDER BY is_important DESC, created_at DESC 
             LIMIT 10`,
            [institutionId]
        );
        
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getStudentProfile,
    updateStudentSubjectiveProfile,
    getEligibleJobs,
    getJobDetails,
    applyForJob,
    getApplications,
    withdrawApplication,
    getDeptEvents,
    getAnnouncements
};


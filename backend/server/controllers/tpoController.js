const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Legacy email import removed in favor of utils/emailSender
const { createNotification } = require('./notificationController');
const {
    getTenantScope,
    studentInstitutionClause,
    assertApplicationInScope,
    assertStudentUserInScope,
    recruiterInstitutionClause,
    resolveInstitutionId,
    assertRecruiterInScope,
    assertDriveInScope,
    ensureRecruiterInstitutionColumn,
    getDriveScopeFilter,
    insertRecruiterForScope,
    findRecruiterIdByNameForScope,
} = require('../middleware/institutionScope');
const { parsePositiveInt, parsePagination } = require('../utils/validateParams');

const createDeptHead = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { name, email, department_id } = req.body;
        const deptIdParsed = parsePositiveInt(department_id, 'department_id');
        if (!deptIdParsed.ok) {
            return res.status(400).json({ message: deptIdParsed.message });
        }

        // 1. Validate all fields exist
        if (!name || !email) {
            return res.status(400).json({ message: "All fields (name, email, department_id) are required" });
        }

        // 2. Check email not already in users table
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // 3. Generate random password (8 characters)
        const temporaryPassword = crypto.randomBytes(4).toString('hex'); // 8 char hex string

        // 4. Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Start Transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 5. Insert into users
            const [userResult] = await connection.query(
                `INSERT INTO users (institution_id, email, password_hash, role, must_change_password) VALUES (?, ?, ?, 'TPO_HEAD', 1)`,
                [scope.institutionId, email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            // 6. Insert into tpo_heads
            await connection.query(
                `INSERT INTO tpo_heads (user_id, name, department_id) VALUES (?, ?, ?)`,
                [newUserId, name, deptIdParsed.value]
            );

            // 7. Insert audit log
            // actor_user_id = req.user.id (assuming verifyToken adds user to req)
            const actorUserId = req.user ? req.user.id : null;

            await connection.query(
                `INSERT INTO audit_logs (actor_user_id, action_type, target_table, target_id) VALUES (?, 'CREATE_DEPT_HEAD', 'users', ?)`,
                [actorUserId, newUserId]
            );

            await connection.commit();

            // 8. Send Email with Credentials
            const { sendEmail } = require('../utils/emailSender');
            const EmailTemplateService = require('../services/EmailTemplateService');

            const template = await EmailTemplateService.getTemplate('dept_head_credentials');
            const { subject, html, text } = EmailTemplateService.render(template, {
                name,
                email,
                password: temporaryPassword
            });

            const emailResult = await sendEmail({
                to: email,
                subject: subject || 'Your Department Head Account Credentials',
                html: html,
                text: text || `Your credentials: Email: ${email}, Password: ${temporaryPassword}`
            });

            const emailSent = emailResult.success;

            if (!emailSent) {
                console.warn("User created but failed to send email to:", email);
            }

            // 9. Return JSON
            res.status(201).json({
                message: "Dept Head created successfully",
                email: email,
                email_sent: emailSent
            });

        } catch (err) {
            await connection.rollback();
            console.error("Transaction Error:", err);
            res.status(500).json({ message: "Failed to create Dept Head due to server error" });
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error("Error creating Dept Head:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get all Department Heads
 * GET /api/TPO/dept-heads
 */
const getDeptHeads = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const [deptHeads] = await db.query(`
            SELECT 
                u.id AS user_id,
                h.name,
                u.email,
                h.department_id,
                d.name AS department_name,
                u.is_active
            FROM users u
            JOIN tpo_heads h ON u.id = h.user_id
            JOIN departments d ON h.department_id = d.id
            WHERE u.role = 'TPO_HEAD' AND u.institution_id = ?
        `, [scope.institutionId]);

        res.status(200).json({
            count: deptHeads.length,
            dept_heads: deptHeads
        });

    } catch (error) {
        console.error("Error fetching dept heads:", error);
        res.status(500).json({ message: "Internal Server Error while fetching Department Heads" });
    }
};

/**
 * Get Audit Logs
 * GET /api/TPO/audit-logs
 */
const getAuditLogs = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const [logs] = await db.query(`
            SELECT 
                al.id,
                al.actor_user_id,
                al.action_type,
                al.target_table,
                al.target_id,
                al.timestamp
            FROM audit_logs al
            LEFT JOIN users actor ON actor.id = al.actor_user_id
            WHERE actor.institution_id = ? OR al.actor_user_id IS NULL
            ORDER BY al.timestamp DESC
            LIMIT 100
        `, [scope.institutionId]);

        res.status(200).json({
            count: logs.length,
            logs: logs
        });

    } catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ message: "Internal Server Error while fetching Audit Logs" });
    }
};

/**
 * Create a new Company (Recruiter Profile)
 * POST /api/TPO/companies
 */
const createCompany = async (req, res) => {
    try {
        const { name, hr_email } = req.body;

        // 1. Validate Input
        if (!name) {
            return res.status(400).json({ message: "Company name is required" });
        }

        const scope = getTenantScope(req) || { institutionId: resolveInstitutionId(req), departmentId: null };
        if (!scope?.institutionId) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const companyId = await insertRecruiterForScope(db, scope, {
            companyName: name,
            contactEmail: hr_email || null,
        });

        if (req.user?.id) {
            await db.query(
                `INSERT INTO audit_logs (actor_user_id, action_type, target_table, target_id)
                 VALUES (?, 'CREATE_COMPANY', 'recruiters', ?)`,
                [req.user.id, companyId]
            );
        }

        res.status(201).json({
            message: "Company created successfully",
            company_id: companyId
        });

    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ message: "Internal Server Error while creating company" });
    }
};

/**
 * Create a new Recruitment Drive
 * POST /api/TPO/drives
 */
const createDrive = async (req, res) => {
    try {
        const { recruiter_id, drive_name, description, start_date, end_date } = req.body;

        // 1. Validate Required Fields
        if (!recruiter_id || !drive_name) {
            return res.status(400).json({ message: "recruiter_id and drive_name are required" });
        }

        const recruiterCheck = await assertRecruiterInScope(req, recruiter_id);
        if (!recruiterCheck.ok) {
            return res.status(recruiterCheck.status).json({ message: recruiterCheck.message });
        }

        const [result] = await db.query(
            `INSERT INTO recruitment_drives 
            (recruiter_id, drive_name, description, start_date, end_date, status) 
            VALUES (?, ?, ?, ?, ?, 'OPEN')`,
            [recruiter_id, drive_name, description || null, start_date || null, end_date || null]
        );

        if (req.user?.id) {
            await db.query(
                `INSERT INTO audit_logs (actor_user_id, action_type, target_table, target_id)
                 VALUES (?, 'CREATE_DRIVE', 'recruitment_drives', ?)`,
                [req.user.id, result.insertId]
            );
        }

        res.status(201).json({
            message: "Drive created successfully",
            drive_id: result.insertId
        });

    } catch (error) {
        console.error("Error creating drive:", error);
        res.status(500).json({ message: "Internal Server Error while creating recruitment drive" });
    }
};

/**
 * Add a Job Posting to a Recruitment Drive
 * POST /api/TPO/drives/:id/jobs
 */
const addJobToDrive = async (req, res) => {
    try {
        const driveId = req.params.id;
        const driveCheck = await assertDriveInScope(req, driveId);
        if (!driveCheck.ok) {
            return res.status(driveCheck.status).json({ message: driveCheck.message });
        }

        const {
            job_title,
            job_description,
            location,
            package_value,
            min_cgpa,
            max_backlogs_allowed,
            eligible_branches
        } = req.body;

        // 1. Validate Required Fields
        if (!job_title || !package_value) {
            return res.status(400).json({ message: "job_title and package_value are required" });
        }

        // 2. Insert into job_postings
        const [result] = await db.query(
            `INSERT INTO job_postings 
            (drive_id, job_title, job_description, location, 
             package_value, min_cgpa, max_backlogs_allowed, 
             eligible_branches, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [
                driveId,
                job_title,
                job_description || null,
                location || null,
                package_value,
                min_cgpa || 0.00,
                max_backlogs_allowed || 0,
                eligible_branches ? JSON.stringify(eligible_branches) : null
            ]
        );

        res.status(201).json({
            message: "Job added to drive successfully",
            job_id: result.insertId
        });

    } catch (error) {
        console.error("Error adding job to drive:", error);
        res.status(500).json({ message: "Internal Server Error while adding job to drive" });
    }
};

/**
 * Get all Recruitment Drives with Company Info and Job Count
 * GET /api/TPO/drives
 */
const getAllDrives = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        await ensureRecruiterInstitutionColumn();
        const { clause, params } = await getDriveScopeFilter(scope, 'd');

        const [drives] = await db.query(`
            SELECT 
                d.id,
                d.drive_name AS role,
                r.company_name AS companyName,
                d.description,
                d.status,
                d.start_date,
                d.end_date AS deadline,
                (SELECT COUNT(*) FROM job_postings j WHERE j.drive_id = d.id) AS job_count,
                (SELECT COUNT(*) FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.drive_id = d.id) AS application_count
            FROM recruitment_drives d
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE ${clause}
            GROUP BY d.id
            ORDER BY d.created_at DESC
        `, params);

        res.status(200).json({
            count: drives.length,
            drives: drives
        });

    } catch (error) {
        console.error("Error fetching all drives:", error);
        res.status(500).json({ message: "Internal Server Error while fetching recruitment drives" });
    }
};

/**
 * Update Recruitment Drive Status
 * PUT /api/TPO/drives/:id/status
 */
const updateDriveStatus = async (req, res) => {
    try {
        const driveId = req.params.id;
        const driveCheck = await assertDriveInScope(req, driveId);
        if (!driveCheck.ok) {
            return res.status(driveCheck.status).json({ message: driveCheck.message });
        }

        const { status } = req.body;

        const validStatuses = ['OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be one of: OPEN, ONGOING, COMPLETED, CANCELLED" });
        }

        const [result] = await db.query(
            'UPDATE recruitment_drives SET status = ? WHERE id = ?',
            [status, driveId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recruitment drive not found" });
        }

        res.status(200).json({
            message: "Drive status updated successfully"
        });

    } catch (error) {
        console.error("Error updating drive status:", error);
        res.status(500).json({ message: "Internal Server Error while updating recruitment drive status" });
    }
};

/**
 * Update Application Status
 * PUT /api/TPO/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const appIdParsed = parsePositiveInt(req.params.id, 'application id');
        if (!appIdParsed.ok) {
            return res.status(400).json({ message: appIdParsed.message });
        }
        const applicationId = appIdParsed.value;

        const access = await assertApplicationInScope(req, applicationId);
        if (!access.ok) {
            return res.status(access.status).json({ message: access.message });
        }

        const { status, current_round } = req.body;

        const validStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const updates = [];
        const values = [];

        if (status) {
            updates.push('status = ?');
            values.push(status);
        }
        if (current_round !== undefined) {
            updates.push('current_round = ?');
            values.push(current_round);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields provided to update." });
        }

        values.push(applicationId);

        const [result] = await db.query(
            `UPDATE applications SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Application not found." });
        }

        // --- Trigger Notification ---
        if (status) {
            try {
                // Get student_id of the application
                const [appResult] = await db.query(
                    'SELECT student_id FROM applications WHERE id = ?',
                    [applicationId]
                );

                if (appResult.length > 0) {
                    const studentId = appResult[0].student_id;
                    const notifyMessage = current_round
                        ? `Your application status is now ${status} (${current_round})`
                        : `Your application status is now ${status}`;

                    // Create Notification
                    await createNotification(
                        studentId,
                        "Application Update",
                        notifyMessage
                    );
                }
            } catch (notifErr) {
                console.error("Error creating notification: ", notifErr);
            }
        }
        // ----------------------------

        res.status(200).json({ message: "Application status updated successfully." });

    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Internal server error while updating application status" });
    }
};

/**
 * Get all student applications (TPO View)
 * GET /api/TPO/applications
 */
const getAllApplications = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        const { search = '', branch = 'all', status = 'all', company = 'all', drive = 'all' } = req.query;
        const { page, limit: limitInt, offset } = parsePagination(req.query);

        let whereClauses = [];
        let queryParams = [];

        const tenantFilter = studentInstitutionClause(scope);
        whereClauses.push(tenantFilter.clause);
        queryParams.push(...tenantFilter.params);

        if (search) {
            whereClauses.push(`(s.roll_number LIKE ? OR u.email LIKE ? OR sp.full_name LIKE ? OR dept.name LIKE ? OR r.company_name LIKE ? OR j.job_title LIKE ? OR d.drive_name LIKE ?)`);
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (branch !== 'all') {
            whereClauses.push(`dept.name = ?`);
            queryParams.push(branch);
        }

        if (company !== 'all') {
            whereClauses.push(`r.company_name = ?`);
            queryParams.push(company);
        }

        if (drive !== 'all') {
            const driveIdParsed = parsePositiveInt(drive, 'drive');
            if (!driveIdParsed.ok) {
                return res.status(400).json({ message: driveIdParsed.message });
            }
            whereClauses.push(`d.id = ?`);
            queryParams.push(driveIdParsed.value);
        }

        const applicationStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];
        if (applicationStatuses.includes(status)) {
            whereClauses.push(`a.status = ?`);
            queryParams.push(status);
        } else if (status === 'placed') {
            whereClauses.push(`s.is_placed = 1`);
        } else if (status === 'unplaced') {
            whereClauses.push(`s.is_placed = 0`);
        } else if (status === 'at_risk') {
            whereClauses.push(`(s.current_cgpa < 6.0 OR s.active_backlogs > 0)`);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const fromSql = `
            FROM applications a
            JOIN students s ON a.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            JOIN departments dept ON s.department_id = dept.id
            JOIN job_postings j ON a.job_id = j.id
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
        `;

        const [countResult] = await db.query(`
            SELECT COUNT(*) AS total
            ${fromSql}
            ${whereSql}
        `, queryParams);

        const [summaryResult] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN a.status = 'SELECTED' THEN 1 ELSE 0 END) AS selected,
                SUM(CASE WHEN a.status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED') THEN 1 ELSE 0 END) AS in_pipeline,
                AVG(CASE WHEN a.status = 'SELECTED' THEN COALESCE(j.package_value, 0) END) AS avg_package
            ${fromSql}
            ${whereSql}
        `, queryParams);

        const totalItems = countResult[0].total;
        const totalPages = Math.max(1, Math.ceil(totalItems / limitInt));

        const [applications] = await db.query(`
            SELECT 
                a.id,
                a.student_id,
                a.job_id,
                u.email AS student_email,
                sp.full_name AS student_name,
                s.roll_number,
                j.job_title,
                j.package_value,
                r.company_name,
                d.id AS drive_id,
                d.drive_name,
                a.status,
                a.current_round,
                a.applied_at,
                dept.name AS branch
            ${fromSql}
            ${whereSql}
            ORDER BY a.applied_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, limitInt, offset]);

        const summaryRow = summaryResult[0] || {};
        res.status(200).json({
            count: totalItems,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit: limitInt
            },
            summary: {
                total: Number(summaryRow.total || 0),
                selected: Number(summaryRow.selected || 0),
                inPipeline: Number(summaryRow.in_pipeline || 0),
                avgPackage: summaryRow.avg_package != null
                    ? Number(Number(summaryRow.avg_package).toFixed(1))
                    : null,
            },
            applications
        });

    } catch (error) {
        console.error("Error fetching all applications:", error);
        res.status(500).json({ message: "Internal server error while fetching applications" });
    }
};

/**
 * Get all students with filtering and pagination (TPO View)
 * GET /api/TPO/students
 */
const getStudentsList = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { search = '', branch = 'all', status = 'all' } = req.query;
        const { page, limit: limitInt, offset } = parsePagination(req.query);

        let whereClauses = [];
        let queryParams = [];

        const tenantFilter = studentInstitutionClause(scope);
        whereClauses.push(tenantFilter.clause);
        queryParams.push(...tenantFilter.params);

        // 1. Search filter
        if (search) {
            whereClauses.push(`(s.roll_number LIKE ? OR u.email LIKE ? OR sp.full_name LIKE ? OR d.name LIKE ?)`);
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // 2. Branch filter (accept department id or name)
        if (branch !== 'all') {
            const branchId = parsePositiveInt(branch, 'branch');
            if (branchId.ok) {
                whereClauses.push(`d.id = ?`);
                queryParams.push(branchId.value);
            } else {
                whereClauses.push(`d.name = ?`);
                queryParams.push(branch);
            }
        }

        // 3. Status filter
        if (status === 'placed') {
            whereClauses.push(`s.is_placed = 1`);
        } else if (status === 'unplaced') {
            whereClauses.push(`s.is_placed = 0`);
        } else if (status === 'at_risk') {
            whereClauses.push(`(s.current_cgpa < 6.0 OR s.active_backlogs > 0)`);
        } else if (status === 'ready') {
            whereClauses.push(`s.is_placed = 0 AND s.current_cgpa >= 6.0 AND s.active_backlogs = 0`);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const fromSql = `
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            LEFT JOIN departments d ON s.department_id = d.id
        `;

        const [countResult] = await db.query(`
            SELECT COUNT(*) AS total
            ${fromSql}
            ${whereSql}
        `, queryParams);

        const [summaryResult] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN s.is_placed = 1 THEN 1 ELSE 0 END) AS placed,
                SUM(CASE WHEN s.is_placed = 0 AND s.current_cgpa >= 6.0 AND s.active_backlogs = 0 THEN 1 ELSE 0 END) AS placement_ready,
                SUM(CASE WHEN s.current_cgpa < 6.0 OR s.active_backlogs > 0 THEN 1 ELSE 0 END) AS at_risk
            ${fromSql}
            ${whereSql}
        `, queryParams);

        const totalItems = countResult[0].total;
        const totalPages = Math.max(1, Math.ceil(totalItems / limitInt));

        const [students] = await db.query(`
            SELECT 
                s.user_id, 
                s.roll_number, 
                u.email, 
                sp.full_name, 
                d.name AS branch,
                d.id AS department_id,
                s.current_cgpa, 
                s.active_backlogs, 
                s.is_placed,
                s.current_package_value,
                (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS skills_count,
                (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.user_id) AS application_count,
                (CASE WHEN sp.resume_url IS NOT NULL AND sp.resume_url != '' THEN 1 ELSE 0 END) AS has_resume
            ${fromSql}
            ${whereSql}
            ORDER BY s.roll_number ASC
            LIMIT ? OFFSET ?
        `, [...queryParams, limitInt, offset]);

        const summaryRow = summaryResult[0] || {};
        res.status(200).json({
            students,
            summary: {
                total: Number(summaryRow.total || 0),
                placed: Number(summaryRow.placed || 0),
                placementReady: Number(summaryRow.placement_ready || 0),
                atRisk: Number(summaryRow.at_risk || 0),
            },
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit: limitInt
            }
        });

    } catch (error) {
        console.error("Error fetching students list:", error);
        res.status(500).json({ message: "Internal server error while fetching students" });
    }
};

/**
 * Get full student detail for TPO (profile + applications)
 * GET /api/TPO/students/:id
 */
const getStudentDetail = async (req, res) => {
    try {
        console.log("HIT getStudentDetail route for id:", req.params.id);
        const studentIdParsed = parsePositiveInt(req.params.id, 'student id');
        if (!studentIdParsed.ok) {
            return res.status(400).json({ message: studentIdParsed.message });
        }
        const studentId = studentIdParsed.value;

        const access = await assertStudentUserInScope(req, studentId);
        if (!access.ok) {
            return res.status(access.status).json({ message: access.message });
        }

        const [studentRows] = await db.query(`
            SELECT
                s.user_id,
                s.roll_number,
                s.current_cgpa,
                s.active_backlogs,
                s.tenth_marks,
                s.twelfth_marks,
                s.is_placed,
                s.current_package_value,
                s.is_debarred,
                s.debar_reason,
                u.email,
                u.is_active,
                d.name AS branch,
                d.code AS department_code,
                sp.full_name,
                sp.resume_url,
                sp.linkedin_url,
                sp.github_url,
                sp.address
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            WHERE s.user_id = ?
        `, [studentId]);

        if (studentRows.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const student = studentRows[0];

        const [skills] = await db.query(`
            SELECT sk.name
            FROM student_skills ss
            JOIN skills sk ON ss.skill_id = sk.id
            WHERE ss.student_id = ?
            ORDER BY sk.name ASC
        `, [studentId]);

        const [applications] = await db.query(`
            SELECT
                a.id,
                a.status,
                a.current_round,
                a.applied_at,
                j.job_title,
                j.package_value,
                r.company_name,
                d.drive_name
            FROM applications a
            JOIN job_postings j ON a.job_id = j.id
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            WHERE a.student_id = ?
            ORDER BY a.applied_at DESC
        `, [studentId]);

        const [performance] = await db.query(`
            SELECT amcat_quant, amcat_verbal, amcat_logical, coding_test_score, mock_interview_score, endsem_percentage
            FROM student_performance_metrics
            WHERE student_id = ?
        `, [studentId]);

        res.status(200).json({
            ...student,
            skills,
            applications,
            performance: performance.length > 0 ? performance[0] : null,
        });
    } catch (error) {
        console.error('Error fetching student detail:', error);
        res.status(500).json({ message: 'Internal server error while fetching student details' });
    }
};

/**
 * Get all Companies (Recruiters)
 * GET /api/TPO/companies
 */
const getCompanies = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }
        await ensureRecruiterInstitutionColumn();
        const { clause, params } = recruiterInstitutionClause(scope);
        const [companies] = await db.query(
            `SELECT * FROM recruiters r WHERE ${clause} ORDER BY r.company_name ASC`,
            params
        );
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Quick Create Drive (Recruiter + Drive + Job)
 * POST /api/TPO/drives/quick
 */
const quickCreateDrive = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const {
            companyName,
            role,
            description,
            requirements,
            minCgpa,
            maxBacklogs,
            applicationLink,
            deadline
        } = req.body;

        if (!companyName || !role) {
            return res.status(400).json({ message: "Company Name and Role are required" });
        }

        const scope = getTenantScope(req) || { institutionId: resolveInstitutionId(req), departmentId: null };
        if (!scope?.institutionId) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        // 1. Find or Create Recruiter (scoped to institution when column exists)
        let recruiterId = await findRecruiterIdByNameForScope(connection, scope, companyName);
        if (!recruiterId) {
            recruiterId = await insertRecruiterForScope(connection, scope, { companyName });
        }

        // 2. Create Drive
        const [driveResult] = await connection.query(
            'INSERT INTO recruitment_drives (recruiter_id, drive_name, status) VALUES (?, ?, "OPEN")',
            [recruiterId, `${companyName} - ${role}`]
        );
        const driveId = driveResult.insertId;

        // 3. Create Job Posting
        // Default package_value to 0 if not provided
        const [jobResult] = await connection.query(
            `INSERT INTO job_postings 
            (drive_id, job_title, job_description, package_value, min_cgpa, max_backlogs_allowed, eligible_branches) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                driveId,
                role,
                description || null,
                0, // package_value
                minCgpa || 0,
                maxBacklogs || 0,
                JSON.stringify([]) // branches
            ]
        );

        // 4. Create Audit Log
        const actorUserId = req.user ? req.user.id : null;
        await connection.query(
            `INSERT INTO audit_logs (actor_user_id, action_type, target_table, target_id, description) 
             VALUES (?, 'QUICK_CREATE_DRIVE', 'recruitment_drives', ?, ?)`,
            [actorUserId, driveId, `Created drive for ${companyName}`]
        );

        await connection.commit();
        res.status(201).json({
            message: "Drive created successfully",
            driveId,
            jobId: jobResult.insertId
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error in quickCreateDrive:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        connection.release();
    }
};

/**
 * Update a Recruitment Drive
 * PUT /api/TPO/drives/:id
 */
const updateDrive = async (req, res) => {
    try {
        const driveId = req.params.id;
        const driveCheck = await assertDriveInScope(req, driveId);
        if (!driveCheck.ok) {
            return res.status(driveCheck.status).json({ message: driveCheck.message });
        }

        const { drive_name, description, start_date, end_date, status } = req.body;

        const [result] = await db.query(
            `UPDATE recruitment_drives 
             SET drive_name = ?, description = ?, start_date = ?, end_date = ?, status = ?
             WHERE id = ?`,
            [drive_name, description || null, start_date || null, end_date || null, status || 'OPEN', driveId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Drive not found" });
        }

        res.status(200).json({ message: "Drive updated successfully" });
    } catch (error) {
        console.error("Error updating drive:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Delete a Recruitment Drive
 * DELETE /api/TPO/drives/:id
 */
const deleteDrive = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const driveId = req.params.id;
        const driveCheck = await assertDriveInScope(req, driveId);
        if (!driveCheck.ok) {
            await connection.rollback();
            connection.release();
            return res.status(driveCheck.status).json({ message: driveCheck.message });
        }

        // 1. Delete associated jobs first (due to foreign key or to be safe)
        await connection.query('DELETE FROM job_postings WHERE drive_id = ?', [driveId]);

        // 2. Delete the drive
        const [result] = await connection.query('DELETE FROM recruitment_drives WHERE id = ?', [driveId]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Drive not found" });
        }

        // 3. Log the action
        const actorUserId = req.user ? req.user.id : null;
        await connection.query(
            `INSERT INTO audit_logs (actor_user_id, action_type, target_table, target_id, description) 
             VALUES (?, 'DELETE_DRIVE', 'recruitment_drives', ?, ?)`,
            [actorUserId, driveId, `Deleted drive ID ${driveId}`]
        );

        await connection.commit();
        res.status(200).json({ message: "Drive deleted successfully" });
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting drive:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        connection.release();
    }
};
const createAnnouncement = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { title, message, expires_at, is_important } = req.body;
        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required" });
        }

        const [result] = await db.query(
            `INSERT INTO announcements (title, message, institution_id, created_by, expires_at, is_important) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, message, scope.institutionId, req.user ? req.user.id : null, expires_at || null, is_important ? 1 : 0]
        );

        res.status(201).json({ message: "Announcement created successfully", id: result.insertId });
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const limit = parseInt(req.query.limit, 10) || 50;

        const [rows] = await db.query(
            `SELECT id, title, message, expires_at, is_important, created_at 
             FROM announcements 
             WHERE institution_id = ? 
             ORDER BY is_important DESC, created_at DESC 
             LIMIT ?`,
            [scope.institutionId, limit]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { id } = req.params;
        const { title, message, expires_at, is_important } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required" });
        }

        const [result] = await db.query(
            `UPDATE announcements SET title = ?, message = ?, expires_at = ?, is_important = ? WHERE id = ? AND institution_id = ?`,
            [title, message, expires_at || null, is_important ? 1 : 0, id, scope.institutionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Announcement not found or unauthorized" });
        }

        res.status(200).json({ message: "Announcement updated successfully" });
    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM announcements WHERE id = ? AND institution_id = ?`,
            [id, scope.institutionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Announcement not found or unauthorized" });
        }

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteDeptEvent = async (req, res) => {
    try {
        const { getTenantScope, scopeFromInstitutionId, resolveInstitutionId } = require('../middleware/institutionScope');
        const scope = getTenantScope(req) || scopeFromInstitutionId(resolveInstitutionId(req));
        if (!scope) return res.status(403).json({ message: 'Institution context required.' });
        const [result] = await db.query('DELETE d FROM dept_events d JOIN users u ON d.created_by = u.id WHERE d.id = ? AND u.institution_id = ?', [req.params.id, scope.institutionId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found or unauthorized' });
        res.json({ message: 'Department event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event' });
    }
};

module.exports = {
    createDeptHead,
    getDeptHeads,
    getAuditLogs,
    createCompany,
    getCompanies,
    createDrive,
    quickCreateDrive,
    addJobToDrive,
    getAllDrives,
    updateDrive,
    deleteDrive,
    updateDriveStatus,
    updateApplicationStatus,
    getAllApplications,
    getStudentsList,
    getStudentDetail,
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    deleteDeptEvent
};

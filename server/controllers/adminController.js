const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { createNotification } = require('./notificationController');

const createDeptHead = async (req, res) => {
    try {
        const { name, email, department_id } = req.body;

        // 1. Validate all fields exist
        if (!name || !email || !department_id) {
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
                `INSERT INTO users (email, password_hash, role, must_change_password) VALUES (?, ?, 'TPO_HEAD', 1)`,
                [email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            // 6. Insert into tpo_heads
            await connection.query(
                `INSERT INTO tpo_heads (user_id, name, department_id) VALUES (?, ?, ?)`,
                [newUserId, name, department_id]
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
            const emailSubject = 'Your Department Head Account Credentials';
            const emailHtml = `
                <h2>Welcome to Next Gen PBL System</h2>
                <p>Hello ${name},</p>
                <p>Your Department Head account has been successfully created.</p>
                <p>Here are your login credentials:</p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
                </ul>
                <p>Please log in and change your password as soon as possible.</p>
                <p>Best regards,<br>Next Gen PBL Team</p>
            `;

            const emailSent = await sendEmail({
                to: email,
                subject: emailSubject,
                html: emailHtml
            });

            if (!emailSent) {
                console.warn("User created but failed to send email to:", email);
            }

            // 9. Return JSON
            res.status(201).json({
                message: "Dept Head created successfully",
                email: email,
                email_sent: emailSent,
                temporary_password: temporaryPassword // Still returning it for manual sharing in case email fails
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
 * GET /api/admin/dept-heads
 */
const getDeptHeads = async (req, res) => {
    try {
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
            WHERE u.role = 'TPO_HEAD'
        `);

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
 * GET /api/admin/audit-logs
 */
const getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT 
                id,
                actor_user_id,
                action_type,
                target_table,
                target_id,
                timestamp
            FROM audit_logs
            ORDER BY timestamp DESC
            LIMIT 100
        `);

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
 * POST /api/admin/companies
 */
const createCompany = async (req, res) => {
    try {
        const { name, hr_email } = req.body;

        // 1. Validate Input
        if (!name) {
            return res.status(400).json({ message: "Company name is required" });
        }

        // 2. Insert into recruiters table
        // Mapping 'name' to 'company_name' and 'hr_email' to 'contact_email'
        const [result] = await db.query(
            'INSERT INTO recruiters (company_name, contact_email) VALUES (?, ?)',
            [name, hr_email || null]
        );

        res.status(201).json({
            message: "Company created successfully",
            company_id: result.insertId
        });

    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ message: "Internal Server Error while creating company" });
    }
};

/**
 * Create a new Recruitment Drive
 * POST /api/admin/drives
 */
const createDrive = async (req, res) => {
    try {
        const { recruiter_id, drive_name, description, start_date, end_date } = req.body;

        // 1. Validate Required Fields
        if (!recruiter_id || !drive_name) {
            return res.status(400).json({ message: "recruiter_id and drive_name are required" });
        }

        // 2. Insert into recruitment_drives
        const [result] = await db.query(
            `INSERT INTO recruitment_drives 
            (recruiter_id, drive_name, description, start_date, end_date, status) 
            VALUES (?, ?, ?, ?, ?, 'OPEN')`,
            [recruiter_id, drive_name, description || null, start_date || null, end_date || null]
        );

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
 * POST /api/admin/drives/:id/jobs
 */
const addJobToDrive = async (req, res) => {
    try {
        const driveId = req.params.id;
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
 * GET /api/admin/drives
 */
const getAllDrives = async (req, res) => {
    try {
        const [drives] = await db.query(`
            SELECT 
                d.id,
                d.drive_name,
                r.company_name,
                d.status,
                d.start_date,
                d.end_date,
                COUNT(j.id) AS job_count
            FROM recruitment_drives d
            JOIN recruiters r ON d.recruiter_id = r.id
            LEFT JOIN job_postings j ON d.id = j.drive_id
            GROUP BY d.id
            ORDER BY d.created_at DESC
        `);

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
 * PUT /api/admin/drives/:id/status
 */
const updateDriveStatus = async (req, res) => {
    try {
        const driveId = req.params.id;
        const { status } = req.body;

        // 1. Validate Status
        const validStatuses = ['OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be one of: OPEN, ONGOING, COMPLETED, CANCELLED" });
        }

        // 2. Update status in recruitment_drives
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
 * PUT /api/admin/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
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
 * Get all applications (Admin View)
 * GET /api/admin/applications
 */
const getAllApplications = async (req, res) => {
    try {
        const [applications] = await db.query(`
            SELECT 
                a.id AS application_id,
                a.status,
                a.current_round,
                a.applied_at,
                s.user_id AS student_id,
                s.roll_number,
                u.email AS student_email,
                sp.resume_url,
                j.job_title,
                d.drive_name,
                r.company_name
            FROM applications a
            JOIN students s ON a.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            JOIN job_postings j ON a.job_id = j.id
            JOIN recruitment_drives d ON j.drive_id = d.id
            JOIN recruiters r ON d.recruiter_id = r.id
            ORDER BY a.applied_at DESC
        `);

        res.status(200).json({
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        console.error("Error fetching admin applications:", error);
        res.status(500).json({ message: "Internal server error while fetching all applications" });
    }
};

module.exports = {
    createDeptHead,
    getDeptHeads,
    getAuditLogs,
    createCompany,
    createDrive,
    addJobToDrive,
    getAllDrives,
    updateDriveStatus,
    updateApplicationStatus,
    getAllApplications
};

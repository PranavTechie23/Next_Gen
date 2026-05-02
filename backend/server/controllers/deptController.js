const db = require('../config/db');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt'); // Use the existing bcrypt module
const crypto = require('crypto');
const sendEmail = require('../utils/email');

/** Returns true if the current database has the given column (for schema drift / legacy DBs). */
const hasColumn = async (tableName, columnName) => {
    try {
        const [rows] = await db.execute(
            `
            SELECT COUNT(*) AS c
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = ?
              AND column_name = ?
            `,
            [tableName, columnName]
        );
        return Number(rows?.[0]?.c || 0) > 0;
    } catch {
        return false;
    }
};

/**
 * Bulk upload students via Excel file
 * POST /api/dept/students/upload
 */
const uploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Please upload an Excel file." });
        }

        // 1. Parse Excel file from buffer using xlsx
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        
        // Assume data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!sheetData || sheetData.length === 0) {
            console.log("[DEV] Parsed Excel data is empty.");
            return res.status(400).json({ message: "The uploaded Excel file is empty." });
        }
        
        console.log(`[DEV] Parsed ${sheetData.length} rows from Excel file.`);
        // console.log("[DEV] First row sample:", sheetData[0]); // Optional: log the first row to see headers

        let createdCount = 0;
        let updatedCount = 0;
        const emailsToSend = [];
        
        // Fetch institution_id from the authenticated user (TPO_HEAD) if applicable, or fallback to null/1
        const institutionId = req.user && req.user.institution_id ? req.user.institution_id : null;

        const userId = req.user.id;
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const headDeptId = headResult[0].department_id;

        // 2. Get DB connection for transactions to ensure atomicity
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 3. Loop through the parsed JSON data
            for (const row of sheetData) {
                // Extract expected columns based on format
                const roll_number = row['roll_number'] || row['Roll Number'] || row['Roll_Number'];
                const email = row['email'] || row['Email'];
                const department_id = headDeptId; // Force to TPO_HEAD's department
                const current_cgpa = row['current_cgpa'] || row['Current CGPA'] || row['CGPA'];
                const active_backlogs = row['active_backlogs'] || row['Active Backlogs'] || row['Backlogs'];
                const tenth_marks = row['tenth_marks'] || row['10th Marks'];
                const twelfth_marks = row['twelfth_marks'] || row['12th Marks'];

                console.log(`[DEV] Processing row -> Roll: ${roll_number}, Email: ${email}, Dept: ${department_id}`);

                if (!roll_number) {
                    console.log("[DEV] Skipping row: Missing roll_number");
                    continue; // Skip rows that don't have a roll number
                }

                // Check if student exists by roll_number
                const [existingStudent] = await connection.execute(
                    'SELECT user_id FROM students WHERE roll_number = ?',
                    [roll_number]
                );

                if (existingStudent.length > 0) {
                    console.log(`[DEV] Student ${roll_number} exists. Updating...`);
                    // Update existing student's academic data
                    await connection.execute(
                        `UPDATE students 
                         SET current_cgpa = ?, active_backlogs = ?, tenth_marks = ?, twelfth_marks = ?
                         WHERE roll_number = ?`,
                        [
                            current_cgpa !== undefined ? current_cgpa : null, 
                            active_backlogs !== undefined ? active_backlogs : 0, 
                            tenth_marks !== undefined ? tenth_marks : null, 
                            twelfth_marks !== undefined ? twelfth_marks : null, 
                            roll_number
                        ]
                    );
                    updatedCount++;
                } else {
                    console.log(`[DEV] Creating new student: ${roll_number}`);
                    
                    // Create new student
                    // Ensure email is provided for user creation
                    if (!email) {
                        console.warn(`[DEV] Skipping student creation for roll_number ${roll_number} because email is missing.`);
                        continue;
                    }

                    // A. Insert into users table
                    const temporaryPassword = crypto.randomBytes(4).toString('hex');
                    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

                    const [userResult] = await connection.execute(
                        `INSERT INTO users (institution_id, email, password_hash, role) 
                         VALUES (?, ?, ?, 'STUDENT')`,
                        [institutionId, email, hashedPassword]
                    );

                    const newUserId = userResult.insertId;

                    // B. Insert into students table
                    await connection.execute(
                        `INSERT INTO students (user_id, roll_number, department_id, current_cgpa, active_backlogs, tenth_marks, twelfth_marks)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            newUserId, 
                            roll_number, 
                            department_id || null, 
                            current_cgpa !== undefined ? current_cgpa : null, 
                            active_backlogs !== undefined ? active_backlogs : 0, 
                            tenth_marks !== undefined ? tenth_marks : null, 
                            twelfth_marks !== undefined ? twelfth_marks : null
                        ]
                    );

                    // C. Insert empty student profile
                    await connection.execute(
                        `INSERT INTO student_profiles (student_id, resume_url, linkedin_url, github_url, address)
                         VALUES (?, NULL, NULL, NULL, NULL)`,
                        [newUserId]
                    );

                    emailsToSend.push({ email, roll_number, temporaryPassword });
                    
                    // DEV Logging
                    console.log(`[DEV] Created Account -> Email: ${email}, Password: ${temporaryPassword}`);

                    createdCount++;
                }
            }

            // 4. Commit transaction
            await connection.commit();
            // Release immediately after commit so it's immune to network/SMTP errors later.
            connection.release();
            
            // 5. Send emails
            let emailsSentCount = 0;
            for (const studentData of emailsToSend) {
                const emailSubject = 'Your Next Gen PBL Student Account Credentials';
                const emailHtml = `
                    <h2>Welcome to Next Gen PBL System</h2>
                    <p>Hello ${studentData.roll_number},</p>
                    <p>Your Student account has been successfully created.</p>
                    <p>Here are your login credentials:</p>
                    <ul>
                        <li><strong>Email:</strong> ${studentData.email}</li>
                        <li><strong>Temporary Password:</strong> ${studentData.temporaryPassword}</li>
                    </ul>
                    <p>Please log in and change your password as soon as possible.</p>
                    <p>Best regards,<br>Next Gen PBL Team</p>
                `;

                const emailSent = await sendEmail({
                    to: studentData.email,
                    subject: emailSubject,
                    html: emailHtml
                });

                if (!emailSent) {
                    console.warn("User created but failed to send email to:", studentData.email);
                } else {
                    emailsSentCount++;
                }
            }

            res.status(200).json({
                message: "Student data processed successfully",
                created: createdCount,
                updated: updatedCount,
                emails_sent: emailsSentCount
            });

        } catch (error) {
            await connection.rollback();
            // Handle any database transaction errors
            throw error; // Re-throw to be caught by the outer catch block
        } 
        // connection is released earlier on success, let's just make sure we don't leak otherwise

    } catch (error) {
        console.error("Error in uploadStudents:", error);
        res.status(500).json({ message: "Internal server error during student bulk upload" });
    }
};

/**
 * Get all students for the logged-in TPO_HEAD's department
 * GET /api/dept/students
 */
const getDepartmentStudents = async (req, res) => {
    try {
        // req.user has the current session details.
        // TPO_HEADs are assigned a department_id in the tpo_heads table.
        const userId = req.user.id;

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        // Fetch students belonging to this department, joining with users table for email and profile for subjective info
        const [students] = await db.execute(`
            SELECT 
                s.user_id, 
                s.roll_number, 
                u.email, 
                s.current_cgpa, 
                s.active_backlogs, 
                s.tenth_marks, 
                s.twelfth_marks, 
                s.is_academic_data_locked,
                s.is_placed,
                sp.resume_url,
                sp.linkedin_url
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            WHERE s.department_id = ?
        `, [deptId]);

        res.status(200).json({
            count: students.length,
            students: students
        });

    } catch (error) {
        console.error("Error fetching department students:", error);
        res.status(500).json({ message: "Internal server error while fetching students" });
    }
};

/**
 * Get full details of a specific student in the TPO_HEAD's department
 * GET /api/dept/students/:id
 */
const getStudentDetails = async (req, res) => {
    try {
        const userId = req.user.id; // TPO_HEAD's user id
        const studentId = req.params.id; // Student's user_id from path param

        // 1. Get TPO_HEAD's department
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        // 2. Fetch basic student info and profile, asserting it belongs to the deptId
        const [studentInfo] = await db.execute(`
            SELECT 
                s.user_id, s.roll_number, s.current_cgpa, s.active_backlogs, 
                s.tenth_marks, s.twelfth_marks, s.is_academic_data_locked, 
                s.is_placed, s.current_package_value,
                s.is_debarred, s.debar_reason, s.debar_lift_date,
                u.email, u.is_active,
                d.name AS department_name, d.code AS department_code,
                sp.resume_url, sp.linkedin_url, sp.github_url, sp.address
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
            WHERE s.user_id = ? AND s.department_id = ?
        `, [studentId, deptId]);

        if (studentInfo.length === 0) {
            return res.status(404).json({ message: "Student not found or does not belong to your department." });
        }

        const student = studentInfo[0];

        // 3. Fetch student skills
        const [skills] = await db.execute(`
            SELECT sk.name, ss.proficiency_level
            FROM student_skills ss
            JOIN skills sk ON ss.skill_id = sk.id
            WHERE ss.student_id = ?
        `, [studentId]);

        student.skills = skills;

        // 4. Fetch student projects
        const [projects] = await db.execute(`
            SELECT id, title, description, project_link
            FROM projects
            WHERE student_id = ?
        `, [studentId]);

        student.projects = projects;

        res.status(200).json(student);

    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ message: "Internal server error while fetching student details", error: error.message });
    }
};

/**
 * Update student information (academic/admin only)
 * PUT /api/dept/students/:id
 */
const updateStudent = async (req, res) => {
    try {
        const userId = req.user.id; // TPO_HEAD's user id
        const studentId = req.params.id; // Student's user_id from path param

        // 1. Get TPO_HEAD's department
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        // 2. Check if the student belongs to this department
        const [studentCheck] = await db.execute(
            'SELECT user_id FROM students WHERE user_id = ? AND department_id = ?',
            [studentId, deptId]
        );

        if (studentCheck.length === 0) {
            return res.status(404).json({ message: "Student not found or does not belong to your department." });
        }

        // 3. Extract data to update (only non-subjective)
        const { 
            current_cgpa, 
            active_backlogs, 
            tenth_marks, 
            twelfth_marks, 
            is_academic_data_locked, 
            is_placed, 
            current_package_value, 
            is_debarred, 
            debar_reason, 
            debar_lift_date 
        } = req.body;

        const updateFields = [];
        const updateValues = [];

        const addField = (fieldName, value) => {
            if (value !== undefined) {
                updateFields.push(`${fieldName} = ?`);
                updateValues.push(value);
            }
        };

        addField('current_cgpa', current_cgpa);
        addField('active_backlogs', active_backlogs);
        addField('tenth_marks', tenth_marks);
        addField('twelfth_marks', twelfth_marks);
        addField('is_academic_data_locked', is_academic_data_locked);
        addField('is_placed', is_placed);
        addField('current_package_value', current_package_value);
        addField('is_debarred', is_debarred);
        addField('debar_reason', debar_reason);
        addField('debar_lift_date', debar_lift_date);

        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No fields provided to update." });
        }

        updateValues.push(studentId);

        // 4. Update the student record
        await db.execute(
            `UPDATE students SET ${updateFields.join(', ')} WHERE user_id = ?`,
            updateValues
        );

        res.status(200).json({ message: "Student information updated successfully." });

    } catch (error) {
        console.error("Error updating student details:", error);
        res.status(500).json({ message: "Internal server error while updating student details" });
    }
};

/**
 * Manually create single or bulk students via JSON body
 * POST /api/dept/students
 */
const createStudentsManually = async (req, res) => {
    try {
        const { students } = req.body;

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: "Please provide an array of students to create." });
        }

        let createdCount = 0;
        let updatedCount = 0;
        const emailsToSend = [];
        const errors = [];
        
        // Fetch institution_id from the authenticated user (TPO_HEAD) if applicable, or fallback to null/1
        const institutionId = req.user && req.user.institution_id ? req.user.institution_id : null;

        const userId = req.user.id;
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const headDeptId = headResult[0].department_id;

        // Get DB connection for transactions to ensure atomicity
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                const { 
                    roll_number, 
                    email, 
                    current_cgpa, 
                    active_backlogs, 
                    tenth_marks, 
                    twelfth_marks 
                } = student;

                if (!roll_number || !email) {
                    errors.push({ index: i, error: "Missing required fields (roll_number or email) for this student." });
                    continue;
                }

                // Force department to be the TPO_HEAD's department
                const department_id = headDeptId;

                // Check if student exists by roll_number
                const [existingStudent] = await connection.execute(
                    'SELECT user_id FROM students WHERE roll_number = ?',
                    [roll_number]
                );

                if (existingStudent.length > 0) {
                    // Update existing student's academic data
                    await connection.execute(
                        `UPDATE students 
                         SET current_cgpa = ?, active_backlogs = ?, tenth_marks = ?, twelfth_marks = ?
                         WHERE roll_number = ?`,
                        [
                            current_cgpa !== undefined ? current_cgpa : null, 
                            active_backlogs !== undefined ? active_backlogs : 0, 
                            tenth_marks !== undefined ? tenth_marks : null, 
                            twelfth_marks !== undefined ? twelfth_marks : null, 
                            roll_number
                        ]
                    );
                    updatedCount++;
                } else {
                    // Create new student
                    // A. Insert into users table
                    const temporaryPassword = crypto.randomBytes(4).toString('hex');
                    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

                    // Ensure email is unique
                    const [existingEmail] = await connection.execute(
                        'SELECT id FROM users WHERE email = ?',
                        [email]
                    );

                    if (existingEmail.length > 0) {
                         errors.push({ index: i, email: email, error: "Email is already registered." });
                         continue;
                    }


                    const [userResult] = await connection.execute(
                        `INSERT INTO users (institution_id, email, password_hash, role) 
                         VALUES (?, ?, ?, 'STUDENT')`,
                        [institutionId, email, hashedPassword]
                    );

                    const newUserId = userResult.insertId;

                    // B. Insert into students table
                    await connection.execute(
                        `INSERT INTO students (user_id, roll_number, department_id, current_cgpa, active_backlogs, tenth_marks, twelfth_marks)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            newUserId, 
                            roll_number, 
                            department_id, 
                            current_cgpa !== undefined ? current_cgpa : null, 
                            active_backlogs !== undefined ? active_backlogs : 0, 
                            tenth_marks !== undefined ? tenth_marks : null, 
                            twelfth_marks !== undefined ? twelfth_marks : null
                        ]
                    );

                    // C. Insert empty student profile
                    await connection.execute(
                        `INSERT INTO student_profiles (student_id, resume_url, linkedin_url, github_url, address)
                         VALUES (?, NULL, NULL, NULL, NULL)`,
                        [newUserId]
                    );

                    emailsToSend.push({ email, roll_number, temporaryPassword });
                    createdCount++;
                }
            }

            // Commit transaction
            await connection.commit();
            // Release after successful database commit
            connection.release();
            
            // Send emails
            let emailsSentCount = 0;
            for (const studentData of emailsToSend) {
                const emailSubject = 'Your Next Gen PBL Student Account Credentials';
                const emailHtml = `
                    <h2>Welcome to Next Gen PBL System</h2>
                    <p>Hello ${studentData.roll_number},</p>
                    <p>Your Student account has been successfully created.</p>
                    <p>Here are your login credentials:</p>
                    <ul>
                        <li><strong>Email:</strong> ${studentData.email}</li>
                        <li><strong>Temporary Password:</strong> ${studentData.temporaryPassword}</li>
                    </ul>
                    <p>Please log in and change your password as soon as possible.</p>
                    <p>Best regards,<br>Next Gen PBL Team</p>
                `;

                const emailSent = await sendEmail({
                    to: studentData.email,
                    subject: emailSubject,
                    html: emailHtml
                });

                if (emailSent) {
                    emailsSentCount++;
                } else {
                    console.warn("User created but failed to send email to:", studentData.email);
                }
            }

            res.status(200).json({
                message: "Manual student creation process completed",
                created: createdCount,
                updated: updatedCount,
                emails_sent: emailsSentCount,
                errors: errors.length > 0 ? errors : undefined
            });

        } catch (error) {
            await connection.rollback();
            throw error;
            // Connection was already released if successful, do nothing in finally
        }

    } catch (error) {
        console.error("Error in createStudentsManually:", error);
        res.status(500).json({ message: "Internal server error during manual student creation" });
    }
};

/**
 * List students who updated their Resume/Skills recently
 * GET /api/dept/approvals/resumes
 */
const getRecentlyUpdatedProfiles = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get TPO_HEAD's department
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        // 2. Fetch students in the department who have a resume or skills
        // For a more advanced "recently updated" feature, we'd need an `updated_at` column in `student_profiles`
        // Given the current schema, we return students who have filled in their profile data.
        const [students] = await db.execute(`
            SELECT DISTINCT 
                s.user_id, 
                s.roll_number,
                u.email,
                sp.resume_url,
                sp.linkedin_url
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN student_profiles sp ON s.user_id = sp.student_id
            LEFT JOIN student_skills ss ON s.user_id = ss.student_id
            WHERE s.department_id = ? 
              AND (sp.resume_url IS NOT NULL OR ss.skill_id IS NOT NULL)
        `, [deptId]);

        res.status(200).json({
            count: students.length,
            students: students
        });

    } catch (error) {
        console.error("Error fetching recently updated profiles:", error);
        res.status(500).json({ message: "Internal server error while fetching profiles" });
    }
};

/**
 * Approve or Reject subjective profile updates
 * PUT /api/dept/approvals/resumes/:id
 * Body: { "action": "APPROVE" | "REJECT", "fields": ["resume_url", "skills"] }
 */
const reviewStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id; // TPO_HEAD
        const studentId = req.params.id;
        const { action, fields } = req.body;

        if (!action || !['APPROVE', 'REJECT'].includes(action.toUpperCase())) {
            return res.status(400).json({ message: "Invalid action. Must be APPROVE or REJECT." });
        }

        if (!fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({ message: "Must provide an array of fields to review (e.g., ['resume_url', 'skills'])." });
        }

        // 1. Verify TPO_HEAD's department
        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        // 2. Verify student belongs to this department
        const [studentCheck] = await db.execute(
            'SELECT user_id FROM students WHERE user_id = ? AND department_id = ?',
            [studentId, deptId]
        );

        if (studentCheck.length === 0) {
            return res.status(404).json({ message: "Student not found or does not belong to your department." });
        }

        // 3. Process the Review 
        // In a complex system, there'd be a separate 'pending_updates' table. 
        // Assuming the current basic schema: 'REJECT' means deleting the newly added info. 
        // 'APPROVE' might just be a logical acknowledgment (or updating a verification flag if we had one for profiles).
        // Since we only have `verification_status` on `external_engagements`, we'll focus on just allowing the head to clear/reset rejected fields.

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            if (action.toUpperCase() === 'REJECT') {
                if (fields.includes('resume_url')) {
                    await connection.execute('UPDATE student_profiles SET resume_url = NULL WHERE student_id = ?', [studentId]);
                }
                if (fields.includes('skills')) {
                    await connection.execute('DELETE FROM student_skills WHERE student_id = ?', [studentId]);
                }
                if (fields.includes('projects')) {
                    await connection.execute('DELETE FROM projects WHERE student_id = ?', [studentId]);
                }
            }
            // If APPROVE, we essentially leave the requested fields as they are since they are already live in this schema.
            // If the schema evolved to have a `status` column on profiles/skills, we'd update it to VERIFIED here.
            
            await connection.commit();
            res.status(200).json({ 
                message: `Student profile updates ${action.toLowerCase()}ed successfully.` 
            });

        } catch (dbError) {
            await connection.rollback();
            throw dbError;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("Error reviewing student profile:", error);
        res.status(500).json({ message: "Internal server error while reviewing profile updates" });
    }
};

/**
 * Get dashboard statistics for the TPO_HEAD
 * GET /api/dept/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        const [[deptTotals]] = await db.execute(
            `SELECT COUNT(*) AS total_students
             FROM students
             WHERE department_id = ?`,
            [deptId]
        );
        const totalStudents = Number(deptTotals?.total_students || 0);

        const [[deptPlacement]] = await db.execute(
            `SELECT
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed_students,
                ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avg_package,
                ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS highest_package
             FROM students s
             LEFT JOIN applications a ON a.student_id = s.user_id
             LEFT JOIN job_postings jp ON jp.id = a.job_id
             WHERE s.department_id = ?`,
            [deptId]
        );

        const placedStudents = Number(deptPlacement?.placed_students || 0);
        const avgPackage = Number(deptPlacement?.avg_package || 0);
        const highestPackage = Number(deptPlacement?.highest_package || 0);

        const [atRiskRows] = await db.execute(
            `SELECT
                s.user_id AS id,
                s.roll_number,
                u.email,
                s.current_cgpa,
                s.active_backlogs,
                (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS skills_count,
                (CASE WHEN rp.student_id IS NULL THEN 0 ELSE 1 END) AS has_resume
             FROM students s
             JOIN users u ON u.id = s.user_id
             LEFT JOIN resume_parsed_data rp ON rp.student_id = s.user_id
             WHERE s.department_id = ?`,
            [deptId]
        );

        const atRiskStudentsList = (atRiskRows || [])
            .map((r) => {
                const cgpa = Number(r.current_cgpa || 0);
                const backlogs = Number(r.active_backlogs || 0);
                const skills = Number(r.skills_count || 0);
                const hasResume = Number(r.has_resume || 0) === 1;
                const riskScore = Math.max(
                    0,
                    Math.min(
                        100,
                        (cgpa > 0 ? (6.0 - Math.min(cgpa, 6.0)) * 25 : 10) +
                            backlogs * 20 +
                            (!hasResume ? 25 : 0) +
                            (skills < 5 ? (5 - skills) * 6 : 0)
                    )
                );

                const issues = [];
                if (cgpa > 0 && cgpa < 6.0) issues.push('Low CGPA');
                if (backlogs > 0) issues.push('Active backlogs');
                if (!hasResume) issues.push('Resume not uploaded');
                if (skills < 5) issues.push('Low skills count');

                return {
                    id: r.roll_number || String(r.id),
                    name: String(r.email || '').split('@')[0] || r.roll_number || 'Student',
                    readiness: Number((100 - riskScore).toFixed(0)),
                    status: riskScore >= 60 ? 'Critical' : 'At Risk',
                    issues,
                    lastActivity: 'Recent',
                    risk_score: riskScore,
                };
            })
            .filter((r) => r.risk_score >= 25)
            .sort((a, b) => b.risk_score - a.risk_score);

        const [monthlyRows] = await db.execute(
            `SELECT
                DATE_FORMAT(a.applied_at, '%b') AS month,
                MONTH(a.applied_at) AS month_num,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.student_id END) AS placements
             FROM applications a
             JOIN students s ON s.user_id = a.student_id
             WHERE s.department_id = ?
               AND a.applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
             GROUP BY DATE_FORMAT(a.applied_at, '%b'), MONTH(a.applied_at)
             ORDER BY month_num ASC`,
            [deptId]
        );

        const yearTrend = (monthlyRows || []).map((r) => ({
            month: r.month,
            placements: Number(r.placements || 0),
        }));

        const [[packageBands]] = await db.execute(
            `SELECT
                SUM(CASE WHEN jp.package_value >= 12 THEN 1 ELSE 0 END) AS high,
                SUM(CASE WHEN jp.package_value >= 7 AND jp.package_value < 12 THEN 1 ELSE 0 END) AS medium,
                SUM(CASE WHEN jp.package_value > 0 AND jp.package_value < 7 THEN 1 ELSE 0 END) AS entry
             FROM applications a
             JOIN students s ON s.user_id = a.student_id
             JOIN job_postings jp ON jp.id = a.job_id
             WHERE s.department_id = ?
               AND a.status = 'SELECTED'`,
            [deptId]
        );

        const totalSelectedOffers =
            Number(packageBands?.high || 0) +
            Number(packageBands?.medium || 0) +
            Number(packageBands?.entry || 0);
        const toPercent = (n) =>
            totalSelectedOffers > 0 ? Number(((Number(n || 0) / totalSelectedOffers) * 100).toFixed(0)) : 0;

        const placementDistribution = [
            { name: "12+ LPA", value: toPercent(packageBands?.high), color: "#3B82F6" },
            { name: "7-12 LPA", value: toPercent(packageBands?.medium), color: "#10B981" },
            { name: "<7 LPA", value: toPercent(packageBands?.entry), color: "#F59E0B" },
        ];

        const [[collegeStats]] = await db.execute(
            `SELECT
                COUNT(DISTINCT s.user_id) AS total_students,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.user_id END) AS placed_students,
                ROUND(AVG(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS avg_package,
                ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS highest_package
             FROM students s
             LEFT JOIN applications a ON a.student_id = s.user_id
             LEFT JOIN job_postings jp ON jp.id = a.job_id`
        );

        const deptPlacementPct = totalStudents > 0 ? Number(((placedStudents / totalStudents) * 100).toFixed(1)) : 0;
        const collegeTotalStudents = Number(collegeStats?.total_students || 0);
        const collegePlacedStudents = Number(collegeStats?.placed_students || 0);
        const collegePlacementPct = collegeTotalStudents > 0 ? Number(((collegePlacedStudents / collegeTotalStudents) * 100).toFixed(1)) : 0;

        const comparisonData = [
            { metric: "Placement %", dept: deptPlacementPct, collegeAvg: collegePlacementPct },
            { metric: "Avg Package (LPA)", dept: avgPackage, collegeAvg: Number(collegeStats?.avg_package || 0) },
            { metric: "Highest Package (LPA)", dept: highestPackage, collegeAvg: Number(collegeStats?.highest_package || 0) },
        ];

        let skillsRadarData = [];
        try {
            const [skillsRows] = await db.execute(
                `SELECT
                    AVG(spm.coding_test_score) AS coding,
                    AVG(spm.mock_interview_score) AS communication,
                    AVG(spm.amcat_logical) AS aptitude,
                    AVG(spm.amcat_quant) AS quantitative,
                    AVG(spm.amcat_verbal) AS verbal
                 FROM student_performance_metrics spm
                 JOIN students s ON s.user_id = spm.student_id
                 WHERE s.department_id = ?`,
                [deptId]
            );

            const [collegeSkillsRows] = await db.execute(
                `SELECT
                    AVG(coding_test_score) AS coding,
                    AVG(mock_interview_score) AS communication,
                    AVG(amcat_logical) AS aptitude,
                    AVG(amcat_quant) AS quantitative,
                    AVG(amcat_verbal) AS verbal
                 FROM student_performance_metrics`
            );

            const deptSkill = skillsRows?.[0] || {};
            const collegeSkill = collegeSkillsRows?.[0] || {};
            skillsRadarData = [
                { skill: "Coding", dept: Number(deptSkill.coding || 0), collegeAvg: Number(collegeSkill.coding || 0) },
                { skill: "Communication", dept: Number(deptSkill.communication || 0), collegeAvg: Number(collegeSkill.communication || 0) },
                { skill: "Aptitude", dept: Number(deptSkill.aptitude || 0), collegeAvg: Number(collegeSkill.aptitude || 0) },
                { skill: "Quant", dept: Number(deptSkill.quantitative || 0), collegeAvg: Number(collegeSkill.quantitative || 0) },
                { skill: "Verbal", dept: Number(deptSkill.verbal || 0), collegeAvg: Number(collegeSkill.verbal || 0) },
            ];
        } catch {
            skillsRadarData = [];
        }

        const [topRows] = await db.execute(
            `SELECT
                s.roll_number,
                u.email,
                COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS offers,
                ROUND(MAX(CASE WHEN a.status = 'SELECTED' THEN jp.package_value END), 2) AS package
             FROM students s
             JOIN users u ON u.id = s.user_id
             LEFT JOIN applications a ON a.student_id = s.user_id
             LEFT JOIN job_postings jp ON jp.id = a.job_id
             WHERE s.department_id = ?
             GROUP BY s.user_id, s.roll_number, u.email
             HAVING offers > 0
             ORDER BY offers DESC, package DESC
             LIMIT 5`,
            [deptId]
        );

        const topPerformers = (topRows || []).map((r, idx) => ({
            rank: idx + 1,
            name: String(r.email || '').split('@')[0] || r.roll_number || `Student ${idx + 1}`,
            score: Math.min(100, Math.round(60 + Number(r.offers || 0) * 8 + Number(r.package || 0))),
            offers: Number(r.offers || 0),
            package: Number(r.package || 0),
        }));

        // Webinar schema may be legacy (date_time) or new (starts_at, status). Do not fail the whole dashboard.
        let upcomingEvents = [];
        try {
            const hasStartsAt = await hasColumn('webinars', 'starts_at');
            const hasStatus = await hasColumn('webinars', 'status');
            const hasLegacyDate = await hasColumn('webinars', 'date_time');

            let eventRows = [];
            if (hasStartsAt && hasStatus) {
                [eventRows] = await db.execute(
                    `SELECT title, starts_at
                     FROM webinars
                     WHERE starts_at >= NOW()
                       AND status IN ('PUBLISHED', 'COMPLETED')
                     ORDER BY starts_at ASC
                     LIMIT 5`
                );
            } else if (hasLegacyDate) {
                [eventRows] = await db.execute(
                    `SELECT title, date_time AS starts_at
                     FROM webinars
                     WHERE date_time >= NOW()
                     ORDER BY date_time ASC
                     LIMIT 5`
                );
            }

            upcomingEvents = (eventRows || []).map((e) => ({
                date: e.starts_at
                    ? new Date(e.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '',
                title: e.title || 'Webinar',
                type: 'Webinar',
                attendees: totalStudents,
            }));
        } catch (webinarErr) {
            console.warn('getDashboardStats: skipping upcoming webinars (schema or query issue)', webinarErr.message);
            upcomingEvents = [];
        }

        res.status(200).json({
            stats: {
                totalStudents,
                placedStudents,
                avgPackage: Number(avgPackage.toFixed(2)),
                atRiskStudents: atRiskStudentsList.length,
            },
            yearTrend,
            placementDistribution,
            comparisonData,
            atRiskStudents: atRiskStudentsList.slice(0, 5),
            topPerformers,
            upcomingEvents,
            skillsRadarData,
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Internal server error while fetching dashboard stats" });
    }
};

module.exports = {
    uploadStudents,
    getDepartmentStudents,
    getStudentDetails,
    updateStudent,
    createStudentsManually,
    getRecentlyUpdatedProfiles,
    reviewStudentProfile,
    getDashboardStats
};

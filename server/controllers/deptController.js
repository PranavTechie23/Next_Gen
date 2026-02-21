const db = require('../config/db');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt'); // Use the existing bcrypt module
const crypto = require('crypto');
const sendEmail = require('../utils/email');

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
            return res.status(400).json({ message: "The uploaded Excel file is empty." });
        }

        let createdCount = 0;
        let updatedCount = 0;
        const emailsToSend = [];
        
        // Fetch institution_id from the authenticated user (TPO_HEAD) if applicable, or fallback to null/1
        const institutionId = req.user && req.user.institution_id ? req.user.institution_id : null;

        // 2. Get DB connection for transactions to ensure atomicity
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 3. Loop through the parsed JSON data
            for (const row of sheetData) {
                // Extract expected columns based on format
                const {
                    roll_number,
                    email,
                    department_id,
                    current_cgpa,
                    active_backlogs,
                    tenth_marks,
                    twelfth_marks
                } = row;

                if (!roll_number) continue; // Skip rows that don't have a roll number

                // 3.5 Check if department exists to avoid foreign key constraint errors
                if (department_id) {
                    const [existingDept] = await connection.execute(
                        'SELECT id FROM departments WHERE id = ?',
                        [department_id]
                    );

                    if (existingDept.length === 0) {
                        console.warn(`Skipping row for roll_number ${roll_number} because department_id ${department_id} does not exist in the database.`);
                        continue;
                    }
                }

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
                    // Ensure email is provided for user creation
                    if (!email) {
                        console.warn(`Skipping student creation for roll_number ${roll_number} because email is missing.`);
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
            throw error; // Re-throw to be caught by the outer catch block
        } finally {
            connection.release(); // Always release connection back to pool
        }

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
        res.status(500).json({ message: "Internal server error while fetching student details" });
    }
};

module.exports = {
    uploadStudents,
    getDepartmentStudents,
    getStudentDetails
};

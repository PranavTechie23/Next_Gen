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
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("Error in createStudentsManually:", error);
        res.status(500).json({ message: "Internal server error during manual student creation" });
    }
};

module.exports = {
    uploadStudents,
    getDepartmentStudents,
    getStudentDetails,
    updateStudent,
    createStudentsManually
};

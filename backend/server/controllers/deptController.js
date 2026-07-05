const db = require('../config/db');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt'); // Use the existing bcrypt module
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const { normalizeEducationEntries } = require('../utils/educationUtils');
const sendEmail = require('../utils/email');
const { serveCachedDashboard } = require('../utils/dashboardCache');

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

function numberValue(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function profileCompletenessFromRow(row) {
    let score = 0;
    if (row.resume_url || Number(row.has_resume || 0) === 1) score += 40;
    if (row.linkedin_url) score += 25;
    if (row.github_url) score += 20;
    if (numberValue(row.skills_count) >= 3) score += 15;
    return Math.min(score, 100);
}

function readinessFromRow(row) {
    const cgpa = numberValue(row.current_cgpa);
    const backlogs = numberValue(row.active_backlogs);
    const skills = numberValue(row.skills_count);
    const hasResume = Boolean(row.resume_url) || Number(row.has_resume || 0) === 1;
    const hasProfileLink = Boolean(row.linkedin_url || row.github_url);

    let readiness = 25;
    const issues = [];

    if (cgpa >= 8) readiness += 25;
    else if (cgpa >= 7) readiness += 18;
    else if (cgpa >= 6) readiness += 10;

    if (!row.current_cgpa) issues.push('CGPA missing');
    else if (cgpa < 7) issues.push('Below 7.0 CGPA');

    if (backlogs === 0) readiness += 20;
    else issues.push(`${backlogs} active backlog${backlogs > 1 ? 's' : ''}`);

    if (hasResume) readiness += 15;
    else issues.push('Resume missing');

    if (hasProfileLink) readiness += 10;
    else issues.push('Profile links missing');

    if (skills >= 3) readiness += 5;
    else issues.push('Skills need update');

    readiness = Math.max(0, Math.min(100, Math.round(readiness)));

    let band = 'Needs attention';
    if (readiness >= 80 && issues.length === 0) band = 'Drive ready';
    else if (readiness >= 70) band = 'Almost ready';
    else if (issues.length >= 3 || readiness < 55) band = 'Critical';

    return {
        readiness,
        readiness_band: band,
        profile_completeness: profileCompletenessFromRow(row),
        issues,
        issue_count: issues.length,
    };
}

async function getDepartmentReadinessRows(deptId) {
    let hasResumeParsed = false;
    try {
        await db.query(`SELECT 1 FROM resume_parsed_data LIMIT 1`);
        hasResumeParsed = true;
    } catch {
        hasResumeParsed = false;
    }

    const [rows] = await db.execute(
        `SELECT
            s.user_id,
            s.roll_number,
            u.email,
            s.current_cgpa,
            s.active_backlogs,
            s.is_placed,
            sp.resume_url,
            sp.linkedin_url,
            sp.github_url,
            (SELECT COUNT(*) FROM student_skills ss WHERE ss.student_id = s.user_id) AS skills_count,
            ${hasResumeParsed ? `(CASE WHEN rp.student_id IS NULL THEN 0 ELSE 1 END)` : `0`} AS has_resume
         FROM students s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN student_profiles sp ON sp.student_id = s.user_id
         ${hasResumeParsed ? `LEFT JOIN resume_parsed_data rp ON rp.student_id = s.user_id` : ``}
         WHERE s.department_id = ?
         ORDER BY s.roll_number ASC`,
        [deptId]
    );

    return (rows || []).map((row) => ({
        ...row,
        ...readinessFromRow(row),
    }));
}

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
                s.twelfth_marks, s.diploma_marks,
                s.is_academic_data_locked,
                s.is_placed,
                sp.resume_url,
                sp.linkedin_url,
                sp.github_url
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
                s.tenth_marks, s.twelfth_marks, s.diploma_marks, s.is_academic_data_locked, 
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
            SELECT sk.name
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

        const [resumeData] = await db.execute(`
            SELECT sections_json
            FROM resume_parsed_data
            WHERE student_id = ?
        `, [studentId]);

        let parsed = null;
        if (resumeData.length > 0 && resumeData[0].sections_json) {
            parsed = typeof resumeData[0].sections_json === 'string'
                ? JSON.parse(resumeData[0].sections_json)
                : resumeData[0].sections_json;
        }

        if (parsed) {
            const eduBundle = normalizeEducationEntries(parsed.education_entries, parsed.education);
            student.education_entries = eduBundle.education_entries;
            student.education = eduBundle.education;
        } else {
            student.education_entries = [];
            student.education = [];
        }

        // Fallback to parsed resume projects if manual projects are empty
        if (student.projects.length === 0 && parsed) {
            if (parsed.projects && Array.isArray(parsed.projects)) {
                student.projects = parsed.projects.map((p, index) => {
                    return {
                        id: 'parsed-' + index,
                        title: typeof p === 'string' ? p : p.title || 'Untitled Project',
                        description: p.bullets ? p.bullets.join(' ') : (p.description || ''),
                        project_link: p.link || p.project_link || ''
                    };
                });
            }
        }

        // Fetch experience from resume parsing
        if (parsed && parsed.experience && Array.isArray(parsed.experience)) {
            student.experience = parsed.experience.map((e, index) => {
                return {
                    id: 'exp-' + index,
                    title: typeof e === 'string' ? e : e.title || e.role || 'Role',
                    company: typeof e === 'string' ? '' : e.company || e.organization || '',
                    description: e.bullets ? e.bullets.join(' ') : (e.description || '')
                };
            });
        } else {
            student.experience = [];
        }

        // 5. Fetch student performance metrics (AMCAT scores, coding, mock interview, end-sem %)
        const [performance] = await db.execute(`
            SELECT amcat_quant, amcat_verbal, amcat_logical, coding_test_score, mock_interview_score, endsem_percentage
            FROM student_performance_metrics
            WHERE student_id = ?
        `, [studentId]);

        student.performance = performance.length > 0 ? performance[0] : null;

        res.status(200).json(student);

    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ message: "Internal server error while fetching student details" });
    }
};

/**
 * Update student information (academic/TPO only)
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

const getDeptProfile = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                u.id,
                u.email,
                th.name,
                th.phone,
                d.id AS department_id,
                d.name AS department_name,
                d.code AS department_code
             FROM users u
             JOIN tpo_heads th ON th.user_id = u.id
             LEFT JOIN departments d ON d.id = th.department_id
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (!rows.length) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching dept profile:", error);
        res.status(500).json({ message: "Internal server error while fetching dept profile" });
    }
};

const getReadinessDesk = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const students = await getDepartmentReadinessRows(ctx.deptId);
        const activeStudents = students.filter((student) => !student.is_placed);

        const alerts = {
            critical: activeStudents.filter((student) => student.readiness_band === 'Critical').length,
            profileGaps: activeStudents.filter((student) =>
                student.issues.includes('Resume missing') || student.issues.includes('Profile links missing')
            ).length,
            driveReady: activeStudents.filter((student) => student.readiness >= 80 && student.issue_count === 0).length,
            missingResume: activeStudents.filter((student) => student.issues.includes('Resume missing')).length,
        };

        res.status(200).json({
            department: {
                id: ctx.deptId,
                name: ctx.departmentName,
                code: ctx.departmentCode,
            },
            alerts,
            students,
        });
    } catch (error) {
        console.error("Error fetching readiness desk:", error);
        res.status(500).json({ message: "Internal server error while fetching readiness desk" });
    }
};

/**
 * Build dashboard payload for a department (used by cache layer).
 */
async function buildDeptDashboardPayload(deptId) {
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

    const readinessRows = await getDepartmentReadinessRows(deptId);

    const atRiskStudentsList = readinessRows
        .map((r) => {
            return {
                id: r.roll_number || String(r.user_id),
                name: String(r.email || '').split('@')[0] || r.roll_number || 'Student',
                readiness: r.readiness,
                status: r.readiness_band,
                issues: r.issues,
                lastActivity: 'Recent',
                risk_score: 100 - r.readiness,
            };
        })
        .filter((r) => r.risk_score >= 25 && r.issues.length > 0)
        .sort((a, b) => b.risk_score - a.risk_score);

    // Count students pursuing Higher Studies or Entrepreneurship (verified or pending)
    const [[altPathRow]] = await db.execute(
        `SELECT COUNT(DISTINCT ee.student_id) AS alt_path_count
         FROM external_engagements ee
         JOIN students s ON s.user_id = ee.student_id
         WHERE s.department_id = ?
           AND ee.type IN ('HIGHER_STUDIES', 'ENTREPRENEURSHIP')`,
        [deptId]
    );
    const altPathStudents = Number(altPathRow?.alt_path_count || 0);

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

    let upcomingEvents = [];
    try {
        const [deptEventRows] = await db.execute(
            `SELECT id, title, date AS starts_at, type, meeting_link, target_batch, expires_at
             FROM dept_events
             WHERE department_id = ?
               AND date >= NOW()
               AND (expires_at IS NULL OR expires_at > NOW())
             ORDER BY date ASC
             LIMIT 5`,
            [deptId]
        );

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

        upcomingEvents = [...(deptEventRows || []), ...(eventRows || [])]
            .sort((a, b) => new Date(a.starts_at || 0) - new Date(b.starts_at || 0))
            .slice(0, 5)
            .map((e) => ({
                id: e.id ?? null,
                source: e.id ? 'dept_event' : 'webinar',
                startsAt: e.starts_at || null,
                date: e.starts_at
                    ? new Date(e.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '',
                title: e.title || 'Webinar',
                type: e.type || 'Webinar',
                meetingLink: e.meeting_link || null,
                targetBatch: e.target_batch || 'All',
                expiresAt: e.expires_at || null,
                attendees: totalStudents,
            }));
    } catch (webinarErr) {
        console.warn('buildDeptDashboardPayload: skipping upcoming webinars', webinarErr.message);
        upcomingEvents = [];
    }

    return {
        stats: {
            totalStudents,
            placedStudents,
            avgPackage: Number(avgPackage.toFixed(2)),
            altPathStudents,
        },
        yearTrend,
        placementDistribution,
        comparisonData,
        atRiskStudents: atRiskStudentsList.slice(0, 5),
        topPerformers,
        upcomingEvents,
        skillsRadarData,
    };
}

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
        const cacheScopeKey = `dept_dashboard:dept:${deptId}`;

        return serveCachedDashboard(req, res, {
            cacheScopeKey,
            buildPayload: () => buildDeptDashboardPayload(deptId),
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Internal server error while fetching dashboard stats" });
    }
};

async function resolveHeadDepartment(userId) {
    const [rows] = await db.execute(
        `SELECT th.department_id, d.name AS department_name, d.code AS department_code
         FROM tpo_heads th
         LEFT JOIN departments d ON d.id = th.department_id
         WHERE th.user_id = ?`,
        [userId]
    );
    if (!rows.length) return null;
    return {
        deptId: rows[0].department_id,
        departmentName: rows[0].department_name || 'Department',
        departmentCode: rows[0].department_code || String(rows[0].department_id),
    };
}

function escapeCsvField(value) {
    const s = String(value ?? '');
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function sendCsv(res, filename, header, rows) {
    const lines = [header.join(',')];
    for (const row of rows) {
        lines.push(row.map(escapeCsvField).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + lines.join('\r\n'));
}

/**
 * GET /api/dept/reports/placement-pdf
 */
const exportDeptPlacementReportPdf = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) {
            return res.status(403).json({ message: 'Access denied. Not a valid department head.' });
        }

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 99);
        const minReadiness = numberValue(req.query.minReadiness, 0);

        const readinessStudents = (await getDepartmentReadinessRows(ctx.deptId)).filter((r) => {
            return numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness;
        });
        const allowedRolls = new Set(readinessStudents.map(r => r.roll_number));

        const [allOfferRows] = await db.execute(
            `SELECT s.roll_number, s.user_id, u.email, jp.job_title, jp.package_value, a.applied_at
             FROM students s
             JOIN users u ON u.id = s.user_id
             JOIN applications a ON a.student_id = s.user_id AND a.status = 'SELECTED'
             JOIN job_postings jp ON jp.id = a.job_id
             WHERE s.department_id = ?
             ORDER BY s.roll_number ASC, jp.package_value DESC`,
            [ctx.deptId]
        );
        const offerRows = allOfferRows.filter(r => allowedRolls.has(r.roll_number));

        const totalStudents = readinessStudents.length;
        const placedStudents = new Set(offerRows.map(r => r.user_id)).size;
        const packages = offerRows.map(r => Number(r.package_value || 0));
        const avgPackage = packages.length > 0 ? packages.reduce((a, b) => a + b, 0) / packages.length : 0;
        const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
        const placementPct = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : '0.0';

        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `dept-placement-${safeSlug}-${dateStr}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const doc = new PDFDocument({ size: 'A4', margin: 48 });
        doc.pipe(res);

        doc.fontSize(18).text('Department placement report', { align: 'center' });
        doc.moveDown(0.35);
        doc.fontSize(12).fillColor('#333333').text(ctx.departmentName, { align: 'center' });
        doc.fillColor('#000000');
        doc.moveDown(0.75);
        doc.fontSize(9).text(`Generated: ${new Date().toLocaleString('en-IN', { hour12: true })}`, {
            align: 'right',
        });
        doc.moveDown();

        doc.fontSize(12).text('Summary', { underline: true });
        doc.moveDown(0.35);
        doc.fontSize(10);
        doc.text(`Total students: ${totalStudents}`);
        doc.text(`Students with at least one selected offer: ${placedStudents}`);
        doc.text(`Placement rate: ${placementPct}%`);
        doc.text(`Average package (selected offers, LPA): ${avgPackage.toFixed(2)}`);
        doc.text(`Highest package (selected offers, LPA): ${highestPackage.toFixed(2)}`);
        doc.moveDown();

        doc.fontSize(12).text('Selected offers (detail)', { underline: true });
        doc.moveDown(0.25);
        doc.fontSize(8).fillColor('#555555').text(
            'Each line is one selected offer (a student may appear multiple times if they have multiple offers).',
            { width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
        );
        doc.fillColor('#000000').moveDown(0.35);

        const pageBottom = () => doc.page.height - doc.page.margins.bottom - 36;
        const ensureOfferSpace = (needed = 52) => {
            if (doc.y + needed > pageBottom()) {
                doc.addPage();
                doc.fontSize(11).fillColor('#333333').text('Selected offers (detail) — continued', { underline: true });
                doc.fillColor('#000000').moveDown(0.4);
            }
        };

        if (!offerRows.length) {
            doc.fontSize(10).fillColor('#555555').text('No selected applications on record for this department.');
        } else {
            doc.fontSize(9).fillColor('#000000');
            offerRows.forEach((r, idx) => {
                ensureOfferSpace(52);
                const applied = r.applied_at ? new Date(r.applied_at).toLocaleDateString('en-IN') : '—';
                doc.text(`${idx + 1}. ${r.roll_number || '—'}  •  ${r.email || ''}`);
                doc.fontSize(8).fillColor('#333333');
                doc.text(
                    `   Role: ${r.job_title || '—'}  |  Package: ${Number(r.package_value || 0).toFixed(2)} LPA  |  Applied: ${applied}`,
                    { width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
                );
                doc.fillColor('#000000').fontSize(9);
                doc.moveDown(0.35);
            });
            ensureOfferSpace(36);
            doc.fontSize(8).fillColor('#666666').text(
                `End of list: ${offerRows.length} selected offer row(s); ${placedStudents} distinct student(s) with at least one offer.`
            );
        }

        doc.end();
    } catch (error) {
        console.error('exportDeptPlacementReportPdf error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate placement PDF.' });
        } else {
            res.destroy();
        }
    }
};

/**
 * GET /api/dept/reports/student-readiness.csv
 */
const exportStudentReadinessCsv = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) {
            return res.status(403).json({ message: 'Access denied. Not a valid department head.' });
        }

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 99);
        const minReadiness = numberValue(req.query.minReadiness, 0);

        const rows = (await getDepartmentReadinessRows(ctx.deptId)).filter((r) => {
            return numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness;
        });

        const header = [
            'roll_number',
            'email',
            'cgpa',
            'active_backlogs',
            'skills_count',
            'has_resume',
            'is_placed',
            'readiness_score',
            'readiness_band',
        ];

        const lines = [header.join(',')];
        for (const r of rows) {
            lines.push(
                [
                    escapeCsvField(r.roll_number),
                    escapeCsvField(r.email),
                    escapeCsvField(r.current_cgpa ?? ''),
                    escapeCsvField(r.active_backlogs ?? ''),
                    escapeCsvField(r.skills_count ?? ''),
                    escapeCsvField((r.resume_url || Number(r.has_resume || 0) === 1) ? 'yes' : 'no'),
                    escapeCsvField(r.is_placed ? 'yes' : 'no'),
                    escapeCsvField(r.readiness),
                    escapeCsvField(r.readiness_band),
                ].join(',')
            );
        }

        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `student-readiness-${safeSlug}-${dateStr}.csv`;

        const bom = '\uFEFF';
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(bom + lines.join('\r\n'));
    } catch (error) {
        console.error('exportStudentReadinessCsv error:', error);
        res.status(500).json({ message: 'Failed to export readiness CSV.' });
    }
};

const exportUnplacedStudentsCsv = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) return res.status(403).json({ message: 'Access denied. Not a valid department head.' });

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 99);
        const minReadiness = numberValue(req.query.minReadiness, 0);

        const rows = (await getDepartmentReadinessRows(ctx.deptId)).filter((r) => {
            return !r.is_placed &&
                numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness;
        });

        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        sendCsv(
            res,
            `unplaced-students-${safeSlug}-${new Date().toISOString().slice(0, 10)}.csv`,
            ['roll_number', 'email', 'cgpa', 'active_backlogs', 'readiness_score', 'readiness_band', 'issues'],
            rows.map((r) => [
                r.roll_number,
                r.email,
                r.current_cgpa ?? '',
                r.active_backlogs ?? '',
                r.readiness,
                r.readiness_band,
                (r.issues || []).join('; '),
            ])
        );
    } catch (error) {
        console.error('exportUnplacedStudentsCsv error:', error);
        res.status(500).json({ message: 'Failed to export unplaced students.' });
    }
};

const exportProfileGapsCsv = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) return res.status(403).json({ message: 'Access denied. Not a valid department head.' });

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 99);
        const minReadiness = numberValue(req.query.minReadiness, 0);

        const rows = (await getDepartmentReadinessRows(ctx.deptId)).filter(
            (r) => !r.is_placed &&
                (r.issues.includes('Resume missing') || r.issues.includes('Profile links missing') || r.issues.includes('Skills need update')) &&
                numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness
        );
        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        sendCsv(
            res,
            `profile-gaps-${safeSlug}-${new Date().toISOString().slice(0, 10)}.csv`,
            ['roll_number', 'email', 'has_resume', 'linkedin_url', 'github_url', 'skills_count', 'profile_completeness', 'issues'],
            rows.map((r) => [
                r.roll_number,
                r.email,
                (r.resume_url || Number(r.has_resume || 0) === 1) ? 'yes' : 'no',
                r.linkedin_url || '',
                r.github_url || '',
                r.skills_count ?? 0,
                r.profile_completeness,
                (r.issues || []).join('; '),
            ])
        );
    } catch (error) {
        console.error('exportProfileGapsCsv error:', error);
        res.status(500).json({ message: 'Failed to export profile gaps.' });
    }
};

const exportPlacedPackagesCsv = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) return res.status(403).json({ message: 'Access denied. Not a valid department head.' });

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 99);
        const minReadiness = numberValue(req.query.minReadiness, 0);

        const readinessStudents = (await getDepartmentReadinessRows(ctx.deptId)).filter((r) => {
            return numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness;
        });
        const allowedRolls = new Set(readinessStudents.map(r => r.roll_number));

        const [rows] = await db.execute(
            `SELECT
                s.roll_number,
                u.email,
                rec.company_name,
                rd.drive_name,
                jp.job_title,
                jp.package_value,
                a.applied_at
             FROM students s
             JOIN users u ON u.id = s.user_id
             JOIN applications a ON a.student_id = s.user_id AND a.status = 'SELECTED'
             JOIN job_postings jp ON jp.id = a.job_id
             LEFT JOIN recruitment_drives rd ON rd.id = jp.drive_id
             LEFT JOIN recruiters rec ON rec.id = rd.recruiter_id
             WHERE s.department_id = ?
             ORDER BY jp.package_value DESC, s.roll_number ASC`,
            [ctx.deptId]
        );
        const filteredRows = (rows || []).filter(r => allowedRolls.has(r.roll_number));

        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        sendCsv(
            res,
            `placed-packages-${safeSlug}-${new Date().toISOString().slice(0, 10)}.csv`,
            ['roll_number', 'email', 'company', 'drive', 'role', 'package_lpa', 'applied_at'],
            filteredRows.map((r) => [
                r.roll_number,
                r.email,
                r.company_name || '',
                r.drive_name || '',
                r.job_title || '',
                Number(r.package_value || 0).toFixed(2),
                r.applied_at ? new Date(r.applied_at).toISOString().slice(0, 10) : '',
            ])
        );
    } catch (error) {
        console.error('exportPlacedPackagesCsv error:', error);
        res.status(500).json({ message: 'Failed to export placed package report.' });
    }
};

const exportEligibilityCsv = async (req, res) => {
    try {
        const ctx = await resolveHeadDepartment(req.user.id);
        if (!ctx) return res.status(403).json({ message: 'Access denied. Not a valid department head.' });

        const minCgpa = numberValue(req.query.minCgpa, 0);
        const maxBacklogs = numberValue(req.query.maxBacklogs, 0);
        const minReadiness = numberValue(req.query.minReadiness, 70);
        const rows = (await getDepartmentReadinessRows(ctx.deptId)).filter((r) => {
            return !r.is_placed &&
                numberValue(r.current_cgpa) >= minCgpa &&
                numberValue(r.active_backlogs) <= maxBacklogs &&
                numberValue(r.readiness) >= minReadiness;
        });
        const safeSlug = String(ctx.departmentCode || ctx.deptId).replace(/[^\w.-]+/g, '_');
        sendCsv(
            res,
            `eligible-students-${safeSlug}-${new Date().toISOString().slice(0, 10)}.csv`,
            ['roll_number', 'email', 'cgpa', 'active_backlogs', 'readiness_score', 'readiness_band', 'resume_url', 'linkedin_url', 'github_url'],
            rows.map((r) => [
                r.roll_number,
                r.email,
                r.current_cgpa ?? '',
                r.active_backlogs ?? '',
                r.readiness,
                r.readiness_band,
                r.resume_url || '',
                r.linkedin_url || '',
                r.github_url || '',
            ])
        );
    } catch (error) {
        console.error('exportEligibilityCsv error:', error);
        res.status(500).json({ message: 'Failed to export eligibility list.' });
    }
};

const ensureDeptEventsColumns = async () => {
    try {
        const hasMode = await hasColumn('dept_events', 'mode');
        if (!hasMode) {
            await db.execute("ALTER TABLE dept_events ADD COLUMN mode VARCHAR(50) DEFAULT 'OFFLINE'");
        }
        const hasTargetBatch = await hasColumn('dept_events', 'target_batch');
        if (!hasTargetBatch) {
            await db.execute("ALTER TABLE dept_events ADD COLUMN target_batch VARCHAR(50) DEFAULT 'All'");
        }
        const hasExpiresAt = await hasColumn('dept_events', 'expires_at');
        if (!hasExpiresAt) {
            await db.execute("ALTER TABLE dept_events ADD COLUMN expires_at DATETIME DEFAULT NULL");
        }
    } catch (err) {
        console.error("Error ensuring dept_events columns:", err);
    }
};

/**
 * Create a department event
 * POST /api/dept/events
 */
const createDeptEvent = async (req, res) => {
    try {
        await ensureDeptEventsColumns();
        const userId = req.user.id;
        const { title, date, type, meetingLink, mode, targetBatch, expiryHours } = req.body;

        if (!title || !date || !type) {
            return res.status(400).json({ message: "Title, date, and type are required." });
        }

        const formattedDate = date ? String(date).replace('T', ' ').slice(0, 19) : new Date().toISOString().slice(0, 19).replace('T', ' ');

        let expiresAt = null;
        if (expiryHours && expiryHours !== 'never') {
            const hours = parseInt(expiryHours, 10);
            if (!isNaN(hours) && hours > 0) {
                const now = new Date(formattedDate);
                now.setHours(now.getHours() + hours);
                expiresAt = now.toISOString().slice(0, 19).replace('T', ' ');
            }
        }

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        await db.execute(
            `INSERT INTO dept_events (department_id, title, date, type, meeting_link, mode, created_by, target_batch, expires_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [deptId, title, formattedDate, type, meetingLink || null, mode || 'OFFLINE', userId, targetBatch || 'All', expiresAt]
        );

        res.status(201).json({ message: "Event created successfully." });
    } catch (error) {
        console.error("Error in createDeptEvent:", error);
        res.status(500).json({ message: error.message || "Internal server error during event creation" });
    }
};

/**
 * Update a department event
 * PUT /api/dept/events/:id
 */
const updateDeptEvent = async (req, res) => {
    try {
        await ensureDeptEventsColumns();
        const userId = req.user.id;
        const eventId = req.params.id;
        const { title, date, type, meetingLink, mode, targetBatch, expiryHours } = req.body;

        if (!title || !date || !type) {
            return res.status(400).json({ message: "Title, date, and type are required." });
        }

        const formattedDate = date ? String(date).replace('T', ' ').slice(0, 19) : new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        let expiresAt = null;
        if (expiryHours && expiryHours !== 'never') {
            const hours = parseInt(expiryHours, 10);
            if (!isNaN(hours) && hours > 0) {
                const expiry = new Date(formattedDate);
                expiry.setHours(expiry.getHours() + hours);
                expiresAt = expiry.toISOString().slice(0, 19).replace('T', ' ');
            }
        }

        const [result] = await db.execute(
            `UPDATE dept_events
             SET title = ?, date = ?, type = ?, meeting_link = ?, mode = ?, target_batch = ?, expires_at = ?
             WHERE id = ? AND department_id = ?`,
            [title, formattedDate, type, meetingLink || null, mode || 'OFFLINE', targetBatch || 'All', expiresAt, eventId, deptId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Event not found or access denied." });
        }

        res.status(200).json({ message: "Event updated successfully." });
    } catch (error) {
        console.error("Error in updateDeptEvent:", error);
        res.status(500).json({ message: error.message || "Internal server error during event update" });
    }
};

/**
 * Delete a department event
 * DELETE /api/dept/events/:id
 */
const deleteDeptEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = Number.parseInt(String(req.params.id), 10);

        if (!Number.isFinite(eventId) || eventId <= 0) {
            return res.status(400).json({ message: "Invalid event id." });
        }

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        const [result] = await db.execute(
            'DELETE FROM dept_events WHERE id = ? AND department_id = ?',
            [eventId, deptId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Event not found or access denied." });
        }

        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error("Error in deleteDeptEvent:", error);
        res.status(500).json({ message: error.message || "Internal server error during event deletion" });
    }
};

/**
 * Get department events for the Dept Head
 * GET /api/dept/events
 */
const getDeptEvents = async (req, res) => {
    try {
        await ensureDeptEventsColumns();
        const userId = req.user.id;

        const [headResult] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ?',
            [userId]
        );

        if (headResult.length === 0) {
            return res.status(403).json({ message: "Access denied. Not a valid department head." });
        }

        const deptId = headResult[0].department_id;

        const [events] = await db.execute(
            `SELECT id, title, date, type, meeting_link, mode, target_batch, expires_at 
             FROM dept_events 
             WHERE department_id = ?
               AND (expires_at IS NULL OR expires_at > NOW())
             ORDER BY date ASC`,
            [deptId]
        );

        res.status(200).json(events);
    } catch (error) {
        console.error("Error in getDeptEvents:", error);
        res.status(500).json({ message: "Internal server error while fetching events" });
    }
};

const getAmcatStats = async (req, res) => {
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

        // Query department performance rows
        const [deptPerformanceRows] = await db.execute(
            `SELECT 
                spm.amcat_quant,
                spm.amcat_verbal,
                spm.amcat_logical,
                spm.coding_test_score,
                spm.mock_interview_score,
                spm.endsem_percentage
             FROM student_performance_metrics spm
             JOIN students s ON s.user_id = spm.student_id
             WHERE s.department_id = ?`,
            [deptId]
        );

        // Query college performance rows
        const [collegePerformanceRows] = await db.execute(
            `SELECT 
                amcat_quant,
                amcat_verbal,
                amcat_logical,
                coding_test_score,
                mock_interview_score,
                endsem_percentage
             FROM student_performance_metrics`
        );

        // Define the 6 sections to aggregate
        const sectionsConfig = [
            { key: 'amcat_quant', label: 'AMCAT Quant', dbField: 'amcat_quant' },
            { key: 'amcat_logical', label: 'AMCAT Logical', dbField: 'amcat_logical' },
            { key: 'amcat_verbal', label: 'AMCAT Verbal', dbField: 'amcat_verbal' },
            { key: 'coding_test_score', label: 'Coding Test', dbField: 'coding_test_score' },
            { key: 'mock_interview_score', label: 'Mock Interview', dbField: 'mock_interview_score' },
            { key: 'endsem_percentage', label: 'End-sem %', dbField: 'endsem_percentage' }
        ];

        // Total active department students with at least one performance record
        const deptActiveStudents = deptPerformanceRows.filter(row => {
            return Object.values(row).some(val => val !== null && val !== undefined);
        });
        const totalActiveStudents = deptActiveStudents.length;

        const sections = [];

        for (const sec of sectionsConfig) {
            const f = sec.dbField;

            // Department scores for this section (excluding NULLs)
            const deptVals = deptPerformanceRows
                .map(r => r[f])
                .filter(v => v !== null && v !== undefined);

            const deptAvg = deptVals.length > 0
                ? Number((deptVals.reduce((sum, v) => sum + Number(v), 0) / deptVals.length).toFixed(1))
                : 0;

            // College scores for this section (excluding NULLs)
            const collegeVals = collegePerformanceRows
                .map(r => r[f])
                .filter(v => v !== null && v !== undefined);

            const collegeAvg = collegeVals.length > 0
                ? Number((collegeVals.reduce((sum, v) => sum + Number(v), 0) / collegeVals.length).toFixed(1))
                : 0;

            // Distribution for department
            let high = 0;   // >= 80
            let medium = 0; // 60 to <80
            let low = 0;    // < 60

            deptVals.forEach(v => {
                const num = Number(v);
                if (num >= 80) high++;
                else if (num >= 60) medium++;
                else low++;
            });

            sections.push({
                key: sec.key,
                label: sec.label,
                deptAvg,
                collegeAvg,
                studentCount: deptVals.length,
                distribution: {
                    high,
                    medium,
                    low,
                    total: deptVals.length
                }
            });
        }

        res.status(200).json({
            totalActiveStudents,
            sections
        });

    } catch (error) {
        console.error("Error fetching AMCAT analytics stats:", error);
        res.status(500).json({ message: "Internal server error while fetching AMCAT statistics" });
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
    getDeptProfile,
    getReadinessDesk,
    getDashboardStats,
    exportDeptPlacementReportPdf,
    exportStudentReadinessCsv,
    exportUnplacedStudentsCsv,
    exportProfileGapsCsv,
    exportPlacedPackagesCsv,
    exportEligibilityCsv,
    createDeptEvent,
    updateDeptEvent,
    deleteDeptEvent,
    getDeptEvents,
    getAmcatStats
};

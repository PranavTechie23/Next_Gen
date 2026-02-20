const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

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
            connection.release();

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
            connection.release();
            console.error("Transaction Error:", err);
            res.status(500).json({ message: "Failed to create Dept Head due to server error" });
        }

    } catch (error) {
        console.error("Error creating Dept Head:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createDeptHead
};

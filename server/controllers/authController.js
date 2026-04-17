const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Register TPO Admin ---
exports.registerAdmin = async (req, res) => {
    const { 
        name, email, password, phone, employee_code, 
        institution_name, institution_code, institution_address, 
        adminKey 
    } = req.body;




    // 1. Verify Secret Key
    if (adminKey !== process.env.ADMIN_REGISTRATION_SECRET) {
        return res.status(403).json({ message: "Forbidden: Invalid Admin Registration Key" });
    }

    // 2. Validate Input
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!institution_name) missingFields.push('institution_name');
    if (!institution_code) missingFields.push('institution_code');

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Please provide all required fields: ${missingFields.join(', ')}` });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 3. Check if user already exists
        const [existingUser] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // 4. Create Institution (or check if exists by code)
        // Check if institution code already exists
        const [existingInst] = await connection.execute(
            'SELECT id FROM institutions WHERE code = ?',
            [institution_code]
        );

        let institution_id;

        if (existingInst.length > 0) {
            // Option A: Link to existing institution
            // institution_id = existingInst[0].id;
             
            // Option B: Error out (Since we want 1 TPO Admin per institute, and usually 1 Registration creates the institute)
            // But what if TPO Admin implementation allows adding more admins later?
            // For now, let's assume we use the existing one if code matches, OR we can error.
            // Given "only one tpo admin registration allowed for one institute", if the institution exists, 
            // it likely already has an admin (or was created manually).
            
            // Let's check if it has an admin
            institution_id = existingInst[0].id;
            
            const [existingAdmin] = await connection.execute(
                'SELECT * FROM users WHERE institution_id = ? AND role = "TPO_ADMIN"',
                [institution_id]
            );

            if (existingAdmin.length > 0) {
                 await connection.rollback();
                 return res.status(400).json({ message: "Institution already has a TPO Admin registered." });
            }
            
        } else {
            // Create New Institution
            const [instResult] = await connection.execute(
                'INSERT INTO institutions (name, code, address, contact_email) VALUES (?, ?, ?, ?)',
                [institution_name, institution_code, institution_address, email] // Using admin email as contact for now
            );
            institution_id = instResult.insertId;
        }

        // 5. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 6. Insert into Users Table
        const [userResult] = await connection.execute(
            'INSERT INTO users (institution_id, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [institution_id, email, passwordHash, 'TPO_ADMIN']
        );

        const userId = userResult.insertId;

        // 7. Insert into TPO Admins Table
        await connection.execute(
            'INSERT INTO tpo_admins (user_id, name, employee_code, phone) VALUES (?, ?, ?, ?)',
            [userId, name, employee_code || null, phone || null]
        );

        await connection.commit();

        res.status(201).json({ message: "Institution and TPO Admin registered successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error in registerAdmin:", error);
        res.status(500).json({ message: "Server Error during registration." });
    } finally {
        connection.release();
    }
};

// --- Generic Login (Admin, Head, Student) ---
exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // 1. Validate Input
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    let connection;

    try {
        connection = await db.getConnection();
        // 2. Find User by Email
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = users[0];

        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // 4. Check if Account is Active
        if (!user.is_active) {
            return res.status(403).json({ message: "Account is inactive. Contact Admin." });
        }

        // 5. Generate JWT Token
        const payload = {
            id: user.id,
            role: user.role,
            institution_id: user.institution_id
        };

        const defaultTokenExpiry = process.env.JWT_EXPIRE || '1d';
        const rememberTokenExpiry = process.env.JWT_REMEMBER_EXPIRE || '30d';
        const tokenExpiry = rememberMe ? rememberTokenExpiry : defaultTokenExpiry;
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: tokenExpiry
        });

        // 6. Update Last Login
        await connection.execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // 7. Fetch Role-Specific Details (Optional but useful)
        let profile = {};
        if (user.role === 'TPO_ADMIN') {
            const [adminProfile] = await connection.execute('SELECT name FROM tpo_admins WHERE user_id = ?', [user.id]);
            if (adminProfile.length > 0) profile = adminProfile[0];
        } else if (user.role === 'TPO_HEAD') {
             const [headProfile] = await connection.execute('SELECT name, department_id FROM tpo_heads WHERE user_id = ?', [user.id]);
             if (headProfile.length > 0) profile = headProfile[0];
        } else if (user.role === 'STUDENT') {
             const [studentProfile] = await connection.execute('SELECT roll_number, department_id, is_placed FROM students WHERE user_id = ?', [user.id]);
             if (studentProfile.length > 0) profile = studentProfile[0];
        }

        // 8. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000)
        });

        res.json({
            message: "Login successful.",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                must_change_password: user.must_change_password,
                ...profile
            }
        });

    } catch (error) {
        console.error("Error in login:", error);
        if (
            error &&
            (
                error.code === 'ER_ACCESS_DENIED_ERROR' ||
                error.code === 'ECONNREFUSED' ||
                error.code === 'ENOTFOUND'
            )
        ) {
            return res.status(503).json({
                message: "Database connection failed. Please check backend DB environment variables."
            });
        }
        res.status(500).json({ message: "Server Error during login." });
    } finally {
        if (connection) connection.release();
    }
};

// --- Logout (Blacklist Token + Clear Cookie) ---
exports.logout = async (req, res) => {
    const token = req.token || req.cookies?.token; 

    if (!token) {
        return res.status(400).json({ message: "No token provided." });
    }

    const connection = await db.getConnection();

    try {
        const decoded = jwt.decode(token);
        if (decoded) {
            const expiry = new Date(decoded.exp * 1000); 

            await connection.execute(
                'INSERT INTO token_blacklist (user_id, token, expiry) VALUES (?, ?, ?)',
                [req.user ? req.user.id : decoded.id, token, expiry] 
            );
        }

        res.clearCookie('token');
        res.json({ message: "Logout successful. Cookie cleared." });

    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Server Error during logout." });
    } finally {
        connection.release();
    }
};

// --- Request Password Reset ---
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please provide your email." });
    }

    const connection = await db.getConnection();

    try {
        // 1. Check if user exists
        const [users] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // For security, do not reveal if email exists
            return res.status(200).json({ message: "If your email is registered, you will receive a reset link." });
        }

        // 2. Generate Tokens
        const resetToken = crypto.randomBytes(32).toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const tokenHash = await bcrypt.hash(resetToken, 10);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        await connection.beginTransaction();

        // 3. Store in DB
        await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);

        await connection.execute(
            'INSERT INTO password_resets (email, token, otp, expires_at) VALUES (?, ?, ?, ?)',
            [email, tokenHash, otp, expiresAt]
        );

        await connection.commit();

        // 4. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
                pass: process.env.SMTP_PASSWORD || 'your-app-password'
            }
        });

        const frontendUrl = req.headers.origin || 'http://localhost:3001';
        const resetLink = `${frontendUrl}/forgot-password?token=${resetToken}&email=${email}`;

        const mailOptions = {
            from: process.env.SMTP_EMAIL || 'noreply@placement-cell.com',
            to: email,
            subject: 'Password Reset Request',
            text: `OTP: ${otp}\nLink: ${resetLink}`,
            html: `<p>OTP: <strong>${otp}</strong></p><p><a href="${resetLink}">Reset Password</a></p>`
        };

        try {
            if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
                 await transporter.sendMail(mailOptions);
                 res.json({ message: "Password reset link sent to your email." });
            } else {
                 console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}, Link: ${resetLink}`);
                 res.json({ message: "Password reset generated. Check server logs." });
            }
        } catch (emailError) {
             console.error("Email sending failed:", emailError);
             res.status(500).json({ message: "Error sending email." });
        }

    } catch (error) {
        await connection.rollback();
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ message: "Server Error." });
    } finally {
        connection.release();
    }
};

// --- Verify OTP and Reset Password ---
exports.verifyAndResetPassword = async (req, res) => {
    // Assuming the frontend passes token as well
    const { email, otp, newPassword, token } = req.body;

    if (!email || !otp || !newPassword || !token) {
        return res.status(400).json({ message: "Please provide email, otp, token, and newPassword." });
    }

    const connection = await db.getConnection();

    try {
        // 1. Check if the reset request exists and is valid
        const [resets] = await connection.execute(
            'SELECT * FROM password_resets WHERE email = ? AND otp = ?',
            [email, otp]
        );

        if (resets.length === 0) {
            return res.status(400).json({ message: "Invalid OTP or Email." });
        }

        const resetRecord = resets[0];

        // 2. Verify token
        const isTokenValid = await bcrypt.compare(token, resetRecord.token);
        if (!isTokenValid) {
            return res.status(400).json({ message: "Invalid Reset Token." });
        }

        // 3. Check Expiry
        if (new Date() > new Date(resetRecord.expires_at)) {
            // Cleanup expired token
            await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        await connection.beginTransaction();

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // 4. Update the user record
        const [updateResult] = await connection.execute(
            'UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE email = ?',
            [newPasswordHash, email]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User not found." });
        }

        // 5. Cleanup the used OTP
        await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);

        await connection.commit();
        res.json({ message: "Password reset successfully. You can now login." });

    } catch (error) {
        await connection.rollback();
        console.error("Error in verifyAndResetPassword:", error);
        res.status(500).json({ message: "Server Error during password reset." });
    } finally {
        connection.release();
    }
};

// --- Change Password (Authenticated) ---
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Please provide current and new password." });
    }

    const connection = await db.getConnection();

    try {
        // 1. Get User's Current Password Hash
        const [users] = await connection.execute(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = users[0];

        // 2. Verify Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password." });
        }

        // 3. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // 4. Update Password & Reset Flag
        await connection.execute(
            'UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE id = ?',
            [newPasswordHash, userId]
        );

        res.json({ message: "Password changed successfully." });

    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Server Error during password change." });
    } finally {
        connection.release();
    }
};
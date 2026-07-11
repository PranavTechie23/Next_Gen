const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { validatePassword } = require('../utils/passwordPolicy');

const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCK_MINUTES = 15;

async function verifyOtpForEmail(connection, email, otp) {
    const [records] = await connection.execute(
        'SELECT * FROM password_resets WHERE email = ? ORDER BY created_at DESC LIMIT 1',
        [email]
    );

    if (!records.length) {
        return { ok: false, status: 400, message: 'Invalid OTP.' };
    }

    const record = records[0];

    if (record.otp_locked_until && new Date(record.otp_locked_until) > new Date()) {
        const minutes = Math.max(1, Math.ceil((new Date(record.otp_locked_until).getTime() - Date.now()) / 60000));
        return {
            ok: false,
            status: 429,
            message: `Too many failed OTP attempts. Try again in ${minutes} minute(s).`,
        };
    }

    if (new Date() > new Date(record.expires_at)) {
        await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);
        return { ok: false, status: 400, message: 'OTP has expired. Please request a new one.' };
    }

    if (String(record.otp) !== String(otp)) {
        const attempts = Number(record.otp_failed_attempts || 0) + 1;
        if (attempts >= OTP_MAX_ATTEMPTS) {
            await connection.execute(
                'UPDATE password_resets SET otp_failed_attempts = ?, otp_locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE email = ?',
                [attempts, OTP_LOCK_MINUTES, email]
            );
            return {
                ok: false,
                status: 429,
                message: `Too many failed OTP attempts. Try again in ${OTP_LOCK_MINUTES} minutes.`,
            };
        }
        await connection.execute(
            'UPDATE password_resets SET otp_failed_attempts = ? WHERE email = ?',
            [attempts, email]
        );
        return { ok: false, status: 400, message: 'Invalid OTP.' };
    }

    await connection.execute(
        'UPDATE password_resets SET otp_failed_attempts = 0, otp_locked_until = NULL WHERE email = ?',
        [email]
    );
    return { ok: true, record };
}

function getCookieConfig() {
    const envSameSite = process.env.COOKIE_SAMESITE?.toLowerCase();
    const sameSite = ['lax', 'strict', 'none'].includes(envSameSite) ? envSameSite : 'lax';
    const secure = process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === 'true'
        : sameSite === 'none' || process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure,
        sameSite
    };
}

function jwtExpiryToMs(expiry) {
    if (!expiry || typeof expiry !== 'string') {
        return 24 * 60 * 60 * 1000;
    }

    const match = expiry.trim().match(/^(\d+)\s*([smhdw])?$/i);
    if (!match) {
        return 24 * 60 * 60 * 1000;
    }

    const amount = Number(match[1]);
    const unit = (match[2] || 's').toLowerCase();
    const unitMs = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000
    };

    return amount * (unitMs[unit] || 1000);
}

function getJwtExpiryOptions(rememberMe) {
    const defaultTokenExpiry = process.env.JWT_EXPIRE || '1d';
    const rememberTokenExpiry = process.env.JWT_REMEMBER_EXPIRE || '30d';
    const expiresIn = rememberMe ? rememberTokenExpiry : defaultTokenExpiry;
    return { expiresIn, maxAge: jwtExpiryToMs(expiresIn) };
}

// --- Register TPO ---
exports.registerTPO = async (req, res) => {
    const {
        name, email, password, phone, employee_code,
        institution_name, institution_code, institution_address,
        TPOKey
    } = req.body;


    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) {
        return res.status(400).json({ message: passwordCheck.message });
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

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name.trim())) {
        return res.status(400).json({ message: "Invalid name format. Letters and spaces only (2-50 characters)." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (phone) {
        const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.trim())) {
            return res.status(400).json({ message: "Invalid phone number. Must be a valid 10-digit Indian number (with optional +91/91/0 prefix)." });
        }
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Verify Dynamic Registration Key
        if (!TPOKey) {
            await connection.rollback();
            return res.status(403).json({ message: "Forbidden: Missing TPO Registration Key" });
        }

        const hashedTPOKey = crypto.createHash('sha256').update(TPOKey.trim()).digest('hex');

        const [keys] = await connection.execute(
            'SELECT * FROM registration_keys WHERE key_value = ?',
            [hashedTPOKey]
        );

        if (keys.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "Forbidden: Invalid TPO Registration Key" });
        }

        const regKey = keys[0];
        if (regKey.is_used) {
            await connection.rollback();
            return res.status(403).json({ message: "Forbidden: Registration Key has already been used" });
        }

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

            // Option B: Error out (Since we want 1 TPO per institute, and usually 1 Registration creates the institute)
            // But what if TPO implementation allows adding more TPOs later?
            // For now, let's assume we use the existing one if code matches, OR we can error.
            // Given "only one TPO registration allowed for one institute", if the institution exists, 
            // it likely already has an TPO (or was created manually).

            // Let's check if it has an TPO
            institution_id = existingInst[0].id;

            const [existingTPO] = await connection.execute(
                'SELECT * FROM users WHERE institution_id = ? AND role = "TPO_ADMIN"',
                [institution_id]
            );

            if (existingTPO.length > 0) {
                await connection.rollback();
                return res.status(400).json({ message: "Institution already has a TPO registered." });
            }

        } else {
            // Create New Institution
            const [instResult] = await connection.execute(
                'INSERT INTO institutions (name, code, address, contact_email) VALUES (?, ?, ?, ?)',
                [institution_name, institution_code, institution_address, email] // Using TPO email as contact for now
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

        // 7. Insert into TPOs Table
        await connection.execute(
            'INSERT INTO tpo_admins (user_id, name, employee_code, phone) VALUES (?, ?, ?, ?)',
            [userId, name, employee_code || null, phone || null]
        );

        // 8. Mark Registration Key as Used
        await connection.execute(
            'UPDATE registration_keys SET is_used = TRUE, used_by_institution_id = ? WHERE id = ?',
            [institution_id, regKey.id]
        );

        await connection.commit();

        res.status(201).json({ message: "Institution and TPO registered successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error in registerTPO:", error);
        res.status(500).json({ message: "Server Error during registration." });
    } finally {
        connection.release();
    }
};

const nodemailer = require('nodemailer');

// --- Generic Login (TPO, Head, Student) ---
exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    logger.auth('Login attempt', { email });

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
            logger.auth('User not found', { email });
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = users[0];
        logger.auth('User found', { userId: user.id, role: user.role });

        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            logger.auth('Password mismatch', { email });
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // 4. Check if Account is Active
        if (!user.is_active) {
            logger.auth('Account inactive', { email });
            return res.status(403).json({ message: "Account is inactive. Contact TPO." });
        }

        if (user.institution_id && user.role !== 'SUPER_ADMIN') {
            const [inst] = await connection.execute('SELECT is_active FROM institutions WHERE id = ?', [user.institution_id]);
            if (inst.length > 0 && !inst[0].is_active) {
                logger.auth('Institution inactive', { email });
                return res.status(403).json({ message: "Your institution's access has been suspended. Please contact platform support." });
            }
        }

        // 5. Generate JWT Token
        const payload = {
            id: user.id,
            role: user.role,
            institution_id: user.institution_id
        };

        const { expiresIn: tokenExpiry, maxAge: cookieMaxAge } = getJwtExpiryOptions(rememberMe);

        const token = jwt.sign({
            ...payload,
            session_nonce: crypto.randomBytes(8).toString('hex')
        }, process.env.JWT_SECRET, {
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
            const [TPOProfile] = await connection.execute('SELECT name FROM tpo_admins WHERE user_id = ?', [user.id]);
            if (TPOProfile.length > 0) profile = TPOProfile[0];
        } else if (user.role === 'TPO_HEAD') {
            const [headProfile] = await connection.execute('SELECT name, department_id FROM tpo_heads WHERE user_id = ?', [user.id]);
            if (headProfile.length > 0) profile = headProfile[0];
        } else if (user.role === 'STUDENT') {
            const [studentProfile] = await connection.execute('SELECT roll_number, department_id, is_placed FROM students WHERE user_id = ?', [user.id]);
            if (studentProfile.length > 0) profile = studentProfile[0];
        }

        // 8. Set Cookie
        res.cookie('token', token, {
            ...getCookieConfig(),
            maxAge: cookieMaxAge
        });

        logger.auth('Login successful', { userId: user.id, role: user.role });
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
        res.status(500).json({
            message: "Server Error during login.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

        res.clearCookie('token', getCookieConfig());
        res.json({ message: "Logout successful. Cookie cleared." });

    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Server Error during logout." });
    } finally {
        connection.release();
    }
};

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
            return res.status(200).json({ message: "If your email is registered, you will receive an OTP." });
        }

        // 2. Rate-limit: only allow a new OTP after 60 seconds
        const RESEND_COOLDOWN_SECONDS = 60;
        const [existingResets] = await connection.execute(
            'SELECT created_at FROM password_resets WHERE email = ? ORDER BY created_at DESC LIMIT 1',
            [email]
        );

        if (existingResets.length > 0) {
            const lastSentAt = new Date(existingResets[0].created_at);
            const secondsElapsed = Math.floor((Date.now() - lastSentAt.getTime()) / 1000);
            const secondsRemaining = RESEND_COOLDOWN_SECONDS - secondsElapsed;

            if (secondsRemaining > 0) {
                connection.release();
                return res.status(429).json({
                    message: `Please wait ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''} before requesting a new OTP.`,
                    retryAfter: secondsRemaining
                });
            }
        }

        // 3. Generate Tokens
        const resetToken = crypto.randomBytes(32).toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const tokenHash = await bcrypt.hash(resetToken, 10);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        await connection.beginTransaction();

        // 4. Store in DB (replace any old record)
        await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);

        try {
            await connection.execute(
                'INSERT INTO password_resets (email, token, otp, expires_at, otp_failed_attempts, otp_locked_until) VALUES (?, ?, ?, ?, 0, NULL)',
                [email, tokenHash, otp, expiresAt]
            );
        } catch (insertErr) {
            if (insertErr.code === 'ER_BAD_FIELD_ERROR') {
                await connection.execute(
                    'INSERT INTO password_resets (email, token, otp, expires_at) VALUES (?, ?, ?, ?)',
                    [email, tokenHash, otp, expiresAt]
                );
            } else {
                throw insertErr;
            }
        }

        await connection.commit();

        // 4. Send Email
        const { sendEmail } = require('../utils/emailSender');
        const EmailTemplateService = require('../services/EmailTemplateService');

        const template = await EmailTemplateService.getTemplate('password_reset_otp');
        const { subject, html, text } = EmailTemplateService.render(template, { otp });

        const result = await sendEmail({
            to: email,
            subject: subject || 'Password Reset OTP Request',
            html: html || `<p>Your OTP is: ${otp}</p>`,
            text: text || `Your OTP is: ${otp}`,
            fallbackOtp: otp
        });

        if (result.success) {
            res.json({ message: "Password reset OTP sent to your email." });
        } else {
            res.status(200).json({ message: result.message });
        }

    } catch (error) {
        await connection.rollback();
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ message: "Server Error." });
    } finally {
        connection.release();
    }
};
// --- Verify OTP Only ---
exports.verifyOtpOnly = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Please provide email and otp." });
    }

    const connection = await db.getConnection();

    try {
        const otpResult = await verifyOtpForEmail(connection, email, otp);
        if (!otpResult.ok) {
            return res.status(otpResult.status).json({ message: otpResult.message });
        }

        res.json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error("Error in verifyOtpOnly:", error);
        res.status(500).json({ message: "Server Error." });
    } finally {
        connection.release();
    }
};

// --- Verify OTP and Reset Password ---
exports.verifyAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Please provide email, otp, and newPassword." });
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.ok) {
        return res.status(400).json({ message: passwordCheck.message });
    }

    const connection = await db.getConnection();

    try {
        const otpResult = await verifyOtpForEmail(connection, email, otp);
        if (!otpResult.ok) {
            return res.status(otpResult.status).json({ message: otpResult.message });
        }

        await connection.beginTransaction();
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

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.ok) {
        return res.status(400).json({ message: passwordCheck.message });
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
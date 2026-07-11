const db = require('../config/db');
const crypto = require('crypto');

exports.generateKey = async (req, res) => {
    const { notes } = req.body;
    let connection;

    try {
        connection = await db.getConnection();
        
        // Generate a random 16-character secure key
        const newKey = crypto.randomBytes(8).toString('hex');
        
        // Hash the key using SHA-256
        const hashedKey = crypto.createHash('sha256').update(newKey).digest('hex');

        await connection.execute(
            'INSERT INTO registration_keys (key_value, notes) VALUES (?, ?)',
            [hashedKey, notes || null]
        );

        res.status(201).json({ message: "Key generated successfully", key: newKey });

    } catch (error) {
        console.error("Error generating key:", error);
        res.status(500).json({ message: "Server error generating key" });
    } finally {
        if (connection) connection.release();
    }
};

exports.listKeys = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        
        const [keys] = await connection.execute(`
            SELECT rk.*, i.name as institution_name 
            FROM registration_keys rk
            LEFT JOIN institutions i ON rk.used_by_institution_id = i.id
            ORDER BY rk.created_at DESC
        `);

        res.status(200).json(keys);

    } catch (error) {
        console.error("Error listing keys:", error);
        res.status(500).json({ message: "Server error listing keys" });
    } finally {
        if (connection) connection.release();
    }
};

exports.revokeKey = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await db.getConnection();
        
        const [result] = await connection.execute(
            'DELETE FROM registration_keys WHERE id = ? AND is_used = FALSE',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Key not found or already used." });
        }

        res.status(200).json({ message: "Key revoked successfully" });

    } catch (error) {
        console.error("Error revoking key:", error);
        res.status(500).json({ message: "Server error revoking key" });
    } finally {
        if (connection) connection.release();
    }
};

exports.listInstitutions = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [institutions] = await connection.execute(
            'SELECT id, name, code FROM institutions ORDER BY name ASC'
        );
        res.status(200).json(institutions);
    } catch (error) {
        console.error("Error listing institutions:", error);
        res.status(500).json({ message: "Server error listing institutions" });
    } finally {
        if (connection) connection.release();
    }
};

exports.createCompanyKit = async (req, res) => {
    const { institution_id, id, name, tier, description, avg_package, logo_url, gradient } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        
        // Use the provided ID or generate one from name
        const kitId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        await connection.execute(
            `INSERT INTO company_assessment_kits 
            (id, name, tier, description, avg_package, logo_url, gradient, institution_id, interview_rounds, interview_tips, resources) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]')`,
            [kitId, name, tier || 'Startup', description || '', avg_package || '', logo_url || '', gradient || 'from-gray-600 to-gray-500', institution_id]
        );
        
        res.status(201).json({ message: "Company kit created successfully", id: kitId });
    } catch (error) {
        console.error("Error creating company kit:", error);
        res.status(500).json({ message: "Server error creating company kit" });
    } finally {
        if (connection) connection.release();
    }
};

exports.createCodingProblem = async (req, res) => {
    const { institution_id, company_id, title, difficulty, topic, url, pool_type } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.execute(
            `INSERT INTO coding_problems 
            (title, difficulty, topic, url, institution_id, pool_type) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, difficulty || 'Medium', topic || '', url || '', institution_id, pool_type || 'SERVICE']
        );
        
        const problemId = result.insertId;

        if (company_id) {
            await connection.execute(
                'INSERT INTO company_problem_mapping (company_id, problem_id) VALUES (?, ?)',
                [company_id, problemId]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Coding problem created successfully", id: problemId });
    } catch (error) {
        console.error("Error creating coding problem:", error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Server error creating coding problem" });
    } finally {
        if (connection) connection.release();
    }
};

exports.getMetrics = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        
        const [[{ totalInstitutions }]] = await connection.execute('SELECT COUNT(*) as totalInstitutions FROM institutions');
        const [[{ totalStudents }]] = await connection.execute("SELECT COUNT(*) as totalStudents FROM users WHERE role = 'STUDENT'");
        const [[{ totalTPOs }]] = await connection.execute("SELECT COUNT(*) as totalTPOs FROM users WHERE role IN ('TPO_ADMIN', 'TPO_HEAD')");
        const [[{ totalPlacements }]] = await connection.execute('SELECT COUNT(*) as totalPlacements FROM students WHERE is_placed = TRUE');
        const [[{ totalDrives }]] = await connection.execute('SELECT COUNT(*) as totalDrives FROM recruitment_drives');
        const [[{ totalKits }]] = await connection.execute('SELECT COUNT(*) as totalKits FROM company_assessment_kits');

        res.status(200).json({
            totalInstitutions,
            totalStudents,
            totalTPOs,
            totalPlacements,
            totalDrives,
            totalKits
        });

    } catch (error) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ message: "Server error fetching metrics" });
    } finally {
        if (connection) connection.release();
    }
};

exports.createAnnouncement = async (req, res) => {
    const { title, message, expires_at, is_important } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        const [result] = await connection.execute(
            `INSERT INTO announcements (title, message, institution_id, created_by, expires_at, is_important) 
             VALUES (?, ?, NULL, ?, ?, ?)`,
            [title, message, req.user.id, expires_at || null, is_important || false]
        );
        res.status(201).json({ message: "Global announcement created successfully", id: result.insertId });
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Server error creating announcement" });
    } finally {
        if (connection) connection.release();
    }
};

exports.listAnnouncements = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [announcements] = await connection.execute(
            `SELECT * FROM announcements 
             WHERE institution_id IS NULL 
             ORDER BY created_at DESC`
        );
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error listing announcements:", error);
        res.status(500).json({ message: "Server error listing announcements" });
    } finally {
        if (connection) connection.release();
    }
};

exports.toggleInstitutionStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        const [result] = await connection.execute(
            'UPDATE institutions SET is_active = ? WHERE id = ?',
            [is_active, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Institution not found" });
        }
        res.status(200).json({ message: `Institution status updated to ${is_active ? 'Active' : 'Suspended'}` });
    } catch (error) {
        console.error("Error toggling institution status:", error);
        res.status(500).json({ message: "Server error toggling institution status" });
    } finally {
        if (connection) connection.release();
    }
};

exports.listUsers = async (req, res) => {
    let connection;
    try {
        const { page = 1, limit = 10, search = '', role = '', institution_id = '' } = req.query;
        
        const offset = (page - 1) * limit;
        let query = `
             SELECT u.id, u.email, u.role, u.is_active, u.created_at, i.name as institution_name
             FROM users u
             LEFT JOIN institutions i ON u.institution_id = i.id
             WHERE 1=1
        `;
        let countQuery = `
             SELECT COUNT(*) as total
             FROM users u
             LEFT JOIN institutions i ON u.institution_id = i.id
             WHERE 1=1
        `;
        const queryParams = [];
        const countParams = [];

        if (search) {
            query += ` AND (u.email LIKE ? OR i.name LIKE ?)`;
            countQuery += ` AND (u.email LIKE ? OR i.name LIKE ?)`;
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }

        if (role && role !== 'ALL') {
            query += ` AND u.role = ?`;
            countQuery += ` AND u.role = ?`;
            queryParams.push(role);
            countParams.push(role);
        }

        if (institution_id && institution_id !== 'ALL') {
            query += ` AND u.institution_id = ?`;
            countQuery += ` AND u.institution_id = ?`;
            queryParams.push(institution_id);
            countParams.push(institution_id);
        }

        query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
        
        // LIMIT and OFFSET should be passed as strings or ints depending on mysql2 config, 
        // string with execute is fine for numbers but to be safe we cast to String
        queryParams.push(String(limit), String(offset));

        connection = await db.getConnection();
        const [users] = await connection.execute(query, queryParams);
        const [totalResult] = await connection.execute(countQuery, countParams);
        
        const total = totalResult[0].total;

        res.status(200).json({
            users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error listing users:", error);
        res.status(500).json({ message: "Server error listing users" });
    } finally {
        if (connection) connection.release();
    }
};

const jwt = require('jsonwebtoken');

function jwtExpiryToMs(expiry) {
    if (!expiry || typeof expiry !== 'string') return 24 * 60 * 60 * 1000;
    const match = expiry.trim().match(/^(\d+)\s*([smhdw])?$/i);
    if (!match) return 24 * 60 * 60 * 1000;
    const amount = Number(match[1]);
    const unit = (match[2] || 's').toLowerCase();
    const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000, w: 7 * 24 * 60 * 60 * 1000 };
    return amount * (unitMs[unit] || 1000);
}

function getCookieConfig() {
    const envSameSite = process.env.COOKIE_SAMESITE?.toLowerCase();
    const sameSite = ['lax', 'strict', 'none'].includes(envSameSite) ? envSameSite : 'lax';
    const secure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : sameSite === 'none' || process.env.NODE_ENV === 'production';
    return { httpOnly: true, secure, sameSite };
}

exports.impersonateUser = async (req, res) => {
    const { userId } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });
        const user = users[0];

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            institution_id: user.institution_id,
            session_nonce: crypto.randomBytes(8).toString('hex')
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '1d'
        });

        res.cookie('token', token, {
            ...getCookieConfig(),
            maxAge: jwtExpiryToMs(process.env.JWT_EXPIRE || '1d')
        });

        res.status(200).json({ message: `Impersonating ${user.email}`, role: user.role });
    } catch (error) {
        console.error("Error impersonating user:", error);
        res.status(500).json({ message: "Server error impersonating user" });
    } finally {
        if (connection) connection.release();
    }
};

exports.getSettings = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [settings] = await connection.execute('SELECT * FROM system_settings');
        const settingsObj = {};
        settings.forEach(s => settingsObj[s.setting_key] = s.setting_value);
        res.status(200).json(settingsObj);
    } catch (error) {
        console.error("Error getting settings:", error);
        res.status(500).json({ message: "Server error getting settings" });
    } finally {
        if (connection) connection.release();
    }
};

exports.updateSetting = async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.execute(
            'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [key, value, value]
        );
        res.status(200).json({ message: "Setting updated successfully" });
    } catch (error) {
        console.error("Error updating setting:", error);
        res.status(500).json({ message: "Server error updating setting" });
    } finally {
        if (connection) connection.release();
    }
};

exports.getAuditLogs = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [logs] = await connection.execute(
            `SELECT a.*, u.email as actor_email 
             FROM audit_logs a 
             LEFT JOIN users u ON a.actor_user_id = u.id 
             ORDER BY a.timestamp DESC 
             LIMIT 100`
        );
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ message: "Server error fetching audit logs" });
    } finally {
        if (connection) connection.release();
    }
};


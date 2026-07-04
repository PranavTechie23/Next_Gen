const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const RESUME_DIR = path.join(__dirname, '../uploads/resumes');
const AVATAR_DIR = path.join(__dirname, '../uploads/avatars');

const SAFE_RESUME = /^resume-\d+-\d+\.pdf$/i;
const SAFE_AVATAR = /^avatar-\d+-\d+\.(jpg|jpeg|png|webp)$/i;

function safeBasename(raw) {
    const base = path.basename(String(raw || ''));
    if (!base || base.includes('..') || base.includes('/') || base.includes('\\')) {
        return null;
    }
    return base;
}

async function canAccessStudentUserId(req, studentUserId) {
    const requesterId = req.user?.id;
    const role = String(req.user?.role || '').trim().toUpperCase();
    const targetId = Number(studentUserId);

    if (!requesterId || !Number.isFinite(targetId)) return false;
    if (requesterId === targetId) return true;

    if (role === 'TPO_ADMIN') {
        const [rows] = await db.execute(
            `SELECT s.user_id FROM students s
             JOIN users u ON s.user_id = u.id
             WHERE s.user_id = ? AND u.institution_id = ? LIMIT 1`,
            [targetId, req.user.institution_id]
        );
        return rows.length > 0;
    }

    if (role === 'TPO_HEAD') {
        const [headRows] = await db.execute(
            'SELECT department_id FROM tpo_heads WHERE user_id = ? LIMIT 1',
            [requesterId]
        );
        if (!headRows.length) return false;
        const [rows] = await db.execute(
            'SELECT user_id FROM students WHERE user_id = ? AND department_id = ? LIMIT 1',
            [targetId, headRows[0].department_id]
        );
        return rows.length > 0;
    }

    return false;
}

function ownerIdFromFilename(filename, prefix) {
    const match = String(filename).match(new RegExp(`^${prefix}-(\\d+)-`, 'i'));
    return match ? Number(match[1]) : null;
}

async function sendProtectedFile(req, res, { dir, filename, safePattern, ownerPrefix, contentType }) {
    const safeName = safeBasename(filename);
    if (!safeName || !safePattern.test(safeName)) {
        return res.status(404).json({ message: 'File not found.' });
    }

    const ownerId = ownerIdFromFilename(safeName, ownerPrefix);
    if (!ownerId || !(await canAccessStudentUserId(req, ownerId))) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const absolutePath = path.join(dir, safeName);
    if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: 'File not found.' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.sendFile(absolutePath);
}

exports.serveResume = async (req, res) => {
    try {
        return await sendProtectedFile(req, res, {
            dir: RESUME_DIR,
            filename: req.params.filename,
            safePattern: SAFE_RESUME,
            ownerPrefix: 'resume',
            contentType: 'application/pdf',
        });
    } catch (error) {
        console.error('serveResume error:', error.message);
        return res.status(500).json({ message: 'Could not retrieve file.' });
    }
};

exports.serveAvatar = async (req, res) => {
    try {
        const safeName = safeBasename(req.params.filename);
        if (!safeName || !SAFE_AVATAR.test(safeName)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        const ownerId = ownerIdFromFilename(safeName, 'avatar');
        if (!ownerId || !(await canAccessStudentUserId(req, ownerId))) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const absolutePath = path.join(AVATAR_DIR, safeName);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        const ext = path.extname(safeName).toLowerCase();
        const typeMap = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
        };

        res.setHeader('Content-Type', typeMap[ext] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'private, no-store');
        return res.sendFile(absolutePath);
    } catch (error) {
        console.error('serveAvatar error:', error.message);
        return res.status(500).json({ message: 'Could not retrieve file.' });
    }
};

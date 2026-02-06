const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ message: "Database Connected Successfully!", result: rows[0].solution });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
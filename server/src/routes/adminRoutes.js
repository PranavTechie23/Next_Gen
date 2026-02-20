const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

// POST /dept-heads - Create a new Department Head
router.post('/dept-heads',
    verifyToken,
    authorizeRole("TPO_ADMIN"),
    adminController.createDeptHead
);

module.exports = router;

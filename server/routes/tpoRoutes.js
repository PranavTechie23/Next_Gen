
const express = require('express');
const router = express.Router();
const tpoController = require('../../controllers/tpoController');
const verifyToken = require('../../src/middleware/verifyToken');
const authorizeRole = require('../../src/middleware/authorizeRole');

// GET /test    
// Middleware: verifyToken, authorizeRole("TPO_ADMIN")
router.get('/test', verifyToken, authorizeRole("TPO_ADMIN"), tpoController.testTpo);

// GET /approvals/students
// Middleware: verifyToken, authorizeRole("TPO_ADMIN")
router.get('/approvals/students', verifyToken, authorizeRole("TPO_ADMIN"), tpoController.getPendingStudentApprovals);

module.exports = router;

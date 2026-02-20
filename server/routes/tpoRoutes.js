
const express = require('express');
const router = express.Router();
const tpoController = require('../controllers/tpoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /test    
// Middleware: protect, authorize("TPO_ADMIN")
router.get('/test', protect, authorize("TPO_ADMIN"), tpoController.testTpo);

// GET /approvals/students
// Middleware: protect, authorize("TPO_ADMIN")
router.get('/approvals/students', protect, authorize("TPO_ADMIN"), tpoController.getPendingStudentApprovals);

module.exports = router;

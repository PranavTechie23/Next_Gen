const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/student/jobs
 * @desc    Get all job postings student is eligible for
 * @access  Private (Student Only)
 */
router.get(
    "/jobs",
    protect,
    authorize("STUDENT"),
    studentController.getEligibleJobs
);

module.exports = router;

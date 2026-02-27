const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/student/profile - Get logged-in student's profile
router.get('/profile',
    protect,
    authorize('STUDENT'),
    studentController.getStudentProfile
);

// PUT /api/student/profile/subjective - Update logged-in student's subjective profile info
router.put('/profile/subjective',
    protect,
    authorize('STUDENT'),
    studentController.updateStudentSubjectiveProfile
);

// GET /api/student/jobs - List eligible job postings for the student
router.get('/jobs',
    protect,
    authorize('STUDENT'),
    studentController.getEligibleJobs
);

// GET /api/student/jobs/:id - View details of a specific job
router.get('/jobs/:id',
    protect,
    authorize('STUDENT'),
    studentController.getJobDetails
);

// POST /api/student/jobs/:id/apply - Apply for a specific job
router.post('/jobs/:id/apply',
    protect,
    authorize('STUDENT'),
    studentController.applyForJob
);

// GET /api/student/applications - View status of applications
router.get('/applications',
    protect,
    authorize('STUDENT'),
    studentController.getApplications
);

module.exports = router;

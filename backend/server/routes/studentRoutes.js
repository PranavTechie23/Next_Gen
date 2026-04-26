const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const studentProfileController = require('../controllers/studentProfileController');
const roadmapController = require('../controllers/roadmapController');
const companyStatsController = require('../controllers/companyStatsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --------------------------------------------------
// NEW STUDENT PROFILE MODULE ROUTES
// --------------------------------------------------

// GET /api/student/profile - Get logged-in student's profile
router.get('/profile',
    protect,
    authorize('STUDENT'),
    studentProfileController.getProfile
);

// PUT /api/student/profile - Create or Update logged-in student's profile
router.put('/profile',
    protect,
    authorize('STUDENT'),
    studentProfileController.upsertProfile
);

// POST /api/student/profile/resume - Upload Resume (PDF only)
router.post('/profile/resume',
    protect,
    authorize('STUDENT'),
    studentProfileController.resumeUploadMiddleware,
    studentProfileController.uploadResume,
    studentProfileController.uploadErrorHandler
);

// --------------------------------------------------
// STUDENT ROADMAP (DYNAMIC) ROUTES
// --------------------------------------------------

// GET /api/student/roadmap - Get personalized roadmap for the logged-in student
router.get('/roadmap',
    protect,
    authorize('STUDENT'),
    roadmapController.getRoadmap
);

// PUT /api/student/performance - Upsert AMCAT/endsem/mock scores
router.put('/performance',
    protect,
    authorize('STUDENT'),
    roadmapController.upsertPerformance
);

// GET /api/student/company-stats?company=Google - Company stats for kit
router.get('/company-stats',
    protect,
    authorize('STUDENT'),
    companyStatsController.getCompanyStats
);

// --------------------------------------------------
// OLD / OTHER STUDENT ROUTES
// --------------------------------------------------

// (Optional) Kept the old subjective profile update if still needed by frontend
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

// DELETE /api/student/applications/:id - Withdraw application
router.delete('/applications/:id',
    protect,
    authorize('STUDENT'),
    studentController.withdrawApplication
);

module.exports = router;

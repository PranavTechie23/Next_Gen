const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const studentProfileController = require('../controllers/studentProfileController');
const roadmapController = require('../controllers/roadmapController');
const companyStatsController = require('../controllers/companyStatsController');
const webinarController = require('../controllers/webinarController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --------------------------------------------------
// STUDENT PROFILE MODULE ROUTES (v2 - includes target-role endpoint)
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

// POST /api/student/profile/target-role - Evaluate resume against a specific target role
router.post('/profile/target-role',
    protect,
    authorize('STUDENT'),
    studentProfileController.evaluateTargetRole
);

// PUT /api/student/profile/resume-sections - Manual add/edit/delete of parsed resume sections
router.put('/profile/resume-sections',
    protect,
    authorize('STUDENT'),
    studentProfileController.updateResumeSections
);

// POST /api/student/profile/avatar - Upload profile photo
router.post('/profile/avatar',
    protect,
    authorize('STUDENT'),
    studentProfileController.avatarUploadMiddleware,
    studentProfileController.uploadAvatar,
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

// POST /api/student/performance/amcat-report - Upload AMCAT PDF and auto-fill score metrics
router.post('/performance/amcat-report',
    protect,
    authorize('STUDENT'),
    roadmapController.amcatUploadMiddleware,
    roadmapController.uploadAmcatReport,
    roadmapController.amcatUploadErrorHandler
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

router.get('/webinars',
    protect,
    authorize('STUDENT'),
    webinarController.getStudentWebinars
);

router.post('/webinars/:id/register',
    protect,
    authorize('STUDENT'),
    webinarController.registerForWebinar
);

// Department Events
router.get('/dept-events',
    protect,
    authorize('STUDENT'),
    studentController.getDeptEvents
);

router.get('/announcements',
    protect,
    authorize('STUDENT'),
    studentController.getAnnouncements
);

module.exports = router;

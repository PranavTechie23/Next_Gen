const express = require('express');
const router = express.Router();
const multer = require('multer');
const deptController = require('../controllers/deptController');
const companyStatsController = require('../controllers/companyStatsController');
const webinarRecommendationController = require('../controllers/webinarRecommendationController');
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer to use memory storage so the file isn't saved to disk
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: limit file size to 5MB
});

// POST /api/dept/students/upload - Bulk upload students via Excel
router.post('/students/upload',
    protect,
    authorize('TPO_HEAD'), // Only Dept Heads can upload
    upload.single('file'),
    deptController.uploadStudents
);

// POST /api/dept/company-stats/upload - Bulk upload company stats via Excel
router.post('/company-stats/upload',
    protect,
    authorize('TPO_HEAD'),
    upload.single('file'),
    companyStatsController.uploadCompanyStats
);

// GET /api/dept/students - Get all students for the Department Head's department
router.get('/students',
    protect,
    authorize('TPO_HEAD'),
    deptController.getDepartmentStudents
);

// GET /api/dept/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats',
    protect,
    authorize('TPO_HEAD'),
    deptController.getDashboardStats
);

// GET /api/dept/me - Current department head profile
router.get('/me',
    protect,
    authorize('TPO_HEAD'),
    deptController.getDeptProfile
);

// GET /api/dept/readiness - Department readiness desk data
router.get('/readiness',
    protect,
    authorize('TPO_HEAD'),
    deptController.getReadinessDesk
);

// GET /api/dept/reports/placement-pdf — Department placement summary + selected offers (PDF)
router.get('/reports/placement-pdf',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportDeptPlacementReportPdf
);

// GET /api/dept/reports/student-readiness.csv — Readiness-style export for all dept students
router.get('/reports/student-readiness.csv',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportStudentReadinessCsv
);

router.get('/reports/unplaced-students.csv',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportUnplacedStudentsCsv
);

router.get('/reports/profile-gaps.csv',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportProfileGapsCsv
);

router.get('/reports/placed-packages.csv',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportPlacedPackagesCsv
);

router.get('/reports/eligibility.csv',
    protect,
    authorize('TPO_HEAD'),
    deptController.exportEligibilityCsv
);

// GET /api/dept/students/:id - View full details of a specific student
router.get('/students/:id',
    protect,
    authorize('TPO_HEAD'),
    deptController.getStudentDetails
);

// PUT /api/dept/students/:id - Update student information (academic/admin)
router.put('/students/:id',
    protect,
    authorize('TPO_HEAD'),
    deptController.updateStudent
);

// POST /api/dept/students - Create single or bulk students manually
router.post('/students',
    protect,
    authorize('TPO_HEAD'),
    deptController.createStudentsManually
);

// GET /api/dept/approvals/resumes - List students who updated their Resume/Skills
router.get('/approvals/resumes',
    protect,
    authorize('TPO_HEAD'),
    deptController.getRecentlyUpdatedProfiles
);

// PUT /api/dept/approvals/resumes/:id - Approve/Reject subjective profile changes
router.put('/approvals/resumes/:id',
    protect,
    authorize('TPO_HEAD'),
    deptController.reviewStudentProfile
);

// GET /api/dept/analytics/department-stats - Department Analytics
router.get('/analytics/department-stats',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    analyticsController.getDepartmentStats
);

// GET /api/dept/webinars/recommendations - AI webinar recommendations for Dept TPO
router.get('/webinars/recommendations',
    protect,
    authorize('TPO_HEAD'),
    webinarRecommendationController.getDeptWebinarRecommendations
);

// Department Events
router.post('/events',
    protect,
    authorize('TPO_HEAD'),
    deptController.createDeptEvent
);

router.get('/events',
    protect,
    authorize('TPO_HEAD'),
    deptController.getDeptEvents
);

module.exports = router;

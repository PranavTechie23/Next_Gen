const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');
const reportsController = require('../controllers/reportsController');
const webinarController = require('../controllers/webinarController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /dept-heads - Create a new Department Head
router.post('/dept-heads',
    protect,
    authorize("TPO_ADMIN"),
    adminController.createDeptHead
);

// GET /dept-heads - Get all Department Heads
router.get('/dept-heads',
    protect,
    authorize("TPO_ADMIN"),
    adminController.getDeptHeads
);

// GET /audit-logs - Get Audit Logs
router.get('/audit-logs',
    protect,
    authorize("TPO_ADMIN"),
    adminController.getAuditLogs
);

// GET /students - Get all students with filtering
router.get('/students',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    adminController.getStudentsList
);

// POST /companies - Create a new Company
router.post('/companies',
    protect,
    authorize("TPO_ADMIN"),
    adminController.createCompany
);

// POST /drives - Create a new Recruitment Drive
router.post('/drives',
    protect,
    authorize("TPO_ADMIN"),
    adminController.createDrive
);

// POST /drives/:id/jobs - Add a Job Posting to a Drive
router.post('/drives/:id/jobs',
    protect,
    authorize("TPO_ADMIN"),
    adminController.addJobToDrive
);

// GET /drives - Get all Recruitment Drives
router.get('/drives',
    protect,
    authorize("TPO_ADMIN"),
    adminController.getAllDrives
);

// PUT /drives/:id/status - Update Recruitment Drive Status
router.put('/drives/:id/status',
    protect,
    authorize("TPO_ADMIN"),
    adminController.updateDriveStatus
);

// GET /applications - Get all applications
router.get('/applications',
    protect,
    authorize("TPO_ADMIN"),
    adminController.getAllApplications
);

// PUT /applications/:id/status - Update application status
router.put('/applications/:id/status',
    protect,
    authorize("TPO_ADMIN"),
    adminController.updateApplicationStatus
);

// GET /analytics/placement-stats - Admin Analytics
router.get('/analytics/placement-stats',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    analyticsController.getPlacementStats
);

router.get('/analytics/dashboard',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    analyticsController.getAdminDashboardData
);

// --------------------------------------------------
// REPORTS & EXPORTS (TPO_ADMIN, TPO_HEAD)
// --------------------------------------------------

router.get('/reports/placement',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getPlacementReport
);

router.get('/reports/student-readiness',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getStudentReadinessReport
);

router.get('/reports/company-analysis',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getCompanyAnalysisReport
);

router.get('/reports/branch-performance',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getBranchPerformanceReport
);

router.get('/reports/at-risk-students',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getAtRiskStudentsReport
);

router.get('/reports/shortlisted',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getShortlistedStudentsReport
);

router.post('/reports/custom',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    reportsController.getCustomReport
);

router.get('/webinars',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    webinarController.listWebinarsForManagement
);

router.post('/webinars',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    webinarController.createWebinar
);

router.put('/webinars/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    webinarController.updateWebinar
);

module.exports = router;

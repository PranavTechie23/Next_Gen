const express = require('express');
const router = express.Router();
const TPOController = require('../controllers/tpoController');
const analyticsController = require('../controllers/analyticsController');
const jdParserController = require('../controllers/jdParserController');
const reportsController = require('../controllers/reportsController');
const webinarController = require('../controllers/webinarController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { attachTenantScope } = require('../middleware/institutionScope');
const {
    uploadLimiter,
    exportLimiter,
    analyticsRefreshLimiter,
} = require('../middleware/rateLimiter');

// POST /dept-heads - Create a new Department Head
router.post('/dept-heads',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.createDeptHead
);

// GET /dept-heads - Get all Department Heads
router.get('/dept-heads',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.getDeptHeads
);

// GET /audit-logs - Get Audit Logs
router.get('/audit-logs',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.getAuditLogs
);

// GET /students/:id - Get student profile with applications
router.get('/students/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.getStudentDetail
);

// GET /students - Get all students with filtering
router.get('/students',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.getStudentsList
);

// POST /companies - Create a new Company
router.post('/companies',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.createCompany
);

// GET /companies - Get all Companies
router.get('/companies',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.getCompanies
);

// POST /drives - Create a new Recruitment Drive
router.post('/drives',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.createDrive
);

// POST /drives/quick - Quick Create Drive (Recruiter + Drive + Job)
router.post('/drives/quick',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.quickCreateDrive
);

// POST /drives/:id/jobs - Add a Job Posting to a Drive
router.post('/drives/:id/jobs',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.addJobToDrive
);

// GET /drives - Get all Recruitment Drives
router.get('/drives',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.getAllDrives
);

// PUT /drives/:id/status - Update Recruitment Drive Status
router.put('/drives/:id/status',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.updateDriveStatus
);

// PUT /drives/:id - Update Recruitment Drive
router.put('/drives/:id',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.updateDrive
);

// DELETE /drives/:id - Delete Recruitment Drive
router.delete('/drives/:id',
    protect,
    authorize("TPO_ADMIN"),
    attachTenantScope,
    TPOController.deleteDrive
);

// GET /applications - Get all applications
router.get('/applications',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.getAllApplications
);

// PUT /applications/:id/status - Update application status
router.put('/applications/:id/status',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.updateApplicationStatus
);

// GET /analytics/placement-stats - TPO Analytics
router.get('/analytics/placement-stats',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    analyticsController.getPlacementStats
);

router.get('/analytics/dashboard',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    analyticsRefreshLimiter,
    analyticsController.getTPODashboardData
);

router.get('/analytics/filter-options',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    analyticsController.getAnalyticsFilterOptions
);

router.get('/analytics/shortlist-count',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    analyticsController.getShortlistCount
);

router.get('/jd/stats',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    jdParserController.getJdParseStats
);

router.post('/jd/parse',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    uploadLimiter,
    jdParserController.jdUploadMiddleware,
    jdParserController.jdUploadErrorHandler,
    jdParserController.parseJobDescription
);

// --------------------------------------------------
// REPORTS & EXPORTS (TPO_ADMIN, TPO_HEAD)
// --------------------------------------------------

router.get('/reports/placement',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getPlacementReport
);

router.get('/reports/student-readiness',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getStudentReadinessReport
);

router.get('/reports/company-analysis',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getCompanyAnalysisReport
);

router.get('/reports/branch-performance',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getBranchPerformanceReport
);

router.get('/reports/at-risk-students',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getAtRiskStudentsReport
);

router.get('/reports/shortlisted',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getShortlistedStudentsReport
);

router.post('/reports/custom',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    exportLimiter,
    reportsController.getCustomReport
);

router.get('/webinars',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    webinarController.listWebinarsForManagement
);

router.post('/webinars',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    webinarController.createWebinar
);

router.put('/webinars/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    webinarController.updateWebinar
);

router.delete('/webinars/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    webinarController.deleteWebinar
);

router.post('/announcements',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.createAnnouncement
);

router.get('/announcements',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.getAnnouncements
);

router.put('/announcements/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.updateAnnouncement
);

router.delete('/announcements/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.deleteAnnouncement
);

router.delete('/dept-events/:id',
    protect,
    authorize("TPO_ADMIN", "TPO_HEAD"),
    attachTenantScope,
    TPOController.deleteDeptEvent
);

module.exports = router;


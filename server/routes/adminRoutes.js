const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
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

module.exports = router;

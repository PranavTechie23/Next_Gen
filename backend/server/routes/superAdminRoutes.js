const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(requireSuperAdmin);

router.post('/keys', superAdminController.generateKey);
router.get('/keys', superAdminController.listKeys);
router.delete('/keys/:id', superAdminController.revokeKey);

router.get('/metrics', superAdminController.getMetrics);
router.get('/institutions', superAdminController.listInstitutions);
router.post('/company-kits', superAdminController.createCompanyKit);
router.post('/coding-problems', superAdminController.createCodingProblem);

router.post('/announcements', superAdminController.createAnnouncement);
router.get('/announcements', superAdminController.listAnnouncements);

router.put('/institutions/:id/toggle-status', superAdminController.toggleInstitutionStatus);
router.get('/users', superAdminController.listUsers);
router.post('/impersonate/:userId', superAdminController.impersonateUser);
router.get('/settings', superAdminController.getSettings);
router.put('/settings/:key', superAdminController.updateSetting);
router.get('/audit-logs', superAdminController.getAuditLogs);

module.exports = router;

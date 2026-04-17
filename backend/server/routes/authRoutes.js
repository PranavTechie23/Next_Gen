const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register-admin
router.post('/register-admin', authController.registerAdmin);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/reset-password
router.post('/reset-password', authController.requestPasswordReset);

// POST /api/auth/verify-reset
router.post('/verify-reset', authController.verifyAndResetPassword);

// POST /api/auth/change-password
const { protect } = require('../middleware/authMiddleware');
router.post('/change-password', protect, authController.changePassword);

// POST /api/auth/logout
router.post('/logout', protect, authController.logout);

module.exports = router;

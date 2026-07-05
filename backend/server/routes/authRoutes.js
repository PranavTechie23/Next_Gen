const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter, authSensitiveLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register-TPO
router.post('/register-TPO', authLimiter, authController.registerTPO);

// POST /api/auth/login
router.post('/login', authLimiter, authController.login);

// POST /api/auth/reset-password
router.post('/reset-password', authSensitiveLimiter, authController.requestPasswordReset);

// POST /api/auth/verify-otp
router.post('/verify-otp', authSensitiveLimiter, authController.verifyOtpOnly);

// POST /api/auth/verify-reset
router.post('/verify-reset', authSensitiveLimiter, authController.verifyAndResetPassword);

// POST /api/auth/change-password
router.post('/change-password', protect, authSensitiveLimiter, authController.changePassword);

// POST /api/auth/logout
router.post('/logout', protect, authController.logout);

module.exports = router;

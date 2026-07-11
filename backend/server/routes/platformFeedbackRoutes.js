const express = require('express');
const router = express.Router();
const platformFeedbackController = require('../controllers/platformFeedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { feedbackLimiter } = require('../middleware/rateLimiter');

// Protect route so only authenticated students can submit
router.post('/', feedbackLimiter, protect, authorize('STUDENT'), platformFeedbackController.submitFeedback);

module.exports = router;

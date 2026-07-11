const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/resumes/:filename', protect, fileController.serveResume);
router.get('/avatars/:filename', protect, fileController.serveAvatar);

module.exports = router;

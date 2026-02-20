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

module.exports = router;

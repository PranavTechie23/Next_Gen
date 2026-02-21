const express = require('express');
const router = express.Router();
const multer = require('multer');
const deptController = require('../controllers/deptController');
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

// GET /api/dept/students - Get all students for the Department Head's department
router.get('/students',
    protect,
    authorize('TPO_HEAD'),
    deptController.getDepartmentStudents
);

// GET /api/dept/students/:id - View full details of a specific student
router.get('/students/:id',
    protect,
    authorize('TPO_HEAD'),
    deptController.getStudentDetails
);

module.exports = router;

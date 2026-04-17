const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists for storing resumes
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------
// MULTER CONFIGURATION FOR RESUME UPLOAD
// --------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename using timestamp and user ID (if available at this stage)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const userId = req.user ? req.user.id : 'unknown';
        cb(null, `resume-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


// --------------------------------------------------
// STEP 1: CREATE / UPDATE PROFILE API
// Route: PUT /api/student/profile
// --------------------------------------------------
const upsertProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { linkedin_url, github_url, address } = req.body;

        // Basic validation: at least one field should be provided to update (optional, but good practice)
        if (!linkedin_url && !github_url && !address) {
            return res.status(400).json({ 
                message: "Please provide at least one field to update (linkedin_url, github_url, or address)." 
            });
        }

        // Upsert Logic (Insert if not exists, Update if exists)
        // Using ON DUPLICATE KEY UPDATE since student_id is the PRIMARY KEY
        const query = `
            INSERT INTO student_profiles (student_id, linkedin_url, github_url, address)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                linkedin_url = COALESCE(VALUES(linkedin_url), linkedin_url),
                github_url = COALESCE(VALUES(github_url), github_url),
                address = COALESCE(VALUES(address), address)
        `;

        await db.execute(query, [studentId, linkedin_url || null, github_url || null, address || null]);

        res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error upserting profile:", error);
        res.status(500).json({ message: "Internal server error while updating profile." });
    }
};

// --------------------------------------------------
// STEP 2: GET STUDENT PROFILE
// Route: GET /api/student/profile
// --------------------------------------------------
const getProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Fetch profile matching the logged-in student's user ID
        const [rows] = await db.execute(`
            SELECT student_id, resume_url, linkedin_url, github_url, address 
            FROM student_profiles 
            WHERE student_id = ?
        `, [studentId]);

        // Gracefully handle case where profile doesn't exist yet
        if (rows.length === 0) {
            return res.status(404).json({ 
                message: "Profile not found. Please create one.",
                profile: null
            });
        }

        res.status(200).json({
             message: "Profile retrieved successfully",
             profile: rows[0] 
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error while fetching profile." });
    }
};

// --------------------------------------------------
// STEP 3: RESUME UPLOAD API
// Route: POST /api/student/profile/resume
// --------------------------------------------------
const uploadResume = async (req, res) => {
    try {
        // Multer attaches the `file` object to req
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required and must be a PDF." });
        }

        const studentId = req.user.id;
        
        // Generate a public-facing URL path for the database
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;

        // Upsert logic just for the resume_url to handle cases where profile doesn't exist yet!
        const query = `
            INSERT INTO student_profiles (student_id, resume_url)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE resume_url = VALUES(resume_url)
        `;

        await db.execute(query, [studentId, resumeUrl]);

        res.status(200).json({ 
            message: "Resume uploaded successfully.",
            resume_url: resumeUrl
        });

    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({ message: "Internal server error while uploading resume." });
    }
};

// Error handling middleware specific for multer errors in this controller
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = {
    upsertProfile,
    getProfile,
    uploadResume,
    resumeUploadMiddleware: upload.single('resume'),
    uploadErrorHandler
};

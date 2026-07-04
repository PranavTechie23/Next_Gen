const db = require('../config/db');

exports.submitFeedback = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { type, subject, description } = req.body;

        if (!type || !subject || !description) {
            return res.status(400).json({ success: false, message: "Type, subject, and description are required." });
        }

        const allowedTypes = ['Bug Report', 'Feature Request', 'General Feedback', 'Placement Experience'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ success: false, message: "Invalid feedback type." });
        }

        if (subject.length > 150) {
            return res.status(400).json({ success: false, message: "Subject must be 150 characters or less." });
        }

        if (description.length > 5000) {
            return res.status(400).json({ success: false, message: "Description is too long." });
        }

        const query = `
            INSERT INTO platform_feedback (student_id, type, subject, description)
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(query, [student_id, type, subject, description]);

        return res.status(201).json({ success: true, message: "Feedback submitted successfully." });
    } catch (error) {
        console.error('Error submitting platform feedback:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

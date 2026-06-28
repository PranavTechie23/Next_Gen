const db = require('../config/db');

const getTestimonials = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFaqs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM faqs WHERE is_active = TRUE ORDER BY display_order ASC');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getTestimonials,
    getFaqs
};

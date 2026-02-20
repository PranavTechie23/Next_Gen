const db = require('../../config/db');

// Controller for TPO module

const testTpo = (req, res) => {
    res.json({
        module: "TPO",
        status: "working",
        timestamp: new Date()
    });
};

const getPendingStudentApprovals = async (req, res) => {
    try {
        const [students] = await db.execute(`
            SELECT users.id,users.email, students.roll_number, students.department_id, students.current_cgpa FROM students 
            JOIN users 
            ON students.user_id = users.id 
            WHERE students.is_academic_data_locked = 1;
            
        `);

        res.status(200).json({
            count: students.length,
            students: students
        });
    } catch (error) {
        console.error("Error fetching pending students:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    testTpo,
    getPendingStudentApprovals
};

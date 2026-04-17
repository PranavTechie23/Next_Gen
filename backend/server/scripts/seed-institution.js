const db = require('../config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedInstitution() {
    try {
        const connection = await db.getConnection();
        console.log("Connected to database.");

        const [rows] = await connection.execute('SELECT * FROM institutions WHERE id = 1');
        
        if (rows.length === 0) {
            console.log("No institution found with ID 1. Creating one...");
            await connection.execute(
                'INSERT INTO institutions (id, name, code, contact_email, address) VALUES (1, "Demo Institute of Technology", "DIT", "contact@dit.edu", "123 College Road")'
            );
            console.log("Institution created successfully.");
        } else {
            console.log("Institution with ID 1 already exists.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding institution:", error);
        process.exit(1);
    }
}

seedInstitution();

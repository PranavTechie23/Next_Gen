const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../schema.sql');

async function resetDatabase() {
    console.log("🚀 Starting Database Reset...");

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: {
                ca: fs.readFileSync(path.join(__dirname, '../ca.pem')),
                rejectUnauthorized: false
            },
            multipleStatements: true // Essential for running the full script
        });

        console.log("✅ Connected to Database.");

        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log("⏳ Executing Schema Script...");
        await connection.query(sql);

        console.log("✅ Database Reset Successfully!");
        
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Database Reset Failed:", error);
        process.exit(1);
    }
}

resetDatabase();

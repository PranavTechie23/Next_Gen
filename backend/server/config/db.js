const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const caPath = path.join(__dirname, '../ca.pem');
if (fs.existsSync(caPath)) {
    dbConfig.ssl = {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: false
    };
}

const pool = mysql.createPool(dbConfig);

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.warn("⚠️ Missing DB env vars. Expected DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT.");
}

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed: ", err.message);
    } else {
        console.log("✅ Successfully Connected to Aiven Cloud Database!");
        connection.release(); // Always put the connection back in the pool!
    }
});

module.exports = pool.promise();
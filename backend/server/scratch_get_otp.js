const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

async function getOTP() {
    try {
        const [rows] = await promisePool.query('SELECT * FROM password_resets ORDER BY created_at DESC LIMIT 1');
        console.log("Latest OTP Data:", rows);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
}

getOTP();

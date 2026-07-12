const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';
const connectionLimit = Number.parseInt(process.env.DB_POOL_LIMIT || '10', 10);

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: Number.isFinite(connectionLimit) ? connectionLimit : 10,
    queueLimit: 0
};

const caPath = path.join(__dirname, '../ca.pem');
if (fs.existsSync(caPath)) {
    const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false'
        ? false
        : isProduction;
    dbConfig.ssl = {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized
    };
}

const pool = mysql.createPool(dbConfig);

if (isProduction) {
    const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]?.trim());
    if (missingDbEnv.length > 0) {
        console.error(`Missing required DB environment variables in production: ${missingDbEnv.join(', ')}`);
        process.exit(1);
    }
} else if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
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
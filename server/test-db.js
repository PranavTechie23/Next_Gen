const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [users] = await connection.execute('SELECT id, email, role, is_active FROM users');
  console.log("Users in DB:", users);
  process.exit(0);
}
checkUser().catch(console.error);

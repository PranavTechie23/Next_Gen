const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function test() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  
  try {
    const [cols] = await db.execute('SHOW COLUMNS FROM student_profiles');
    console.log('Columns in student_profiles:', cols.map(c => c.Field));
    
    // Test the exact failing query
    const [tpo] = await db.execute('SELECT user_id, department_id FROM tpo_heads LIMIT 1');
    if (tpo.length > 0) {
      const [students] = await db.execute('SELECT user_id, department_id FROM students WHERE department_id = ? LIMIT 1', [tpo[0].department_id]);
      if (students.length > 0) {
         try {
           const [studentInfo] = await db.execute(`
              SELECT 
                  s.user_id, s.roll_number, s.current_cgpa, s.active_backlogs, 
                  s.tenth_marks, s.twelfth_marks, s.is_academic_data_locked, 
                  s.is_placed, s.current_package_value,
                  s.is_debarred, s.debar_reason, s.debar_lift_date,
                  u.email, u.is_active,
                  d.name AS department_name, d.code AS department_code,
                  sp.resume_url, sp.linkedin_url, sp.github_url, sp.address
              FROM students s
              JOIN users u ON s.user_id = u.id
              LEFT JOIN departments d ON s.department_id = d.id
              LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
              WHERE s.user_id = ? AND s.department_id = ?
          `, [students[0].user_id, tpo[0].department_id]);
          console.log('Query successful');
         } catch (e) {
             console.error('Inner Query Error:', e.message);
         }
      }
    }
  } catch (err) {
    console.error('SQL Error:', err.message);
  }
  process.exit();
}
test();

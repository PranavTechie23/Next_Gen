const db = require("../config/db");
const bcrypt = require("bcrypt");

async function seedStudents() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[dept]] = await conn.query(
      "SELECT id FROM departments ORDER BY id ASC LIMIT 1"
    );
    if (!dept) {
      throw new Error("No department found. Add at least one department first.");
    }

    const departmentId = dept.id;
    const passwordHash = await bcrypt.hash("Student@123", 10);

    for (let i = 1001; i <= 1030; i += 1) {
      const email = `student${i}@campus.edu`;
      const rollNumber = `ROLL${i}`;

      const [existingUsers] = await conn.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      let userId;
      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
        await conn.query(
          "UPDATE users SET role = 'STUDENT', is_active = 1 WHERE id = ?",
          [userId]
        );
      } else {
        const [userInsert] = await conn.query(
          "INSERT INTO users (email, password_hash, role, is_active, must_change_password) VALUES (?, ?, 'STUDENT', 1, 0)",
          [email, passwordHash]
        );
        userId = userInsert.insertId;
      }

      const cgpa = (6 + Math.random() * 4).toFixed(2);
      const backlogs = Math.floor(Math.random() * 3);

      await conn.query(
        `INSERT INTO students
          (user_id, roll_number, department_id, current_cgpa, active_backlogs, is_placed, current_package_value)
         VALUES (?, ?, ?, ?, ?, 0, 0)
         ON DUPLICATE KEY UPDATE
          department_id = VALUES(department_id),
          current_cgpa = VALUES(current_cgpa),
          active_backlogs = VALUES(active_backlogs)`,
        [userId, rollNumber, departmentId, cgpa, backlogs]
      );

      await conn.query(
        "INSERT IGNORE INTO student_profiles (student_id, github_url, linkedin_url) VALUES (?, ?, ?)",
        [userId, `https://github.com/student${i}`, `https://linkedin.com/in/student${i}`]
      );
    }

    await conn.commit();

    const [[studentCount]] = await conn.query("SELECT COUNT(*) AS c FROM students");
    const [[userCount]] = await conn.query(
      "SELECT COUNT(*) AS c FROM users WHERE role = 'STUDENT'"
    );

    console.log("Seed complete");
    console.log("Total students:", studentCount.c);
    console.log("Total student users:", userCount.c);
  } catch (error) {
    await conn.rollback();
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    conn.release();
  }
}

seedStudents();

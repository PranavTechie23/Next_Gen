const db = require("../config/db");

async function verify() {
  try {
    const [[dept]] = await db.query(
      "SELECT id FROM departments WHERE code = 'CSE' OR name LIKE '%Engineering%' ORDER BY id DESC LIMIT 1"
    );
    if (!dept) {
      console.log("No CSE department found.");
      process.exit(1);
      return;
    }

    const deptId = dept.id;
    const [[students]] = await db.query(
      "SELECT COUNT(*) AS c FROM students WHERE department_id = ?",
      [deptId]
    );
    const [[applications]] = await db.query(
      `SELECT COUNT(*) AS c
       FROM applications a
       JOIN students s ON s.user_id = a.student_id
       WHERE s.department_id = ?`,
      [deptId]
    );
    const [[selected]] = await db.query(
      `SELECT COUNT(*) AS c FROM (
         SELECT DISTINCT a.student_id
         FROM applications a
         JOIN students s ON s.user_id = a.student_id
         WHERE s.department_id = ?
           AND a.status = 'SELECTED'
       ) t`,
      [deptId]
    );
    const [[spm]] = await db.query(
      `SELECT COUNT(*) AS c
       FROM student_performance_metrics spm
       JOIN students s ON s.user_id = spm.student_id
       WHERE s.department_id = ?`,
      [deptId]
    );
    const [[webinars]] = await db.query(
      "SELECT COUNT(*) AS c FROM webinars WHERE date_time >= NOW()"
    );

    console.log({
      deptId,
      cseStudents: students.c,
      cseApplications: applications.c,
      cseSelectedStudents: selected.c,
      csePerformanceRows: spm.c,
      upcomingWebinars: webinars.c,
    });
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error.message);
    process.exit(1);
  }
}

verify();

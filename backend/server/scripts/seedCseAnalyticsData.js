const db = require("../config/db");
const bcrypt = require("bcrypt");

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const monthsAgoDate = (monthsAgo, day = 10) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(day);
  d.setHours(10, 30, 0, 0);
  return d;
};

async function ensureCoreEntities(conn) {
  const [deptRows] = await conn.query(
    "SELECT id FROM departments WHERE code = 'CSE' OR name LIKE '%Engineering%' ORDER BY id DESC LIMIT 1"
  );
  if (!deptRows.length) {
    throw new Error("CSE department not found. Add department with code 'CSE' first.");
  }
  const cseDeptId = deptRows[0].id;

  const [recruiters] = await conn.query(
    "SELECT id, company_name FROM recruiters ORDER BY id ASC LIMIT 20"
  );
  if (!recruiters.length) {
    const companies = ["Google", "Microsoft", "Amazon", "Deloitte", "Infosys"];
    for (const name of companies) {
      await conn.query("INSERT INTO recruiters (company_name) VALUES (?)", [name]);
    }
  }

  const [finalRecruiters] = await conn.query(
    "SELECT id, company_name FROM recruiters ORDER BY id ASC LIMIT 20"
  );

  const [drives] = await conn.query(
    "SELECT id, recruiter_id FROM recruitment_drives ORDER BY id ASC"
  );
  if (drives.length < 4) {
    for (let i = 0; i < 4; i += 1) {
      const rec = finalRecruiters[i % finalRecruiters.length];
      await conn.query(
        `INSERT INTO recruitment_drives (recruiter_id, drive_name, description, start_date, end_date, status)
         VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'OPEN')`,
        [rec.id, `${rec.company_name} Campus Drive`, "Auto-seeded for analytics visuals"]
      );
    }
  }

  const [finalDrives] = await conn.query(
    "SELECT id, recruiter_id FROM recruitment_drives ORDER BY id ASC"
  );

  const [jobs] = await conn.query("SELECT id FROM job_postings");
  if (jobs.length < 12) {
    const titles = ["SDE", "Backend Engineer", "Frontend Engineer", "ML Engineer", "Data Analyst"];
    for (let i = 0; i < 12; i += 1) {
      const drive = finalDrives[i % finalDrives.length];
      const pkg = Number(rand(5, 24).toFixed(2));
      await conn.query(
        `INSERT INTO job_postings
         (drive_id, job_title, job_description, location, package_value, min_cgpa, max_backlogs_allowed, eligible_branches, is_active)
         VALUES (?, ?, 'Seeded job for dashboard analytics', 'Pune', ?, 6.0, 2, JSON_ARRAY('CSE','CS','IT'), 1)`,
        [drive.id, pick(titles), pkg]
      );
    }
  }

  return { cseDeptId };
}

async function seedCseData() {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { cseDeptId } = await ensureCoreEntities(conn);

    const passwordHash = await bcrypt.hash("Student@123", 10);
    const targetStudents = 45;
    const createdStudentIds = [];

    for (let i = 1; i <= targetStudents; i += 1) {
      const num = 3000 + i;
      const email = `cse${num}@campus.edu`;
      const roll = `CSE${num}`;

      const [users] = await conn.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
      let userId;
      if (users.length) {
        userId = users[0].id;
        await conn.query("UPDATE users SET role='STUDENT', is_active=1 WHERE id = ?", [userId]);
      } else {
        const [u] = await conn.query(
          "INSERT INTO users (email, password_hash, role, is_active, must_change_password) VALUES (?, ?, 'STUDENT', 1, 0)",
          [email, passwordHash]
        );
        userId = u.insertId;
      }

      const cgpa = Number(rand(5.4, 9.6).toFixed(2));
      const backlogs = cgpa < 6.2 ? Math.floor(rand(1, 3)) : 0;

      await conn.query(
        `INSERT INTO students (user_id, roll_number, department_id, current_cgpa, active_backlogs, is_placed, current_package_value)
         VALUES (?, ?, ?, ?, ?, 0, 0)
         ON DUPLICATE KEY UPDATE
           department_id = VALUES(department_id),
           current_cgpa = VALUES(current_cgpa),
           active_backlogs = VALUES(active_backlogs)`,
        [userId, roll, cseDeptId, cgpa, backlogs]
      );

      await conn.query(
        "INSERT IGNORE INTO student_profiles (student_id, resume_url, linkedin_url, github_url, address) VALUES (?, NULL, ?, ?, 'Pune')",
        [userId, `https://linkedin.com/in/${roll.toLowerCase()}`, `https://github.com/${roll.toLowerCase()}`]
      );

      createdStudentIds.push(userId);
    }

    const [jobRows] = await conn.query(
      "SELECT id, package_value FROM job_postings WHERE is_active = 1 ORDER BY id ASC"
    );

    for (const studentId of createdStudentIds) {
      // score metrics
      await conn.query(
        `INSERT INTO student_performance_metrics
         (student_id, coding_test_score, mock_interview_score, amcat_quant, amcat_verbal, amcat_logical)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           coding_test_score=VALUES(coding_test_score),
           mock_interview_score=VALUES(mock_interview_score),
           amcat_quant=VALUES(amcat_quant),
           amcat_verbal=VALUES(amcat_verbal),
           amcat_logical=VALUES(amcat_logical)`,
        [
          studentId,
          Math.floor(rand(45, 95)),
          Math.floor(rand(40, 92)),
          Math.floor(rand(35, 95)),
          Math.floor(rand(35, 95)),
          Math.floor(rand(40, 95)),
        ]
      );

      // give some resume rows so at-risk is mixed
      if (Math.random() > 0.22) {
        await conn.query(
          `INSERT INTO resume_parsed_data (student_id, skills_json, sections_json)
           VALUES (?, JSON_ARRAY('JavaScript','Node.js','SQL'), JSON_OBJECT('projects', JSON_ARRAY('Proj A')))
           ON DUPLICATE KEY UPDATE skills_json=VALUES(skills_json), sections_json=VALUES(sections_json)`,
          [studentId]
        );
      }

      // skills and projects
      const skillCount = Math.floor(rand(2, 8));
      for (let k = 0; k < skillCount; k += 1) {
        const skillName = pick(["Java", "Node.js", "React", "SQL", "Python", "DSA", "AWS"]);
        await conn.query("INSERT IGNORE INTO skills (name) VALUES (?)", [skillName]);
        const [skill] = await conn.query("SELECT id FROM skills WHERE name = ? LIMIT 1", [skillName]);
        if (skill.length) {
          await conn.query(
            "INSERT IGNORE INTO student_skills (student_id, skill_id, proficiency_level) VALUES (?, ?, 'INTERMEDIATE')",
            [studentId, skill[0].id]
          );
        }
      }

      if (Math.random() > 0.35) {
        await conn.query(
          "INSERT INTO projects (student_id, title, description, project_link) VALUES (?, 'Placement Prep Tracker', 'Seeded project', ?)",
          [studentId, `https://github.com/demo/${studentId}`]
        );
      }

      // applications across months with mixed statuses
      const appAttempts = Math.floor(rand(1, 4));
      for (let a = 0; a < appAttempts; a += 1) {
        const job = pick(jobRows);
        const status = pick(["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED"]);
        const appliedAt = monthsAgoDate(Math.floor(rand(0, 5)), Math.floor(rand(3, 24)));
        await conn.query(
          `INSERT INTO applications (student_id, job_id, status, current_round, applied_at)
           VALUES (?, ?, ?, 'Round 1', ?)
           ON DUPLICATE KEY UPDATE
             status = VALUES(status),
             applied_at = VALUES(applied_at)`,
          [studentId, job.id, status, appliedAt]
        );

        if (status === "SELECTED") {
          await conn.query(
            `UPDATE students
             SET is_placed = 1, current_package_value = GREATEST(current_package_value, ?)
             WHERE user_id = ?`,
            [job.package_value || 0, studentId]
          );
        }
      }
    }

    // upcoming webinars/events for Dept dashboard
    const [admins] = await conn.query("SELECT user_id FROM tpo_admins LIMIT 1");
    const createdBy = admins.length ? admins[0].user_id : null;
    const events = [
      ["CSE Mock Interview Bootcamp", 5],
      ["System Design Sprint", 9],
      ["Aptitude Masterclass", 12],
    ];
    for (const [title, days] of events) {
      await conn.query(
        `INSERT INTO webinars (title, speaker_name, date_time, link, created_by)
         VALUES (?, 'Industry Mentor', DATE_ADD(NOW(), INTERVAL ? DAY), 'https://meet.example.com/session', ?)`,
        [title, days, createdBy]
      );
    }

    await conn.commit();

    const [[count]] = await conn.query(
      "SELECT COUNT(*) AS c FROM students WHERE department_id = ?",
      [cseDeptId]
    );
    const [[appCount]] = await conn.query(
      `SELECT COUNT(*) AS c
       FROM applications a
       JOIN students s ON s.user_id = a.student_id
       WHERE s.department_id = ?`,
      [cseDeptId]
    );
    console.log("CSE seed complete");
    console.log("CSE students:", count.c);
    console.log("CSE applications:", appCount.c);
  } catch (error) {
    await conn.rollback();
    console.error("CSE seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    process.exit(process.exitCode || 0);
  }
}

seedCseData();

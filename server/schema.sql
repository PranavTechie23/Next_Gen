-- ====================================================
-- MASTER RESET SCRIPT - ROBUST PLACEMENT SYSTEM
-- ====================================================

-- 1. DISABLE FOREIGN KEY CHECKS (To allow dropping tables in any order)
SET FOREIGN_KEY_CHECKS = 0;

-- 2. DROP ALL EXISTING TABLES
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS external_engagements;
DROP TABLE IF EXISTS feedbacks;
DROP TABLE IF EXISTS job_postings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS recruitment_drives;
DROP TABLE IF EXISTS recruiters;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS token_blacklist;
DROP TABLE IF EXISTS tpo_admins;
DROP TABLE IF EXISTS tpo_heads;
DROP TABLE IF EXISTS webinars;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS institutions;

-- 3. RE-ENABLE FOREIGN KEY CHECKS
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================
-- 4. CREATE CORE ORGANIZATION TABLES
-- ====================================================

CREATE TABLE institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    contact_email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'Computer Science'
    code VARCHAR(20) UNIQUE, -- e.g. 'CSE'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- 5. CREATE AUTHENTICATION & USERS
-- ====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('TPO_ADMIN', 'TPO_HEAD', 'STUDENT') NOT NULL, -- No Recruiter Login
    
    is_active BOOLEAN DEFAULT TRUE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
);

-- For Secure Logout
CREATE TABLE token_blacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(512) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For Password Reset Functionality
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(10),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (token),
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- ====================================================
-- 6. CREATE ROLE-SPECIFIC PROFILES
-- ====================================================

CREATE TABLE tpo_admins (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employee_code VARCHAR(50),
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tpo_heads (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- THE "CONTROL MODEL" STUDENT TABLE
CREATE TABLE students (
    user_id INT PRIMARY KEY,
    roll_number VARCHAR(50) UNIQUE NOT NULL, -- The Key for Excel Uploads
    department_id INT,
    
    -- ACADEMIC DATA (Populated by Dept Head via Excel)
    current_cgpa DECIMAL(4,2) DEFAULT 0.00,
    active_backlogs INT DEFAULT 0,
    tenth_marks DECIMAL(5,2),
    twelfth_marks DECIMAL(5,2),
    
    -- SYSTEM FLAGS
    is_academic_data_locked BOOLEAN DEFAULT TRUE, -- TRUE = Student cannot edit CGPA
    is_placed BOOLEAN DEFAULT FALSE,
    current_package_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- BLACKLIST FLAGS
    is_debarred BOOLEAN DEFAULT FALSE,
    debar_reason VARCHAR(255),
    debar_lift_date DATE NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- ====================================================
-- 7. STUDENT PORTFOLIO (Subjective Data)
-- ====================================================

CREATE TABLE student_profiles (
    student_id INT PRIMARY KEY,
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    address TEXT,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE student_skills (
    student_id INT,
    skill_id INT,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'EXPERT') DEFAULT 'BEGINNER',
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_link VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE external_engagements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    type ENUM('HIGHER_STUDIES', 'OFF_CAMPUS_JOB', 'ENTREPRENEURSHIP') NOT NULL,
    company_university_name VARCHAR(150),
    package_or_domain VARCHAR(100),
    proof_doc_url VARCHAR(500),
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

-- ====================================================
-- 8. RECRUITMENT & DRIVES (Managed by TPO)
-- ====================================================

-- RECRUITERS ARE NOW JUST PROFILES (NO LOGIN)
CREATE TABLE recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    industry_type VARCHAR(100),
    website VARCHAR(255),
    hr_name VARCHAR(100),
    contact_email VARCHAR(100) -- Contact info for TPO to use
);

CREATE TABLE recruitment_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT,
    drive_name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    -- TPO creates drives, so they are OPEN by default
    status ENUM('OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

CREATE TABLE job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drive_id INT,
    job_title VARCHAR(100) NOT NULL,
    job_description TEXT,
    location VARCHAR(100),
    
    -- FILTER CRITERIA
    package_value DECIMAL(10,2) NOT NULL,
    min_cgpa DECIMAL(4,2) DEFAULT 0.00,
    max_backlogs_allowed INT DEFAULT 0,
    eligible_branches JSON, 
    
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (drive_id) REFERENCES recruitment_drives(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    job_id INT,
    
    status ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED') DEFAULT 'APPLIED',
    current_round VARCHAR(100) DEFAULT 'Screening',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_app (student_id, job_id),
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

-- ====================================================
-- 9. ANALYTICS & LOGS
-- ====================================================

CREATE TABLE webinars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    speaker_name VARCHAR(100),
    date_time DATETIME,
    link VARCHAR(255),
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES tpo_admins(user_id) ON DELETE SET NULL
);

CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drive_id INT,
    student_id INT, -- Only students give feedback now
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    interview_difficulty ENUM('EASY', 'MEDIUM', 'HARD'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drive_id) REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id INT,
    action_type VARCHAR(50),
    target_table VARCHAR(50),
    target_id INT,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id INT,
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
);

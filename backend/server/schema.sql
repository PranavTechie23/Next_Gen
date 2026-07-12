-- ====================================================
-- MASTER RESET SCRIPT - ROBUST PLACEMENT SYSTEM
-- ====================================================

-- 1. DISABLE FOREIGN KEY CHECKS (To allow dropping tables in any order)
SET FOREIGN_KEY_CHECKS = 0;

-- 2. DROP ALL EXISTING TABLES
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS placement_analytics;
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
DROP TABLE IF EXISTS tpo_TPOs;
DROP TABLE IF EXISTS tpo_heads;
DROP TABLE IF EXISTS webinars;
DROP TABLE IF EXISTS dept_events;
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

CREATE TABLE registration_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_value VARCHAR(100) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_by_institution_id INT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (used_by_institution_id) REFERENCES institutions(id) ON DELETE SET NULL
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
    role ENUM('SUPER_ADMIN', 'TPO_ADMIN', 'TPO_HEAD', 'STUDENT') NOT NULL,
    
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
    otp_failed_attempts INT NOT NULL DEFAULT 0,
    otp_locked_until TIMESTAMP NULL DEFAULT NULL,
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
    diploma_marks DECIMAL(5,2),
    
    -- SYSTEM FLAGS
    is_academic_data_locked BOOLEAN DEFAULT TRUE, -- TRUE = Student cannot edit CGPA
    is_placed BOOLEAN DEFAULT FALSE,
    current_package_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- BLACKLIST FLAGS
    is_debarred BOOLEAN DEFAULT FALSE,
    debar_reason VARCHAR(255),
    debar_lift_date DATE NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_students_dept (department_id),
    INDEX idx_students_placed (is_placed),
    INDEX idx_students_cgpa (current_cgpa)
);

-- ====================================================
-- 7. STUDENT PORTFOLIO (Subjective Data)
-- ====================================================

CREATE TABLE student_profiles (
    student_id INT PRIMARY KEY,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    bio TEXT,
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    address TEXT,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    INDEX idx_profile_name (full_name)
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE student_skills (
    student_id INT,
    skill_id INT,

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
    institution_id INT,
    company_name VARCHAR(100) NOT NULL,
    industry_type VARCHAR(100),
    website VARCHAR(255),
    hr_name VARCHAR(100),
    contact_email VARCHAR(100), -- Contact info for TPO to use
    INDEX idx_recruiters_institution (institution_id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
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
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_drives_status (status),
    INDEX idx_drives_created (created_at DESC)
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

    -- TPO-provided drive details for students
    application_link VARCHAR(500),
    deadline_note VARCHAR(255),
    required_skills JSON,
    dos JSON,
    donts JSON,
    job_type ENUM('PLACEMENT', 'INTERNSHIP') NOT NULL DEFAULT 'PLACEMENT',
    stipend_value DECIMAL(10,2) NULL,
    schedule_note VARCHAR(255) NULL,
    activity_schedule TEXT NULL,
    
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (drive_id) REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    INDEX idx_jobs_active (is_active)
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
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    INDEX idx_apps_status (status),
    INDEX idx_apps_applied (applied_at DESC)
);

-- ====================================================
-- 9. ANALYTICS & LOGS
-- ====================================================

CREATE TABLE webinars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT,
    title VARCHAR(150) NOT NULL,
    summary TEXT NOT NULL,
    speaker_name VARCHAR(100) NOT NULL,
    speaker_role VARCHAR(150),
    speaker_background TEXT,
    speaker_photo_url VARCHAR(500),
    session_mode ENUM('OFFLINE', 'ONLINE', 'HYBRID') NOT NULL DEFAULT 'OFFLINE',
    venue VARCHAR(255),
    meeting_link VARCHAR(500),
    recording_url VARCHAR(500),
    starts_at DATETIME NOT NULL,
    ends_at DATETIME,
    registration_required BOOLEAN NOT NULL DEFAULT FALSE,
    capacity INT,
    status ENUM('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    mom_text LONGTEXT,
    mom_url VARCHAR(500),
    key_takeaways TEXT,
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_webinars_starts_at (starts_at),
    INDEX idx_webinars_status (status),
    INDEX idx_webinars_institution (institution_id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE dept_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    type VARCHAR(100) NOT NULL,
    meeting_link VARCHAR(500),
    created_by INT NOT NULL,
    target_batch VARCHAR(50) DEFAULT 'All',
    expires_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE webinar_registrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    webinar_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('REGISTERED', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_webinar_student (webinar_id, student_id),
    INDEX idx_webinar_registrations_status (status),
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
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
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_timestamp (timestamp DESC)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id INT,
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_unread (recipient_user_id, is_read, created_at DESC)
);

-- Cached analytics snapshots for fast TPO dashboard loading
CREATE TABLE placement_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    scope VARCHAR(100) NOT NULL,
    payload_json LONGTEXT NOT NULL,
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_scope (scope)
);

CREATE TABLE IF NOT EXISTS roadmap_cache (
    student_id INT PRIMARY KEY,
    llm_data JSON,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    urlToImage VARCHAR(500),
    category VARCHAR(100),
    source_name VARCHAR(100) DEFAULT 'Campus Career Portal',
    is_evergreen BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    institution_id INT,
    created_by INT,
    expires_at DATETIME,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_announcements_institution (institution_id, created_at DESC)
);

CREATE TABLE platform_feedback (
    id          INT           NOT NULL AUTO_INCREMENT,
    student_id  INT           NOT NULL,
    type        ENUM(
                    'Bug Report',
                    'Feature Request',
                    'General Feedback',
                    'Placement Experience'
                )             NOT NULL,
    subject     VARCHAR(150)  NOT NULL,
    description TEXT          NOT NULL,
    status      ENUM(
                    'Open',
                    'In Progress',
                    'Resolved'
                )             NOT NULL DEFAULT 'Open',
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_pf_student
        FOREIGN KEY (student_id) REFERENCES students(user_id)
        ON DELETE CASCADE
);

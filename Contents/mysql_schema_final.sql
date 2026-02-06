-- ==============================================
-- NEXTGEN CAMPUS CAREER PLATFORM
-- MySQL Database Schema (Final - LOCKED)
-- ==============================================

-- ==============================================
-- 1. CORE ENTITIES
-- ==============================================

-- Roles table (define role-based permissions)
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Institutions (Colleges/Universities)
CREATE TABLE institutions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    type VARCHAR(64),
    address TEXT,
    contact_email VARCHAR(255),
    phone VARCHAR(32),
    website VARCHAR(255),
    established_year INT,
    status VARCHAR(32) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_institution_type CHECK (type IN ('College', 'University', 'Institute')),
    CONSTRAINT chk_institution_status CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    
    INDEX idx_institutions_code (code),
    INDEX idx_institutions_status (status),
    INDEX idx_institutions_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users (Single table for all roles: Student, Admin, College, Faculty, Recruiter)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    
    -- Academic Info (for students)
    institution_id BIGINT,
    branch VARCHAR(100),
    year VARCHAR(50),
    cgpa DECIMAL(4, 2),
    student_id VARCHAR(100) UNIQUE,
    
    -- Academic Lock (TPO verification)
    is_profile_verified BOOLEAN DEFAULT FALSE,
    profile_locked BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(32) DEFAULT 'Pending',
    verified_by BIGINT,
    verified_at TIMESTAMP NULL,
    
    -- Placement Status
    placement_status VARCHAR(32) DEFAULT 'Unplaced',
    offer_locked BOOLEAN DEFAULT FALSE,
    
    -- Account Status
    agree_to_terms BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_user_role CHECK (role IN ('student', 'admin', 'college_admin', 'faculty', 'recruiter')),
    CONSTRAINT chk_user_year CHECK (year IN ('First Year', 'Second Year', 'Third Year', 'Final Year')),
    CONSTRAINT chk_verification_status CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')),
    CONSTRAINT chk_placement_status CHECK (placement_status IN ('Unplaced', 'Applied', 'Shortlisted', 'Placed', 'Offers')),
    
    CONSTRAINT fk_users_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_institution_id (institution_id),
    INDEX idx_users_student_id (student_id),
    INDEX idx_users_is_active (is_active),
    INDEX idx_users_placement_status (placement_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 2. STUDENT PROFILE DATA
-- ==============================================

-- Resumes (Support multiple versions)
CREATE TABLE resumes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    content JSON NOT NULL,
    file_url VARCHAR(512),
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_resumes_user_id (user_id),
    INDEX idx_resumes_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Skills (Separate skills tracking for flexible many-to-many)
CREATE TABLE skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(128) NOT NULL,
    proficiency INT,
    category VARCHAR(64),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_skill_proficiency CHECK (proficiency BETWEEN 1 AND 5),
    CONSTRAINT chk_skill_category CHECK (category IN ('Technical', 'Soft', 'Tools', 'Languages', 'Certifications')),
    CONSTRAINT fk_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_skill UNIQUE(user_id, skill_name),
    
    INDEX idx_skills_user_id (user_id),
    INDEX idx_skills_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Profile Completion Tracking
CREATE TABLE profile_completion (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    overall_percentage INT DEFAULT 0,
    fields_completed JSON NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_profile_completion_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_profile_completion_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 3. JOB & APPLICATION MANAGEMENT
-- ==============================================

-- Jobs (Recruiter postings)
CREATE TABLE jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    posted_by BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    
    -- Job Details
    job_type VARCHAR(32) DEFAULT 'Full-time',
    salary_range VARCHAR(100),
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    
    -- Requirements & Eligibility
    requirements JSON NOT NULL DEFAULT '{}',
    required_branches VARCHAR(255),
    min_cgpa DECIMAL(4, 2),
    max_backlogs INT DEFAULT 0,
    
    -- Metadata
    capacity INT DEFAULT 1,
    applications_count INT DEFAULT 0,
    shortlisted_count INT DEFAULT 0,
    selected_count INT DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'Draft',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closing_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_job_type CHECK (job_type IN ('Full-time', 'Part-time', 'Internship', 'Contract')),
    CONSTRAINT chk_job_status CHECK (status IN ('Draft', 'Open', 'Closed', 'Filled', 'Cancelled')),
    CONSTRAINT fk_jobs_posted_by FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_jobs_is_active (is_active),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_posted_at (posted_at),
    INDEX idx_jobs_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Applications (Student → Job)
CREATE TABLE job_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    resume_id BIGINT NOT NULL,
    
    -- Status tracking
    status VARCHAR(32) DEFAULT 'Applied',
    current_round INT DEFAULT 1,
    total_rounds INT,
    
    -- Eligibility
    is_eligible_at_application BOOLEAN DEFAULT TRUE,
    eligibility_reason VARCHAR(512),
    
    -- Recruiter Actions
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by BIGINT,
    review_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_app_status CHECK (status IN ('Applied', 'Shortlisted', 'Interview', 'Rejected', 'Selected', 'Accepted', 'Withdrawn')),
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uk_job_app UNIQUE(job_id, user_id),
    
    INDEX idx_job_applications_user_id (user_id),
    INDEX idx_job_applications_job_id (job_id),
    INDEX idx_job_applications_status (status),
    INDEX idx_job_applications_applied_at (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 4. ASSESSMENT & EVALUATION
-- ==============================================

-- Assessments (Online Tests/Quizzes)
CREATE TABLE assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_by BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Assessment config
    total_marks INT NOT NULL,
    pass_marks INT NOT NULL,
    duration_minutes INT NOT NULL,
    difficulty VARCHAR(32) DEFAULT 'Medium',
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_assessment_difficulty CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    CONSTRAINT fk_assessments_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_assessments_created_by (created_by),
    INDEX idx_assessments_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessment Questions
CREATE TABLE assessment_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    kind VARCHAR(32) DEFAULT 'mcq',
    
    -- MCQ options
    options JSON,
    correct_answer VARCHAR(512),
    
    -- Metadata
    marks INT NOT NULL,
    ordering INT,
    
    CONSTRAINT chk_question_kind CHECK (kind IN ('mcq', 'coding', 'text', 'essay')),
    CONSTRAINT fk_questions_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    
    INDEX idx_assessment_questions_assessment_id (assessment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessment Submissions (Student answers)
CREATE TABLE assessment_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    attempt_number INT DEFAULT 1,
    
    -- Response
    answers JSON NOT NULL,
    
    -- Scoring
    score INT,
    status VARCHAR(32) DEFAULT 'Submitted',
    
    -- Grading
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    graded_by BIGINT,
    feedback TEXT,
    
    CONSTRAINT chk_submission_status CHECK (status IN ('Submitted', 'Pending', 'Graded')),
    CONSTRAINT fk_submissions_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_graded_by FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uk_submission UNIQUE(assessment_id, user_id, attempt_number),
    
    INDEX idx_assessment_submissions_user_id (user_id),
    INDEX idx_assessment_submissions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 5. INTERVIEW & OFFER MANAGEMENT
-- ==============================================

-- Interviews
CREATE TABLE interviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    interviewer_id BIGINT NOT NULL,
    
    -- Interview Details
    round INT NOT NULL,
    interview_type VARCHAR(32) DEFAULT 'Technical',
    mode VARCHAR(32) DEFAULT 'Online',
    meeting_url VARCHAR(512),
    scheduled_at TIMESTAMP NOT NULL,
    
    -- Duration
    duration_minutes INT DEFAULT 60,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    
    -- Status
    status VARCHAR(32) DEFAULT 'Scheduled',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_interview_type CHECK (interview_type IN ('Technical', 'HR', 'Manager', 'Final')),
    CONSTRAINT chk_interview_mode CHECK (mode IN ('Online', 'Offline', 'Phone')),
    CONSTRAINT chk_interview_status CHECK (status IN ('Scheduled', 'In-Progress', 'Completed', 'Cancelled')),
    CONSTRAINT fk_interviews_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_interviewer FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_interviews_student_id (student_id),
    INDEX idx_interviews_scheduled_at (scheduled_at),
    INDEX idx_interviews_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interview Feedback
CREATE TABLE interview_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    interview_id BIGINT NOT NULL UNIQUE,
    feedback_by BIGINT NOT NULL,
    
    -- Feedback
    comments TEXT,
    technical_score INT,
    communication_score INT,
    overall_score INT,
    
    -- Result
    result VARCHAR(32) DEFAULT 'On Hold',
    recommendation TEXT,
    
    -- Metadata
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_feedback_technical_score CHECK (technical_score BETWEEN 1 AND 10),
    CONSTRAINT chk_feedback_communication_score CHECK (communication_score BETWEEN 1 AND 10),
    CONSTRAINT chk_feedback_overall_score CHECK (overall_score BETWEEN 1 AND 10),
    CONSTRAINT chk_feedback_result CHECK (result IN ('Pass', 'Fail', 'On Hold')),
    CONSTRAINT fk_feedback_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_by FOREIGN KEY (feedback_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_interview_feedback_interview_id (interview_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Offers
CREATE TABLE offers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    
    -- Offer Details
    ctc DECIMAL(12, 2),
    base_salary DECIMAL(12, 2),
    variable_component DECIMAL(12, 2),
    role VARCHAR(255),
    location VARCHAR(255),
    joining_date DATE,
    
    -- Terms
    contract_period_months INT,
    offer_validity_days INT DEFAULT 15,
    
    -- Status
    status VARCHAR(32) DEFAULT 'Generated',
    response_at TIMESTAMP NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_offer_status CHECK (status IN ('Generated', 'Sent', 'Accepted', 'Rejected', 'Expired')),
    CONSTRAINT fk_offers_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_offers_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_offers_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_offers_student_id (student_id),
    INDEX idx_offers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 6. CONTENT & ENGAGEMENT
-- ==============================================

-- Blog Posts
CREATE TABLE blog_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id BIGINT NOT NULL,
    title VARCHAR(300) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    tags VARCHAR(512),
    slug VARCHAR(255) UNIQUE,
    
    -- Engagement
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_blog_posts_is_published (is_published),
    INDEX idx_blog_posts_published_at (published_at),
    INDEX idx_blog_posts_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Webinars
CREATE TABLE webinars (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_by BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    speaker_name VARCHAR(255),
    
    -- Scheduling
    start_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    end_at TIMESTAMP NULL,
    
    -- Location
    location_or_url VARCHAR(512),
    meeting_platform VARCHAR(64),
    
    -- Capacity
    capacity INT,
    registered_count INT DEFAULT 0,
    
    -- Status
    status VARCHAR(32) DEFAULT 'Scheduled',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_webinar_status CHECK (status IN ('Scheduled', 'Ongoing', 'Completed', 'Cancelled')),
    CONSTRAINT fk_webinars_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_webinars_status (status),
    INDEX idx_webinars_start_at (start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Webinar Registrations
CREATE TABLE webinar_registrations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    webinar_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    
    status VARCHAR(32) DEFAULT 'Registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP NULL,
    
    CONSTRAINT chk_registration_status CHECK (status IN ('Registered', 'Attended', 'Cancelled')),
    CONSTRAINT fk_registrations_webinar FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_webinar_registration UNIQUE(webinar_id, user_id),
    
    INDEX idx_webinar_registrations_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 7. FEEDBACK & TESTIMONIALS
-- ==============================================

-- Student Feedback (Placement Stories)
CREATE TABLE student_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(32),
    
    -- Placement Details
    company_name VARCHAR(255) NOT NULL,
    job_role VARCHAR(255),
    package_lpa VARCHAR(50),
    location VARCHAR(255),
    offer_type VARCHAR(64),
    
    -- Interview Experience
    interview_rounds INT,
    interview_experience TEXT,
    technical_questions TEXT,
    hr_questions TEXT,
    preparation_tips TEXT,
    resources_used TEXT,
    
    -- Ratings
    difficulty_rating INT,
    interview_rating INT,
    overall_experience TEXT,
    
    -- Advice
    advice_for_juniors TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_feedback_difficulty_rating CHECK (difficulty_rating BETWEEN 1 AND 5),
    CONSTRAINT chk_feedback_interview_rating CHECK (interview_rating BETWEEN 1 AND 5),
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_student_feedback_company_name (company_name),
    INDEX idx_student_feedback_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 8. NOTIFICATIONS & SYSTEM
-- ==============================================

-- Notifications
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(64) DEFAULT 'System',
    title VARCHAR(255),
    message TEXT NOT NULL,
    data JSON,
    
    -- Status
    read_flag BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_notification_type CHECK (type IN ('Placement', 'Webinar', 'Assessment', 'Job', 'Interview', 'System', 'Admin')),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_read (read_flag),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- 9. AUDIT & COMPLIANCE
-- ==============================================

-- Audit Logs (Track all sensitive actions)
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    actor_id BIGINT,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64),
    entity_id BIGINT,
    
    -- Change details
    old_values JSON,
    new_values JSON,
    
    -- Request context
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_audit_logs_actor_id (actor_id),
    INDEX idx_audit_logs_entity_type (entity_type),
    INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Snapshots (Placement stats snapshots for reporting)
CREATE TABLE analytics_snapshots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    snapshot_date DATE NOT NULL,
    
    -- Placement Stats
    total_students INT,
    placed_students INT,
    students_with_offers INT,
    avg_package DECIMAL(10, 2),
    median_package DECIMAL(10, 2),
    highest_package DECIMAL(10, 2),
    
    -- By Branch
    branch_stats JSON,
    
    -- By Year
    year_stats JSON,
    
    -- By Company
    company_stats JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_analytics_snapshots_snapshot_date (snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- SUMMARY STATISTICS
-- ==============================================
-- Total Tables: 20
-- Total Indexes: 50+
-- Character Set: utf8mb4 (Unicode support)
-- Collation: utf8mb4_unicode_ci
-- Engine: InnoDB (Transaction support, Foreign keys)
-- All timestamps use CURRENT_TIMESTAMP for automation
-- All soft deletes use ON DELETE CASCADE or SET NULL
-- All sensitive data fields properly indexed
-- JSON columns for flexible nested data (requirements, options, feedback data)
-- CHECK constraints for enum-like fields (role, status, difficulty, etc.)
-- UNIQUE constraints on critical fields (email, student_id, code, slug)
-- ==============================================

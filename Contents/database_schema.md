# Placement Automation Platform – Robust Database Schema

## 1. Executive Summary
This schema is designed for **Data Integrity and Policy Enforcement**.
It includes:
-   **Centralized Authentication** (`users` table).
-   **Strict Policy Flags** (`is_placed`, `is_debarred`) to prevent hoarding.
-   **Audit Trails** (`audit_logs`) for security and compliance.
-   **External Data** (`external_engagements`) for accurate analytics.

---

## 2. SQL Schema Definitions (MySQL / PostgreSQL Compatible)

### 2.1 Central Identity & Organization
```sql
-- CENTRAL USER TABLE (Authentication & Role Base)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    institution_id BIGINT, -- Future-proofing for multi-tenant
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('TPO_ADMIN', 'TPO_HEAD', 'STUDENT', 'RECRUITER')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Soft Delete
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENTS
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Computer Science'
    code VARCHAR(10) UNIQUE, -- e.g., 'CSE'
    tpo_head_id BIGINT UNIQUE REFERENCES users(id) -- Link to TPO_HEAD user
);
```

### 2.2 Student Profile & Policy Data
```sql
-- STUDENT PROFILES (The "Truth" Source)
CREATE TABLE students (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department_id BIGINT REFERENCES departments(id),
    
    -- Academic Data (Verified)
    current_cgpa DECIMAL(4,2),
    active_backlogs INT DEFAULT 0,
    passing_year INT NOT NULL,
    
    -- SYSTEM STATUS FLAGS (Robustness)
    profile_approval_status VARCHAR(20) CHECK (profile_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING', 
    
    is_debarred BOOLEAN DEFAULT FALSE, -- BLACKLIST FLAG
    debar_lift_date DATE,
    debar_reason VARCHAR(255),

    -- PLACEMENT STATUS (Policy Engine)
    is_placed BOOLEAN DEFAULT FALSE,
    current_package_value DECIMAL(10,2) DEFAULT 0, -- Used for "Dream Offer" checks
    placed_company_name VARCHAR(100)
);

-- EXTENDED PROFILE (Student Editable)
CREATE TABLE student_profiles (
    student_id BIGINT PRIMARY KEY REFERENCES students(user_id),
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    tenth_marks DECIMAL(5,2),
    twelfth_marks DECIMAL(5,2),
    skills_text TEXT -- Comma separated or JSON
);
```

### 2.3 Recruiters & Jobs
```sql
-- RECRUITERS
CREATE TABLE recruiters (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    company_name VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    verification_status VARCHAR(20) CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')) DEFAULT 'PENDING'
);

-- RECRUITMENT DRIVES (The Event)
CREATE TABLE recruitment_drives (
    id BIGSERIAL PRIMARY KEY,
    recruiter_id BIGINT REFERENCES recruiters(user_id),
    drive_name VARCHAR(200), -- e.g. "Google Summer Hiring 2026"
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('REQUESTED', 'APPROVED', 'COMPLETED', 'CANCELLED')) DEFAULT 'REQUESTED'
);

-- JOB POSTINGS (The Specific Role)
CREATE TABLE job_postings (
    id BIGSERIAL PRIMARY KEY,
    drive_id BIGINT REFERENCES recruitment_drives(id),
    title VARCHAR(100),
    description TEXT,
    
    -- CRITERIA (The Automatic Filter)
    min_cgpa DECIMAL(4,2) DEFAULT 0.0,
    max_backlogs_allowed INT DEFAULT 0,
    eligible_branches JSON, -- e.g. ["CSE", "IT"]
    
    -- OFFER DETAILS (For Policy Logic)
    package_value DECIMAL(10,2) NOT NULL, -- e.g., 500000 (5 LPA)
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Applications & Workflow
```sql
-- APPLICATIONS (The Core Transaction)
CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(user_id),
    job_id BIGINT REFERENCES job_postings(id),
    
    status VARCHAR(50) CHECK (
        status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED', 'PLACED')
    ) DEFAULT 'APPLIED',
    
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, job_id) -- Prevent double application
);

-- EXTERNAL OFFERS (Closing the Data Gap)
CREATE TABLE external_engagements (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(user_id),
    type VARCHAR(20) CHECK (type IN ('HIGHER_STUDIES', 'OFF_CAMPUS_JOB', 'ENTREPRENEURSHIP')),
    company_university_name VARCHAR(150),
    package_or_domain VARCHAR(100),
    proof_url VARCHAR(500),
    status VARCHAR(20) CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')) DEFAULT 'PENDING'
);
```

### 2.5 Security & Audit
```sql
-- AUDIT LOGS (Compliance)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT REFERENCES users(id),
    action_type VARCHAR(50), -- e.g. 'UPDATED_CGPA', 'DEBARRED_STUDENT'
    target_entity VARCHAR(50), -- e.g. 'STUDENT'
    target_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

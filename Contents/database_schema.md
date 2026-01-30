# Placement Automation Platform – Database Schema

This schema models the **entire placement lifecycle** from:
Student → Eligibility → Recruiter → Interview → Offer → Placement → AI Learning


📊 Total Tables = 10

Let’s list them clearly:

#	Table Name	Who it is for
1	users	All users (Student, TPO, Recruiter)
2	students	TPO-verified academic records
3	student_profiles	Student-editable profile & skills
4	recruiters	Company accounts
5	jobs	Job postings
6	applications	Student ↔ Job mapping
7	interviews	Interview scheduling & feedback
8	offers	Offer tracking
9	ai_training_data	Data for ML model
10	audit_logs	Security, DPDP compliance

📄 database_schema.md


This database represents the complete placement lifecycle:
Student → Verification → Eligibility → Recruiter → Interview → Offer → Placement → AI Learning

---

## 🧑 USERS TABLE  
**For:** All platform users (Student, TPO, Recruiter)

### Purpose
Stores authentication and role information.

### Human Readable Schema

| Column | Type | Constraints | Notes |
|-------|------|-----------|------|
| id | BIGINT | PK | Unique user ID |
| name | VARCHAR | NOT NULL | Full name |
| email | VARCHAR | UNIQUE | Login email |
| password_hash | TEXT | NOT NULL | Encrypted password |
| role | ENUM | NOT NULL | STUDENT / TPO / RECRUITER |
| created_at | TIMESTAMP | NOT NULL | Account creation time |
| last_login | TIMESTAMP | NULL | Last login time |

### SQL

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('STUDENT','TPO','RECRUITER')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```


## 🎓 STUDENTS TABLE  
**For:** TPO-verified academic records of students

### Purpose  
Stores the official academic data of each student.  
These fields are controlled only by the TPO and are used for eligibility, compliance, and AI training.

### Human Readable Schema

| Column            | Type     | Constraints | Notes                                  |
|-------------------|----------|-------------|----------------------------------------|
| id                | BIGINT   | PK          | Unique student ID                      |
| user_id           | BIGINT   | FK          | References users.id                   |
| roll_number       | VARCHAR  | UNIQUE      | College roll / PRN                    |
| branch            | VARCHAR  | NOT NULL    | CSE, IT, ENTC, etc.                    |
| cgpa              | DECIMAL  | NOT NULL    | TPO verified CGPA                     |
| backlogs          | INT      | NOT NULL    | Number of active backlogs             |
| year              | INT      | NOT NULL    | Year of study (1–4)                    |
| is_verified       | BOOLEAN  | NOT NULL    | Approved by TPO or not                |
| verification_date | DATE     | NULL        | Date when TPO verified the student    |

### SQL

```sql
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  branch VARCHAR(50) NOT NULL,
  cgpa DECIMAL(3,2) NOT NULL,
  backlogs INT NOT NULL,
  year INT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date DATE
);
```



## 🧑‍💻 STUDENT PROFILE TABLE  
**For:** Student-editable professional and skill data

### Purpose  
Stores all information that represents a student’s **skills, projects, and online presence**.  
This data is used by recruiters and AI models but is **not part of academic verification**.

### Human Readable Schema

| Column            | Type     | Constraints | Notes                                  |
|-------------------|----------|-------------|----------------------------------------|
| student_id        | BIGINT   | FK          | References students.id                |
| phone             | VARCHAR  | NULL        | Student contact number                |
| github_url        | TEXT     | NULL        | GitHub profile                         |
| leetcode_url      | TEXT     | NULL        | LeetCode profile                      |
| linkedin_url      | TEXT     | NULL        | LinkedIn profile                      |
| skills            | TEXT     | NULL        | Comma-separated skill list             |
| resume_url        | TEXT     | NOT NULL    | Resume PDF link                       |
| profile_completed | BOOLEAN  | NOT NULL    | Profile completion status             |

### SQL

```sql
CREATE TABLE student_profiles (
  student_id BIGINT REFERENCES students(id),
  phone VARCHAR(20),
  github_url TEXT,
  leetcode_url TEXT,
  linkedin_url TEXT,
  skills TEXT,
  resume_url TEXT NOT NULL,
  profile_completed BOOLEAN DEFAULT FALSE
);
```


## 🏢 RECRUITERS TABLE  
**For:** Company accounts and recruiter profiles

### Purpose  
Stores all companies and recruiters who post jobs on the platform.  
TPO verification ensures that only **authentic companies** can hire students.

### Human Readable Schema

| Column          | Type     | Constraints | Notes                                |
|-----------------|----------|-------------|--------------------------------------|
| id              | BIGINT   | PK          | Unique recruiter ID                  |
| user_id         | BIGINT   | FK          | References users.id                 |
| company_name    | VARCHAR  | NOT NULL    | Registered company name             |
| website         | TEXT     | NULL        | Company website                     |
| industry        | VARCHAR  | NULL        | IT, Finance, Core, etc.              |
| verified_by_tpo | BOOLEAN  | NOT NULL    | Approved by TPO or not              |

### SQL

```sql
CREATE TABLE recruiters (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  company_name VARCHAR(150) NOT NULL,
  website TEXT,
  industry VARCHAR(100),
  verified_by_tpo BOOLEAN DEFAULT FALSE
);
```



## 📢 JOBS TABLE  
**For:** Job postings created by recruiters and approved by TPO

### Purpose  
Stores all job opportunities along with **eligibility rules** that drive the automated shortlisting engine.

### Human Readable Schema

| Column            | Type     | Constraints | Notes                                      |
|-------------------|----------|-------------|--------------------------------------------|
| id                | BIGINT   | PK          | Unique job ID                              |
| recruiter_id      | BIGINT   | FK          | References recruiters.id                  |
| title             | VARCHAR  | NOT NULL    | Job role / position                       |
| description       | TEXT     | NOT NULL    | Job description                           |
| salary            | INT      | NOT NULL    | Annual CTC                                |
| min_cgpa          | DECIMAL  | NOT NULL    | Minimum required CGPA                    |
| allowed_branches  | TEXT     | NOT NULL    | Eligible branches (CSV)                   |
| max_backlogs      | INT      | NOT NULL    | Maximum allowed backlogs                 |
| eligible_year     | INT      | NOT NULL    | Eligible academic year (e.g., 4)          |
| deadline          | DATE     | NOT NULL    | Last date to apply                        |
| status            | VARCHAR  | NOT NULL    | PENDING / OPEN / CLOSED / HOLD            |
| created_at        | TIMESTAMP| NOT NULL    | Job creation time                         |

### SQL

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  recruiter_id BIGINT REFERENCES recruiters(id),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  salary INT NOT NULL,
  min_cgpa DECIMAL(3,2) NOT NULL,
  allowed_branches TEXT NOT NULL,
  max_backlogs INT NOT NULL,
  eligible_year INT NOT NULL,
  deadline DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING','OPEN','CLOSED','HOLD')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📄 APPLICATIONS TABLE  
**For:** Tracking every student’s application to every job

### Purpose  
Represents the **relationship between students and jobs**.  
This table drives the full workflow:  
Applied → Shortlisted → Interview → Offer → Placed / Rejected.

### Human Readable Schema

| Column            | Type      | Constraints | Notes                                      |
|-------------------|-----------|-------------|--------------------------------------------|
| id                | BIGINT    | PK          | Unique application ID                     |
| student_id        | BIGINT    | FK          | References students.id                    |
| job_id            | BIGINT    | FK          | References jobs.id                        |
| eligibility_result| BOOLEAN   | NOT NULL    | Result of eligibility engine              |
| current_status    | VARCHAR   | NOT NULL    | APPLIED / SHORTLISTED / INTERVIEW / OFFERED / REJECTED / PLACED |
| applied_at        | TIMESTAMP | NOT NULL    | Time when student applied                 |

### SQL

```sql
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  job_id BIGINT REFERENCES jobs(id),
  eligibility_result BOOLEAN NOT NULL,
  current_status VARCHAR(20) CHECK (
    current_status IN ('APPLIED','SHORTLISTED','INTERVIEW','OFFERED','REJECTED','PLACED')
  ) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## 🎤 INTERVIEWS TABLE  
**For:** Scheduling and recording interview results

### Purpose  
Stores details of interviews conducted for shortlisted applications.  
Used by recruiters to record **feedback and scores** and by AI for learning hiring patterns.

### Human Readable Schema

| Column          | Type      | Constraints | Notes                                  |
|-----------------|-----------|-------------|----------------------------------------|
| id              | BIGINT    | PK          | Unique interview ID                    |
| application_id  | BIGINT    | FK          | References applications.id             |
| interview_date  | TIMESTAMP | NOT NULL    | Date and time of interview             |
| mode            | VARCHAR   | NOT NULL    | ONLINE or OFFLINE                      |
| feedback        | TEXT      | NULL        | Recruiter remarks                     |
| score           | INT       | NULL        | Interview performance score           |

### SQL

```sql
CREATE TABLE interviews (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES applications(id),
  interview_date TIMESTAMP NOT NULL,
  mode VARCHAR(20) CHECK (mode IN ('ONLINE','OFFLINE')) NOT NULL,
  feedback TEXT,
  score INT
);
```


## 💼 OFFERS TABLE  
**For:** Tracking job offers made to students

### Purpose  
Stores all job offers issued by recruiters.  
This determines whether a student is **finally placed or not**.

### Human Readable Schema

| Column          | Type    | Constraints | Notes                                   |
|-----------------|---------|-------------|-----------------------------------------|
| id              | BIGINT  | PK          | Unique offer ID                         |
| application_id  | BIGINT  | FK          | References applications.id             |
| salary_offered  | INT     | NOT NULL    | Final salary offered                   |
| joining_date    | DATE    | NOT NULL    | Date of joining                        |
| offer_status    | VARCHAR | NOT NULL    | PENDING / ACCEPTED / DECLINED           |

### SQL

```sql
CREATE TABLE offers (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES applications(id),
  salary_offered INT NOT NULL,
  joining_date DATE NOT NULL,
  offer_status VARCHAR(20) CHECK (offer_status IN ('PENDING','ACCEPTED','DECLINED')) NOT NULL
);
```


## 🤖 AI TRAINING DATA TABLE  
**For:** Storing verified features and outcomes used to train hiring prediction models

### Purpose  
Captures **structured, TPO-verified + recruiter-generated** signals so the AI can learn  
which profiles lead to successful placements and which don’t.

### Human Readable Schema

| Column          | Type     | Constraints | Notes                                  |
|-----------------|----------|-------------|----------------------------------------|
| student_id      | BIGINT   | FK          | References students.id                 |
| job_id          | BIGINT   | FK          | References jobs.id                     |
| cgpa            | DECIMAL  | NOT NULL    | Verified CGPA                          |
| branch          | VARCHAR  | NOT NULL    | Student branch                         |
| backlogs        | INT      | NOT NULL    | Number of backlogs                     |
| github_activity | INT      | NULL        | Commits / activity score               |
| leetcode_score  | INT      | NULL        | Coding score                           |
| interview_score | INT      | NULL        | Final interview score                  |
| final_result    | VARCHAR  | NOT NULL    | PLACED / NOT_PLACED                    |

### SQL

```sql
CREATE TABLE ai_training_data (
  student_id BIGINT REFERENCES students(id),
  job_id BIGINT REFERENCES jobs(id),
  cgpa DECIMAL(3,2) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  backlogs INT NOT NULL,
  github_activity INT,
  leetcode_score INT,
  interview_score INT,
  final_result VARCHAR(20) CHECK (final_result IN ('PLACED','NOT_PLACED')) NOT NULL
);
```


## 🔐 AUDIT LOGS TABLE  
**For:** Security, compliance, and tracking every important action

### Purpose  
Records **who did what and when** across the system.  
This is required for **DPDP Act compliance, dispute resolution, and admin accountability**.

### Human Readable Schema

| Column      | Type      | Constraints | Notes                                      |
|-------------|-----------|-------------|--------------------------------------------|
| id          | BIGINT    | PK          | Unique log entry                           |
| actor_id    | BIGINT    | FK          | References users.id (who did the action)  |
| action      | TEXT      | NOT NULL    | What action was performed                 |
| entity_type | VARCHAR   | NOT NULL    | STUDENT / JOB / APPLICATION / OFFER etc.  |
| entity_id   | BIGINT    | NOT NULL    | ID of the affected record                |
| timestamp   | TIMESTAMP | NOT NULL    | When the action happened                 |

### SQL

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```




# Next Gen PBL System - API Documentation

This document outlines the available API routes for the Next Gen PBL (Project-Based Learning) System backend. The server is built using Node.js, Express, and MySQL.

## Base URL
All API routes are prefixed by default, depending on their namespace:
- `http://localhost:5000/api` (Local Development)

---

## Authentication Routes
**Base Path:** `/api/auth`

### 1. Register TPO Admin
Registers a new Training and Placement Officer (TPO) Admin and creates a new institution if it doesn't exist.
- **URL:** `/register-admin`
- **Method:** `POST`
- **Auth Required:** No (Requires `adminKey` in body instead)
- **Request Body:**
  ```json
  {
    "name": "Admin Name",
    "email": "admin@college.edu",
    "password": "securepassword",
    "phone": "1234567890",
    "employee_code": "EMP123",
    "institution_name": "ABC College of Engineering",
    "institution_code": "ABC-01",
    "institution_address": "123 College Road",
    "adminKey": "secret_registration_key"
  }
  ```
- **Success Response:** `201 Created`

### 2. Login
Authenticates users (Admins, Department Heads, and Students) and returns a JWT token via an HTTP-only cookie.
- **URL:** `/login`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@college.edu",
    "password": "userpassword"
  }
  ```
- **Success Response:** `200 OK` (Sets `token` cookie)

### 3. Logout
Blacklists the current session token and clears the authentication cookie.
- **URL:** `/logout`
- **Method:** `POST`
- **Auth Required:** Yes (Valid Token)
- **Success Response:** `200 OK`

### 4. Direct Password Actions
- `POST /reset-password`: Initiate OTP-based password reset.
- `POST /verify-reset`: Verify OTP & Token, and set a new password.
- `POST /change-password`: Change the password for a logged-in user.

---

## Admin Routes
**Base Path:** `/api/admin`
*Note: All routes require a valid JWT token and the `TPO_ADMIN` role.*

### 1. Create Department Head
Creates a new Department Head for a specific department and sends them their generated credentials via email.
- **URL:** `/dept-heads`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Dr. Jane Smith",
    "email": "jane.smith@college.edu",
    "department_id": 1
  }
  ```
- **Success Response:** `201 Created`

### 2. Get All Department Heads
Fetches a list of all registered Department Heads.
- **URL:** `/dept-heads`
- **Method:** `GET`

### 3. Create Recruitment Drive
Creates a new recruitment drive for an existing company/recruiter.
- **URL:** `/drives`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "recruiter_id": 5,
    "drive_name": "Tech Corp 2026 Campus Hiring",
    "description": "Software Engineering roles",
    "start_date": "2026-08-01",
    "end_date": "2026-08-10"
  }
  ```

### 4. Other Admin Tools
- `GET /audit-logs`: View system audit logs.
- `POST /companies`: Create a new Recruiter/Company profile.
- `POST /drives/:id/jobs`: Add a specific job role to an active recruitment drive.
- `GET /drives`: List all recruitment drives.
- `PUT /drives/:id/status`: Update the status (`OPEN`, `ONGOING`, `COMPLETED`, `CANCELLED`) of a recruitment drive.

---

## Department Head Routes
**Base Path:** `/api/dept`
*Note: All routes require a valid JWT token and the `TPO_HEAD` role.*

### 1. Bulk Upload Students
Upload an Excel (`.xlsx`) or CSV file containing student data to automatically create student accounts. Passwords are generated and emailed.
- **URL:** `/students/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with a `file` field containing the document.

### 2. Get Students List
Get all students belonging to the Department Head's respective department.
- **URL:** `/students`
- **Method:** `GET`
- **Success Response:** `200 OK`

### 3. Update Student Record
Manually update a single student's academic or administrative data (e.g., CGPA, backlogs, placements).
- **URL:** `/students/:id`
- **Method:** `PUT`
- **Request Body Example (Partial Update):**
  ```json
  {
    "current_cgpa": 8.5,
    "is_placed": true,
    "current_package_value": 1200000
  }
  ```

### 4. Create Students Manually
Manually create one or multiple students using a JSON payload instead of an Excel sheet.
- **URL:** `/students`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "students": [
      {
        "roll_number": "CS2026001",
        "email": "student1@college.edu",
        "current_cgpa": 9.1
      }
    ]
  }
  ```

  ```

### 5. Review Recently Updated Resumes
List students belonging to the Department Head's respective department who have recently filled out or updated their resume and/or skills (subjective profile data).
- **URL:** `/approvals/resumes`
- **Method:** `GET`
- **Success Response:** `200 OK`
  ```json
  {
    "count": 1,
    "students": [
      {
        "user_id": 15,
        "roll_number": "CS2026001",
        "email": "student1@college.edu",
        "resume_url": "https://drive.google.com/resume.pdf",
        "linkedin_url": "https://linkedin.com/in/student1"
      }
    ]
  }
  ```

---

## Student Module Endpoints (Read-Only)
**Base Path:** `/api/student`
*Note: All routes require a valid JWT token and the `STUDENT` role.*

### 1. Get Student Profile
View full read-only profile data, including academic data (such as CGPA, which cannot be modified), profile links, projects, and skills.
- **URL:** `/profile`
- **Method:** `GET`
- **Success Response:** `200 OK`
  ```json
  {
    "user_id": 15,
    "roll_number": "CS2026001",
    "email": "student1@college.edu",
    "current_cgpa": 9.1,
    "active_backlogs": 0,
    "is_placed": false,
    "resume_url": null,
    "linkedin_url": null,
    "skills": [
      { "name": "Python", "proficiency_level": "INTERMEDIATE" }
    ],
    "projects": []
  }
  ```

### 3. List Eligible Jobs
Lists active job postings from "OPEN" recruitment drives where the student meets the minimum CGPA and maximum backlogs requirements setup by the recruiter.
- **URL:** `/jobs`
- **Method:** `GET`
- **Success Response:** `200 OK`
  ```json
  {
    "count": 1,
    "jobs": [
      {
        "job_id": 3,
        "job_title": "Software Development Engineer",
        "package_value": "1200000.00",
        "location": "Bangalore",
        "min_cgpa": "7.50",
        "max_backlogs_allowed": 1,
        "eligible_branches": ["CSE", "IT"],
        "drive_id": 2,
        "drive_name": "Tech Corp Campus Drive",
        "end_date": "2026-08-10T00:00:00.000Z",
        "company_name": "Tech Corp"
      }
    ]
  }
  ```

### 4. Get Specific Job Details
View full details of a specific job posting and its associated recruitment drive.
- **URL:** `/jobs/:id`
- **Method:** `GET`
- **Success Response:** `200 OK`
  ```json
  {
    "job_id": 3,
    "job_title": "Software Development Engineer",
    "job_description": "We are looking for a backend engineer...",
    "package_value": "1200000.00",
    "location": "Bangalore",
    "min_cgpa": "7.50",
    "max_backlogs_allowed": 1,
    "eligible_branches": ["CSE", "IT"],
    "drive_id": 2,
    "drive_name": "Tech Corp Campus Drive",
    "drive_description": "Hiring for engineering roles",
    "start_date": "2026-08-01T00:00:00.000Z",
    "end_date": "2026-08-10T00:00:00.000Z",
    "company_name": "Tech Corp",
    "industry_type": "IT Services",
    "website": "https://techcorp.com"
  }
  ```

### 5. Apply for a Job
Submit an application for a specific job posting. This endpoint enforces several policies:
- **Debarment Check:** Debarred students cannot apply.
- **Drive Status:** The recruitment drive must be `OPEN` or `ONGOING`.
- **Academic Criteria:** The student must meet the `min_cgpa` and `max_backlogs_allowed` for the job.
- **Dream Offer Rule:** If already placed, the student can only apply if the new job's package is strictly greater than their `current_package_value`.
- **URL:** `/jobs/:id/apply`
- **Method:** `POST`
- **Success Response:** `201 Created`
  ```json
  {
    "message": "Successfully applied for the job."
  }
  ```
- **Error Responses (Policy Violations):** `403 Forbidden` or `400 Bad Request`
  ```json
  {
    "message": "Dream Offer Policy Violation: You are already placed and this job's package does not exceed your current offer."
  }
  ```

### 6. View Application Statuses
View the current status (`APPLIED`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED`, `REJECTED`) of all job applications submitted by the student.
- **URL:** `/applications`
- **Method:** `GET`
- **Success Response:** `200 OK`
  ```json
  {
    "count": 2,
    "applications": [
      {
        "application_id": 5,
        "application_status": "SHORTLISTED",
        "current_round": "Technical Interview",
        "applied_at": "2026-08-05T10:30:00.000Z",
        "job_id": 3,
        "job_title": "Software Development Engineer",
        "package_value": "1200000.00",
        "drive_id": 2,
        "drive_name": "Tech Corp Campus Drive",
        "company_name": "Tech Corp"
      }
    ]
  }
  ```

---

## Public / Miscellaneous Routes
**Base Path:** `/api`

### 1. Fetch Tech News
Fetches the latest technology news articles using an external API. Standardized to not require global `fetch()`.
- **URL:** `/tech-news`
- **Method:** `GET`
- **Auth Required:** No
- **Success Response:** `200 OK`
  ```json
  {
    "articles": [
      {
        "title": "New AI Model Released",
        "description": "A new AI model has been released...",
        "url": "https://example.com/news",
        "urlToImage": "https://example.com/image.jpg",
        "publishedAt": "2026-02-27T10:00:00Z",
        "source": { "name": "Tech News" }
      }
    ]
  }
  ```

## Security & Middleware Notes
- **JWT & Cookies:** The application uses HTTP-Only cookies for JWT presentation to protect against XSS attacks. Ensure your frontend sends credentials (`withCredentials: true` in Axios).
- **Role-based Access Control (RBAC):** Endpoints are protected via `protect` and `authorize("ROLE_NAME")` middleware inside `authMiddleware.js`.
- **Token Blacklisting:** When a user logs out, their current token is added to the `token_blacklist` table in the database to prevent replay attacks before the JWT's natural expiration.

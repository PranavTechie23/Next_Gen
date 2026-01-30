# Placement Automation Platform – Requirements Gathering

## 1. Problem Statement

Most college placement cells still use:
- Excel sheets
- Emails & WhatsApp
- Manual shortlisting

This causes:
- Lack of visibility of student skills
- Errors in eligibility
- Poor recruiter experience
- Lower institutional placement performance

There is a major gap between:
- What students achieve (GitHub, LeetCode, projects)
- What colleges can showcase to companies

This platform aims to close that gap.

---

## 2. Objective

To build a **TPO-verified digital placement ecosystem** that:
- Automates eligibility & shortlisting
- Ensures data authenticity
- Improves placement outcomes
- Enables analytics & AI-based insights

---

## 3. Stakeholders

| Stakeholder | Role |
|------------|------|
| Student | Maintains profile, applies to jobs |
| TPO Admin | Verifies and controls data |
| Recruiter | Posts jobs and selects candidates |
| Institution | Tracks outcomes & rankings |
| AI System | Learns from hiring data |

---

## 4. Functional Requirements

### 4.1 Student Module
- Login via college credentials
- Complete profile
- Upload resume (PDF)
- Add GitHub, LeetCode, projects
- View only eligible jobs
- Apply with one click
- Track application status

---

### 4.2 TPO Admin Module
- Import students via Excel
- Verify CGPA, backlogs, branch
- Lock verified fields
- Approve company job postings
- Override eligibility rules
- Generate reports (Excel)
- View placement analytics

---

### 4.3 Recruiter Module
- Create company profile
- Post job with eligibility rules
- View eligible students
- Shortlist candidates
- Schedule interviews
- Mark offered / rejected
- Download resumes

---

### 4.4 System Logic
- Eligibility rule engine
- Status management system
- Notification system (Email/SMS)
- Analytics engine
- Audit logs
- AI training pipeline

---

## 5. Data Requirements

### Student Data (TPO Verified)
- Name
- Roll number
- Branch
- CGPA
- Backlogs
- Year
- Resume
- GitHub link
- LeetCode link

### Recruiter Data
- Company name
- Job role
- Salary
- Eligibility rules
- Interview results
- Offer status

### Application Data
- Student ID
- Job ID
- Eligibility result
- Status
- Interview score
- Final result

---

## 6. Eligibility Engine

Supports rules like:


# Backend Architecture & Requirements Plan

## 1. Executive Summary
The frontend for the Campus Career & Placement Platform is extensive, covering detailed workflows for Students, Recruiters, TPOs, and Super Admins. The backend must support these with a robust, modular architecture.
Currently, the backend code is **non-existent** (greenfield), with only a proposed structure in documentation. This plan outlines the **complete scope** of backend work required to support the existing frontend.

---

## 2. Core Backend Modules
*Based on `backend_breakpoints.md` and essential platform functions.*

### 2.1 Authentication & Authorization Module
*Responsibility: Secure access, role management, session handling.*
- **Components**: `authController`, `authMiddleware`, `Passport/JWT Strategy`
- **APIs**:
  - `POST /api/auth/register` (Student/TPO/Recruiter registry)
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh-token`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `GET /api/auth/me` (Current user context)

### 2.2 Student Module
*Responsibility: Profile management, dashboard stats, resume data.*
- **Components**: `studentController`, `studentService`, `profileHelper`
- **APIs**:
  - `GET /api/students/profile` (Get own profile)
  - `PUT /api/students/profile` (Update details - locks after TPO verification)
  - `GET /api/students/dashboard` (Aggregated stats: jobs applied, interviews, events)
  - `GET /api/students/resume` (Fetch resume builder data)
  - `PUT /api/students/resume` (Save resume builder data)
  - `POST /api/students/resume/generate` (Generate PDF) **[GAP]**

### 2.3 Jobs & Applications Module
*Responsibility: Job posting, searching, applying, eligibility checks.*
- **Components**: `jobController`, `applicationController`, `eligibilityEngine`
- **APIs**:
  - `GET /api/jobs` (List with filters: Role, CTC, Company)
  - `GET /api/jobs/:id` (Details)
  - `POST /api/jobs` (Recruiter: Create Job)
  - `PUT /api/jobs/:id` (Recruiter: Update/Close Job)
  - `POST /api/jobs/:id/apply` (Student: Apply - triggers Eligibility Engine)
  - `GET /api/applications/my` (Student: Track history)
  - `GET /api/applications/job/:jobId` (Recruiter: View applicants)
  - `PUT /api/applications/:id/status` (Recruiter: Shortlist/Reject)

### 2.4 Interview & Offer Module
*Responsibility: Scheduling, feedback, offer rollout.*
- **Components**: `interviewController`, `offerController`
- **APIs**:
  - `POST /api/interviews/schedule` (Recruiter)
  - `GET /api/interviews/my` (Student/Recruiter lists)
  - `POST /api/interviews/:id/feedback` (Recruiter submit feedback)
  - `POST /api/offers/generate` (Recruiter)
  - `PUT /api/offers/:id/respond` (Student: Accept/Reject)

### 2.5 TPO / College Module
*Responsibility: Student verification, college-level settings.*
- **Components**: `tpoController`, `collegeService`
- **APIs**:
  - `GET /api/tpo/students/unverified`
  - `PUT /api/tpo/students/:id/verify` (Lock profile)
  - `GET /api/tpo/dashboard` (Stats for the college)
  - `PUT /api/tpo/settings` (College info updates)

### 2.6 Admin & Analytics Module
*Responsibility: Platform oversight, onboarding colleges, reports.*
- **Components**: `adminController`, `analyticsController`, `reportService`
- **APIs**:
  - `POST /api/admin/institutions` (Onboard new college)
  - `GET /api/admin/metrics` (System health, user counts)
  - `GET /api/admin/analytics/placement` (Charts: Placement % by branch/year)
  - `GET /api/admin/reports/export` (CSV/Excel download)
  - `POST /api/admin/users/override` (Role/Access override)

---

## 3. Missing / Undefined Backend Modules
*These are required by frontend pages but were NOT detailed in `backend_breakpoints.md`.*

### 3.1 Content Management System (CMS) & Resources **[MAJOR GAP]**
*Pages: Blog, CaseStudies, CorporateNews, SuccessStories, Webinars, WellBeing*
*Responsibility: Allow Admin/TPO to publish content for students.*
- **Components**: `cmsController`, `contentService`
- **APIs**:
  - `GET /api/content/:type` (Fetch list of blogs/news/stories)
  - `GET /api/content/:type/:id` (Read single item)
  - `POST /api/content` (Admin: Create content)
  - `PUT /api/content/:id` (Admin: Update)
  - `DELETE /api/content/:id` (Admin: Remove)
  - `POST /api/webinars/:id/register` (Student registration for webinars)

### 3.2 Assessment & Prep Engine **[MAJOR GAP]**
*Pages: Assessments, InterviewPrep (Mock Tests)*
*Responsibility: Create tests, serve questions, evaluate answers.*
- **Components**: `assessmentController`, `scoringEngine`
- **APIs**:
  - `GET /api/assessments` (List available tests)
  - `GET /api/assessments/:id` (Start test - fetch questions)
  - `POST /api/assessments/:id/submit` (Submit answers, calculate score)
  - `POST /api/admin/assessments` (Create new test template)

### 3.3 General Support & Feedback
*Pages: ContactUs, FeedbackForm, HelpCenter*
- **Components**: `supportController`, `feedbackService`
- **APIs**:
  - `POST /api/support/contact` (Public contact form)
  - `POST /api/feedback` (User feedback submission)
  - `GET /api/admin/feedback` (Admin review)
  - `GET /api/faqs` (Help Center data)

### 3.4 Shared Infrastructure Services
*These cross-cutting concerns are needed to support all modules.*
- **File Upload Service**:
  - *Usage*: Profile pics, Resumes, Company Logos, Assessment attachments.
  - *API*: `POST /api/upload` (Returns URL/Path).
  - *Tech*: Multer (Local) or AWS S3 SDK.
- **Notification Service**:
  - *Usage*: "You were shortlisted", "New Job Posted", "Profile Verified".
  - *API*: `GET /api/notifications` (In-app list), `PUT /api/notifications/:id/read`.
  - *Background*: Email/SMS workers (Nodemailer/Twilio).
- **Payment / Billing Service**:
  - *Pages*: Pricing, RefundPolicy.
  - *Scope*: If the platform charges colleges/recruiters, integration with Stripe/Razorpay is needed.
  - *API*: `POST /api/payment/checkout`, `POST /api/payment/webhook`.

---

## 4. Proposed Backend Project Structure
To organize this large scope, use a feature-folder or distinct layer architecture:

```
server/
├── src/
│   ├── config/             # DB, Env, Passport
│   ├── controllers/        # Request handlers (Auth, Job, Student, CMS...)
│   ├── middleware/         # Auth, Validation, Upload, ErrorHandler
│   ├── models/             # Mongoose/Sequelize Schemas
│   ├── routes/             # API Route definitions
│   ├── services/           # Business logic (Email, PDF, Scoring)
│   ├── utils/              # Helpers (Eligibility, Date calculations)
│   ├── app.js              # Express app setup
│   └── index.js            # Entry point
└── ...
```

## 5. Summary of Scope
The backend is significantly larger than just "Users and Jobs".
- **Total Modules**: ~8 (Auth, Student, Job, Interview, TPO, Admin, CMS, Assessment)
- **Estimated Endpoints**: 60-80 APIs
- **Critical Integrations**: File Storage, Email/SMS, PDF Generation.

**Recommendation**: Start with **Auth** and **Student Profile**, then **Jobs**, then **CMS**. Leave **Assessments**/Interviews for later phases.

# Backend Architecture & Robust System Design

## 1. Executive Summary
The Campus Career & Placement Platform is transitioning from a basic project to an **Enterprise-Grade System**. This architecture prioritizes **Data Integrity, Security, and Business Logic Enforcement** (Policy Engines) over simple CRUD operations.

The system connects 4 key stakeholders:
1.  **TPO Admin** (Superuser, Policy Maker)
2.  **TPO Department Heads** (Analytics & Training)
3.  **Recruiters** (External Hiring Partners)
4.  **Students** (End Users)

---

## 2. Core Architectural Pillars (The "Robust" Upgrades)

### 2.1 The Policy Engine (Logic Layer)
Instead of simple data entry, every major action is gated by a "Policy Check".
-   **Anti-Hoarding Rule**: A student cannot apply for a new job *unless* the new package is significantly higher (e.g., > 1.5x) than their current offer.
-   **Debarment Enforcer**: Students marked as "Debarred" (Blacklisted) are systemically blocked from the API level during the freeze period.
-   **Eligibility Validator**: Jobs automatically filter students based on Verified Academic Data (CGPA, Backlogs, Branch), not self-reported data.

### 2.2 The State Machine (Data Integrity)
-   **Profile Locking**: Key academic fields (CGPA, Backlogs) are **Locked** after TPO verification.
-   **Auto-Reset**: If a student edits critical data after approval, their status automatically reverts to `PENDING_VERIFICATION`, preventing data fraud.
-   **Application Lifecycle**: Usage of strict Enums for application states (`APPLIED` -> `SHORTLISTED` -> `INTERVIEW` -> `OFFERED` -> `PLACED`).

### 2.3 The "Trust-But-Verify" Logic (Audit & Security)
-   **Audit Trail**: Every critical write operation (Profile Update, Student Debarment, Result Upload) is logged in an immutable `audit_logs` table.
-   **Soft Deletes**: Critical entities (Users, Jobs) are never hard-deleted. They are flagged `is_active = false` to preserve history for analytics.

### 2.4 External Data Loop (Analytics Accuracy)
-   **External Offers**: Students can report Off-Campus Placements/Higher Studies. Once verified by TPO, these count towards college analytics, fixing the "Unplaced" data gap.

---

## 3. Detailed Data Architecture

### 3.1 Central Identity & Authentication
*Single Source of Truth for Login.*
-   **Table**: `users`
-   **Fields**: `id`, `email`, `password_hash`, `role` (ENUM), `is_active`.
-   **Logic**: Centralized Auth Middleware checks `is_active` status on every request.

### 3.2 Student Profile & Policy Data
*The "Heavy Lifter" - Stores verified data and policy flags.*
-   **Table**: `students` (Linked to `users`)
-   **Key Fields**:
    -   `profile_approval_status` (Enum: PENDING, APPROVED, REJECTED)
    -   `is_placed` (Boolean) - **Crucial for Hoarding Logic**
    -   `current_package_value` (Decimal) - **Crucial for "Dream Offer" Logic**
    -   `is_debarred` (Boolean) - **Crucial for Compliance**
    -   `debar_lift_date` (Date)
-   **Table**: `student_profiles` (Resume, Links, Skills - Student Editable)

### 3.3 Recruitment Engine
*Manages the "Event" and "Specific Roles".*
-   **Table**: `recruitment_drives` (The Event, e.g., "TCS NQT 2026")
-   **Table**: `job_postings` (The Roles)
    -   **Policy Fields**: `package_value`, `min_cgpa`, `eligible_branches` (JSON), `max_backlogs`.

### 3.4 Transactional Logic (Applications)
*The core link between Student and Job.*
-   **Table**: `applications`
    -   **Constraint**: Unique constraint on `(student_id, job_id)` to prevent double applications.
    -   **Status Flow**: `APPLIED` -> `SHORTLISTED` -> `INTERVIEW_SCHEDULED` -> `SELECTED` -> `PLACED`.

### 3.5 Compliance & Security
-   **Table**: `audit_logs`
    -   Tracks: `actor_id`, `action_type`, `target_entity`, `old_value`, `new_value`.

---

## 4. Backend Module Breakdown

### 4.1 Auth Module (RBAC)
-   **Middleware**: `verifyRole(['TPO', 'RECRUITER'])`, `validateActiveUser`.
-   **Rate Limiting**: applied to Login/Register endpoints.

### 4.2 Student Module (Profile & Policy)
-   **GET /me**: Returns profile + Policy Status (Placed? Debarred?).
-   **PUT /profile**: Triggers "Auto-Reset" logic if critical fields change.
-   **POST /external-offer**: Upload proof for off-campus placement.

### 4.3 Recruitment Module (The Filter)
-   **POST /jobs**: Validates eligibility criteria structure.
-   **GET /jobs/:id/eligibility**: (Student Side) Returns `true/false` + `reason` (e.g., "CGPA too low", "Already Placed").

### 4.4 Analytics Module
-   **Real-time Stats**: Aggregates data including "External Placements".
-   **Placement Prediction**: Uses historical data to suggest "Win Probability" for students.

---

## 5. Technology Stack Recommendation
-   **Runtime**: Node.js + Express.js
-   **Database**: MySQL (Relational consistency is key for this schema)
-   **ORM**: Prisma (Preferred) or Sequelize - for Type Safety and Migrations.
-   **Validation**: Zod (Strict schema validation for inputs).
-   **File Storage**: Multer (Local) or AWS S3 (Production).

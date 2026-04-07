# Placement Automation System - API Endpoints

This document outlines the RESTful API endpoints for the system, categorized by module and role.

## 1. Authentication & User Management
*Base URL:* `/api/auth`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new Recruiter (Students/TPO are pre-created) | Public |
| POST | `/login` | Authenticate user (Email/Password) -> Returns JWT | Public |
| POST | `/logout` | Invalidate current session/token | Authenticated |
| POST | `/refresh-token` | specific endpoint to refresh access token | Authenticated |
| POST | `/forgot-password` | Initiate password reset flow | Public |
| POST | `/reset-password` | Complete password reset | Public |
| GET | `/me` | Get current user's profile context & role | Authenticated |

## 2. Student Module
*Base URL:* `/api/student`

### Profile & Resume
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/profile` | Get full student profile (Academic + Personal) | Student |
| PUT | `/profile` | Update profile. **Critical**: Resets approval status if sensitive fields change. | Student |
| GET | `/resume` | Get resume builder data | Student |
| PUT | `/resume` | Update resume builder data | Student |
| POST | `/resume/upload` | Upload PDF resume | Student |

### Jobs & Applications
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/jobs` | List available jobs (Filtered by policy/eligibility) | Student |
| GET | `/jobs/:id` | Get job details | Student |
| POST | `/jobs/:id/check-eligibility` | Dry-run eligibility check (returns reason if ineligible) | Student |
| POST | `/jobs/:id/apply` | Apply for a job. **Enforces**: Hoarding & Debar policy. | Student |
| GET | `/applications` | List my applications & status | Student |
| POST | `/external-offer` | Report an off-campus offer | Student |

## 3. Recruiter Module
*Base URL:* `/api/recruiter`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/drives` | List my recruitment drives | Recruiter |
| POST | `/drives` | Request a new recruitment drive | Recruiter |
| POST | `/jobs` | Post a job under a drive | Recruiter |
| PUT | `/jobs/:id` | Update job details | Recruiter |
| GET | `/jobs/:id/applicants` | List students who applied | Recruiter |
| PUT | `/applications/:id/status` | Update status (Shortlist, Reject, Select) | Recruiter |
| POST | `/interviews/schedule` | Schedule interview for an applicant | Recruiter |
| POST | `/offers/release` | Release job offer to a student | Recruiter |

## 4. TPO Admin Module
*Base URL:* `/api/tpo`

### User Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/users/student` | Create single student account | TPO Admin |
| POST | `/users/student/bulk` | Bulk upload students (CSV) | TPO Admin |
| POST | `/users/tpo-head` | Create Dept TPO Head | TPO Admin |
| GET | `/approvals/students` | List students waiting for profile approval | TPO Admin |
| POST | `/approvals/students/:id` | Approve/Reject student profile | TPO Admin |
| POST | `/students/:id/debar` | **Action**: Debar (Blacklist) a student | TPO Admin |
| POST | `/students/:id/revoke-debar`| **Action**: Remove student from blacklist | TPO Admin |

### Drives & Placement
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/approvals/drives` | List pending drive requests | TPO Admin |
| POST | `/approvals/drives/:id` | Approve/Reject drive | TPO Admin |
| GET | `/analytics/overall` | College-wide placement stats | TPO Admin |
| GET | `/analytics/department/:id` | Dept-specific stats | TPO Admin |
| GET | `/audit-logs` | View security audit logs | TPO Admin |

## 5. Shared / Common
*Base URL:* `/api/common`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/departments` | List all departments | Public |
| GET | `/skills` | List standardized skills | Public |
| POST | `/feedback` | Submit feedback (Interview/Drive) | Authenticated |
| GET | `/notifications` | Get user notifications | Authenticated |

## 6. System & Compliance (Internal)
*Base URL:* `/api/admin`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/health` | System health check | Public |
| POST | `/backup` | Trigger database backup | Super Admin |
| GET | `/settings` | Global system settings | Super Admin |

---

> [!NOTE]
> All `POST` and `PUT` requests generally expect JSON bodies.
> All endpoints except `/auth/*` and public common routes require `Authorization: Bearer <token>` header.

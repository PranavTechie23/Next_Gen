# Backend Debugging Guide

## Authentication Module

This module handles user registration, login, and request authentication
for all roles (Student, TPO, Recruiter).
---

### 1. Register Flow
**Target File:** `server/src/controllers/authController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `register`) | Confirms the request reaches backend with the expected payload structure. | `req.body` |
| **Duplication Check**<br/>(after `findOne`) | Ensures duplicate accounts are not created for the same email. | `existingUser` (expected: `null`) |
| **Password Hashing**<br/>(before `hash`) | Verifies that passwords are never stored or logged in plain text. | `password`, `saltRounds` |
| **User Creation**<br/>(after `create` / `save`) | Confirms user record is persisted correctly with generated fields. | `savedUser` (check `id`, `created_at`) |
| **Response Structuring**<br/>(before `res.json`) | Ensures sensitive fields (password hash) are excluded from API response. | `responsePayload` |

---

### 2. Login Flow
**Target File:** `server/src/controllers/authController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `login`) | Validates credentials received from the client. | `req.body` |
| **User Lookup**<br/>(after `findOne`) | Confirms the user exists before password verification. | `user` |
| **Password Verification**<br/>(after `compare`) | Critical authentication check for correct password matching. | `isMatch` |
| **Token Generation**<br/>(before `sign`) | Verifies JWT payload contains correct identity and role data. | `payload` (`userId`, `role`) |

---

### 3. Authentication Middleware
**Target File:** `server/src/middleware/authMiddleware.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Header Extraction**<br/>(start of `protect`) | Confirms the Authorization header exists and follows `Bearer <token>` format. | `req.headers.authorization` |
| **Token Decoding**<br/>(inside `verify`) | Ensures the token is valid, not expired, and correctly signed. | `decodedToken` |
| **User Attachment**<br/>(post-verification) | Confirms authenticated user context is attached for downstream controllers. | `req.user` |





## Student Profile & Student Dashboard Module

This module manages student profile data, profile completion logic,
and dashboard-level aggregated insights used across the platform.

---

### 1. Fetching Student Profile
**Target File:** `server/src/controllers/studentController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `getProfile`) | Confirms the request reaches the controller with authenticated student context. | `req.user` (userId) |
| **Database Query**<br/>(after `findOne`) | Verifies student profile data is successfully retrieved from the database. | `studentProfile` |
| **Data Transformation**<br/>(before `res.json`) | Ensures only required and safe profile fields are exposed to the client. | `cleanProfile` |

---

### 2. Updating Student Profile
**Target File:** `server/src/controllers/studentController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Validation**<br/>(start of `updateProfile`) | Ensures only allowed fields are updated and data format is valid. | `req.body` |
| **Update Execution**<br/>(after `update`) | Confirms the profile record is actually updated in the database. | `updateResult` |
| **Profile Completion Recalculation**<br/>(post-update logic) | Tracks recalculation of profile completion after profile changes. | `completionPercentage` |

---

### 3. Profile Completion Logic
**Target File:** `server/src/utils/profileHelpers.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Field Verification**<br/>(inside calculation function) | Identifies which profile fields are considered for completion scoring. | `profileData` |
| **Score Aggregation**<br/>(during evaluation loop) | Debugs how completion score increments per filled field. | `score`, `totalFields` |
| **Final Score Return**<br/>(end of function) | Confirms the final calculated completion percentage is correct. | `finalScore` |

---

### 4. Student Dashboard Data Aggregation
**Target File:** `server/src/controllers/dashboardController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `getDashboard`) | Confirms the authenticated student is authorized to access dashboard data. | `req.user` |
| **Stats Retrieval**<br/>(after DB queries) | Verifies aggregated statistics such as applications and interviews. | `stats` |
| **Recent Activity Fetch**<br/>(after activity query) | Ensures recent student actions are correctly retrieved and ordered. | `activities` |
| **Response Construction**<br/>(before `res.json`) | Validates final dashboard payload structure expected by frontend. | `dashboardData` |



## Recruiter Job & Hiring Module

This module handles the complete recruiter-side hiring workflow,
from job creation to interview scheduling and offer generation.

---

### 1. Creating a Job Posting
**Target File:** `server/src/controllers/jobController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `createJob`) | Confirms job details such as title, description, and requirements are received correctly. | `req.body` |
| **Validation**<br/>(before processing) | Ensures all mandatory job fields are present and valid before persistence. | `jobData` |
| **Job Creation**<br/>(after `save` / `create`) | Verifies the job is stored correctly with association to the recruiter. | `savedJob` |

---

### 2. Updating / Closing a Job
**Target File:** `server/src/controllers/jobController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Job Lookup**<br/>(start of `updateJob`) | Ensures the job exists and belongs to the authenticated recruiter. | `job`, `req.user` |
| **Status Change**<br/>(before `save`) | Validates job status transitions (e.g., `Open → Closed`). | `updates.status` |
| **Update Verification**<br/>(after `update`) | Confirms job updates are successfully persisted in the database. | `updatedJob` |

---

### 3. Fetching Applicants for a Job
**Target File:** `server/src/controllers/jobController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Scope**<br/>(start of `getApplicants`) | Verifies the request targets a valid job identifier. | `req.params.jobId` |
| **Applicant Query**<br/>(after `find`) | Confirms all applications linked to the job are correctly retrieved. | `applicants` |
| **Data Filtering**<br/>(before response) | Ensures sensitive candidate data is excluded where necessary. | `applicantList` |

---

### 4. Shortlisting / Rejecting Candidates
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Status Update Request**<br/>(start of `updateStatus`) | Confirms correct application is targeted with intended status change. | `applicationId`, `newStatus` |
| **Transition Validation**<br/>(inside update logic) | Ensures application status transitions are logically valid. | `currentStatus`, `newStatus` |
| **Notification Trigger**<br/>(post-update) | Verifies candidate notification logic is triggered when required. | `notificationResult` |

---

### 5. Scheduling Interviews
**Target File:** `server/src/controllers/interviewController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Slot Validation**<br/>(start of `scheduleInterview`) | Confirms interview date, time, and mode are valid. | `interviewDetails` |
| **Conflict Check**<br/>(before booking) | Ensures no scheduling conflicts exist for recruiter or candidate. | `conflictingInterviews` |
| **Interview Creation**<br/>(after `save`) | Verifies interview record creation with correct meeting details. | `savedInterview` |

---

### 6. Creating Job Offers
**Target File:** `server/src/controllers/offerController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Offer Details Input**<br/>(start of `createOffer`) | Confirms salary, role, and joining date details are correct. | `req.body` |
| **Candidate Association**<br/>(before `save`) | Ensures the offer is linked to the correct application and candidate. | `candidateId` |
| **Offer Finalization**<br/>(after `save`) | Confirms the offer is persisted and ready for candidate response. | `createdOffer` |



## Job Application & Eligibility Module

This module manages the student-to-job application lifecycle,
including eligibility evaluation, application creation, and status tracking.

---

### 1. Viewing Eligible Jobs for a Student
**Target File:** `server/src/controllers/jobController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `getEligibleJobs`) | Confirms authenticated student context and academic profile are available. | `req.user`, `studentProfile` |
| **Eligibility Filtering**<br/>(inside loop / query) | Verifies job filtering logic based on CGPA, branch, and eligibility rules. | `jobCriteria`, `studentStats` |
| **Response Generation**<br/>(before `res.json`) | Ensures only eligible job listings are returned to the frontend. | `eligibleJobs` |

---

### 2. Eligibility Check Engine (CGPA, Branch, Skills, Backlogs)
**Target File:** `server/src/utils/eligibilityEngine.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Input Validation**<br/>(start of `checkEligibility`) | Confirms eligibility engine receives correct student and job data. | `studentData`, `jobRequirements` |
| **Criteria Evaluation**<br/>(logic blocks) | Steps through each rule check (CGPA, branch match, backlog status). | `isGPAValid`, `isBranchValid` |
| **Decision Point**<br/>(end of function) | **Critical:** Validates final eligibility decision and avoids false negatives. | `eligibilityResult` (boolean) |

---

### 3. Applying to a Job
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Entry**<br/>(start of `applyJob`) | Confirms job ID and candidate context are correctly received. | `req.body` |
| **Eligibility Re-Check**<br/>(before `save`) | **Mandatory safety check:** backend must re-verify eligibility. | `isEligible` |
| **Rejection Trigger**<br/>(if `!isEligible`) | Ensures ineligible applications are blocked with a clear reason. | `rejectionReason` |

---

### 4. Preventing Duplicate Applications
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Existence Check**<br/>(before `create`) | Detects existing applications for the same student–job pair. | `existingApplication` |
| **Conflict Handling**<br/>(if found) | Ensures server returns a safe “Already Applied” response. | `errorResponse` |
| **Transaction Lock**<br/>(optional / advanced) | Prevents race conditions under high concurrency. | `dbSession` |

---

### 5. Updating Application Status
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **State Transition**<br/>(start of `updateStatus`) | Validates application flow: `Applied → Shortlisted → Interview → Placed/Rejected`. | `currentStatus`, `nextStatus` |
| **Role Verification**<br/>(middleware / logic) | Ensures only recruiters or admins can modify application status. | `req.user.role` |
| **Event Triggers**<br/>(post-update) | Confirms downstream actions (notifications, logs) are triggered. | `triggerEvents` |

---

### 6. Fetching Application History
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **User Scope**<br/>(start of `getMyApplications`) | Confirms query is restricted to the current logged-in student. | `req.user.id` |
| **Data Population**<br/>(after `find`) | Ensures job metadata (title, company) is populated correctly. | `applicationsUtils` |
| **Status Consistency**<br/>(before response) | Verifies application statuses match database records. | `formattedHistory` |


## Interview & Offer Management Module

This module manages interview scheduling, feedback capture,
offer generation, and final placement confirmation workflows.

---

### 1. Scheduling an Interview
**Target File:** `server/src/controllers/interviewController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Availability Check**<br/>(start of `scheduleRequest`) | Ensures interviewer and candidate have no scheduling conflicts. | `slotDetails`, `existingBookings` |
| **Input Parsing & Validation**<br/>(validation step) | Confirms interview date, time, mode (online/offline), and round type are valid. | `interviewData` |
| **Interview Creation**<br/>(after `save`) | Verifies interview record is created with initial status `Scheduled`. | `newInterview` |

---

### 2. Sending Interview Notifications
**Target File:** `server/src/controllers/interviewController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Trigger Point**<br/>(post-creation hook) | Identifies when interview invitations are triggered (Email/SMS). | `recipientList` |
| **Template Loading**<br/>(before sending) | Ensures correct notification template is populated with dynamic data. | `emailContent` |
| **Delivery Confirmation**<br/>(after service call) | Confirms notification service returns a successful delivery response. | `deliveryStatus` |

---

### 3. Recording Interview Feedback
**Target File:** `server/src/controllers/interviewController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Feedback Entry**<br/>(start of `submitFeedback`) | Captures raw interview scores and qualitative comments. | `feedbackPayload` |
| **Score Computation**<br/>(logic block) | Validates calculated averages or auto-generated scores. | `computedScore` |
| **Result Determination**<br/>(before `save`) | Ensures interview result is marked correctly (`Passed` / `Failed`). | `resultStatus` |

---

### 4. Advancing Candidate to Next Round
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Round Transition**<br/>(start of `promoteCandidate`) | Confirms candidate progression between interview rounds. | `currentRound`, `nextRound` |
| **Eligibility Re-check**<br/>(optional logic) | Validates continued eligibility for the next interview round. | `isEligible` |
| **Update Execution**<br/>(after `update`) | Confirms application record is updated correctly. | `updatedApplication` |

---

### 5. Creating a Job Offer
**Target File:** `server/src/controllers/offerController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Offer Generation**<br/>(start of `generateOffer`) | Verifies offer details such as CTC, role, and location. | `jobDetails` |
| **Candidate Mapping**<br/>(before `create`) | Ensures offer is created for the correct candidate and application. | `candidateId` |
| **Status Initialization**<br/>(after `save`) | Confirms initial offer status is set to `Pending` or `Generated`. | `offerStatus` |

---

### 6. Offer Acceptance / Rejection by Student
**Target File:** `server/src/controllers/offerController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Authorization Check**<br/>(start of `respondToOffer`) | Confirms student permission to respond to the specific offer. | `req.user`, `offerId` |
| **Expiry Validation**<br/>(logic check) | Ensures offer response deadline has not passed. | `expiryDate`, `now` |
| **State Update**<br/>(after `update`) | Verifies offer status updates to `Accepted` or `Rejected`. | `finalStatus` |

---

### 7. Final Placement Confirmation
**Target File:** `server/src/controllers/applicationController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Locking Mechanism**<br/>(start of `confirmPlacement`) | **Critical:** Prevents the student from applying to other jobs post-placement (if policy exists). | `studentId` |
| **Data Consistency**<br/>(before `res.json`) | Ensures job vacancy counters and related data are updated correctly. | `jobVacancyCount` |
| **Final Status Update**<br/>(after commit) | Confirms student’s global placement status is set to `Placed`. | `studentGlobalStatus` |




## TPO / College Verification & Analytics Module

This module handles institutional verification, academic data locking,
placement analytics, and official reporting workflows managed by TPOs.

---

### 1. Fetching Unverified Student Profiles
**Target File:** `server/src/controllers/tpoController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Query Filter**<br/>(start of `getUnverifiedStudents`) | Ensures only profiles with `verificationStatus = Pending` are fetched. | `queryFilters` |
| **Batch Loading**<br/>(pagination logic) | Prevents timeouts and memory overload when handling large student datasets. | `limit`, `offset` |
| **Data Projection**<br/>(before output) | Confirms required verification documents are included for review. | `studentList` |

---

### 2. Verifying / Rejecting Student Profiles
**Target File:** `server/src/controllers/tpoController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Action Validation**<br/>(start of `verifyProfile`) | Ensures a valid verification decision (`Verified` / `Rejected`) with comments is provided. | `status`, `rejectionReason` |
| **Ownership Check**<br/>(middleware) | Confirms TPO authority over the student’s department or batch. | `req.user.department` |
| **Database Update**<br/>(after `save`) | Verifies verification status is correctly persisted in the database. | `updatedProfile` |

---

### 3. Locking Academic Fields
**Target File:** `server/src/controllers/tpoController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Lock Trigger**<br/>(inside verification logic) | Ensures academic fields become immutable immediately after verification. | `isLocked` |
| **Edit Prevention**<br/>(in student update flow) | **Critical:** Confirms student edits are blocked once the profile is locked. | `req.user.isLocked` |
| **Notification Trigger**<br/>(post-lock) | Verifies student notification about profile freeze is sent. | `notificationStatus` |

---

### 4. Monitoring Placement Status
**Target File:** `server/src/controllers/analyticsController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Aggregation Logic**<br/>(start of `getPlacementStats`) | Validates how placement states (`Placed`, `Unplaced`, `Offers`) are computed. | `pipelineStages` |
| **Data Freshness**<br/>(query execution) | Ensures analytics reflect real-time data and not stale results. | `statsResult` |
| **Grouping Logic**<br/>(inside aggregation) | Confirms grouping by department, batch, or company is accurate. | `groupedData` |

---

### 5. Branch-wise & Year-wise Placement Analytics
**Target File:** `server/src/controllers/analyticsController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Filter Application**<br/>(start of `getCohortAnalytics`) | Ensures correct application of batch year and date range filters. | `filterCriteria` |
| **Metric Calculation**<br/>(analytics logic) | Verifies accuracy of metrics such as placement percentage and average package. | `totalStudents`, `totalPlaced` |
| **Response Formatting**<br/>(before `res.json`) | Confirms data format matches frontend charting requirements. | `chartData` |

---

### 6. Identifying At-Risk Students
**Target File:** `server/src/controllers/analyticsController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Threshold Definition**<br/>(start of `getAtRiskStudents`) | Confirms risk criteria (low CGPA, no applications, inactivity). | `riskCriteria` |
| **Scan Logic**<br/>(query execution) | Ensures students matching risk conditions are correctly identified. | `atRiskList` |
| **Actionable Output**<br/>(before response) | Ensures contact details are included for timely TPO intervention. | `studentContactDetails` |

---

### 7. Exporting Placement Reports
**Target File:** `server/src/controllers/analyticsController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Data Fetch**<br/>(start of `exportReport`) | **Performance-critical:** monitors memory usage during large data exports. | `recordCount` |
| **Formatting**<br/>(CSV / Excel conversion) | Ensures correct column mapping and data alignment. | `csvBuffer`, `workbook` |
| **Stream Output**<br/>(response stage) | Confirms correct MIME type and streaming headers for file download. | `res.headers` |



## Admin / Platform Management & Audit Module

This module handles platform-level administration, institutional onboarding,
system health monitoring, subscription control, and compliance auditing.

---

### 1. Managing Colleges / Institutions
**Target File:** `server/src/controllers/adminController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Request Scope**<br/>(start of `createCollege`) | Ensures all required onboarding data (Name, Code, Contact Info) is provided. | `req.body` |
| **Uniqueness Check**<br/>(before `save`) | Prevents duplicate college codes or duplicate admin email registrations. | `existingCollege` |
| **Activation Hook**<br/>(after `save`) | Confirms whether a default admin account is auto-created for the institution. | `newAdminUser` |

---

### 2. Viewing System-wide Usage Metrics
**Target File:** `server/src/controllers/adminController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Data Aggregation**<br/>(start of `getSystemMetrics`) | Verifies performance of global counts (users, jobs, applications). | `countsQuery` |
| **Load Calculation**<br/>(stats logic) | Ensures active sessions and recent usage metrics are computed correctly. | `activeSessions` |
| **Response Payload**<br/>(before `res.json`) | Ensures infrastructure-sensitive data is sanitized before exposure. | `sanitizedMetrics` |

---

### 3. Role & Access Control Overrides
**Target File:** `server/src/controllers/adminController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Authorization Level**<br/>(middleware) | **CRITICAL:** Confirms only `SUPER_ADMIN` users can access role overrides. | `req.user.role` |
| **Target Resolution**<br/>(start of `overrideRole`) | Identifies which user’s role is being changed and to what value. | `targetUserId`, `newRole` |
| **Audit Trigger**<br/>(after `update`) | Ensures this high-risk action generates a permanent audit log entry. | `auditEntry` |

---

### 4. Monitoring Platform Health
**Target File:** `server/src/controllers/healthController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Database Check**<br/>(start of `checkHealth`) | Confirms database connectivity within acceptable timeout limits. | `dbStatus` |
| **Resource Usage**<br/>(system metrics) | Monitors memory and CPU signals for early performance warnings. | `process.memoryUsage()` |
| **External Services**<br/>(integration check) | Verifies connectivity with email, storage, or third-party services. | `servicePingResults` |

---

### 5. Subscription / Plan Tracking
**Target File:** `server/src/controllers/billingController.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Plan Validation**<br/>(start of `updatePlan`) | Confirms the requested subscription plan exists and is active. | `planDetails` |
| **Expiry Logic**<br/>(scheduled check) | Ensures correct calculation of subscription expiry dates. | `newExpiryDate` |
| **Feature Gating**<br/>(access enforcement) | Verifies premium features are revoked immediately after downgrade. | `featuresToRevoke` |

---

### 6. Capturing Audit Logs for Sensitive Actions
**Target File:** `server/src/services/auditService.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Log Creation**<br/>(start of `logAction`) | Captures *who*, *what*, *when*, and *IP address* for traceability. | `auditPayload` |
| **Immutability Guard**<br/>(before `save`) | Ensures logs cannot be modified or deleted via standard APIs. | `options` |
| **Persistence Check**<br/>(after `save`) | Confirms audit records are permanently stored. | `savedLog` |

---

### 7. Handling Security & Compliance Events
**Target File:** `server/src/services/securityService.ts` (Proposed)

| Breakpoint Section | Why it’s Important | Variables to Inspect |
|-------------------|--------------------|----------------------|
| **Data Access Request**<br/>(start of `exportUserData`) | Confirms requester is the legitimate data owner (DPDP compliance). | `requesterId`, `resourceOwnerId` |
| **Anonymization Logic**<br/>(processing stage) | **CRITICAL:** Ensures PII masking where required by regulation. | `maskedData` |
| **Retention Enforcement**<br/>(cleanup routine) | Verifies expired or deleted accounts are anonymized/removed properly. | `cleanupResult` |








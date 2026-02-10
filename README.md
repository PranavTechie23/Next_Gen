# 🎓 Campus Career & Placement Intelligence Platform

![Platform Banner](https://img.shields.io/badge/Status-Active-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

> An AI-powered, institutional-grade career intelligence platform designed to bridge the gap between academic learning and professional success. Built for students, Training & Placement Officers (TPO), and university administrators.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Vision](#vision)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features by Role](#features-by-role)
- [Workflow Diagram](#workflow-diagram)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Suggestions & Feedback](#suggestions--feedback)
- [License](#license)

---

## 🌟 Overview

The **Campus Career & Placement Intelligence Platform** is a comprehensive placement automation system that streamlines the entire placement process from student profile creation to final job offers. The platform serves three primary stakeholders:

- **Students**: Complete profiles, apply for jobs, track applications, and receive personalized career guidance
- **TPO Admins**: Manage student data, verify profiles, monitor placements, and generate analytics
- **Recruiters**: Post jobs, review applications, shortlist candidates, and manage interviews

### Core Capabilities

- ✅ **Automated Eligibility Matching**: AI-powered job-student matching based on CGPA, branch, skills, and requirements
- ✅ **Real-time Analytics**: Comprehensive dashboards with placement metrics, readiness scores, and trend analysis
- ✅ **Profile Management**: Student profile creation, verification, and resume upload system
- ✅ **Application Tracking**: End-to-end application status tracking (Applied → Shortlisted → Interview → Placed/Rejected)
- ✅ **Notification System**: Email/SMS notifications for interview schedules, status updates, and important announcements
- ✅ **Feedback Collection**: Multi-step feedback forms for students and TPOs to capture placement experiences

---

## 🎯 Vision

The **Campus Career Platform** transforms traditional placement cells into data-driven career hubs. By leveraging AI-powered analytics and automation, it provides:

- **For Students**: Actionable insights for career journeys, personalized recommendations, and skill gap analysis
- **For TPOs**: Bird's-eye view of institutional placement health, at-risk student identification, and data-driven interventions
- **For Recruiters**: Streamlined candidate screening, efficient application management, and seamless interview scheduling

### Mission Statement

> "Empowering the next generation of professionals through intelligent career guidance and seamless placement automation."

---

## 🏗️ System Architecture

The platform follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│  React 19 + TypeScript + Tailwind CSS + Radix UI       │
│  (Student, TPO Admin, Recruiter Dashboards)             │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                        │
│  Express.js + Node.js + RESTful APIs                    │
│  (Authentication, Business Logic, Data Processing)      │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│  Database (Users, Profiles, Jobs, Applications)         │
│  Eligibility Check Engine + Analytics Engine            │
└─────────────────────────────────────────────────────────┘
```

### Key System Components

1. **Eligibility Check Engine**: Automated matching algorithm based on job criteria (CGPA, branch, skills)
2. **Notification Service**: Email/SMS integration for real-time updates
3. **Analytics Engine**: Data processing and visualization for dashboards
4. **Profile Verification System**: TPO-administered student profile approval workflow

---

## 🚀 Key Features

### Core Features

- 🔐 **Multi-role Authentication**: Secure login system for Students, TPO Admins, and Recruiters
- 📊 **Interactive Dashboards**: Role-specific dashboards with real-time metrics and visualizations
- 📝 **Profile Management**: Comprehensive student profile with academic details, skills, and resume
- 💼 **Job Posting & Application**: Recruiter job posting with automated eligibility matching
- 📈 **Analytics & Reporting**: Advanced analytics with exportable reports (Excel format)
- 🔔 **Notification System**: Real-time notifications for interviews, status updates, and announcements
- 📋 **Feedback Collection**: Structured feedback forms for placement experiences
- 🎨 **Theme Support**: Light/Dark mode with smooth transitions

---

## 👥 User Roles

### 1. 👨‍🎓 Student
- Complete and update profile (marks, skills, resume)
- View eligible jobs based on criteria
- Apply for positions with one-click application
- Track application status in real-time
- Access career resources, webinars, and case studies
- Submit placement feedback after interviews

### 2. 🏫 TPO Admin (Training & Placement Officer)
- Import student data via Excel
- Verify and approve student profiles
- Monitor placement drives and analytics
- Identify at-risk students
- Generate placement reports
- Manage company invitations
- Export final placement reports

### 3. 👔 Recruiter
- Post new job openings with criteria (CGPA, branch, package)
- View and review job applicants
- Shortlist candidates for interviews
- Schedule interviews and send invites
- Conduct interviews and extend offers
- Update application status (Placed/Rejected)

### 4. 🔧 Platform Admin
- Manage multiple colleges/institutions
- Monitor platform usage and adoption
- Handle support tickets
- View system-wide analytics
- Manage subscriptions and billing

---




## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.1 | UI framework for building interactive dashboards |
| **TypeScript** | 5.6.3 | Type-safe JavaScript for better code quality |
| **Vite** | 7.1.7 | Fast build tool and development server |
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework for styling |
| **Radix UI** | Latest | Accessible, unstyled UI component primitives |
| **Framer Motion** | 12.23.22 | Animation library for smooth interactions |
| **Wouter** | 3.3.5 | Lightweight routing solution |
| **Recharts** | 2.15.2 | Composable charting library for analytics |
| **React Hook Form** | 7.64.0 | Performant form library with validation |
| **Zod** | 4.1.12 | TypeScript-first schema validation |
| **Axios** | 1.12.0 | HTTP client for API requests |
| **Lucide React** | 0.453.0 | Beautiful icon library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.21.2 | Web application framework |
| **esbuild** | 0.25.0 | Fast JavaScript bundler for production builds |

### Development Tools

- **pnpm** - Fast, disk space efficient package manager
- **Prettier** - Code formatter for consistent styling
- **TypeScript** - Static type checking
- **Vite Plugins** - JSX location tracking, runtime plugins

### Design System

The platform follows **"Academic Minimalism with Institutional Trust"** design philosophy:

- **Color Palette**:
  - Primary Navy: `#1e3a8a` (authority, professionalism)
  - Accent Amber: `#d97706` (actionable insights)
  - Success Green: `#10b981`
  - Warning Orange: `#f59e0b`
  - Critical Red: `#ef4444`

- **Typography**:
  - Display: Poppins Bold (titles)
  - Headings: Inter SemiBold
  - Body: Inter Regular
  - Data: IBM Plex Mono (metrics)

- **Spacing System**: 8px base unit with consistent gutters (24px)

---

## 📦 Installation

### Required versions (use these to avoid setup errors)

To prevent errors on different machines, **match these versions**:

| Tool / runtime | Version | Notes |
|----------------|---------|--------|
| **Node.js** | **20.x LTS** (or 22.x) | Required. v18 may work but 20+ is recommended. [Download](https://nodejs.org/) |
| **pnpm** | **10.4.x** (or 10.x) | Recommended; lockfile is for pnpm. [Install](https://pnpm.io/installation): `npm install -g pnpm@10` |
| **Git** | Any recent | [Download](https://git-scm.com/) |

- **Do not delete `pnpm-lock.yaml`** — it locks exact dependency versions so everyone gets the same install.
- If you use **nvm**, run `nvm use` in the project root (see `.nvmrc`) to switch to Node 20.
- If you use **npm** instead of pnpm, run `npm install`; versions may differ slightly and cause build/runtime errors. Prefer pnpm for consistency.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher recommended) - [Download](https://nodejs.org/)
- **pnpm** 10.x (recommended) or npm/yarn - [Install pnpm](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/campus-career-platform.git
cd campus-career-platform
```

### Step 2: Install Dependencies

Using **pnpm** (recommended):
```bash
pnpm install
```

Or using **npm**:
```bash
npm install
```

Or using **yarn**:
```bash
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# OAuth Configuration (if using OAuth)
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id

# Database Configuration (if using database)
DATABASE_URL=your-database-connection-string

# Email/SMS Service (for notifications)
EMAIL_SERVICE_API_KEY=your-email-api-key
SMS_SERVICE_API_KEY=your-sms-api-key
```

### Step 4: Start Development Server

```bash
# Start both frontend and backend in development mode
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3000/api` (if configured)

### Step 5: Build for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

---

## 🚦 Getting Started

### For Developers

1. **Explore the Project Structure**:
   ```bash
   # View project structure
   tree -L 3 -I 'node_modules'
   ```

2. **Run Type Checking**:
   ```bash
   npm run check
   ```

3. **Format Code**:
   ```bash
   npm run format
   ```

### For Users

#### Student Login
- Navigate to `/login`
- Use demo credentials: `demo@student.com` / `demo123`
- Or create a new account via `/signup`

#### TPO Admin Login
- Navigate to `/login`
- Use email containing `tpo`, `dept`, or `college` keywords
- Access dashboard at `/college/dashboard`

#### Recruiter Login
- Navigate to `/login`
- Use recruiter email credentials
- Access dashboard at `/admin/dashboard` (or recruiter-specific route)

### Quick Start Guide

1. **Student Workflow**:
   ```
   Login → Complete Profile → Upload Resume → 
   View Eligible Jobs → Apply → Track Status
   ```

2. **TPO Admin Workflow**:
   ```
   Login → Import Student Data → Verify Profiles → 
   Monitor Analytics → Export Reports
   ```

3. **Recruiter Workflow**:
   ```
   Login → Post Job → Review Applications → 
   Shortlist → Schedule Interview → Extend Offer
   ```

---

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (client + server) |
| `npm start` | Start production server |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

---

## 📁 Project Structure (Detailed)

```
campus-career-platform/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   │   ├── images/             # Platform images and logos
│   │   └── logos/              # Company logos
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Map.tsx
│   │   │   ├── ScrollToTop.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── college/       # TPO admin pages
│   │   │   ├── student/       # Student pages
│   │   │   ├── Home.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── contexts/          # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   └── index.html             # HTML template
│
├── server/                     # Backend Express server
│   └── index.ts               # Server entry point
│
├── shared/                     # Shared code between client/server
│   └── const.ts               # Shared constants
│
├── patches/                    # Package patches
│   └── wouter@3.7.1.patch
│
├── dist/                       # Production build output
│   ├── public/                # Built frontend
│   └── index.js               # Built server
│
├── package.json                # Project dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite configuration
├── components.json            # shadcn/ui config
├── .gitignore                 # Git ignore rules
├── LICENSE                    # MIT License
└── README.md                  # This file
```

---


## 🎯 Features by Role

### 👨‍🎓 Student Features

#### 1. Smart Dashboard
- **Overall Readiness Score**: Percentage-based placement preparedness metric
- **Skills Mastered**: Track progress on core competencies (e.g., 12/18 skills)
- **Placement Probability**: AI-calculated likelihood of placement success
- **Evolution Tracking**: Monthly progress visualization (Aug → Jan)
- **Quick Stats Cards**: Visual metrics with trend indicators (↑↓)

#### 2. Profile Management
- **Complete Profile**: Academic details (CGPA, branch, year, graduation year)
- **Skills Tracking**: Add and track technical and soft skills
- **Resume Upload**: Upload and manage multiple resume versions
- **Portfolio Links**: LinkedIn, GitHub, Portfolio website integration
- **Profile Verification Status**: Track TPO approval status

#### 3. Job Application System
- **Eligible Jobs View**: Filtered job listings based on eligibility criteria
- **Auto Eligibility Check**: System automatically matches jobs to student profile
- **One-Click Apply**: Streamlined application process
- **Application Tracking**: Real-time status updates
  - Applied → Shortlisted → Interview Scheduled → Placed/Rejected

#### 4. Career Resources
- **Career Toolkit**: AI-powered resume building and interview prep
- **Webinars**: Access to career development webinars
- **Case Studies**: Success stories from FAANG and top-tier companies
- **Corporate News**: Industry updates and company insights
- **Blog**: Career tips, interview guides, and industry trends
- **Features Page**: Platform feature overview and tutorials

#### 5. Wellbeing Hub
- **Guided Breathing**: Stress relief exercises
- **Mood Tracking**: Daily mood logging
- **Mental Health Resources**: Professional counseling resources
- **Wellness Tips**: Articles and tips for maintaining mental health

#### 6. Feedback System
- **Placement Feedback Form**: Multi-step form to share interview experiences
  - Step 1: Personal Information
  - Step 2: Placement Details (Company, Role, Package)
  - Step 3: Interview Experience (Questions, Tips, Ratings)

#### 7. Analytics & Insights
- **Skill Gap Analysis**: Identify missing skills for target roles
- **Readiness Evolution**: Track improvement over time
- **Performance Metrics**: Charts and graphs for self-assessment
- **Recommendations**: AI-powered career path suggestions

---

### 🏫 TPO Admin Features

#### 1. Dashboard Overview
- **Total Students**: Count with growth percentage
- **Placement Ready**: Students meeting readiness criteria
- **Average Readiness Score**: Institutional average
- **Placement Rate**: Year-over-year placement percentage
- **Active Companies**: Number of recruiting partners
- **Average Package**: LPA (Lakhs Per Annum) tracking

#### 2. Student Data Management
- **Excel Import**: Bulk import student data via Excel files
- **Profile Verification**: Review and approve/reject student profiles
- **Profile Status Management**: Track verification status
- **Student Search & Filter**: Find students by branch, year, CGPA

#### 3. Placement Analytics
- **Branch-wise Analytics**: Placement metrics by department
- **Year Trends**: Historical placement data visualization
- **Skills Radar Chart**: College vs Industry skill comparison
- **Placement Distribution**: Product-based vs Service-based breakdown
- **Monthly Activity**: Applications, interviews, offers timeline

#### 4. At-Risk Student Identification
- **Low Readiness Alerts**: Students below threshold (e.g., <50%)
- **Issue Tracking**: Identify problems (Low DSA Score, No Projects, etc.)
- **Intervention Suggestions**: AI-recommended actions
- **Last Activity Tracking**: Monitor student engagement

#### 5. Top Performers
- **Leaderboard**: Top students by readiness score
- **Offer Tracking**: Multiple offers per student
- **Package Tracking**: Highest package achievements
- **Recognition System**: Highlight outstanding students

#### 6. Company Management
- **Company Invitations**: Send email invites to recruiters
- **Company Performance**: Track hiring statistics per company
- **Drive Management**: Organize and monitor placement drives
- **Partnership Tracking**: Maintain corporate relationships

#### 7. Reporting & Export
- **Final Reports**: Generate comprehensive placement reports
- **Excel Export**: Download data in spreadsheet format
- **Custom Reports**: Filter and generate specific reports
- **Analytics Dashboard**: Visual representation of all metrics

#### 8. Feedback Collection
- **TPO Feedback Form**: Collect placement officer insights
- **Student Feedback Review**: View student-submitted feedback
- **Analytics Integration**: Use feedback for data-driven decisions

---

### 👔 Recruiter Features

#### 1. Job Posting
- **Post New Job**: Create job listings with criteria
  - CGPA requirements
  - Branch/Department filters
  - Package range (LPA)
  - Location preferences
  - Job type (Full-time, Internship, etc.)
- **Job Management**: Edit, update, or close job postings
- **Eligibility Matching**: Automatic student-job matching

#### 2. Application Review
- **View Applicants**: See all applications for posted jobs
- **Profile Review**: Access student profiles and resumes
- **Filter & Search**: Find candidates by criteria
- **Bulk Actions**: Process multiple applications

#### 3. Candidate Selection
- **Shortlist Candidates**: Mark candidates for next round
- **Reject Candidates**: Decline applications with feedback
- **Status Updates**: Update application status in real-time
- **Notes & Comments**: Add internal notes on candidates

#### 4. Interview Management
- **Schedule Interviews**: Set interview dates and times
- **Send Invites**: Automated email/SMS notifications
- **Interview Calendar**: View scheduled interviews
- **Conduct Interviews**: Track interview progress
- **Interview Feedback**: Record interview notes and ratings

#### 5. Offer Management
- **Extend Offers**: Mark candidates as "Offered"
- **Placement Confirmation**: Finalize "Placed" status
- **Package Negotiation**: Track offer details
- **Offer Acceptance**: Monitor candidate responses

---

### 🔧 Platform Admin Features

#### 1. Multi-College Management
- **College Onboarding**: Add new institutions
- **College Dashboard**: View all colleges and their metrics
- **Subscription Management**: Track plans (Premium, Standard, Trial)
- **Revenue Tracking**: Monitor subscription revenue

#### 2. System Monitoring
- **Platform Adoption**: Track user adoption rates
- **System Uptime**: Monitor server availability (99.8%+)
- **Support Tickets**: Manage and resolve issues
- **Performance Metrics**: Response time, data quality scores

#### 3. Analytics & Insights
- **Usage Metrics**: Track active users, assessments, sessions
- **College Performance**: Compare institutions
- **Model Performance**: AI/ML model accuracy tracking
- **Trend Analysis**: Growth and adoption trends

#### 4. User Management
- **User Administration**: Manage all platform users
- **Role Management**: Assign and modify user roles
- **Access Control**: Manage permissions and access levels

---

## 🔄 System Workflow

### Complete Placement Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    START - Login/Auth                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        │                                       │
   [Student]                              [TPO Admin]
        │                                       │
        ↓                                       ↓
┌──────────────────┐              ┌──────────────────────┐
│ Complete Profile │              │ Import Student Data  │
│ Upload Resume    │              │ (Excel)              │
└──────────────────┘              └──────────────────────┘
        │                                       │
        ↓                                       ↓
┌──────────────────┐              ┌──────────────────────┐
│ Profile Pending  │◄─────────────│ Verify Profiles       │
│ Verification     │              │ Approve/Reject        │
└──────────────────┘              └──────────────────────┘
        │                                       │
        ↓                                       │
┌──────────────────┐                           │
│ Profile Active   │───────────────────────────┘
│ (Verified)       │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│ View Eligible    │◄──────┐
│ Jobs             │       │
└──────────────────┘       │
        │                  │
        ↓                  │
┌──────────────────┐       │
│ Apply for Job?   │       │
└──────────────────┘       │
        │                  │
    Yes │                  │
        ↓                  │
┌──────────────────┐       │
│ Check Eligibility│       │
│ (Auto)           │       │
└──────────────────┘       │
        │                  │
        ↓                  │
┌──────────────────┐       │
│ Click Apply      │       │
└──────────────────┘       │
        │                  │
        ↓                  │
┌──────────────────┐       │
│ Track Application│       │
│ Status           │       │
└──────────────────┘       │
        │                  │
        ↓                  │
┌──────────────────┐       │
│ Status Updates:  │       │
│ Applied →        │       │
│ Shortlisted →    │       │
│ Interview →      │       │
│ Placed/Rejected  │       │
└──────────────────┘       │
        │                  │
        └──────────────────┘
                │
                ↓
┌───────────────────────────────────────────────┐
│         END PROCESS / Export Reports          │
└───────────────────────────────────────────────┘
```

### Recruiter Workflow

```
Login → Dashboard
    ↓
Post New Job (Criteria: CGPA, Branch, Package)
    ↓
Save Job & Eligibility Match
    ↓
View Job Applicants
    ↓
Review Profiles/Resumes
    ↓
    ├─→ Select for Next Round? → Yes → Shortlist Candidate
    │                                       ↓
    │                              Schedule Interview
    │                                       ↓
    │                              Send Invite (Email/SMS)
    │                                       ↓
    │                              Conduct Interview
    │                                       ↓
    │                              Extend Offer?
    │                              ├─→ Yes → Mark "Placed"
    │                              └─→ No → Reject Candidate
    │
    └─→ No → Reject Candidate
                ↓
        Update Status → Track Application Status
```

---

## 🔐 Authentication & Authorization

### Login System
- **Multi-role Login**: Single login page with role detection
- **Email-based Authentication**: Email + Password authentication
- **Social Login**: Optional GitHub, Google OAuth (if configured)
- **Session Management**: Secure session handling
- **Role-based Redirect**: Automatic dashboard routing based on role

### Role Detection Logic
```typescript
// Auto-detect user type from email
if (email.includes("student") || email.includes("demo")) {
  → Redirect to /student/dashboard
} else if (email.includes("tpo") || email.includes("college")) {
  → Redirect to /college/dashboard
} else if (email.includes("admin")) {
  → Redirect to /admin/dashboard
}
```

---

## 📊 Data Flow

### Student Profile Data Flow
```
Student Input → Profile Form → Database
                    ↓
            TPO Verification
                    ↓
            Profile Active Status
                    ↓
        Eligibility Check Engine
                    ↓
        Job Matching Algorithm
                    ↓
        Eligible Jobs Display
```

### Application Status Flow
```
Application Submitted
        ↓
Eligibility Check (Auto)
        ↓
Application Status: "Applied"
        ↓
Recruiter Review
        ↓
    ├─→ Shortlisted → Interview Scheduled
    │                       ↓
    │                   Interview Conducted
    │                       ↓
    │                   ├─→ Offer Extended → Placed
    │                   └─→ Rejected
    │
    └─→ Rejected
```

---


## 🔌 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication
Most endpoints require authentication. Include session cookie or bearer token in requests.

### Endpoints Overview

#### Student Endpoints

##### Get Student Profile
```http
GET /api/students/:id/profile
```
**Response:**
```json
{
  "id": "CSE-2021-001",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@college.edu",
  "branch": "Computer Science & Engineering",
  "cgpa": 8.5,
  "year": "Final Year",
  "readinessScore": 72,
  "profileStatus": "verified"
}
```

##### Update Student Profile
```http
PUT /api/students/:id/profile
Content-Type: application/json

{
  "cgpa": 8.7,
  "skills": ["React", "Node.js", "Python"],
  "resumeUrl": "https://..."
}
```

##### Get Eligible Jobs
```http
GET /api/students/:id/jobs/eligible
Query Parameters:
  - branch: string (optional)
  - minPackage: number (optional)
  - location: string (optional)
```

##### Apply for Job
```http
POST /api/students/:id/applications
Content-Type: application/json

{
  "jobId": "job-123",
  "resumeId": "resume-456"
}
```

##### Get Application Status
```http
GET /api/students/:id/applications/:applicationId
```

#### TPO Admin Endpoints

##### Import Student Data
```http
POST /api/tpo/students/import
Content-Type: multipart/form-data

{
  "file": File (Excel)
}
```

##### Verify Student Profile
```http
PUT /api/tpo/students/:id/verify
Content-Type: application/json

{
  "status": "approved" | "rejected",
  "comments": "string"
}
```

##### Get Placement Analytics
```http
GET /api/tpo/analytics
Query Parameters:
  - branch: string (optional)
  - year: number (optional)
  - timeRange: "month" | "year" (optional)
```

##### Export Reports
```http
GET /api/tpo/reports/export
Query Parameters:
  - format: "excel" | "pdf"
  - startDate: string
  - endDate: string
```

#### Recruiter Endpoints

##### Post New Job
```http
POST /api/recruiters/jobs
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Job description...",
  "requirements": {
    "minCGPA": 7.5,
    "branches": ["CSE", "ECE"],
    "skills": ["React", "JavaScript"]
  },
  "package": {
    "min": 8,
    "max": 12,
    "currency": "LPA"
  },
  "location": "Bangalore",
  "type": "Full-time"
}
```

##### Get Job Applications
```http
GET /api/recruiters/jobs/:jobId/applications
```

##### Shortlist Candidate
```http
POST /api/recruiters/applications/:applicationId/shortlist
```

##### Schedule Interview
```http
POST /api/recruiters/applications/:applicationId/interview
Content-Type: application/json

{
  "date": "2024-02-15",
  "time": "10:00",
  "type": "online" | "onsite",
  "location": "string",
  "interviewer": "string"
}
```

##### Update Application Status
```http
PUT /api/recruiters/applications/:applicationId/status
Content-Type: application/json

{
  "status": "placed" | "rejected",
  "package": 10.5, // if placed
  "comments": "string"
}
```

---

## 🤝 Contributing

We welcome contributions! This project is open source and contributions make the platform better for everyone.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/campus-career-platform.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm run check  # Type checking
   npm run dev    # Test locally
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: Add new feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Add screenshots if UI changes

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Functional components with hooks
- **Naming**: Use descriptive names, camelCase for variables
- **Comments**: Document complex logic and algorithms
- **Formatting**: Run `npm run format` before committing

### Reporting Issues

Found a bug? Have a suggestion? Please open an issue:

1. Check if the issue already exists
2. Use a clear, descriptive title
3. Provide steps to reproduce
4. Include expected vs actual behavior
5. Add screenshots if applicable
6. Specify environment (OS, Node version, etc.)

---

## 💡 Suggestions & Feedback

We value your feedback! This platform is continuously evolving, and your input helps us improve.

### Current Known Limitations

1. **Database Integration**: Currently using mock data; needs database integration
2. **Authentication**: Basic email-based auth; OAuth integration pending
3. **Email/SMS Notifications**: Placeholder implementation; needs service integration
4. **File Upload**: Resume upload UI ready; backend storage pending
5. **Real-time Updates**: WebSocket integration for live status updates pending

### Planned Features

- [ ] **Advanced Analytics**: Machine learning-based placement predictions
- [ ] **Video Interviews**: Integrated video interview platform
- [ ] **Skill Assessments**: Automated coding tests and assessments
- [ ] **Mentorship Program**: Connect students with alumni mentors
- [ ] **Mobile App**: React Native mobile application
- [ ] **AI Resume Builder**: AI-powered resume generation and optimization
- [ ] **Interview Simulator**: AI-powered mock interview practice
- [ ] **Company Reviews**: Student reviews of companies and interview processes
- [ ] **Salary Insights**: Industry salary trends and negotiations
- [ ] **Multi-language Support**: Internationalization (i18n)

### Feature Requests

Have an idea? We'd love to hear it!

1. **Open an Issue**: Use the "Feature Request" template
2. **Describe the Feature**: What problem does it solve?
3. **Use Cases**: How would users benefit?
4. **Mockups**: Visual designs are welcome!

### Feedback Channels

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general feedback
- **Email**: [Your contact email]
- **Discord/Slack**: [Community link if available]

### Roadmap

#### Q1 2024
- ✅ Core dashboard implementation
- ✅ Student profile management
- ✅ Job application system
- 🔄 Database integration
- 🔄 Authentication system

#### Q2 2024
- 📋 Advanced analytics
- 📋 Notification system
- 📋 File upload functionality
- 📋 Report generation

#### Q3 2024
- 📋 Mobile app development
- 📋 AI-powered features
- 📋 Video interview integration
- 📋 Skill assessments

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Design Inspiration**: Academic Minimalism design philosophy
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Community**: All contributors and users who provide feedback



## 📞 Support & Contact

- **Documentation**: [Full Docs](./README.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/campus-career-platform/issues)
- **Email**: support@campus-career-platform.com
- **Website**: [Your Website URL]



## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!



## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)



**Built with ❤️ for the next generation of professionals.**


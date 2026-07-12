# 🎓 Campus Career & Placement Intelligence Platform

![Platform Banner](https://img.shields.io/badge/Status-Active-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

> An institutional-grade career intelligence platform designed to bridge the gap between academic learning and professional success. Built for students, Department head, Training & Placement Officers (TPO).

---
## 📋 Table of Contents

- [Overview](#overview)
- [Vision](#vision)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure-detailed)
- [Features by Role](#features-by-role)
  - [Student Features](#-student-features)
  - [TPO Features](#-tpo-features)
  - [Platform Admin Features](#-platform-admin-features)
- [System Workflow](#-system-workflow)
- [Authentication & Authorization](#-authentication--authorization)
- [Data Flow](#-data-flow)
- [Contributing](#-contributing)
- [Suggestions & Feedback](#-suggestions--feedback)
- [License](#-license)

## 🌟 Overview

The **Campus Career & Placement Intelligence Platform** is a comprehensive placement automation system that streamlines the entire placement process from student profile creation to final job offers. The platform serves three primary stakeholders:

- **Students**: Complete profiles, apply for jobs, track applications, and receive personalized career guidance
- **TPOs**: Manage student data, verify profiles, monitor placements, and generate analytics
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
│     React 19 + TypeScript + Tailwind CSS + Radix UI     │
│            (Student, TPO, Recruiter Dashboards)         │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                        │
│           Express.js + Node.js + RESTful APIs           │
│    (Authentication, Business Logic, Data Processing)    │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│     Database (Users, Profiles, Jobs, Applications)      │
│       Eligibility Check Engine + Analytics Engine       │
└─────────────────────────────────────────────────────────┘
```

### Key System Components

1. **Eligibility Check Engine**: Automated matching algorithm based on job criteria (CGPA, branch, skills)
2. **Notification Service**: Email/SMS integration for real-time updates
3. **Analytics Engine**: Data processing and visualization for dashboards
4. **Profile Verification System**: Drives Eligible Workflow

---

## 🚀 Key Features

### Core Features

- 🔐 **Multi-role Authentication**: Secure login system for Students, TPOs, and Recruiters
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

### 2. 🏫 TPO (Training & Placement Officer)
- Import student data via Excel
- Verify and approve student profiles
- Monitor placement drives and analytics
- Identify at-risk students
- Generate placement reports
- Manage company invitations
- Export final placement reports


### 3. 🔧 Platform Admin
- Manage multiple colleges/institutions
- Monitor platform usage and adoption
- Handle support tickets
- View system-wide analytics

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


### Quick Start Guide

1. **Student Workflow**:
   ```
   Login → Complete Profile → Upload Resume → 
   View Eligible Jobs → Apply → Track Status
   ```

2. **Dept Admin Workflow**:
   ```
   Login → Import Student Data → Verify Profiles → 
   Monitor Analytics → Export Reports
   ```

3. **TPO Workflow**:
   ```
   Login → Post Job → Review Applications → 
   Shortlist → Schedule Interview → Extend Offer
   ```

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
│   │   │   ├── TPO/         # TPO dashboard pages
│   │   │   ├── college/       # TPO pages
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

### 🏫 TPO Features

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
- **User TPOistration**: Manage all platform users
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
   [Student]                                  [TPO]
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
┌──────────────────┐                            │
│ Profile Active   │────────────────────────────┘
│   (Verified)     │
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

---

## 🔐 Authentication & Authorization

### Login System
- **Multi-role Login**: Single login page with role detection
- **Email-based Authentication**: Email + Password authentication
- **Session Management**: Secure session handling
- **Role-based Redirect**: Automatic dashboard routing based on role


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


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

**Built with ❤️ for the next generation of professionals.**
# 🧠 NextGen Campus Career Platform — Complete AI/ML Architecture & Implementation Roadmap

> **Vision Statement:** "Every student gets a personalized career co-pilot powered by AI"

> **Mission:** Transform static career guidance into an adaptive, intelligent system that understands each student's unique profile, learning pace, and career goals—delivering personalized roadmaps, problem recommendations, and interview preparation.

---

## 📋 Table of Contents

1. [Scope & Non-Goals](#scope--non-goals)
2. [System Architecture](#system-architecture)
3. [AI Agent Architecture](#ai-agent-architecture)
4. [Technology Stack](#technology-stack)
5. [Data Architecture](#data-architecture)
6. [ML Models & Algorithms](#ml-models--algorithms)
7. [API Specifications](#api-specifications)
8. [Database Schema Extensions](#database-schema-extensions)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Integration Strategy](#integration-strategy)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Architecture](#deployment-architecture)
13. [Monitoring & Observability](#monitoring--observability)
14. [Security & Compliance](#security--compliance)
15. [Future Enhancements](#future-enhancements)

---

## 🎯 Scope & Non-Goals

### In scope (technical)
- **Three-agent AI architecture** (Assess → Plan → Practice)
- **LLM augmentation** (chat co-pilot, resume review, mock interviews) with strict safety/guardrails
- **ML pipelines** for skill scoring, recommendations, readiness prediction, learning pace estimation
- **Data ingestion** from external coding profiles (where feasible) + first-party event tracking
- **APIs, database schema, deployments, monitoring, security** for production-grade delivery

### Non-goals (belongs in business doc)
- Market positioning, pricing, GTM, sales funnels
- Financial forecasts, unit economics, runway
- Business KPIs (CAC/LTV), partnerships strategy

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER (React/Vite)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │  Dashboard   │  │ CompanyWiseKit│ │   Careers    │  │AI Chat Sidebar│    │
│  │ (AI-Powered) │  │  (Adaptive)   │ │  (Dynamic)   │  │ (Co-Pilot)    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                              │                                              │
│                    REST API / WebSocket / GraphQL                           │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────────────┐
│                      BACKEND LAYER (Node.js + Python)                       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      API GATEWAY (Express.js)                         │  │
│  │  • Authentication & Authorization                                     │  │
│  │  • Rate Limiting                                                      │  │
│  │  • Request Validation                                                 │  │
│  │  • Load Balancing                                                     │  │
│  └────────────────────────────┬──────────────────────────────────────────┘  │
│                               │                                             │
│  ┌────────────────────────────┴─────────────────────────────────────────┐   │
│  │                    AI/ML ENGINE LAYER (Python)                       │   │
│  │                                                                      │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐     │   │
│  │  │   AGENT 1:       │  │   AGENT 2:       │  │   AGENT 3:      │     │   │
│  │  │   Skill          │  │   Career Path    │  │   Interview     │     │   │
│  │  │   Assessor       │  │   Optimizer      │  │   Co-Pilot      │     │   │
│  │  └────────┬─────────┘  └────────┬─────────┘  └───────┬─────────┘     │   │
│  │           │                     │                    │               │   │
│  │  ┌────────┴─────────────────────┴────────────────────┴────────┐      │   │
│  │  │         SHARED ML MODELS & PIPELINES                       │      │   │
│  │  │  • Skill Gap Classifier (XGBoost / Random Forest)          │      │   │
│  │  │  • Placement Predictor (Logistic Regression / Neural Net)  │      │   │
│  │  │  • Recommendation Engine (Collaborative Filtering / Matrix)│      │   │
│  │  │  • NLP Analyzer (BERT / GPT-based)                         │      │   │
│  │  │  • LLM Integration (Gemini Pro / OpenAI GPT-4)             │      │   │
│  │  │  • Time Series Predictor (LSTM for progress forecasting)   │      │   │
│  │  └────────────────────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    DATA PROCESSING PIPELINE                          │   │
│  │  • Feature Engineering Service                                       │   │
│  │  • Data Validation & Cleaning                                        │   │
│  │  • Real-time Data Sync (LeetCode, GitHub, etc.)                      │   │
│  │  • Batch Processing (Daily/Weekly model retraining)                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐       │
│  │   PostgreSQL     │  │   Redis Cache    │  │  Vector DB (Pinecone)│       │
│  │  (User Data)     │  │  (Sessions/ML)   │  │  (Semantic Search)   │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              EXTERNAL INTEGRATIONS                                   │   │
│  │  • LeetCode API    • GitHub API    • LinkedIn API                    │   │
│  │  • GFG Scraper     • HackerRank API • Job Board APIs                 │   │
│  │  • Codeforces API  • InterviewBit API                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → Frontend → API Gateway → AI Engine → ML Models → Database
                ↓            ↓            ↓           ↓           ↓
            WebSocket ← Response ← Agent Logic ← Predictions ← Data
```

---

## 🤖 AI Agent Architecture

### Agent 1: Skill Assessor 🎯
**Purpose:** "Where are you RIGHT NOW?"

#### Core Functionality
- Analyzes coding profiles (LeetCode, GFG, HackerRank, GitHub, Codeforces)
- Scores across 8 dimensions: DSA, System Design, Web Dev, Database, OS, CN, OOP, Soft Skills
- Creates **Skill Radar Chart** showing strengths vs weaknesses
- Compares against successful candidates who got into target company
- Generates skill gap analysis with confidence scores

#### ML Pipeline

```
INPUT (Student Profile):
├── LeetCode stats: 200 problems solved (E:100, M:80, H:20)
├── GitHub: 15 repos, mostly Python + React, 500+ commits
├── CGPA: 8.2
├── Branch: CSE
├── Projects: 3 (1 ML, 1 Web, 1 App)
├── Certifications: AWS Cloud Practitioner
├── Hackathons: 2 participated
└── Target: Google SDE-1

FEATURE EXTRACTION:
├── Numerical Features (50+):
│   ├── leetcode_easy_count, leetcode_medium_count, leetcode_hard_count
│   ├── leetcode_acceptance_rate, leetcode_contribution_score
│   ├── github_repo_count, github_commit_frequency, github_star_count
│   ├── project_count, project_complexity_score
│   ├── cgpa, backlogs, year
│   ├── certification_count, hackathon_count
│   └── ... (50+ engineered features)
│
└── Categorical Features:
    ├── primary_languages (Python, JavaScript, Java)
    ├── project_domains (ML, Web, Mobile)
    └── skill_tags (extracted from GitHub repos)

ML MODELS:
├── Skill Gap Classifier (XGBoost)
│   └── Trained on 10,000+ placement profiles
│       Input: Feature vector (50+ features)
│       Output: Skill scores (0-100) for 8 dimensions
│
├── Company Fit Score (Neural Network)
│   └── Trained on company-specific placement data
│       Input: Skill scores + Company requirements
│       Output: Fit percentage (0-100) + Confidence interval
│
└── Time Estimator (Regression Model)
    └── Predicts weeks needed to bridge skill gaps
        Input: Current skill scores + Target skill scores + Learning pace
        Output: Estimated weeks + Confidence bounds

OUTPUT:
├── Skill Radar: DSA(78%), SD(45%), Web(85%), DB(60%), OS(70%), CN(65%), OOP(80%), Soft(75%)
├── Weak Areas: System Design, Dynamic Programming, Graphs
├── Company Fit: 62% Google-ready (need 80%+) with 95% CI [58%, 66%]
├── Recommended Focus: "Focus on DP Hard problems & System Design fundamentals"
├── Time Estimate: ~14 weeks (12-16 weeks with 90% confidence)
└── Weekly Plan: Custom 14-week roadmap generated
```

#### Implementation Code Structure

```python
# services/ai/agent1_skill_assessor.py

from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
import xgboost as xgb
import numpy as np

class SkillAssessorAgent:
    def __init__(self):
        self.skill_classifier = self._load_model('skill_gap_classifier.pkl')
        self.company_fit_model = self._load_model('company_fit_nn.pkl')
        self.time_estimator = self._load_model('time_estimator.pkl')
    
    def assess(self, student_profile: dict) -> dict:
        # Feature extraction
        features = self._extract_features(student_profile)
        
        # Skill scoring
        skill_scores = self.skill_classifier.predict_proba(features)
        
        # Company fit
        fit_score = self.company_fit_model.predict(
            np.concatenate([skill_scores, company_requirements])
        )
        
        # Time estimation
        time_estimate = self.time_estimator.predict(
            [skill_scores, target_skills, learning_pace]
        )
        
        return {
            'skill_radar': skill_scores,
            'weak_areas': self._identify_weak_areas(skill_scores),
            'company_fit': fit_score,
            'time_estimate': time_estimate,
            'recommendations': self._generate_recommendations(skill_scores)
        }
```

---

### Agent 2: Career Path Optimizer 🛤️
**Purpose:** "WHAT should you learn and in WHAT ORDER?"

#### Core Functionality
- Takes Agent 1's skill assessment
- Cross-references with student's dream company requirements
- Generates **personalized, ordered learning path**
- Dynamically adjusts as student makes progress
- Considers: available time/week, learning style, current semester
- Optimizes for maximum skill gain per hour invested

#### Algorithm: Dependency Graph + Priority Scoring

```
INPUT:
├── Agent 1's Skill Assessment
├── Target: Google SDE-1 in 6 months
├── Available: 15 hours/week
├── Current: 3rd year CSE, Semester 6
├── Learning Style: Visual learner, prefers projects
└── Current Date: 2024-01-15

ALGORITHM:

1. DEPENDENCY GRAPH CONSTRUCTION
   Build skill prerequisite tree:
   - "System Design requires DSA + Database knowledge"
   - "Advanced DSA requires Arrays + Trees mastery"
   - "Graph Algorithms require Trees + Dynamic Programming"
   
   Graph Representation:
   ```
   Arrays → Trees → Graphs
   Arrays → DP → Advanced DP
   Trees + DP → System Design Basics
   Database + System Design Basics → System Design Advanced
   ```

2. PRIORITY SCORING FUNCTION
   For each skill/topic, calculate priority score:
   
   Priority = (
       Gap_Size × 0.3 +           // How much you lack
       Company_Importance × 0.4 + // Google cares about System Design: HIGH
       Time_Urgency × 0.2 +       // 6 months = ~24 weeks remaining
       Dependency_Readiness × 0.1 // Can you learn this now?
   )
   
   Example:
   - System Design: Gap=55%, Company=HIGH, Urgency=HIGH, Deps=READY
     → Priority = 0.55×0.3 + 0.9×0.4 + 0.8×0.2 + 1.0×0.1 = 0.785
   
   - Advanced ML: Gap=70%, Company=LOW, Urgency=LOW, Deps=NOT_READY
     → Priority = 0.70×0.3 + 0.1×0.4 + 0.2×0.2 + 0.0×0.1 = 0.29

3. SCHEDULE GENERATION (Knapsack-like Optimization)
   Goal: Maximize skill gain within time constraints
   
   Week-by-week allocation:
   Week 1-4: DP Hard problems (6h/week) + Graphs (4h/week) + System Design Intro (5h/week)
   Week 5-8: System Design Deep Dive (8h/week) + Advanced DSA (4h/week) + Projects (3h/week)
   Week 9-12: Mock Interviews (5h/week) + Behavioral Prep (3h/week) + Resume Polish (2h/week) + Final Prep (5h/week)
   ...
   
   Constraints:
   - Total hours/week ≤ Available hours
   - Prerequisites must be completed before advanced topics
   - Balance theory (videos/articles) with practice (problems/projects)
   - Account for exam periods (reduce load)

4. RESOURCE MATCHING
   For each topic, recommend specific:
   - YouTube videos (matched to learning style: visual)
   - Problems (from CompanyWiseKit data - filtered by priority)
   - Projects (hands-on practice, increasing complexity)
   - Articles/Books (for deep understanding)
   
   Example for "System Design":
   - Video: "Gaurav Sen - System Design Basics" (visual, beginner-friendly)
   - Problems: "Design Twitter", "Design URL Shortener" (from Google's problem set)
   - Project: "Build a distributed cache system"
   - Article: "System Design Primer" (GitHub)

OUTPUT:
├── 24-Week Personalized Roadmap
│   ├── Week 1: [3 DP Hard, 2 Graph Medium, System Design Intro Video]
│   ├── Week 2: [4 DP Hard, 3 Graph Medium, Design Twitter Problem]
│   └── ...
├── Daily/Weekly task breakdown with time estimates
├── Curated resources for each topic (videos, problems, projects)
├── Milestone checkpoints with difficulty curves
├── Progress tracking: "You'll be 82% Google-ready by Week 20"
└── Adaptive adjustments: "You're ahead on DP, let's add more System Design"
```

#### Implementation Code Structure

```python
# services/ai/agent2_career_optimizer.py

import networkx as nx
from scipy.optimize import linprog

class CareerPathOptimizerAgent:
    def __init__(self):
        self.dependency_graph = self._build_dependency_graph()
        self.company_requirements = self._load_company_requirements()
    
    def optimize_path(self, skill_assessment: dict, constraints: dict) -> dict:
        # Build priority scores
        priorities = self._calculate_priorities(
            skill_assessment, constraints
        )
        
        # Generate schedule using optimization
        schedule = self._generate_schedule(
            priorities, constraints, self.dependency_graph
        )
        
        # Match resources
        resources = self._match_resources(schedule, constraints['learning_style'])
        
        return {
            'roadmap': schedule,
            'resources': resources,
            'milestones': self._define_milestones(schedule),
            'predictions': self._predict_readiness(schedule)
        }
```

---

### Agent 3: Interview Co-Pilot 🎤
**Purpose:** "PRACTICE like you're already there"

#### Core Functionality
- **AI Mock Interviewer:** Simulates real company interviews
- **Resume Analyzer:** NLP-based resume scoring and improvement
- **Behavioral Q&A:** Generates STAR-method responses from student's experience
- **Real-time Feedback:** Analyzes code quality, communication, problem-solving approach
- **Interview Performance Analytics:** Tracks improvement over time

#### Mock Interview Flow

```
MOCK INTERVIEW FLOW:

1. STUDENT SELECTS INTERVIEW TYPE
   - Company: Google
   - Role: SDE-1
   - Round: Technical (Coding + System Design)
   - Difficulty: Medium-Hard

2. AI LOADS INTERVIEW FORMAT
   From company data:
   - Round 1: Phone Screen (DSA - 45 min)
   - Round 2: Coding x2 (DSA + Algorithms - 60 min)
   - Round 3: System Design (Distributed Systems - 45 min)
   - Round 4: Behavioral + Culture Fit (30 min)

3. QUESTION GENERATION
   AI generates questions based on:
   - Company's most-asked problems (from CompanyWiseKit data)
   - Student's weak areas (from Agent 1)
   - Difficulty appropriate to their level
   - Recent trends (updated monthly)
   
   Example:
   "Given your profile shows weakness in Graphs, here's a Graph problem
   Google frequently asks: 'Find the shortest path in a weighted graph'"

4. STUDENT WRITES CODE
   - Embedded code editor (Monaco Editor)
   - Real-time syntax highlighting
   - Test cases visible/hidden toggle
   - Time tracking

5. AI EVALUATION (Multi-faceted)
   
   a) CORRECTNESS
      - Run test cases (hidden from student)
      - Edge case detection
      - Output: Pass/Fail + Test case results
   
   b) TIME/SPACE COMPLEXITY
      - Static analysis of code
      - Compare against optimal solution
      - Output: "O(n²) time, O(1) space. Optimal is O(n log n)"
   
   c) CODE QUALITY
      - Variable naming clarity
      - Code structure and organization
      - Best practices adherence
      - Output: Score 1-10 with specific feedback
   
   d) COMMUNICATION (if voice mode enabled)
      - Speech-to-text transcription
      - Clarity of explanation
      - Thought process visibility
      - Output: "You explained well but could improve on edge cases"
   
   e) PROBLEM-SOLVING APPROACH
      - Did they ask clarifying questions?
      - Did they consider edge cases upfront?
      - Did they optimize iteratively?
      - Output: "Good: Asked about constraints. Improve: Consider edge cases earlier"

6. FEEDBACK GENERATION
   Comprehensive feedback report:
   - Overall Score: 7.5/10
   - Strengths: Clear code structure, good variable naming
   - Weaknesses: Missed edge case (empty input), could optimize further
   - Comparison: "Top 25% of Google candidates at your level"
   - Improvement Suggestions: "Practice more edge case thinking"

7. BEHAVIORAL INTERVIEW MODULE
   - STAR method questions based on student's projects/experience
   - AI evaluates: Situation clarity, Action specificity, Result quantification
   - Generates improved responses
   - Example: "Tell me about a time you solved a difficult problem"
```

#### Resume Analysis Pipeline

```
RESUME ANALYSIS:

1. UPLOAD & EXTRACTION
   - Student uploads PDF resume
   - OCR + PDF parsing → Extract text
   - Structure detection (sections, bullet points)

2. NLP PIPELINE
   
   a) ENTITY EXTRACTION
      - Skills mentioned (Python, React, AWS, etc.)
      - Experience duration (2 years, 6 months)
      - Education details (CGPA, degree, university)
      - Projects (titles, descriptions)
      - Certifications
   
   b) QUALITY ANALYSIS
      - Action verbs usage (Built, Developed, Optimized)
      - Quantifiable achievements ("Improved performance by 40%")
      - Keyword density (ATS compatibility)
      - Formatting consistency
   
   c) GAP ANALYSIS
      - Compare against target company requirements
      - Missing skills identification
      - Underrepresented strengths

3. SCORING
   - ATS Score: 8.5/10 (good keyword usage)
   - Content Score: 7/10 (needs more metrics)
   - Format Score: 9/10 (clean, professional)
   - Company Fit: 6.5/10 (missing System Design mention)

4. IMPROVEMENT SUGGESTIONS
   - Specific: "Add metrics to your project descriptions"
   - Actionable: "Your resume doesn't mention System Design — add it under Skills"
   - Company-specific: "For Google, emphasize distributed systems experience"
   - Examples: "Change 'Built a web app' to 'Built a web app serving 10K+ users'"
```

#### Implementation Code Structure

```python
# services/ai/agent3_interview_copilot.py

from transformers import pipeline
import openai  # or google.generativeai for Gemini

class InterviewCoPilotAgent:
    def __init__(self):
        self.code_evaluator = self._load_code_model()
        self.resume_analyzer = pipeline("ner", model="bert-base-uncased")
        self.llm_client = openai.OpenAI()  # or Gemini
    
    def conduct_mock_interview(self, interview_config: dict) -> dict:
        # Generate questions
        questions = self._generate_questions(interview_config)
        
        # Conduct interview (interactive)
        responses = []
        for question in questions:
            student_response = self._get_student_input(question)
            evaluation = self._evaluate_response(question, student_response)
            responses.append(evaluation)
        
        # Generate feedback
        feedback = self._generate_feedback(responses)
        return feedback
    
    def analyze_resume(self, resume_pdf: bytes) -> dict:
        # Extract text
        text = self._extract_text_from_pdf(resume_pdf)
        
        # Analyze
        entities = self.resume_analyzer(text)
        scores = self._calculate_scores(text, entities)
        improvements = self._suggest_improvements(text, scores)
        
        return {
            'ats_score': scores['ats'],
            'content_score': scores['content'],
            'company_fit': scores['fit'],
            'improvements': improvements
        }
```

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 19.2+ with TypeScript
- **Build Tool:** Vite 7+
- **UI Library:** Radix UI + Tailwind CSS 4+
- **State Management:** React Context API + localStorage (consider Zustand for complex state)
- **Charts:** Recharts 2.15+
- **Code Editor:** Monaco Editor (for mock interviews)
- **WebSocket:** Socket.io-client (for real-time AI chat)

### Backend
- **API Server:** Node.js 20+ with Express.js 4.21+
- **AI/ML Service:** Python 3.11+ (separate microservice)
- **API Communication:** REST API + WebSocket + GraphQL (optional, for complex queries)
- **Authentication:** JWT + OAuth2 (for external integrations)

### AI/ML Stack
- **ML Framework:** scikit-learn 1.3+, XGBoost 2.0+
- **Deep Learning:** PyTorch 2.0+ (for neural networks)
- **NLP:** Transformers (Hugging Face) 4.35+, spaCy 3.7+
- **LLM Integration:** 
  - Google Gemini Pro API (primary)
  - OpenAI GPT-4 API (fallback)
- **Vector Database:** Pinecone (for semantic search) or ChromaDB (open-source alternative)
- **MLOps:** MLflow (model versioning, tracking)

### Data Storage
- **Primary Database:** PostgreSQL 15+ (user data, profiles, applications)
- **Cache:** Redis 7+ (sessions, ML predictions cache)
- **Vector DB:** Pinecone / ChromaDB (semantic search, embeddings)
- **File Storage:** AWS S3 / Cloudflare R2 (resumes, documents)

### External Integrations
- **Coding Platforms:**
  - LeetCode API (unofficial scraper or GraphQL)
  - GitHub API v4 (GraphQL)
  - HackerRank API
  - Codeforces API
  - GeeksforGeeks (web scraping)
- **Professional Networks:** LinkedIn API
- **Job Boards:** Indeed API, Glassdoor API (if available)

### Infrastructure
- **Hosting:** Vercel (frontend) + Railway / Render / AWS (backend)
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (error tracking), LogRocket (session replay)
- **Analytics:** PostHog / Mixpanel (user analytics)

### Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm 10+
- **Linting:** ESLint + Prettier
- **Testing:** Vitest (unit), Playwright (E2E)
- **API Documentation:** Swagger/OpenAPI

---

## 📊 Data Architecture

### Data Flow Diagram

```
External Sources → Data Ingestion → Processing → Storage → ML Pipeline → API
     │                │              │           │           │          │
     │                │              │           │           │          │
LeetCode API ────→ Scraper ────→ Cleaner ──→ PostgreSQL ──→ Features ──→ Models
GitHub API ──────→ Fetcher ────→ Parser ────→ PostgreSQL ──→ Features ──→ Models
User Input ──────→ Validator ──→ Normalizer → PostgreSQL ──→ Features ──→ Models
     │                │              │           │           │          │
     │                │              │           │           │          │
     └────────────────┴──────────────┴───────────┴───────────┴──────────┘
                              Real-time Sync (WebSocket)
```

### Data Collection Strategy

#### Phase 1: Manual Collection (Weeks 1-4)
- Collect 1000+ student profiles (anonymized)
- Gather placement outcomes (placed company, role, salary)
- Build initial training dataset

#### Phase 2: Automated Collection (Weeks 5-8)
- Integrate LeetCode/GitHub APIs
- Daily sync of student progress
- Weekly batch processing for model retraining

#### Phase 3: Continuous Learning (Ongoing)
- Real-time data ingestion
- Feedback loops from interview outcomes
- A/B testing for model improvements

### Feature Engineering Pipeline

```python
# services/ml/feature_engineering.py

class FeatureEngineer:
    def extract_features(self, student_profile: dict) -> np.ndarray:
        features = []
        
        # LeetCode features
        features.extend([
            student_profile['leetcode']['easy_solved'],
            student_profile['leetcode']['medium_solved'],
            student_profile['leetcode']['hard_solved'],
            student_profile['leetcode']['acceptance_rate'],
            student_profile['leetcode']['contribution_score'],
            # ... more LeetCode features
        ])
        
        # GitHub features
        features.extend([
            student_profile['github']['repo_count'],
            student_profile['github']['commit_frequency'],
            student_profile['github']['star_count'],
            student_profile['github']['language_distribution'],
            # ... more GitHub features
        ])
        
        # Academic features
        features.extend([
            student_profile['academic']['cgpa'],
            student_profile['academic']['backlogs'],
            student_profile['academic']['year'],
            # ... more academic features
        ])
        
        # Derived features
        features.extend([
            self._calculate_problem_solving_rate(student_profile),
            self._calculate_consistency_score(student_profile),
            self._calculate_skill_diversity(student_profile),
            # ... more derived features
        ])
        
        return np.array(features)
```

---

## 🧮 ML Models & Algorithms

### Model 1: Skill Gap Classifier

**Type:** Multi-class Classification (XGBoost)

**Input:** 50+ features (LeetCode stats, GitHub activity, academic data, projects)

**Output:** Skill scores (0-100) for 8 dimensions:
- DSA (Data Structures & Algorithms)
- System Design
- Web Development
- Database
- Operating Systems
- Computer Networks
- Object-Oriented Programming
- Soft Skills

**Training Data:** 10,000+ student profiles with verified skill assessments

**Performance Target:** 
- Accuracy: >85%
- F1-Score: >0.80
- Precision per skill: >0.75

**Retraining Schedule:** Monthly (as new data accumulates)

---

### Model 2: Placement Predictor

**Type:** Binary Classification + Probability Estimation (Neural Network)

**Input:** Skill scores + Company requirements + Academic profile

**Output:** 
- Placement probability (0-1)
- Confidence interval (95% CI)
- Time-to-placement estimate (weeks)

**Architecture:**
```
Input Layer (60 features)
  ↓
Hidden Layer 1 (128 neurons, ReLU)
  ↓
Dropout (0.3)
  ↓
Hidden Layer 2 (64 neurons, ReLU)
  ↓
Dropout (0.3)
  ↓
Output Layer (1 neuron, Sigmoid)
```

**Training Data:** Historical placement data (5,000+ placements)

**Performance Target:**
- AUC-ROC: >0.85
- Precision: >0.80
- Recall: >0.75

---

### Model 3: Recommendation Engine

**Type:** Collaborative Filtering + Content-Based Filtering (Hybrid)

**Algorithm:** Matrix Factorization (SVD) + Cosine Similarity

**Input:** 
- Student-solved problems matrix
- Problem features (difficulty, topic, company)
- Student preferences

**Output:** Top-K problem recommendations with explanations

**Performance Target:**
- Precision@10: >0.60
- Recall@10: >0.50
- NDCG@10: >0.70

---

### Model 4: Learning Pace Estimator

**Type:** Time Series Regression (LSTM)

**Input:** Historical problem-solving data (time series)

**Output:** 
- Problems/week prediction
- Skill improvement rate
- Time needed to reach target skill level

**Architecture:**
```
LSTM Layer 1 (64 units)
  ↓
LSTM Layer 2 (32 units)
  ↓
Dense Layer (16 units)
  ↓
Output Layer (1 unit)
```

---

### Model 5: Resume Analyzer (NLP)

**Type:** Named Entity Recognition + Classification (BERT-based)

**Model:** `bert-base-uncased` fine-tuned on resume data

**Tasks:**
1. Extract entities (skills, experience, education)
2. Score resume quality (ATS compatibility, content quality)
3. Generate improvement suggestions

**Performance Target:**
- Entity Extraction F1: >0.85
- ATS Score Correlation: >0.80 (with human evaluators)

---

### Model Training Pipeline

```python
# services/ml/training_pipeline.py

class MLTrainingPipeline:
    def train_all_models(self):
        # 1. Data loading and preprocessing
        data = self._load_training_data()
        X_train, X_test, y_train, y_test = self._preprocess(data)
        
        # 2. Train each model
        models = {
            'skill_classifier': SkillGapClassifier(),
            'placement_predictor': PlacementPredictor(),
            'recommendation_engine': RecommendationEngine(),
            'pace_estimator': LearningPaceEstimator(),
            'resume_analyzer': ResumeAnalyzer()
        }
        
        results = {}
        for name, model in models.items():
            print(f"Training {name}...")
            model.train(X_train, y_train[name])
            metrics = model.evaluate(X_test, y_test[name])
            results[name] = metrics
            
            # Save model
            model.save(f'models/{name}_{datetime.now().isoformat()}.pkl')
        
        # 3. Log metrics to MLflow
        self._log_to_mlflow(results)
        
        # 4. Compare with previous models
        if self._is_improvement(results):
            self._deploy_new_models(models)
        else:
            print("New models don't improve performance. Keeping current models.")
```

---

## 🔌 API Specifications

### REST API Endpoints

#### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

#### AI Agent Endpoints

**Agent 1: Skill Assessment**
```
POST /api/ai/assess
Request Body:
{
  "student_id": "string",
  "leetcode_username": "string (optional)",
  "github_username": "string (optional)",
  "force_refresh": "boolean (default: false)"
}

Response:
{
  "skill_radar": {
    "dsa": 78,
    "system_design": 45,
    "web_dev": 85,
    ...
  },
  "weak_areas": ["system_design", "dynamic_programming"],
  "company_fit": {
    "google": 62,
    "amazon": 75,
    ...
  },
  "time_estimate": {
    "weeks": 14,
    "confidence_interval": [12, 16]
  },
  "recommendations": ["Focus on DP Hard problems", ...]
}
```

**Agent 2: Career Path Optimization**
```
POST /api/ai/roadmap
Request Body:
{
  "student_id": "string",
  "target_company": "string",
  "target_role": "string",
  "deadline_weeks": "number",
  "hours_per_week": "number",
  "learning_style": "visual | auditory | kinesthetic"
}

Response:
{
  "roadmap": [
    {
      "week": 1,
      "topics": ["dynamic_programming", "graphs"],
      "problems": [
        {
          "title": "Two Sum",
          "difficulty": "medium",
          "priority": "must-do",
          "reason": "Covers your weak area in arrays",
          "estimated_time": "2 hours"
        },
        ...
      ],
      "resources": {
        "videos": ["url1", "url2"],
        "articles": ["url1"],
        "projects": ["url1"]
      },
      "milestone": "Complete 5 DP problems"
    },
    ...
  ],
  "predictions": {
    "week_10_readiness": 65,
    "week_20_readiness": 82,
    "final_readiness": 88
  }
}
```

**Agent 3: Interview Co-Pilot**
```
POST /api/ai/mock-interview/start
Request Body:
{
  "student_id": "string",
  "company": "string",
  "role": "string",
  "round_type": "technical | behavioral | system_design"
}

Response:
{
  "session_id": "string",
  "questions": [
    {
      "id": "string",
      "type": "coding | behavioral | system_design",
      "question": "string",
      "hints_available": true,
      "time_limit": 45
    },
    ...
  ]
}

POST /api/ai/mock-interview/submit
Request Body:
{
  "session_id": "string",
  "question_id": "string",
  "code": "string (optional)",
  "explanation": "string (optional)",
  "audio_transcript": "string (optional)"
}

Response:
{
  "evaluation": {
    "correctness": {
      "passed": true,
      "test_cases_passed": 8,
      "test_cases_total": 10
    },
    "complexity": {
      "time": "O(n²)",
      "space": "O(1)",
      "optimal_time": "O(n log n)",
      "optimal_space": "O(1)"
    },
    "code_quality": {
      "score": 8.5,
      "feedback": "Good variable naming, could improve structure"
    },
    "communication": {
      "score": 7.0,
      "feedback": "Clear explanation, consider edge cases earlier"
    },
    "overall_score": 7.5,
    "percentile": 75
  },
  "improvements": ["Consider edge cases upfront", ...]
}

POST /api/ai/resume/analyze
Request Body:
{
  "student_id": "string",
  "resume_file": "file (PDF)",
  "target_company": "string (optional)",
  "target_role": "string (optional)"
}

Response:
{
  "scores": {
    "ats": 8.5,
    "content": 7.0,
    "format": 9.0,
    "company_fit": 6.5
  },
  "entities": {
    "skills": ["Python", "React", "AWS", ...],
    "experience_years": 2,
    "projects": [...]
  },
  "improvements": [
    {
      "type": "missing_skill",
      "skill": "System Design",
      "suggestion": "Add System Design under Skills section"
    },
    {
      "type": "add_metrics",
      "section": "projects",
      "suggestion": "Add metrics: 'Built web app serving 10K+ users'"
    },
    ...
  ]
}
```

#### General Endpoints
```
GET /api/students/:id/profile
PUT /api/students/:id/profile
GET /api/companies
GET /api/problems?company=google&difficulty=medium
POST /api/problems/:id/solve
GET /api/students/:id/progress
```

### WebSocket Events

```typescript
// Real-time AI Chat
socket.on('ai_message', (data) => {
  // AI agent response
});

socket.emit('user_message', {
  message: "Which problems should I solve this week?",
  context: { student_id, current_page }
});

// Real-time progress updates
socket.on('progress_update', (data) => {
  // Skill scores updated, new recommendations available
});
```

---

## 🗄️ Database Schema Extensions

### New Tables for AI/ML

```sql
-- Skill Assessments (from Agent 1)
CREATE TABLE skill_assessments (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  skill_scores JSONB NOT NULL, -- {dsa: 78, system_design: 45, ...}
  weak_areas TEXT[],
  company_fit_scores JSONB, -- {google: 62, amazon: 75, ...}
  time_estimate_weeks INT,
  confidence_interval INT[] -- [12, 16]
);

-- Learning Roadmaps (from Agent 2)
CREATE TABLE learning_roadmaps (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  target_company VARCHAR(100),
  target_role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  roadmap_data JSONB NOT NULL, -- Full roadmap structure
  current_week INT DEFAULT 1,
  completion_percentage DECIMAL(5,2) DEFAULT 0
);

-- Problem Recommendations
CREATE TABLE problem_recommendations (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  problem_id VARCHAR(100), -- Reference to problem in your data
  recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  priority_score DECIMAL(5,2),
  reason TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'solved', 'skipped')),
  solved_at TIMESTAMP
);

-- Mock Interview Sessions
CREATE TABLE mock_interview_sessions (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  company VARCHAR(100),
  role VARCHAR(100),
  round_type VARCHAR(50),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  overall_score DECIMAL(5,2),
  evaluation_data JSONB -- Full evaluation results
);

-- Resume Analysis History
CREATE TABLE resume_analyses (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resume_url TEXT,
  scores JSONB, -- {ats: 8.5, content: 7.0, ...}
  improvements JSONB, -- Array of improvement suggestions
  target_company VARCHAR(100),
  target_role VARCHAR(100)
);

-- External Profile Sync
CREATE TABLE external_profiles (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  platform VARCHAR(50) CHECK (platform IN ('leetcode', 'github', 'hackerrank', 'codeforces')),
  username VARCHAR(100),
  last_synced_at TIMESTAMP,
  sync_data JSONB, -- Platform-specific data
  UNIQUE(student_id, platform)
);

-- ML Model Versions (for tracking)
CREATE TABLE ml_model_versions (
  id BIGSERIAL PRIMARY KEY,
  model_name VARCHAR(100),
  version VARCHAR(50),
  deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  performance_metrics JSONB,
  is_active BOOLEAN DEFAULT TRUE
);

-- AI Chat History
CREATE TABLE ai_chat_history (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  agent_used VARCHAR(50), -- 'agent1', 'agent2', 'agent3', 'general'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  context JSONB -- Additional context for the conversation
);

-- Create indexes for performance
CREATE INDEX idx_skill_assessments_student ON skill_assessments(student_id, assessed_at DESC);
CREATE INDEX idx_roadmaps_student ON learning_roadmaps(student_id, created_at DESC);
CREATE INDEX idx_recommendations_student ON problem_recommendations(student_id, status);
CREATE INDEX idx_interviews_student ON mock_interview_sessions(student_id, completed_at DESC);
```

---

## 🗺️ Implementation Roadmap

### Phase 0: Foundation & Setup (Weeks 1-2)
**Goal:** Set up development environment and basic infrastructure

**Tasks:**
- [ ] Set up Python ML service (separate from Node.js backend)
- [ ] Configure PostgreSQL database with new AI tables
- [ ] Set up Redis for caching
- [ ] Configure environment variables and secrets management
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Create API documentation structure (Swagger/OpenAPI)

**Deliverables:**
- ML service running locally
- Database migrations applied
- Basic API endpoints responding

---

### Phase 1: Smart Defaults (Client-Side AI) (Weeks 3-5)
**Goal:** Implement client-side personalization with zero backend changes

**Tasks:**

#### Week 3: Personalization Engine
- [ ] Create `StudentProfile` interface and localStorage management
- [ ] Implement problem-solving tracking (mark problems as solved)
- [ ] Build skill radar calculation from solved problems
- [ ] Create weak area detection algorithm
- [ ] Implement basic recommendation scoring

#### Week 4: Enhanced UI Components
- [ ] Add "AI Insights" cards to StudentDashboard
- [ ] Implement smart problem ordering in CompanyWiseKit
- [ ] Create progress prediction widget ("FAANG-ready in X weeks")
- [ ] Add daily focus recommendations
- [ ] Build streak tracking system

#### Week 5: Testing & Polish
- [ ] Unit tests for personalization algorithms
- [ ] E2E tests for new UI components
- [ ] Performance optimization (localStorage efficiency)
- [ ] User feedback collection

**Deliverables:**
- Working client-side personalization
- Enhanced dashboard with AI insights
- Smart problem recommendations

**Success Metrics:**
- 80% of students see personalized recommendations
- Average engagement time increases by 30%

---

### Phase 2: LLM Integration (Weeks 6-9)
**Goal:** Add AI chat co-pilot and resume analysis using Gemini API

**Tasks:**

#### Week 6: AI Chat Sidebar
- [ ] Design and implement chat UI component
- [ ] Integrate Gemini Pro API
- [ ] Create system prompts with student context
- [ ] Implement conversation history management
- [ ] Add typing indicators and loading states

#### Week 7: Resume Analyzer
- [ ] Set up PDF parsing (pdf-parse or similar)
- [ ] Implement text extraction and structure detection
- [ ] Create resume analysis prompt for Gemini
- [ ] Build improvement suggestion generator
- [ ] Add ATS scoring logic

#### Week 8: Mock Interview Generator
- [ ] Create interview question generator using Gemini
- [ ] Build code editor component (Monaco Editor)
- [ ] Implement basic code evaluation (test cases)
- [ ] Create feedback generation system
- [ ] Add interview session management

#### Week 9: Integration & Testing
- [ ] Integrate all LLM features into main app
- [ ] Add error handling and fallbacks
- [ ] Implement rate limiting for API calls
- [ ] Performance testing and optimization
- [ ] User acceptance testing

**Deliverables:**
- Working AI chat co-pilot
- Resume analysis feature
- Basic mock interview system

**Success Metrics:**
- 60% of students use AI chat weekly
- Resume analysis accuracy >75% (validated by human reviewers)

---

### Phase 3: Backend ML Pipeline (Weeks 10-17)
**Goal:** Build full ML pipeline with trained models

**Tasks:**

#### Weeks 10-11: Data Collection & Preparation
- [ ] Collect 1000+ student profiles (anonymized, with consent)
- [ ] Integrate LeetCode API (scraper or GraphQL)
- [ ] Integrate GitHub API
- [ ] Build data cleaning and validation pipeline
- [ ] Create feature engineering service
- [ ] Set up data versioning (DVC or similar)

#### Weeks 12-13: Model Training
- [ ] Train Skill Gap Classifier (XGBoost)
- [ ] Train Placement Predictor (Neural Network)
- [ ] Train Recommendation Engine (Collaborative Filtering)
- [ ] Train Learning Pace Estimator (LSTM)
- [ ] Fine-tune Resume Analyzer (BERT)
- [ ] Evaluate model performance
- [ ] Set up MLflow for model tracking

#### Week 14: API Development
- [ ] Implement `/api/ai/assess` endpoint (Agent 1)
- [ ] Implement `/api/ai/roadmap` endpoint (Agent 2)
- [ ] Implement `/api/ai/mock-interview/*` endpoints (Agent 3)
- [ ] Implement `/api/ai/resume/analyze` endpoint
- [ ] Add caching layer (Redis) for predictions
- [ ] Implement batch processing for model retraining

#### Week 15: Frontend Integration
- [ ] Connect frontend to new ML APIs
- [ ] Replace client-side algorithms with server-side ML
- [ ] Add loading states and error handling
- [ ] Implement real-time updates (WebSocket)
- [ ] Add data visualization for ML predictions

#### Weeks 16-17: Testing & Optimization
- [ ] Load testing for ML endpoints
- [ ] Model performance monitoring
- [ ] A/B testing (client-side vs ML predictions)
- [ ] Optimize prediction latency (<500ms target)
- [ ] Documentation and API specs

**Deliverables:**
- Fully functional ML pipeline
- All three AI agents working
- Production-ready APIs

**Success Metrics:**
- ML prediction accuracy >85%
- API response time <500ms (p95)
- Model retraining pipeline automated

---

### Phase 4: Advanced Features (Weeks 18-22)
**Goal:** Add advanced AI features and optimizations

**Tasks:**

#### Week 18: External Platform Integration
- [ ] LeetCode API integration (auto-sync solved problems)
- [ ] GitHub API integration (analyze repos and commits)
- [ ] HackerRank API integration
- [ ] Codeforces API integration
- [ ] Automated daily/weekly sync jobs

#### Week 19: Advanced Mock Interviews
- [ ] Voice mode for mock interviews (speech-to-text)
- [ ] Real-time code evaluation (syntax checking, complexity analysis)
- [ ] Behavioral interview module with STAR method
- [ ] Interview performance analytics dashboard
- [ ] Comparison with other students (anonymized)

#### Week 20: Predictive Analytics Dashboard
- [ ] Placement probability visualization
- [ ] Skill improvement trajectory charts
- [ ] Readiness timeline predictions
- [ ] Comparison with successful candidates
- [ ] Personalized insights and recommendations

#### Week 21: Adaptive Learning
- [ ] Real-time roadmap adjustments based on progress
- [ ] Difficulty adaptation (if student struggling/easy)
- [ ] Learning style detection and adaptation
- [ ] Spaced repetition for weak areas
- [ ] Gamification elements (badges, achievements)

#### Week 22: Polish & Optimization
- [ ] Performance optimization (caching, query optimization)
- [ ] UI/UX improvements based on feedback
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Final testing and bug fixes

**Deliverables:**
- Complete AI-powered platform
- All external integrations working
- Advanced analytics and insights

---

### Phase 5: Production Deployment (Weeks 23-24)
**Goal:** Deploy to production and monitor

**Tasks:**

#### Week 23: Deployment
- [ ] Set up production infrastructure (AWS/Railway/Render)
- [ ] Configure production databases
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CI/CD for production
- [ ] Load testing and stress testing
- [ ] Security audit

#### Week 24: Launch & Monitor
- [ ] Gradual rollout (10% → 50% → 100% of users)
- [ ] Monitor error rates and performance
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Document runbooks and procedures

**Deliverables:**
- Production deployment
- Monitoring dashboards
- Documentation

---

## 🔗 Integration Strategy

### How AI Connects to Existing Pages

#### 1. StudentDashboard.tsx → AI-Powered Overview

**Current State:**
- Static charts with hardcoded data
- Generic progress indicators

**AI Enhancement:**
```typescript
// New component: AISkillRadar.tsx
const AISkillRadar = () => {
  const { data: assessment } = useQuery(['skill-assessment'], 
    () => api.ai.assess(studentId)
  );
  
  return (
    <RadarChart data={assessment.skill_radar}>
      {/* Dynamic radar chart */}
    </RadarChart>
  );
};

// New component: AIInsights.tsx
const AIInsights = () => {
  const { data: insights } = useQuery(['ai-insights'], 
    () => api.ai.getInsights(studentId)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your Google readiness: {insights.google_readiness}%</p>
        <p>Focus this week: {insights.weekly_focus}</p>
        <p>At your pace, you'll be ready in {insights.weeks_to_ready} weeks</p>
      </CardContent>
    </Card>
  );
};
```

**Changes:**
- Replace static charts with API-driven charts
- Add "AI Insights" section with personalized recommendations
- Show real-time progress updates via WebSocket

---

#### 2. CompanyWiseKit.tsx → Intelligent Problem Ordering

**Current State:**
- Shows all problems for a company
- Manual solving, no prioritization

**AI Enhancement:**
```typescript
// Enhanced problem list with AI ordering
const ProblemList = ({ company, problems }) => {
  const { data: recommendations } = useQuery(
    ['problem-recommendations', company],
    () => api.ai.getRecommendations(studentId, company)
  );
  
  // Sort problems by AI priority score
  const sortedProblems = problems.map(p => ({
    ...p,
    aiScore: recommendations.find(r => r.problem_id === p.id)?.priority_score || 0,
    reason: recommendations.find(r => r.problem_id === p.id)?.reason
  })).sort((a, b) => b.aiScore - a.aiScore);
  
  return (
    <div>
      {sortedProblems.map(problem => (
        <ProblemCard 
          key={problem.id}
          problem={problem}
          badge={problem.aiScore > 0.8 ? "Must Do" : null}
          tooltip={problem.reason}
        />
      ))}
    </div>
  );
};
```

**Changes:**
- Problems automatically sorted by AI priority
- "Must Do" badges for high-priority problems
- Tooltips explaining why each problem is recommended
- Progress tracking updates AI recommendations in real-time

---

#### 3. careers.tsx → Dynamic Career Roadmaps

**Current State:**
- Static career paths with fixed match scores

**AI Enhancement:**
```typescript
const CareerCard = ({ career }) => {
  const { data: roadmap } = useQuery(
    ['career-roadmap', career.id],
    () => api.ai.getRoadmap(studentId, career.company, career.role)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{career.title}</CardTitle>
        <CardDescription>
          Match: {roadmap.company_fit}% | 
          Ready in: {roadmap.weeks_to_ready} weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RoadmapTimeline roadmap={roadmap.roadmap} />
        <Button onClick={() => navigate(`/roadmap/${career.id}`)}>
          View Full Roadmap
        </Button>
      </CardContent>
    </Card>
  );
};
```

**Changes:**
- Match scores calculated by Agent 1 for each student
- Roadmaps adapt based on student's current skills
- Time estimates adjust based on learning pace
- Skip completed topics automatically

---

#### 4. AssessmentHub.tsx → Smart Platform Recommendations

**Current State:**
- Lists all platforms equally

**AI Enhancement:**
```typescript
const PlatformCard = ({ platform }) => {
  const { data: recommendation } = useQuery(
    ['platform-recommendation', platform.id],
    () => api.ai.getPlatformRecommendation(studentId, platform.id)
  );
  
  return (
    <Card className={recommendation.priority === 'high' ? 'border-primary' : ''}>
      {recommendation.priority === 'high' && (
        <Badge>Recommended for You</Badge>
      )}
      <CardContent>
        <p>{recommendation.reason}</p>
        {/* Platform details */}
      </CardContent>
    </Card>
  );
};
```

**Changes:**
- Platforms sorted by relevance to student's goals
- "Recommended for You" badges
- Explanations for why each platform is recommended
- Difficulty-appropriate filtering

---

#### 5. NEW: AI Chat Sidebar → Agentic Co-Pilot

**New Component:**
```typescript
// components/AIChatSidebar.tsx
const AIChatSidebar = () => {
  const [messages, setMessages] = useState([]);
  const socket = useWebSocket();
  
  const sendMessage = (text) => {
    socket.emit('ai_chat', {
      message: text,
      student_id: studentId,
      context: getCurrentPageContext()
    });
  };
  
  socket.on('ai_response', (response) => {
    setMessages(prev => [...prev, response]);
  });
  
  return (
    <Sheet>
      <SheetContent side="right">
        <ChatInterface 
          messages={messages}
          onSend={sendMessage}
        />
      </SheetContent>
    </Sheet>
  );
};
```

**Features:**
- Floating chat button (always accessible)
- Context-aware responses (knows current page, student profile)
- Can answer questions about problems, roadmaps, readiness
- Can generate mock interview questions
- Can review code snippets

---

## 🧪 Testing Strategy

### Unit Tests

**Frontend (Vitest):**
```typescript
// tests/ai/personalization.test.ts
describe('Personalization Engine', () => {
  it('should calculate skill scores from solved problems', () => {
    const solved = ['Two Sum', 'Three Sum', 'Valid Parentheses'];
    const scores = calculateSkillScores(solved, problems);
    expect(scores.dsa).toBeGreaterThan(60);
  });
  
  it('should prioritize problems based on weak areas', () => {
    const weakAreas = ['graphs', 'dynamic_programming'];
    const recommendations = getRecommendations(weakAreas, companyProblems);
    expect(recommendations[0].topic).toBe('graphs');
  });
});
```

**Backend (Python pytest):**
```python
# tests/test_skill_assessor.py
def test_skill_assessment():
    student_profile = {
        'leetcode': {'easy': 50, 'medium': 30, 'hard': 5},
        'github': {'repos': 10, 'commits': 200}
    }
    assessment = skill_assessor.assess(student_profile)
    assert assessment['skill_radar']['dsa'] > 0
    assert len(assessment['weak_areas']) > 0
```

### Integration Tests

```typescript
// tests/integration/ai-api.test.ts
describe('AI API Integration', () => {
  it('should assess student skills end-to-end', async () => {
    const response = await api.post('/api/ai/assess', {
      student_id: 'test-student',
      leetcode_username: 'testuser'
    });
    expect(response.status).toBe(200);
    expect(response.data.skill_radar).toBeDefined();
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/ai-features.spec.ts
test('AI chat should provide helpful responses', async ({ page }) => {
  await page.goto('/student/dashboard');
  await page.click('[data-testid="ai-chat-button"]');
  await page.fill('[data-testid="chat-input"]', 'Which problems should I solve?');
  await page.click('[data-testid="send-button"]');
  
  await expect(page.locator('[data-testid="ai-response"]')).toBeVisible();
  const response = await page.textContent('[data-testid="ai-response"]');
  expect(response).toContain('problem');
});
```

### Performance Tests

```python
# tests/performance/test_ml_latency.py
def test_assessment_latency():
    import time
    start = time.time()
    assessment = skill_assessor.assess(sample_profile)
    latency = time.time() - start
    assert latency < 0.5  # 500ms target
```

---

## 🚀 Deployment Architecture

### Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                    │
│              Static Assets (React Build)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Frontend (Vercel)                          │
│  • React App (SSR/SSG)                                  │
│  • Edge Functions (API Routes)                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              API Gateway (Railway/Render)               │
│  • Express.js Server                                    │
│  • Rate Limiting                                        │
│  • Authentication                                       │
└───────┬───────────────────────────────┬──────────────────┘
        │                               │
┌───────┴────────┐          ┌──────────┴──────────┐
│   PostgreSQL   │          │   ML Service        │
│   (Railway)    │          │   (Python/FastAPI)  │
│                │          │   (Railway/Render)  │
└────────────────┘          └─────────────────────┘
        │                               │
        │                      ┌────────┴────────┐
        │                      │   Redis Cache   │
        │                      │   (Upstash)     │
        │                      └─────────────────┘
        │
┌───────┴────────┐
│   Vector DB    │
│   (Pinecone)   │
└────────────────┘
```

### Deployment Steps

1. **Frontend Deployment (Vercel)**
   ```bash
   # Build and deploy
   npm run build
   vercel deploy --prod
   ```

2. **Backend Deployment (Railway)**
   ```bash
   # Railway automatically deploys from GitHub
   # Configure environment variables in Railway dashboard
   ```

3. **ML Service Deployment**
   ```bash
   # Build Docker image
   docker build -t ml-service .
   # Deploy to Railway/Render
   ```

4. **Database Migrations**
   ```bash
   # Run migrations
   npm run migrate:prod
   ```

### Environment Variables

```bash
# Frontend (.env.production)
VITE_API_URL=https://api.nextgen-career.com
VITE_WS_URL=wss://api.nextgen-career.com
VITE_GEMINI_API_KEY=xxx

# Backend (.env.production)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=xxx
GEMINI_API_KEY=xxx
OPENAI_API_KEY=xxx

# ML Service (.env.production)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
MLFLOW_TRACKING_URI=http://mlflow:5000
MODEL_STORAGE_PATH=/models
```

---

## 📊 Monitoring & Observability

### Key Metrics to Monitor

1. **API Performance**
   - Response time (p50, p95, p99)
   - Error rate
   - Request rate

2. **ML Model Performance**
   - Prediction accuracy
   - Model latency
   - Cache hit rate

3. **User Engagement**
   - Daily active users
   - AI feature usage
   - Average session duration

4. **System Health**
   - Database connection pool usage
   - Redis memory usage
   - CPU/Memory usage

### Monitoring Tools

**Error Tracking:**
- Sentry (frontend + backend errors)

**Application Monitoring:**
- LogRocket (session replay, frontend)
- Datadog / New Relic (backend, ML service)

**Analytics:**
- PostHog (user analytics, feature flags)
- Custom dashboards (Grafana)

### Alerting Rules

```yaml
# alerts.yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 5%
    action: notify_slack
    
  - name: ml_latency_high
    condition: ml_p95_latency > 1000ms
    action: notify_team
    
  - name: database_connections_high
    condition: db_connections > 80%
    action: scale_up
```

---

## 🔒 Security & Compliance

### Security Measures

1. **Authentication & Authorization**
   - JWT tokens with short expiration
   - Refresh tokens stored in httpOnly cookies
   - Role-based access control (RBAC)

2. **API Security**
   - Rate limiting (100 req/min per user)
   - Input validation (Zod schemas)
   - SQL injection prevention (parameterized queries)
   - XSS prevention (React auto-escaping)

3. **Data Protection**
   - Encryption at rest (database)
   - Encryption in transit (HTTPS/TLS)
   - PII anonymization for ML training
   - GDPR/DPDP compliance

4. **ML Model Security**
   - Input sanitization
   - Output validation
   - Model versioning and rollback
   - Adversarial attack prevention

### Compliance Checklist

- [ ] GDPR compliance (EU users)
- [ ] DPDP Act compliance (India)
- [ ] Data retention policies
- [ ] User consent management
- [ ] Right to deletion
- [ ] Data portability
- [ ] Privacy policy updates

---

## 🔮 Future Enhancements

### Phase 6: Advanced AI Features (Months 7-9)

1. **Multi-Modal AI**
   - Voice-based mock interviews
   - Video analysis for interview practice
   - Screen recording analysis for coding sessions

2. **Collaborative Learning**
   - Study groups with AI matching
   - Peer code reviews with AI assistance
   - Group mock interviews

3. **Predictive Career Counseling**
   - Career path recommendations based on market trends
   - Salary prediction
   - Skill demand forecasting

### Phase 7: Enterprise Features (Months 10-12)

1. **College Dashboard**
   - Batch-level analytics
   - Placement prediction for entire batch
   - Resource allocation recommendations

2. **Recruiter Tools**
   - AI-powered candidate matching
   - Automated shortlisting
   - Interview question generation

3. **Advanced Analytics**
   - Industry trends analysis
   - Skill gap analysis at college level
   - Placement success rate predictions

### Phase 8: Mobile App (Months 13-15)

1. **Native Mobile Apps**
   - iOS and Android apps
   - Push notifications for daily goals
   - Offline problem solving

2. **Mobile-Specific Features**
   - Voice-based AI chat
   - Mobile code editor
   - Quick problem recommendations

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./api-docs.md)
- [Database Schema](./database_schema.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### External Resources
- [LeetCode API Documentation](https://leetcode.com/api/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [MLflow Documentation](https://www.mlflow.org/docs/latest/index.html)

---

## ✅ Quick Start Checklist

### For Developers

- [ ] Clone repository
- [ ] Install dependencies (`pnpm install`)
- [ ] Set up environment variables (`.env.local`)
- [ ] Run database migrations
- [ ] Start development servers (`pnpm dev`)
- [ ] Run tests (`pnpm test`)

### For ML Engineers

- [ ] Set up Python environment (`python -m venv venv`)
- [ ] Install ML dependencies (`pip install -r requirements.txt`)
- [ ] Download training data
- [ ] Train initial models (`python train.py`)
- [ ] Start ML service (`python app.py`)

---

## 🎯 Conclusion

This roadmap provides a complete, end-to-end plan for implementing AI/ML capabilities in the NextGen Campus Career Platform. The phased approach allows for incremental development, testing, and iteration, ensuring a robust and scalable AI system.

**Key Success Factors:**
1. Start with client-side AI for quick wins
2. Iterate based on user feedback
3. Focus on accuracy and user experience
4. Monitor and optimize continuously
5. Scale gradually as user base grows

**Next Steps:**
1. Review and approve this roadmap
2. Set up development environment (Phase 0)
3. Begin Phase 1 implementation
4. Schedule regular review meetings

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-15  
**Author:** NextGen Development Team  
**Status:** Ready for Implementation
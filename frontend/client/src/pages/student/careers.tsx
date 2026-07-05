import React, { useState, useEffect } from 'react';
import { studentApi } from '@/services/studentApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Rocket,
  TrendingUp,
  Code,
  Database,
  Smartphone,
  Brain,
  Shield,
  Palette,
  Package,
  TestTube,
  Blocks,
  Gamepad2,
  Star,
  CheckCircle,
  Lock,
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Zap,
  Award,
  Users,
  TrendingDown,
  Flame,
  Trophy,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Play,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Github,
  Globe,
  Building,
  Calendar,
  Filter,
  Search,
  X,
  RefreshCw,
  Settings,
  Info,
  AlertCircle,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  ThumbsUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  UserCheck,
  GraduationCap,
  Laptop,
  Coffee,
  Home,
  CloudRain
} from 'lucide-react';


interface Skill {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  estimatedWeeks: number;
  category: string;
}

interface CareerLevel {
  level: number;
  title: string;
  duration: string;
  skills: Skill[];
}

interface Project {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skillsUsed: string[];
  estimatedHours: number;
  status: 'completed' | 'in-progress' | 'not-started';
  description: string;
}

interface CareerPath {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  avgSalary: {
    fresher: string;
    junior: string;
    mid: string;
    senior: string;
  };
  jobOpenings: number;
  timeToJobReady: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  demandTrend: 'up' | 'down' | 'stable';
  remotePercentage: number;
  levels: CareerLevel[];
  projects: Project[];
  learningResources: LearningResource[];
  topCompanies: string[];
  relatedPaths: string[];
}

interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'documentation' | 'practice';
  platform: string;
  isFree: boolean;
  url: string;
  duration: string;
  rating: number;
}

interface SuccessStory {
  name: string;
  avatar: string;
  role: string;
  company: string;
  package: string;
  timeline: string;
  path: string;
  quote: string;
  skills: string[];
}

interface UserProfile {
  name: string;
  currentSkills: string[];
  interests: string[];
  preferredPath?: string;
  hoursPerWeek: number;
  targetRole: string;
  timeline: string;
}

const careerPaths: CareerPath[] = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    description: 'Build beautiful, responsive user interfaces and create amazing web experiences',
    avgSalary: {
      fresher: '₹3-6 LPA',
      junior: '₹6-12 LPA',
      mid: '₹12-20 LPA',
      senior: '₹20-40 LPA'
    },
    jobOpenings: 1247,
    timeToJobReady: '12-14 months',
    difficulty: 'Medium',
    demandTrend: 'up',
    remotePercentage: 65,
    levels: [
      {
        level: 1,
        title: 'Beginner',
        duration: '0-3 months',
        skills: [
          { id: 's1', name: 'HTML5', status: 'completed', progress: 100, estimatedWeeks: 2, category: 'Core' },
          { id: 's2', name: 'CSS3', status: 'completed', progress: 100, estimatedWeeks: 2, category: 'Core' },
          { id: 's3', name: 'JavaScript Basics', status: 'in-progress', progress: 60, estimatedWeeks: 4, category: 'Core' },
          { id: 's4', name: 'Git & GitHub', status: 'locked', estimatedWeeks: 1, category: 'Tools' },
          { id: 's5', name: 'Responsive Design', status: 'locked', estimatedWeeks: 2, category: 'Design' }
        ]
      },
      {
        level: 2,
        title: 'Intermediate',
        duration: '3-6 months',
        skills: [
          { id: 's6', name: 'JavaScript ES6+', status: 'locked', estimatedWeeks: 3, category: 'Core' },
          { id: 's7', name: 'React.js', status: 'locked', estimatedWeeks: 6, category: 'Framework' },
          { id: 's8', name: 'State Management (Redux)', status: 'locked', estimatedWeeks: 2, category: 'Framework' },
          { id: 's9', name: 'RESTful APIs', status: 'locked', estimatedWeeks: 2, category: 'Backend' },
          { id: 's10', name: 'Tailwind CSS', status: 'locked', estimatedWeeks: 1, category: 'Styling' }
        ]
      },
      {
        level: 3,
        title: 'Advanced',
        duration: '6-12 months',
        skills: [
          { id: 's11', name: 'Next.js', status: 'locked', estimatedWeeks: 4, category: 'Framework' },
          { id: 's12', name: 'TypeScript', status: 'locked', estimatedWeeks: 3, category: 'Language' },
          { id: 's13', name: 'Testing (Jest, RTL)', status: 'locked', estimatedWeeks: 2, category: 'Testing' },
          { id: 's14', name: 'Performance Optimization', status: 'locked', estimatedWeeks: 2, category: 'Optimization' },
          { id: 's15', name: 'Build Tools (Webpack, Vite)', status: 'locked', estimatedWeeks: 1, category: 'Tools' }
        ]
      },
      {
        level: 4,
        title: 'Expert',
        duration: '12-18 months',
        skills: [
          { id: 's16', name: 'Design Patterns', status: 'locked', estimatedWeeks: 3, category: 'Architecture' },
          { id: 's17', name: 'Micro Frontends', status: 'locked', estimatedWeeks: 2, category: 'Architecture' },
          { id: 's18', name: 'Advanced State Management', status: 'locked', estimatedWeeks: 2, category: 'Framework' },
          { id: 's19', name: 'CI/CD for Frontend', status: 'locked', estimatedWeeks: 1, category: 'DevOps' },
          { id: 's20', name: 'System Design', status: 'locked', estimatedWeeks: 4, category: 'Architecture' }
        ]
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Personal Portfolio Website',
        difficulty: 'beginner',
        skillsUsed: ['HTML5', 'CSS3', 'JavaScript Basics'],
        estimatedHours: 15,
        status: 'completed',
        description: 'Create a responsive portfolio showcasing your projects and skills'
      },
      {
        id: 'p2',
        title: 'Todo App with React',
        difficulty: 'intermediate',
        skillsUsed: ['React.js', 'JavaScript ES6+', 'CSS3'],
        estimatedHours: 20,
        status: 'in-progress',
        description: 'Build a full-featured todo application with CRUD operations'
      },
      {
        id: 'p3',
        title: 'E-commerce Product Dashboard',
        difficulty: 'advanced',
        skillsUsed: ['Next.js', 'TypeScript', 'Tailwind CSS', 'RESTful APIs'],
        estimatedHours: 40,
        status: 'not-started',
        description: 'Create a complete TPO dashboard for managing products'
      }
    ],
    learningResources: [
      {
        id: 'lr1',
        title: 'The Complete Web Developer Bootcamp',
        type: 'course',
        platform: 'Udemy',
        isFree: false,
        url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
        duration: '65 hours',
        rating: 4.7
      },
      {
        id: 'lr2',
        title: 'MDN Web Docs',
        type: 'documentation',
        platform: 'Mozilla',
        isFree: true,
        url: 'https://developer.mozilla.org/',
        duration: 'Self-paced',
        rating: 4.9
      },
      {
        id: 'lr3',
        title: 'freeCodeCamp Frontend',
        type: 'practice',
        platform: 'freeCodeCamp',
        isFree: true,
        url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
        duration: '300 hours',
        rating: 4.8
      }
    ],
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Airbnb'],
    relatedPaths: ['Full Stack Developer', 'UI/UX Designer', 'Mobile Developer']
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    description: 'Build robust server-side applications and APIs that power modern applications',
    avgSalary: {
      fresher: '₹4-7 LPA',
      junior: '₹7-14 LPA',
      mid: '₹14-24 LPA',
      senior: '₹24-45 LPA'
    },
    jobOpenings: 986,
    timeToJobReady: '10-12 months',
    difficulty: 'Medium',
    demandTrend: 'up',
    remotePercentage: 70,
    levels: [
      {
        level: 1,
        title: 'Beginner',
        duration: '0-3 months',
        skills: [
          { id: 'b1', name: 'Python/Node.js Basics', status: 'locked', estimatedWeeks: 4, category: 'Language' },
          { id: 'b2', name: 'SQL Fundamentals', status: 'locked', estimatedWeeks: 3, category: 'Database' },
          { id: 'b3', name: 'Git & GitHub', status: 'locked', estimatedWeeks: 1, category: 'Tools' },
          { id: 'b4', name: 'REST API Concepts', status: 'locked', estimatedWeeks: 2, category: 'API' },
          { id: 'b5', name: 'HTTP & Networking', status: 'locked', estimatedWeeks: 2, category: 'Networking' }
        ]
      },
      {
        level: 2,
        title: 'Intermediate',
        duration: '3-6 months',
        skills: [
          { id: 'b6', name: 'Express.js/FastAPI', status: 'locked', estimatedWeeks: 4, category: 'Framework' },
          { id: 'b7', name: 'Database Design', status: 'locked', estimatedWeeks: 3, category: 'Database' },
          { id: 'b8', name: 'Authentication & Authorization', status: 'locked', estimatedWeeks: 2, category: 'Security' },
          { id: 'b9', name: 'MongoDB/PostgreSQL', status: 'locked', estimatedWeeks: 3, category: 'Database' },
          { id: 'b10', name: 'API Development', status: 'locked', estimatedWeeks: 4, category: 'API' }
        ]
      },
      {
        level: 3,
        title: 'Advanced',
        duration: '6-10 months',
        skills: [
          { id: 'b11', name: 'Caching with Redis', status: 'locked', estimatedWeeks: 2, category: 'Performance' },
          { id: 'b12', name: 'Message Queues', status: 'locked', estimatedWeeks: 2, category: 'Systems' },
          { id: 'b13', name: 'Testing APIs', status: 'locked', estimatedWeeks: 2, category: 'Testing' },
          { id: 'b14', name: 'ORMs and Query Optimization', status: 'locked', estimatedWeeks: 3, category: 'Database' },
          { id: 'b15', name: 'Docker Basics', status: 'locked', estimatedWeeks: 2, category: 'DevOps' }
        ]
      },
      {
        level: 4,
        title: 'Production Ready',
        duration: '10-14 months',
        skills: [
          { id: 'b16', name: 'System Design Fundamentals', status: 'locked', estimatedWeeks: 4, category: 'Architecture' },
          { id: 'b17', name: 'Monitoring and Logging', status: 'locked', estimatedWeeks: 2, category: 'Operations' },
          { id: 'b18', name: 'Security Hardening', status: 'locked', estimatedWeeks: 2, category: 'Security' },
          { id: 'b19', name: 'CI/CD for Services', status: 'locked', estimatedWeeks: 2, category: 'DevOps' },
          { id: 'b20', name: 'Scalable Service Patterns', status: 'locked', estimatedWeeks: 3, category: 'Architecture' }
        ]
      }
    ],
    projects: [
      {
        id: 'bp1',
        title: 'REST API for Student Portal',
        difficulty: 'beginner',
        skillsUsed: ['Node.js Basics', 'Express.js/FastAPI', 'SQL Fundamentals'],
        estimatedHours: 18,
        status: 'not-started',
        description: 'Build CRUD endpoints for students, departments, and placement records.'
      },
      {
        id: 'bp2',
        title: 'Authentication Service',
        difficulty: 'intermediate',
        skillsUsed: ['Authentication & Authorization', 'MongoDB/PostgreSQL', 'API Development'],
        estimatedHours: 28,
        status: 'not-started',
        description: 'Create login, signup, forgot-password, and role-based access flows.'
      },
      {
        id: 'bp3',
        title: 'Scalable Job Queue API',
        difficulty: 'advanced',
        skillsUsed: ['Message Queues', 'Caching with Redis', 'Docker Basics'],
        estimatedHours: 40,
        status: 'not-started',
        description: 'Design a backend service that processes email and notification jobs asynchronously.'
      }
    ],
    learningResources: [
      {
        id: 'blr1',
        title: 'Node.js and Express From Scratch',
        type: 'course',
        platform: 'Udemy',
        isFree: false,
        url: 'https://nodejs.org/en/docs/guides',
        duration: '32 hours',
        rating: 4.7
      },
      {
        id: 'blr2',
        title: 'PostgreSQL Tutorial',
        type: 'documentation',
        platform: 'PostgreSQL Docs',
        isFree: true,
        url: 'https://www.postgresql.org/docs/',
        duration: 'Self-paced',
        rating: 4.8
      },
      {
        id: 'blr3',
        title: 'Backend Interview Practice',
        type: 'practice',
        platform: 'freeCodeCamp',
        isFree: true,
        url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
        duration: '120 hours',
        rating: 4.6
      }
    ],
    topCompanies: ['Amazon', 'Google', 'Microsoft', 'Netflix', 'Uber', 'Stripe'],
    relatedPaths: ['Full Stack Developer', 'DevOps Engineer', 'Cloud Architect']
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    description: 'Master both frontend and backend to build complete web applications end-to-end',
    avgSalary: {
      fresher: '₹5-8 LPA',
      junior: '₹8-16 LPA',
      mid: '₹16-28 LPA',
      senior: '₹28-50 LPA'
    },
    jobOpenings: 542,
    timeToJobReady: '15-18 months',
    difficulty: 'Hard',
    demandTrend: 'up',
    remotePercentage: 60,
    levels: [
      {
        level: 1,
        title: 'Foundations',
        duration: '0-4 months',
        skills: [
          { id: 'fs1', name: 'HTML, CSS, JavaScript', status: 'locked', estimatedWeeks: 4, category: 'Frontend' },
          { id: 'fs2', name: 'Git Workflow', status: 'locked', estimatedWeeks: 1, category: 'Tools' },
          { id: 'fs3', name: 'Node.js Basics', status: 'locked', estimatedWeeks: 3, category: 'Backend' },
          { id: 'fs4', name: 'SQL and Data Modeling', status: 'locked', estimatedWeeks: 3, category: 'Database' },
          { id: 'fs5', name: 'HTTP and APIs', status: 'locked', estimatedWeeks: 2, category: 'Systems' }
        ]
      },
      {
        level: 2,
        title: 'Product Building',
        duration: '4-8 months',
        skills: [
          { id: 'fs6', name: 'React.js', status: 'locked', estimatedWeeks: 5, category: 'Frontend' },
          { id: 'fs7', name: 'Express.js', status: 'locked', estimatedWeeks: 4, category: 'Backend' },
          { id: 'fs8', name: 'Authentication', status: 'locked', estimatedWeeks: 2, category: 'Security' },
          { id: 'fs9', name: 'REST and State Management', status: 'locked', estimatedWeeks: 3, category: 'Frontend' },
          { id: 'fs10', name: 'PostgreSQL/MongoDB', status: 'locked', estimatedWeeks: 3, category: 'Database' }
        ]
      },
      {
        level: 3,
        title: 'Deployment and Scale',
        duration: '8-14 months',
        skills: [
          { id: 'fs11', name: 'Next.js or Remix', status: 'locked', estimatedWeeks: 4, category: 'Framework' },
          { id: 'fs12', name: 'TypeScript', status: 'locked', estimatedWeeks: 3, category: 'Language' },
          { id: 'fs13', name: 'Docker and CI/CD', status: 'locked', estimatedWeeks: 3, category: 'DevOps' },
          { id: 'fs14', name: 'Caching and Performance', status: 'locked', estimatedWeeks: 2, category: 'Performance' },
          { id: 'fs15', name: 'System Design', status: 'locked', estimatedWeeks: 4, category: 'Architecture' }
        ]
      }
    ],
    projects: [
      {
        id: 'fsp1',
        title: 'Full Stack Task Manager',
        difficulty: 'beginner',
        skillsUsed: ['React.js', 'Express.js', 'PostgreSQL/MongoDB'],
        estimatedHours: 24,
        status: 'not-started',
        description: 'Build a task manager with auth, CRUD, and personalized dashboards.'
      },
      {
        id: 'fsp2',
        title: 'E-learning Platform',
        difficulty: 'intermediate',
        skillsUsed: ['Next.js or Remix', 'Authentication', 'REST and State Management'],
        estimatedHours: 42,
        status: 'not-started',
        description: 'Create course listings, student progress tracking, and instructor workflows.'
      },
      {
        id: 'fsp3',
        title: 'Placement Analytics Suite',
        difficulty: 'advanced',
        skillsUsed: ['System Design', 'Caching and Performance', 'Docker and CI/CD'],
        estimatedHours: 55,
        status: 'not-started',
        description: 'Ship a production-style platform with reports, notifications, and analytics APIs.'
      }
    ],
    learningResources: [
      {
        id: 'fslr1',
        title: 'The Odin Project Full Stack Path',
        type: 'course',
        platform: 'The Odin Project',
        isFree: true,
        url: 'https://www.theodinproject.com/paths/full-stack-javascript',
        duration: 'Self-paced',
        rating: 4.9
      },
      {
        id: 'fslr2',
        title: 'Full Stack Open',
        type: 'course',
        platform: 'University of Helsinki',
        isFree: true,
        url: 'https://fullstackopen.com/en/',
        duration: '250 hours',
        rating: 4.8
      },
      {
        id: 'fslr3',
        title: 'Designing Data-Intensive Applications Notes',
        type: 'article',
        platform: 'Community Notes',
        isFree: true,
        url: 'https://github.com/ept/ddia-references',
        duration: '20 hours',
        rating: 4.7
      }
    ],
    topCompanies: ['Shopify', 'Atlassian', 'Spotify', 'Slack', 'GitHub', 'Notion'],
    relatedPaths: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer']
  },
  {
    id: 'data-science',
    name: 'Data Scientist',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    description: 'Analyze data, build ML models, and derive insights to drive business decisions',
    avgSalary: {
      fresher: '₹6-10 LPA',
      junior: '₹10-18 LPA',
      mid: '₹18-30 LPA',
      senior: '₹30-60 LPA'
    },
    jobOpenings: 723,
    timeToJobReady: '12-15 months',
    difficulty: 'Hard',
    demandTrend: 'up',
    remotePercentage: 55,
    levels: [
      {
        level: 1,
        title: 'Math and Python Base',
        duration: '0-4 months',
        skills: [
          { id: 'ds1', name: 'Python for Data Work', status: 'locked', estimatedWeeks: 4, category: 'Language' },
          { id: 'ds2', name: 'Statistics Basics', status: 'locked', estimatedWeeks: 3, category: 'Math' },
          { id: 'ds3', name: 'Linear Algebra Basics', status: 'locked', estimatedWeeks: 3, category: 'Math' },
          { id: 'ds4', name: 'SQL for Analysis', status: 'locked', estimatedWeeks: 2, category: 'Database' },
          { id: 'ds5', name: 'Pandas and NumPy', status: 'locked', estimatedWeeks: 3, category: 'Libraries' }
        ]
      },
      {
        level: 2,
        title: 'Analysis and Visualization',
        duration: '4-8 months',
        skills: [
          { id: 'ds6', name: 'Exploratory Data Analysis', status: 'locked', estimatedWeeks: 3, category: 'Analysis' },
          { id: 'ds7', name: 'Matplotlib and Seaborn', status: 'locked', estimatedWeeks: 2, category: 'Visualization' },
          { id: 'ds8', name: 'Feature Engineering', status: 'locked', estimatedWeeks: 3, category: 'ML' },
          { id: 'ds9', name: 'Hypothesis Testing', status: 'locked', estimatedWeeks: 2, category: 'Statistics' },
          { id: 'ds10', name: 'Business Storytelling', status: 'locked', estimatedWeeks: 2, category: 'Communication' }
        ]
      },
      {
        level: 3,
        title: 'Machine Learning',
        duration: '8-14 months',
        skills: [
          { id: 'ds11', name: 'Supervised Learning', status: 'locked', estimatedWeeks: 4, category: 'ML' },
          { id: 'ds12', name: 'Model Evaluation', status: 'locked', estimatedWeeks: 2, category: 'ML' },
          { id: 'ds13', name: 'Scikit-learn Pipelines', status: 'locked', estimatedWeeks: 3, category: 'Libraries' },
          { id: 'ds14', name: 'Intro to Deep Learning', status: 'locked', estimatedWeeks: 4, category: 'AI' },
          { id: 'ds15', name: 'Model Deployment Basics', status: 'locked', estimatedWeeks: 2, category: 'MLOps' }
        ]
      }
    ],
    projects: [
      {
        id: 'dsp1',
        title: 'Student Placement Dashboard',
        difficulty: 'beginner',
        skillsUsed: ['Python for Data Work', 'Pandas and NumPy', 'Matplotlib and Seaborn'],
        estimatedHours: 20,
        status: 'not-started',
        description: 'Analyze placement data and build a visual dashboard of trends and outcomes.'
      },
      {
        id: 'dsp2',
        title: 'Customer Churn Predictor',
        difficulty: 'intermediate',
        skillsUsed: ['Supervised Learning', 'Feature Engineering', 'Model Evaluation'],
        estimatedHours: 35,
        status: 'not-started',
        description: 'Train and evaluate a churn model using a realistic tabular dataset.'
      },
      {
        id: 'dsp3',
        title: 'Resume Shortlisting Model',
        difficulty: 'advanced',
        skillsUsed: ['Scikit-learn Pipelines', 'Hypothesis Testing', 'Model Deployment Basics'],
        estimatedHours: 48,
        status: 'not-started',
        description: 'Build an end-to-end model that ranks candidates for a target role.'
      }
    ],
    learningResources: [
      {
        id: 'dslr1',
        title: 'Python for Data Science',
        type: 'course',
        platform: 'Coursera',
        isFree: false,
        url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai',
        duration: '45 hours',
        rating: 4.7
      },
      {
        id: 'dslr2',
        title: 'Hands-On Machine Learning Notes',
        type: 'article',
        platform: 'Community Notes',
        isFree: true,
        url: 'https://scikit-learn.org/stable/tutorial/index.html',
        duration: '18 hours',
        rating: 4.8
      },
      {
        id: 'dslr3',
        title: 'Kaggle Micro-Courses',
        type: 'practice',
        platform: 'Kaggle',
        isFree: true,
        url: 'https://www.kaggle.com/learn',
        duration: '60 hours',
        rating: 4.9
      }
    ],
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Uber'],
    relatedPaths: ['Machine Learning Engineer', 'AI Engineer', 'Data Analyst']
  },
  {
    id: 'mobile',
    name: 'Mobile Developer',
    icon: Smartphone,
    color: 'from-cyan-500 to-blue-500',
    description: 'Create native and cross-platform mobile apps for iOS and Android',
    avgSalary: {
      fresher: '₹4-7 LPA',
      junior: '₹7-14 LPA',
      mid: '₹14-25 LPA',
      senior: '₹25-45 LPA'
    },
    jobOpenings: 456,
    timeToJobReady: '12-14 months',
    difficulty: 'Medium',
    demandTrend: 'stable',
    remotePercentage: 50,
    levels: [
      {
        level: 1,
        title: 'App Foundations',
        duration: '0-4 months',
        skills: [
          { id: 'mb1', name: 'JavaScript or Dart Basics', status: 'locked', estimatedWeeks: 3, category: 'Language' },
          { id: 'mb2', name: 'Mobile UI Principles', status: 'locked', estimatedWeeks: 2, category: 'Design' },
          { id: 'mb3', name: 'React Native or Flutter Setup', status: 'locked', estimatedWeeks: 3, category: 'Framework' },
          { id: 'mb4', name: 'Navigation Patterns', status: 'locked', estimatedWeeks: 2, category: 'Framework' },
          { id: 'mb5', name: 'State Management Basics', status: 'locked', estimatedWeeks: 2, category: 'Framework' }
        ]
      },
      {
        level: 2,
        title: 'Native Features',
        duration: '4-8 months',
        skills: [
          { id: 'mb6', name: 'Working with APIs', status: 'locked', estimatedWeeks: 2, category: 'Backend' },
          { id: 'mb7', name: 'Local Storage and Caching', status: 'locked', estimatedWeeks: 2, category: 'Performance' },
          { id: 'mb8', name: 'Device Permissions', status: 'locked', estimatedWeeks: 2, category: 'Platform' },
          { id: 'mb9', name: 'Animations and Gestures', status: 'locked', estimatedWeeks: 2, category: 'UI' },
          { id: 'mb10', name: 'App Testing', status: 'locked', estimatedWeeks: 2, category: 'Testing' }
        ]
      },
      {
        level: 3,
        title: 'Release Ready',
        duration: '8-12 months',
        skills: [
          { id: 'mb11', name: 'Performance Optimization', status: 'locked', estimatedWeeks: 2, category: 'Performance' },
          { id: 'mb12', name: 'Push Notifications', status: 'locked', estimatedWeeks: 2, category: 'Platform' },
          { id: 'mb13', name: 'App Store Deployment', status: 'locked', estimatedWeeks: 3, category: 'Release' },
          { id: 'mb14', name: 'Crash Monitoring', status: 'locked', estimatedWeeks: 1, category: 'Operations' },
          { id: 'mb15', name: 'Offline-first Patterns', status: 'locked', estimatedWeeks: 2, category: 'Architecture' }
        ]
      }
    ],
    projects: [
      {
        id: 'mbp1',
        title: 'Habit Tracker App',
        difficulty: 'beginner',
        skillsUsed: ['React Native or Flutter Setup', 'Navigation Patterns', 'Local Storage and Caching'],
        estimatedHours: 20,
        status: 'not-started',
        description: 'Build a daily habit tracker with streaks and clean mobile interactions.'
      },
      {
        id: 'mbp2',
        title: 'Food Delivery UI Clone',
        difficulty: 'intermediate',
        skillsUsed: ['Animations and Gestures', 'Working with APIs', 'State Management Basics'],
        estimatedHours: 32,
        status: 'not-started',
        description: 'Create a production-style ordering flow with API-backed restaurant data.'
      },
      {
        id: 'mbp3',
        title: 'Campus Companion App',
        difficulty: 'advanced',
        skillsUsed: ['Push Notifications', 'Offline-first Patterns', 'App Store Deployment'],
        estimatedHours: 44,
        status: 'not-started',
        description: 'Ship a campus utility app with notices, schedules, and offline access.'
      }
    ],
    learningResources: [
      {
        id: 'mblr1',
        title: 'React Native - The Practical Guide',
        type: 'course',
        platform: 'Udemy',
        isFree: false,
        url: 'https://reactnative.dev/docs/getting-started',
        duration: '35 hours',
        rating: 4.7
      },
      {
        id: 'mblr2',
        title: 'Flutter Codelabs',
        type: 'documentation',
        platform: 'Flutter',
        isFree: true,
        url: 'https://docs.flutter.dev/get-started/codelab',
        duration: 'Self-paced',
        rating: 4.8
      },
      {
        id: 'mblr3',
        title: 'Mobile UI Challenge Set',
        type: 'practice',
        platform: 'Frontend Mentor',
        isFree: true,
        url: 'https://www.frontendmentor.io/challenges',
        duration: '50 hours',
        rating: 4.6
      }
    ],
    topCompanies: ['Google', 'Meta', 'Uber', 'Swiggy', 'Zomato', 'PayTM'],
    relatedPaths: ['Frontend Developer', 'Full Stack Developer', 'UI/UX Designer']
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: Settings,
    color: 'from-indigo-500 to-purple-500',
    description: 'Build and maintain infrastructure, automate deployments, and ensure reliability',
    avgSalary: {
      fresher: '₹5-8 LPA',
      junior: '₹8-16 LPA',
      mid: '₹16-28 LPA',
      senior: '₹28-50 LPA'
    },
    jobOpenings: 634,
    timeToJobReady: '14-16 months',
    difficulty: 'Hard',
    demandTrend: 'up',
    remotePercentage: 75,
    levels: [
      {
        level: 1,
        title: 'Linux and Networking',
        duration: '0-4 months',
        skills: [
          { id: 'do1', name: 'Linux Command Line', status: 'locked', estimatedWeeks: 3, category: 'Systems' },
          { id: 'do2', name: 'Networking Basics', status: 'locked', estimatedWeeks: 2, category: 'Networking' },
          { id: 'do3', name: 'Git and Bash Scripting', status: 'locked', estimatedWeeks: 2, category: 'Tools' },
          { id: 'do4', name: 'Cloud Fundamentals', status: 'locked', estimatedWeeks: 3, category: 'Cloud' },
          { id: 'do5', name: 'Containers Intro', status: 'locked', estimatedWeeks: 2, category: 'Containers' }
        ]
      },
      {
        level: 2,
        title: 'Automation and Delivery',
        duration: '4-8 months',
        skills: [
          { id: 'do6', name: 'Docker', status: 'locked', estimatedWeeks: 3, category: 'Containers' },
          { id: 'do7', name: 'CI/CD Pipelines', status: 'locked', estimatedWeeks: 3, category: 'Automation' },
          { id: 'do8', name: 'Infrastructure as Code', status: 'locked', estimatedWeeks: 3, category: 'IaC' },
          { id: 'do9', name: 'Kubernetes Basics', status: 'locked', estimatedWeeks: 4, category: 'Orchestration' },
          { id: 'do10', name: 'Secrets and Access Control', status: 'locked', estimatedWeeks: 2, category: 'Security' }
        ]
      },
      {
        level: 3,
        title: 'Reliability Engineering',
        duration: '8-14 months',
        skills: [
          { id: 'do11', name: 'Observability', status: 'locked', estimatedWeeks: 2, category: 'Monitoring' },
          { id: 'do12', name: 'Incident Response', status: 'locked', estimatedWeeks: 2, category: 'Operations' },
          { id: 'do13', name: 'Cloud Cost Optimization', status: 'locked', estimatedWeeks: 2, category: 'Cloud' },
          { id: 'do14', name: 'Advanced Kubernetes', status: 'locked', estimatedWeeks: 3, category: 'Orchestration' },
          { id: 'do15', name: 'Platform Engineering Basics', status: 'locked', estimatedWeeks: 3, category: 'Architecture' }
        ]
      }
    ],
    projects: [
      {
        id: 'dop1',
        title: 'CI/CD for Portfolio App',
        difficulty: 'beginner',
        skillsUsed: ['Git and Bash Scripting', 'Docker', 'CI/CD Pipelines'],
        estimatedHours: 18,
        status: 'not-started',
        description: 'Automate build, test, and deploy for a small web application.'
      },
      {
        id: 'dop2',
        title: 'Kubernetes Demo Cluster',
        difficulty: 'intermediate',
        skillsUsed: ['Kubernetes Basics', 'Observability', 'Secrets and Access Control'],
        estimatedHours: 34,
        status: 'not-started',
        description: 'Deploy a small service stack and add health checks, logs, and dashboards.'
      },
      {
        id: 'dop3',
        title: 'Infrastructure as Code Platform',
        difficulty: 'advanced',
        skillsUsed: ['Infrastructure as Code', 'Cloud Cost Optimization', 'Advanced Kubernetes'],
        estimatedHours: 48,
        status: 'not-started',
        description: 'Provision repeatable cloud environments and document an incident-ready workflow.'
      }
    ],
    learningResources: [
      {
        id: 'dolr1',
        title: 'DevOps Bootcamp',
        type: 'course',
        platform: 'KodeKloud',
        isFree: false,
        url: 'https://kodekloud.com/',
        duration: '55 hours',
        rating: 4.8
      },
      {
        id: 'dolr2',
        title: 'Docker Documentation',
        type: 'documentation',
        platform: 'Docker',
        isFree: true,
        url: 'https://docs.docker.com/get-started/',
        duration: 'Self-paced',
        rating: 4.8
      },
      {
        id: 'dolr3',
        title: 'Kubernetes Hands-on Labs',
        type: 'practice',
        platform: 'Play with Kubernetes',
        isFree: true,
        url: 'https://kubernetes.io/docs/tutorials/',
        duration: '40 hours',
        rating: 4.7
      }
    ],
    topCompanies: ['Amazon', 'Google', 'Microsoft', 'Netflix', 'Atlassian', 'HashiCorp'],
    relatedPaths: ['Backend Developer', 'Cloud Architect', 'Site Reliability Engineer']
  },
  {
    id: 'uiux',
    name: 'UI/UX Designer',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    description: 'Design beautiful, intuitive interfaces and create delightful user experiences',
    avgSalary: {
      fresher: '₹3-6 LPA',
      junior: '₹6-12 LPA',
      mid: '₹12-22 LPA',
      senior: '₹22-40 LPA'
    },
    jobOpenings: 389,
    timeToJobReady: '10-12 months',
    difficulty: 'Medium',
    demandTrend: 'up',
    remotePercentage: 60,
    levels: [
      {
        level: 1,
        title: 'Design Basics',
        duration: '0-3 months',
        skills: [
          { id: 'ux1', name: 'Visual Hierarchy', status: 'locked', estimatedWeeks: 2, category: 'Design' },
          { id: 'ux2', name: 'Typography and Color', status: 'locked', estimatedWeeks: 2, category: 'Design' },
          { id: 'ux3', name: 'Figma Fundamentals', status: 'locked', estimatedWeeks: 3, category: 'Tools' },
          { id: 'ux4', name: 'Wireframing', status: 'locked', estimatedWeeks: 2, category: 'UX' },
          { id: 'ux5', name: 'Design Critique Basics', status: 'locked', estimatedWeeks: 1, category: 'Communication' }
        ]
      },
      {
        level: 2,
        title: 'User Experience',
        duration: '3-7 months',
        skills: [
          { id: 'ux6', name: 'User Research', status: 'locked', estimatedWeeks: 3, category: 'UX' },
          { id: 'ux7', name: 'Information Architecture', status: 'locked', estimatedWeeks: 2, category: 'UX' },
          { id: 'ux8', name: 'Interaction Design', status: 'locked', estimatedWeeks: 3, category: 'UX' },
          { id: 'ux9', name: 'Prototyping', status: 'locked', estimatedWeeks: 2, category: 'Tools' },
          { id: 'ux10', name: 'Accessibility', status: 'locked', estimatedWeeks: 2, category: 'Quality' }
        ]
      },
      {
        level: 3,
        title: 'Product Design',
        duration: '7-12 months',
        skills: [
          { id: 'ux11', name: 'Design Systems', status: 'locked', estimatedWeeks: 3, category: 'Systems' },
          { id: 'ux12', name: 'Usability Testing', status: 'locked', estimatedWeeks: 2, category: 'Research' },
          { id: 'ux13', name: 'Design Handoff', status: 'locked', estimatedWeeks: 1, category: 'Collaboration' },
          { id: 'ux14', name: 'Microcopy and UX Writing', status: 'locked', estimatedWeeks: 2, category: 'Content' },
          { id: 'ux15', name: 'Product Thinking', status: 'locked', estimatedWeeks: 2, category: 'Strategy' }
        ]
      }
    ],
    projects: [
      {
        id: 'uxp1',
        title: 'Redesign a College Website',
        difficulty: 'beginner',
        skillsUsed: ['Wireframing', 'Typography and Color', 'Figma Fundamentals'],
        estimatedHours: 16,
        status: 'not-started',
        description: 'Rework a messy college landing page into a cleaner, student-friendly experience.'
      },
      {
        id: 'uxp2',
        title: 'Food Ordering App Prototype',
        difficulty: 'intermediate',
        skillsUsed: ['Interaction Design', 'Prototyping', 'Information Architecture'],
        estimatedHours: 28,
        status: 'not-started',
        description: 'Design a complete order flow from browsing to checkout with interactive screens.'
      },
      {
        id: 'uxp3',
        title: 'Design System Starter Kit',
        difficulty: 'advanced',
        skillsUsed: ['Design Systems', 'Accessibility', 'Design Handoff'],
        estimatedHours: 36,
        status: 'not-started',
        description: 'Create a reusable component library with tokens, patterns, and documentation.'
      }
    ],
    learningResources: [
      {
        id: 'uxlr1',
        title: 'Google UX Design Certificate',
        type: 'course',
        platform: 'Coursera',
        isFree: false,
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        duration: '120 hours',
        rating: 4.7
      },
      {
        id: 'uxlr2',
        title: 'Laws of UX',
        type: 'article',
        platform: 'Laws of UX',
        isFree: true,
        url: 'https://lawsofux.com/',
        duration: '8 hours',
        rating: 4.8
      },
      {
        id: 'uxlr3',
        title: 'Figma Community Practice Files',
        type: 'practice',
        platform: 'Figma',
        isFree: true,
        url: 'https://www.figma.com/community',
        duration: '45 hours',
        rating: 4.8
      }
    ],
    topCompanies: ['Apple', 'Google', 'Airbnb', 'Adobe', 'Figma', 'Spotify'],
    relatedPaths: ['Frontend Developer', 'Product Designer', 'Graphic Designer']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Specialist',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    description: 'Protect systems, networks, and data from cyber threats and vulnerabilities',
    avgSalary: {
      fresher: '₹4-7 LPA',
      junior: '₹7-15 LPA',
      mid: '₹15-28 LPA',
      senior: '₹28-55 LPA'
    },
    jobOpenings: 445,
    timeToJobReady: '12-15 months',
    difficulty: 'Hard',
    demandTrend: 'up',
    remotePercentage: 45,
    levels: [
      {
        level: 1,
        title: 'Security Foundations',
        duration: '0-4 months',
        skills: [
          { id: 'cy1', name: 'Networking Fundamentals', status: 'locked', estimatedWeeks: 3, category: 'Networking' },
          { id: 'cy2', name: 'Linux and Windows Basics', status: 'locked', estimatedWeeks: 3, category: 'Systems' },
          { id: 'cy3', name: 'Security Concepts', status: 'locked', estimatedWeeks: 2, category: 'Security' },
          { id: 'cy4', name: 'Python Scripting', status: 'locked', estimatedWeeks: 3, category: 'Automation' },
          { id: 'cy5', name: 'OWASP Top 10', status: 'locked', estimatedWeeks: 2, category: 'Web Security' }
        ]
      },
      {
        level: 2,
        title: 'Defense and Testing',
        duration: '4-8 months',
        skills: [
          { id: 'cy6', name: 'Vulnerability Scanning', status: 'locked', estimatedWeeks: 2, category: 'Testing' },
          { id: 'cy7', name: 'SIEM Basics', status: 'locked', estimatedWeeks: 2, category: 'Monitoring' },
          { id: 'cy8', name: 'Incident Response Workflow', status: 'locked', estimatedWeeks: 2, category: 'Operations' },
          { id: 'cy9', name: 'Identity and Access Control', status: 'locked', estimatedWeeks: 2, category: 'Security' },
          { id: 'cy10', name: 'Secure Configuration', status: 'locked', estimatedWeeks: 2, category: 'Hardening' }
        ]
      },
      {
        level: 3,
        title: 'Advanced Security Ops',
        duration: '8-14 months',
        skills: [
          { id: 'cy11', name: 'Threat Modeling', status: 'locked', estimatedWeeks: 2, category: 'Strategy' },
          { id: 'cy12', name: 'Cloud Security Basics', status: 'locked', estimatedWeeks: 3, category: 'Cloud' },
          { id: 'cy13', name: 'Malware Analysis Intro', status: 'locked', estimatedWeeks: 3, category: 'Analysis' },
          { id: 'cy14', name: 'Penetration Testing Workflow', status: 'locked', estimatedWeeks: 3, category: 'Testing' },
          { id: 'cy15', name: 'Security Reporting', status: 'locked', estimatedWeeks: 1, category: 'Communication' }
        ]
      }
    ],
    projects: [
      {
        id: 'cyp1',
        title: 'Basic Security Audit',
        difficulty: 'beginner',
        skillsUsed: ['Security Concepts', 'Secure Configuration', 'OWASP Top 10'],
        estimatedHours: 18,
        status: 'not-started',
        description: 'Audit a sample web app and document risks, fixes, and severity.'
      },
      {
        id: 'cyp2',
        title: 'SOC Alert Triage Lab',
        difficulty: 'intermediate',
        skillsUsed: ['SIEM Basics', 'Incident Response Workflow', 'Identity and Access Control'],
        estimatedHours: 30,
        status: 'not-started',
        description: 'Simulate alerts, classify incidents, and produce an analyst report.'
      },
      {
        id: 'cyp3',
        title: 'Cloud Hardening Playbook',
        difficulty: 'advanced',
        skillsUsed: ['Cloud Security Basics', 'Threat Modeling', 'Security Reporting'],
        estimatedHours: 40,
        status: 'not-started',
        description: 'Create a hands-on playbook for securing cloud workloads and access patterns.'
      }
    ],
    learningResources: [
      {
        id: 'cylr1',
        title: 'Google Cybersecurity Certificate',
        type: 'course',
        platform: 'Coursera',
        isFree: false,
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        duration: '90 hours',
        rating: 4.7
      },
      {
        id: 'cylr2',
        title: 'OWASP Web Security Testing Guide',
        type: 'documentation',
        platform: 'OWASP',
        isFree: true,
        url: 'https://owasp.org/www-project-web-security-testing-guide/',
        duration: 'Self-paced',
        rating: 4.9
      },
      {
        id: 'cylr3',
        title: 'TryHackMe Security Paths',
        type: 'practice',
        platform: 'TryHackMe',
        isFree: false,
        url: 'https://tryhackme.com/',
        duration: '100 hours',
        rating: 4.8
      }
    ],
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Cisco', 'Palo Alto', 'CrowdStrike'],
    relatedPaths: ['Network Engineer', 'Ethical Hacker', 'Security Analyst']
  }
];

const successStories: SuccessStory[] = [
  {
    name: 'Rahul Sharma',
    avatar: 'RS',
    role: 'Frontend Developer',
    company: 'Amazon',
    package: '₹18 LPA',
    timeline: '14 months',
    path: 'Frontend Developer',
    quote: 'The structured roadmap helped me stay focused. I went from HTML basics to landing my dream job at Amazon in just over a year!',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
  },
  {
    name: 'Priya Mehta',
    avatar: 'PM',
    role: 'Full Stack Developer',
    company: 'Flipkart',
    package: '₹22 LPA',
    timeline: '16 months',
    path: 'Full Stack Developer',
    quote: 'Building real projects and following the career path made all the difference. Now I work on features used by millions!',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS']
  },
  {
    name: 'Arjun Kumar',
    avatar: 'AK',
    role: 'Data Scientist',
    company: 'Microsoft',
    package: '₹28 LPA',
    timeline: '18 months',
    path: 'Data Scientist',
    quote: 'The personalized learning path and project suggestions were incredible. Went from zero to DS role at Microsoft!',
    skills: ['Python', 'ML', 'TensorFlow', 'SQL']
  }
];

export default function Careers({ isDashboard = false }: { isDashboard?: boolean }) {
  // State Management
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPaths, setComparisonPaths] = useState<string[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTrend, setFilterTrend] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'projects' | 'resources' | 'salary'>('overview');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Rohan',
    currentSkills: ['HTML5', 'CSS3', 'JavaScript Basics'],
    interests: ['Frontend', 'UI Design'],
    hoursPerWeek: 15,
    targetRole: 'Frontend Developer',
    timeline: '12 months'
  });

  // Hydrate dashboard profile from student API; career path catalog remains static educational content.
  useEffect(() => {
    if (!isDashboard) return;
    let cancelled = false;
    (async () => {
      try {
        const profile = await studentApi.getProfile();
        if (cancelled || !profile) return;
        setUserProfile((prev) => ({
          ...prev,
          name: profile.full_name || profile.name || prev.name,
          currentSkills: Array.isArray(profile.skills) && profile.skills.length > 0
            ? profile.skills.map((s: { name?: string } | string) => (typeof s === 'string' ? s : s.name || '')).filter(Boolean)
            : prev.currentSkills,
        }));
      } catch {
        // Keep static defaults when profile is unavailable (e.g. public /careers page).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isDashboard]);

  // Computed values
  const selectedPathData = careerPaths.find(p => p.id === selectedPath);
  const sortedPaths = [...careerPaths];

  // Filter paths
  const filteredPaths = sortedPaths.filter(path => {
    const matchesSearch = searchQuery === '' ||
      path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = filterDifficulty === 'all' || path.difficulty === filterDifficulty;
    const matchesTrend = filterTrend === 'all' || path.demandTrend === filterTrend;

    return matchesSearch && matchesDifficulty && matchesTrend;
  });

  // Calculate overall progress for a path
  const calculateProgress = (path: CareerPath) => {
    const allSkills = path.levels.flatMap(level => level.skills);
    if (allSkills.length === 0) return 0;
    const completedSkills = allSkills.filter(s => s.status === 'completed').length;
    return Math.round((completedSkills / allSkills.length) * 100);
  };

  // Get skill status icon
  const getSkillStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendLabel = (trend: CareerPath['demandTrend']) => {
    switch (trend) {
      case 'up':
        return 'Growing';
      case 'down':
        return 'Cooling';
      default:
        return 'Stable';
    }
  };

  // Toggle comparison
  const toggleComparison = (pathId: string) => {
    if (comparisonPaths.includes(pathId)) {
      setComparisonPaths(comparisonPaths.filter(id => id !== pathId));
    } else if (comparisonPaths.length < 3) {
      setComparisonPaths([...comparisonPaths, pathId]);
    }
  };

  return (
    <div className={isDashboard ? "bg-transparent p-0" : "min-h-dvh overflow-x-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 px-4 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6"}>
      <div className={isDashboard ? "w-full space-y-6" : "mx-auto max-w-7xl space-y-6"}>

        {!isDashboard && (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">Career Path</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Personalized roadmaps, skill tracking, and resources to help you land your dream job
            </p>

            {/* User Stats */}

          </div>
        )}

        {/* Search and Filters */}
        {!selectedPath && (
          <Card className="w-full gap-0 rounded-3xl border border-slate-200/80 bg-white/95 py-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-800/80 dark:bg-slate-950/85">
            <CardContent className="px-5 py-4 sm:px-6 sm:py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative w-full md:max-w-[45%]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search career paths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-10 rounded-xl border-slate-200 px-4 dark:border-slate-700"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {(filterDifficulty !== 'all' || filterTrend !== 'all') && (
                      <Badge variant="secondary" className="ml-2 bg-blue-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {[filterDifficulty !== 'all', filterTrend !== 'all'].filter(Boolean).length}
                      </Badge>
                    )}
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 rounded-lg"
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 rounded-lg"
                      aria-label="List view"
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Comparison Toggle */}
                  <Button
                    variant={showComparison ? 'default' : 'outline'}
                    onClick={() => setShowComparison(!showComparison)}
                    className="h-10 rounded-xl border-slate-200 px-4 dark:border-slate-700"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Compare
                    {comparisonPaths.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {comparisonPaths.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Difficulty Level
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'Easy', 'Medium', 'Hard'].map(diff => (
                        <Button
                          key={diff}
                          variant={filterDifficulty === diff ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterDifficulty(diff)}
                        >
                          {diff === 'all' ? 'All Levels' : diff}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Demand Trend
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'up', 'stable', 'down'].map(trend => (
                        <Button
                          key={trend}
                          variant={filterTrend === trend ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterTrend(trend)}
                        >
                          {trend === 'all' ? 'All Trends' : trend === 'up' ? '📈 Rising' : trend === 'stable' ? '➡️ Stable' : '📉 Declining'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {(filterDifficulty !== 'all' || filterTrend !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterDifficulty('all');
                        setFilterTrend('all');
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comparison View */}
        {showComparison && comparisonPaths.length > 0 && (
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Career Path Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <th key={pathId} className="text-left py-3 px-4">
                            <div className="flex items-center gap-2">
                              <path.icon className="h-4 w-4" />
                              {path.name}
                              <button
                                onClick={() => toggleComparison(pathId)}
                                className="ml-2 text-slate-400 hover:text-slate-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                        ) : null;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 font-medium">Match Score</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4">
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 font-medium">Time to Job Ready</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4">{path.timeToJobReady}</td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 font-medium">Difficulty</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4">
                            <Badge variant={path.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
                              {path.difficulty}
                            </Badge>
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 font-medium">Avg Salary (Fresher)</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4 font-semibold text-green-600">
                            {path.avgSalary.fresher}
                          </td>
                        ) : null;
                      })}
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3 px-4 font-medium">Job Openings</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4">{path.jobOpenings.toLocaleString()}</td>
                        ) : null;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Remote %</td>
                      {comparisonPaths.map(pathId => {
                        const path = careerPaths.find(p => p.id === pathId);
                        return path ? (
                          <td key={pathId} className="py-3 px-4">{path.remotePercentage}%</td>
                        ) : null;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Paths Grid/List */}
        {!selectedPath ? (
          <div className={viewMode === 'grid' ? 'mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-x-hidden' : 'mx-auto w-full max-w-[1100px] space-y-4'}>
            {filteredPaths.map((path, index) => {
              const Icon = path.icon;
              const isTopMatch = index === 0;

              return (
                <Card
                  key={path.id}
                  className={`w-full group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border-2 ${isTopMatch
                    ? 'border-yellow-400/80 dark:border-yellow-600 bg-gradient-to-br from-yellow-50/30 to-orange-50/10 dark:from-yellow-950/10 dark:to-orange-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-500'
                    }`}
                  onClick={() => setSelectedPath(path.id)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <CardHeader className="p-3 pb-0">
                    {/* Row 1: Icon, Title & Badges */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="h-5.5 w-5.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base font-black truncate group-hover:text-blue-600 transition-colors leading-tight">
                            {path.name}
                          </CardTitle>
                          {/* Clamped description directly under title */}
                          <p className="text-[11px] leading-relaxed line-clamp-2 min-h-[32px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {path.description}
                          </p>
                        </div>
                      </div>

                      {/* Top Match / Comparison or Match % Badge */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {isTopMatch && (
                          <Badge className="bg-yellow-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 shrink-0 shadow-sm">
                            BEST
                          </Badge>
                        )}
                        {showComparison && (
                          <Button
                            variant={comparisonPaths.includes(path.id) ? 'default' : 'outline'}
                            size="sm"
                            className="h-6 w-6 p-0 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComparison(path.id);
                            }}
                            disabled={!comparisonPaths.includes(path.id) && comparisonPaths.length >= 3}
                          >
                            {comparisonPaths.includes(path.id) ? <CheckCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 pt-1 space-y-2 pb-3">
                    {/* Key Metrics Row */}
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Avg Salary</span>
                        <span className="text-xs font-extrabold text-green-600 leading-none">{path.avgSalary.fresher}</span>
                      </div>
                      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Openings</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-none">{path.jobOpenings.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Badges on left, Explore link on right */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className={`text-[9px] font-extrabold py-0.5 px-1.5 ${path.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            path.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                          {path.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-[9px] font-extrabold py-0.5 px-1.5">
                          {path.remotePercentage}% Remote
                        </Badge>
                      </div>

                      <div className="text-[11px] font-black text-blue-500 group-hover:text-blue-600 transition-colors flex items-center gap-0.5 flex-shrink-0">
                        Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Detailed Path View */
          <div className="w-full space-y-2">
            {selectedPathData && (
              <>
                {/* Back Button - Moved up to left corner */}
                <div className="flex -mt-4 -ml-1">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPath(null)}
                    className="group w-fit text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg px-2 py-1 transition-all duration-200 active:scale-95"
                  >
                    <ArrowRight className="mr-1.5 h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1 text-slate-400 group-hover:text-blue-500" />
                    <span className="font-semibold text-xs sm:text-sm">Back to All Paths</span>
                  </Button>
                </div>

                {/* Inline Path Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedPathData.color}`} />

                  <div className={`hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPathData.color} shrink-0 items-center justify-center shadow-lg`}>
                    <selectedPathData.icon className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black truncate">{selectedPathData.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {selectedPathData.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: Info },
                    { id: 'projects', label: 'Projects', icon: Code },
                    { id: 'resources', label: 'Resources', icon: BookOpen },
                    { id: 'salary', label: 'Salary Insights', icon: DollarSign }
                  ].map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Top Companies */}
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-blue-600" />
                          Top Hiring Companies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathData.topCompanies.map(company => (
                            <Badge key={company} variant="secondary" className="px-3 py-1.5">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Related Paths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Rocket className="h-5 w-5 text-purple-600" />
                          Related Career Paths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPathData.relatedPaths.map(relatedPath => {
                            const path = careerPaths.find(p => p.name === relatedPath);
                            return path ? (
                              <button
                                key={relatedPath}
                                onClick={() => setSelectedPath(path.id)}
                                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <path.icon className="h-4 w-4" />
                                  <span className="font-medium">{relatedPath}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              </button>
                            ) : null;
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Highlights */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-600" />
                          Why Choose This Path?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-green-900 dark:text-green-100 mb-1">
                                High Demand
                              </div>
                              <div className="text-sm text-green-700 dark:text-green-300">
                                {selectedPathData.jobOpenings.toLocaleString()}+ active job openings
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Laptop className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Remote Friendly
                              </div>
                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                {selectedPathData.remotePercentage}% of jobs offer remote work
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                Great Salary
                              </div>
                              <div className="text-sm text-purple-700 dark:text-purple-300">
                                Up to {selectedPathData.avgSalary.senior} for seniors
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}



                {activeTab === 'projects' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedPathData.projects.length > 0 ? (
                      selectedPathData.projects.map(project => (
                        <Card key={project.id} className="border-2 border-slate-200 dark:border-slate-800">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl">{project.title}</CardTitle>
                              <Badge
                                variant={
                                  project.difficulty === 'beginner'
                                    ? 'secondary'
                                    : project.difficulty === 'intermediate'
                                      ? 'default'
                                      : 'destructive'
                                }
                              >
                                {project.difficulty}
                              </Badge>
                            </div>
                            <CardDescription>{project.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Skills Used */}
                            <div>
                              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Skills Used:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {project.skillsUsed.map(skill => (
                                  <Badge key={skill} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Estimated Time */}
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Clock className="h-4 w-4" />
                              Estimated: {project.estimatedHours} hours
                            </div>

                            {/* Status & Action */}
                            <div className="flex items-center gap-3">
                              {project.status === 'completed' ? (
                                <>
                                  <Badge className="bg-green-500 text-white flex-1 justify-center py-2">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completed
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    View Project
                                  </Button>
                                </>
                              ) : project.status === 'in-progress' ? (
                                <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue Building
                                </Button>
                              ) : (
                                <Button className={`flex-1 bg-gradient-to-r ${selectedPathData.color} text-white`}>
                                  <Rocket className="h-4 w-4 mr-2" />
                                  Start Project
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="md:col-span-2 border-2 border-dashed">
                        <CardContent className="py-12 text-center">
                          <Code className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                          <p className="text-slate-500">Projects coming soon for this path!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-6">
                    {selectedPathData.learningResources.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedPathData.learningResources.map(resource => (
                          <Card key={resource.id} className="group border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  {resource.type === 'video' ? (
                                    <Video className="h-5 w-5 text-red-600" />
                                  ) : resource.type === 'course' ? (
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                  ) : resource.type === 'article' ? (
                                    <FileText className="h-5 w-5 text-green-600" />
                                  ) : resource.type === 'practice' ? (
                                    <Code className="h-5 w-5 text-purple-600" />
                                  ) : (
                                    <BookOpen className="h-5 w-5 text-orange-600" />
                                  )}
                                  <div>
                                    <CardTitle className="text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{resource.title}</CardTitle>
                                    <CardDescription className="text-sm">{resource.platform}</CardDescription>
                                  </div>
                                </div>
                                {resource.isFree ? (
                                  <Badge className="bg-green-500 text-white">Free</Badge>
                                ) : (
                                  <Badge variant="secondary">Paid</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                  <Clock className="h-4 w-4" />
                                  {resource.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold">{resource.rating}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full group/btn border-slate-200 dark:border-slate-800 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                                asChild
                              >
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                  View Resource
                                  <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5" />
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-2 border-dashed">
                        <CardContent className="py-12 text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                          <p className="text-slate-500">Learning resources coming soon!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'salary' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Salary by Experience */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Salary by Experience
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { level: 'Fresher (0-1 year)', salary: selectedPathData.avgSalary.fresher, color: 'from-green-500 to-emerald-500' },
                          { level: 'Junior (1-3 years)', salary: selectedPathData.avgSalary.junior, color: 'from-blue-500 to-cyan-500' },
                          { level: 'Mid-level (3-5 years)', salary: selectedPathData.avgSalary.mid, color: 'from-purple-500 to-pink-500' },
                          { level: 'Senior (5+ years)', salary: selectedPathData.avgSalary.senior, color: 'from-orange-500 to-red-500' }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {item.level}
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {item.salary}
                              </span>
                            </div>
                            <div className={`h-3 bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${25 + index * 20}%` }} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Salary Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          Key Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Salary Growth
                              </div>
                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                Average 30-40% increment year-over-year
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                Top Paying Cities
                              </div>
                              <div className="text-sm text-purple-700 dark:text-purple-300">
                                Bangalore, Pune, Hyderabad, Gurgaon
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-green-900 dark:text-green-100 mb-1">
                                Remote Opportunities
                              </div>
                              <div className="text-sm text-green-700 dark:text-green-300">
                                {selectedPathData.remotePercentage}% jobs offer remote work
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        )}



      </div>
    </div>
  );
}

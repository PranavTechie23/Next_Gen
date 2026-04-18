import React, { useState, useEffect } from 'react';
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
  matchScore: number;
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
    matchScore: 92,
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
        description: 'Create a complete admin dashboard for managing products'
      }
    ],
    learningResources: [
      {
        id: 'lr1',
        title: 'The Complete Web Developer Bootcamp',
        type: 'course',
        platform: 'Udemy',
        isFree: false,
        url: '#',
        duration: '65 hours',
        rating: 4.7
      },
      {
        id: 'lr2',
        title: 'MDN Web Docs',
        type: 'documentation',
        platform: 'Mozilla',
        isFree: true,
        url: '#',
        duration: 'Self-paced',
        rating: 4.9
      },
      {
        id: 'lr3',
        title: 'freeCodeCamp Frontend',
        type: 'practice',
        platform: 'freeCodeCamp',
        isFree: true,
        url: '#',
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
    matchScore: 78,
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
      }
    ],
    projects: [],
    learningResources: [],
    topCompanies: ['Amazon', 'Google', 'Microsoft', 'Netflix', 'Uber', 'Stripe'],
    relatedPaths: ['Full Stack Developer', 'DevOps Engineer', 'Cloud Architect']
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    description: 'Master both frontend and backend to build complete web applications end-to-end',
    matchScore: 85,
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
    levels: [],
    projects: [],
    learningResources: [],
    topCompanies: ['Shopify', 'Atlassian', 'Spotify', 'Slack', 'GitHub', 'Notion'],
    relatedPaths: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer']
  },
  {
    id: 'data-science',
    name: 'Data Scientist',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    description: 'Analyze data, build ML models, and derive insights to drive business decisions',
    matchScore: 65,
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
    levels: [],
    projects: [],
    learningResources: [],
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Uber'],
    relatedPaths: ['Machine Learning Engineer', 'AI Engineer', 'Data Analyst']
  },
  {
    id: 'mobile',
    name: 'Mobile Developer',
    icon: Smartphone,
    color: 'from-cyan-500 to-blue-500',
    description: 'Create native and cross-platform mobile apps for iOS and Android',
    matchScore: 70,
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
    levels: [],
    projects: [],
    learningResources: [],
    topCompanies: ['Google', 'Meta', 'Uber', 'Swiggy', 'Zomato', 'PayTM'],
    relatedPaths: ['Frontend Developer', 'Full Stack Developer', 'UI/UX Designer']
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: Settings,
    color: 'from-indigo-500 to-purple-500',
    description: 'Build and maintain infrastructure, automate deployments, and ensure reliability',
    matchScore: 58,
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
    levels: [],
    projects: [],
    learningResources: [],
    topCompanies: ['Amazon', 'Google', 'Microsoft', 'Netflix', 'Atlassian', 'HashiCorp'],
    relatedPaths: ['Backend Developer', 'Cloud Architect', 'Site Reliability Engineer']
  },
  {
    id: 'uiux',
    name: 'UI/UX Designer',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    description: 'Design beautiful, intuitive interfaces and create delightful user experiences',
    matchScore: 72,
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
    levels: [],
    projects: [],
    learningResources: [],
    topCompanies: ['Apple', 'Google', 'Airbnb', 'Adobe', 'Figma', 'Spotify'],
    relatedPaths: ['Frontend Developer', 'Product Designer', 'Graphic Designer']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Specialist',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    description: 'Protect systems, networks, and data from cyber threats and vulnerabilities',
    matchScore: 55,
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
    levels: [],
    projects: [],
    learningResources: [],
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

export default function Careers(props: any) {
  const isDashboard = props?.isDashboard || false;
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

  // TODO: Replace with actual API call
  // useEffect(() => {
  //   fetchUserProfile();
  //   fetchCareerPaths();
  // }, []);

  // Computed values
  const selectedPathData = careerPaths.find(p => p.id === selectedPath);
  const sortedPaths = [...careerPaths].sort((a, b) => b.matchScore - a.matchScore);

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

  // Toggle comparison
  const toggleComparison = (pathId: string) => {
    if (comparisonPaths.includes(pathId)) {
      setComparisonPaths(comparisonPaths.filter(id => id !== pathId));
    } else if (comparisonPaths.length < 3) {
      setComparisonPaths([...comparisonPaths, pathId]);
    }
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 px-4 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-4">


          <h1 className="text-3xl font-black sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Career Path</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Personalized roadmaps, skill tracking, and resources to help you land your dream job
          </p>

          {/* User Stats */}

        </div>

        {/* Search and Filters */}
        <Card className="border-2 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search career paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2"
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
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>

              {/* Comparison Toggle */}
              <Button
                variant={showComparison ? 'default' : 'outline'}
                onClick={() => setShowComparison(!showComparison)}
                className="border-2"
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

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
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
                            <Badge variant="secondary" className="bg-blue-500 text-white">
                              {path.matchScore}%
                            </Badge>
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
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPaths.map((path, index) => {
              const Icon = path.icon;
              const progress = calculateProgress(path);
              const isTopMatch = index === 0;

              return (
                <Card
                  key={path.id}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ${isTopMatch
                    ? 'border-yellow-400 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-500'
                    }`}
                  onClick={() => setSelectedPath(path.id)}
                >
                  {/* Top Match Badge */}
                  {isTopMatch && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-yellow-500 text-white font-bold shadow-lg">
                        <Trophy className="h-3 w-3 mr-1" />
                        BEST MATCH
                      </Badge>
                    </div>
                  )}

                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <CardHeader>
                    {/* Icon & Title */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                      {showComparison && (
                        <Button
                          variant={comparisonPaths.includes(path.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparison(path.id);
                          }}
                          disabled={!comparisonPaths.includes(path.id) && comparisonPaths.length >= 3}
                        >
                          {comparisonPaths.includes(path.id) ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>

                    <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
                      {path.name}
                    </CardTitle>

                    <CardDescription className="text-sm leading-relaxed">
                      {path.description}
                    </CardDescription>

                    {/* Match Score */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${path.color} transition-all duration-500`}
                          style={{ width: `${path.matchScore}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="bg-blue-500 text-white font-bold">
                        {path.matchScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <Clock className="h-3 w-3" />
                          Time to Ready
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {path.timeToJobReady}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <DollarSign className="h-3 w-3" />
                          Avg Salary
                        </div>
                        <div className="font-bold text-green-600">
                          {path.avgSalary.fresher}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <Briefcase className="h-3 w-3" />
                          Job Openings
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {path.jobOpenings.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Demand
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(path.demandTrend)}
                          <span className="font-bold text-slate-900 dark:text-white capitalize">
                            {path.demandTrend}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className={
                        path.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          path.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }>
                        {path.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {path.remotePercentage}% Remote
                      </Badge>
                      {progress > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          {progress}% Complete
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button className={`w-full bg-gradient-to-r ${path.color} hover:opacity-90 text-white shadow-lg`}>
                      Explore Roadmap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Detailed Path View */
          <div className="space-y-6">
            {/* Back Button & Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedPath(null)}
                className="border-2"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back to All Paths
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedPathData && (
              <>
                {/* Path Header Card */}
                <Card className="border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${selectedPathData.color}`} />
                  <CardHeader>
                    <div className="flex items-start gap-6">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedPathData.color} flex items-center justify-center shadow-xl`}>
                        <selectedPathData.icon className="h-10 w-10 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle className="text-4xl mb-2">{selectedPathData.name}</CardTitle>
                            <CardDescription className="text-lg">{selectedPathData.description}</CardDescription>
                          </div>

                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg px-4 py-2">
                            <Trophy className="h-4 w-4 mr-2" />
                            {selectedPathData.matchScore}% Match
                          </Badge>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-1">
                              <Clock className="h-4 w-4" />
                              Timeline
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {selectedPathData.timeToJobReady}
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-1">
                              <DollarSign className="h-4 w-4" />
                              Fresher Salary
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {selectedPathData.avgSalary.fresher}
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-1">
                              <Briefcase className="h-4 w-4" />
                              Openings
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {selectedPathData.jobOpenings.toLocaleString()}
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-1">
                              <TrendingUp className="h-4 w-4" />
                              Demand
                            </div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(selectedPathData.demandTrend)}
                              <span className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                                {selectedPathData.demandTrend}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Your Progress
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {calculateProgress(selectedPathData)}%
                            </span>
                          </div>
                          <Progress value={calculateProgress(selectedPathData)} className="h-3" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: Info },
                    { id: 'roadmap', label: 'Skills Roadmap', icon: Target },
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
                    <Card>
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

                {activeTab === 'roadmap' && (
                  <div className="space-y-6">
                    {/* Roadmap Timeline */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Learning Roadmap
                          </CardTitle>
                          <Badge variant="secondary">
                            {selectedPathData.levels.length} Levels
                          </Badge>
                        </div>
                        <CardDescription>
                          Follow this structured path to become job-ready
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedPathData.levels.map((level, levelIndex) => {
                          const isExpanded = expandedLevel === levelIndex;
                          const completedSkills = level.skills.filter(s => s.status === 'completed').length;
                          const totalSkills = level.skills.length;
                          const levelProgress = Math.round((completedSkills / totalSkills) * 100);

                          return (
                            <div key={level.level} className="relative">
                              {/* Vertical Line */}
                              {levelIndex < selectedPathData.levels.length - 1 && (
                                <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                              )}

                              <Card className={`border-2 transition-all ${isExpanded ? 'border-blue-500 shadow-lg' : 'border-slate-200 dark:border-slate-800'
                                }`}>
                                <CardHeader
                                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                  onClick={() => setExpandedLevel(isExpanded ? null : levelIndex)}
                                >
                                  <div className="flex items-center gap-4">
                                    {/* Level Number */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPathData.color} flex items-center justify-center shadow-lg flex-shrink-0 relative z-10`}>
                                      <span className="text-2xl font-black text-white">{level.level}</span>
                                    </div>

                                    {/* Level Info */}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-xl">{level.title}</CardTitle>
                                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                      </div>

                                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          {level.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <CheckCircle className="h-4 w-4" />
                                          {completedSkills}/{totalSkills} skills
                                        </div>
                                      </div>

                                      {/* Progress Bar */}
                                      <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs text-slate-500">Progress</span>
                                          <span className="text-xs font-bold text-blue-600">{levelProgress}%</span>
                                        </div>
                                        <Progress value={levelProgress} className="h-2" />
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>

                                {/* Expanded Skills */}
                                {isExpanded && (
                                  <CardContent className="pt-0">
                                    <div className="space-y-3 mt-4">
                                      {level.skills.map(skill => (
                                        <div
                                          key={skill.id}
                                          className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${skill.status === 'completed'
                                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                                            : skill.status === 'in-progress'
                                              ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                            }`}
                                        >
                                          <div className="flex items-center gap-3 flex-1">
                                            {getSkillStatusIcon(skill.status)}
                                            <div className="flex-1">
                                              <div className="font-semibold text-slate-900 dark:text-white">
                                                {skill.name}
                                              </div>
                                              <div className="text-xs text-slate-500 mt-1">
                                                {skill.estimatedWeeks} {skill.estimatedWeeks === 1 ? 'week' : 'weeks'} · {skill.category}
                                              </div>
                                              {skill.status === 'in-progress' && skill.progress && (
                                                <div className="mt-2">
                                                  <Progress value={skill.progress} className="h-1.5" />
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {skill.status === 'completed' ? (
                                            <Badge className="bg-green-500 text-white">
                                              Completed
                                            </Badge>
                                          ) : skill.status === 'in-progress' ? (
                                            <Badge className="bg-yellow-500 text-white">
                                              {skill.progress}%
                                            </Badge>
                                          ) : (
                                            <Button size="sm" variant="outline">
                                              Start Learning
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                )}
                              </Card>
                            </div>
                          );
                        })}
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
                          <Card key={resource.id} className="border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all">
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
                                    <CardTitle className="text-base mb-1">{resource.title}</CardTitle>
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
                              <Button variant="outline" className="w-full" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  View Resource
                                  <ExternalLink className="ml-2 h-4 w-4" />
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

        {/* Success Stories Section */}
        {!selectedPath && (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
                <Users className="h-3 w-3 mr-1" />
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Students Who Made It
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Real stories from students who followed these paths
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index} className="border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {story.avatar}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {story.role} at {story.company}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <Badge className="bg-green-500 text-white">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {story.package}
                      </Badge>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {story.timeline}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-500 mb-2">Skills mastered:</div>
                    <div className="flex flex-wrap gap-1">
                      {story.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!selectedPath && (
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Choose a career path above and start building your skills today. Our personalized roadmap will guide you every step of the way.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <Target className="mr-2 h-5 w-5" />
                  Take Career Assessment
                </Button>
                <Button size="lg" variant="outline">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Talk to Mentor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
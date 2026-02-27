import { useState, Fragment, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import all student feature components
import Careers from "@/pages/student/careers";
import StudentWebinar from "@/pages/student/webinars";
import CorporateNewsPage from "@/pages/student/CorporateNews";
import StudentFeedbackForm from "@/pages/student/feedbackForm";
import AssessmentHub from "@/pages/student/AssessmentHub";
import CompanyWiseKit from "@/pages/student/CompanyWiseKit";
import { getPlacementDrives, computeDriveMatch } from "@/data/placementDrives";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, Cell, PieChart, Pie, ComposedChart, Scatter
} from "recharts";
import {
  LogOut, Settings, TrendingUp, AlertCircle, CheckCircle, Target, Award, BookOpen,
  Briefcase, Code, GraduationCap, Zap, Star, Users, Shield, Globe, Cloud, Cpu,
  BarChart as BarChartIcon, Lock, Upload, Database, Terminal, Server, Palette,
  Smartphone, Monitor, Clock, MessageSquare, ChevronRight, ChevronLeft, ExternalLink, Download,
  Bell, User, ArrowUpRight, ArrowDownRight, Rocket, Brain, Trophy, Building2,
  FileText, Activity, CheckSquare, Circle, Plus, Search, Filter, Eye, Play,
  CheckCircle2, XCircle, AlertTriangle, Flame, Mail, Phone, MapPin, Github,
  Linkedin, Twitter, Instagram, Share2, Bookmark, LineChart as LineChartIcon, Calendar,
  TrendingDown, Edit, Upload as UploadIcon, Download as DownloadIcon, LayoutDashboard,
  Users as UsersIcon, Briefcase as BriefcaseIcon, Palette as PaletteIcon,
  Newspaper, DollarSign, CreditCard, FileCheck, Sparkles, HelpCircle, Menu, PanelLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  // Initialize tab from URL search secondary fallback to localStorage
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab");
    if (urlTab) return urlTab;
    return localStorage.getItem("student-active-tab") || "overview";
  });

  // Sync tab state to URL and localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state }, "", newUrl);
    }
    localStorage.setItem("student-active-tab", activeTab);
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [viewMode, setViewMode] = useState("radar");
  const [showProfileChecklist, setShowProfileChecklist] = useState(true);
  const isDark = theme === "dark";
  const mainContentRef = useRef<HTMLElement>(null);

  // Scroll to top when activeTab changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  // Student Profile Data
  const studentProfile = {
    name: "Rahul Sharma",
    id: "CSE-2021-001",
    email: "rahul.sharma@college.edu",
    phone: "+91 98765 43210",
    branch: "Computer Science & Engineering",
    college: "Northeastern University",
    bio: "Passionate about building scalable web applications and AI-driven solutions.",
    year: "Final Year",
    cgpa: 8.5,
    avatar: ""
  };

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };
  interface UserProfile {
    skills: string[];
    interests: string[];
    learningGoals: string[];
  }
  const onResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      toast.success(`Resume "${file.name}" uploaded successfully!`);
      // Here you would typically handle the actual file upload to a server
    }
  };
  const MOCK_USER: UserProfile = {
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript'],
    interests: ['Web Development', 'AI/ML', 'Cloud', 'DevOps'],
    learningGoals: ['Next.js', 'Docker', 'AWS']
  };
  const profileChecklist = [
    {
      label: "Setup your profile",
      completed: !!(studentProfile.name && studentProfile.phone),
      path: "/student/setting"
    },
    {
      label: "Add your profile photo",
      completed: studentProfile.avatar.startsWith("/"),
      path: "/student/setting"
    },
    {
      label: "Add your Bio",
      completed: !!studentProfile.bio,
      path: "/student/setting"
    },
    {
      label: "Add your College",
      completed: !!studentProfile.college,
      path: "/student/setting"
    },
    {
      label: "Connect your first profile",
      completed: true,
      path: "/student/setting"
    },
  ];

  // Evolution Track Data
  const evolutionData = [
    { month: "Aug", overall: 45, technical: 40, soft: 50 },
    { month: "Sep", overall: 52, technical: 45, soft: 58 },
    { month: "Oct", overall: 48, technical: 52, soft: 45 },
    { month: "Nov", overall: 61, technical: 58, soft: 65 },
    { month: "Dec", overall: 68, technical: 62, soft: 72 },
    { month: "Jan", overall: 72, technical: 68, soft: 78 },
  ];

  // Enhanced Quick Stats
  const quickStats = [
    {
      label: "Overall Readiness",
      value: "72%",
      change: "+8%",
      trend: "up",
      icon: Target,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      description: "Placement Preparedness"
    },
    {
      label: "Skills Mastered",
      value: "67%",
      change: "+17%",
      trend: "up",
      icon: Award,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      description: "Core Competencies"
    },
    {
      label: "Placement Probability",
      value: "85%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      description: "Service-Based Roles"
    },
    {
      label: "AI Confidence",
      value: "78%",
      change: "+12%",
      trend: "up",
      icon: Brain,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      description: "Goal Achievement"
    }
  ];

  // Comprehensive Skill Data
  const skillData = [
    {
      skill: "DSA",
      student: 72,
      industry: 85,
      target: 80,
      gap: 8,
      category: "Technical",
      priority: "high",
      improvement: "+8% this month"
    },
    {
      skill: "System Design",
      student: 45,
      industry: 75,
      target: 65,
      gap: 20,
      category: "Technical",
      priority: "critical",
      improvement: "+15% needed"
    },
    {
      skill: "Full Stack Dev",
      student: 75,
      industry: 82,
      target: 80,
      gap: 5,
      category: "Technical",
      priority: "medium",
      improvement: "+2% this month"
    },
    {
      skill: "Database Design",
      student: 68,
      industry: 80,
      target: 75,
      gap: 7,
      category: "Technical",
      priority: "medium",
      improvement: "+5% needed"
    },
    {
      skill: "Communication",
      student: 65,
      industry: 80,
      target: 75,
      gap: 10,
      category: "Soft Skills",
      priority: "high",
      improvement: "+10% needed"
    },
    {
      skill: "Team Projects",
      student: 70,
      industry: 85,
      target: 80,
      gap: 10,
      category: "Experience",
      priority: "medium",
      improvement: "+5% this month"
    }
  ];

  // Enhanced Radar Skill Data
  const radarSkillData = [
    { skill: "Coding", current: 72, required: 85, category: "Technical" },
    { skill: "Projects", current: 60, required: 75, category: "Experience" },
    { skill: "Communication", current: 65, required: 80, category: "Soft Skills" },
    { skill: "Problem Solving", current: 78, required: 85, category: "Technical" },
    { skill: "System Design", current: 45, required: 75, category: "Technical" },
    { skill: "Teamwork", current: 70, required: 80, category: "Soft Skills" },
    { skill: "Leadership", current: 55, required: 70, category: "Soft Skills" },
  ];

  // Placement Analysis
  const placementData = [
    {
      type: "Service-Based",
      likelihood: 92,
      avgPackage: "4-6 LPA",
      companies: 45,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-background/40 backdrop-blur-sm",
      examples: ["TCS", "Infosys", "Wipro"]
    },
    {
      type: "Product-Based",
      likelihood: 68,
      avgPackage: "8-12 LPA",
      companies: 18,
      icon: Rocket,
      color: "text-blue-600",
      bgColor: "bg-background/40 backdrop-blur-sm",
      examples: ["Flipkart", "Zomato", "Swiggy"]
    },
    {
      type: "Top MNC",
      likelihood: 45,
      avgPackage: "12-18 LPA",
      companies: 8,
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-background/40 backdrop-blur-sm",
      examples: ["Google", "Amazon", "Microsoft"]
    },
    {
      type: "Startups",
      likelihood: 78,
      avgPackage: "6-10 LPA",
      companies: 22,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-background/40 backdrop-blur-sm",
      examples: ["Razorpay", "CRED", "Groww"]
    }
  ];

  // AI-Powered Recommendations
  const recommendations = [
    {
      title: "Master System Design Fundamentals",
      description: "Focus on distributed systems, scalability patterns, and database optimization to bridge the 30% gap in this critical area.",
      source: "AI Insight",
      priority: "critical",
      impact: "High",
      estimatedTime: "4 weeks",
      category: "Technical",
      resources: ["Grokking System Design", "System Design Primer", "Designing Data-Intensive Apps"],
      completion: 20,
      actions: ["Complete URL Shortener Design", "Learn CAP Theorem", "Practice Database Scaling"]
    },
    {
      title: "Enhance Communication for Interviews",
      description: "Improve technical communication skills through mock interviews and structured problem explanation practice.",
      source: "Placement Officer",
      priority: "high",
      impact: "High",
      estimatedTime: "Ongoing",
      category: "Soft Skills",
      resources: ["Toastmasters", "Technical Communication Guide"],
      completion: 40,
      actions: ["Weekly Mock Interviews", "Record & Review Answers", "Join Speaking Club"]
    },
    {
      title: "Complete Backend Project with Scalability",
      description: "Build a production-ready backend system with microservices, caching, and load balancing to strengthen your portfolio.",
      source: "Industry Expert",
      priority: "high",
      impact: "Medium",
      estimatedTime: "6 weeks",
      category: "Projects",
      resources: ["Node.js Best Practices", "Microservices Patterns", "Docker Docs"],
      completion: 10,
      actions: ["Design Architecture", "Implement API Gateway", "Add Monitoring"]
    },
    {
      title: "Solve 100 Advanced DSA Problems",
      description: "Focus on dynamic programming, graphs, and advanced data structures to reach top-tier company standards.",
      source: "AI Insight",
      priority: "medium",
      impact: "High",
      estimatedTime: "1 month",
      category: "Technical",
      resources: ["LeetCode Premium", "Algorithms Book", "CP Platforms"],
      completion: 65,
      actions: ["Daily Problem Solving", "Participate Contests", "Review Solutions"]
    }
  ];

  // Learning Paths
  const learningPaths = [
    {
      title: "System Design Mastery",
      description: "From basics to advanced distributed systems",
      progress: 30,
      courses: 6,
      completedCourses: 2,
      estimatedTime: "2 months",
      difficulty: "Advanced",
      icon: Server,
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      modules: [
        { name: "Basics", status: "completed" },
        { name: "Scalability", status: "in-progress" },
        { name: "Databases", status: "pending" },
        { name: "Microservices", status: "pending" }
      ]
    },
    {
      title: "Full Stack Development",
      description: "End-to-end application development",
      progress: 65,
      courses: 8,
      completedCourses: 5,
      estimatedTime: "3 months",
      difficulty: "Intermediate",
      icon: Code,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      modules: [
        { name: "Frontend", status: "completed" },
        { name: "Backend", status: "in-progress" },
        { name: "DevOps", status: "pending" },
        { name: "Testing", status: "pending" }
      ]
    },
    {
      title: "Data Structures & Algorithms",
      description: "Advanced problem solving techniques",
      progress: 80,
      courses: 10,
      completedCourses: 8,
      estimatedTime: "1 month",
      difficulty: "Intermediate",
      icon: Cpu,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      modules: [
        { name: "Arrays", status: "completed" },
        { name: "Trees", status: "completed" },
        { name: "Graphs", status: "in-progress" },
        { name: "DP", status: "pending" }
      ]
    }
  ];

  // Timeline & Milestones
  const timeline = [
    {
      date: "Jan 2024",
      event: "Data Structures Course Completed",
      type: "course",
      status: "completed",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      date: "Feb 2024",
      event: "Summer Internship at TechCorp",
      type: "internship",
      status: "completed",
      icon: Briefcase,
      color: "bg-green-500"
    },
    {
      date: "Mar 2024",
      event: "E-commerce Platform Project",
      type: "project",
      status: "completed",
      icon: Code,
      color: "bg-purple-500"
    },
    {
      date: "Apr 2024",
      event: "AWS Certification",
      type: "certification",
      status: "completed",
      icon: Award,
      color: "bg-orange-500"
    },
    {
      date: "May 2024",
      event: "System Design Workshop",
      type: "workshop",
      status: "in-progress",
      icon: Server,
      color: "bg-red-500"
    },
    {
      date: "Jun 2024",
      event: "Full Stack Development Project",
      type: "project",
      status: "planned",
      icon: Rocket,
      color: "bg-indigo-500"
    }
  ];

  // Placement drives from TPO (ticket creation) — shown as "Drives" with match %
  const placementDrives = getPlacementDrives();
  const studentSkills = MOCK_USER?.skills ?? [];
  const studentBacklogs = 0; // extend studentProfile if you track backlogs
  const drivesWithMatch = placementDrives.map((d, idx) => ({
    ...d,
    match: computeDriveMatch(d, studentProfile.cgpa, studentSkills, studentBacklogs),
    color: ["bg-gradient-to-br from-blue-500 to-green-500", "bg-gradient-to-br from-orange-500 to-yellow-500", "bg-gradient-to-br from-blue-600 to-green-600", "bg-gradient-to-br from-blue-400 to-blue-600", "bg-gradient-to-br from-purple-500 to-pink-500"][idx % 5],
  }));

  // Achievements
  const achievements = [
    {
      title: "Fast Learner",
      description: "Completed 8 courses in 4 months",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Project Builder",
      description: "Built 5+ full-stack projects",
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-background/40 backdrop-blur-sm"
    },
    {
      title: "DSA Champion",
      description: "Solved 200+ coding problems",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-background/40 backdrop-blur-sm"
    },
    {
      title: "Certified Professional",
      description: "Earned 3 industry certifications",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-background/40 backdrop-blur-sm"
    }
  ];

  // Weekly Activity Data
  const weeklyActivity = [
    { day: "Mon", hours: 4, problems: 8, learning: "System Design" },
    { day: "Tue", hours: 6, problems: 12, learning: "DSA" },
    { day: "Wed", hours: 3, problems: 6, learning: "Frontend" },
    { day: "Thu", hours: 5, problems: 10, learning: "Backend" },
    { day: "Fri", hours: 4, problems: 9, learning: "Database" },
    { day: "Sat", hours: 7, problems: 15, learning: "Projects" },
    { day: "Sun", hours: 5, problems: 11, learning: "Revision" }
  ];

  // Daily Challenges
  const dailyChallenges = [
    {
      id: 1,
      title: "Solve 5 DSA Problems",
      description: "Complete 5 medium-level problems on LeetCode",
      points: 50,
      progress: 3,
      total: 5,
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      deadline: "Today"
    },
    {
      id: 2,
      title: "Complete System Design Module",
      description: "Finish the scalability patterns lesson",
      points: 75,
      progress: 80,
      total: 100,
      icon: Server,
      color: "from-purple-500 to-pink-500",
      deadline: "2 days"
    },
    {
      id: 3,
      title: "Practice Mock Interview",
      description: "Complete one technical mock interview session",
      points: 100,
      progress: 0,
      total: 1,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      deadline: "This week"
    }
  ];

  // Recent Activity Feed
  const recentActivity = [
    {
      id: 1,
      type: "achievement",
      title: "Completed Full Stack Project",
      description: "E-commerce platform with React & Node.js",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      type: "skill",
      title: "DSA Skill Improved",
      description: "Your DSA proficiency increased by 5%",
      time: "5 hours ago",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "notification",
      title: "New Job Opportunity",
      description: "Google SDE role matches your profile (78%)",
      time: "1 day ago",
      icon: Bell,
      color: "text-purple-500"
    },
    {
      id: 4,
      type: "milestone",
      title: "100 Problems Solved!",
      description: "Congratulations on reaching this milestone",
      time: "2 days ago",
      icon: Trophy,
      color: "text-amber-500"
    }
  ];

  // Quick Actions
  const quickActions = [
    {
      title: "Start Practice",
      description: "Solve coding problems",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      action: () => setActiveTab("skills")
    },
    {
      title: "Mock Interview",
      description: "Practice with AI",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      action: () => console.log("Mock Interview")
    },
    {
      title: "View Drives",
      description: "Placement drives from TPO",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      action: () => setActiveTab("opportunities")
    },
    {
      title: "Study Plan",
      description: "Generate roadmap",
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      action: () => console.log("Study Plan")
    }
  ];

  // Notifications
  const notifications = [
    {
      id: 1,
      title: "Deadline Reminder",
      message: "System Design assignment due in 2 days",
      type: "warning",
      time: "Just now",
      unread: true
    },
    {
      id: 2,
      title: "New Recommendation",
      message: "AI suggests focusing on Database Design",
      type: "info",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "Achievement Unlocked",
      message: "You've completed 10 courses this month!",
      type: "success",
      time: "3 hours ago",
      unread: false
    }
  ];



  // Upcoming Tasks
  const upcomingTasks = [
    { task: "Complete System Design Mock Interview", due: "Tomorrow", priority: "high", status: "pending" },
    { task: "Submit Backend Project Documentation", due: "2 days", priority: "high", status: "pending" },
    { task: "Practice 10 DSA Problems", due: "This week", priority: "medium", status: "in-progress" },
    { task: "Review Database Optimization Course", due: "Next week", priority: "medium", status: "pending" },
    { task: "Update Resume with Recent Projects", due: "3 days", priority: "high", status: "in-progress" }
  ];

  // Weekly Goals
  const weeklyGoals = [
    { task: "Complete 20 LeetCode Problems", completed: 15, total: 20, priority: "high" },
    { task: "Finish System Design Course Module 3", completed: 2, total: 5, priority: "high" },
    { task: "Update Resume with Recent Project", completed: 0, total: 1, priority: "medium" },
    { task: "Practice 3 Mock Interviews", completed: 1, total: 3, priority: "medium" },
  ];

  // Sidebar Links - All Student Features (All as tabs, no navigation)
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: PaletteIcon },
    { id: "opportunities", label: "Drives", icon: BriefcaseIcon },
    { id: "learning", label: "Mentorship", icon: UsersIcon },
    { id: "progress", label: "Progress", icon: TrendingUp },

    { id: "webinars", label: "Webinars", icon: Play },

    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "corporateNews", label: "Corporate News", icon: Newspaper },

    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "assessment-hub", label: "Assessment Hub", icon: Zap },
    { id: "company-kit", label: "Company Wise Kit", icon: Building2 },
  ];

  const sidebarSections: Array<{ title: string; ids: Array<(typeof sidebarLinks)[number]["id"]> }> = [
    { title: "PROFILE TRACKER", ids: ["overview", "skills"] },
    { title: "QUESTION TRACKER", ids: ["opportunities", "learning"] },
    { title: "RESOURCES", ids: ["progress", "careers", "webinars", "corporateNews"] },
    { title: "COMMUNITY", ids: ["feedback"] },
    { title: "PRACTICE & PREP", ids: ["assessment-hub", "company-kit"] },
  ];

  return (
    <div className={`flex h-screen ${isDark ? "bg-black" : "bg-background"} text-foreground font-manrope selection:bg-blue-500/30 overflow-hidden relative`}>
      {/* Premium Background Glows */}
      {isDark && (
        <div className="premium-glow-bg">
          <div className="premium-glow-1" />
          <div className="premium-glow-2" />
          <div className="premium-glow-3" />
        </div>
      )}
      {/* Mobile sidebar (drawer) */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className={`${isDark ? "bg-[#0c0c14]" : "bg-white"} p-0 w-72 [&>button]:hidden`}>
          <div className="h-full flex flex-col">
            {/* Brand */}
            <div className={`px-5 py-5 border-b ${isDark ? "border-white/10" : "border-slate-200"} flex items-center justify-between`}>
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="/NG/NextGen_light.png"
                  alt="NextGen Logo"
                  className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="min-w-0 flex flex-col justify-center">
                  <div className="font-black text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    NextGen
                  </div>
                  <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    AI-Driven
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "hover:bg-white/10 text-slate-200" : "hover:bg-slate-100 text-slate-700"}`}
                aria-label="Close menu"
                title="Close menu"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Links (clean sections like reference) */}
            <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-4">
              {sidebarSections.map((section) => (
                <div key={section.title} className="mb-4 last:mb-0">
                  <div className={`px-2 text-[11px] font-semibold tracking-widest uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {section.title}
                  </div>
                  <div className={`mt-2 mb-2 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                  <div className="space-y-1">
                    {section.ids.map((id) => {
                      const link = sidebarLinks.find((l) => l.id === id);
                      if (!link) return null;
                      const Icon = link.icon;
                      const isActive = activeTab === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            setActiveTab(link.id);
                            setIsMobileSidebarOpen(false);
                            navigate(`/student/dashboard?tab=${link.id}`);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive
                            ? isDark
                              ? "bg-white/10 text-blue-300"
                              : "bg-blue-50 text-blue-700"
                            : isDark
                              ? "text-slate-300 hover:bg-white/10"
                              : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? (isDark ? "text-blue-300" : "text-blue-700") : (isDark ? "text-slate-400" : "text-slate-500")}`} />
                          <span className="font-semibold text-sm">{link.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className={`p-4 border-t ${isDark ? "border-white/10" : "border-slate-200"} flex items-center justify-between`}>
              <ThemeToggle />
              <button
                onClick={() => {
                  localStorage.removeItem("userRole");
                  navigate("/");
                }}
                className={`p-3 rounded-xl transition-colors ${isDark ? "text-red-300 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Left */}
      <aside className={`hidden lg:flex sticky top-0 h-screen z-50 transition-all duration-500 relative overflow-visible ${isSidebarOpen ? "w-72" : "w-[6rem]"} ${isSidebarOpen ? "p-4 pr-2" : "p-3"} flex-col shrink-0 bg-transparent`}>
        <div className={`flex-1 min-w-0 h-full ${isDark ? "bg-[#0c0c14]" : "bg-white"} ${isDark ? "border-white/10" : "border-slate-200"} rounded-[2.5rem] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden relative`}>
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-blue-500/5" : "from-blue-500/5"} via-transparent ${isDark ? "to-purple-500/5" : "to-purple-500/5"} opacity-50 pointer-events-none`}></div>

          {/* Header: brand logo & name */}
          <div className={`flex items-center gap-0 relative z-10 transition-all flex-shrink-0 ${isSidebarOpen ? "px-5 pt-6 pb-4" : "p-3 py-6 justify-center"}`}>
            <div
              className="group cursor-pointer flex items-center gap-0"
              onClick={() => navigate("/")}
              title="NextGen AI-Driven Career Hub"
            >
              <img
                src="/NG/NextGen_light.png"
                alt="NextGen Logo"
                className={`${isSidebarOpen ? "h-14 w-14" : "h-12 w-12"} object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110`}
              />
              {isSidebarOpen && (
                <div className="min-w-0 animate-fadeIn overflow-hidden flex flex-col justify-center">
                  <div className="font-black text-2xl tracking-tighter leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NextGen
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"} opacity-80 whitespace-nowrap`}>
                    AI-Driven
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 min-w-0 flex flex-col overflow-y-auto sidebar-scrollbar pt-1 ${isSidebarOpen ? "px-3 pr-2" : "px-1.5"}`}>
            {sidebarSections.map((section) => (
              <div key={section.title} className={`${isSidebarOpen ? "mb-4" : "mb-2"} last:mb-0`}>
                {isSidebarOpen && (
                  <>
                    <div className={`px-2 text-[11px] font-semibold tracking-widest uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {section.title}
                    </div>
                    <div className={`mt-2 mb-2 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                  </>
                )}
                <div className={`${isSidebarOpen ? "space-y-1" : "space-y-1"}`}>
                  {section.ids.map((id) => {
                    const link = sidebarLinks.find((l) => l.id === id);
                    if (!link) return null;
                    const Icon = link.icon;
                    const isActive = activeTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          setActiveTab(link.id);
                          navigate(`/student/dashboard?tab=${link.id}`);
                        }}
                        title={link.label}
                        className={`w-full flex items-center gap-3 sm:gap-4 rounded-xl transition-all duration-200 relative flex-shrink-0 ${!isSidebarOpen ? "justify-center p-3" : "px-3 py-3"} ${isActive
                          ? isDark
                            ? "bg-blue-500/20 ring-1 ring-blue-400/40 text-blue-200"
                            : "bg-blue-100 ring-1 ring-blue-200 text-blue-800"
                          : isDark
                            ? "text-slate-300 hover:bg-white/10"
                            : "text-slate-700 hover:bg-slate-100"
                          }`}
                      >
                        <Icon className={`flex-shrink-0 transition-colors ${isSidebarOpen ? "w-5 h-5" : "w-6 h-6"} ${isActive ? (isDark ? "text-blue-300" : "text-blue-700") : (isDark ? "text-slate-400" : "text-slate-500")}`} />
                        {isSidebarOpen && <span className="font-semibold text-sm truncate min-w-0">{link.label}</span>}
                        {isSidebarOpen && isActive && (
                          <div className={`absolute left-0 w-1 h-6 rounded-r-full ${isDark ? "bg-blue-400" : "bg-blue-600"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Floating Toggle Button - Attached to Right Edge */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-6 -right-12 z-[60] h-12 w-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isDark
            ? "bg-[#0c0c14] border-white/20 text-slate-300 hover:text-white"
            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <PanelLeft className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? "" : "rotate-180"}`} />
        </button>
      </aside>

      <main
        ref={mainContentRef}
        data-scroll-container
        className={`flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar relative bg-transparent ${activeTab === "company-kit" ? "flex flex-col" : "p-4 sm:p-6 lg:p-8"}`}
      >
        <div className={`${activeTab === "company-kit" ? "w-full px-4 sm:px-6 lg:px-8" : "max-w-[1400px] mx-auto"} ${activeTab === "company-kit" ? "flex flex-col space-y-6 sm:space-y-8 lg:space-y-10 min-h-0" : "space-y-6 sm:space-y-8 lg:space-y-10"}`}>

          <header className={`flex items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8`}>
            {/* Desktop header space reserved for toggle when floating nearby */}
            <div className="hidden lg:block w-16" />

            <div className={`flex-1 min-w-0`}>
              {/* Mobile hamburger */}
              <div className="flex items-center justify-between gap-3 lg:hidden mb-3">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
                  aria-label="Open menu"
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className={`flex-1 h-px ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} tracking-tight capitalize`}>
                {sidebarLinks.find(l => l.id === activeTab)?.label || activeTab}
              </h1>
              <p className={`${isDark ? "text-blue-400" : "text-blue-600"} text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-90 mt-1 border-b-0 no-underline`}>
                {activeTab === "overview" ? "Career Readiness Dashboard" :
                  activeTab === "skills" ? "Skill Architecture Analysis" :
                    activeTab === "opportunities" ? "Placement Drives" :
                      activeTab === "learning" ? "Learning & Development" :
                        activeTab === "progress" ? "Progress & Milestones" :
                          activeTab === "careers" ? "Career Opportunities & Resources" :
                            activeTab === "webinars" ? "Live Learning Sessions" :
                                activeTab === "corporateNews" ? "Industry News & Updates" :
                                  activeTab === "feedback" ? "Share Your Feedback" :
                                    activeTab === "assessment-hub" ? "Assessment Hub — End-to-End Prep" :
                                      activeTab === "company-kit" ? "Company Wise Problems & Tracking" :
                                        "Student Portal"}
              </p>
            </div>

            {/* Premium Header Controls - Relocated for better accessibility */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quick access button to open Company Wise Kit tab from anywhere */}
              {activeTab !== "company-kit" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("company-kit");
                    const params = new URLSearchParams(window.location.search);
                    params.set("tab", "company-kit");
                    const newUrl = `${window.location.pathname}?${params.toString()}`;
                    window.history.replaceState({ ...window.history.state }, "", newUrl);
                  }}
                  className={`hidden md:flex h-11 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest gap-2 transform transition-all hover:scale-105 active:scale-95 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}
                >
                  <span>Company Wise Kit</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </Button>
              )}

              <div className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}>
                <ThemeToggle className="!h-10 !w-10 !rounded-xl border-0 bg-transparent hover:bg-transparent" />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-all relative group ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50"}`}>
                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={12} className={`w-[380px] p-0 rounded-[2rem] overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${isDark ? "bg-[#0c0c14]" : "bg-white"}`}>
                  <div className={`p-6 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"} tracking-tight`}>Profile Checklist</h3>
                      <div className={`w-10 h-10 rounded-xl ${isDark ? "bg-blue-500/10" : "bg-blue-50"} flex items-center justify-center border ${isDark ? "border-blue-500/20" : "border-blue-100"}`}>
                        <CheckCircle2 className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      </div>
                    </div>
                    <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"} font-bold uppercase tracking-widest`}>Complete these to unlock premium features</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {profileChecklist.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group/item cursor-pointer border ${isDark ? "border-white/5 hover:bg-white/5 hover:border-white/10" : "border-slate-100 hover:bg-slate-50 hover:border-slate-200"}`}
                      >
                        <div className="flex items-center gap-3">
                          {item.completed ? (
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 ${isDark ? "border-white/20" : "border-slate-300"} flex items-center justify-center transition-colors group-hover/item:border-blue-500/50`}>
                              <div className="w-4 h-4 rounded-full" />
                            </div>
                          )}
                          <span className={`font-bold text-xs ${item.completed ? (isDark ? "text-slate-500 line-through decoration-slate-700" : "text-slate-400 line-through decoration-slate-200") : (isDark ? "text-slate-200" : "text-slate-700")} group-hover/item:text-blue-500 transition-colors uppercase tracking-tight`}>
                            {item.label}
                          </span>
                        </div>
                        {item.completed ? (
                          <ChevronRight className={`w-3.5 h-3.5 ${isDark ? "text-slate-600" : "text-slate-400"} transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:text-blue-500`} />
                        ) : (
                          <ExternalLink className={`w-3.5 h-3.5 text-blue-500 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform translate-x-1`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className={`p-4 bg-slate-500/5 ${isDark ? "bg-white/5" : "bg-slate-50"} flex items-center justify-center`}>
                    <button className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-all`}>
                      Dismiss all notifications
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 focus:outline-none group">
                    <div className="relative">
                      <Avatar className={`w-11 h-11 rounded-2xl border-2 transition-all group-hover:border-blue-500/50 ${isDark ? "border-white/10" : "border-white shadow-md shadow-slate-200/50"}`}>
                        <AvatarImage src={studentProfile.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm">{studentProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? "border-[#0c0c14]" : "border-white"} bg-green-500 shadow-sm`} />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={12} className={`w-64 p-2 rounded-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? "bg-[#0c0c14] border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-white" : "bg-white border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] text-slate-900"}`}>
                  <DropdownMenuLabel className="mb-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="w-11 h-11 rounded-xl">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm">{studentProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className={`font-black text-[11px] uppercase tracking-tight`}>{studentProfile.name}</span>
                        <span className={`text-[9px] opacity-60 truncate max-w-[140px] font-bold uppercase tracking-widest`}>{studentProfile.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={`${isDark ? "bg-white/5" : "bg-slate-100"} -mx-2 my-2`} />
                  <DropdownMenuGroup className="p-1 space-y-1">
                    <DropdownMenuItem onClick={() => navigate("/student/setting")} className={`rounded-xl flex items-center gap-3 p-3 transition-all cursor-pointer ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="font-bold text-[10px] uppercase tracking-widest text-inherit">Profile Setting</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className={`${isDark ? "bg-white/5" : "bg-slate-100"} -mx-2 my-2`} />
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem("userRole");
                    navigate("/");
                  }} className={`rounded-xl flex items-center gap-3 p-3 transition-all cursor-pointer group/signout ${isDark ? "hover:bg-red-500/10 text-red-400" : "hover:bg-red-50 text-red-500"}`}>
                    <div className={`w-8 h-8 rounded-lg ${isDark ? "bg-red-500/10" : "bg-red-500/5"} flex items-center justify-center transition-colors group-hover/signout:bg-red-500/20`}>
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.15em]">Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {activeTab === "overview" && (
            <div className="space-y-10">
              {/* Hero Welcome Card */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative group`}>
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${isDark ? "bg-blue-500/5" : "bg-blue-500/5"} rounded-full -mr-80 -mt-80 blur-[150px] pointer-events-none`}></div>
                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? "bg-purple-500/5" : "bg-purple-500/5"} rounded-full -ml-60 -mb-60 blur-[100px] pointer-events-none`}></div>

                <CardContent className="p-6 sm:p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 relative z-10">
                    <div className="flex-1">
                      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} mb-3 sm:mb-4 tracking-tight leading-tight`}>
                        Welcome back,<br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {studentProfile.name.split(' ')[0]}! 👋
                        </span>
                      </h2>
                      <p className={`${isDark ? "text-blue-100/80" : "text-slate-600"} text-base sm:text-lg font-medium mb-6 sm:mb-8 max-w-2xl leading-relaxed`}>
                        Your current readiness status is <span className={`${isDark ? "text-white" : "text-slate-900"} font-extrabold px-3 py-1 rounded-lg ${isDark ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-green-50 text-green-700 border border-green-200"} transition-all`}>EXCELLENT</span>.
                        You're among the top 10% of students in your branch!
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`flex items-center gap-3 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-5 py-2.5 rounded-2xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                          <GraduationCap className={`w-6 h-6 ${isDark ? "text-blue-300" : "text-blue-600"}`} />
                          <span className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"}`}>{studentProfile.branch}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-5 py-2.5 rounded-2xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                          <Award className={`w-6 h-6 ${isDark ? "text-yellow-300" : "text-yellow-600"}`} />
                          <span className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"}`}>GPA: {studentProfile.cgpa}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-5 py-2.5 rounded-2xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                          <Target className={`w-6 h-6 ${isDark ? "text-green-300" : "text-green-600"}`} />
                          <span className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"}`}>{studentProfile.year}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 w-full lg:w-fit">
                      <Button
                        onClick={() => setActiveTab("assessment-hub")}
                        className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:opacity-90 font-black text-lg rounded-2xl flex-1 shadow-xl shadow-blue-500/30 gap-3 ring-4 ring-blue-500/20"
                      >
                        <Rocket className="w-6 h-6" />
                        Assessment Hub
                      </Button>
                      <Button
                        onClick={handleResumeClick}
                        className="
    h-14 px-8 flex-1 rounded-2xl gap-3
    bg-indigo-600 text-white
    font-semibold text-lg
    transition-all duration-300
    hover:bg-indigo-700 hover:shadow-xl
    hover:shadow-indigo-600/40
    active:scale-[0.97]
  "
                      >
                        <UploadIcon className="w-6 h-6" />
                        Resume (PDF)
                      </Button>
                      <input
                        type="file"
                        ref={resumeInputRef}
                        onChange={onResumeFileChange}
                        accept=".pdf"
                        className="hidden"
                      />

                    </div>
                  </div>
                </CardContent>
              </Card>



              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {quickStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={idx} className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-2xl xl:rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                      <CardContent className="p-5 sm:p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${stat.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                            {stat.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                            {stat.change}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs sm:text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider leading-none opacity-80`}>{stat.label}</p>
                          <p className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"} tracking-tight py-1 tabular-nums`}>{stat.value}</p>
                          <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400/60" : "text-gray-600/80"} tracking-wide`}>{stat.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Career Goal Panel + AI Recommendations */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Career Goal Panel */}
                <div className="lg:col-span-2">
                  <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[3rem] overflow-hidden shadow-2xl`}>
                    <CardContent className="p-12 space-y-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <p className={`text-sm font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-[0.4em] opacity-50`}>Focusing Role</p>
                          <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            Software Developer
                          </p>
                        </div>
                        <div className={`${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-2xl p-6 ${isDark ? "border-blue-500/20" : "border-blue-200"} flex items-center gap-6`}>
                          <div className={`w-16 h-16 ${isDark ? "bg-white/5" : "bg-white"} rounded-2xl flex items-center justify-center shadow-lg ${isDark ? "border-blue-500/20" : "border-blue-200"}`}>
                            <span className="text-2xl font-black text-blue-400">72%</span>
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>AI Readiness</p>
                            <p className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>+8% <span className="text-xs text-green-400 font-bold ml-1">UP</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <p className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>Overall Confidence</p>
                          <span className={`text-sm font-bold text-blue-400 px-3 py-1 ${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-lg tracking-wide uppercase`}>AI VERIFIED</span>
                        </div>
                        <div className={`h-4 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden shadow-inner p-1`}>
                          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" style={{ width: "72%" }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: "Technical Skills", val: "High", color: "text-blue-400", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
                          { label: "Soft Skills", val: "Medium", color: "text-amber-400", bg: isDark ? "bg-amber-500/10" : "bg-amber-50" },
                          { label: "Experience", val: "Good", color: "text-green-400", bg: isDark ? "bg-green-500/10" : "bg-green-50" }
                        ].map((item, i) => (
                          <div key={i} className={`p-4 rounded-2xl ${item.bg} ${isDark ? "border-white/5" : "border-gray-200"} flex flex-col gap-1`}>
                            <span className={`text-[11px] font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>{item.label}</span>
                            <span className={`${item.color} text-xl font-black`}>{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>


                {/* Quick Actions & Activity Feed */}
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div>
                    <h3 className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"} tracking-tighter mb-4 px-2`}>Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={idx}
                            onClick={action.action}
                            className={`p-6 ${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-2xl group hover:scale-105 transition-all cursor-pointer text-left`}
                          >
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg mb-3 group-hover:rotate-6 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"} mb-1`}>{action.title}</h4>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{action.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>


                </div>
              </div>


              {/* AI Recommendations - Top 3 */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[3rem] overflow-hidden shadow-2xl`}>
                <CardContent className="p-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className={`text-3xl font-black flex items-center gap-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                        <div className={`w-12 h-12 ${isDark ? "bg-purple-500/10" : "bg-purple-50"} rounded-2xl flex items-center justify-center`}>
                          <Brain className="w-8 h-8 text-purple-400" />
                        </div>
                        Smart AI Recommendations
                      </h3>
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"} ml-16 mt-1`}>Data-driven actions to boost your placement probability</p>
                    </div>
                    <Button variant="outline" className={`h-12 px-6 rounded-xl font-black text-sm uppercase tracking-widest gap-2 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"}`} onClick={() => setActiveTab("learning")}>
                      View Strategy
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <div key={idx} className={`group flex flex-col p-8 ${isDark ? "border-white/5 bg-white/5" : "border-gray-200 bg-gray-50"} rounded-[2rem] hover:border-blue-500/50 ${isDark ? "hover:bg-blue-500/5" : "hover:bg-blue-50"} transition-all relative overflow-hidden shadow-sm hover:shadow-xl`}>
                        {/* Priority Indicator Line */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${rec.priority === "critical" ? "bg-red-500 shadow-[0_2px_10px_rgba(239,68,68,0.3)]" :
                          rec.priority === "high" ? "bg-orange-500" : "bg-blue-500"
                          }`}></div>

                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-14 h-14 ${rec.priority === "critical" ? "bg-red-500/10 text-red-400" :
                            rec.priority === "high" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                            } rounded-2xl flex items-center justify-center shadow-inner`}>
                            {rec.priority === "critical" ? (
                              <AlertTriangle className="w-8 h-8" />
                            ) : rec.priority === "high" ? (
                              <AlertCircle className="w-8 h-8" />
                            ) : (
                              <CheckCircle className="w-8 h-8" />
                            )}
                          </div>
                          <Badge className={`${rec.priority === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            rec.priority === "high" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            } font-black text-[10px] px-3 py-1 uppercase rounded-lg shadow-lg tracking-widest`}>
                            {rec.priority}
                          </Badge>
                        </div>

                        <h4 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"} mb-4 leading-tight group-hover:text-blue-400 transition-colors`}>{rec.title}</h4>
                        <p className={`text-base font-medium ${isDark ? "text-gray-400" : "text-gray-600"} mb-8 leading-relaxed line-clamp-3`}>{rec.description}</p>

                        <div className="mt-auto space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase opacity-70`}>Progress</span>
                              <span className="text-sm font-black text-blue-400">{rec.completion}%</span>
                            </div>
                            <div className={`h-3 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden p-0.5 ${isDark ? "border-white/10" : "border-gray-300"}`}>
                              <Progress value={rec.completion} className="h-full rounded-full bg-blue-500/30" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className={`flex items-center gap-2.5 text-xs font-black ${isDark ? "text-gray-400/80" : "text-gray-600/80"} uppercase`}>
                              <Clock className="w-4 h-4 text-blue-400 opacity-60" />
                              {rec.estimatedTime}
                            </div>
                            <div className={`flex items-center gap-2.5 text-xs font-black ${isDark ? "text-gray-400/80" : "text-gray-600/80"} uppercase`}>
                              <Zap className="w-4 h-4 text-purple-400 opacity-60" />
                              {rec.impact} Impact
                            </div>
                          </div>

                          <Button className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all">
                            Start Implementation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>



            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-10">
              {/* Comprehensive Skill Analysis */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className={`text-3xl font-black flex items-center gap-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                        <div className={`w-12 h-12 ${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-2xl flex items-center justify-center`}>
                          <Zap className="w-7 h-7 text-blue-400" />
                        </div>
                        Skill Architecture
                      </h3>
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"} ml-16 mt-1`}>Holistic view of your core competencies vs. target industry standards</p>
                    </div>
                    <div className="flex bg-white/5 p-1.5 rounded-2xl gap-2 border border-white/10">
                      <Button
                        variant={viewMode === "radar" ? "default" : "ghost"}
                        className={`rounded-xl px-6 font-black text-xs uppercase tracking-widest h-11 ${viewMode === "radar" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setViewMode("radar")}
                      >
                        Radar View
                      </Button>
                      <Button
                        variant={viewMode === "bar" ? "default" : "ghost"}
                        className={`rounded-xl px-6 font-black text-xs uppercase tracking-widest h-11 ${viewMode === "bar" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setViewMode("bar")}
                      >
                        Bar View
                      </Button>
                    </div>
                  </div>
                  {/* Skill Progress Panels - Concentric Rings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                      {
                        title: "Skill Progress",
                        label: "Data Science",
                        ring1: 85,
                        ring2: 65,
                        ring3: 50,
                        colors: ["#3b82f6", "#06b6d4", "#a855f7"]
                      },
                      {
                        title: "Skill Progress",
                        label: "Soft Skills",
                        ring1: 90,
                        ring2: 75,
                        ring3: 80,
                        colors: ["#ec4899", "#8b5cf6", "#3b82f6"]
                      }
                    ].map((panel, idx) => (
                      <Card key={idx} className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[3rem] p-12 overflow-hidden group`}>
                        <h3 className={`text-sm font-black ${isDark ? "text-white/40" : "text-gray-600/60"} uppercase tracking-[0.2em] mb-12`}>{panel.title}</h3>
                        <div className="flex items-center justify-center relative">
                          <div className="w-[300px] h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                {/* Outer Ring (ring1) */}
                                <Pie
                                  data={[{ value: panel.ring1 }, { value: 100 - panel.ring1 }]}
                                  innerRadius="88%"
                                  outerRadius="100%"
                                  paddingAngle={0}
                                  dataKey="value"
                                  startAngle={90}
                                  endAngle={-270}
                                  stroke="none"
                                >
                                  <Cell fill={panel.colors[0]} />
                                  <Cell fill="rgba(255,255,255,0.03)" />
                                </Pie>

                                {/* Middle Ring (ring2) */}
                                <Pie
                                  data={[{ value: panel.ring2 }, { value: 100 - panel.ring2 }]}
                                  innerRadius="70%"
                                  outerRadius="82%"
                                  paddingAngle={0}
                                  dataKey="value"
                                  startAngle={90}
                                  endAngle={-270}
                                  stroke="none"
                                >
                                  <Cell fill={panel.colors[1]} />
                                  <Cell fill="rgba(255,255,255,0.03)" />
                                </Pie>

                                {/* Inner Ring (ring3) */}
                                <Pie
                                  data={[{ value: panel.ring3 }, { value: 100 - panel.ring3 }]}
                                  innerRadius="52%"
                                  outerRadius="64%"
                                  paddingAngle={0}
                                  dataKey="value"
                                  startAngle={90}
                                  endAngle={-270}
                                  stroke="none"
                                >
                                  <Cell fill={panel.colors[2]} />
                                  <Cell fill="rgba(255,255,255,0.03)" />
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                              <span className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"} tracking-tighter leading-tight`}>
                                {panel.label.split(' ')[0]}<br />{panel.label.split(' ')[1] || ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="h-96">
                    {viewMode === "radar" ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarSkillData}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                          <Radar
                            name="Your Skills"
                            dataKey="current"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                          <Radar
                            name="Required"
                            dataKey="required"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.2}
                          />
                          <Legend wrapperStyle={{ color: 'white' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0c0c14',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0c0c14',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', color: 'white' }} />
                          <Bar dataKey="student" fill="#3b82f6" name="Your Score" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="target" fill="#8b5cf6" name="Target Score" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="industry" fill="#22c55e" name="Industry Avg" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Skill Gaps */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <Target className="w-8 h-8 text-orange-400" />
                    <div>
                      <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Priority Skill Gaps</h3>
                      <p className={`text-base font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Areas that require immediate focus to reach target benchmarks</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillData
                      .sort((a, b) => b.gap - a.gap)
                      .slice(0, 4)
                      .map((skill, idx) => (
                        <div key={idx} className={`group p-6 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"} rounded-[2rem] hover:border-orange-500/50 ${isDark ? "hover:bg-orange-500/5" : "hover:bg-orange-50/50"} transition-all relative overflow-hidden shadow-sm`}>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${skill.priority === "critical" ? "bg-red-500/10 text-red-400" :
                                skill.priority === "high" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                                }`}>
                                <AlertTriangle className="w-7 h-7" />
                              </div>
                              <div>
                                <h4 className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"} tracking-tight`}>{skill.skill}</h4>
                                <p className={`text-xs font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-widest opacity-60`}>{skill.category}</p>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-black text-sm ${skill.priority === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                              skill.priority === "high" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              } shadow-lg`}>
                              {skill.gap}% GAP
                            </div>
                          </div>

                          <div className="space-y-6 mt-4">
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between px-1">
                                <span className={`text-xs font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-widest`}>Current Proficiency</span>
                                <span className="text-sm font-black text-blue-400">{skill.student}%</span>
                              </div>
                              <div className={`h-2.5 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden p-0.5`}>
                                <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${skill.student}%` }}></div>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between px-1">
                                <span className={`text-xs font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-widest`}>Industry Target</span>
                                <span className="text-sm font-black text-purple-400">{skill.target}%</span>
                              </div>
                              <div className={`h-2.5 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden p-0.5`}>
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${skill.target}%` }}></div>
                              </div>
                            </div>

                            <div className={`pt-4 border-t ${isDark ? "border-white/5" : "border-gray-200"} flex items-center justify-between`}>
                              <p className="text-xs font-black text-green-400 uppercase tracking-widest">{skill.improvement}</p>
                              <Button variant="ghost" className="h-8 text-[11px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10">Improve Now</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <div className="space-y-10">
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <Building2 className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Placement Drives</h3>
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Drives created by your TPO — match % based on your profile</p>
                    </div>
                  </div>

                  {drivesWithMatch.length === 0 ? (
                    <p className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>No drives yet. When your TPO creates a drive, it will appear here with JD, requirements, and your match %.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {drivesWithMatch.map((drive, idx) => (
                        <div key={drive.id} className={`group p-8 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"} rounded-[2rem] hover:border-blue-500/50 transition-all shadow-sm`}>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-5">
                              <div className={`w-16 h-16 ${drive.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <span className="text-2xl font-black text-white">{drive.companyName.charAt(0)}</span>
                              </div>
                              <div>
                                <h4 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>{drive.companyName}</h4>
                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{drive.role}</p>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-black text-sm ${isDark ? "bg-blue-500/10" : "bg-blue-50"} text-blue-400`}>
                              {drive.match}% match
                            </div>
                          </div>
                          {drive.description ? (
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-4 line-clamp-3`}>{drive.description}</p>
                          ) : null}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {drive.requirements.map((req, rIdx) => (
                              <Badge key={rIdx} variant="outline" className={`text-[10px] font-black uppercase ${isDark ? "text-gray-400 border-white/10" : "text-gray-600 border-gray-300"}`}>
                                {req}
                              </Badge>
                            ))}
                          </div>
                          <div className={`h-2 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden mb-4`}>
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                              style={{ width: `${drive.match}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-black ${isDark ? "text-gray-400" : "text-gray-600"}`}>Deadline: {drive.deadline}</span>
                            <Button
                              className="h-12 px-6 rounded-xl font-black text-sm uppercase bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => drive.applicationLink && drive.applicationLink !== "#" && window.open(drive.applicationLink, "_blank")}
                            >
                              Apply now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Placement Analysis */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"} mb-8`}>Placement Probability by Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {placementData.map((type, idx) => {
                      const Icon = type.icon;
                      return (
                        <div key={idx} className={`p-6 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"} rounded-2xl hover:border-blue-500/30 transition-all shadow-sm`}>
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-100"} flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 ${type.color}`} />
                            </div>
                            <div>
                              <h4 className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>{type.type}</h4>
                              <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{type.avgPackage}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Probability</span>
                              <span className="text-2xl font-black text-green-400">{type.likelihood}%</span>
                            </div>
                            <div className={`h-2 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden`}>
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                                style={{ width: `${type.likelihood}%` }}
                              ></div>
                            </div>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {type.companies} companies • {type.examples.join(", ")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === "learning" && (
            <div className="space-y-10">
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <GraduationCap className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                    <div>
                      <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Mastery Paths</h3>
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-slate-600"}`}>Structured learning journeys tailored for you</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {learningPaths.map((path, idx) => {
                      const Icon = path.icon;
                      return (
                        <div key={idx} className={`group p-8 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"} rounded-[2.5rem] hover:border-purple-500/50 transition-all shadow-sm`}>
                          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                            <div className={`w-20 h-20 ${path.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <Icon className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1 w-full flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{path.title}</h4>
                                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>{path.description}</p>
                                </div>
                                <span className="font-black text-purple-400">{path.progress}%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${path.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {path.modules.map((module, mIdx) => (
                              <div key={mIdx} className={`p-4 rounded-2xl text-center ${module.status === "completed" ? "bg-green-500/10 text-green-400" :
                                module.status === "in-progress" ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                                  "bg-white/5 text-gray-400"
                                }`}>
                                <p className="text-sm font-black uppercase">{module.name}</p>
                                <p className="text-xs opacity-70 mt-1">{module.status}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div className="space-y-10">
              {/* Evolution Track */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <TrendingUp className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-600"}`} />
                    <div>
                      <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Evolution Track</h3>
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-slate-600"}`}>Your readiness score progression over time</p>
                    </div>
                  </div>

                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={evolutionData}>
                        <defs>
                          <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorTechnical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 12, fontWeight: 'bold' }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 12, fontWeight: 'bold' }}
                          dx={-10}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0c0c14' : '#ffffff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                          }}
                          itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="overall"
                          stroke="#3b82f6"
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorOverall)"
                          name="Overall Readiness"
                          animationDuration={2000}
                        />
                        <Area
                          type="monotone"
                          dataKey="technical"
                          stroke="#8b5cf6"
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorTechnical)"
                          name="Technical Skills"
                          animationDuration={2500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Career Timeline + Upcoming Tasks */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Career Timeline */}
                <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                  <CardContent className="p-12">
                    <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"} mb-8`}>Career Timeline</h3>
                    <div className="relative pl-8">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>

                      {timeline.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="relative mb-6 last:mb-0">
                            <div className={`absolute -left-8 w-4 h-4 ${item.color} rounded-full border-4 border-[#050509] shadow-md`}></div>

                            <div className="ml-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.event}</h4>
                                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>{item.date}</p>
                                </div>
                                <Badge className="ml-auto capitalize bg-white/10 text-white border-white/10">
                                  {item.status === 'completed' ? 'Completed' :
                                    item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                  <CardContent className="p-12">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Upcoming Tasks</h3>
                      <span className="text-sm text-gray-400">{upcomingTasks.length} remaining</span>
                    </div>

                    <div className="space-y-4">
                      {upcomingTasks.map((task, idx) => (
                        <div key={idx} className={`p-4 ${isDark ? "border-white/5" : "border-slate-100 bg-slate-50/30"} rounded-2xl hover:border-blue-500/30 ${isDark ? "hover:bg-blue-500/5" : "hover:bg-blue-50/30"} transition-all group shadow-sm`}>
                          <div className="flex items-start gap-3">
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                              ${task.priority === 'high' ? 'bg-red-500/20' : 'bg-blue-500/20'}
                            `}>
                              {task.status === 'in-progress' ? (
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              ) : (
                                <Circle className="w-3 h-3 text-gray-400/40" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{task.task}</h4>
                                <Badge className={
                                  task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }>
                                  {task.priority === 'high' ? 'High' : 'Medium'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Due {task.due}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:bg-blue-500/10"
                                >
                                  Mark as Done
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button variant="outline" className="w-full mt-4 h-12 rounded-xl border-white/10 text-white hover:bg-white/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]`}>
                <CardContent className="p-12">
                  <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"} mb-8`}>Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`p-6 ${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-2xl border ${isDark ? "border-blue-500/20" : "border-blue-100"} shadow-sm`}>
                      <div className="text-3xl font-black text-blue-400 mb-2">+14%</div>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Overall improvement</p>
                    </div>
                    <div className={`p-6 ${isDark ? "bg-green-500/10" : "bg-green-50"} rounded-2xl border ${isDark ? "border-green-500/20" : "border-green-100"} shadow-sm`}>
                      <div className="text-3xl font-black text-green-400 mb-2">+8%</div>
                      <p className="text-sm text-gray-400">Technical Skills</p>
                    </div>
                    <div className={`p-6 ${isDark ? "bg-purple-500/10" : "bg-purple-50"} rounded-2xl border ${isDark ? "border-purple-500/20" : "border-purple-100"} shadow-sm`}>
                      <div className="text-3xl font-black text-purple-400 mb-2">+6%</div>
                      <p className="text-sm text-gray-400">Soft Skills</p>
                    </div>
                    <div className={`p-6 ${isDark ? "bg-amber-500/10" : "bg-amber-50"} rounded-2xl border ${isDark ? "border-amber-500/20" : "border-amber-100"} shadow-sm`}>
                      <div className="text-3xl font-black text-amber-400 mb-2">127</div>
                      <p className="text-sm text-gray-400">Problems Solved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Careers Tab */}
          {activeTab === "careers" && (
            <div className="space-y-10">
              <Careers />
            </div>
          )}

          {/* Webinars Tab */}
          {activeTab === "webinars" && (
            <div className="space-y-10">
              <StudentWebinar isDashboard={true} />
            </div>
          )}

          {/* Corporate News Tab */}
          {activeTab === "corporateNews" && (
            <div className="space-y-10">
              <CorporateNewsPage />
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="space-y-10">
              <StudentFeedbackForm isDashboard={true} />
            </div>
          )}

          {/* Assessment Hub Tab */}
          {activeTab === "assessment-hub" && (
            <div className="space-y-10">
              <AssessmentHub isDashboard={true} onBack={() => setActiveTab("feedback")} />
            </div>
          )}

          {/* Company Wise Kit Tab - fill viewport so list covers entire page */}
          {activeTab === "company-kit" && (
            <CompanyWiseKit isDashboard={true} />
          )}

          {/* CTA Footer - Only show on overview tab */}
          {activeTab === "overview" && (
            <div className={`bg-gradient-to-r ${isDark ? "from-blue-500/10 via-purple-500/10 to-blue-500/10" : "from-blue-50 via-purple-50 to-blue-50"} ${isDark ? "border-white/5" : "border-gray-200"} p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group mt-12 mb-4`}>
              <div className={`absolute top-0 right-0 w-96 h-96 ${isDark ? "bg-blue-500/5" : "bg-blue-500/5"} rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-all duration-700`}></div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                <div>
                  <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"} mb-3 tracking-tight`}>Ready for your next leap? 🚀</h3>
                  <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"} opacity-80`}>Accelerate your career journey with personalized AI actions.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className={`h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest ${isDark ? "border-white/30 text-white hover:bg-white/10" : "border-gray-300 text-gray-900 hover:bg-gray-100"}`}>
                    <GraduationCap className="w-6 h-6 mr-3" />
                    Mock Interview
                  </Button>
                  <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/30 gap-3 text-white">
                    <FileText className="w-6 h-6" />
                    Generate Study Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
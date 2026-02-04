import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter,
  RadialBarChart, RadialBar, Treemap
} from "recharts";
import {
  LogOut, Settings, Building2, TrendingUp, Users, FileText, DollarSign, Activity,
  AlertCircle, CheckCircle, Clock, Award, Target, Zap, ArrowUpRight, ArrowDownRight,
  Bell, Filter, Download, Search, MoreVertical, Calendar, Mail, Phone, MapPin,
  Eye, Edit, Trash2, Plus, RefreshCw, LayoutDashboard, ShieldCheck, Globe,
  HelpCircle, ChevronRight, Database, Server, Cpu, HardDrive, Wifi, Lock,
  Unlock, UserCheck, UserX, TrendingDown, BarChart3, PieChart as PieChartIcon,
  Share2, Copy, ExternalLink, Maximize2, Minimize2, AlertTriangle, Info,
  XCircle, CheckCircle2, MessageSquare, Video, Headphones, BookOpen, GraduationCap,
  Briefcase, Code, Rocket, Sparkles, Star, Heart, Bookmark, Flag, Hash, AtSign,
  Send, Upload, Image, Layers, Box, Package, ShoppingCart, CreditCard, Percent,
  Receipt, Tag, Gift, Gauge, Radio, Cloud, CloudOff, Sun, Moon, Monitor,
  Smartphone, Tablet, Laptop, Watch, Home, Navigation, Compass, Map as MapIcon,
  Route, Anchor, Plane, Ship, Car, Truck, Train, Bike, Coffee, Pizza, Music,
  Mic, Camera as CameraIcon, Film, Cast, PlayCircle, Volume2, Move, Fingerprint,
  Key, Shield, BellRing, Inbox, Archive, Folder, FolderOpen, File, Scissors,
  Clipboard, Link, Paperclip, Save, Printer, Scan, FileInput, FileOutput,
  Repeat, Shuffle, List, Grid, Columns, AlignLeft, AlignCenter,
  Bold, Italic, Underline, Type, Heading, Quote, Code2, Terminal, GitBranch,
  GitCommit, Github, Slack, Chrome, Figma, Twitter, Facebook, Instagram,
  Linkedin, Youtube, ThumbsUp, ThumbsDown, Smile, Zap as ZapIcon, Layers as LayersIcon,
  TrendingUpDown, WifiOff, ChevronDown, ChevronUp, ChevronLeft, ChevronsRight,
  MoreHorizontal, X, Check, Minus, SlidersHorizontal, ListFilter, CalendarDays,
  Timer, Hourglass, Waves, Wind, Droplets, CloudRain, Snowflake, Umbrella,
  Battery, BatteryCharging, Signal, SignalHigh, SignalLow, SignalMedium, Rss,
  Newspaper, BookMarked, Library, Users2, UserPlus, UserMinus
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import page components
import InstitutionsPage from "./Institutions";
import AnalyticsPage from "./Analytics";
import AssessmentsPage from "./Assessments";
import AdminStudents from "./Students";
import AdminReports from "./Reports";
import AdminIntegrations from "./Integration";

// ==================== TYPE DEFINITIONS ====================
interface College {
  id: number;
  name: string;
  students: number;
  placement: number;
  status: "Active" | "Warning" | "Inactive";
  plan: "Premium" | "Standard" | "Basic";
  revenue: string;
  lastActive: string;
  location: string;
  email: string;
  phone: string;
  established: number;
  type: string;
  rating: number;
  growth: number;
  courses: number;
  faculty: number;
  activeProjects: number;
  completionRate: number;
  engagement: number;
  retention: number;
  satisfaction: number;
}

interface MetricCard {
  label: string;
  value: string;
  change: string;
  percentage: number;
  trend: "up" | "down";
  icon: any;
  color: string;
  bgColor: string;
  gradient: string;
  description: string;
  target: number;
  current: number;
}

interface Activity {
  id: number;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  time: string;
  user: string;
  icon: any;
}

// ==================== MAIN COMPONENT ====================
export default function EnterpriseAdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();

  // ==================== STATE MANAGEMENT ====================
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  // Persist which admin tab was last open (overview, students, etc.) so refresh keeps you there
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "overview";
    return window.localStorage.getItem("adminActiveTab") || "overview";
  });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState(1247);
  const [systemLoad, setSystemLoad] = useState(42);
  const [apiCalls, setApiCalls] = useState(15420);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<College | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [performanceView, setPerformanceView] = useState<"overview" | "detailed">("overview");
  const [showAddInstitution, setShowAddInstitution] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    type: "",
    established: "",
    plan: "Standard" as "Premium" | "Standard" | "Basic"
  });

  // Persist active admin tab so refresh keeps the user on the same section
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("adminActiveTab", activeTab);
    }
  }, [activeTab]);

  // ==================== REAL-TIME UPDATES ====================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setActiveUsers(prev => Math.max(800, Math.min(2000, prev + Math.floor(Math.random() * 20 - 10))));
      setSystemLoad(prev => Math.max(20, Math.min(95, prev + Math.random() * 6 - 3)));
      setApiCalls(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // ==================== KEYBOARD SHORTCUTS ====================
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setSelectedCollege(null);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!isSidebarOpen);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen]);

  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 20
      }
    }
  };

  const slideInVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const scaleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 150 }
    }
  };

  // ==================== DATA DEFINITIONS ====================
  const collegeStats: MetricCard[] = [
    {
      label: "Active Institutions",
      value: "24",
      change: "+3",
      percentage: 12.5,
      trend: "up",
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500 to-cyan-500",
      description: "New partnerships this month",
      target: 30,
      current: 24
    },
    {
      label: "Total Students",
      value: "28,540",
      change: "+1,420",
      percentage: 5.2,
      trend: "up",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      gradient: "from-emerald-500 to-teal-500",
      description: "Enrolled this semester",
      target: 30000,
      current: 28540
    },
    {
      label: "Platform Adoption",
      value: "89%",
      change: "+4%",
      percentage: 4.7,
      trend: "up",
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      gradient: "from-indigo-500 to-purple-500",
      description: "Weekly active usage",
      target: 100,
      current: 89
    },
    {
      label: "Avg Placement",
      value: "86%",
      change: "+2%",
      percentage: 2.4,
      trend: "up",
      icon: Award,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      gradient: "from-amber-500 to-orange-500",
      description: "Campus recruitment success",
      target: 95,
      current: 86
    },
    {
      label: "Revenue MTD",
      value: "₹24.5L",
      change: "+₹2.3L",
      percentage: 10.3,
      trend: "up",
      icon: DollarSign,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      gradient: "from-rose-500 to-pink-500",
      description: "Monthly recurring revenue",
      target: 30,
      current: 24.5
    },
    {
      label: "API Uptime",
      value: "99.9%",
      change: "+0.1%",
      percentage: 0.1,
      trend: "up",
      icon: Server,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      gradient: "from-violet-500 to-purple-500",
      description: "Service level agreement",
      target: 100,
      current: 99.9
    },
    {
      label: "Support Tickets",
      value: "142",
      change: "-28",
      percentage: 16.5,
      trend: "down",
      icon: MessageSquare,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      gradient: "from-sky-500 to-blue-500",
      description: "Resolved this week",
      target: 100,
      current: 142
    },
    {
      label: "Data Processed",
      value: "2.4TB",
      change: "+340GB",
      percentage: 16.5,
      trend: "up",
      icon: Database,
      color: "text-fuchsia-500",
      bgColor: "bg-fuchsia-500/10",
      gradient: "from-fuchsia-500 to-pink-500",
      description: "Total data in last 30 days",
      target: 3,
      current: 2.4
    },
  ];

  const collegeList: College[] = [
    {
      id: 1,
      name: "IIT Delhi",
      students: 2400,
      placement: 94,
      status: "Active",
      plan: "Premium",
      revenue: "₹2.5L",
      lastActive: "2h ago",
      location: "New Delhi",
      email: "admin@iitd.ac.in",
      phone: "+91 11 2659 1000",
      established: 1961,
      type: "Engineering",
      rating: 4.8,
      growth: 12,
      courses: 48,
      faculty: 420,
      activeProjects: 156,
      completionRate: 92,
      engagement: 88,
      retention: 96,
      satisfaction: 4.7
    },
    {
      id: 2,
      name: "NIT Bangalore",
      students: 2100,
      placement: 88,
      status: "Active",
      plan: "Premium",
      revenue: "₹2.2L",
      lastActive: "5h ago",
      location: "Bangalore",
      email: "admin@nitb.ac.in",
      phone: "+91 80 2321 1000",
      established: 1960,
      type: "Engineering",
      rating: 4.6,
      growth: 8,
      courses: 42,
      faculty: 380,
      activeProjects: 134,
      completionRate: 89,
      engagement: 85,
      retention: 94,
      satisfaction: 4.5
    },
    {
      id: 3,
      name: "BITS Pilani",
      students: 1800,
      placement: 92,
      status: "Active",
      plan: "Premium",
      revenue: "₹1.9L",
      lastActive: "1d ago",
      location: "Pilani",
      email: "admin@bits-pilani.ac.in",
      phone: "+91 1596 245073",
      established: 1964,
      type: "Engineering",
      rating: 4.7,
      growth: 10,
      courses: 45,
      faculty: 390,
      activeProjects: 142,
      completionRate: 91,
      engagement: 87,
      retention: 95,
      satisfaction: 4.6
    },
    {
      id: 4,
      name: "VIT University",
      students: 3200,
      placement: 85,
      status: "Active",
      plan: "Premium",
      revenue: "₹3.2L",
      lastActive: "3h ago",
      location: "Vellore",
      email: "admin@vit.ac.in",
      phone: "+91 416 220 2000",
      established: 1984,
      type: "Engineering",
      rating: 4.5,
      growth: 15,
      courses: 52,
      faculty: 480,
      activeProjects: 178,
      completionRate: 87,
      engagement: 82,
      retention: 93,
      satisfaction: 4.4
    },
    {
      id: 5,
      name: "SRM University",
      students: 2800,
      placement: 82,
      status: "Active",
      plan: "Standard",
      revenue: "₹2.8L",
      lastActive: "6h ago",
      location: "Chennai",
      email: "admin@srm.ac.in",
      phone: "+91 44 2741 7000",
      established: 1985,
      type: "Engineering",
      rating: 4.3,
      growth: 7,
      courses: 38,
      faculty: 410,
      activeProjects: 142,
      completionRate: 84,
      engagement: 79,
      retention: 91,
      satisfaction: 4.2
    },
    {
      id: 6,
      name: "Manipal University",
      students: 2600,
      placement: 87,
      status: "Active",
      plan: "Premium",
      revenue: "₹2.6L",
      lastActive: "4h ago",
      location: "Manipal",
      email: "admin@manipal.edu",
      phone: "+91 820 292 3000",
      established: 1953,
      type: "Multi-disciplinary",
      rating: 4.6,
      growth: 9,
      courses: 56,
      faculty: 450,
      activeProjects: 165,
      completionRate: 88,
      engagement: 84,
      retention: 94,
      satisfaction: 4.5
    },
    {
      id: 7,
      name: "Amity University",
      students: 3100,
      placement: 80,
      status: "Warning",
      plan: "Standard",
      revenue: "₹3.1L",
      lastActive: "12h ago",
      location: "Noida",
      email: "admin@amity.edu",
      phone: "+91 120 471 5000",
      established: 2005,
      type: "Multi-disciplinary",
      rating: 4.2,
      growth: 5,
      courses: 60,
      faculty: 520,
      activeProjects: 158,
      completionRate: 81,
      engagement: 76,
      retention: 89,
      satisfaction: 4.1
    },
    {
      id: 8,
      name: "IIIT Hyderabad",
      students: 1500,
      placement: 96,
      status: "Active",
      plan: "Premium",
      revenue: "₹1.8L",
      lastActive: "1h ago",
      location: "Hyderabad",
      email: "admin@iiit.ac.in",
      phone: "+91 40 6653 1000",
      established: 1998,
      type: "IT & CS",
      rating: 4.9,
      growth: 14,
      courses: 28,
      faculty: 280,
      activeProjects: 124,
      completionRate: 95,
      engagement: 92,
      retention: 98,
      satisfaction: 4.8
    },
    {
      id: 9,
      name: "Anna University",
      students: 2900,
      placement: 83,
      status: "Active",
      plan: "Standard",
      revenue: "₹2.7L",
      lastActive: "8h ago",
      location: "Chennai",
      email: "admin@annauniv.edu",
      phone: "+91 44 2235 8661",
      established: 1978,
      type: "Engineering",
      rating: 4.4,
      growth: 6,
      courses: 44,
      faculty: 430,
      activeProjects: 148,
      completionRate: 85,
      engagement: 80,
      retention: 92,
      satisfaction: 4.3
    },
    {
      id: 10,
      name: "DTU Delhi",
      students: 2200,
      placement: 90,
      status: "Active",
      plan: "Premium",
      revenue: "₹2.3L",
      lastActive: "3h ago",
      location: "New Delhi",
      email: "admin@dtu.ac.in",
      phone: "+91 11 2787 1023",
      established: 1941,
      type: "Engineering",
      rating: 4.7,
      growth: 11,
      courses: 40,
      faculty: 370,
      activeProjects: 138,
      completionRate: 90,
      engagement: 86,
      retention: 95,
      satisfaction: 4.6
    },
  ];

  const usageMetrics = [
    {
      month: "Jan",
      colleges: 18,
      students: 22000,
      assessments: 15000,
      revenue: 18.5,
      engagement: 78,
      growth: 5,
      activeUsers: 18400,
      apiCalls: 1240000,
      satisfaction: 4.2
    },
    {
      month: "Feb",
      colleges: 20,
      students: 24500,
      assessments: 18000,
      revenue: 20.2,
      engagement: 82,
      growth: 8,
      activeUsers: 20100,
      apiCalls: 1580000,
      satisfaction: 4.3
    },
    {
      month: "Mar",
      colleges: 22,
      students: 26800,
      assessments: 20500,
      revenue: 22.8,
      engagement: 85,
      growth: 10,
      activeUsers: 22340,
      apiCalls: 1920000,
      satisfaction: 4.4
    },
    {
      month: "Apr",
      colleges: 24,
      students: 28540,
      assessments: 22000,
      revenue: 24.5,
      engagement: 88,
      growth: 12,
      activeUsers: 24250,
      apiCalls: 2180000,
      satisfaction: 4.5
    },
    {
      month: "May",
      colleges: 24,
      students: 29100,
      assessments: 23500,
      revenue: 25.8,
      engagement: 90,
      growth: 11,
      activeUsers: 25100,
      apiCalls: 2340000,
      satisfaction: 4.6
    },
    {
      month: "Jun",
      colleges: 26,
      students: 30200,
      assessments: 25000,
      revenue: 27.2,
      engagement: 91,
      growth: 13,
      activeUsers: 26400,
      apiCalls: 2520000,
      satisfaction: 4.6
    },
  ];

  const weeklyData = [
    { day: "Mon", active: 1820, new: 142, churned: 28, revenue: 5.2, engagement: 82 },
    { day: "Tue", active: 2140, new: 186, churned: 31, revenue: 6.1, engagement: 85 },
    { day: "Wed", active: 2450, new: 224, churned: 19, revenue: 7.3, engagement: 88 },
    { day: "Thu", active: 2280, new: 198, churned: 24, revenue: 6.8, engagement: 86 },
    { day: "Fri", active: 2680, new: 267, churned: 22, revenue: 8.2, engagement: 91 },
    { day: "Sat", active: 1540, new: 124, churned: 35, revenue: 4.5, engagement: 76 },
    { day: "Sun", active: 1120, new: 89, churned: 41, revenue: 3.2, engagement: 68 },
  ];

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    users: Math.floor(Math.random() * 1000) + 200,
    load: Math.floor(Math.random() * 60) + 20,
    apiCalls: Math.floor(Math.random() * 50000) + 10000
  }));

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "institutions", label: "Institutions", icon: Building2, badge: "24" },
    { id: "analytics", label: "Analytics", icon: Activity, badge: null },
    { id: "students", label: "Students", icon: Users, badge: "28.5K" },
    { id: "assessments", label: "Assessments", icon: FileText, badge: "142" },
    { id: "reports", label: "Reports", icon: BarChart3, badge: null },
    { id: "security", label: "Security", icon: ShieldCheck, badge: "2" },
    { id: "integrations", label: "Integrations", icon: Layers, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  const modelPerformance = [
    { metric: "Prediction Accuracy", value: 87, target: 90, status: "warning", change: 2.1 },
    { metric: "User Adoption", value: 89, target: 85, status: "success", change: 4.3 },
    { metric: "Data Quality", value: 92, target: 95, status: "warning", change: 1.8 },
    { metric: "Response Time", value: 95, target: 90, status: "success", change: 3.2 },
    { metric: "Model Drift", value: 6, target: 5, status: "error", change: -0.8 },
    { metric: "F1 Score", value: 91, target: 88, status: "success", change: 2.4 },
  ];

  const systemHealth = [
    {
      component: "API Gateway",
      status: "Operational",
      uptime: "99.9%",
      load: "42%",
      latency: "12ms",
      requests: "2.4M/day",
      errors: "0.01%"
    },
    {
      component: "AI Processing",
      status: "Operational",
      uptime: "99.7%",
      load: "68%",
      latency: "145ms",
      requests: "840K/day",
      errors: "0.03%"
    },
    {
      component: "Database Cluster",
      status: "Operational",
      uptime: "99.8%",
      load: "24%",
      latency: "8ms",
      requests: "5.2M/day",
      errors: "0.00%"
    },
    {
      component: "Storage Node",
      status: "Degraded",
      uptime: "98.5%",
      load: "89%",
      latency: "28ms",
      requests: "1.8M/day",
      errors: "0.12%"
    },
    {
      component: "Cache Layer",
      status: "Operational",
      uptime: "99.9%",
      load: "34%",
      latency: "2ms",
      requests: "12.4M/day",
      errors: "0.00%"
    },
    {
      component: "CDN Network",
      status: "Operational",
      uptime: "100%",
      load: "18%",
      latency: "45ms",
      requests: "8.6M/day",
      errors: "0.00%"
    },
  ];

  const recentActivity: Activity[] = [
    {
      id: 1,
      type: "success",
      title: "New Institution Onboarded",
      description: "IIIT Hyderabad successfully integrated",
      time: "2 minutes ago",
      user: "System",
      icon: Building2
    },
    {
      id: 2,
      type: "warning",
      title: "High Load Detected",
      description: "Storage node reaching capacity threshold",
      time: "15 minutes ago",
      user: "AutoMonitor",
      icon: AlertTriangle
    },
    {
      id: 3,
      type: "info",
      title: "Weekly Report Generated",
      description: "Analytics report for April Week 1 ready",
      time: "1 hour ago",
      user: "ReportBot",
      icon: FileText
    },
    {
      id: 4,
      type: "success",
      title: "Security Patch Applied",
      description: "All systems updated to v4.2.1",
      time: "2 hours ago",
      user: "DevOps",
      icon: ShieldCheck
    },
    {
      id: 5,
      type: "error",
      title: "Failed Login Attempt",
      description: "Multiple failed attempts from IP 192.168.1.42",
      time: "3 hours ago",
      user: "Security",
      icon: Lock
    },
    {
      id: 6,
      type: "info",
      title: "Backup Completed",
      description: "Daily database backup successful (2.4TB)",
      time: "5 hours ago",
      user: "BackupService",
      icon: Database
    },
    {
      id: 7,
      type: "success",
      title: "API Optimization",
      description: "Response time improved by 15%",
      time: "6 hours ago",
      user: "Engineering",
      icon: Zap
    },
    {
      id: 8,
      type: "info",
      title: "New Feature Released",
      description: "Advanced analytics dashboard v2.0",
      time: "8 hours ago",
      user: "Product",
      icon: Rocket
    },
  ];

  const topPerformers = [
    { name: "IIIT Hyderabad", score: 96, students: 1500, growth: 14, color: "#3b82f6" },
    { name: "IIT Delhi", score: 94, students: 2400, growth: 12, color: "#8b5cf6" },
    { name: "BITS Pilani", score: 92, students: 1800, growth: 10, color: "#ec4899" },
    { name: "DTU Delhi", score: 90, students: 2200, growth: 11, color: "#f59e0b" },
    { name: "NIT Bangalore", score: 88, students: 2100, growth: 8, color: "#10b981" },
  ];

  const securityEvents = [
    { type: "Threat Blocked", count: 1247, severity: "high", trend: "down", color: "text-rose-500" },
    { type: "Anomaly Detected", count: 42, severity: "medium", trend: "stable", color: "text-amber-500" },
    { type: "Patches Applied", count: 156, severity: "low", trend: "up", color: "text-emerald-500" },
    { type: "Vulnerabilities", count: 3, severity: "critical", trend: "down", color: "text-rose-600" },
  ];

  const geographicData = [
    { region: "North", colleges: 8, students: 12400, revenue: 9.8, growth: 12, color: "#3b82f6" },
    { region: "South", colleges: 10, students: 11200, revenue: 8.4, growth: 15, color: "#8b5cf6" },
    { region: "East", colleges: 3, students: 2340, revenue: 3.2, growth: 8, color: "#10b981" },
    { region: "West", colleges: 3, students: 2600, revenue: 3.1, growth: 6, color: "#f59e0b" },
  ];

  const apiMetrics = [
    { endpoint: "/api/assessments", calls: 1240000, latency: 45, errors: 120, success: 99.99 },
    { endpoint: "/api/students", calls: 980000, latency: 32, errors: 98, success: 99.99 },
    { endpoint: "/api/colleges", calls: 560000, latency: 28, errors: 45, success: 99.99 },
    { endpoint: "/api/analytics", calls: 420000, latency: 156, errors: 234, success: 99.94 },
    { endpoint: "/api/reports", calls: 320000, latency: 89, errors: 67, success: 99.98 },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Institution", color: "blue", action: () => setShowAddInstitution(true) },
    { icon: Upload, label: "Import Data", color: "emerald", action: () => setShowImportDialog(true) },
    { icon: Download, label: "Export Report", color: "indigo", action: () => handleExport() },
    { icon: RefreshCw, label: "Sync Data", color: "amber", action: () => handleRefresh() },
    { icon: Bell, label: "Send Alert", color: "rose", action: () => toast.info("Alert sent to all institutions") },
    { icon: Settings, label: "Configure", color: "violet", action: () => handleSettings() },
  ];

  const revenueByPlan = [
    { plan: "Premium", value: 68, amount: 16.5, color: "#3b82f6" },
    { plan: "Standard", value: 22, amount: 5.4, color: "#8b5cf6" },
    { plan: "Basic", value: 10, amount: 2.6, color: "#f43f5e" },
  ];

  const userEngagement = [
    { time: "00:00", users: 420, sessions: 380 },
    { time: "04:00", users: 180, sessions: 150 },
    { time: "08:00", users: 840, sessions: 720 },
    { time: "12:00", users: 1240, sessions: 1050 },
    { time: "16:00", users: 1680, sessions: 1420 },
    { time: "20:00", users: 980, sessions: 840 },
  ];

  const completionRates = [
    { category: "Assessments", rate: 92, target: 95, completed: 20240, total: 22000 },
    { category: "Courses", rate: 87, target: 90, completed: 17400, total: 20000 },
    { category: "Projects", rate: 89, target: 85, completed: 8900, total: 10000 },
    { category: "Certifications", rate: 94, target: 90, completed: 4700, total: 5000 },
  ];

  const radarData = [
    { subject: "Performance", A: 120, B: 110, fullMark: 150 },
    { subject: "Engagement", A: 98, B: 130, fullMark: 150 },
    { subject: "Quality", A: 86, B: 130, fullMark: 150 },
    { subject: "Support", A: 99, B: 100, fullMark: 150 },
    { subject: "Innovation", A: 85, B: 90, fullMark: 150 },
    { subject: "Satisfaction", A: 65, B: 85, fullMark: 150 },
  ];

  const deviceBreakdown = [
    { name: "Desktop", value: 45, icon: Monitor },
    { name: "Mobile", value: 35, icon: Smartphone },
    { name: "Tablet", value: 20, icon: Tablet },
  ];

  const trafficSources = [
    { source: "Direct", visits: 45000, conversion: 3.2, color: "#3b82f6" },
    { source: "Organic Search", visits: 32000, conversion: 4.1, color: "#10b981" },
    { source: "Social Media", visits: 18000, conversion: 2.8, color: "#ec4899" },
    { source: "Referral", visits: 12000, conversion: 3.5, color: "#f59e0b" },
    { source: "Email", visits: 8000, conversion: 5.2, color: "#8b5cf6" },
  ];

  const notificationsList = [
    { id: 1, title: "New student enrollment", time: "5 min ago", read: false, icon: UserPlus, color: "blue" },
    { id: 2, title: "System maintenance scheduled", time: "1 hour ago", read: false, icon: Settings, color: "amber" },
    { id: 3, title: "Monthly report ready", time: "2 hours ago", read: true, icon: FileText, color: "emerald" },
    { id: 4, title: "Security alert resolved", time: "5 hours ago", read: true, icon: ShieldCheck, color: "violet" },
  ];

  // ==================== COMPUTED VALUES ====================
  const filteredColleges = useMemo(() => {
    return collegeList.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || college.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus]);

  const totalRevenue = useMemo(() => {
    return collegeList.reduce((sum, college) => {
      const amount = parseFloat(college.revenue.replace('₹', '').replace('L', '')) * 100000;
      return sum + amount;
    }, 0);
  }, []);

  const averageRating = useMemo(() => {
    return collegeList.reduce((sum, college) => sum + college.rating, 0) / collegeList.length;
  }, []);

  // ==================== HANDLERS ====================
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  }, []);

  const handleExport = useCallback(() => {
    setIsExporting(true);
    toast.loading("Exporting report...", { id: "export" });

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Report exported successfully!", { id: "export" });

      // Create CSV content
      const csvContent = [
        ["Institution", "Students", "Placement %", "Status", "Plan", "Revenue"],
        ...collegeList.map(college => [
          college.name,
          college.students.toString(),
          college.placement.toString(),
          college.status,
          college.plan,
          college.revenue
        ])
      ].map(row => row.join(",")).join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1500);
  }, [collegeList]);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.loading("Importing data...", { id: "import" });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Simulate processing
        setTimeout(() => {
          toast.success(`Successfully imported ${file.name}`, { id: "import" });
          setShowImportDialog(false);
        }, 2000);
      } catch (error) {
        toast.error("Failed to import file. Please check the format.", { id: "import" });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleAddInstitution = useCallback(() => {
    if (!institutionForm.name || !institutionForm.email || !institutionForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.loading("Adding institution...", { id: "add-institution" });

    // Simulate API call
    setTimeout(() => {
      toast.success(`${institutionForm.name} has been added successfully!`, { id: "add-institution" });
      setShowAddInstitution(false);
      setInstitutionForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        type: "",
        established: "",
        plan: "Standard"
      });
    }, 1500);
  }, [institutionForm]);

  const handleDeleteInstitution = useCallback((id: number, name: string) => {
    toast.loading("Deleting institution...", { id: `delete-${id}` });
    setTimeout(() => {
      toast.success(`${name} has been removed`, { id: `delete-${id}` });
    }, 1000);
  }, []);

  const handleCollegeClick = useCallback((college: College) => {
    setSelectedInstitution(college);
  }, []);

  const handleLogout = useCallback(() => {
    toast.loading("Logging out...", { id: "logout" });
    setTimeout(() => {
      // Clear any stored authentication data if needed
      // localStorage.removeItem('authToken');
      // sessionStorage.clear();
      toast.success("Logged out successfully", { id: "logout" });
      navigate("/");
    }, 500);
  }, [navigate]);

  const handleSettings = useCallback(() => {
    navigate("/admin/setting");
  }, [navigate]);

  // Command palette commands
  const commands = useMemo(() => [
    {
      category: "Navigation",
      items: [
        { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, action: () => { setActiveTab("overview"); setShowCommandPalette(false); } },
        { id: "institutions", label: "View Institutions", icon: Building2, action: () => { setActiveTab("institutions"); setShowCommandPalette(false); } },
        { id: "analytics", label: "Open Analytics", icon: BarChart3, action: () => { setActiveTab("analytics"); setShowCommandPalette(false); } },
        { id: "settings", label: "Open Settings", icon: Settings, action: () => { handleSettings(); setShowCommandPalette(false); } },
      ]
    },
    {
      category: "Actions",
      items: [
        { id: "add-institution", label: "Add Institution", icon: Plus, action: () => { setShowAddInstitution(true); setShowCommandPalette(false); } },
        { id: "import-data", label: "Import Data", icon: Upload, action: () => { setShowImportDialog(true); setShowCommandPalette(false); } },
        { id: "export-report", label: "Export Report", icon: Download, action: () => { handleExport(); setShowCommandPalette(false); } },
        { id: "refresh", label: "Refresh Data", icon: RefreshCw, action: () => { handleRefresh(); setShowCommandPalette(false); } },
      ]
    },
    {
      category: "System",
      items: [
        { id: "logout", label: "Logout", icon: LogOut, action: () => { handleLogout(); setShowCommandPalette(false); } },
        { id: "fullscreen", label: "Toggle Fullscreen", icon: isFullscreen ? Minimize2 : Maximize2, action: () => { setIsFullscreen(!isFullscreen); setShowCommandPalette(false); } },
      ]
    }
  ], [handleSettings, handleExport, handleRefresh, handleLogout, isFullscreen]);

  const filteredCommands = useMemo(() => {
    if (!commandSearch) return commands;
    const searchLower = commandSearch.toLowerCase();
    return commands.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.label.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      )
    })).filter(category => category.items.length > 0);
  }, [commandSearch, commands]);

  // Enhanced sorting
  const sortedColleges = useMemo(() => {
    const filtered = filteredColleges;
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "students":
          return b.students - a.students;
        case "placement":
          return b.placement - a.placement;
        case "revenue":
          const aRev = parseFloat(a.revenue.replace('₹', '').replace('L', ''));
          const bRev = parseFloat(b.revenue.replace('₹', '').replace('L', ''));
          return bRev - aRev;
        default:
          return 0;
      }
    });
  }, [filteredColleges, sortBy]);

  // ==================== RENDER ====================
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0b0e]' : 'bg-slate-50'} transition-colors duration-500 flex overflow-hidden`}>

      {/* ==================== ENHANCED SIDEBAR ==================== */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className={`fixed left-0 top-0 h-screen z-50 border-r ${isDark ? 'border-white/5 bg-black/60' : 'border-slate-200 bg-white/95'
          } backdrop-blur-2xl flex flex-col shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-4 mb-4 border-b border-white/5">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-blue-500/30 cursor-pointer"
          >
            <Zap className="w-7 h-7 text-white drop-shadow-lg" />
          </motion.div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="overflow-hidden"
              >
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  NextGen
                </span>
                <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mt-0.5">
                  Enterprise Command
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
          {sidebarLinks.map((link, idx) => (
            <motion.button
              key={link.id}
              onClick={() => {
                if (link.id === "settings") {
                  handleSettings();
                } else {
                  setActiveTab(link.id);
                }
              }}
              whileHover={{ x: isSidebarOpen ? 4 : 0, scale: isSidebarOpen ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative group ${activeTab === link.id
                ? `${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'} shadow-lg shadow-blue-500/10`
                : `${isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`
                }`}
            >
              <link.icon className={`w-5 h-5 transition-all duration-300 ${activeTab === link.id ? 'text-blue-500 scale-110' : 'group-hover:scale-110'
                }`} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="font-bold text-sm">{link.label}</span>
                    {link.badge && (
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${activeTab === link.id
                        ? 'bg-blue-500 text-white'
                        : `${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-600'}`
                        }`}>
                        {link.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {activeTab === link.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* User Profile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 m-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-white/20 shadow-lg overflow-hidden flex-shrink-0">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin+User&background=8b5cf6&color=fff&bold=true"
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">Admin User</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Super Administrator</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs font-bold rounded-lg"
                  onClick={handleSettings}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs font-bold rounded-lg text-rose-500 hover:text-rose-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
              }`}
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
            {isSidebarOpen && <span className="font-bold text-sm">Collapse</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[88px]'
          } relative`}
      >
        {/* ==================== ENHANCED HEADER ==================== */}
        {activeTab === "overview" && (
          <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/60 border-slate-200'
            } shadow-lg`}>
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                      </span>
                      <motion.span
                        animate={{
                          rotate: [0, 14, -8, 14, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="text-3xl"
                      >
                        👋
                      </motion.span>
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        />
                        All Systems Operational
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {currentTime.toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    <span className="mx-2">•</span>
                    <Users className="w-3.5 h-3.5" />
                    {activeUsers.toLocaleString()} active users
                  </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                  {/* Enhanced Search */}
                  <div className="relative group">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'
                      }`} />
                    <input
                      type="text"
                      placeholder="Search anything... (⌘K)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowCommandPalette(true)}
                      className={`pl-10 pr-16 py-2.5 rounded-xl text-sm border-2 focus:outline-none transition-all w-80 font-medium ${isDark
                        ? 'bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-white/10'
                        : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'
                        }`}
                    />
                    <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-bold ${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-500'
                      }`}>
                      ⌘K
                    </kbd>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                    } shadow-lg`}>
                    <ThemeToggle />
                    <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                    {/* Notifications */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative rounded-lg h-9 w-9"
                      >
                        <Bell className="w-4 h-4" />
                        {notifications > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-background"
                          >
                            {notifications}
                          </motion.span>
                        )}
                      </Button>

                      {/* Notifications Dropdown */}
                      <AnimatePresence>
                        {showNotifications && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
                              }`}
                          >
                            <div className="p-4 border-b border-white/5">
                              <h3 className="font-black text-sm">Notifications</h3>
                              <p className="text-xs text-muted-foreground">You have {notifications} unread messages</p>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                              {notificationsList.map((notif) => (
                                <motion.div
                                  key={notif.id}
                                  whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                  className={`p-4 border-b border-white/5 cursor-pointer ${!notif.read ? 'bg-blue-500/5' : ''}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${notif.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                      notif.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                                        notif.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                          'bg-violet-500/10 text-violet-500'
                                      }`}>
                                      <notif.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-sm">{notif.title}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                                    </div>
                                    {!notif.read && (
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <div className="p-3 border-t border-white/5">
                              <Button variant="ghost" size="sm" className="w-full text-xs font-bold">
                                View All Notifications
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="rounded-lg h-9 w-9"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* User Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer relative"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-white/20 shadow-xl overflow-hidden">
                      <img
                        src="https://ui-avatars.com/api/?name=Admin+User&background=8b5cf6&color=fff&bold=true"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* User Menu Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
                            }`}
                        >
                          <div className="p-4 border-b border-white/5">
                            <p className="font-black text-sm">Admin User</p>
                            <p className="text-xs text-muted-foreground">admin@nextgen.com</p>
                          </div>
                          <div className="p-2">
                            {[
                              { icon: Users2, label: "Profile", action: () => { } },
                              { icon: Settings, label: "Settings", action: handleSettings },
                              { icon: HelpCircle, label: "Help & Support", action: () => { navigate('/HelpCenter'); } },
                            ].map((item, idx) => (
                              <Button
                                key={idx}
                                variant="ghost"
                                className="w-full justify-start text-sm font-bold rounded-lg"
                                onClick={item.action}
                              >
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.label}
                              </Button>
                            ))}
                          </div>
                          <div className="p-2 border-t border-white/5">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm font-bold rounded-lg text-rose-500 hover:text-rose-600"
                              onClick={handleLogout || navigate('/Home')}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className={`px-8 py-3 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50/50'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {[
                    { icon: Server, label: "Load", value: `${systemLoad.toFixed(1)}%`, color: "blue" },
                    { icon: Activity, label: "API", value: apiCalls.toLocaleString(), color: "emerald" },
                    { icon: Database, label: "Storage", value: "2.4 TB", color: "violet" },
                    { icon: Zap, label: "Uptime", value: "99.9%", color: "amber" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                      <span className="text-xs font-bold text-muted-foreground">{stat.label}:</span>
                      <span className="text-xs font-black">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {quickActions.slice(0, 4).map((action, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                      className="h-7 px-3 text-xs font-bold rounded-lg"
                    >
                      <action.icon className="w-3 h-3 mr-1.5" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* ==================== SCROLLABLE CONTENT ==================== */}
        <div className={`space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent ${activeTab === "overview" ? "p-8 h-[calc(100vh-170px)]" : "h-screen"}`}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* ==================== KEY METRICS GRID ==================== */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {collegeStats.map((stat, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card
                        className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-none cursor-pointer ${isDark ? 'bg-white/[0.02] hover:bg-white/[0.05]' : 'bg-white hover:shadow-blue-500/10'
                          } backdrop-blur-xl`}
                      >
                        {/* Animated Background */}
                        <div
                          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${stat.gradient} blur-3xl`}
                          style={{ transform: 'scale(0.8)' }}
                        />

                        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 relative z-10">
                          <div className="space-y-3 flex-1">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`${stat.bgColor} p-3 rounded-2xl inline-flex shadow-lg`}
                            >
                              <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </motion.div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                              </p>
                              <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                                <span
                                  className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${stat.trend === 'up'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                    }`}
                                >
                                  {stat.trend === 'up' ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                  )}
                                  {stat.change}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="relative z-10">
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground font-medium">
                              {stat.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                <span>Progress</span>
                                <span>{((stat.current / stat.target) * 100).toFixed(0)}%</span>
                              </div>
                              <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'
                                }`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(stat.current / stat.target) * 100}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className={`h-full bg-gradient-to-r ${stat.gradient} shadow-lg`}
                                />
                              </div>
                            </div>

                            {/* Mini Trend */}
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                This Month
                              </span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className={`w-3 h-3 ${stat.color}`} />
                                <span className={`text-[10px] font-black ${stat.color}`}>
                                  +{stat.percentage}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </section>

                {/* ==================== MAIN ANALYTICS DASHBOARD ==================== */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Revenue & Growth Chart */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card
                      className={`h-[600px] border-none shadow-2xl relative overflow-hidden ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                        } backdrop-blur-xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent pointer-events-none" />

                      <CardHeader className="flex flex-row items-center justify-between relative z-10">
                        <div className="space-y-1">
                          <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            Revenue Analytics
                            <span className={`text-xs font-black px-3 py-1 rounded-lg flex items-center gap-1 ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                              <TrendingUp className="w-3 h-3" />
                              +12.5%
                            </span>
                          </CardTitle>
                          <CardDescription className="font-semibold">
                            Growth trends across all institutions
                          </CardDescription>
                        </div>

                        <div className="flex gap-2">
                          {['week', 'month', 'quarter', 'year'].map((period) => (
                            <Button
                              key={period}
                              variant={selectedPeriod === period ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedPeriod(period)}
                              className="rounded-xl border-none shadow-sm capitalize font-bold h-9 px-4 text-xs"
                            >
                              {period}
                            </Button>
                          ))}
                        </div>
                      </CardHeader>

                      <CardContent className="h-[480px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart
                            data={usageMetrics}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                          >
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                            />
                            <XAxis
                              dataKey="month"
                              stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                              fontSize={12}
                              fontWeight={700}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              yAxisId="left"
                              stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                              fontSize={12}
                              fontWeight={700}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                              fontSize={12}
                              fontWeight={700}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                background: isDark ? 'rgba(15,17,21,0.95)' : 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                borderRadius: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                padding: '12px'
                              }}
                              labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                            />
                            <Legend
                              wrapperStyle={{ paddingTop: '20px' }}
                              iconType="circle"
                            />
                            <Area
                              yAxisId="left"
                              type="monotone"
                              dataKey="revenue"
                              stroke="#3b82f6"
                              strokeWidth={3}
                              fill="url(#colorRevenue)"
                              name="Revenue (Lakhs)"
                            />
                            <Bar
                              yAxisId="right"
                              dataKey="colleges"
                              fill="#8b5cf6"
                              radius={[8, 8, 0, 0]}
                              name="Institutions"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="growth"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ r: 6, fill: '#f59e0b' }}
                              name="Growth %"
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Right Column - Quick Stats */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    {/* Security Overview */}
                    <Card
                      className={`border-none shadow-xl overflow-hidden relative ${isDark ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
                        } backdrop-blur-xl`}
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 rounded-full bg-emerald-500/20 blur-3xl" />

                      <CardHeader className="relative z-10">
                        <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          Security Status
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-4xl font-black">99.8%</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                              Threat Isolation
                            </p>
                          </div>
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                            <CheckCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          {securityEvents.map((event, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              className={`p-3 rounded-xl ${isDark ? 'bg-black/20' : 'bg-white/50'
                                } border border-white/10`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold">{event.type}</span>
                                <span className={`text-xs font-black ${event.color}`}>
                                  {event.count}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Geographic Distribution */}
                    <Card
                      className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                        } backdrop-blur-xl`}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                          Geographic Spread
                          <Globe className="w-4 h-4" />
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex items-center justify-center py-4">
                        <div className="relative w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={revenueByPlan}
                                innerRadius={65}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                              >
                                {revenueByPlan.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">100%</span>
                            <span className="text-[8px] uppercase font-black text-muted-foreground">
                              Coverage
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {revenueByPlan.map((plan, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: plan.color }}
                                />
                                <span className="font-bold">{plan.plan}</span>
                              </div>
                              <span className="font-black">{plan.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* ==================== BENTO GRID SECTION ==================== */}
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* System Health Monitor */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className={`border-none shadow-xl h-full ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-black uppercase">Infrastructure Pulse</CardTitle>
                          <CardDescription className="text-xs font-bold">Live feedback from global clusters</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRefresh}
                          className="group"
                        >
                          <motion.div
                            animate={{ rotate: isRefreshing ? 360 : 0 }}
                            transition={{ duration: 1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {systemHealth.map((sys, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className={`p-4 rounded-2xl flex items-center justify-between border border-white/5 transition-all group ${isDark ? 'bg-black/20 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: sys.status === 'Operational' ? [1, 0.5, 1] : 1
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-3 h-3 rounded-full ${sys.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}
                              />
                              <div>
                                <p className="font-bold text-sm tracking-tight">{sys.component}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">
                                  {sys.uptime} Up-time • {sys.latency} Latency
                                </p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-xs font-black text-blue-500">{sys.load} Load</p>
                              <div className="h-1 w-20 bg-muted/40 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: sys.load }}
                                  className="h-full bg-blue-500"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* AI Model Insight */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className={`border-none ${isDark ? 'bg-black/20 text-white' : 'bg-white text-slate-900 border border-slate-200'} shadow-2xl h-full overflow-hidden relative group`}>
                      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 ${isDark ? 'bg-white/10' : 'bg-indigo-500/10'} rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700`} />
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                          <Zap className={`w-5 h-5 fill-current ${!isDark && 'text-indigo-600'}`} />
                          Intelligence Engine
                        </CardTitle>
                        <CardDescription className={`${isDark ? 'text-white/70' : 'text-slate-500'} font-bold`}>Model V4.2 Real-time Metrics</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 relative z-10">
                        {modelPerformance.map((m, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center space-y-1 transition-colors ${isDark
                                ? 'bg-white/10 border-white/10 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                              }`}
                          >
                            <p className={`text-[10px] font-black uppercase leading-tight ${isDark ? 'opacity-60' : 'text-slate-400'}`}>{m.metric}</p>
                            <p className="text-3xl font-black">{m.value}%</p>
                            <div className={`h-1 w-full mt-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.value}%` }}
                                className={`h-full ${isDark ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-indigo-600'}`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                      <div className={`p-6 mt-2 flex items-center justify-between border-t relative z-10 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                          />
                          <span className={`text-[10px] font-black uppercase ${isDark ? 'opacity-80 text-white' : 'text-slate-500'}`}>Sync Status: Optimal</span>
                        </div>
                        <Button variant="link" size="sm" className={`font-black text-[10px] uppercase p-0 h-auto ${isDark ? 'text-white/80 hover:text-white' : 'text-indigo-600 hover:text-indigo-700'
                          }`}>
                          View Detailed Logs <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* ==================== ACTIVITY FEED & TOP PERFORMERS ==================== */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-black uppercase">Activity Feed</CardTitle>
                            <CardDescription className="text-xs font-bold">Real-time system events</CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs font-bold">
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {recentActivity.slice(0, 6).map((activity) => (
                          <motion.div
                            key={activity.id}
                            whileHover={{ x: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                            className={`p-4 rounded-xl border border-white/5 transition-all cursor-pointer`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${activity.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                activity.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                  activity.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                                    'bg-blue-500/10 text-blue-500'
                                }`}>
                                <activity.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-bold text-sm">{activity.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-bold">{activity.time}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-muted/50">
                                    {activity.user}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Top Performers */}
                  <motion.div variants={itemVariants}>
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader>
                        <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500" />
                          Top Performers
                        </CardTitle>
                        <CardDescription className="text-xs font-bold">Highest rated institutions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {topPerformers.map((performer, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-sm shadow-lg">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-sm">{performer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {performer.students} students • +{performer.growth}%
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black">{performer.score}%</p>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-2.5 h-2.5 ${i < Math.floor(performer.score / 20)
                                        ? 'fill-amber-500 text-amber-500'
                                        : 'text-muted-foreground/30'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'
                                }`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${performer.score}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: performer.color }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* ==================== INSTITUTION MANAGEMENT TABLE ==================== */}
                <motion.div variants={itemVariants}>
                  <Card className={`border-none shadow-xl overflow-hidden ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                    } backdrop-blur-xl`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-black uppercase">Institution Management</CardTitle>
                        <CardDescription className="text-xs font-bold">
                          Manage all partner institutions
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200'}`}>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`bg-transparent text-sm font-bold focus:outline-none w-full ${isDark ? 'text-white' : 'text-slate-900'}`}
                          >
                            <option value="name">Sort by Name</option>
                            <option value="students">Sort by Students</option>
                            <option value="placement">Sort by Placement</option>
                            <option value="revenue">Sort by Revenue</option>
                          </select>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="font-bold rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                          onClick={() => console.log('Add Institution')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Institution
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Filters */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl border border-white/5">
                        <div className="flex flex-wrap items-center gap-3">
                          {['all', 'Active', 'Warning', 'Inactive'].map((status) => (
                            <Button
                              key={status}
                              variant={filterStatus === status.toLowerCase() ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFilterStatus(status.toLowerCase())}
                              className={`rounded-xl font-bold ${filterStatus === status.toLowerCase()
                                ? 'shadow-lg'
                                : 'border-opacity-30'
                                }`}
                            >
                              {status}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl font-bold border-opacity-30"
                          >
                            <Filter className="w-3.5 h-3.5 mr-2" />
                            More Filters
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={isExporting}
                            className="rounded-xl font-bold border-opacity-30"
                          >
                            {isExporting ? (
                              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5 mr-2" />
                            )}
                            {isExporting ? 'Exporting...' : 'Export'}
                          </Button>
                          <div className="flex items-center border rounded-xl overflow-hidden">
                            <Button
                              variant={viewMode === 'grid' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setViewMode('grid')}
                              className="rounded-none h-9 px-3"
                            >
                              <Grid className="w-4 h-4" />
                            </Button>
                            <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                            <Button
                              variant={viewMode === 'list' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setViewMode('list')}
                              className="rounded-none h-9 px-3"
                            >
                              <List className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto rounded-2xl border border-white/5">
                        <table className="w-full">
                          <thead>
                            <tr className={`
                        border-b border-white/5
                        ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}
                      `}>
                              {['Institution', 'Students', 'Placement', 'Status', 'Plan', 'Revenue', 'Actions'].map((header) => (
                                <th
                                  key={header}
                                  className="text-left p-4 text-xs font-black uppercase tracking-wider text-muted-foreground"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sortedColleges.map((college) => (
                              <motion.tr
                                key={college.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}
                                className={`border-b border-white/5 transition-colors ${selectedCollege === college.id ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : ''
                                  }`}
                                onClick={() => setSelectedCollege(college.id)}
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white">
                                      {college.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-sm">{college.name}</p>
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {college.location}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div>
                                    <p className="font-bold">{college.students.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Students</p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-16 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'
                                      }`}>
                                      <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                        style={{ width: `${college.placement}%` }}
                                      />
                                    </div>
                                    <span className="font-bold text-sm">{college.placement}%</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${college.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : college.status === 'Warning'
                                      ? 'bg-amber-500/10 text-amber-500'
                                      : 'bg-rose-500/10 text-rose-500'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${college.status === 'Active' ? 'bg-emerald-500' :
                                      college.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                                      }`} />
                                    {college.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${college.plan === 'Premium'
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-500'
                                    : college.plan === 'Standard'
                                      ? 'bg-blue-500/10 text-blue-500'
                                      : 'bg-slate-500/10 text-slate-500'
                                    }`}>
                                    {college.plan}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <p className="font-bold text-lg">{college.revenue}</p>
                                  <p className="text-xs text-muted-foreground">MTD</p>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCollegeClick(college);
                                      }}
                                      className="h-8 w-8 rounded-lg"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Edit', college.id);
                                      }}
                                      className="h-8 w-8 rounded-lg"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteInstitution(college.id, college.name);
                                      }}
                                      className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground font-bold">
                          Showing {sortedColleges.length} of {collegeList.length} institutions
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl font-bold">
                            Previous
                          </Button>
                          {[1, 2, 3].map((num) => (
                            <Button
                              key={num}
                              variant="outline"
                              size="sm"
                              className={`rounded-xl font-bold ${num === 1 ? 'bg-blue-500 text-white border-blue-500' : ''
                                }`}
                            >
                              {num}
                            </Button>
                          ))}
                          <Button variant="outline" size="sm" className="rounded-xl font-bold">
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* ==================== BOTTOM STATS ROW ==================== */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Device Breakdown */}
                  <motion.div variants={itemVariants}>
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                          Device Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center">
                        <div className="w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={deviceBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {deviceBreakdown.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={[
                                      '#3b82f6',
                                      '#10b981',
                                      '#8b5cf6'
                                    ][index]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {deviceBreakdown.map((device, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <device.icon className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold">{device.name}</span>
                              </div>
                              <span className="font-black">{device.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Traffic Sources */}
                  <motion.div variants={itemVariants}>
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                          Traffic Sources
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {trafficSources.map((source, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: source.color }}
                                />
                                <span className="font-bold">{source.source}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{source.visits.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {source.conversion}% conversion
                                </p>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full overflow-hidden bg-muted/20">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(source.visits / 45000) * 100}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: source.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Completion Rates */}
                  <motion.div variants={itemVariants}>
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.02]' : 'bg-white'
                      } backdrop-blur-xl`}>
                      <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                          Completion Rates
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {completionRates.map((item, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-bold">{item.category}</span>
                              <div className="text-right">
                                <p className="font-black">{item.rate}%</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.completed.toLocaleString()}/{item.total.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                <span>Current</span>
                                <span>Target: {item.target}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full overflow-hidden bg-muted/20">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.rate}%` }}
                                  transition={{ duration: 1, delay: idx * 0.2 }}
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* ==================== FOOTER ==================== */}
                <footer className={`py-6 border-t ${isDark ? 'border-white/5' : 'border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <p className="text-sm text-muted-foreground font-bold">
                        © {new Date().getFullYear()} NextGen Enterprise. All rights reserved.
                      </p>
                      <div className="flex items-center gap-4">
                        {['Privacy', 'Terms', 'Security', 'Status'].map((item) => (<a key={item} href={item === "Privacy" ? "/PrivacyPage" : item === "Terms" ? "/TermsAndCondition" : item === "Security" ? "/Security" : item === "Feedback" ? "/Feedback" : ""} className="text-xs font-bold text-muted-foreground p-0 h-auto">{item}</a>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </footer>
              </motion.div>
            )}

            {/* ==================== INSTITUTIONS TAB ==================== */}
            {activeTab === "institutions" && (
              <motion.div
                key="institutions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <div className="[&_aside]:hidden [&_.ml-64]:ml-0">
                  <InstitutionsPage />
                </div>
              </motion.div>
            )}

            {/* ==================== ANALYTICS TAB ==================== */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <AnalyticsPage />
              </motion.div>
            )}

            {/* ==================== STUDENTS TAB ==================== */}
            {activeTab === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <AdminStudents />
              </motion.div>
            )}

            {/* ==================== ASSESSMENTS TAB ==================== */}
            {activeTab === "assessments" && (
              <motion.div
                key="assessments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <div className="[&_aside]:hidden [&_header]:sticky [&_header]:top-0 [&_header]:z-30">
                  <AssessmentsPage />
                </div>
              </motion.div>
            )}

            {/* ==================== REPORTS TAB ==================== */}
            {activeTab === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <AdminReports />
              </motion.div>
            )}

            {/* ==================== INTEGRATIONS TAB ==================== */}
            {activeTab === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <AdminIntegrations />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== COMMAND PALETTE ==================== */}
        <AnimatePresence>
          {showCommandPalette && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
              onClick={() => setShowCommandPalette(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className={`w-[640px] rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Type a command or search..."
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none text-lg font-bold"
                      autoFocus
                    />
                    <kbd className="px-2 py-1 rounded text-xs font-bold bg-muted">
                      ESC
                    </kbd>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {filteredCommands.map((group, idx) => (
                    <div key={idx} className="mb-4">
                      <p className="text-xs font-bold uppercase text-muted-foreground px-3 py-2">
                        {group.category}
                      </p>
                      {group.items.map((cmd) => {
                        const Icon = cmd.icon;
                        return (
                          <motion.button
                            key={cmd.id}
                            whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            onClick={cmd.action}
                            className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                              <span className="font-bold">{cmd.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">↲ Enter</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                  {filteredCommands.every(c => c.items.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">
                      <p className="font-bold">No commands found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== SELECTED INSTITUTION MODAL ==================== */}
        <AnimatePresence>
          {selectedInstitution && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedInstitution(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl">
                      {selectedInstitution?.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black">
                        {selectedInstitution?.name}
                      </CardTitle>
                      <CardDescription className="font-bold">
                        {selectedInstitution?.location} • Est. {selectedInstitution?.established}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedInstitution(null)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        {selectedInstitution && [
                          { label: 'Rating', value: selectedInstitution.rating, icon: Star, color: 'amber' },
                          { label: 'Growth', value: `${selectedInstitution.growth}%`, icon: TrendingUp, color: 'emerald' },
                          { label: 'Courses', value: selectedInstitution.courses, icon: BookOpen, color: 'blue' },
                        ].map((stat, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${stat.color === 'amber' ? 'bg-amber-500/10' :
                                stat.color === 'emerald' ? 'bg-emerald-500/10' :
                                  'bg-blue-500/10'
                                }`}>
                                <stat.icon className={`w-4 h-4 ${stat.color === 'amber' ? 'text-amber-500' :
                                  stat.color === 'emerald' ? 'text-emerald-500' :
                                    'text-blue-500'
                                  }`} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-muted-foreground">
                                  {stat.label}
                                </p>
                                <p className="text-2xl font-black">{stat.value}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'
                        }`}>
                        <h4 className="font-bold text-lg mb-4">Performance Overview</h4>
                        <div className="space-y-4">
                          {selectedInstitution && [
                            { label: 'Engagement Rate', value: selectedInstitution.engagement, color: 'blue' },
                            { label: 'Retention Rate', value: selectedInstitution.retention, color: 'emerald' },
                            { label: 'Satisfaction Score', value: selectedInstitution.satisfaction, color: 'amber' },
                          ].map((item, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-sm font-bold mb-1">
                                <span>{item.label}</span>
                                <span>{item.value}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full overflow-hidden bg-muted/20">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.value}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className={`h-full ${item.color === 'blue' ? 'bg-blue-500' :
                                    item.color === 'emerald' ? 'bg-emerald-500' :
                                      'bg-amber-500'
                                    }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-3">Contact Information</h4>
                        <div className="space-y-3">
                          {selectedInstitution && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedInstitution.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedInstitution.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedInstitution.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'
                        }`}>
                        <h4 className="font-bold mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button className="w-full justify-start" variant="outline" size="sm">
                            <Mail className="w-3.5 h-3.5 mr-2" />
                            Send Email
                          </Button>
                          <Button className="w-full justify-start" variant="outline" size="sm">
                            <FileText className="w-3.5 h-3.5 mr-2" />
                            Generate Report
                          </Button>
                          <Button className="w-full justify-start" variant="outline" size="sm">
                            <Settings className="w-3.5 h-3.5 mr-2" />
                            Manage Access
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInstitution(null)}
                  >
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
                    Manage Institution
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== LOADING OVERLAY ==================== */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== ADD INSTITUTION MODAL ==================== */}
        <Dialog open={showAddInstitution} onOpenChange={setShowAddInstitution}>
          <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-500" />
                Add New Institution
              </DialogTitle>
              <DialogDescription>
                Fill in the details to add a new institution to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Institution Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., IIT Delhi"
                    value={institutionForm.name}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, name: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@institution.edu"
                    value={institutionForm.email}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, email: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 11 2659 1000"
                    value={institutionForm.phone}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, phone: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-bold">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={institutionForm.location}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, location: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="font-bold">Institution Type</Label>
                  <Input
                    id="type"
                    placeholder="Engineering, Medical, etc."
                    value={institutionForm.type}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, type: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established" className="font-bold">Established Year</Label>
                  <Input
                    id="established"
                    type="number"
                    placeholder="1961"
                    value={institutionForm.established}
                    onChange={(e) => setInstitutionForm({ ...institutionForm, established: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="plan" className="font-bold">Subscription Plan</Label>
                  <Select
                    value={institutionForm.plan}
                    onValueChange={(value: "Premium" | "Standard" | "Basic") =>
                      setInstitutionForm({ ...institutionForm, plan: value })
                    }
                  >
                    <SelectTrigger className="font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddInstitution(false);
                  setInstitutionForm({
                    name: "",
                    email: "",
                    phone: "",
                    location: "",
                    type: "",
                    established: "",
                    plan: "Standard"
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddInstitution}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Institution
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================== IMPORT DATA MODAL ==================== */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className={`max-w-lg ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-500" />
                Import Data
              </DialogTitle>
              <DialogDescription>
                Upload a CSV or Excel file to import institution data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                }`}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-bold text-foreground">Click to upload</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleImportData}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  CSV, XLSX up to 10MB
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                }`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-foreground mb-1">File Format Requirements</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>First row should contain column headers</li>
                      <li>Required columns: Name, Email, Location</li>
                      <li>Optional columns: Phone, Type, Established</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const input = document.getElementById('file-upload') as HTMLInputElement;
                  input?.click();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 font-bold"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main >
    </div >
  );
}
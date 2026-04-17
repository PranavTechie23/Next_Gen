import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getPlacementDrives, savePlacementDrive, type PlacementDrive } from "@/data/placementDrives";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { LogOut, Settings, Users, TrendingUp, AlertTriangle, Download, Filter, Search, Bell, ChevronRight, Award, Target, BookOpen, Briefcase, Calendar, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Upload, FileText, GraduationCap, Building2, BarChart3, Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Clock, DollarSign, Users2, Plus, Edit, Trash2, MoreVertical, CheckCircle2, XCircle, RefreshCw, FileSpreadsheet, FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, TrendingDown as TrendingDownIcon, Rocket, Shield, Globe, Star, MessageSquare, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Filter as FilterIcon, X, Sparkles, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [timeRange, setTimeRange] = useState("year");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smart JD Filter State
  const [jdFilters, setJdFilters] = useState({
    cgpa: 7.0,
    backlogs: 0,
    branches: ["CSE", "ECE", "Mechanical"],
    skills: ["React", "Node.js"]
  });
  const [newSkill, setNewSkill] = useState("");

  // Create Drive (ticket) modal
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [createDriveForm, setCreateDriveForm] = useState({
    companyName: "",
    role: "",
    description: "",
    requirements: [] as string[],
    minCgpa: 7.0,
    maxBacklogs: 0,
    applicationLink: "",
    deadline: "",
  });
  const [driveReqSkill, setDriveReqSkill] = useState("");
  const placementDrivesList = getPlacementDrives();

  const handleCreateDriveSubmit = () => {
    if (!createDriveForm.companyName.trim() || !createDriveForm.role.trim()) {
      toast.error("Company name and role are required");
      return;
    }
    savePlacementDrive({
      companyName: createDriveForm.companyName.trim(),
      role: createDriveForm.role.trim(),
      description: createDriveForm.description.trim(),
      requirements: createDriveForm.requirements,
      minCgpa: createDriveForm.minCgpa,
      maxBacklogs: createDriveForm.maxBacklogs,
      applicationLink: createDriveForm.applicationLink.trim() || "#",
      deadline: createDriveForm.deadline.trim() || "TBD",
    });
    toast.success("Drive created. Students will see it under Drives.");
    setCreateDriveForm({
      companyName: "",
      role: "",
      description: "",
      requirements: [],
      minCgpa: 7.0,
      maxBacklogs: 0,
      applicationLink: "",
      deadline: "",
    });
    setCreateDriveOpen(false);
  };

  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);

  // Scroll to top when selectedView changes
  useEffect(() => {
    window.scrollTo(0, 0); // For mobile/desktop where window might scroll
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0); // For specific scrollable container
    }
  }, [selectedView]);

  const collegeStats = [
    { label: "Total Students", value: "1,240", change: "+5%", trend: "up", icon: Users, color: "bg-blue-500" },
    { label: "Placement Ready", value: "892", change: "+12%", trend: "up", icon: Target, color: "bg-green-500" },
    { label: "Avg Readiness Score", value: "71%", change: "+3%", trend: "up", icon: Award, color: "bg-purple-500" },
    { label: "Placement Rate (YoY)", value: "87%", change: "+8%", trend: "up", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const additionalMetrics = [
    { label: "Active Companies", value: "142", change: "+18%", trend: "up", icon: Building2 },
    { label: "Avg Package (LPA)", value: "7.1", change: "+15%", trend: "up", icon: Briefcase },
    { label: "Workshops Conducted", value: "28", change: "+40%", trend: "up", icon: BookOpen },
    { label: "Interview Success", value: "64%", change: "-2%", trend: "down", icon: Activity },
  ];

  const branchData = [
    { branch: "CSE", students: 320, ready: 285, avg: 74, placed: 268, avgPackage: 8.2 },
    { branch: "ECE", students: 280, ready: 225, avg: 68, placed: 210, avgPackage: 7.5 },
    { branch: "Mechanical", students: 240, ready: 180, avg: 65, placed: 165, avgPackage: 6.8 },
    { branch: "Civil", students: 200, ready: 140, avg: 62, placed: 128, avgPackage: 6.2 },
    { branch: "Electrical", students: 200, ready: 162, avg: 70, placed: 148, avgPackage: 7.0 },
  ];

  const yearTrend = [
    { year: "2020", placements: 78, avg_salary: 5.2, companies: 85, offers: 892 },
    { year: "2021", placements: 82, avg_salary: 5.8, companies: 98, offers: 1024 },
    { year: "2022", placements: 85, avg_salary: 6.2, companies: 112, offers: 1156 },
    { year: "2023", placements: 87, avg_salary: 6.8, companies: 128, offers: 1289 },
    { year: "2024", placements: 89, avg_salary: 7.1, companies: 142, offers: 1421 },
  ];

  const skillsRadarData = [
    { skill: "Technical", college: 72, industry: 85 },
    { skill: "Communication", college: 65, industry: 78 },
    { skill: "Problem Solving", college: 78, industry: 82 },
    { skill: "Teamwork", college: 70, industry: 80 },
    { skill: "Leadership", college: 58, industry: 75 },
    { skill: "Adaptability", college: 68, industry: 79 },
  ];

  const placementDistribution = [
    { name: "Product Based", value: 35, color: "#1e3a8a" },
    { name: "Service Based", value: 45, color: "#3b82f6" },
    { name: "Startups", value: 12, color: "#60a5fa" },
    { name: "Core Engineering", value: 8, color: "#93c5fd" },
  ];

  const monthlyActivity = [
    { month: "Aug", applications: 145, interviews: 89, offers: 23 },
    { month: "Sep", applications: 198, interviews: 124, offers: 45 },
    { month: "Oct", applications: 267, interviews: 178, offers: 78 },
    { month: "Nov", applications: 312, interviews: 234, offers: 112 },
    { month: "Dec", applications: 289, interviews: 198, offers: 89 },
    { month: "Jan", applications: 245, interviews: 167, offers: 67 },
  ];

  const atRiskStudents = [
    { id: "S001", name: "Priya Sharma", branch: "CSE", readiness: 35, status: "Critical", issues: ["Low DSA Score", "No Projects"], lastActivity: "2 days ago" },
    { id: "S002", name: "Amit Kumar", branch: "ECE", readiness: 42, status: "At Risk", issues: ["Communication Gap"], lastActivity: "5 days ago" },
    { id: "S003", name: "Neha Patel", branch: "Mechanical", readiness: 48, status: "At Risk", issues: ["Incomplete Resume"], lastActivity: "1 day ago" },
    { id: "S004", name: "Rohan Singh", branch: "Civil", readiness: 38, status: "Critical", issues: ["Low Attendance", "No Internship"], lastActivity: "3 days ago" },
    { id: "S005", name: "Sneha Reddy", branch: "CSE", readiness: 45, status: "At Risk", issues: ["Interview Skills"], lastActivity: "4 days ago" },
  ];

  const topPerformers = [
    { rank: 1, name: "Arjun Mehta", branch: "CSE", score: 95, offers: 5, package: 12.5 },
    { rank: 2, name: "Divya Iyer", branch: "ECE", score: 93, offers: 4, package: 11.2 },
    { rank: 3, name: "Karthik Rao", branch: "CSE", score: 91, offers: 4, package: 10.8 },
    { rank: 4, name: "Ananya Das", branch: "Electrical", score: 89, offers: 3, package: 9.5 },
    { rank: 5, name: "Vikram Shah", branch: "ECE", score: 88, offers: 3, package: 9.2 },
  ];

  const suggestions = [
    {
      title: "Introduce Industry-Backed DBMS Workshop",
      impact: "High",
      affectedStudents: 450,
      description: "Database concepts are a critical gap across all branches. Partner with industry experts for hands-on sessions.",
      priority: 1,
      timeline: "2 weeks",
      cost: "₹45,000"
    },
    {
      title: "Final-Year Students Lack System Design Exposure",
      impact: "High",
      affectedStudents: 280,
      description: "Only 35% of final-year students have system design skills. This is critical for product-based interviews.",
      priority: 1,
      timeline: "1 month",
      cost: "₹30,000"
    },
    {
      title: "CP-Heavy Students Need Development Balance",
      impact: "Medium",
      affectedStudents: 180,
      description: "Students strong in competitive programming need web/app development skills for broader opportunities.",
      priority: 2,
      timeline: "3 weeks",
      cost: "₹25,000"
    },
    {
      title: "Soft Skills Enhancement Program",
      impact: "Medium",
      affectedStudents: 320,
      description: "Communication and presentation skills need improvement. Regular mock interviews recommended.",
      priority: 2,
      timeline: "Ongoing",
      cost: "₹15,000/month"
    },
  ];

  const upcomingEvents = [
    { date: "Jan 25", title: "TCS Campus Drive", type: "Placement", attendees: 180 },
    { date: "Jan 28", title: "System Design Workshop", type: "Workshop", attendees: 95 },
    { date: "Feb 02", title: "Amazon Pre-Placement Talk", type: "PPT", attendees: 240 },
    { date: "Feb 05", title: "Mock Interview Session", type: "Training", attendees: 120 },
  ];

  const recentPlacements = [
    { student: "Rahul Verma", company: "Google", package: 18.5, date: "Jan 20", branch: "CSE" },
    { student: "Pooja Singh", company: "Microsoft", package: 16.2, date: "Jan 19", branch: "CSE" },
    { student: "Aditya Jain", company: "Amazon", package: 14.8, date: "Jan 18", branch: "ECE" },
    { student: "Shruti Nair", company: "Flipkart", package: 12.5, date: "Jan 17", branch: "CSE" },
  ];

  const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate("/")}>
            <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-80">TPO Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search students, reports..."
                className="pl-10 pr-4 py-2 border border-border bg-muted/30 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
              />
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </Button>

            <div className="h-8 w-px bg-border"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xs">TP</span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-black text-foreground">TPO Admin</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">admin@tpo.edu</p>
              </div>
            </div>

            <ThemeToggle />

            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/setting")}>
              <Settings className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-border bg-background/60 backdrop-blur-md">
          <div className="container px-4 sm:px-6">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="mb-4"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {/* Desktop Tabs */}
            <div className={`${isMobile ? 'hidden' : 'flex'} gap-1 overflow-x-auto`}>
              {["overview", "drives", "analytics", "students", "reports"].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 md:px-6 py-3 text-xs md:text-sm font-bold capitalize transition-all relative whitespace-nowrap ${selectedView === view
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  {view}
                  {selectedView === view && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(59,130,246,0.5)]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-64">
              <div className="space-y-2 mt-8">
                {["overview", "drives", "analytics", "students", "reports"].map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setSelectedView(view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold capitalize transition-all ${selectedView === view
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                      }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main
        ref={mainContentRef}
        data-scroll-container
        className="container py-6 md:py-12 px-4 sm:px-6 max-w-7xl mx-auto"
      >
        {/* Welcome Section with Actions */}
        <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
              {selectedView === "overview" && "TPO Overview"}
              {selectedView === "analytics" && "Analytics & Insights"}
              {selectedView === "students" && "Student Management"}
              {selectedView === "reports" && "Reports & Exports"}
            </h1>
            <p className="text-lg text-muted-foreground flex items-center gap-3 font-medium">
              <Calendar className="w-5 h-5" />
              {selectedView === "overview" && "Quick glance at key metrics and urgent alerts"}
              {selectedView === "drives" && "Manage placement drives and shortlist students via JD"}
              {selectedView === "analytics" && "Detailed analytics and performance insights"}
              {selectedView === "students" && "Manage and track student progress"}
              {selectedView === "reports" && "Generate and export comprehensive reports"}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {selectedView === "reports" && (
              <>

              </>
            )}
            {selectedView !== "reports" && (
              <>
                <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-6">
                  <Filter className="w-5 h-5" />
                  Filters
                </Button>
                {selectedView === "students" && (
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2 text-base px-6 py-6">
                    <Plus className="w-5 h-5" />
                    Add Student
                  </Button>
                )}
                {selectedView === "overview" && (
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2 text-base px-6 py-6">
                    <Upload className="w-5 h-5" />
                    Upload Data
                  </Button>
                )}
              </>
            )}
          </div>
        </div>



        {/* DRIVES TAB - Smart JD Filter & Management */}
        {selectedView === "drives" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats for Drives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">+2 this week</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">12</h3>
                  <p className="text-blue-100 font-medium">Active Drives</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-green-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">892</h3>
                  <p className="text-muted-foreground font-medium">Eligible Students (Avg)</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-purple-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Zap className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">45</h3>
                  <p className="text-muted-foreground font-medium">JDs Processed</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Smart JD Shortlisting Tool */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-black text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Smart JD Shortlister
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">Automatically filter students based on company criteria</p>
                    </div>
                    <Button variant="secondary" size="sm" className="font-bold">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload JD PDF
                    </Button>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-slate-950">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Filter Inputs */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <Label className="text-base font-bold">Minimum CGPA (Current: {jdFilters.cgpa})</Label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={jdFilters.cgpa}
                            onChange={(e) => setJdFilters({ ...jdFilters, cgpa: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground font-bold">
                            <span>0.0</span>
                            <span>5.0</span>
                            <span>10.0</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-base font-bold">Allowed Active Backlogs</Label>
                          <div className="flex gap-2">
                            {[0, 1, 2, "3+"].map((num) => (
                              <button
                                key={num}
                                onClick={() => setJdFilters({ ...jdFilters, backlogs: num === "3+" ? 3 : Number(num) })}
                                className={`flex-1 py-2 rounded-lg font-bold border-2 transition-all ${(num === "3+" ? 3 : Number(num)) === jdFilters.backlogs
                                  ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                  : "border-slate-200 dark:border-slate-800 text-muted-foreground hover:border-blue-400"
                                  }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-base font-bold">Required Skills</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {jdFilters.skills.map(skill => (
                              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm gap-2">
                                {skill}
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                                  onClick={() => setJdFilters({ ...jdFilters, skills: jdFilters.skills.filter(s => s !== skill) })}
                                />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill (e.g. Java)"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newSkill) {
                                  setJdFilters({ ...jdFilters, skills: [...jdFilters.skills, newSkill] });
                                  setNewSkill("");
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (newSkill) {
                                  setJdFilters({ ...jdFilters, skills: [...jdFilters.skills, newSkill] });
                                  setNewSkill("");
                                }
                              }}
                            >Add</Button>
                          </div>
                        </div>
                      </div>

                      {/* Live Results Preview */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 relative">
                          <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                          <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-white dark:ring-slate-950">
                            92%
                          </div>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">142</h4>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-6">Students Eligible</p>

                        <div className="w-full space-y-3">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-500/20">
                            Notify Eligible Students
                          </Button>
                          <Button variant="outline" className="w-full h-12 font-bold">
                            <Download className="w-4 h-4 mr-2" />
                            Export List to Excel
                          </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 w-full text-left">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Filters Applied:</p>
                          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> CGPA &gt; {jdFilters.cgpa}</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Max {jdFilters.backlogs} Backlogs</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Skills match ({jdFilters.skills.length})</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Drive Activity Data Table */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-black text-xl">Recent Drive Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase font-bold text-xs">
                          <tr>
                            <th className="px-4 py-3 rounded-l-lg">Company</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Eligible</th>
                            <th className="px-4 py-3">Applied</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {[
                            { company: "TCS", role: "System Engineer", eligible: 450, applied: 380, status: "Ongoing" },
                            { company: "Infosys", role: "Power Programmer", eligible: 120, applied: 95, status: "Interview" },
                            { company: "Amazon", role: "SDE I", eligible: 85, applied: 82, status: "Completed" },
                            { company: "Wipro", role: "Project Engineer", eligible: 310, applied: 200, status: "Registration" },
                          ].map((drive, i) => (
                            <tr key={i} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-4 font-bold">{drive.company}</td>
                              <td className="px-4 py-4 text-muted-foreground">{drive.role}</td>
                              <td className="px-4 py-4 font-semibold">{drive.eligible}</td>
                              <td className="px-4 py-4 font-semibold">{drive.applied}</td>
                              <td className="px-4 py-4 text-right">
                                <Badge variant={drive.status === "Completed" ? "secondary" : "default"} className={drive.status === "Ongoing" ? "bg-green-500 text-white" : ""}>
                                  {drive.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Drives Sidebar */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl">Active Drives</h3>
                  <Button size="sm" variant="outline" className="h-8">View All</Button>
                </div>

                {placementDrivesList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No drives yet. Create one below.</p>
                ) : (
                  placementDrivesList.map((drive, i) => {
                    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
                    const color = colors[i % colors.length];
                    return (
                      <Card key={drive.id} className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white shadow-lg font-black text-lg`}>
                              {drive.companyName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-lg truncate group-hover:text-blue-600 transition-colors">{drive.companyName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{drive.role}</p>
                              <div className="flex items-center gap-2 text-xs font-semibold bg-muted/50 px-2 py-1 rounded w-fit">
                                <Calendar className="w-3 h-3" />
                                {drive.deadline}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg mt-8">
                  <CardContent className="p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-black text-xl mb-2">Post a New Drive</h3>
                      <p className="text-slate-300 text-sm mb-6">Create a new placement drive and notify students instantly.</p>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold" onClick={() => setCreateDriveOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Drive
                      </Button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  </CardContent>
                </Card>

                {/* Create Drive Dialog */}
                <Dialog open={createDriveOpen} onOpenChange={setCreateDriveOpen}>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create placement drive</DialogTitle>
                      <DialogDescription>Students will see this drive under Drives with JD, requirements, and match %.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label>Company name</Label>
                        <Input
                          placeholder="e.g. Google, TCS"
                          value={createDriveForm.companyName}
                          onChange={(e) => setCreateDriveForm({ ...createDriveForm, companyName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Role / designation</Label>
                        <Input
                          placeholder="e.g. SDE I, System Engineer"
                          value={createDriveForm.role}
                          onChange={(e) => setCreateDriveForm({ ...createDriveForm, role: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Job description (JD)</Label>
                        <Textarea
                          placeholder="Paste or type the full JD here..."
                          value={createDriveForm.description}
                          onChange={(e) => setCreateDriveForm({ ...createDriveForm, description: e.target.value })}
                          className="mt-1 min-h-[100px]"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Required skills (add one by one)</Label>
                        <div className="flex flex-wrap gap-2 mt-1 mb-2">
                          {createDriveForm.requirements.map((s) => (
                            <Badge key={s} variant="secondary" className="gap-1">
                              {s}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => setCreateDriveForm({ ...createDriveForm, requirements: createDriveForm.requirements.filter((r) => r !== s) })} />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. DSA, React"
                            value={driveReqSkill}
                            onChange={(e) => setDriveReqSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && driveReqSkill.trim()) {
                                setCreateDriveForm({ ...createDriveForm, requirements: [...createDriveForm.requirements, driveReqSkill.trim()] });
                                setDriveReqSkill("");
                              }
                            }}
                          />
                          <Button type="button" variant="secondary" onClick={() => {
                            if (driveReqSkill.trim()) {
                              setCreateDriveForm({ ...createDriveForm, requirements: [...createDriveForm.requirements, driveReqSkill.trim()] });
                              setDriveReqSkill("");
                            }
                          }}>Add</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Min CGPA</Label>
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            value={createDriveForm.minCgpa}
                            onChange={(e) => setCreateDriveForm({ ...createDriveForm, minCgpa: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Max backlogs allowed</Label>
                          <Input
                            type="number"
                            min={0}
                            value={createDriveForm.maxBacklogs}
                            onChange={(e) => setCreateDriveForm({ ...createDriveForm, maxBacklogs: parseInt(e.target.value, 10) || 0 })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Application link (Google Form URL)</Label>
                        <Input
                          placeholder="https://forms.google.com/..."
                          value={createDriveForm.applicationLink}
                          onChange={(e) => setCreateDriveForm({ ...createDriveForm, applicationLink: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Deadline (e.g. Apply by: 15 Feb)</Label>
                        <Input
                          placeholder="Apply by: 15 Feb"
                          value={createDriveForm.deadline}
                          onChange={(e) => setCreateDriveForm({ ...createDriveForm, deadline: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCreateDriveOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateDriveSubmit}>Create drive</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB - Quick Glance Only */}
        {selectedView === "overview" && (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
              {collegeStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="relative overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
                    <div className={`absolute top-0 right-0 w-40 h-40 ${stat.color} opacity-10 rounded-bl-full`}></div>
                    <CardContent className="pt-8 pb-8 relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-black ${stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}>
                          {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground mb-3 font-semibold">{stat.label}</p>
                      <p className="text-4xl lg:text-5xl font-black text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {additionalMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <Card key={idx} className="shadow-md border-0 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">{metric.label}</p>
                            <p className="text-2xl font-black text-foreground">{metric.value}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-black ${metric.trend === "up" ? "text-green-500" : "text-red-500"
                          }`}>
                          {metric.change}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Urgent Alerts - Only Critical Items */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* At-Risk Students - Top 3 Only */}
              <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-black flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        Critical Alerts
                      </CardTitle>
                      <CardDescription className="text-base">Students requiring immediate attention</CardDescription>
                    </div>
                    <Button variant="outline" size="lg" className="text-base px-5" onClick={() => setSelectedView("students")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {atRiskStudents.slice(0, 3).map((student) => (
                      <div key={student.id} className="p-6 border border-border bg-muted/20 rounded-xl hover:border-red-500/50 hover:shadow-lg transition-all group cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-black text-foreground tracking-tight text-lg mb-1">{student.name}</h4>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{student.branch} • {student.id}</p>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-black uppercase tracking-widest ${student.status === "Critical" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                            }`}>
                            {student.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${student.readiness < 40 ? "bg-red-500" : "bg-orange-500"}`}
                              style={{ width: `${student.readiness}%` }}
                            ></div>
                          </div>
                          <span className="text-base font-black text-foreground min-w-[3rem]">{student.readiness}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {student.issues.slice(0, 2).map((issue, idx) => (
                              <span key={idx} className="text-xs px-3 py-1 bg-background border border-border text-muted-foreground font-semibold rounded-lg">
                                {issue}
                              </span>
                            ))}
                          </div>
                          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm font-semibold">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events - Next 3 Only */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-black">Upcoming Events</CardTitle>
                      <CardDescription className="text-base">Next placement drives and workshops</CardDescription>
                    </div>
                    <Button variant="outline" size="lg" className="text-base px-5">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map((event, idx) => {
                      const eventTypeColors = {
                        Placement: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        Workshop: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                        PPT: "bg-green-500/10 text-green-500 border-green-500/20",
                        Training: "bg-orange-500/10 text-orange-500 border-orange-500/20",
                      };
                      const colorClass = eventTypeColors[event.type as keyof typeof eventTypeColors] || "bg-primary/10 text-primary border-primary/20";

                      return (
                        <div key={idx} className="group p-6 border border-border bg-muted/20 rounded-xl hover:border-primary/50 hover:shadow-lg hover:bg-muted/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-16 h-16 rounded-xl flex items-center justify-center border ${colorClass} flex-shrink-0`}>
                                <Calendar className="w-7 h-7" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-foreground text-lg tracking-tight mb-2">{event.title}</h4>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {event.date}
                                  </span>
                                  <span className={`text-xs px-3 py-1 rounded-lg font-black uppercase tracking-widest border ${colorClass}`}>
                                    {event.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <div className="text-right">
                                <p className="text-xl font-black text-foreground">{event.attendees}</p>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Attendees</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedView("analytics")}>
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground mb-1">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Detailed charts and insights</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedView("students")}>
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground mb-1">Manage Students</h3>
                      <p className="text-sm text-muted-foreground">View and manage all students</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedView("reports")}>
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <FileBarChart className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground mb-1">Generate Reports</h3>
                      <p className="text-sm text-muted-foreground">Create and export reports</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ANALYTICS TAB - All Charts and Detailed Analytics */}
        {selectedView === "analytics" && (
          <>
            {/* Main Analytics Grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Branch Performance */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-black">Branch-wise Performance</CardTitle>
                      <CardDescription className="text-base">Comprehensive placement metrics by department</CardDescription>
                    </div>
                    <select className="px-4 py-3 border border-border bg-background text-foreground rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary font-medium">
                      <option>All Metrics</option>
                      <option>Readiness</option>
                      <option>Placements</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                      <XAxis dataKey="branch" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                        labelStyle={{ fontWeight: 'black', color: 'var(--foreground)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                      <Bar dataKey="students" fill="#e5e7eb" name="Total Students" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ready" fill="#1e3a8a" name="Placement Ready" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="placed" fill="#22c55e" name="Placed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Placement Distribution */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black">Placement Distribution</CardTitle>
                    <CardDescription className="text-base">By company type</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={placementDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {placementDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {placementDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-muted-foreground font-semibold">{item.name}</span>
                        </div>
                        <span className="font-black text-foreground text-lg">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trends and Skills */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Multi-Year Trends */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black">Historical Trends</CardTitle>
                    <CardDescription className="text-base">5-year placement and salary progression</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={yearTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area yAxisId="left" type="monotone" dataKey="placements" stroke="#1e3a8a" fill="#3b82f6" fillOpacity={0.6} name="Placement %" />
                      <Area yAxisId="right" type="monotone" dataKey="avg_salary" stroke="#d97706" fill="#fbbf24" fillOpacity={0.6} name="Avg Salary (LPA)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skills Gap Analysis */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black">Skills Gap Analysis</CardTitle>
                    <CardDescription className="text-base">College vs Industry expectations</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={skillsRadarData}>
                      <PolarGrid stroke="var(--border)" opacity={0.3} />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 'black' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} />
                      <Radar name="College Average" dataKey="college" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                      <Radar name="Industry Standard" dataKey="industry" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Activity */}
            <Card className="mb-12 shadow-lg border-0">
              <CardHeader className="pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black">Monthly Placement Activity</CardTitle>
                  <CardDescription className="text-base">Applications, interviews, and offers over the past 6 months</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      labelStyle={{ fontWeight: 'black', color: 'var(--foreground)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }} />
                    <Line type="monotone" dataKey="applications" stroke="var(--primary)" strokeWidth={3} name="Applications" dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }} />
                    <Line type="monotone" dataKey="interviews" stroke="#d97706" strokeWidth={3} name="Interviews" dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }} />
                    <Line type="monotone" dataKey="offers" stroke="#22c55e" strokeWidth={3} name="Offers" dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Actionable Suggestions */}
            <Card className="mb-12 shadow-lg border-0">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black">Actionable Suggestions</CardTitle>
                    <CardDescription className="text-base">Data-driven recommendations to improve student readiness</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="group p-6 border border-border bg-muted/20 rounded-xl hover:border-primary/50 hover:shadow-lg hover:bg-muted/30 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-black text-foreground text-lg tracking-tight flex-1 leading-tight">{suggestion.title}</h4>
                        <span className={`text-xs px-3 py-1.5 rounded-lg font-black uppercase tracking-widest ml-3 flex-shrink-0 ${suggestion.impact === "High"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-orange-500/10 text-orange-500"
                          }`}>
                          {suggestion.impact}
                        </span>
                      </div>
                      <p className="text-base text-muted-foreground mb-5 leading-relaxed">{suggestion.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="flex items-center gap-3 text-sm">
                          <Users2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground font-medium">Affected:</span>
                          <span className="font-black text-foreground">{suggestion.affectedStudents}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground font-medium">Timeline:</span>
                          <span className="font-black text-foreground">{suggestion.timeline}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm col-span-2">
                          <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground font-medium">Cost:</span>
                          <span className="font-black text-foreground">{suggestion.cost}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Priority {suggestion.priority}</span>
                          <Button variant="ghost" size="sm" className="h-8 text-sm gap-1.5 font-semibold">
                            Learn More
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Placements */}
            <Card className="mb-12 shadow-lg border-0">
              <CardHeader className="pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black">Recent Placements</CardTitle>
                  <CardDescription className="text-base">Latest student placements</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Student</th>
                        <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Company</th>
                        <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Package (LPA)</th>
                        <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Branch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentPlacements.map((placement, idx) => (
                        <tr key={idx} className="hover:bg-muted/50 transition-colors border-b border-border cursor-pointer">
                          <td className="px-8 py-5 whitespace-nowrap text-base text-foreground font-semibold">{placement.student}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-base text-foreground">{placement.company}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-base text-primary font-black">{placement.package}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-base text-muted-foreground">{placement.date}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-base text-muted-foreground">{placement.branch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* STUDENTS TAB - Student Management */}
        {selectedView === "students" && (
          <>
            {/* Search and Filters */}
            <div className="mb-8 flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students by name, ID, branch, or email..."
                  className="w-full pl-12 pr-4 py-4 border border-border bg-background text-foreground rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-4 border border-border bg-background text-foreground rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary font-medium">
                  <option>All Branches</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                  <option>Electrical</option>
                </select>
                <select className="px-4 py-4 border border-border bg-background text-foreground rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary font-medium">
                  <option>All Status</option>
                  <option>Placement Ready</option>
                  <option>At Risk</option>
                  <option>Placed</option>
                  <option>Not Ready</option>
                </select>
              </div>
            </div>

            {/* Student Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">Total Students</p>
                      <p className="text-3xl font-black text-foreground">1,240</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">Placement Ready</p>
                      <p className="text-3xl font-black text-foreground">892</p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">At Risk</p>
                      <p className="text-3xl font-black text-foreground">348</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">Placed</p>
                      <p className="text-3xl font-black text-foreground">1,078</p>
                    </div>
                    <Award className="w-10 h-10 text-purple-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* At-Risk Students - Full List */}
            <Card className="mb-8 shadow-lg border-0 border-l-4 border-l-red-500">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      At-Risk Students
                    </CardTitle>
                    <CardDescription className="text-base">Students requiring immediate attention</CardDescription>
                  </div>
                  <Button variant="outline" size="lg" className="text-base px-5">Export List</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atRiskStudents.map((student) => (
                    <div key={student.id} className="p-6 border border-border bg-muted/20 rounded-xl hover:border-red-500/50 hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-black text-foreground tracking-tight text-lg mb-1">{student.name}</h4>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">{student.branch} • {student.id}</p>
                          <p className="text-sm text-muted-foreground mb-1">Last Activity: {student.lastActivity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-black uppercase tracking-widest ${student.status === "Critical" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                            }`}>
                            {student.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${student.readiness < 40 ? "bg-red-500" : "bg-orange-500"}`}
                            style={{ width: `${student.readiness}%` }}
                          ></div>
                        </div>
                        <span className="text-base font-black text-foreground min-w-[3rem]">{student.readiness}% Readiness</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {student.issues.map((issue, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-background border border-border text-muted-foreground font-semibold rounded-lg">
                              {issue}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers - Full List */}
            <Card className="mb-12 shadow-lg border-0 border-l-4 border-l-green-500">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <Award className="w-6 h-6 text-green-500" />
                      Top Performers
                    </CardTitle>
                    <CardDescription className="text-base">Leading students this season</CardDescription>
                  </div>
                  <Button variant="outline" size="lg" className="text-base px-5">Export List</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((student) => (
                    <div key={student.rank} className="flex items-center gap-4 p-5 border border-border bg-muted/10 rounded-xl hover:border-green-500/50 hover:shadow-lg transition-all group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg ${student.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/20" :
                        student.rank === 2 ? "bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-500/20" :
                          student.rank === 3 ? "bg-gradient-to-br from-amber-700 to-amber-900 shadow-amber-500/20" :
                            "bg-primary shadow-primary/20"
                        }`}>
                        {student.rank}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-foreground tracking-tight text-lg mb-1">{student.name}</h4>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{student.branch}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-base font-black text-foreground mb-1">{student.score} Score</p>
                        <p className="text-xs text-muted-foreground font-semibold">{student.offers} Offers • {student.package} LPA</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* REPORTS TAB - Report Generation and Exports */}
        {selectedView === "reports" && (
          <>
            {/* Report Types */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <FileBarChart className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Placement Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">Comprehensive placement statistics and trends</p>
                    <Button className="w-full" onClick={() => window.open('https://pict.edu/placement/index.php#statistics', '_blank')}>Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Student Readiness</h3>
                    <p className="text-sm text-muted-foreground mb-4">Student readiness scores and analytics</p>
                    <Button className="w-full">Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                      <Building2 className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Company Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">Company-wise placement breakdown</p>
                    <Button className="w-full">Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                      <BarChart3 className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Branch Performance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Department-wise performance metrics</p>
                    <Button className="w-full">Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">At-Risk Students</h3>
                    <p className="text-sm text-muted-foreground mb-4">List of students requiring attention</p>
                    <Button className="w-full">Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      <FileSpreadsheet className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Custom Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create a customized report</p>
                    <Button className="w-full">Create</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="mb-12 shadow-lg border-0">
              <CardHeader className="pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black">Recent Reports</CardTitle>
                  <CardDescription className="text-base">Recently generated and exported reports</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Placement Report - Q4 2024", type: "PDF", date: "Jan 20, 2024", size: "2.4 MB" },
                    { name: "Student Readiness Analysis", type: "Excel", date: "Jan 18, 2024", size: "1.8 MB" },
                    { name: "Company Placement Breakdown", type: "PDF", date: "Jan 15, 2024", size: "3.1 MB" },
                    { name: "Branch Performance Report", type: "Excel", date: "Jan 12, 2024", size: "1.5 MB" },
                  ].map((report, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-black text-foreground text-base mb-1">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">{report.type} • {report.size} • {report.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="/NG/NextGen_light.png"
                  alt="NextGen Logo"
                  className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="flex flex-col">
                  <span className="font-black text-xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-80">AI-Driven</p>
                </div>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                Empowering students with career opportunities and placement readiness through comprehensive analytics and personalized guidance.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button variant="ghost" size="lg" className="h-11 w-11 p-0 rounded-lg hover:bg-primary/10">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="lg" className="h-11 w-11 p-0 rounded-lg hover:bg-primary/10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="lg" className="h-11 w-11 p-0 rounded-lg hover:bg-primary/10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="lg" className="h-11 w-11 p-0 rounded-lg hover:bg-primary/10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-black text-foreground mb-6 text-base uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base">
                    Dashboard Overview
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base">
                    Student Analytics
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base" onClick={() => window.open('https://pict.edu/placement/index.php#statistics', '_blank')}>
                    Placement Reports
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base">
                    Company Directory
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base">
                    Training Programs
                  </Button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-black text-foreground mb-6 text-base uppercase tracking-widest">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base" onClick={() => navigate('/HelpCenter')}>
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base" onClick={() => navigate('/college/feedbackForm')}>
                    Feedback
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base">
                    API Reference
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base" onClick={() => navigate('/PrivacyPage')}>
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground h-auto py-2 px-0 font-medium text-base" onClick={() => navigate('/TermsAndCondition')}>
                    Terms And Conditions
                  </Button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-black text-foreground mb-6 text-base uppercase tracking-widest">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-base text-foreground font-semibold">123 College Avenue</p>
                    <p className="text-sm text-muted-foreground">City, State 12345</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:+1234567890" className="text-base text-muted-foreground hover:text-foreground font-semibold transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="mailto:admin@college.edu" className="text-base text-muted-foreground hover:text-foreground font-semibold transition-colors">
                    admin@college.edu
                  </a>
                </li>
                <li className="flex items-center gap-4 pt-2">
                  <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="https://pict.edu" target="_blank" rel="noopener noreferrer" className="text-base text-muted-foreground hover:text-foreground font-semibold transition-colors flex items-center gap-1.5">
                    Visit College Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t-2 border-border pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center justify-center gap-2 text-base text-center">
                <p className="font-semibold">© {new Date().getFullYear()} Campus Career Platform. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-8 text-base">
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">System Status: <span className="text-green-500 font-black">Operational</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Active Users: <span className="text-foreground font-black">1,240</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Placement Rate: <span className="text-foreground font-black">87%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
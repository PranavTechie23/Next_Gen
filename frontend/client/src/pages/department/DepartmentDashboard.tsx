import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { LogOut, Settings, Users, TrendingUp, AlertTriangle, Download, Filter, Search, Bell, ChevronRight, Award, Target, BookOpen, Briefcase, Calendar, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Upload, FileText, GraduationCap, Building2, BarChart3, Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Clock, DollarSign, Users2, Plus, Edit, Trash2, MoreVertical, CheckCircle2, XCircle, RefreshCw, FileSpreadsheet, FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, TrendingDown as TrendingDownIcon, Rocket, Shield, Globe, Star, MessageSquare, ArrowLeft, Menu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudentManagement } from "./StudentManagement";
import { ApprovalsHub } from "./ApprovalsHub";
import { deptApi } from "@/services/deptApi";

const DEPT_TABS = ["overview", "analytics", "students", "approvals", "reports"] as const;
type DeptTab = (typeof DEPT_TABS)[number];

function initialDeptTabFromUrl(): DeptTab {
    const raw = new URLSearchParams(window.location.search).get("tab");
    if (raw && (DEPT_TABS as readonly string[]).includes(raw)) {
        return raw as DeptTab;
    }
    return "overview";
}

export default function DepartmentDashboard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [, navigate] = useLocation();
    const [selectedView, setSelectedView] = useState<DeptTab>(() => initialDeptTabFromUrl());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const mainContentRef = useRef<HTMLElement>(null);

    // Keep ?tab= in sync (login lands on ?tab=overview)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("tab") !== selectedView) {
            params.set("tab", selectedView);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({ ...window.history.state }, "", newUrl);
        }
    }, [selectedView]);

    // Scroll to top when selectedView changes
    useEffect(() => {
        window.scrollTo(0, 0);
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
    }, [selectedView]);

    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                const data = await deptApi.getDashboardStats();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const stats = dashboardData?.stats || { totalStudents: 0, placedStudents: 0, avgPackage: 0, atRiskStudents: 0 };

    // Department specific stats (Dynamic)
    const dynamicDeptStats = [
        { label: "Dept Students", value: stats.totalStudents, change: "+5%", trend: "up", icon: Users, color: "bg-blue-500" },
        { label: "Placed Students", value: stats.placedStudents, change: "+12%", trend: "up", icon: Award, color: "bg-green-500" },
        { label: "Avg Package", value: `${stats.avgPackage} LPA`, change: "+8%", trend: "up", icon: DollarSign, color: "bg-purple-500" },
        { label: "At Risk", value: stats.atRiskStudents, change: "-2%", trend: "down", icon: AlertTriangle, color: "bg-red-500" },
    ];

    const additionalMetrics = [
        { label: "Active Companies", value: "45", change: "+5%", trend: "up", icon: Building2 },
        { label: "Avg Package (LPA)", value: "8.2", change: "+12%", trend: "up", icon: Briefcase },
        { label: "Dept Workshops", value: "12", change: "+20%", trend: "up", icon: BookOpen },
        { label: "Interview Success", value: "72%", change: "+4%", trend: "up", icon: Activity },
    ];

    // Comparisons: Dept vs College Average
    const comparisonData = dashboardData?.comparisonData || [
        { metric: "Placement %", dept: 0, collegeAvg: 0 },
        { metric: "Avg Package (LPA)", dept: 0, collegeAvg: 0 },
        { metric: "Highest Package (LPA)", dept: 0, collegeAvg: 0 },
    ];

    const yearTrend = dashboardData?.yearTrend || [];

    const skillsRadarData = [
        { skill: "Coding", dept: 85, collegeAvg: 70 },
        { skill: "System Design", dept: 75, collegeAvg: 55 },
        { skill: "Comm.", dept: 78, collegeAvg: 72 },
        { skill: "Aptitude", dept: 88, collegeAvg: 80 },
        { skill: "Projects", dept: 82, collegeAvg: 65 },
    ];

    const placementDistribution = dashboardData?.placementDistribution || [];

    const atRiskStudents = [
        { id: "CSE001", name: "Priya Sharma", readiness: 35, status: "Critical", issues: ["Low DSA Score", "No Projects"], lastActivity: "2 days ago" },
        { id: "CSE005", name: "Sneha Reddy", readiness: 45, status: "At Risk", issues: ["Interview Skills"], lastActivity: "4 days ago" },
        { id: "CSE012", name: "Rahul Singh", readiness: 42, status: "At Risk", issues: ["Backlog"], lastActivity: "1 day ago" },
    ];

    const topPerformers = [
        { rank: 1, name: "Arjun Mehta", score: 95, offers: 5, package: 12.5 },
        { rank: 2, name: "Karthik Rao", score: 91, offers: 4, package: 10.8 },
        { rank: 3, name: "Vikram Shah", score: 88, offers: 3, package: 9.2 },
    ];

    const upcomingEvents = [
        { date: "Jan 28", title: "Dept System Design Workshop", type: "Workshop", attendees: 95 },
        { date: "Feb 02", title: "Amazon Pre-Placement Talk", type: "PPT", attendees: 240 },
    ];

    const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];

    return (
        <div className="min-h-dvh bg-background transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
                <div className="container flex min-h-16 min-w-0 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 flex-shrink-0 cursor-pointer items-center gap-0 group" onClick={() => navigate("/")}>
                        <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-10 w-10 flex-shrink-0 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12" />
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text font-black text-lg leading-none text-transparent sm:text-xl">NextGen</span>
                            <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-80 sm:text-[10px]">TPO Dept Head Portal</p>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 md:gap-4">
                        <div className="relative order-2 w-full min-w-0 group sm:order-none sm:max-w-xs sm:flex-initial md:max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Search dept students..."
                                className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary sm:max-w-xs md:w-64 md:max-w-none"
                            />
                        </div>

                        <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-none sm:justify-end sm:gap-2 md:gap-4">
                            <Button variant="ghost" size="sm" className="relative shrink-0 touch-manipulation">
                                <Bell className="h-4 w-4" />
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">2</span>
                            </Button>

                            <div className="hidden h-8 w-px bg-border sm:block" />

                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                                    <span className="text-[10px] font-black text-white">DH</span>
                                </div>
                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-black text-foreground">TPO Dept Head (CSE)</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">head.cse@tpo.edu</p>
                                </div>
                            </div>

                            <ThemeToggle />

                            <Button variant="ghost" size="sm" className="shrink-0 touch-manipulation text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => {
                                localStorage.removeItem("userRole");
                                navigate("/");
                            }}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-t border-border bg-background/60 backdrop-blur-md">
                    <div className="container px-4 sm:px-6">
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
                        <div className={`${isMobile ? 'hidden' : 'flex'} gap-1 overflow-x-auto`}>
                            {DEPT_TABS.map((view) => (
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
                        <SheetContent side="left" className="max-w-full w-[min(20rem,calc(100vw-1rem))] px-4">
                            <div className="space-y-2 mt-8">
                                {DEPT_TABS.map((view) => (
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
                <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                            {selectedView === "overview" && "TPO Dept Overview"}
                            {selectedView === "analytics" && "Dept Analytics"}
                            {selectedView === "students" && "Dept Students"}
                            {selectedView === "reports" && "Dept Reports"}
                        </h1>
                        <p className="text-lg text-muted-foreground flex items-center gap-3 font-medium">
                            <Calendar className="w-5 h-5" />
                            Manage your department's placement activities and student progress
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {selectedView !== "reports" && (
                            <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-6">
                                <Filter className="w-5 h-5" />
                                Filter Data
                            </Button>
                        )}
                    </div>
                </div>

                {selectedView === "overview" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
                            {dynamicDeptStats.map((stat, idx) => {
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

                        <div className="grid lg:grid-cols-2 gap-8 mb-12">
                            <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                        Critical Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {atRiskStudents.map((student) => (
                                            <div key={student.id} className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                                <div className="min-w-0">
                                                    <h4 className="text-lg font-bold">{student.name}</h4>
                                                    <p className="text-xs uppercase text-muted-foreground">{student.id}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <span className="block font-bold text-red-500">{student.readiness}% Ready</span>
                                                    <span className="text-xs text-muted-foreground">{student.issues[0]}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-0">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-2xl font-black">Upcoming Dept Events</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {upcomingEvents.map((event, idx) => (
                                            <div key={idx} className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                                <div className="min-w-0">
                                                    <h4 className="text-lg font-bold">{event.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <span className="block text-xl font-bold">{event.attendees}</span>
                                                    <span className="text-xs uppercase text-muted-foreground">Attendees</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {selectedView === "analytics" && (
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        <Card className="shadow-lg border-0">
                            <CardHeader><CardTitle className="text-xl font-bold">Dept vs College Statistics</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={comparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="metric" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="dept" fill="#3b82f6" name="Dept Average" />
                                        <Bar dataKey="collegeAvg" fill="#9ca3af" name="College Average" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader><CardTitle className="text-xl font-bold">Skills Assessment</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={skillsRadarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="skill" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar name="Dept" dataKey="dept" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Radar name="College" dataKey="collegeAvg" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {selectedView === "students" && (
                    <StudentManagement />
                )}

                {selectedView === "approvals" && (
                    <div className="container px-0 sm:px-4 py-6">
                        <ApprovalsHub />
                    </div>
                )}

                {selectedView === "reports" && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                <FileBarChart className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                                <h3 className="font-bold text-lg mb-2">Dept Placement Report</h3>
                                <Button className="w-full">Generate PDF</Button>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                <Users className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                                <h3 className="font-bold text-lg mb-2">Student Readiness</h3>
                                <Button className="w-full">Export CSV</Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </main>
        </div>
    );
}

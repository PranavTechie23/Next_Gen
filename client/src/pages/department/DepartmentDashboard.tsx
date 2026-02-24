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

export default function DepartmentDashboard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [, navigate] = useLocation();
    const [selectedView, setSelectedView] = useState("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const mainContentRef = useRef<HTMLElement>(null);

    // Scroll to top when selectedView changes
    useEffect(() => {
        window.scrollTo(0, 0);
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
    }, [selectedView]);

    // Department specific stats (e.g., CSE)
    const deptStats = [
        { label: "Dept Students", value: "320", change: "+2%", trend: "up", icon: Users, color: "bg-blue-500" },
        { label: "Placement Ready", value: "285", change: "+15%", trend: "up", icon: Target, color: "bg-green-500" },
        { label: "Avg Readiness", value: "74%", change: "+5%", trend: "up", icon: Award, color: "bg-purple-500" },
        { label: "Placed (YoY)", value: "84%", change: "+10%", trend: "up", icon: TrendingUp, color: "bg-orange-500" },
    ];

    const additionalMetrics = [
        { label: "Active Companies", value: "45", change: "+5%", trend: "up", icon: Building2 },
        { label: "Avg Package (LPA)", value: "8.2", change: "+12%", trend: "up", icon: Briefcase },
        { label: "Dept Workshops", value: "12", change: "+20%", trend: "up", icon: BookOpen },
        { label: "Interview Success", value: "72%", change: "+4%", trend: "up", icon: Activity },
    ];

    // Comparisons: Dept vs College Average
    const comparisonData = [
        { metric: "Placement Rate", dept: 84, collegeAvg: 78 },
        { metric: "Avg Package", dept: 8.2, collegeAvg: 6.5 },
        { metric: "Readiness", dept: 74, collegeAvg: 68 },
        { metric: "Internships", dept: 65, collegeAvg: 45 },
    ];

    const yearTrend = [
        { year: "2020", placements: 82, avg_salary: 6.5 },
        { year: "2021", placements: 85, avg_salary: 7.2 },
        { year: "2022", placements: 88, avg_salary: 7.8 },
        { year: "2023", placements: 91, avg_salary: 8.5 },
        { year: "2024", placements: 94, avg_salary: 9.2 },
    ];

    const skillsRadarData = [
        { skill: "Coding", dept: 85, collegeAvg: 70 },
        { skill: "System Design", dept: 75, collegeAvg: 55 },
        { skill: "Comm.", dept: 78, collegeAvg: 72 },
        { skill: "Aptitude", dept: 88, collegeAvg: 80 },
        { skill: "Projects", dept: 82, collegeAvg: 65 },
    ];

    const placementDistribution = [
        { name: "Product Based", value: 45, color: "#1e3a8a" },
        { name: "Service Based", value: 35, color: "#3b82f6" },
        { name: "Startups", value: 15, color: "#60a5fa" },
        { name: "Core", value: 5, color: "#93c5fd" },
    ];

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
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
                <div className="container flex items-center justify-between h-16 px-6">
                    <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate("/")}>
                        <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                        <div className="flex flex-col">
                            <span className="font-black text-xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-80">TPO Dept Head Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search dept students..."
                                className="pl-10 pr-4 py-2 border border-border bg-muted/30 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
                            />
                        </div>

                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
                        </Button>

                        <div className="h-8 w-px bg-border"></div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-xs">DH</span>
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-black text-foreground">TPO Dept Head (CSE)</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">head.cse@tpo.edu</p>
                            </div>
                        </div>

                        <ThemeToggle />

                        <Button variant="ghost" size="sm" onClick={() => {
                            localStorage.removeItem("userRole");
                            navigate("/");
                        }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="w-4 h-4" />
                        </Button>
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
                            {["overview", "analytics", "students", "reports"].map((view) => (
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
                                {["overview", "analytics", "students", "reports"].map((view) => (
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
                            {deptStats.map((stat, idx) => {
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
                                            <div key={student.id} className="p-6 border border-border bg-muted/20 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-lg">{student.name}</h4>
                                                    <p className="text-xs text-muted-foreground uppercase">{student.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-red-500 font-bold block">{student.readiness}% Ready</span>
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
                                            <div key={idx} className="p-6 border border-border bg-muted/20 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-lg">{event.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-xl block">{event.attendees}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">Attendees</span>
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
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <input type="text" placeholder="Search student..." className="flex-1 p-3 rounded-xl border border-border bg-background" />
                            <select className="p-3 rounded-xl border border-border bg-background">
                                <option>All Status</option>
                                <option>Placed</option>
                                <option>Unplaced</option>
                            </select>
                        </div>
                        <div className="grid gap-4">
                            {/* Mock student list */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between bg-card text-card-foreground">
                                    <div>
                                        <h4 className="font-bold">Student Name {i}</h4>
                                        <p className="text-sm text-muted-foreground">CSE • {i}23456</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">Ready</span>
                                        <Button size="sm" variant="outline">View Profile</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
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

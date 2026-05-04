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
import { toast } from "sonner";
import { performClientLogout } from "@/lib/logout";

/** Readable scores for radar tooltip / labels (no noisy decimals). */
function formatSkillScore(v: unknown): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    const rounded = Math.round(n * 10) / 10;
    return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
}

function SkillsRadarTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number; color?: string; payload?: { skill?: string } }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    const skillName =
        (typeof label === "string" && label) ||
        payload[0]?.payload?.skill ||
        "Skill";

    return (
        <div className="min-w-[200px] rounded-xl border border-border/80 bg-background/95 px-4 py-3 shadow-2xl backdrop-blur-xl ring-1 ring-border/30">
            <p className="mb-2.5 border-b border-border/60 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {skillName}
            </p>
            <div className="space-y-2">
                {payload.map((entry) => (
                    <div key={String(entry.name)} className="flex items-center justify-between gap-6 text-[13px]">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full ring-2 ring-border"
                                style={{ backgroundColor: entry.color || "#818cf8" }}
                            />
                            <span>{entry.name}</span>
                        </span>
                        <span className="tabular-nums text-sm font-semibold tracking-tight text-foreground">
                            {formatSkillScore(entry.value)}
                            <span className="ml-0.5 text-[11px] font-normal text-muted-foreground">/100</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

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
                toast.error("Could not load department overview. Check connection or try refreshing.");
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const stats = dashboardData?.stats || { totalStudents: 0, placedStudents: 0, avgPackage: 0, atRiskStudents: 0 };

    // Department specific stats (DB-driven)
    const dynamicDeptStats = [
        { label: "Dept Students", value: stats.totalStudents, change: "Live", trend: "up", icon: Users, color: "bg-blue-500" },
        { label: "Placed Students", value: stats.placedStudents, change: "Live", trend: "up", icon: Award, color: "bg-green-500" },
        { label: "Avg Package", value: `${stats.avgPackage} LPA`, change: "Live", trend: "up", icon: DollarSign, color: "bg-purple-500" },
        { label: "At Risk", value: stats.atRiskStudents, change: "Live", trend: "down", icon: AlertTriangle, color: "bg-red-500" },
    ];

    // Comparisons: Dept vs College Average
    const comparisonData = dashboardData?.comparisonData || [];

    const yearTrend = dashboardData?.yearTrend || [];

    const skillsRadarData = dashboardData?.skillsRadarData || [];

    const placementDistribution = dashboardData?.placementDistribution || [];

    const atRiskStudents = dashboardData?.atRiskStudents || [];
    const topPerformers = dashboardData?.topPerformers || [];
    const upcomingEvents = dashboardData?.upcomingEvents || [];

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

                            <Button variant="ghost" size="sm" className="shrink-0 touch-manipulation text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => performClientLogout(navigate)}>
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

                        <Card className="relative overflow-hidden border border-border/80 bg-gradient-to-b from-card via-card/95 to-muted/20 shadow-xl backdrop-blur-sm">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.12), transparent 60%)",
                                }}
                            />
                            <CardHeader className="relative space-y-1.5 pb-2">
                                <CardTitle className="text-xl font-bold tracking-tight">Skills Assessment</CardTitle>
                                <CardDescription className="text-sm leading-relaxed">
                                    Department vs college average scores from performance metrics (0–100).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative pt-0">
                                {skillsRadarData.length === 0 ? (
                                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/15 px-6 py-10 text-center">
                                        <p className="text-sm font-semibold text-foreground">No skill benchmarks yet</p>
                                        <p className="max-w-sm text-xs text-muted-foreground">
                                            When students have performance metrics (e.g. AMCAT), this chart compares your
                                            department to the college average.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pl-0 pr-0 sm:pl-1 sm:pr-1">
                                        <ResponsiveContainer width="100%" height={360}>
                                            <RadarChart
                                                cx="50%"
                                                cy="50%"
                                                outerRadius="78%"
                                                data={skillsRadarData}
                                                margin={{ top: 24, right: 36, bottom: 28, left: 36 }}
                                            >
                                                <PolarGrid
                                                    stroke="var(--border)"
                                                    strokeOpacity={0.65}
                                                    strokeDasharray="4 6"
                                                />
                                                <PolarAngleAxis
                                                    dataKey="skill"
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        fill: "var(--foreground)",
                                                        opacity: 0.92,
                                                    }}
                                                />
                                                <PolarRadiusAxis
                                                    domain={[0, 100]}
                                                    tickCount={5}
                                                    tick={{ fontSize: 10, fill: "var(--muted-foreground)", opacity: 0.85 }}
                                                    axisLine={false}
                                                />
                                                <Radar
                                                    name="Department"
                                                    dataKey="dept"
                                                    stroke="#818cf8"
                                                    strokeWidth={2}
                                                    fill="#818cf8"
                                                    fillOpacity={0.28}
                                                    dot={{ r: 3.5, strokeWidth: 2, fill: "var(--background)", stroke: "#818cf8" }}
                                                    activeDot={{ r: 5.5, strokeWidth: 2, fill: "#818cf8", stroke: "#fff" }}
                                                />
                                                <Radar
                                                    name="College average"
                                                    dataKey="collegeAvg"
                                                    stroke="#14b8a6"
                                                    strokeWidth={2}
                                                    fill="#2dd4bf"
                                                    fillOpacity={0.22}
                                                    dot={{ r: 3.5, strokeWidth: 2, fill: "var(--background)", stroke: "#14b8a6" }}
                                                    activeDot={{ r: 5.5, strokeWidth: 2, fill: "#14b8a6", stroke: "#fff" }}
                                                />
                                                <Tooltip
                                                    content={(props) => <SkillsRadarTooltip {...props} />}
                                                    cursor={{ stroke: "var(--border)", strokeOpacity: 0.9 }}
                                                    wrapperStyle={{ outline: "none" }}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    iconType="circle"
                                                    iconSize={9}
                                                    wrapperStyle={{ paddingTop: 8 }}
                                                    formatter={(value) => (
                                                        <span className="text-xs font-semibold text-foreground">{value}</span>
                                                    )}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
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

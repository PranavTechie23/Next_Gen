import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import type { TooltipProps } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { LogOut, Settings, Users, TrendingUp, AlertTriangle, Download, Filter, Search, Bell, ChevronRight, Award, Target, BookOpen, Briefcase, Calendar as CalendarIcon, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Upload, FileText, GraduationCap, Building2, BarChart3, Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Clock, DollarSign, Users2, Plus, Edit, Trash2, MoreVertical, CheckCircle2, XCircle, RefreshCw, FileSpreadsheet, FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, TrendingDown as TrendingDownIcon, Rocket, Shield, Globe, Star, MessageSquare, ArrowLeft, Menu, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudentManagement } from "./StudentManagement";
import { ApprovalsHub, type ActionFilter } from "./ApprovalsHub";
import { deptApi } from "@/services/deptApi";
import { toast } from "sonner";
import { performClientLogout } from "@/lib/logout";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/** Readable scores for radar tooltip / labels (no noisy decimals). */
function formatSkillScore(v: unknown): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    const rounded = Math.round(n * 10) / 10;
    return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
}

type AtRiskStudent = {
    id: string;
    name: string;
    readiness: number;
    issues: string[];
};

function SkillsRadarTooltip({ active, payload, label }: TooltipProps<any, any>) {
    if (!active || !payload?.length) return null;
    const skillName =
        (typeof label === "string" && label) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((payload[0] as any)?.payload?.skill as string | undefined) ||
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

type UpcomingEvent = {
    date: string;
    title: string;
    type: string;
    attendees: number;
};

type DeptProfile = {
    email: string;
    name?: string;
    department_name?: string;
    department_code?: string;
};

type ReadinessStudent = {
    user_id: string | number;
    roll_number?: string;
    email?: string;
    current_cgpa?: number | string | null;
    active_backlogs?: number | string | null;
    is_placed?: number | boolean;
    readiness: number;
    readiness_band?: string;
    issues: string[];
};

const DEPT_TABS = ["overview", "analytics", "students", "approvals", "reports"] as const;
type DeptTab = (typeof DEPT_TABS)[number];

const DEPT_TAB_LABELS: Record<DeptTab, string> = {
    overview: "Overview",
    analytics: "Analytics",
    students: "Students",
    approvals: "Action Center",
    reports: "Reports",
};

function initialDeptTabFromUrl(): DeptTab {
    const raw = new URLSearchParams(window.location.search).get("tab");
    if (raw && (DEPT_TABS as readonly string[]).includes(raw)) {
        return raw as DeptTab;
    }
    return "overview";
}

async function messageFromDeptExportError(err: unknown): Promise<string> {
    const e = err as { response?: { data?: unknown } };
    const data = e.response?.data;
    if (data instanceof Blob) {
        try {
            const t = await data.text();
            const j = JSON.parse(t) as { message?: string };
            return j.message || "Download failed.";
        } catch {
            return "Download failed.";
        }
    }
    if (data && typeof data === "object" && "message" in data) {
        return String((data as { message?: string }).message || "Download failed.");
    }
    return "Download failed. Try again.";
}

export default function DepartmentDashboard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [, navigate] = useLocation();
    const [selectedView, setSelectedView] = useState<DeptTab>(() => initialDeptTabFromUrl());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    const [deptProfile, setDeptProfile] = useState<DeptProfile | null>(null);
    const [readinessStudents, setReadinessStudents] = useState<ReadinessStudent[]>([]);
    const [headerSearch, setHeaderSearch] = useState("");
    const [studentListSearch, setStudentListSearch] = useState("");
    const [actionCenterSearch, setActionCenterSearch] = useState("");
    const [actionCenterFilter, setActionCenterFilter] = useState<ActionFilter>("all");
    const [loadingStats, setLoadingStats] = useState(true);
    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);
    const [exportingReport, setExportingReport] = useState<string | null>(null);
    const [eligibilityCriteria, setEligibilityCriteria] = useState({
        minCgpa: "7",
        maxBacklogs: "0",
        minReadiness: "70",
    });
    const [dismissedAlerts, setDismissedAlerts] = useState<boolean>(false);
    
    // New Event state
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [isSavingEvent, setIsSavingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        type: "Workshop",
        meetingLink: "",
        mode: "OFFLINE",
        attendees: 0
    });

    const handleCreateEvent = async () => {
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setIsSavingEvent(true);
            await deptApi.saveDeptEvent({
                title: newEvent.title,
                date: newEvent.date,
                type: newEvent.type,
                meetingLink: newEvent.meetingLink,
                mode: newEvent.mode
            });
            toast.success("Event created successfully! It will be visible to your department students.");
            setIsEventDialogOpen(false);
            setNewEvent({ title: "", date: "", type: "Workshop", meetingLink: "", mode: "OFFLINE", attendees: 0 });
            
            // Refresh stats to show new event
            const data = await deptApi.getDashboardStats();
            setDashboardData(data);
        } catch (error) {
            console.error("Failed to create event", error);
            toast.error("Failed to create event. Please try again.");
        } finally {
            setIsSavingEvent(false);
        }
    };

    const handlePlacementPdf = async () => {
        try {
            setExportingPdf(true);
            await deptApi.downloadPlacementReportPdf();
            toast.success("Placement report downloaded.");
        } catch (err) {
            console.error(err);
            toast.error(await messageFromDeptExportError(err));
        } finally {
            setExportingPdf(false);
        }
    };

    const handleReadinessCsv = async () => {
        try {
            setExportingCsv(true);
            await deptApi.downloadStudentReadinessCsv();
            toast.success("Student readiness export downloaded.");
        } catch (err) {
            console.error(err);
            toast.error(await messageFromDeptExportError(err));
        } finally {
            setExportingCsv(false);
        }
    };

    const handleReportExport = async (report: string, action: () => Promise<void>) => {
        try {
            setExportingReport(report);
            await action();
            toast.success("Report downloaded.");
        } catch (err) {
            console.error(err);
            toast.error(await messageFromDeptExportError(err));
        } finally {
            setExportingReport(null);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                const [data, profile, readiness] = await Promise.all([
                    deptApi.getDashboardStats(),
                    deptApi.getDeptProfile(),
                    deptApi.getReadinessDesk(),
                ]);
                setDashboardData(data);
                setDeptProfile(profile);
                setReadinessStudents(readiness.students || []);
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

    const atRiskStudents: AtRiskStudent[] = dashboardData?.atRiskStudents || [];
    const topPerformers = dashboardData?.topPerformers || [];
    const upcomingEvents: UpcomingEvent[] = dashboardData?.upcomingEvents || [];

    const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];
    const deptCode = deptProfile?.department_code || "Dept";
    const headName = deptProfile?.name || "TPO Dept Head";
    const headEmail = deptProfile?.email || "";
    const headInitials = headName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "DH";
    const activeReadinessStudents = readinessStudents.filter((student) => !student.is_placed);
    const criticalStudents = activeReadinessStudents.filter((student) => student.readiness_band === "Critical");
    const profileGapStudents = activeReadinessStudents.filter((student) =>
        student.issues.includes("Resume missing") || student.issues.includes("Profile links missing")
    );
    const driveReadyStudents = activeReadinessStudents.filter((student) => student.readiness >= 80 && student.issues.length === 0);
    const notificationItems = dismissedAlerts ? [] : [
        {
            id: "critical",
            title: "Needs follow-up",
            detail: `${criticalStudents.length} student${criticalStudents.length === 1 ? "" : "s"} have critical readiness blockers`,
            count: criticalStudents.length,
            filter: "critical" as ActionFilter,
            icon: AlertTriangle,
            color: "text-red-500",
        },
        {
            id: "profile",
            title: "Profile gaps",
            detail: `${profileGapStudents.length} student${profileGapStudents.length === 1 ? "" : "s"} need resume or profile links`,
            count: profileGapStudents.length,
            filter: "profile" as ActionFilter,
            icon: FileText,
            color: "text-amber-500",
        },
        {
            id: "eligible",
            title: "Drive-ready list",
            detail: `${driveReadyStudents.length} student${driveReadyStudents.length === 1 ? "" : "s"} are ready for upcoming drives`,
            count: driveReadyStudents.length,
            filter: "eligible" as ActionFilter,
            icon: CheckCircle2,
            color: "text-emerald-500",
        },
        {
            id: "events",
            title: "Upcoming events",
            detail: `${upcomingEvents.length} department event${upcomingEvents.length === 1 ? "" : "s"} or webinar${upcomingEvents.length === 1 ? "" : "s"} scheduled`,
            count: upcomingEvents.length,
            filter: "all" as ActionFilter,
            icon: Calendar,
            color: "text-blue-500",
        },
    ].filter((item) => item.count > 0);
    const notificationCount = notificationItems.length;
    const headerSearchResults = headerSearch.trim()
        ? readinessStudents
            .filter((student) => {
                const q = headerSearch.trim().toLowerCase();
                return student.roll_number?.toLowerCase().includes(q) || student.email?.toLowerCase().includes(q);
            })
            .slice(0, 6)
        : [];

    const openActionCenter = (filter: ActionFilter, search = "") => {
        setActionCenterFilter(filter);
        setActionCenterSearch(search);
        setSelectedView("approvals");
    };

    const openStudentSearch = (search: string) => {
        setStudentListSearch(search);
        setSelectedView("students");
    };

    return (
        <div className="min-h-dvh bg-background transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 dark:border-border/50 shadow-sm dark:shadow-md">
                <div className="container flex min-h-16 min-w-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div className="flex min-w-0 flex-shrink-0 cursor-pointer items-center gap-0 group" onClick={() => navigate("/")}>
                        <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-10 w-10 flex-shrink-0 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12" />
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text font-black text-lg leading-none text-transparent sm:text-xl">NextGen</span>
                            <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-80 sm:text-[10px]">TPO Dept Head Portal</p>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 md:gap-4">
                        <Popover open={headerSearch.trim().length > 0} onOpenChange={(open) => !open && setHeaderSearch("")}>
                            <PopoverTrigger asChild>
                                <div className="relative order-2 w-full min-w-0 group sm:order-none sm:max-w-xs sm:flex-initial md:max-w-md">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input
                                        type="text"
                                        value={headerSearch}
                                        onChange={(event) => setHeaderSearch(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" && headerSearch.trim()) {
                                                openStudentSearch(headerSearch.trim());
                                                setHeaderSearch("");
                                            }
                                        }}
                                        placeholder="Search dept students..."
                                        className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary sm:max-w-xs md:w-64 md:max-w-none"
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-2">
                                <div className="space-y-1">
                                    {headerSearchResults.length === 0 ? (
                                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">No matching department students</div>
                                    ) : (
                                        headerSearchResults.map((student) => (
                                            <button
                                                key={student.user_id}
                                                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                                                onClick={() => {
                                                    openStudentSearch(student.roll_number || student.email || headerSearch.trim());
                                                    setHeaderSearch("");
                                                }}
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-bold text-foreground">
                                                        {student.email?.split("@")[0] || student.roll_number || "Student"}
                                                    </span>
                                                    <span className="block truncate text-xs text-muted-foreground">{student.roll_number || student.email}</span>
                                                </span>
                                                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                                                    {student.readiness}%
                                                </span>
                                            </button>
                                        ))
                                    )}
                                    {headerSearchResults.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            className="mt-1 w-full justify-start text-sm"
                                            onClick={() => {
                                                openStudentSearch(headerSearch.trim());
                                                setHeaderSearch("");
                                            }}
                                        >
                                            View all matches
                                        </Button>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-none sm:justify-end sm:gap-2 md:gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="relative shrink-0 touch-manipulation">
                                        <Bell className="h-4 w-4" />
                                        {notificationCount > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                                                {notificationCount > 99 ? "99+" : notificationCount}
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
                                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                        <div>
                                            <p className="text-sm font-black text-foreground">Department alerts</p>
                                            <p className="text-xs text-muted-foreground">Generated from current readiness data</p>
                                        </div>
                                        {notificationItems.length > 0 && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:bg-blue-500/5"
                                                onClick={() => setDismissedAlerts(true)}
                                            >
                                                Clear All
                                            </Button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto p-2">
                                        {notificationItems.length === 0 ? (
                                            <div className="px-3 py-8 text-center">
                                                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                                                <p className="text-sm font-bold">{dismissedAlerts ? "Alerts cleared" : "No readiness alerts"}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {dismissedAlerts ? "You've hidden the active alerts for this session." : "Your department has no urgent blockers right now."}
                                                </p>
                                                {dismissedAlerts && (
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-500"
                                                        onClick={() => setDismissedAlerts(false)}
                                                    >
                                                        Restore Alerts
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            notificationItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted"
                                                        onClick={() => item.id === "events" ? setSelectedView("overview") : openActionCenter(item.filter)}
                                                    >
                                                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.color}`} />
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-sm font-bold text-foreground">{item.title}</span>
                                                            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
                                                        </span>
                                                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <div className="hidden h-8 w-px bg-border sm:block" />

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                                    <span className="text-xs font-black text-white">{headInitials}</span>
                                </div>
                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-black text-foreground leading-tight">{headName}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{deptCode} Head</p>
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
                <div className="border-t border-border/40 bg-background/40 backdrop-blur-md">
                    <div className="container px-4 sm:px-8">
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
                                    className={`px-4 md:px-6 py-3 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${selectedView === view
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    {DEPT_TAB_LABELS[view]}
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
                                        className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${selectedView === view
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted/50"
                                            }`}
                                    >
                                        {DEPT_TAB_LABELS[view]}
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
                className={`container ${selectedView === "approvals" ? "py-4 md:py-8" : "py-8 md:py-16"} px-4 sm:px-8 max-w-7xl mx-auto`}
            >
                <div className={`${selectedView === "approvals" ? "hidden" : "mb-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"}`}>
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
                            {selectedView === "overview" && "TPO Dept Overview"}
                            {selectedView === "analytics" && "Dept Analytics"}
                            {selectedView === "students" && "Dept Students"}
                            {selectedView === "approvals" && "  "}
                            {selectedView === "reports" && "Dept Reports"}
                        </h1>
                        <p className="text-lg text-muted-foreground flex items-center gap-3 font-medium">
                            
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {selectedView === "students" && (
                            <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-6" onClick={() => setIsFilterOpen(true)}>
                                <Filter className="w-5 h-5" />
                                Filter Data
                            </Button>
                        )}
                    </div>
                </div>

                {selectedView === "overview" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 lg:gap-10 mb-12 md:mb-16">
                            {dynamicDeptStats.map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <Card key={idx} className="relative overflow-hidden shadow-lg shadow-black/5 dark:shadow-xl border-border/40 dark:border-border/30 hover:shadow-2xl hover:border-blue-500/30 transition-all hover:scale-[1.02] cursor-pointer bg-background/60 dark:bg-card/60 backdrop-blur-sm">
                                        <div className={`absolute top-0 right-0 w-40 h-40 ${stat.color} opacity-[0.03] dark:opacity-[0.08] rounded-bl-full`}></div>
                                        <CardContent className="pt-10 pb-10 relative z-10">
                                            <div className="flex items-start justify-between mb-8">
                                                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg ${stat.color === 'bg-blue-500' ? 'shadow-blue-500/20' : stat.color === 'bg-green-500' ? 'shadow-green-500/20' : stat.color === 'bg-purple-500' ? 'shadow-purple-500/20' : 'shadow-red-500/20'}`}>
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black ${stat.trend === "up" ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-red-500/15 text-red-600 dark:text-red-400"
                                                    }`}>
                                                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                    {stat.change}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4 font-semibold tracking-wide">{stat.label}</p>
                                            <p className="text-5xl lg:text-6xl font-black text-foreground">{stat.value}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10 mb-16">
                            <Card className="shadow-xl border border-border/30 border-l-4 border-l-red-500 bg-card/60 backdrop-blur-sm">
                                <CardHeader className="pb-8">
                                    <CardTitle className="text-2xl font-black flex items-center gap-3 text-foreground">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                        Critical Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-5">
                                        {atRiskStudents.map((student) => (
                                            <div key={student.id} className="flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 hover:bg-muted/50 transition-colors">
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

                            <Card className="shadow-xl border border-border/30 bg-card/60 backdrop-blur-sm">
                                <CardHeader className="pb-8 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-2xl font-black text-foreground">Upcoming Dept Events</CardTitle>
                                    <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                                <Plus className="w-4 h-4" />
                                                Add Event
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] border-border/80 bg-background/95 backdrop-blur-xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black">Create Dept Event</DialogTitle>
                                                <DialogDescription className="font-medium text-muted-foreground">
                                                    Add an event for your department students. This will be visible on their dashboards.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-6 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Event Title</Label>
                                                    <Input
                                                        id="title"
                                                        placeholder="e.g., System Design Sprint"
                                                        value={newEvent.title}
                                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                                        className="rounded-xl border-border/60 bg-muted/20 py-6 font-semibold transition-all focus:ring-2 focus:ring-primary/40"
                                                    />
                                                </div>
                                                 <div className="grid gap-2">
                                                     <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Date & Time</Label>
                                                     <div className="flex gap-2">
                                                         <Popover>
                                                             <PopoverTrigger asChild>
                                                                 <Button
                                                                     variant="outline"
                                                                     className={cn(
                                                                         "h-[52px] flex-1 justify-start rounded-xl border-border/60 bg-muted/20 text-left font-semibold transition-all focus:ring-2 focus:ring-primary/40",
                                                                         !newEvent.date && "text-muted-foreground"
                                                                     )}
                                                                 >
                                                                     <CalendarIcon className="mr-2 h-4 w-4" />
                                                                     {newEvent.date ? (
                                                                         format(new Date(newEvent.date), "PPP")
                                                                     ) : (
                                                                         <span>Pick a date</span>
                                                                     )}
                                                                 </Button>
                                                             </PopoverTrigger>
                                                             <PopoverContent className="w-auto p-0" align="start">
                                                                 <Calendar
                                                                     mode="single"
                                                                     selected={newEvent.date ? new Date(newEvent.date) : undefined}
                                                                     onSelect={(date) => {
                                                                         if (date) {
                                                                             const currentTime = newEvent.date ? newEvent.date.split('T')[1] || "09:00:00" : "09:00:00";
                                                                             const newDateTime = `${format(date, "yyyy-MM-dd")}T${currentTime}`;
                                                                             setNewEvent({ ...newEvent, date: newDateTime });
                                                                         }
                                                                     }}
                                                                     initialFocus
                                                                 />
                                                             </PopoverContent>
                                                         </Popover>
                                                         <Input
                                                             type="time"
                                                             className="h-[52px] w-[130px] rounded-xl border-border/60 bg-muted/20 font-semibold transition-all focus:ring-2 focus:ring-primary/40 [color-scheme:dark]"
                                                             value={newEvent.date ? newEvent.date.split('T')[1]?.slice(0, 5) : "09:00"}
                                                             onChange={(e) => {
                                                                 const datePart = newEvent.date ? newEvent.date.split('T')[0] : format(new Date(), "yyyy-MM-dd");
                                                                 setNewEvent({ ...newEvent, date: `${datePart}T${e.target.value}:00` });
                                                             }}
                                                         />
                                                     </div>
                                                 </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Mode</Label>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant={newEvent.mode === "OFFLINE" ? "default" : "outline"}
                                                            className={cn(
                                                                "h-[52px] flex-1 rounded-xl font-bold transition-all",
                                                                newEvent.mode === "OFFLINE" ? "shadow-lg shadow-primary/20" : "bg-muted/20 border-border/60"
                                                            )}
                                                            onClick={() => setNewEvent({ ...newEvent, mode: "OFFLINE", meetingLink: "" })}
                                                        >
                                                            Offline
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant={newEvent.mode === "ONLINE" ? "default" : "outline"}
                                                            className={cn(
                                                                "h-[52px] flex-1 rounded-xl font-bold transition-all",
                                                                newEvent.mode === "ONLINE" ? "shadow-lg shadow-primary/20" : "bg-muted/20 border-border/60"
                                                            )}
                                                            onClick={() => setNewEvent({ ...newEvent, mode: "ONLINE" })}
                                                        >
                                                            Online
                                                        </Button>
                                                    </div>
                                                </div>

                                                {newEvent.mode === "ONLINE" && (
                                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <Label htmlFor="link" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Meeting Link</Label>
                                                        <Input
                                                            id="link"
                                                            placeholder="e.g., https://meet.google.com/..."
                                                            value={newEvent.meetingLink}
                                                            onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                                                            className="rounded-xl border-border/60 bg-muted/20 py-6 font-semibold transition-all focus:ring-2 focus:ring-primary/40"
                                                        />
                                                    </div>
                                                )}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="type" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Event Type</Label>
                                                    <UISelect 
                                                        value={newEvent.type} 
                                                        onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
                                                    >
                                                        <UISelectTrigger className="h-[52px] rounded-xl border-border/60 bg-muted/20 font-semibold transition-all focus:ring-2 focus:ring-primary/40">
                                                            <UISelectValue placeholder="Select type" />
                                                        </UISelectTrigger>
                                                        <UISelectContent className="border-border/80 bg-background/95 backdrop-blur-xl">
                                                            <UISelectItem value="Workshop">Workshop</UISelectItem>
                                                            <UISelectItem value="Masterclass">Masterclass</UISelectItem>
                                                            <UISelectItem value="Contest">Contest</UISelectItem>
                                                            <UISelectItem value="Mock Interview">Mock Interview</UISelectItem>
                                                            <UISelectItem value="Seminar">Seminar</UISelectItem>
                                                        </UISelectContent>
                                                    </UISelect>
                                                </div>
                                            </div>
                                            <DialogFooter className="mt-4 gap-3 sm:gap-0">
                                                <Button variant="ghost" onClick={() => setIsEventDialogOpen(false)} className="rounded-xl font-bold py-6">Cancel</Button>
                                                <Button 
                                                    onClick={handleCreateEvent} 
                                                    disabled={isSavingEvent}
                                                    className="rounded-xl font-bold py-6 px-8 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    {isSavingEvent ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : "Create Event"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-5">
                                        {upcomingEvents.map((event: UpcomingEvent, idx) => (
                                            <div key={idx} className="flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 hover:bg-muted/50 transition-colors">
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
                        <Card className="relative overflow-hidden border border-border/80 bg-gradient-to-b from-card via-card/95 to-muted/20 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.12), transparent 60%)",
                                }}
                            />
                            <CardHeader className="relative space-y-2 pb-4">
                                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Dept vs College Statistics</CardTitle>
                                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                                    Comparing departmental placement metrics against overall college averages.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative pt-6">
                                <ResponsiveContainer width="100%" height={360}>
                                    <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            </linearGradient>
                                            <linearGradient id="colorCollege" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.6}/>
                                                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                                        <XAxis dataKey="metric" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip 
                                            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--background)/95', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                        <Bar dataKey="dept" fill="url(#colorDept)" name="Dept Average" radius={[6, 6, 0, 0]} barSize={32} />
                                        <Bar dataKey="collegeAvg" fill="url(#colorCollege)" name="College Average" radius={[6, 6, 0, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border border-border/30 bg-gradient-to-b from-card via-card/95 to-muted/10 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.12), transparent 60%)",
                                }}
                            />
                            <CardHeader className="relative space-y-2 pb-4">
                                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Skills Assessment</CardTitle>
                                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                                    Department vs college average scores from performance metrics (0–100).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative pt-6">
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
                                                outerRadius="75%"
                                                data={skillsRadarData}
                                                margin={{ top: 20, right: 30, bottom: 10, left: 30 }}
                                            >
                                                <defs>
                                                    <radialGradient id="colorDeptRadar" cx="50%" cy="50%" r="50%">
                                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                    </radialGradient>
                                                    <radialGradient id="colorCollegeRadar" cx="50%" cy="50%" r="50%">
                                                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1}/>
                                                    </radialGradient>
                                                </defs>
                                                <PolarGrid
                                                    stroke="var(--border)"
                                                    strokeOpacity={0.4}
                                                    strokeDasharray="none"
                                                />
                                                <PolarAngleAxis
                                                    dataKey="skill"
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        fill: "var(--foreground)",
                                                        dy: 4
                                                    }}
                                                />
                                                <PolarRadiusAxis
                                                    angle={30}
                                                    domain={[0, 100]}
                                                    tick={false}
                                                    axisLine={false}
                                                />
                                                <Radar
                                                    name="Department"
                                                    dataKey="dept"
                                                    stroke="#3b82f6"
                                                    strokeWidth={3}
                                                    fill="url(#colorDeptRadar)"
                                                    dot={{ r: 4, strokeWidth: 2, fill: "var(--background)", stroke: "#3b82f6" }}
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                                                />
                                                <Radar
                                                    name="College Average"
                                                    dataKey="collegeAvg"
                                                    stroke="#14b8a6"
                                                    strokeWidth={3}
                                                    fill="url(#colorCollegeRadar)"
                                                    dot={{ r: 4, strokeWidth: 2, fill: "var(--background)", stroke: "#14b8a6" }}
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#14b8a6" }}
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
                                                    iconSize={10}
                                                    wrapperStyle={{ paddingTop: 24 }}
                                                    formatter={(value) => (
                                                        <span className="text-sm font-bold text-foreground px-1">{value}</span>
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
                    <StudentManagement isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} externalSearch={studentListSearch} />
                )}

                {selectedView === "approvals" && (
                    <div className="container px-0 sm:px-4 py-6">
                        <ApprovalsHub externalSearch={actionCenterSearch} initialFilter={actionCenterFilter} />
                    </div>
                )}

                {selectedView === "reports" && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <FileBarChart className="mx-auto mb-1 h-12 w-12 text-blue-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Dept placement report</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Summary stats plus every selected offer (roll, email, role, package).
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    disabled={exportingPdf}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void handlePlacementPdf();
                                    }}
                                >
                                    {exportingPdf ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating…
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Generate PDF
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <Users className="mx-auto mb-1 h-12 w-12 text-purple-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Student readiness</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        All students in your department with CGPA, skills, resume flags, and a
                                        readiness score (same logic as the dashboard).
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    disabled={exportingCsv}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void handleReadinessCsv();
                                    }}
                                >
                                    {exportingCsv ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Exporting…
                                        </>
                                    ) : (
                                        <>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            Export CSV
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <Target className="mx-auto mb-1 h-12 w-12 text-emerald-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Eligibility list</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Export unplaced students matching company criteria.
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-left">
                                    <div className="space-y-1">
                                        <Label className="text-xs">CGPA</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={eligibilityCriteria.minCgpa}
                                            onChange={(event) => setEligibilityCriteria({ ...eligibilityCriteria, minCgpa: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Backlogs</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={eligibilityCriteria.maxBacklogs}
                                            onChange={(event) => setEligibilityCriteria({ ...eligibilityCriteria, maxBacklogs: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Ready %</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={eligibilityCriteria.minReadiness}
                                            onChange={(event) => setEligibilityCriteria({ ...eligibilityCriteria, minReadiness: event.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    disabled={exportingReport === "eligibility"}
                                    onClick={() => handleReportExport("eligibility", () => deptApi.downloadEligibilityCsv(eligibilityCriteria))}
                                >
                                    {exportingReport === "eligibility" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                    Export Eligible CSV
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <TrendingDownIcon className="mx-auto mb-1 h-12 w-12 text-amber-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Unplaced students</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Follow-up list with readiness score and blocker reasons.
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    disabled={exportingReport === "unplaced"}
                                    onClick={() => handleReportExport("unplaced", deptApi.downloadUnplacedStudentsCsv)}
                                >
                                    {exportingReport === "unplaced" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                    Export CSV
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <FileText className="mx-auto mb-1 h-12 w-12 text-red-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Missing profile data</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Students missing resume, profile links, or enough skills.
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    disabled={exportingReport === "profile"}
                                    onClick={() => handleReportExport("profile", deptApi.downloadProfileGapsCsv)}
                                >
                                    {exportingReport === "profile" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                    Export CSV
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border border-border/30 shadow-xl transition-shadow hover:shadow-2xl bg-card/60 backdrop-blur-sm">
                            <CardContent className="space-y-6 pt-10 pb-10 text-center">
                                <DollarSign className="mx-auto mb-1 h-12 w-12 text-green-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Placed package report</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Selected offers with company, drive, role, and package.
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    disabled={exportingReport === "packages"}
                                    onClick={() => handleReportExport("packages", deptApi.downloadPlacedPackagesCsv)}
                                >
                                    {exportingReport === "packages" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                    Export CSV
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </main>
        </div>
    );
}

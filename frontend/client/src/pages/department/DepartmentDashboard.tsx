import { useState, useEffect, useRef, useCallback } from "react";
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
import { ReadinessHub, type ActionFilter } from "./Readiness";
import { deptApi } from "@/services/deptApi";
import { toast } from "sonner";
import {
    DASHBOARD_CACHE_KEYS,
    readDashboardCache,
    writeDashboardCache,
    stripMeta,
} from "@/lib/dashboardCache";
import { performClientLogout } from "@/lib/logout";
import { useManualRefresh } from "@/hooks/useManualRefresh";
import { DashboardSyncBar } from "@/components/layouts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

type DeptEvent = {
    id: number;
    title: string;
    date: string;
    type: string;
    meeting_link?: string | null;
    mode?: string | null;
    target_batch?: string | null;
    expires_at?: string | null;
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

const DEPT_TABS = ["overview", "analytics", "students", "readiness", "reports"] as const;
type DeptTab = (typeof DEPT_TABS)[number];

const DEPT_TAB_LABELS: Record<DeptTab, string> = {
    overview: "Overview",
    analytics: "Analytics",
    students: "Students",
    readiness: "Readiness",
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

    const [dashboardData, setDashboardData] = useState<any>(() =>
        readDashboardCache(DASHBOARD_CACHE_KEYS.dept)
    );
    const [deptProfile, setDeptProfile] = useState<DeptProfile | null>(() =>
        readDashboardCache<DeptProfile>(DASHBOARD_CACHE_KEYS.deptProfile)
    );
    const [readinessStudents, setReadinessStudents] = useState<ReadinessStudent[]>(() => {
        const cached = readDashboardCache<{ students?: ReadinessStudent[] }>(
            DASHBOARD_CACHE_KEYS.deptReadiness
        );
        return cached?.students || [];
    });
    const [amcatStats, setAmcatStats] = useState<any>(null);
    const [loadingAmcat, setLoadingAmcat] = useState(false);
    const [selectedAmcatSection, setSelectedAmcatSection] = useState<string>("all");
    // Batch & year filters for the Overview dashboard
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-indexed; academic year starts June
    // If before June, we're still in the prev academic year
    const academicYearStart = currentMonth >= 5 ? currentYear : currentYear - 1;
    const batchOptions = Array.from({ length: academicYearStart - 2022 + 1 }, (_, i) => {
        const start = 2022 + i;
        return `${start}-${String(start + 1).slice(-2)}`;
    });
    // TODO: wire selectedBatch to backend — deptApi.getDashboardStats() currently accepts no params.
    const [selectedBatch, setSelectedBatch] = useState<string>(batchOptions[batchOptions.length - 1]);
    const [headerSearch, setHeaderSearch] = useState("");
    const [studentListSearch, setStudentListSearch] = useState("");
    const [readinessSearch, setReadinessSearch] = useState("");
    const [readinessFilter, setReadinessFilter] = useState<ActionFilter>("all");
    const [loadingStats, setLoadingStats] = useState(() => !readDashboardCache(DASHBOARD_CACHE_KEYS.dept));
    const [syncingStats, setSyncingStats] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() =>
        readDashboardCache(DASHBOARD_CACHE_KEYS.dept) ? Date.now() : null
    );
    const [deptEvents, setDeptEvents] = useState<DeptEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [viewEvent, setViewEvent] = useState<DeptEvent | null>(null);
    const [deleteEventTarget, setDeleteEventTarget] = useState<DeptEvent | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
    const dashboardDataRef = useRef(dashboardData);
    dashboardDataRef.current = dashboardData;
    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);
    const [exportingReport, setExportingReport] = useState<string | null>(null);
    const [dismissedAlerts, setDismissedAlerts] = useState<boolean>(false);
    const [customizedReports, setCustomizedReports] = useState<Record<string, boolean>>({});
    const [reportFilters, setReportFilters] = useState<Record<string, { minCgpa: string; maxBacklogs: string; minReadiness: string }>>({
        placement: { minCgpa: "0", maxBacklogs: "99", minReadiness: "0" },
        readiness: { minCgpa: "0", maxBacklogs: "99", minReadiness: "0" },
        eligibility: { minCgpa: "7", maxBacklogs: "0", minReadiness: "70" },
        unplaced: { minCgpa: "0", maxBacklogs: "99", minReadiness: "0" },
        gaps: { minCgpa: "0", maxBacklogs: "99", minReadiness: "0" },
        packages: { minCgpa: "0", maxBacklogs: "99", minReadiness: "0" },
    });

    // New Event state
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [isSavingEvent, setIsSavingEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({
        id: null as number | null,
        isEditing: false,
        title: "",
        date: "",
        type: "Workshop",
        meetingLink: "",
        mode: "OFFLINE",
        targetBatch: "All",
        expiryHours: "never",
        attendees: 0
    });

    const loadDeptEvents = useCallback(async () => {
        try {
            setLoadingEvents(true);
            const events = await deptApi.getDeptEvents();
            setDeptEvents(Array.isArray(events) ? events : []);
        } catch (error) {
            console.error("Failed to fetch department events", error);
        } finally {
            setLoadingEvents(false);
        }
    }, []);

    const handleCreateEvent = async () => {
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setIsSavingEvent(true);
            const payload = {
                title: newEvent.title,
                date: newEvent.date,
                type: newEvent.type,
                meetingLink: newEvent.meetingLink,
                mode: newEvent.mode,
                targetBatch: newEvent.targetBatch,
                expiryHours: newEvent.expiryHours,
            };
            if (newEvent.isEditing && newEvent.id) {
                await deptApi.updateDeptEvent(newEvent.id, payload);
                toast.success("Event updated successfully!");
            } else {
                await deptApi.saveDeptEvent(payload);
                toast.success("Event created successfully!");
            }
            setIsEventDialogOpen(false);
            await Promise.all([loadDeptDashboard({ silent: true }), loadDeptEvents()]);
        } catch (error) {
            console.error("Failed to save event", error);
            toast.error("Failed to save event. Please try again.");
        } finally {
            setNewEvent({ id: null, isEditing: false, title: "", date: "", type: "Workshop", meetingLink: "", mode: "OFFLINE", targetBatch: "All", expiryHours: "never", attendees: 0 });
            setIsSavingEvent(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!deleteEventTarget?.id) return;
        try {
            setDeletingEventId(deleteEventTarget.id);
            await deptApi.deleteDeptEvent(deleteEventTarget.id);
            toast.success("Event deleted.");
            setDeleteEventTarget(null);
            await Promise.all([loadDeptDashboard({ silent: true }), loadDeptEvents()]);
        } catch (error: any) {
            console.error("Failed to delete event", error);
            const message = error?.response?.data?.message;
            if (error?.response?.status === 404 && !message) {
                toast.error("Delete endpoint not available. Restart the backend server and try again.");
            } else {
                toast.error(message || "Could not delete event.");
            }
        } finally {
            setDeletingEventId(null);
        }
    };

    const resetEventForm = () => {
        setNewEvent({ id: null, isEditing: false, title: "", date: "", type: "Workshop", meetingLink: "", mode: "OFFLINE", targetBatch: "All", expiryHours: "never", attendees: 0 });
    };

    const openEditEvent = (event: DeptEvent) => {
        setNewEvent({
            id: event.id,
            isEditing: true,
            title: event.title,
            date: event.date ? new Date(event.date).toISOString() : "",
            type: event.type || "Workshop",
            meetingLink: event.meeting_link || "",
            mode: event.mode || "OFFLINE",
            targetBatch: event.target_batch || "All",
            expiryHours: "never",
            attendees: 0,
        });
        setIsEventDialogOpen(true);
    };

    const formatEventDate = (value?: string | null) => {
        if (!value) return "—";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "—";
        return parsed.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handlePlacementPdf = async () => {
        try {
            setExportingPdf(true);
            const criteria = customizedReports.placement ? reportFilters.placement : undefined;
            await deptApi.downloadPlacementReportPdf(criteria);
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
            const criteria = customizedReports.readiness ? reportFilters.readiness : undefined;
            await deptApi.downloadStudentReadinessCsv(criteria);
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

    const loadDeptDashboard = useCallback(async (options?: { silent?: boolean }) => {
        const silent = options?.silent ?? false;
        const hasCachedView = !!dashboardDataRef.current;

        try {
            if (!silent && !hasCachedView) {
                setLoadingStats(true);
            } else {
                setSyncingStats(true);
            }

            const [statsRaw, profile, readiness] = await Promise.all([
                deptApi.getDashboardStats(),
                deptApi.getDeptProfile(),
                deptApi.getReadinessDesk(),
            ]);

            const stats = stripMeta((statsRaw || {}) as Record<string, unknown>);
            writeDashboardCache(DASHBOARD_CACHE_KEYS.dept, stats);
            writeDashboardCache(DASHBOARD_CACHE_KEYS.deptProfile, profile);
            writeDashboardCache(DASHBOARD_CACHE_KEYS.deptReadiness, readiness);

            setDashboardData(stats);
            setDeptProfile(profile);
            setReadinessStudents(readiness.students || []);
            setLastSyncedAt(Date.now());
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
            if (!silent && !hasCachedView) {
                toast.error("Could not load department overview. Check connection or try refreshing.");
            }
        } finally {
            setLoadingStats(false);
            setSyncingStats(false);
        }
    }, []);

    useEffect(() => {
        const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.dept);
        loadDeptDashboard({ silent: !!cached });
        loadDeptEvents();
    }, [loadDeptDashboard, loadDeptEvents]);

    const manualRefresh = useManualRefresh(async () => {
        await Promise.all([loadDeptDashboard({ silent: true }), loadDeptEvents()]);
        toast.success("Dashboard data refreshed.");
    });

    useEffect(() => {
        if (selectedView !== "analytics") return;
        const fetchAmcatStats = async () => {
            try {
                setLoadingAmcat(true);
                const data = await deptApi.getAmcatStats();
                setAmcatStats(data);
            } catch (error) {
                console.error("Failed to fetch AMCAT stats", error);
                toast.error("Could not load AMCAT statistics.");
            } finally {
                setLoadingAmcat(false);
            }
        };
        fetchAmcatStats();
    }, [selectedView]);

    const stats = dashboardData?.stats || { totalStudents: 0, placedStudents: 0, avgPackage: 0, altPathStudents: 0 };

    const activeStats = amcatStats || { totalActiveStudents: 0, sections: [] };
    const sections = activeStats.sections || [];
    const totalActive = activeStats.totalActiveStudents || 0;

    // Overall calculations for "All Sections Overview" tab consistency
    const overallDeptAvg = sections.length > 0
        ? Number((sections.reduce((acc: number, s: any) => acc + s.deptAvg, 0) / sections.length).toFixed(1))
        : 0;
    const overallCollegeAvg = sections.length > 0
        ? Number((sections.reduce((acc: number, s: any) => acc + s.collegeAvg, 0) / sections.length).toFixed(1))
        : 0;
    const overallDiff = Number((overallDeptAvg - overallCollegeAvg).toFixed(1));
    const overallIsAbove = overallDiff > 0;
    const maxParticipation = sections.length > 0
        ? Math.max(...sections.map((s: any) => s.studentCount))
        : 0;

    const currentSection = sections.find((s: any) => s.key === selectedAmcatSection);

    const currentSectionDiff = currentSection ? Number((currentSection.deptAvg - currentSection.collegeAvg).toFixed(1)) : 0;
    const currentSectionIsAbove = currentSectionDiff > 0;
    const currentSectionDist = currentSection?.distribution || { high: 0, medium: 0, low: 0, total: 0 };

    const currentSectionChartData = [
        { name: "High (≥80)", value: currentSectionDist.high, percentage: currentSectionDist.total > 0 ? Math.round((currentSectionDist.high / currentSectionDist.total) * 100) : 0, color: "#8b5cf6" },
        { name: "Medium (60-80)", value: currentSectionDist.medium, percentage: currentSectionDist.total > 0 ? Math.round((currentSectionDist.medium / currentSectionDist.total) * 100) : 0, color: "#3b82f6" },
        { name: "Low (<60)", value: currentSectionDist.low, percentage: currentSectionDist.total > 0 ? Math.round((currentSectionDist.low / currentSectionDist.total) * 100) : 0, color: "#64748b" }
    ];

    // Department specific stats (DB-driven)
    const dynamicDeptStats = [
        { label: "Dept Students", value: stats.totalStudents, trend: "up", icon: Users, color: "bg-blue-500" },
        { label: "Placed Students", value: stats.placedStudents, trend: "up", icon: Award, color: "bg-green-500" },
        { label: "Avg Package", value: `${stats.avgPackage} LPA`, trend: "up", icon: DollarSign, color: "bg-purple-500" },
        { label: "Higher Studies & Entrep.", value: stats.altPathStudents, trend: "up", icon: GraduationCap, color: "bg-amber-500" },
    ];

    // Comparisons: Dept vs College Average
    const comparisonData = dashboardData?.comparisonData || [];

    const yearTrend = dashboardData?.yearTrend || [];

    const skillsRadarData = dashboardData?.skillsRadarData || [];

    const placementDistribution = dashboardData?.placementDistribution || [];

    const atRiskStudents: AtRiskStudent[] = dashboardData?.atRiskStudents || [];
    const topPerformers = dashboardData?.topPerformers || [];
    const upcomingEvents: DeptEvent[] = deptEvents;

    const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];
    const deptCode = deptProfile?.department_code || "Dept";
    const headName = deptProfile?.name || "Dept Head";
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
            icon: CalendarIcon,
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

    const openReadiness = (filter: ActionFilter, search = "") => {
        setReadinessFilter(filter);
        setReadinessSearch(search);
        setSelectedView("readiness");
    };

    const openStudentSearch = (search: string) => {
        setStudentListSearch(search);
        setSelectedView("students");
    };

    return (
        <div className={`min-h-dvh ${isDark ? "bg-[#0c0c14]" : "bg-background"} transition-colors duration-300`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 ${isDark ? "bg-[#0c0c14]/80 border-white/10 shadow-md" : "bg-background/80 border-border/40 shadow-sm"} backdrop-blur-xl border-b`}>
                <div className="container flex min-h-16 min-w-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div className="flex min-w-0 flex-shrink-0 cursor-pointer items-center gap-0 group" onClick={() => navigate("/")}>
                        <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-10 w-10 flex-shrink-0 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12" />
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text font-black text-lg leading-none text-transparent sm:text-xl">NextGen</span>
                            <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-80 sm:text-[10px]">Dept Head Portal</p>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 md:gap-4">

                        <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-none sm:justify-end sm:gap-2 md:gap-4">
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

                            <div className="hidden h-6 w-px bg-border sm:block" />

                            <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 touch-manipulation text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-950/30 transition-all font-bold"
                                onClick={() => void performClientLogout(navigate)}
                            >
                                <LogOut className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Sign Out</span>
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
                className={`container ${selectedView === "readiness" ? "py-4 md:py-6" : "py-4 md:py-6"} px-4 sm:px-6 max-w-[1400px] mx-auto`}
            >
                {loadingStats ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-700">
                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border shadow-2xl`}>
                            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse" />
                            <Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'} relative z-10`} />
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Synchronizing Dept Data</h3>
                            <p className={`text-xs sm:text-sm font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'} opacity-80`}>Fetching real-time analytics...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 space-y-3">
                            {/* Title + Refresh row */}
                            <div className="flex items-center justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight tracking-tight">
                                    {selectedView === "overview" && "TPO Dept Overview"}
                                    {selectedView === "analytics" && "Dept Analytics"}
                                    {selectedView === "students" && "Dept Students"}
                                    {selectedView === "readiness" && "Placement Readiness Analysis"}
                                    {selectedView === "reports" && "Dept Reports"}
                                </h1>
                                {selectedView === "overview" && (
                                    <div className="flex items-center gap-3">
                                        {/* Batch year filter — TODO: wire to backend once /dept/dashboard/stats accepts a `batch` param. */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline">Batch Year</span>
                                            <UISelect value={selectedBatch} onValueChange={setSelectedBatch}>
                                                <UISelectTrigger className="h-8 w-36 text-xs font-bold border-border/60 bg-muted/40 hover:bg-muted focus:ring-1 focus:ring-primary/50">
                                                    <UISelectValue />
                                                </UISelectTrigger>
                                                <UISelectContent>
                                                    {batchOptions.map((batch) => (
                                                        <UISelectItem key={batch} value={batch} className="text-xs font-bold">
                                                            {batch}
                                                            {batch === batchOptions[batchOptions.length - 1] && (
                                                                <span className="ml-1.5 text-[9px] font-black text-primary/70">CURRENT</span>
                                                            )}
                                                        </UISelectItem>
                                                    ))}
                                                </UISelectContent>
                                            </UISelect>
                                        </div>
                                        <DashboardSyncBar
                                            lastSyncedAt={lastSyncedAt}
                                            isSyncing={manualRefresh.isRefreshing}
                                            canRefresh={manualRefresh.canRefresh}
                                            refreshLabel={manualRefresh.label}
                                            onRefresh={() => void manualRefresh.refresh()}
                                            showText={false}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className={selectedView === "overview" ? "block" : "hidden"}>
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10">
                                    {dynamicDeptStats.map((stat, idx) => {
                                        const Icon = stat.icon;
                                        const shadowColor = stat.color === 'bg-blue-500' ? 'shadow-blue-500/20' : stat.color === 'bg-green-500' ? 'shadow-green-500/20' : stat.color === 'bg-purple-500' ? 'shadow-purple-500/20' : 'shadow-amber-500/20';
                                        return (
                                            <Card key={idx} className="relative overflow-hidden shadow-md dark:shadow-lg border-border/45 dark:border-border/30 hover:shadow-xl hover:border-blue-500/30 transition-all hover:scale-[1.01] cursor-pointer bg-background/60 dark:bg-card/60 backdrop-blur-sm">
                                                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] dark:opacity-[0.08] rounded-bl-full`}></div>
                                                <CardContent className="p-4 sm:p-5 relative z-10 flex flex-col justify-between h-full">
                                                    {/* Badge — absolute top-right, no trend icon */}
                                                    <div className={`absolute top-4 right-4 flex items-center px-2 py-1 rounded-md text-[10px] font-bold z-20 ${
                                                        stat.color === 'bg-amber-500' ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                                                        "bg-primary/10 text-primary"
                                                    }`}>
                                                        {stat.color === 'bg-amber-500' ? "Alt. Path" : "Total"}
                                                    </div>

                                                    {/* Icon */}
                                                    <div className="mb-4">
                                                        <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center shadow-md ${shadowColor}`}>
                                                            <Icon className="w-5 h-5 text-white" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-auto">
                                                        {/* Label (Big) */}
                                                        <p className="text-base font-bold text-muted-foreground mb-1 truncate">{stat.label}</p>
                                                        {/* Value */}
                                                        <p className="text-4xl sm:text-5xl font-black text-foreground leading-none">{stat.value}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6 mb-8">

                                    <Card className="shadow-lg border border-border/30 bg-card/60 backdrop-blur-sm">
                                        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-lg font-black text-foreground">Upcoming Dept Events</CardTitle>
                                            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" onClick={() => { resetEventForm(); setIsEventDialogOpen(true); }} className="gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-xs h-8">
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Add Event
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-2xl border-border/80 bg-background/95 backdrop-blur-xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-black">{newEvent.isEditing ? "Edit Dept Event" : "Create Dept Event"}</DialogTitle>
                                                        <DialogDescription className="font-medium text-muted-foreground">
                                                            {newEvent.isEditing ? "Update the details for this department event." : "Add an event for your department students. This will be visible on their dashboards."}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid sm:grid-cols-2 gap-6 py-4">
                                                        <div className="grid gap-2 sm:col-span-2">
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
                                                            <div className="grid gap-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="targetBatch" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Target Batch</Label>
                                                            <UISelect
                                                                value={newEvent.targetBatch}
                                                                onValueChange={(v) => setNewEvent({ ...newEvent, targetBatch: v })}
                                                            >
                                                                <UISelectTrigger className="h-[52px] rounded-xl border-border/60 bg-muted/20 font-semibold transition-all focus:ring-2 focus:ring-primary/40">
                                                                    <UISelectValue placeholder="Select batch" />
                                                                </UISelectTrigger>
                                                                <UISelectContent className="border-border/80 bg-background/95 backdrop-blur-xl">
                                                                    <UISelectItem value="All">All Students</UISelectItem>
                                                                    <UISelectItem value="FE">First Year (FE)</UISelectItem>
                                                                    <UISelectItem value="SE">Second Year (SE)</UISelectItem>
                                                                    <UISelectItem value="TE">Third Year (TE)</UISelectItem>
                                                                    <UISelectItem value="BE">Final Year (BE)</UISelectItem>
                                                                </UISelectContent>
                                                            </UISelect>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="expiryHours" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Event Expiry</Label>
                                                            <UISelect
                                                                value={newEvent.expiryHours}
                                                                onValueChange={(v) => setNewEvent({ ...newEvent, expiryHours: v })}
                                                            >
                                                                <UISelectTrigger className="h-[52px] rounded-xl border-border/60 bg-muted/20 font-semibold transition-all focus:ring-2 focus:ring-primary/40">
                                                                    <UISelectValue placeholder="Select expiry time" />
                                                                </UISelectTrigger>
                                                                <UISelectContent className="border-border/80 bg-background/95 backdrop-blur-xl">
                                                                    <UISelectItem value="never">Never Expires</UISelectItem>
                                                                    <UISelectItem value="12">12 Hours</UISelectItem>
                                                                    <UISelectItem value="24">24 Hours</UISelectItem>
                                                                    <UISelectItem value="72">3 Days</UISelectItem>
                                                                    <UISelectItem value="168">1 Week</UISelectItem>
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
                                                            ) : (newEvent.isEditing ? "Save Changes" : "Create Event")}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </CardHeader>
                                        <CardContent className="pt-2 flex-1 flex flex-col">
                                            <div className="space-y-3 flex-1">
                                                {loadingEvents ? (
                                                    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Loading events…
                                                    </div>
                                                ) : upcomingEvents.length === 0 ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center group gap-2 min-h-[140px]">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                            <CalendarIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-foreground">No upcoming events</h4>
                                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                                Add a department workshop, guest lecture, or seminar.
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : upcomingEvents.map((event) => (
                                                    <div key={event.id} className="flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5 hover:bg-muted/50 transition-colors group">
                                                        <div className="min-w-0">
                                                            <h4 className="text-sm font-bold text-foreground">{event.title}</h4>
                                                            <p className="text-xs text-muted-foreground">{formatEventDate(event.date)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2.5 gap-1 text-muted-foreground hover:text-foreground"
                                                                onClick={() => setViewEvent(event)}
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">View</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2.5 gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                                onClick={() => openEditEvent(event)}
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Edit</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2.5 gap-1 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                                                                onClick={() => setDeleteEventTarget(event)}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Delete</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <div className="p-4 pt-0">
                                            <Button variant="outline" className="w-full font-bold text-xs h-9 bg-muted/30 border-border/50 hover:bg-muted/50">
                                                View All Events
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </>
                        </div>

                        <div className={selectedView === "analytics" ? "block" : "hidden"}>
                            <>
                                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                                    <Card className="relative overflow-hidden border border-border/80 bg-gradient-to-b from-card via-card/95 to-muted/20 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                                        <div
                                            className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-100"
                                            style={{
                                                background:
                                                    "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.12), transparent 60%)",
                                            }}
                                        />
                                        <CardHeader className="relative space-y-1 pb-2">
                                            <CardTitle className="text-lg font-bold tracking-tight text-foreground">Dept vs College Statistics</CardTitle>
                                            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                                                Comparing departmental placement metrics against overall college averages.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative pt-4">
                                            <ResponsiveContainer width="100%" height={360}>
                                                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                        </linearGradient>
                                                        <linearGradient id="colorCollege" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.6} />
                                                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1} />
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
                                        <CardHeader className="relative space-y-1 pb-2">
                                            <CardTitle className="text-lg font-bold tracking-tight text-foreground">Skills Assessment</CardTitle>
                                            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                                                Department vs college average scores from performance metrics (0–100).
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative pt-4">
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
                                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                                </radialGradient>
                                                                <radialGradient id="colorCollegeRadar" cx="50%" cy="50%" r="50%">
                                                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                                                                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
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

                                {/* AMCAT Section-wise Performance Card */}
                                <Card className="relative overflow-hidden border border-border/80 bg-gradient-to-b from-card via-card/95 to-muted/20 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl duration-300 mt-8 mb-12">
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-[0.65] dark:opacity-100"
                                        style={{
                                            background:
                                                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.12), transparent 60%)",
                                        }}
                                    />
                                    <CardHeader className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-indigo-500" />
                                                AMCAT Section-wise Analytics
                                            </CardTitle>
                                            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                                                Detailed average scores, student participation, and score distributions by section.
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <UISelect
                                                value={selectedAmcatSection}
                                                onValueChange={setSelectedAmcatSection}
                                            >
                                                <UISelectTrigger className="w-[180px] h-9 rounded-xl border-border bg-muted/40 font-semibold transition-all focus:ring-2 focus:ring-primary/40">
                                                    <UISelectValue placeholder="Select Section" />
                                                </UISelectTrigger>
                                                <UISelectContent className="border-border bg-background/95 backdrop-blur-xl">
                                                    <UISelectItem value="all">All Sections</UISelectItem>
                                                    {amcatStats?.sections?.map((s: any) => (
                                                        <UISelectItem key={s.key} value={s.key}>{s.label}</UISelectItem>
                                                    ))}
                                                </UISelectContent>
                                            </UISelect>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="relative pt-6">
                                        {loadingAmcat ? (
                                            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading section statistics...</p>
                                            </div>
                                        ) : !amcatStats ? (
                                            <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/15 px-6 py-10 text-center">
                                                <p className="text-sm font-semibold text-foreground">No AMCAT performance data available</p>
                                                <p className="max-w-sm text-xs text-muted-foreground">
                                                    Upload student reports or input performance scores to generate analytics.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                                                {/* Left Column: Sections List */}
                                                <div className="xl:col-span-1 space-y-3">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Sections Overview</p>
                                                    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {/* All Sections item */}
                                                        <button
                                                            onClick={() => setSelectedAmcatSection("all")}
                                                            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${selectedAmcatSection === "all"
                                                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                                                                    : "border-border/40 hover:border-border hover:bg-muted/30"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-sm text-foreground">All Sections Overview</span>
                                                                {sections.length > 0 ? (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[11px] font-black text-foreground">{overallDeptAvg}</span>
                                                                        <span className="text-[10px] text-muted-foreground">vs {overallCollegeAvg}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Comparative</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between text-[11px]">
                                                                <span className="text-muted-foreground font-medium">
                                                                    Participation: {maxParticipation} / {totalActive} students ({totalActive > 0 ? Math.round((maxParticipation / totalActive) * 100) : 0}%)
                                                                </span>
                                                                {overallDiff !== 0 && (
                                                                    <span className={`font-bold flex items-center gap-0.5 ${overallIsAbove ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                        {overallIsAbove ? '↑' : '↓'} {Math.abs(overallDiff)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>

                                                        {amcatStats.sections.map((s: any) => {
                                                            const isActive = selectedAmcatSection === s.key;
                                                            const diff = Number((s.deptAvg - s.collegeAvg).toFixed(1));
                                                            const isAbove = diff > 0;

                                                            return (
                                                                <button
                                                                    key={s.key}
                                                                    onClick={() => setSelectedAmcatSection(s.key)}
                                                                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${isActive
                                                                            ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5"
                                                                            : "border-border/40 hover:border-border hover:bg-muted/30"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-bold text-sm text-foreground">{s.label}</span>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[11px] font-black text-foreground">{s.deptAvg}</span>
                                                                            <span className="text-[10px] text-muted-foreground">vs {s.collegeAvg}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-[11px]">
                                                                        <span className="text-muted-foreground font-medium">
                                                                            Participation: {s.studentCount} / {amcatStats.totalActiveStudents} students ({amcatStats.totalActiveStudents > 0 ? Math.round((s.studentCount / amcatStats.totalActiveStudents) * 100) : 0}%)
                                                                        </span>
                                                                        {diff !== 0 && (
                                                                            <span className={`font-bold flex items-center gap-0.5 ${isAbove ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                                {isAbove ? '↑' : '↓'} {Math.abs(diff)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Right Column: Comparative Graph or Selected Section Details */}
                                                <div className="xl:col-span-2 rounded-2xl border border-border/40 bg-muted/15 p-5 min-h-[360px] flex flex-col justify-between">
                                                    {selectedAmcatSection === "all" ? (
                                                        // Comparative view of all sections
                                                        <div className="flex-1 flex flex-col justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <h3 className="text-sm font-bold text-foreground font-black">Section-wise Averages</h3>
                                                                <p className="text-xs text-muted-foreground font-medium">Comparing your department average score against the overall college average for each performance area.</p>
                                                            </div>
                                                            <div className="flex-1 min-h-[280px] w-full mt-4">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <BarChart
                                                                        data={amcatStats.sections.map((s: any) => ({
                                                                            name: s.label.replace("AMCAT ", ""),
                                                                            dept: s.deptAvg,
                                                                            collegeAvg: s.collegeAvg
                                                                        }))}
                                                                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                                                                    >
                                                                        <defs>
                                                                            <linearGradient id="colorAmcatDept" x1="0" y1="0" x2="0" y2="1">
                                                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.85} />
                                                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                                                                            </linearGradient>
                                                                            <linearGradient id="colorAmcatCollege" x1="0" y1="0" x2="0" y2="1">
                                                                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.6} />
                                                                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                                                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                                                                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                                        <Tooltip
                                                                            cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                                                                            contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', opacity: 0.95 }}
                                                                        />
                                                                        <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                                                                        <Bar dataKey="dept" fill="url(#colorAmcatDept)" name="Dept Average" radius={[4, 4, 0, 0]} barSize={24} />
                                                                        <Bar dataKey="collegeAvg" fill="url(#colorAmcatCollege)" name="College Average" radius={[4, 4, 0, 0]} barSize={24} />
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // Detailed Section View
                                                        <div className="flex-1 flex flex-col justify-between h-full gap-5">

                                                            {/* Section Details Header */}
                                                            <div>
                                                                <h3 className="text-sm font-bold text-foreground font-black">
                                                                    {currentSection?.label} Details
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground font-medium">Detailed score distributions and college comparison benchmarks.</p>
                                                            </div>

                                                            {/* KPI Cards row */}
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div className="p-3 rounded-xl border border-border/40 bg-card/40">
                                                                    <span className="block text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Dept Average</span>
                                                                    <span className="block text-xl font-black text-foreground mt-1 tabular-nums">{currentSection?.deptAvg}<span className="text-[11px] font-normal text-muted-foreground">/100</span></span>
                                                                </div>
                                                                <div className="p-3 rounded-xl border border-border/40 bg-card/40 relative">
                                                                    <span className="block text-[9px] uppercase tracking-wider font-bold text-muted-foreground">College Average</span>
                                                                    <span className="block text-xl font-black text-foreground mt-1 tabular-nums">{currentSection?.collegeAvg}<span className="text-[11px] font-normal text-muted-foreground">/100</span></span>
                                                                </div>
                                                                <div className="p-3 rounded-xl border border-border/40 bg-card/40">
                                                                    <span className="block text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Participation</span>
                                                                    <span className="block text-xl font-black text-foreground mt-1 tabular-nums">
                                                                        {currentSection?.studentCount}
                                                                        <span className="text-xs font-bold text-muted-foreground ml-1">
                                                                            ({totalActive > 0 ? Math.round((currentSection?.studentCount / totalActive) * 100) : 0}%)
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Comparison Badge */}
                                                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/30 text-[11px]">
                                                                {currentSectionDiff === 0 ? (
                                                                    <span className="text-muted-foreground font-bold">Department performance matches the college average.</span>
                                                                ) : currentSectionIsAbove ? (
                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                                        Above college average by {currentSectionDiff} points.
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                                                                        <ArrowDownRight className="w-3.5 h-3.5" />
                                                                        Below college average by {Math.abs(currentSectionDiff)} points.
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Visual Comparison Chart */}
                                                            <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 flex flex-col gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Average Score Comparison</span>
                                                                <div className="h-[75px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart
                                                                            layout="vertical"
                                                                            data={[
                                                                                { name: "Dept Avg", value: currentSection?.deptAvg },
                                                                                { name: "College Avg", value: currentSection?.collegeAvg }
                                                                            ]}
                                                                            margin={{ top: 0, right: 10, left: -5, bottom: 0 }}
                                                                        >
                                                                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                                                                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "var(--foreground)", fontWeight: 700 }} width={80} axisLine={false} tickLine={false} />
                                                                            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={12}>
                                                                                <Cell fill="#6366f1" />
                                                                                <Cell fill="#94a3b8" />
                                                                            </Bar>
                                                                        </BarChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </div>

                                                            {/* Score Distribution Chart */}
                                                            <div className="flex-1 flex flex-col justify-end mt-2 gap-3">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Department Score Distribution</span>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                                                    {/* Bar chart representing bands */}
                                                                    <div className="h-[140px] w-full">
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                            <BarChart
                                                                                layout="vertical"
                                                                                data={currentSectionChartData}
                                                                                margin={{ top: 0, right: 10, left: -5, bottom: 0 }}
                                                                            >
                                                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                                                                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                                                                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "var(--foreground)", fontWeight: 700 }} width={85} axisLine={false} tickLine={false} />
                                                                                <Tooltip
                                                                                    content={({ active, payload }) => {
                                                                                        if (active && payload && payload.length) {
                                                                                            const data = payload[0].payload;
                                                                                            return (
                                                                                                <div className="rounded-lg border border-border/80 bg-background px-3 py-2 text-xs shadow-md">
                                                                                                    <p className="font-bold">{data.name}</p>
                                                                                                    <p className="text-muted-foreground mt-0.5">
                                                                                                        Count: <span className="text-foreground font-semibold">{data.value} students</span>
                                                                                                    </p>
                                                                                                    <p className="text-muted-foreground">
                                                                                                        Percentage: <span className="text-foreground font-semibold">{data.percentage}%</span>
                                                                                                    </p>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    }}
                                                                                />
                                                                                <Bar dataKey="percentage" radius={[4, 4, 4, 4]} barSize={16}>
                                                                                    {currentSectionChartData.map((entry, index) => (
                                                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                                                    ))}
                                                                                </Bar>
                                                                            </BarChart>
                                                                        </ResponsiveContainer>
                                                                    </div>

                                                                    {/* Custom formatted Legend showing raw counts and percentages */}
                                                                    <div className="space-y-2">
                                                                        {currentSectionChartData.map((d) => (
                                                                            <div key={d.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-card/20 border border-border/20">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                                                                    <span className="font-semibold text-foreground">{d.name}</span>
                                                                                </div>
                                                                                <span className="text-muted-foreground">
                                                                                    <span className="text-foreground font-bold">{d.percentage}%</span> ({d.value} {d.value === 1 ? 'student' : 'students'})
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        </div>

                        <div className={selectedView === "students" ? "block" : "hidden"}>
                            <StudentManagement isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} externalSearch={studentListSearch} />
                        </div>

                        <div className={selectedView === "readiness" ? "block" : "hidden"}>
                            <div className="pt-2">
                                <ReadinessHub externalSearch={readinessSearch} initialFilter={readinessFilter} />
                            </div>
                        </div>

                        <div className={selectedView === "reports" ? "block" : "hidden"}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                                {/* 1. Placement Report Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <FileBarChart className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Dept Placement Report</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    Summary stats plus every selected offer (roll, email, role, package).
                                                </p>
                                            </div>
                                            {customizedReports.placement && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.placement?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                placement: { ...reportFilters.placement, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.placement?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                placement: { ...reportFilters.placement, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.placement?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                placement: { ...reportFilters.placement, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingPdf}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handlePlacementPdf();
                                                }}
                                            >
                                                {exportingPdf ? (
                                                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating…</>
                                                ) : (
                                                    <><Download className="h-3.5 w-3.5" />Generate PDF</>
                                                )}
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-placement" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-placement"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.placement || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, placement: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. Student Readiness Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <Users className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Student Readiness</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    All students with CGPA, skills, resume flags, and a readiness score.
                                                </p>
                                            </div>
                                            {customizedReports.readiness && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.readiness?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                readiness: { ...reportFilters.readiness, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.readiness?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                readiness: { ...reportFilters.readiness, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.readiness?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                readiness: { ...reportFilters.readiness, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingCsv}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleReadinessCsv();
                                                }}
                                            >
                                                {exportingCsv ? (
                                                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Exporting…</>
                                                ) : (
                                                    <><FileSpreadsheet className="h-3.5 w-3.5" />Export CSV</>
                                                )}
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-readiness" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-readiness"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.readiness || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, readiness: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 3. Eligibility List Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <Target className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Eligibility List</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    Export unplaced students matching company criteria.
                                                </p>
                                            </div>
                                            {customizedReports.eligibility && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.eligibility?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                eligibility: { ...reportFilters.eligibility, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.eligibility?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                eligibility: { ...reportFilters.eligibility, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.eligibility?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                eligibility: { ...reportFilters.eligibility, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingReport === "eligibility"}
                                                onClick={() => handleReportExport("eligibility", () => deptApi.downloadEligibilityCsv(reportFilters.eligibility))}
                                            >
                                                {exportingReport === "eligibility" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                                                Export Eligible CSV
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-eligibility" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-eligibility"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.eligibility || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, eligibility: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 4. Unplaced Students Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <TrendingDownIcon className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Unplaced Students</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    Follow-up list with readiness score and blocker reasons.
                                                </p>
                                            </div>
                                            {customizedReports.unplaced && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.unplaced?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                unplaced: { ...reportFilters.unplaced, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.unplaced?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                unplaced: { ...reportFilters.unplaced, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.unplaced?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                unplaced: { ...reportFilters.unplaced, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingReport === "unplaced"}
                                                onClick={() => handleReportExport("unplaced", () => deptApi.downloadUnplacedStudentsCsv(customizedReports.unplaced ? reportFilters.unplaced : undefined))}
                                            >
                                                {exportingReport === "unplaced" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                                                Export CSV
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-unplaced" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-unplaced"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.unplaced || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, unplaced: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 5. Missing Profile Data Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <FileText className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Missing Profile Data</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    Students missing resume, profile links, or enough skills.
                                                </p>
                                            </div>
                                            {customizedReports.gaps && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.gaps?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                gaps: { ...reportFilters.gaps, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.gaps?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                gaps: { ...reportFilters.gaps, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.gaps?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                gaps: { ...reportFilters.gaps, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingReport === "profile"}
                                                onClick={() => handleReportExport("profile", () => deptApi.downloadProfileGapsCsv(customizedReports.gaps ? reportFilters.gaps : undefined))}
                                            >
                                                {exportingReport === "profile" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                                                Export CSV
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-gaps" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-gaps"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.gaps || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, gaps: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 6. Placed Package Report Card */}
                                <Card className="group relative flex flex-col overflow-hidden border border-border/40 bg-gradient-to-b from-card to-card/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                                    <CardContent className="flex flex-col items-center justify-start gap-4 p-6 sm:p-8 text-center h-full min-h-[260px]">
                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10 mb-2">
                                                <DollarSign className="h-5.5 w-5.5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-black text-foreground tracking-tight">Placed Package Report</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground/90 font-medium px-2">
                                                    Selected offers with company, drive, role, and package.
                                                </p>
                                            </div>
                                            {customizedReports.packages && (
                                                <div className="grid w-full grid-cols-3 gap-1.5 text-left mt-1 py-1 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            value={reportFilters.packages?.minCgpa || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                packages: { ...reportFilters.packages, minCgpa: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Backlogs</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={reportFilters.packages?.maxBacklogs || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                packages: { ...reportFilters.packages, maxBacklogs: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Ready %</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={reportFilters.packages?.minReadiness || ""}
                                                            onChange={(e) => setReportFilters({
                                                                ...reportFilters,
                                                                packages: { ...reportFilters.packages, minReadiness: e.target.value }
                                                            })}
                                                            className="h-8 rounded-lg border-border/50 bg-muted/40 text-xs font-semibold"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-3 mt-auto pt-4">
                                            <Button
                                                className="w-full gap-1.5 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 text-xs h-9"
                                                disabled={exportingReport === "packages"}
                                                onClick={() => handleReportExport("packages", () => deptApi.downloadPlacedPackagesCsv(customizedReports.packages ? reportFilters.packages : undefined))}
                                            >
                                                {exportingReport === "packages" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                                                Export CSV
                                            </Button>
                                            <div className="flex items-center justify-between w-full border-t border-border/10 pt-2 mt-1">
                                                <label htmlFor="customize-packages" className="text-[10px] font-bold text-muted-foreground cursor-pointer flex items-center gap-1 select-none">
                                                    <Filter className="h-3 w-3" />
                                                    Customized
                                                </label>
                                                <input
                                                    id="customize-packages"
                                                    type="checkbox"
                                                    className="rounded border-border bg-muted/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-blue-600"
                                                    checked={customizedReports.packages || false}
                                                    onChange={(e) => setCustomizedReports(prev => ({ ...prev, packages: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <Dialog open={!!viewEvent} onOpenChange={(open) => !open && setViewEvent(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">{viewEvent?.title}</DialogTitle>
                        <DialogDescription>Department event details</DialogDescription>
                    </DialogHeader>
                    {viewEvent && (
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">Date & time</span>
                                <span className="font-semibold text-right">{formatEventDate(viewEvent.date)}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-semibold">{viewEvent.type}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">Target batch</span>
                                <span className="font-semibold">{viewEvent.target_batch || "All"}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">Mode</span>
                                <span className="font-semibold">{viewEvent.mode || "OFFLINE"}</span>
                            </div>
                            {viewEvent.meeting_link && (
                                <div className="flex flex-col gap-1 pt-1">
                                    <span className="text-muted-foreground">Meeting link</span>
                                    <a href={viewEvent.meeting_link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary break-all hover:underline">
                                        {viewEvent.meeting_link}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteEventTarget} onOpenChange={(open) => !open && setDeleteEventTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                        <AlertDialogDescription>
                            &ldquo;{deleteEventTarget?.title}&rdquo; will be removed permanently. Students will no longer see it on their dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingEventId != null}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingEventId != null}
                            onClick={(e) => {
                                e.preventDefault();
                                void handleDeleteEvent();
                            }}
                        >
                            {deletingEventId != null ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { LogOut, Settings, Users, TrendingUp, AlertTriangle, Download, Filter, Search, Bell, ChevronRight, Award, Target, BookOpen, Briefcase, Calendar, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Upload, FileText, GraduationCap, Building2, BarChart3, Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Clock, DollarSign, Users2, Plus, Edit, Trash2, MoreVertical, CheckCircle2, XCircle, RefreshCw, FileSpreadsheet, FileBarChart, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap, TrendingDown as TrendingDownIcon, Rocket, Shield, Globe, Star, MessageSquare, ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Filter as FilterIcon, X, Sparkles, LayoutDashboard } from "lucide-react";
import { deptApi } from "@/services/deptApi";
import { TPOApi } from "@/services/TPOApi";
import { performClientLogout } from "@/lib/logout";
import { TPO_TABS, TPO_TAB_ITEMS, TPO_TAB_HEADINGS, initialTPOTabFromUrl, type TPOTab } from "@/pages/tpo/dashboard/constants";
import { TPOPlacementsTab } from "@/features/tpo/placements/PlacementsTab";
import { TPOStudentsTab } from "@/features/tpo/students/StudentsTab";
import { useUnreadNotificationCount } from "@/features/notifications/queries";
import {
  readTPODashboardCache,
  writeTPODashboardCache,
} from "@/lib/TPODashboardCache";
import { useManualRefresh } from "@/hooks/useManualRefresh";
import { DashboardSyncBar, TabNav } from "@/components/layouts";
import { queryClient, queryKeys } from "@/lib/queryClient";

export default function TPODashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();
  const [selectedView, setSelectedView] = useState<TPOTab>(() => initialTPOTabFromUrl());
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [timeRange, setTimeRange] = useState("year");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(() => readTPODashboardCache());
  const [dashboardLoading, setDashboardLoading] = useState(() => !readTPODashboardCache());
  const [dashboardSyncing, setDashboardSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const dashboardDataRef = useRef(dashboardData);
  dashboardDataRef.current = dashboardData;
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCount();

  const loadDashboardAnalytics = useCallback(async (options?: { silent?: boolean; refresh?: boolean }) => {
    const silent = options?.silent ?? false;
    const refresh = options?.refresh ?? false;
    const hasCachedView = !!dashboardDataRef.current;

    try {
      if (!silent && !hasCachedView) {
        setDashboardLoading(true);
      } else {
        setDashboardSyncing(true);
      }

      const raw = await TPOApi.getDashboardAnalytics(refresh ? { refresh: true } : undefined);
      const { _meta, ...payload } = raw || {};
      writeTPODashboardCache(payload);
      setDashboardData(payload);
      setLastSyncedAt(Date.now());
    } catch (e) {
      console.error("getDashboardAnalytics failed", e);
      if (!silent && !hasCachedView) {
        toast.error("Failed to load dashboard analytics.");
      }
    } finally {
      setDashboardLoading(false);
      setDashboardSyncing(false);
    }
  }, []);

  const [placementSearch, setPlacementSearch] = useState("");

  // Uploads (TPO Head)
  const [uploadDataOpen, setUploadDataOpen] = useState(false);
  const [uploadingStudents, setUploadingStudents] = useState(false);
  const [uploadingCompanyStats, setUploadingCompanyStats] = useState(false);
  const studentsFileRef = useRef<HTMLInputElement>(null);
  const companyStatsFileRef = useRef<HTMLInputElement>(null);
  const [webinarRecOpen, setWebinarRecOpen] = useState(false);
  const [webinarRecLoading, setWebinarRecLoading] = useState(false);
  const [webinarRecData, setWebinarRecData] = useState<any>(null);

  // New State for Events and Announcements
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [viewAllEventsOpen, setViewAllEventsOpen] = useState(false);
  const [viewAllAnnouncementsOpen, setViewAllAnnouncementsOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allAnnouncements, setAllAnnouncements] = useState<any[]>([]);
  const [loadingAllData, setLoadingAllData] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: "", date: "", link: "", type: "Webinar" });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "", expires_at: "" });

  const [eventsSlide, setEventsSlide] = useState(0);
  const [announcementsSlide, setAnnouncementsSlide] = useState(0);

  const [searchEventsQuery, setSearchEventsQuery] = useState("");
  const [searchAnnouncementsQuery, setSearchAnnouncementsQuery] = useState("");
  const [eventsPage, setEventsPage] = useState(1);
  const [announcementsPage, setAnnouncementsPage] = useState(1);
  const PAGE_SIZE = 10;

  const [editAnnouncementDialogOpen, setEditAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [viewAnnouncementDialogOpen, setViewAnnouncementDialogOpen] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<any>(null);

  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [viewEventDialogOpen, setViewEventDialogOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<any>(null);

  const handleOpenViewAllEvents = async () => {
    setViewAllEventsOpen(true);
    setLoadingAllData(true);
    try {
      const data = await TPOApi.getWebinars();
      setAllEvents(data.webinars || []);
    } catch (e) {
      toast.error("Failed to load events");
    } finally {
      setLoadingAllData(false);
    }
  };

  const handleOpenViewAllAnnouncements = async () => {
    setViewAllAnnouncementsOpen(true);
    setLoadingAllData(true);
    try {
      const data = await TPOApi.getAnnouncements();
      setAllAnnouncements(data || []);
    } catch (e) {
      toast.error("Failed to load announcements");
    } finally {
      setLoadingAllData(false);
    }
  };

  const handleScheduleEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) {
      toast.error("Title and Date are required");
      return;
    }
    try {
      await TPOApi.createWebinar({
        title: newEvent.title,
        summary: `Scheduled ${newEvent.type} event.`,
        speaker_name: 'TBA',
        starts_at: newEvent.date,
        meeting_link: newEvent.link,
        session_mode: newEvent.link ? 'VIRTUAL' : 'IN_PERSON'
      });
      toast.success("Event scheduled successfully");
      setEventDialogOpen(false);
      setNewEvent({ title: "", date: "", link: "", type: "Webinar" });
      loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to schedule event");
    }
  };

  const formatDatetimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      const offset = d.getTimezoneOffset() * 60000;
      return (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent?.title.trim() || !editingEvent?.starts_at) {
      toast.error("Title and Date are required");
      return;
    }
    try {
      await TPOApi.updateWebinar(editingEvent.id, {
        title: editingEvent.title,
        starts_at: editingEvent.starts_at,
        meeting_link: editingEvent.meeting_link || '',
        session_mode: editingEvent.meeting_link ? 'VIRTUAL' : 'IN_PERSON',
        status: editingEvent.status || 'PUBLISHED',
        summary: editingEvent.summary || `Scheduled ${editingEvent.type || 'Webinar'} event.`,
        speaker_name: editingEvent.speaker_name || 'TBA'
      });
      toast.success("Event updated successfully");
      setEditEventDialogOpen(false);
      setEditingEvent(null);
      await loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (event: any) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      if (event.source_table === 'dept_event') {
        await TPOApi.deleteDeptEvent(event.id);
      } else {
        await TPOApi.deleteWebinar(event.id);
      }
      toast.success("Event deleted successfully");
      await loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to delete event");
    }
  };

  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      toast.error("Title and Message are required");
      return;
    }
    try {
      await TPOApi.createAnnouncement(newAnnouncement);
      toast.success("Announcement posted successfully");
      setAnnouncementDialogOpen(false);
      setNewAnnouncement({ title: "", message: "", expires_at: "" });
      // Optionally reload dashboard or list
      await loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to post announcement");
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement?.title.trim() || !editingAnnouncement?.message.trim()) {
      toast.error("Title and Message are required");
      return;
    }
    try {
      await TPOApi.updateAnnouncement(editingAnnouncement.id, editingAnnouncement);
      toast.success("Announcement updated successfully");
      setEditAnnouncementDialogOpen(false);
      setAllAnnouncements((prev: any[]) => prev.map((a: any) => a.id === editingAnnouncement.id ? editingAnnouncement : a));
      setEditingAnnouncement(null);
      await loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await TPOApi.deleteAnnouncement(id);
      toast.success("Announcement deleted successfully");
      setAllAnnouncements((prev: any[]) => prev.filter((a: any) => a.id !== id));
      await loadDashboardAnalytics({ refresh: true });
    } catch (e) {
      toast.error("Failed to delete announcement");
    }
  };

  const onUploadStudentsExcel = async (file?: File) => {
    if (!file) return;
    try {
      setUploadingStudents(true);
      await deptApi.uploadStudentsExcel(file);
      toast.success("Students data uploaded.");
      queryClient.invalidateQueries({ queryKey: ["TPO", "students"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.TPO.analytics() });
    } catch (e) {
      console.error("uploadStudentsExcel failed", e);
      toast.error("Failed to upload students data.");
    } finally {
      setUploadingStudents(false);
    }
  };

  const onUploadCompanyStatsExcel = async (file?: File) => {
    if (!file) return;
    try {
      setUploadingCompanyStats(true);
      await deptApi.uploadCompanyStatsExcel(file);
      toast.success("Company stats uploaded.");
    } catch (e) {
      console.error("uploadCompanyStatsExcel failed", e);
      toast.error("Failed to upload company stats.");
    } finally {
      setUploadingCompanyStats(false);
    }
  };

  const loadWebinarRecommendations = async () => {
    try {
      setWebinarRecLoading(true);
      const data = await deptApi.getWebinarRecommendations();
      setWebinarRecData(data);
    } catch (e) {
      console.error("getWebinarRecommendations failed", e);
      toast.error("Failed to load webinar recommendations.");
    } finally {
      setWebinarRecLoading(false);
    }
  };

  const downloadReport = async (kind: string, path: string) => {
    try {
      setGeneratingReport(kind);
      await TPOApi.downloadReportCsv(path, `${kind}_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Report generated.");
    } catch (e) {
      console.error("downloadReport failed", e);
      toast.error("Failed to generate report.");
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleExportShortlisted = async () => {
    try {
      setGeneratingReport("shortlisted_export");
      const filters = {
        minCgpa: jdFilters.cgpa,
        maxBacklogs: jdFilters.backlogs,
        skills: jdFilters.skills.join(",")
      };
      await TPOApi.downloadShortlistedStudentsCsv(filters, `Shortlisted_Students_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Shortlisted students list exported.");
    } catch (e) {
      console.error("handleExportShortlisted failed", e);
      toast.error("Failed to export shortlisted list.");
    } finally {
      setGeneratingReport(null);
    }
  };


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
    dos: [] as string[],
    donts: [] as string[],
    minCgpa: 7.0,
    maxBacklogs: 0,
    applicationLink: "",
    deadline: "",
  });
  const [driveReqSkill, setDriveReqSkill] = useState("");
  const [driveDoItem, setDriveDoItem] = useState("");
  const [driveDontItem, setDriveDontItem] = useState("");
  const [drivesList, setDrivesList] = useState<any[]>([]);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [creatingDrive, setCreatingDrive] = useState(false);

  const fetchTPODrives = useCallback(async () => {
    try {
      setLoadingDrives(true);
      const data = await TPOApi.getDrives();
      setDrivesList(data.drives || []);
    } catch (e) {
      console.error("fetchTPODrives failed", e);
      toast.error("Could not load recruitment drives.");
    } finally {
      setLoadingDrives(false);
    }
  }, []);

  useEffect(() => {
    if (selectedView === "drives") {
      fetchTPODrives();
    }
  }, [selectedView, fetchTPODrives]);

  const handleCreateDriveSubmit = async () => {
    if (!createDriveForm.companyName.trim() || !createDriveForm.role.trim()) {
      toast.error("Company name and role are required");
      return;
    }
    try {
      setCreatingDrive(true);
      await TPOApi.quickCreateDrive({
        companyName: createDriveForm.companyName.trim(),
        role: createDriveForm.role.trim(),
        description: createDriveForm.description.trim(),
        requirements: createDriveForm.requirements,
        dos: createDriveForm.dos,
        donts: createDriveForm.donts,
        minCgpa: createDriveForm.minCgpa,
        maxBacklogs: createDriveForm.maxBacklogs,
        applicationLink: createDriveForm.applicationLink.trim() || undefined,
        deadline: createDriveForm.deadline.trim() || undefined,
      });
      toast.success("Drive created. Students will see it under Drives.");
      setCreateDriveForm({
        companyName: "",
        role: "",
        description: "",
        requirements: [],
        dos: [],
        donts: [],
        minCgpa: 7.0,
        maxBacklogs: 0,
        applicationLink: "",
        deadline: "",
      });
      setCreateDriveOpen(false);
      await fetchTPODrives();
    } catch (e) {
      console.error("createDrive failed", e);
      toast.error("Could not create drive.");
    } finally {
      setCreatingDrive(false);
    }
  };

  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLElement>(null);

  // Keep ?tab= in sync (login lands on ?tab=overview; invalid/missing tab → overview)
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
    window.scrollTo(0, 0); // For mobile/desktop where window might scroll
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0); // For specific scrollable container
    }
  }, [selectedView]);

  useEffect(() => {
    const cached = readTPODashboardCache();
    loadDashboardAnalytics({ silent: !!cached });
  }, [loadDashboardAnalytics]);

  const manualRefresh = useManualRefresh(async () => {
    await loadDashboardAnalytics({ silent: true, refresh: true });
    await queryClient.invalidateQueries({ queryKey: queryKeys.TPO.applications({}) });
    toast.success("Dashboard data refreshed.");
  });

  const metricConfig: Record<string, { label: string; icon: any; color?: string }> = {
    total_students: { label: "Total Students", icon: Users, color: "bg-blue-500" },
    placement_ready: { label: "Placement Ready", icon: Target, color: "bg-green-500" },
    avg_readiness: { label: "Avg Readiness Score", icon: Award, color: "bg-purple-500" },
    placement_rate: { label: "Placement Rate", icon: TrendingUp, color: "bg-orange-500" },
    active_companies: { label: "Active Companies", icon: Building2 },
    avg_package: { label: "Avg Package (LPA)", icon: Briefcase },
    active_drives: { label: "Active Drives", icon: BookOpen },
    interview_success: { label: "Interview Success", icon: Activity },
  } as const;

  const collegeStats: any[] = (dashboardData?.collegeStats || []).map((item: any) => {
    const key = item?.key as string;
    const conf = metricConfig[key] || { label: key || "Metric", icon: Users, color: "bg-blue-500" };
    const rawValue = Number(item?.value || 0);
    const value = key === "avg_readiness" || key === "placement_rate" ? `${rawValue}%` : rawValue.toLocaleString();
    return {
      label: conf.label,
      value,
      trend: item?.trend || "up",
      icon: conf.icon,
      color: conf.color || "bg-blue-500",
    };
  });

  const additionalMetrics: any[] = (dashboardData?.additionalMetrics || []).map((item: any) => {
    const key = item?.key as string;
    const conf = metricConfig[key] || { label: key || "Metric", icon: Activity };
    const rawValue = Number(item?.value || 0);
    const value =
      key === "avg_package"
        ? rawValue.toFixed(2)
        : key === "interview_success"
          ? `${rawValue}%`
          : rawValue.toLocaleString();
    return {
      label: conf.label,
      value,
      trend: item?.trend || "up",
      icon: conf.icon,
    };
  });

  const branchDataRaw: any[] = dashboardData?.branchData || [];
  const branchData: any[] = branchDataRaw.length > 0 ? [
    ...branchDataRaw,
    { branch: "Information Technology", students: 48, ready: 35, placed: 20 },
    { branch: "Electronics & Comm.", students: 55, ready: 40, placed: 25 },
    { branch: "Mechanical Engg.", students: 30, ready: 15, placed: 5 },
    { branch: "Electrical Engg.", students: 40, ready: 25, placed: 10 }
  ] : [];
  const yearTrend: any[] = dashboardData?.yearTrend || [];
  const skillsRadarData: any[] = dashboardData?.skillsRadarData || [];
  const placementDistribution: any[] = dashboardData?.placementDistribution || [];
  const monthlyActivityRaw: any[] = dashboardData?.monthlyActivity || [];
  const monthlyActivity: any[] = monthlyActivityRaw.length > 5 ? monthlyActivityRaw : [
    { month: "Jan", applications: 1250, interviews: 450, offers: 120 },
    { month: "Feb", applications: 1800, interviews: 680, offers: 190 },
    { month: "Mar", applications: 2400, interviews: 950, offers: 320 },
    { month: "Apr", applications: 3100, interviews: 1200, offers: 480 },
    { month: "May", applications: 2800, interviews: 1450, offers: 650 },
    { month: "Jun", applications: 3500, interviews: 1800, offers: 890 },
  ];
  const atRiskStudents: any[] = dashboardData?.atRiskStudents || [];
  const topPerformers: any[] = dashboardData?.topPerformers || [];
  const suggestions: any[] = dashboardData?.suggestions || [];
  const upcomingEvents: any[] = dashboardData?.upcomingEvents || [];
  const announcements: any[] = dashboardData?.announcements || [];
  const recentPlacements: any[] = dashboardData?.recentPlacements || [];
  const topHiringCompanies: { name: string; offers: number }[] = dashboardData?.topHiringCompanies || [];

  const defaultRadarData = [
    { skill: "Problem Solving", college: 75, industry: 85 },
    { skill: "System Design", college: 60, industry: 80 },
    { skill: "Communication", college: 85, industry: 90 },
    { skill: "Coding", college: 70, industry: 85 },
    { skill: "Aptitude", college: 80, industry: 75 }
  ];
  const radarDataToUse = skillsRadarData.length > 0 ? skillsRadarData : defaultRadarData;

  const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className={`min-h-dvh ${isDark ? "bg-[#0c0c14]" : "bg-background"} transition-colors duration-300`}>
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-50 ${isDark ? "bg-[#0c0c14]/80 border-white/10" : "bg-background/80 border-border"} backdrop-blur-lg border-b shadow-sm`}>
        <div className="container flex min-h-16 min-w-0 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 flex-shrink-0 cursor-pointer items-center gap-0 group" onClick={() => navigate("/")}>
            <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-10 w-10 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12 flex-shrink-0" />
            <div className="min-w-0 flex flex-col">
              <span className="truncate bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text font-black text-lg leading-none text-transparent sm:text-xl">NextGen</span>
              <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-80 sm:text-[10px]">TPO Portal</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 md:gap-4">
            <div className="relative order-2 w-full min-w-0 group sm:order-none sm:max-w-xs sm:flex-initial md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search students, reports..."
                className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary sm:max-w-xs md:w-64 md:max-w-none"
              />
            </div>

            <div className="flex min-w-0 items-center justify-between gap-2 order-1 sm:order-none sm:justify-end sm:gap-2 md:gap-4">
              <Button variant="ghost" size="sm" className="relative shrink-0 touch-manipulation" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </Button>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex h-auto p-1 gap-2 rounded-xl hover:bg-muted/50 items-center focus-visible:ring-0 focus-visible:ring-offset-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                      <span className="text-[10px] font-black text-white">TP</span>
                    </div>
                    <div className="hidden text-left md:block">
                      <p className="text-sm font-black text-foreground leading-tight">TPO</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">TPO@tpo.edu</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 border-border shadow-xl rounded-xl">
                  <DropdownMenuLabel className="font-bold text-sm">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => navigate("/TPO/setting")} className="cursor-pointer gap-2 py-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => void performClientLogout(navigate)} className="cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                    <LogOut className="h-4 w-4" />
                    <span className="font-bold text-sm">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                className="mb-2"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            {/* Desktop Tabs */}
            <TabNav
              tabs={TPO_TAB_ITEMS}
              activeTab={selectedView}
              onTabChange={(view) => setSelectedView(view as TPOTab)}
              mobileHidden={isMobile}
            />
          </div>

          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="max-w-full w-[min(20rem,calc(100vw-1rem))] px-4">
              <div className="space-y-2 mt-8">
                {TPO_TAB_ITEMS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedView(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${selectedView === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                      }`}
                  >
                    {tab.label}
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
        className="container py-4 md:py-8 px-4 sm:px-6 max-w-[1400px] mx-auto"
      >
        {/* Welcome Section with Actions */}
        <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground leading-tight tracking-tight">
              {TPO_TAB_HEADINGS[selectedView].title}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
              {TPO_TAB_HEADINGS[selectedView].subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedView === "overview" && (
              <>
                <DashboardSyncBar
                  lastSyncedAt={lastSyncedAt}
                  isSyncing={manualRefresh.isRefreshing}
                  canRefresh={manualRefresh.canRefresh}
                  refreshLabel={manualRefresh.label}
                  onRefresh={() => void manualRefresh.refresh()}
                  showText={false}
                />
                <Button
                  size="sm"
                  onClick={() => setUploadDataOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Data
                </Button>
              </>
            )}
            {selectedView === "students" && (
              <Button
                variant="outline"
                size="sm"
                disabled={uploadingStudents}
                onClick={() => studentsFileRef.current?.click()}
                className="gap-2"
              >
                {uploadingStudents ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingStudents ? "Uploading..." : "Import Excel"}
              </Button>
            )}
          </div>
        </div>

        {/* Upload Data Modal (TPO Head) */}
        <Dialog open={uploadDataOpen} onOpenChange={setUploadDataOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Upload Data</DialogTitle>
              <DialogDescription>
                Upload student academic data or company hiring stats (Excel).
              </DialogDescription>
            </DialogHeader>

            <div className="grid sm:grid-cols-2 gap-4 py-2">
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-slate-900 dark:text-white mb-1">Students Data</div>
                    <div className="text-xs text-muted-foreground">CGPA, backlogs, marks, etc.</div>
                  </div>
                  <Button
                    className="w-full gap-2 mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 border-0 font-bold transition-colors"
                    variant="outline"
                    onClick={() => studentsFileRef.current?.click()}
                    disabled={uploadingStudents}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    {uploadingStudents ? "Uploading..." : "Browse Excel File"}
                  </Button>
                  <input
                    ref={studentsFileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      void onUploadStudentsExcel(f);
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-slate-900 dark:text-white mb-1">Company Stats</div>
                    <div className="text-xs text-muted-foreground">Selected by year, roles, CTC distribution</div>
                  </div>
                  <Button
                    className="w-full gap-2 mt-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300 border-0 font-bold transition-colors"
                    variant="outline"
                    onClick={() => companyStatsFileRef.current?.click()}
                    disabled={uploadingCompanyStats}
                  >
                    <FileBarChart className="h-4 w-4" />
                    {uploadingCompanyStats ? "Uploading..." : "Browse Excel File"}
                  </Button>
                  <input
                    ref={companyStatsFileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      void onUploadCompanyStatsExcel(f);
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDataOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



        {/* DRIVES TAB - Smart JD Filter & Management */}
        {selectedView === "drives" && (
          <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats for Drives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Box 1 */}
              <Card className="relative overflow-hidden border border-border/40 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-4 relative z-10 flex items-center gap-4">
                  <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border border-blue-500/20 shadow-inner shrink-0">
                    <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">12</h3>
                      <span className="px-2 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-md text-[10px] font-bold border border-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm">+2 this week</span>
                    </div>
                    <p className="text-muted-foreground text-base font-semibold mt-1">Active Drives</p>
                  </div>
                </CardContent>
              </Card>

              {/* Box 2 */}
              <Card className="relative overflow-hidden border border-border/40 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-4 relative z-10 flex items-center gap-4">
                  <div className="p-4 bg-green-500/10 dark:bg-green-500/20 rounded-xl border border-green-500/20 shadow-inner shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">892</h3>
                    <p className="text-muted-foreground text-base font-semibold mt-1">Eligible Students (Avg)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Box 3 */}
              <Card className="relative overflow-hidden border border-border/40 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 group hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-4 relative z-10 flex items-center gap-4">
                  <div className="p-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl border border-purple-500/20 shadow-inner shrink-0">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">45</h3>
                    <p className="text-muted-foreground text-base font-semibold mt-1">JDs Processed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Smart JD Shortlisting Tool */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <Card className="border border-border/20 shadow-xl shadow-black/10 overflow-hidden rounded-[2rem] bg-white dark:bg-slate-950">
                  <div className="bg-slate-100/80 dark:bg-slate-900/90 border-b border-border/20 dark:border-slate-800/70 p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-slate-900 dark:text-slate-50 font-black text-base sm:text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Smart JD Shortlister
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-xs mt-1">Automatically filter students based on company criteria</p>
                    </div>
                    <Button variant="secondary" size="sm" className="font-bold text-xs h-9 rounded-full px-4 bg-slate-100 text-slate-950 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
                      <Upload className="w-3 h-3 mr-2" />
                      Upload JD PDF
                    </Button>
                  </div>
                  <CardContent className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/95">
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
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
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center relative">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-white dark:ring-slate-950">
                              92%
                            </div>
                          </div>
                          <div className="text-left">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none">142</h4>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Students Eligible</p>
                          </div>
                        </div>

                        <div className="w-full flex gap-2">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 shadow-md shadow-blue-500/20 text-xs">
                            Notify Students
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 h-9 font-bold text-xs"
                            onClick={handleExportShortlisted}
                            disabled={generatingReport === "shortlisted_export"}
                          >
                            <Download className="w-3 h-3 mr-1.5" />
                            {generatingReport === "shortlisted_export" ? "Exporting..." : "Export Excel"}
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
                            <th className="px-4 py-3">Jobs</th>
                            <th className="px-4 py-3">Applied</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {loadingDrives ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                Loading drive performance...
                              </td>
                            </tr>
                          ) : drivesList.length > 0 ? (
                            drivesList.slice(0, 8).map((drive) => (
                              <tr key={drive.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-2.5 font-bold text-sm">{drive.companyName || "—"}</td>
                                <td className="px-4 py-2.5 text-muted-foreground text-xs">{drive.role || "—"}</td>
                                <td className="px-4 py-2.5 font-semibold text-xs">{drive.job_count ?? 0}</td>
                                <td className="px-4 py-2.5 font-semibold text-xs">{drive.application_count ?? 0}</td>
                                <td className="px-4 py-2.5 text-right">
                                  <Badge variant={drive.status === "COMPLETED" ? "secondary" : "default"} className={`text-[10px] px-1.5 py-0 ${drive.status === "OPEN" || drive.status === "ONGOING" ? "bg-green-500 text-white" : ""}`}>
                                    {drive.status || "OPEN"}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                No recruitment drives yet. Create one to get started.
                              </td>
                            </tr>
                          )}
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

                {loadingDrives ? (
                  <p className="text-sm text-muted-foreground py-4">Loading drives...</p>
                ) : drivesList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No drives yet. Create one below.</p>
                ) : (
                  drivesList.slice(0, 5).map((drive, i) => {
                    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
                    const color = colors[i % colors.length];
                    const companyName = drive.companyName || "Company";
                    const deadlineLabel = drive.deadline
                      ? new Date(drive.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Open";
                    return (
                      <Card key={drive.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} text-white shadow-sm font-black text-base flex-shrink-0`}>
                              {companyName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate group-hover:text-blue-600 transition-colors">{companyName}</h4>
                              <p className="text-xs text-muted-foreground truncate">{drive.role}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {deadlineLabel}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}

                <Card className="border border-border/20 shadow-xl shadow-black/10 mt-8 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-950">
                  <CardContent className="p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-black text-xl mb-2 text-slate-900 dark:text-white">Post a New Drive</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">Create a new placement drive and notify students instantly.</p>
                      <Button className="w-full bg-slate-950 text-white hover:bg-slate-900 font-bold h-11 rounded-full shadow-sm shadow-black/10 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200" onClick={() => setCreateDriveOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Drive
                      </Button>
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-slate-100/60 dark:bg-white/10 rounded-full blur-3xl"></div>
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
                        <Label>Do&apos;s (add one by one)</Label>
                        <div className="flex flex-wrap gap-2 mt-1 mb-2">
                          {createDriveForm.dos.map((item) => (
                            <Badge key={item} variant="secondary" className="gap-1 max-w-full">
                              <span className="truncate">{item}</span>
                              <X className="w-3 h-3 cursor-pointer shrink-0" onClick={() => setCreateDriveForm({ ...createDriveForm, dos: createDriveForm.dos.filter((d) => d !== item) })} />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. Submit updated resume with the form"
                            value={driveDoItem}
                            onChange={(e) => setDriveDoItem(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && driveDoItem.trim()) {
                                setCreateDriveForm({ ...createDriveForm, dos: [...createDriveForm.dos, driveDoItem.trim()] });
                                setDriveDoItem("");
                              }
                            }}
                          />
                          <Button type="button" variant="secondary" onClick={() => {
                            if (driveDoItem.trim()) {
                              setCreateDriveForm({ ...createDriveForm, dos: [...createDriveForm.dos, driveDoItem.trim()] });
                              setDriveDoItem("");
                            }
                          }}>Add</Button>
                        </div>
                      </div>
                      <div>
                        <Label>Don&apos;ts (add one by one)</Label>
                        <div className="flex flex-wrap gap-2 mt-1 mb-2">
                          {createDriveForm.donts.map((item) => (
                            <Badge key={item} variant="secondary" className="gap-1 max-w-full">
                              <span className="truncate">{item}</span>
                              <X className="w-3 h-3 cursor-pointer shrink-0" onClick={() => setCreateDriveForm({ ...createDriveForm, donts: createDriveForm.donts.filter((d) => d !== item) })} />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. Do not apply if CGPA is below minimum"
                            value={driveDontItem}
                            onChange={(e) => setDriveDontItem(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && driveDontItem.trim()) {
                                setCreateDriveForm({ ...createDriveForm, donts: [...createDriveForm.donts, driveDontItem.trim()] });
                                setDriveDontItem("");
                              }
                            }}
                          />
                          <Button type="button" variant="secondary" onClick={() => {
                            if (driveDontItem.trim()) {
                              setCreateDriveForm({ ...createDriveForm, donts: [...createDriveForm.donts, driveDontItem.trim()] });
                              setDriveDontItem("");
                            }
                          }}>Add</Button>
                        </div>
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
                      <Button onClick={handleCreateDriveSubmit} disabled={creatingDrive}>
                        {creatingDrive ? "Creating..." : "Create drive"}
                      </Button>
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
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
              {collegeStats
                .filter((stat: any) => stat.label !== "Placement Ready" && stat.label !== "Avg Readiness Score")
                .map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={`primary-${idx}`} className="relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 bg-gradient-to-br from-background to-muted/20 group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1 group-hover:text-primary transition-colors truncate">{stat.label}</p>
                            <p className="text-3xl font-black tracking-tight text-foreground">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              {additionalMetrics
                .filter((metric: any) => metric.label !== "Interview Success")
                .map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={`secondary-${idx}`} className="relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 bg-gradient-to-br from-background to-muted/20 group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1 group-hover:text-primary transition-colors truncate">{metric.label}</p>
                            <p className="text-3xl font-black tracking-tight text-foreground">{metric.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {/* Upcoming Events & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:mb-10">

              {/* Upcoming Events - Next 3 Only */}
              <Card className="TPO-section-card shadow-lg flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
                      <CardDescription className="text-xs">Next placement drives and workshops</CardDescription>
                    </div>
                    <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 h-8 shadow-sm rounded-lg transition-all hover:scale-105 text-xs whitespace-nowrap">
                          <Plus className="h-3 w-3" />
                          Schedule Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule New Event</DialogTitle>
                          <DialogDescription>Create a new placement drive, workshop, or webinar.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input placeholder="e.g. Resume Building Workshop" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Date & Time</Label>
                            <Input type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Meeting Link (Optional)</Label>
                            <Input placeholder="https://zoom.us/j/..." value={newEvent.link} onChange={e => setNewEvent({ ...newEvent, link: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Event Type</Label>
                            <Select value={newEvent.type} onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Webinar">Webinar</SelectItem>
                                <SelectItem value="Placement">Placement</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="PPT">Pre-Placement Talk</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleScheduleEvent}>Schedule</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    {upcomingEvents.length === 0 ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-between rounded-xl border border-dashed border-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10 p-4 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group gap-4 text-center sm:text-left h-full min-h-[150px]">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex flex-shrink-0 items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No upcoming events</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Schedule your next workshop, drive, or pre-placement talk here.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : upcomingEvents.slice(eventsSlide * 3, eventsSlide * 3 + 3).map((event, idx) => {
                      const eventTypeColors = {
                        Placement: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        Workshop: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                        PPT: "bg-green-500/10 text-green-500 border-green-500/20",
                        Training: "bg-orange-500/10 text-orange-500 border-orange-500/20",
                      };
                      const colorClass = eventTypeColors[event.type as keyof typeof eventTypeColors] || "bg-primary/10 text-primary border-primary/20";

                      return (
                        <div key={idx} className="group p-4 border border-border bg-muted/20 rounded-xl hover:border-primary/50 hover:shadow-sm hover:bg-muted/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClass} flex-shrink-0`}>
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground text-sm tracking-tight mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {event.date}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${colorClass}`}>
                                    {event.type}
                                  </span>

                                  {event.target_batch && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      Batch: {event.target_batch}
                                    </span>
                                  )}
                                  {event.department_name && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                      By: {event.department_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5 ml-3 shrink-0" onClick={e => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 gap-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                onClick={() => { setViewingEvent(event); setViewEventDialogOpen(true); }}
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-xs font-bold">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 gap-1.5 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 rounded-lg"
                                onClick={() => { setEditingEvent(event); setEditEventDialogOpen(true); }}
                              >
                                <Edit className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-xs font-bold">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 gap-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                                onClick={() => handleDeleteEvent(event)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                <span className="text-xs font-bold">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {upcomingEvents.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                      {upcomingEvents.length > 3 && (
                        <div className="flex items-center justify-between w-full px-1">
                          <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(upcomingEvents.length / 3) }).map((_, i) => (
                              <div
                                key={i}
                                onClick={() => setEventsSlide(i)}
                                className={`h-1.5 rounded-full cursor-pointer transition-all ${eventsSlide === i ? 'w-4 bg-blue-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`}
                              />
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={eventsSlide === 0} onClick={() => setEventsSlide(s => s - 1)}>
                              <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={(eventsSlide + 1) * 3 >= upcomingEvents.length} onClick={() => setEventsSlide(s => s + 1)}>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={handleOpenViewAllEvents}>
                        View All Events
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card className="TPO-section-card shadow-lg flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-lg font-bold">Announcements</CardTitle>
                      <CardDescription className="text-xs">Important updates and notices</CardDescription>
                    </div>
                    <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 h-8 shadow-sm rounded-lg transition-all hover:scale-105 text-xs whitespace-nowrap">
                          <Plus className="h-3 w-3" />
                          Post Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Post New Announcement</DialogTitle>
                          <DialogDescription>Broadcast an important update or notice to all students.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input placeholder="e.g. Registration Deadline Extended" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea placeholder="Type your announcement message here..." className="min-h-[100px]" value={newAnnouncement.message} onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} />
                          </div>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold" onClick={handlePostAnnouncement}>Post Announcement</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    {announcements.length === 0 ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-between rounded-xl border border-dashed border-purple-500/20 bg-purple-50/30 dark:bg-purple-900/10 p-4 transition-all hover:bg-purple-50/50 dark:hover:bg-purple-900/20 group gap-4 text-center sm:text-left h-full min-h-[150px]">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex flex-shrink-0 items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No new announcements</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Post your next important update or notice here.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-1">
                        {announcements.slice(announcementsSlide * 3, announcementsSlide * 3 + 3).map((ann, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm group relative">
                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/40 transition-colors">
                              <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={ann.title}>
                                  {ann.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    {new Date(ann.created_at).toLocaleDateString()}
                                  </span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-900" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-36">
                                      <DropdownMenuItem onClick={() => { setViewingAnnouncement(ann); setViewAnnouncementDialogOpen(true); }}>
                                        <Eye className="mr-2 h-4 w-4" /> View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => { setEditingAnnouncement(ann); setEditAnnouncementDialogOpen(true); }}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteAnnouncement(ann.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2" title={ann.message}>
                                {ann.message}
                              </p>
                            </div>
                          </div>
                        ))}
                        {/* Fill empty space with placeholders if less than 3 items on the current slide */}
                        {Array.from({ length: Math.max(0, 3 - announcements.slice(announcementsSlide * 3, announcementsSlide * 3 + 3).length) }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 opacity-60 select-none">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                              <Bell className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 space-y-2.5">
                              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                              <div className="h-2.5 bg-slate-100 dark:bg-slate-800/50 rounded w-2/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {announcements.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                      {announcements.length > 3 && (
                        <div className="flex items-center justify-between w-full px-1">
                          <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(announcements.length / 3) }).map((_, i) => (
                              <div
                                key={i}
                                onClick={() => setAnnouncementsSlide(i)}
                                className={`h-1.5 rounded-full cursor-pointer transition-all ${announcementsSlide === i ? 'w-4 bg-purple-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`}
                              />
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={announcementsSlide === 0} onClick={() => setAnnouncementsSlide(s => s - 1)}>
                              <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={(announcementsSlide + 1) * 3 >= announcements.length} onClick={() => setAnnouncementsSlide(s => s + 1)}>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="w-full text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20" onClick={handleOpenViewAllAnnouncements}>
                        View All Announcements
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ANALYTICS TAB - All Charts and Detailed Analytics */}
        {selectedView === "analytics" && (
          <>
            {/* Main Analytics Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-10">
              {/* Branch Performance */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-lg font-bold">Branch-wise Performance</CardTitle>
                      <CardDescription className="text-xs">Comprehensive placement metrics by department</CardDescription>
                    </div>
                    <Select defaultValue="All Metrics">
                      <SelectTrigger className="w-[180px] h-12 border border-border bg-background text-foreground rounded-lg text-base focus:ring-2 focus:ring-primary font-medium">
                        <SelectValue placeholder="All Metrics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Metrics">All Metrics</SelectItem>
                        <SelectItem value="Readiness">Readiness</SelectItem>
                        <SelectItem value="Placements">Placements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={branchData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorReady" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorPlacedTPO" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                      <XAxis dataKey="branch" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'var(--background)/95', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        labelStyle={{ fontWeight: 'black', color: 'var(--foreground)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                      <Bar dataKey="students" fill="url(#colorStudents)" name="Total Students" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="ready" fill="url(#colorReady)" name="Placement Ready" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="placed" fill="url(#colorPlacedTPO)" name="Placed" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Placement Distribution */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="space-y-0.5">
                    <CardTitle className="text-lg font-bold">Placement Distribution</CardTitle>
                    <CardDescription className="text-xs">By company type</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={placementDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={5}
                        stroke="none"
                      >
                        {placementDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--background)/95', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-3">
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
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8 md:mb-10">
              {/* Multi-Year Trends */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="space-y-0.5">
                    <CardTitle className="text-lg font-bold">Historical Trends</CardTitle>
                    <CardDescription className="text-xs">5-year placement and salary progression</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={yearTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dx={-10} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dx={10} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--background)/95', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                      <Area yAxisId="left" type="monotone" dataKey="placements" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPlacements)" name="Placement %" />
                      <Area yAxisId="right" type="monotone" dataKey="avg_salary" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" name="Avg Salary (LPA)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Hiring Companies */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="space-y-0.5">
                    <CardTitle className="text-lg font-bold">Top Hiring Companies</CardTitle>
                    <CardDescription className="text-xs">Total offers made by top recruiters</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topHiringCompanies.length > 0 ? topHiringCompanies : [{ name: "No offers yet", offers: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "var(--foreground)", fontWeight: 'bold' }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--background)/95', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                      <Bar dataKey="offers" name="Total Offers" radius={[0, 4, 4, 0]} barSize={16}>
                        {
                          [1, 2, 3, 4, 5, 6].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Activity */}
            <Card className="mb-8 md:mb-10 shadow-xl border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl font-black tracking-tight">Monthly Placement Pipeline</CardTitle>
                  <CardDescription className="text-sm font-medium">Applications, interviews, and offers conversion over the past 6 months</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 600 }} dx={-10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'black', color: 'var(--foreground)', marginBottom: '8px' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '13px' }}
                      cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} iconType="circle" />
                    <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" name="Applications" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                    <Area type="monotone" dataKey="interviews" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorInt)" name="Interviews" activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }} />
                    <Area type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOff)" name="Offers" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </>
        )}

        {/* SUGGESTIONS TAB */}
        {selectedView === "suggestions" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="mb-8 md:mb-10 overflow-hidden border border-border/10 bg-muted/30 shadow-2xl shadow-black/10">
              <CardContent className="px-6 pb-6 pt-0">
                <div className="grid gap-4 md:grid-cols-2">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="group overflow-hidden rounded-3xl border border-border/10 bg-background/80 p-5 shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h4 className="font-bold text-foreground text-base sm:text-lg tracking-tight leading-tight">{suggestion.title}</h4>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.2em] ${suggestion.impact === "High"
                          ? "bg-red-500/15 text-red-500"
                          : "bg-orange-500/15 text-orange-500"
                          }`}>
                          {suggestion.impact}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{suggestion.description}</p>
                      {suggestion.basis && (
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          <span className="font-semibold text-foreground">Basis:</span> {suggestion.basis}
                        </p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2 mb-5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground">Affected:</span>
                          <span className="font-black text-foreground">{suggestion.affectedStudents}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground">Timeline:</span>
                          <span className="font-black text-foreground">{suggestion.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground">Cost:</span>
                          <span className="font-black text-foreground">{suggestion.cost}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border/10">
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Priority {suggestion.priority}</span>
                        <Button variant="ghost" size="sm" className="h-9 text-sm gap-2 font-semibold text-foreground transition-colors hover:text-primary">
                          Learn More
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PLACEMENTS TAB - Placement Records */}
        {selectedView === "placements" && (
          <TPOPlacementsTab branchOptions={branchData} initialSearch={placementSearch} />
        )}

        {selectedView === "students" && (
          <TPOStudentsTab
            branchOptions={branchData}
            onNavigateToPlacements={(search) => {
              setPlacementSearch(search ?? "");
              setSelectedView("placements");
            }}
          />
        )}

        {/* REPORTS TAB - Report Generation and Exports */}

        {selectedView === "reports" && (
          <>
            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                      <FileBarChart className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Placement Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">Comprehensive placement statistics and trends</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("placement_report", "/reports/placement")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "placement_report" ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Student Readiness</h3>
                    <p className="text-sm text-muted-foreground mb-4">Student readiness scores and analytics</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("student_readiness", "/reports/student-readiness")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "student_readiness" ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                      <Building2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Company Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">Company-wise placement breakdown</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("company_analysis", "/reports/company-analysis")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "company_analysis" ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
                      <BarChart3 className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Branch Performance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Department-wise performance metrics</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("branch_performance", "/reports/branch-performance")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "branch_performance" ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-500/20 transition-colors">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">At-Risk Students</h3>
                    <p className="text-sm text-muted-foreground mb-4">List of students requiring attention</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("at_risk_students", "/reports/at-risk-students")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "at_risk_students" ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                      <FileSpreadsheet className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Custom Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create a customized report</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadReport("custom_company_analysis", "/reports/company-analysis")}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === "custom_company_analysis" ? "Generating..." : "Create"}
                    </Button>
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

        {/* View All Events Dialog */}
        <Dialog open={viewAllEventsOpen} onOpenChange={setViewAllEventsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>All Upcoming Events</DialogTitle>
              <DialogDescription>A complete list of scheduled events and webinars.</DialogDescription>
            </DialogHeader>
            <div className="px-1 mt-2">
              <Input 
                placeholder="Search events by title..." 
                value={searchEventsQuery} 
                onChange={(e) => {
                  setSearchEventsQuery(e.target.value);
                  setEventsPage(1);
                }} 
                className="w-full"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
              {loadingAllData ? (
                <div className="text-center py-8">Loading events...</div>
              ) : allEvents.filter(e => (e.title || "").toLowerCase().includes(searchEventsQuery.toLowerCase())).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No events found.</div>
              ) : (
                (() => {
                  const filtered = allEvents.filter(e => (e.title || "").toLowerCase().includes(searchEventsQuery.toLowerCase()));
                  const paginated = filtered.slice((eventsPage - 1) * PAGE_SIZE, eventsPage * PAGE_SIZE);
                  return (
                    <>
                      {paginated.map((event, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(event.starts_at || event.date).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.meeting_link && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">Join</a>
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <MoreVertical className="h-4 w-4 text-slate-400 hover:text-slate-900" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => { setViewingEvent(event); setViewEventDialogOpen(true); }}>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setEditingEvent(event); setEditEventDialogOpen(true); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteEvent(event.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      {filtered.length > PAGE_SIZE && (
                        <div className="flex justify-between items-center pt-4">
                          <Button 
                            variant="outline" 
                            disabled={eventsPage === 1}
                            onClick={() => setEventsPage(p => p - 1)}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {eventsPage} of {Math.ceil(filtered.length / PAGE_SIZE)}
                          </span>
                          <Button 
                            variant="outline" 
                            disabled={eventsPage === Math.ceil(filtered.length / PAGE_SIZE)}
                            onClick={() => setEventsPage(p => p + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* View Announcement Dialog */}
        <Dialog open={viewAnnouncementDialogOpen} onOpenChange={setViewAnnouncementDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold break-words">{viewingAnnouncement?.title}</DialogTitle>
              <DialogDescription>
                Posted on {viewingAnnouncement ? new Date(viewingAnnouncement.created_at).toLocaleDateString() : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-sm whitespace-pre-wrap break-words border border-slate-100 dark:border-slate-800">
                {viewingAnnouncement?.message}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setViewAnnouncementDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Announcement Dialog */}
        <Dialog open={editAnnouncementDialogOpen} onOpenChange={setEditAnnouncementDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>Update the details of the announcement below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingAnnouncement?.title || ''}
                  onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  className="min-h-[100px]"
                  value={editingAnnouncement?.message || ''}
                  onChange={e => setEditingAnnouncement({ ...editingAnnouncement, message: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditAnnouncementDialogOpen(false)}>Cancel</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleUpdateAnnouncement}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Event Dialog */}
        <Dialog open={viewEventDialogOpen} onOpenChange={setViewEventDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold break-words">{viewingEvent?.title}</DialogTitle>
              <DialogDescription>
                Scheduled for {viewingEvent ? new Date(viewingEvent.starts_at || viewingEvent.date).toLocaleString() : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                <span className="font-semibold text-slate-500">Event Type:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{viewingEvent?.type || 'Webinar'}</span>
              </div>
              {viewingEvent?.meeting_link && (
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                  <span className="font-semibold text-slate-500">Meeting Link:</span>
                  <a href={viewingEvent.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold truncate max-w-[200px]">
                    Join Session
                  </a>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setViewEventDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={editEventDialogOpen} onOpenChange={setEditEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update the details of the scheduled event below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingEvent?.title || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={editingEvent ? formatDatetimeLocal(editingEvent.starts_at || editingEvent.date) : ''}
                  onChange={e => setEditingEvent({ ...editingEvent, starts_at: e.target.value, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Meeting Link (Optional)</Label>
                <Input
                  placeholder="https://zoom.us/j/..."
                  value={editingEvent?.meeting_link || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, meeting_link: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditEventDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={handleUpdateEvent}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View All Announcements Dialog */}
        <Dialog open={viewAllAnnouncementsOpen} onOpenChange={setViewAllAnnouncementsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>All Announcements</DialogTitle>
              <DialogDescription>A complete list of posted announcements and updates.</DialogDescription>
            </DialogHeader>
            <div className="px-1 mt-2">
              <Input 
                placeholder="Search announcements by title or content..." 
                value={searchAnnouncementsQuery} 
                onChange={(e) => {
                  setSearchAnnouncementsQuery(e.target.value);
                  setAnnouncementsPage(1);
                }} 
                className="w-full"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
              {loadingAllData ? (
                <div className="text-center py-8">Loading announcements...</div>
              ) : allAnnouncements.filter(a => ((a.title || "") + " " + (a.message || "")).toLowerCase().includes(searchAnnouncementsQuery.toLowerCase())).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No announcements found.</div>
              ) : (
                (() => {
                  const filtered = allAnnouncements.filter(a => ((a.title || "") + " " + (a.message || "")).toLowerCase().includes(searchAnnouncementsQuery.toLowerCase()));
                  const paginated = filtered.slice((announcementsPage - 1) * PAGE_SIZE, announcementsPage * PAGE_SIZE);
                  return (
                    <>
                      {paginated.map((ann, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold">{ann.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                {new Date(ann.created_at).toLocaleDateString()}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-3.5 w-3.5 text-slate-400 hover:text-slate-900" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                  <DropdownMenuItem onClick={() => { setViewingAnnouncement(ann); setViewAnnouncementDialogOpen(true); }}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setEditingAnnouncement(ann); setEditAnnouncementDialogOpen(true); }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteAnnouncement(ann.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{ann.message}</p>
                        </div>
                      ))}
                      {filtered.length > PAGE_SIZE && (
                        <div className="flex justify-between items-center pt-4">
                          <Button 
                            variant="outline" 
                            disabled={announcementsPage === 1}
                            onClick={() => setAnnouncementsPage(p => p - 1)}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {announcementsPage} of {Math.ceil(filtered.length / PAGE_SIZE)}
                          </span>
                          <Button 
                            variant="outline" 
                            disabled={announcementsPage === Math.ceil(filtered.length / PAGE_SIZE)}
                            onClick={() => setAnnouncementsPage(p => p + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}

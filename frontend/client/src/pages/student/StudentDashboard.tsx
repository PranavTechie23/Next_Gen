import { useState, Fragment, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { performClientLogout } from "@/lib/logout";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import AssessmentHub from "@/pages/student/Resources";
import CompanyWiseKit from "@/pages/student/CompanyWiseKit";
import Internships from "@/pages/student/Internships";
import { studentApi } from "@/services/studentApi";
import { notificationApi } from "@/services/notificationApi";
import {
  STUDENT_SIDEBAR_LINKS,
  type MarqueeItem,
} from "@/pages/student/dashboard/sidebarConfig";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ComposedChart, Scatter
} from "recharts";
import {
  LogOut, Settings, TrendingUp, AlertCircle, CheckCircle, Target, Award, BookOpen,
  Briefcase, Code, GraduationCap, Zap, Star, Users, Shield, Globe, Cloud, Cpu,
  BarChart as BarChartIcon, Lock, Upload, Database, Terminal, Server, Palette,
  Smartphone, Monitor, Clock, MessageSquare, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ExternalLink, Download,
  Bell, User, ArrowUpRight, ArrowDownRight, Rocket, Brain, Trophy, Building2,
  FileText, Activity, CheckSquare, Circle, Plus, Search, Filter, Eye, Play,
  CheckCircle2, XCircle, AlertTriangle, Flame, Mail, Phone, MapPin, Github,
  Linkedin, Twitter, Instagram, Share2, Bookmark, LineChart as LineChartIcon, Calendar,
  TrendingDown, Edit, Upload as UploadIcon, Download as DownloadIcon, LayoutDashboard,
  Users as UsersIcon, Briefcase as BriefcaseIcon, Palette as PaletteIcon,
  Newspaper, DollarSign, CreditCard, FileCheck, Sparkles, HelpCircle, Menu, PanelLeft, Loader2, Banknote,
  Megaphone, Check, Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { resolveUploadUrl } from "@/lib/authSession";
import {
  DASHBOARD_CACHE_KEYS,
  readDashboardCache,
  writeDashboardCache,
} from "@/lib/dashboardCache";
import { useManualRefresh } from "@/hooks/useManualRefresh";
import { DashboardSyncBar } from "@/components/layouts";
import {
  PlacementDriveDetailDialog,
  type StudentPlacementDrive,
} from "@/features/student/placements/PlacementDriveDetailDialog";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  // Tab from URL only; default to overview (fresh sessions / login should not restore an old tab)
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab");
    if (urlTab) return urlTab;
    return "overview";
  });

  const [isEditingInternships, setIsEditingInternships] = useState(false);

  // Keep URL in sync with the active tab (bookmarkable / shareable)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state }, "", newUrl);
    }
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleProfileMouseEnter = () => {
    if (profileDropdownTimeoutRef.current) {
      clearTimeout(profileDropdownTimeoutRef.current);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileDropdownTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 300);
  };

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

  const { user: backendProfile, loading: loadingProfile, refreshUser } = useUser();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(() =>
    readDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap)
  );
  const [loadingRoadmap, setLoadingRoadmap] = useState(
    () => !readDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap)
  );
  const [savingPerformance, setSavingPerformance] = useState(false);
  const [uploadingAmcat, setUploadingAmcat] = useState(false);
  const [resumeUploadState, setResumeUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [resumeUploadStatusText, setResumeUploadStatusText] = useState<string>("");
  const [showTargetRoleModal, setShowTargetRoleModal] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [evaluatingRole, setEvaluatingRole] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const [careerInterests, setCareerInterests] = useState<string[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("student-career-interests") : null;
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 6) : [];
    } catch {
      return [];
    }
  });
  const [performanceDraft, setPerformanceDraft] = useState<any>(() => {
    const perf = readDashboardCache<any>(DASHBOARD_CACHE_KEYS.studentRoadmap)?.performance || {};
    return {
      amcat_quant: perf?.amcat_quant ?? "",
      amcat_verbal: perf?.amcat_verbal ?? "",
      amcat_logical: perf?.amcat_logical ?? "",
      endsem_percentage: perf?.endsem_percentage ?? "",
      mock_interview_score: perf?.mock_interview_score ?? "",
      coding_test_score: perf?.coding_test_score ?? "",
    };
  });


  const initialFeedCache = readDashboardCache<{
    marqueeItems: MarqueeItem[];
    systemNotificationItems: MarqueeItem[];
  }>(DASHBOARD_CACHE_KEYS.studentFeed);

  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(
    () => initialFeedCache?.marqueeItems ?? []
  );
  const [systemNotificationItems, setSystemNotificationItems] = useState<MarqueeItem[]>(
    () => initialFeedCache?.systemNotificationItems ?? []
  );
  const [clearedNotifIds, setClearedNotifIds] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem('cleared-notif-ids'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });
  const [noticeSearch, setNoticeSearch] = useState("");
  const [noticeFilter, setNoticeFilter] = useState<"all" | "announcements" | "events" | "important">("all");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const toggleNotificationRead = async (id: string) => {
    if (id.startsWith("api-")) {
      const numId = Number(id.replace("api-", ""));
      if (!Number.isFinite(numId)) return;
      try {
        await notificationApi.markAsRead(numId);
        setSystemNotificationItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Notification marked as read");
      } catch {
        toast.error("Could not update notification");
      }
      return;
    }

    setClearedNotifIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success("Notification marked as unread");
      } else {
        next.add(id);
        toast.success("Notification marked as read");
      }
      localStorage.setItem("cleared-notif-ids", JSON.stringify(Array.from(next)));
      return next;
    });
  };
  const [loadingMarquee, setLoadingMarquee] = useState(() => !initialFeedCache);
  const [announcementsExpanded, setAnnouncementsExpanded] = useState(false);
  const [expandedRoadmapSections, setExpandedRoadmapSections] = useState<Record<string, boolean>>({});

  const [completedRoadmapTasks, setCompletedRoadmapTasks] = useState<string[]>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("student-completed-tasks") : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("student-completed-tasks", JSON.stringify(completedRoadmapTasks));
      }
    } catch {
      // Ignore write errors
    }
  }, [completedRoadmapTasks]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedRoadmapTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };


  // Profile fetching is now handled by UserContext

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("student-career-interests", JSON.stringify(careerInterests || []));
      }
    } catch {
      // ignore persistence errors
    }
  }, [careerInterests]);

  const fetchRoadmap = async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    try {
      if (!silent && !readDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap)) {
        setLoadingRoadmap(true);
      }
      const data = await studentApi.getRoadmap();
      setRoadmapData(data);
      writeDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap, data);
      const perf = data?.performance || {};
      setPerformanceDraft({
        amcat_quant: perf?.amcat_quant ?? "",
        amcat_verbal: perf?.amcat_verbal ?? "",
        amcat_logical: perf?.amcat_logical ?? "",
        endsem_percentage: perf?.endsem_percentage ?? "",
        mock_interview_score: perf?.mock_interview_score ?? "",
        coding_test_score: perf?.coding_test_score ?? "",
      });
      return data;
    } catch (error: any) {
      console.error("Failed to fetch roadmap", error);
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      } else {
        toast.error("Failed to load mentorship roadmap");
      }
      return null;
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const onGeneratePersonalPlan = async () => {
    try {
      setSavingPerformance(true);
      await studentApi.updatePerformance(performanceDraft);
      await fetchRoadmap();
      toast.success("Personalized plan generated.");
    } catch (e) {
      console.error("Failed to generate personalized plan", e);
      toast.error("Failed to generate plan.");
    } finally {
      setSavingPerformance(false);
    }
  };

  const onAmcatReportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    try {
      setUploadingAmcat(true);
      const data = await studentApi.uploadAmcatReport(file);
      const perf = data?.performance || {};
      setPerformanceDraft((prev: any) => ({
        ...(prev || {}),
        amcat_quant: perf?.amcat_quant ?? prev?.amcat_quant ?? "",
        amcat_verbal: perf?.amcat_verbal ?? prev?.amcat_verbal ?? "",
        amcat_logical: perf?.amcat_logical ?? prev?.amcat_logical ?? "",
        mock_interview_score: perf?.mock_interview_score ?? prev?.mock_interview_score ?? "",
        coding_test_score: perf?.coding_test_score ?? prev?.coding_test_score ?? "",
      }));
      toast.success(data?.message || "AMCAT report uploaded.");
      setRoadmapData(null);
      await fetchRoadmap();
    } catch (error: any) {
      console.error("AMCAT upload failed", error);
      toast.error(error?.response?.data?.message || "Could not parse AMCAT report.");
    } finally {
      setUploadingAmcat(false);
    }
  };

  // Load roadmap once profile is available so overview recommendations can be dynamic too.
  useEffect(() => {
    if (!loadingProfile && backendProfile && !roadmapData && !loadingRoadmap) {
      const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap);
      fetchRoadmap({ silent: !!cached });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProfile, backendProfile]);

  // Load roadmap on first visit to Mentorship tab (and after resume upload/profile updates)
  useEffect(() => {
    if (activeTab === "learning" && !loadingProfile && backendProfile && !roadmapData && !loadingRoadmap) {
      const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.studentRoadmap);
      fetchRoadmap({ silent: !!cached });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, loadingProfile, backendProfile]);

  // Student Profile Data (Merged with Backend)
  const resumeParsed = backendProfile?.resumeParsed || {};
  const resumeSections = resumeParsed?.sections || {};

  const ordinalYear = (n: number) => {
    const v = n % 100;
    if (v >= 11 && v <= 13) return `${n}th`;
    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  const inferJoiningYear = () => {
    const explicitJoinYear = Number((backendProfile as any)?.student?.joining_year);
    if (Number.isFinite(explicitJoinYear) && explicitJoinYear >= 2000 && explicitJoinYear <= 2100) {
      return explicitJoinYear;
    }

    const roll = String((backendProfile as any)?.student?.roll_number || "");
    const rollYearMatch = roll.match(/\b(20\d{2})\b/);
    if (rollYearMatch) {
      const y = Number(rollYearMatch[1]);
      if (Number.isFinite(y)) return y;
    }

    const createdAtRaw = backendProfile?.user?.created_at;
    const createdAt = createdAtRaw ? new Date(createdAtRaw) : null;
    if (createdAt && !Number.isNaN(createdAt.getTime())) return createdAt.getFullYear();
    return null;
  };

  const inferJoiningYearFromEducation = () => {
    const educationLines: string[] = Array.isArray(resumeSections?.education) ? resumeSections.education : [];
    const joined = educationLines.map((x) => String(x || "")).join(" ");
    // Try to find a start year for bachelor's program (e.g., "Aug 2024 - Jun 2028" or "2024 - 2028")
    const range =
      joined.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(20\d{2})\s*[-–—]\s*(?:present|ongoing|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+20\d{2}|20\d{2})\b/i) ||
      joined.match(/\b(20\d{2})\s*[-–—]\s*(?:present|ongoing|20\d{2})\b/i);
    if (range) {
      const y = Number(range[1]);
      if (Number.isFinite(y)) return y;
    }
    return null;
  };

  const computeSemesterLabelFromJoinYear = () => {
    const joinYear = inferJoiningYearFromEducation() ?? inferJoiningYear();
    if (!joinYear) return { sem: null, label: "Year N/A" };

    const now = new Date();
    // Academic session assumed to start in July (common for engineering colleges).
    const academicStartMonth = 6; // 0-indexed => July
    const monthsSinceStart =
      (now.getFullYear() - joinYear) * 12 + (now.getMonth() - academicStartMonth);

    const sem = Math.max(1, Math.min(8, Math.floor(monthsSinceStart / 6) + 1));
    const yearNum = Math.ceil(sem / 2);
    return { sem, label: `Sem ${sem} • ${ordinalYear(yearNum)} year` };
  };

  const extractSemesterGpaSignalsFromResume = () => {
    const educationLines: string[] = Array.isArray(resumeSections?.education) ? resumeSections.education : [];
    if (!educationLines.length) return { maxSem: null, semToGpa: new Map<number, number>() };

    const semToGpa = new Map<number, number>();
    let maxSem: number | null = null;
    for (const raw of educationLines) {
      const line = String(raw || "");
      const semMatch = line.match(/(?:sem(?:ester)?\s*[-:]?\s*)([1-8])/i);
      const gpaMatch =
        line.match(/(?:sgpa|gpa|cgpa)\s*[:=]?\s*([0-9](?:\.[0-9]{1,2})?)/i) ||
        line.match(/\b([0-9](?:\.[0-9]{1,2})?)\s*\/\s*10\b/i);

      if (semMatch && gpaMatch) {
        const sem = Number(semMatch[1]);
        const gpa = Number(gpaMatch[1]);
        if (Number.isFinite(sem) && Number.isFinite(gpa)) {
          semToGpa.set(sem, gpa);
          if (maxSem === null || sem > maxSem) maxSem = sem;
        }
      }
    }
    return { maxSem, semToGpa };
  };

  const joinYearFallback = computeSemesterLabelFromJoinYear();
  const resumeSemSignals = extractSemesterGpaSignalsFromResume();
  // If resume doesn't list SGPA per semester, still infer semester from any "Sem X" mention in education.
  const maxSemMentioned = (() => {
    const educationLines: string[] = Array.isArray(resumeSections?.education) ? resumeSections.education : [];
    let m: number | null = null;
    for (const raw of educationLines) {
      const line = String(raw || "");
      const mm = line.match(/\bsem(?:ester)?\s*[-:]?\s*([1-8])\b/i);
      if (mm) {
        const sem = Number(mm[1]);
        if (Number.isFinite(sem)) m = m === null ? sem : Math.max(m, sem);
      }
    }
    return m;
  })();

  const resolvedSem = resumeSemSignals.maxSem ?? maxSemMentioned ?? joinYearFallback.sem;
  
  const fetchMarqueeData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent && !readDashboardCache(DASHBOARD_CACHE_KEYS.studentFeed)) {
      setLoadingMarquee(true);
    }
    try {
      const [announcements, events, deptEvents] = await Promise.all([
        studentApi.getAnnouncements().catch(() => []),
        studentApi.getWebinars().catch(() => ({ data: [] })),
        studentApi.getDeptEvents().catch(() => [])
      ]);
      const items: MarqueeItem[] = [];

      if (Array.isArray(announcements)) {
        announcements.forEach((a: any) => items.push({ id: `ann-${a.id}`, text: `📢 ${a.title}: ${a.message}`, type: "announcement", isImportant: !!(a.is_important) }));
      }

      if (events && Array.isArray(events.data)) {
        events.data.forEach((e: any) => {
          if (new Date(e.starts_at) >= new Date()) {
            items.push({ id: `evt-${e.id}`, text: `📅 Upcoming Event: ${e.title} on ${new Date(e.starts_at).toLocaleDateString()}`, type: "event", isImportant: false });
          }
        });
      }

      if (Array.isArray(deptEvents)) {
        let targetBatchCode = "All";
        if (resolvedSem === 1 || resolvedSem === 2) targetBatchCode = "FE";
        else if (resolvedSem === 3 || resolvedSem === 4) targetBatchCode = "SE";
        else if (resolvedSem === 5 || resolvedSem === 6) targetBatchCode = "TE";
        else if (resolvedSem === 7 || resolvedSem === 8) targetBatchCode = "BE";

        deptEvents.forEach((e: any) => {
          if (new Date(e.date) >= new Date() && (!e.target_batch || e.target_batch === "All" || e.target_batch === targetBatchCode)) {
            items.push({ id: `dept-evt-${e.id}`, text: `📅 Dept Event: ${e.title} on ${new Date(e.date).toLocaleDateString()}`, type: "event", isImportant: true });
          }
        });
      }

      const notifData = await notificationApi
        .getNotifications({ status: "unread", limit: 15 })
        .catch(() => ({ notifications: [] as { id: number; title: string; message: string }[] }));
      const systemItems: MarqueeItem[] = (notifData.notifications || []).map((n) => ({
        id: `api-${n.id}`,
        text: `${n.title}: ${n.message}`,
        type: "system" as const,
        isImportant: false,
      }));

      setMarqueeItems(items);
      setSystemNotificationItems(systemItems);
      writeDashboardCache(DASHBOARD_CACHE_KEYS.studentFeed, {
        marqueeItems: items,
        systemNotificationItems: systemItems,
      });
    } catch (err) {
      console.error("Failed to fetch marquee data", err);
    } finally {
      setLoadingMarquee(false);
    }
  }, [resolvedSem]);

  useEffect(() => {
    if (!backendProfile) return;
    const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.studentFeed);
    fetchMarqueeData({ silent: !!cached });
  }, [backendProfile, resolvedSem, fetchMarqueeData]);

  const resolvedYearLabel =
    resolvedSem !== null
      ? `Sem ${resolvedSem} • ${ordinalYear(Math.ceil(resolvedSem / 2))} year`
      : joinYearFallback.label;

  // If current semester is even (Sem 2/4/6/8), show previous semester GPA when present.
  const prevSem = resolvedSem && resolvedSem > 1 ? resolvedSem - 1 : null;
  const prevSemGpa = prevSem ? resumeSemSignals.semToGpa.get(prevSem) ?? null : null;
  const latestKnownGpa =
    (resolvedSem ? resumeSemSignals.semToGpa.get(resolvedSem) : null) ??
    backendProfile?.student?.current_cgpa ??
    null;
  const sanitizeDisplayName = (...candidates: any[]) => {
    const blocked = new Set([
      "projects", "project", "experience", "education", "skills", "summary",
      "certifications", "achievements", "internships", "resume", "profile"
    ]);

    for (const raw of candidates) {
      const name = String(raw || "").trim();
      if (!name) continue;

      const compact = name.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
      if (!compact) continue;
      if (blocked.has(compact)) continue;

      // Must look like a person name: at least 2 alphabetic chars and not mostly symbols.
      if (!/^[a-zA-Z][a-zA-Z\s.'-]{1,59}$/.test(name)) continue;
      // Reject all-uppercase heading-style tokens unless multi-word likely proper name.
      if (name === name.toUpperCase() && compact.split(" ").length < 2) continue;

      return name;
    }
    return null;
  };

  const fallbackNameFromEmail = String(backendProfile?.user?.email || "student")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

  const resolvedStudentName =
    sanitizeDisplayName(backendProfile?.profile?.full_name, resumeParsed?.full_name) ||
    fallbackNameFromEmail ||
    "Student";

  const studentProfile = {
    name: resolvedStudentName,
    id: backendProfile?.student?.roll_number || "N/A",
    email: backendProfile?.user?.email || "student@college.edu",
    phone: backendProfile?.profile?.phone || resumeParsed?.phone || "+91 00000 00000",
    branch: backendProfile?.department?.name || "Engineering",
    college: "NextGen University", // Assuming static or from institution table
    bio: backendProfile?.profile?.bio || "No bio added yet.",
    year: resolvedYearLabel,
    // Prefer previous semester GPA when available (Sem 4 shows Sem 3 GPA).
    cgpa: prevSemGpa ?? latestKnownGpa ?? 0,
    avatar: resolveUploadUrl(backendProfile?.profile?.avatar_url) || ""
  };

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };
  const onResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      try {
        setUploadingResume(true);
        setResumeUploadState("uploading");
        setResumeUploadStatusText("Uploading and parsing resume...");
        const uploadResult = await studentApi.uploadResume(file);
        setUploadingResume(false);
        setResumeUploadState("success");

        if (uploadResult?.llm_eval_available === false) {
          setResumeUploadStatusText("Resume updated. Parsed fields refreshed.");
          toast.info(uploadResult?.message || "Resume parsed. AI evaluation is once per day.");
          await refreshUser();
          setTimeout(() => {
            setResumeUploadState("idle");
            setResumeUploadStatusText("");
          }, 3500);
          return;
        }

        setResumeUploadStatusText("Resume uploaded. Please select target role.");
        setShowTargetRoleModal(true);
      } catch (error) {
        console.error("Resume upload failed", error);
        setResumeUploadState("error");
        setResumeUploadStatusText("Resume upload failed. Please try again.");
        toast.error("Resume upload failed. Please try again.");
      } finally {
        if (resumeInputRef.current) resumeInputRef.current.value = "";
      }
    }
  };

  const handleTargetRoleSubmit = async () => {
    if (!targetRoleInput.trim()) {
      toast.error("Please enter a target role.");
      return;
    }
    try {
      setEvaluatingRole(true);
      toast.info("AI is evaluating your resume for this role...");
      const evalResult = await studentApi.evaluateTargetRole(targetRoleInput);

      if (evalResult?.cached) {
        toast.info(evalResult?.message || "Using today's existing AI evaluation.");
      }

      // Force full recomputation refresh after target role evaluation.
      const [profileResult, roadmapResult] = await Promise.allSettled([
        studentApi.getProfile(),
        studentApi.getRoadmap(),
      ]);

      if (profileResult.status === "fulfilled") {
        await refreshUser();
      } else {
        throw profileResult.reason;
      }

      if (roadmapResult.status === "fulfilled") {
        const data = roadmapResult.value;
        setRoadmapData(data);
        const perf = data?.performance || {};
        setPerformanceDraft({
          amcat_quant: perf?.amcat_quant ?? "",
          amcat_verbal: perf?.amcat_verbal ?? "",
          amcat_logical: perf?.amcat_logical ?? "",
          endsem_percentage: perf?.endsem_percentage ?? "",
          mock_interview_score: perf?.mock_interview_score ?? "",
          coding_test_score: perf?.coding_test_score ?? "",
        });
      }

      toast.success(`Resume evaluated for ${targetRoleInput}!`);
      setShowTargetRoleModal(false);
      setTargetRoleInput("");

      setTimeout(() => {
        setResumeUploadState("idle");
        setResumeUploadStatusText("");
      }, 3500);

    } catch (error) {
      console.error("Evaluation failed", error);
      toast.error("Role evaluation failed. Please try again.");
    } finally {
      setEvaluatingRole(false);
    }
  };

  const amcatInputRef = useRef<HTMLInputElement>(null);

  const cleanSkillToken = (raw: any) => {
    const t = String(raw || "").replace(/\([^)]*\)/g, " ").replace(/\s{2,}/g, " ").trim();
    if (!t || t.length < 2 || t.length > 35) return null;
    const lower = t.toLowerCase();
    const blocked = new Set(["skills", "technical skills", "core concepts", "languages", "tools", "technologies", "database"]);
    if (blocked.has(lower)) return null;
    if (/^\d+$/.test(t) || /^[^a-zA-Z0-9]+$/.test(t)) return null;
    if (t.split(/\s+/).length > 4) return null;
    return t;
  };
  const cleanAchievementToken = (raw: any) => {
    const t = String(raw || "")
      .replace(/^[•\-\u2022*]\s*/, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!t || t.length < 6) return null;
    if (/^[-–—\s]*\d+\s*(?:of)?\s*\d+\s*[-–—\s]*$/i.test(t)) return null;
    return t;
  };

  const splitIntoLines = (raw: any) => {
    const t = String(raw || "").replace(/\r/g, "\n");
    const trimmed = t.trim();
    // Only split aggressively when it looks like a multi-line/bulleted block.
    if (trimmed.includes("\n")) {
      return trimmed.split(/\n+/g).map((x) => x.trim()).filter(Boolean);
    }
    if (/^[•\-\u2022]\s+/.test(trimmed)) {
      // bullet-prefixed single string like "• a • b"
      return trimmed
        .split(/(?=[•\-\u2022]\s+)/g)
        .map((x) => x.trim())
        .filter(Boolean);
    }
    return [trimmed];
  };

  const groupAchievementLines = (lines: string[]) => {
    const out: string[] = [];
    const isContinuation = (s: string) => {
      const t = String(s || "").trim();
      if (!t) return false;
      // Continuations are usually short and start like "round..." or lowercase phrases.
      if (t.length <= 60 && /^[a-z]/.test(t)) return true;
      if (/^(round|interview|aptitude|reasoning|verbal|quant|bug|coding|team|final)\b/i.test(t)) return true;
      // Lines starting with conjunctions are usually continuation.
      if (/^(and|or|with|followed|including)\b/i.test(t)) return true;
      return false;
    };

    for (const raw of lines) {
      const t = String(raw || "").trim();
      if (!t) continue;
      if (out.length === 0) {
        out.push(t);
        continue;
      }
      if (isContinuation(t)) {
        const prev = out[out.length - 1];
        const sep = /[.!?]$/.test(prev) ? " " : " ";
        out[out.length - 1] = `${prev}${sep}${t}`.replace(/\s{2,}/g, " ").trim();
      } else {
        out.push(t);
      }
    }
    return out;
  };

  const parsedResumeSkills: string[] = (backendProfile?.resumeParsed?.skills || [])
    .map(cleanSkillToken)
    .filter(Boolean);
  const profileSkills: string[] = (backendProfile?.skills || [])
    .map((s: any) => cleanSkillToken(s?.name))
    .filter(Boolean);

  // IMPORTANT: `student_skills` is append-only on resume upload (backend uses INSERT IGNORE),
  // so merging it with parsed skills makes old resume skills stick around.
  // When we have parsed skills from the latest resume, prefer them as the base display set.
  // IMPROVED: Create a unified Master Set from both the latest resume and the existing profile data.
  // This ensures that space-constrained resumes don't "delete" skills from the student's long-term profile.
  const baseMergedSkills: string[] = Array.from(
    new Set([...parsedResumeSkills, ...profileSkills] as string[])
  );

  const normalizeAchievementKey = (s: string) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

  const resumeAchievements: string[] = groupAchievementLines(
    (Array.isArray(resumeSections?.achievements) ? resumeSections.achievements : [])
      .flatMap(splitIntoLines)
      .map(cleanAchievementToken)
      .filter(Boolean)
  );
  const manualAchievements: string[] = groupAchievementLines(
    (Array.isArray(backendProfile?.achievements) ? backendProfile.achievements : [])
      .flatMap(splitIntoLines)
      .map(cleanAchievementToken)
      .filter(Boolean)
  );

  const baseMergedAchievements: string[] = (() => {
    const map = new Map<string, string>();
    for (const a of [...resumeAchievements, ...manualAchievements]) {
      const key = normalizeAchievementKey(a);
      if (!key) continue;
      if (!map.has(key) || map.get(key)!.length < a.length) {
        map.set(key, a);
      }
    }
    return Array.from(map.values());
  })();

  const normalizeToken = (v: any) => String(v || "").toLowerCase().trim();

  // --- SKILLS LOGIC: Grouping into Current (Resume + Manual) vs Previous (Legacy) ---
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);
  const [removedSkills, setRemovedSkills] = useState<string[]>([]);

  // Current Skills: Found in latest resume OR added manually by user
  const currentSkills: string[] = Array.from(
    new Set(
      [...parsedResumeSkills, ...pendingSkills].filter(
        (s) => !removedSkills.some((r) => normalizeToken(r) === normalizeToken(s))
      )
    )
  );

  // Previous Skills: In the database but NOT in the current resume/manual set
  const previousSkills: string[] = profileSkills
    .map((s: any) => cleanSkillToken(s?.name))
    .filter(Boolean)
    .filter((s) => !currentSkills.some((c) => normalizeToken(c) === normalizeToken(s))) as string[];

  // --- ACHIEVEMENTS LOGIC: Grouping into Current vs Archived ---
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const [removedAchievements, setRemovedAchievements] = useState<string[]>([]);

  const currentAchievements: string[] = Array.from(
    new Set(
      [...resumeAchievements, ...pendingAchievements].filter(
        (a) =>
          !removedAchievements.some(
            (r) =>
              String(r || "").toLowerCase().replace(/\s+/g, " ").trim() ===
              String(a || "").toLowerCase().replace(/\s+/g, " ").trim()
          )
      )
    )
  );

  const previousAchievements: string[] = manualAchievements
    .filter((a) => !currentAchievements.some((c) =>
      String(c || "").toLowerCase().replace(/\s+/g, " ").trim() ===
      String(a || "").toLowerCase().replace(/\s+/g, " ").trim()
    ));

  const [newSkillInput, setNewSkillInput] = useState("");
  const [newAchievementInput, setNewAchievementInput] = useState("");
  const [savingManualProfile, setSavingManualProfile] = useState(false);
  const [manualEditMode, setManualEditMode] = useState(false);
  const [showAllSkillsCard, setShowAllSkillsCard] = useState(false);
  const [showAllAchievementsCard, setShowAllAchievementsCard] = useState(false);
  const [showPreviousSkills, setShowPreviousSkills] = useState(false);
  const [showPreviousAchievements, setShowPreviousAchievements] = useState(false);

  useEffect(() => {
    // Clear local pending edits when backend profile refreshes (e.g. after Save/Resume upload).
    setPendingSkills([]);
    setPendingAchievements([]);
    setRemovedSkills([]);
    setRemovedAchievements([]);
  }, [backendProfile]);

  const saveManualSkillsAndAchievements = async () => {
    try {
      setSavingManualProfile(true);
      const allSkills = Array.from(new Set([...currentSkills, ...previousSkills]));
      const allAchievements = Array.from(new Set([...currentAchievements, ...previousAchievements]));

      const uniqueSkillNames = allSkills.reduce<string[]>((acc, skillName) => {
        const cleaned = String(skillName || "").trim();
        if (!cleaned) return acc;
        const normalized = cleaned.toLowerCase();
        const exists = acc.some((item) => item.toLowerCase() === normalized);
        if (!exists) acc.push(cleaned);
        return acc;
      }, []);

      const skillsPayload = uniqueSkillNames.map((name) => ({ name }));
      await studentApi.updateSubjectiveProfile({
        skills: skillsPayload,
        achievements: allAchievements,
      });
      await refreshUser();
      setManualEditMode(false);
      toast.success("Profile updated.");
    } catch (e) {
      console.error("Failed to save manual profile updates", e);
      toast.error("Failed to save updates.");
    } finally {
      setSavingManualProfile(false);
    }
  };

  const removeSkill = (skill: string) => {
    setPendingSkills((prev) => prev.filter((s) => normalizeToken(s) !== normalizeToken(skill)));
    setRemovedSkills((prev) => {
      if (prev.some((s) => normalizeToken(s) === normalizeToken(skill))) return prev;
      return [...prev, skill];
    });
  };

  const removeAchievement = (achievement: string) => {
    const norm = String(achievement || "").toLowerCase().replace(/\s+/g, " ").trim();
    setPendingAchievements((prev) =>
      prev.filter((a) => String(a || "").toLowerCase().replace(/\s+/g, " ").trim() !== norm)
    );
    setRemovedAchievements((prev) => {
      if (prev.some((a) => String(a || "").toLowerCase().replace(/\s+/g, " ").trim() === norm)) return prev;
      return [...prev, achievement];
    });
  };

  const resetToResumeOnly = () => {
    if (!parsedResumeSkills.length) {
      toast.error("No parsed resume found to sync with.");
      return;
    }
    const skillsToPurge = profileSkills.filter(ps =>
      !parsedResumeSkills.some(rs => normalizeToken(rs) === normalizeToken(ps))
    );
    setRemovedSkills(prev => Array.from(new Set([...prev, ...skillsToPurge])));
    setPendingSkills([]);
    toast.success("Profile reset to match latest resume skills. Don't forget to save!");
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

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthToIndex = (m: string) => MONTHS.findIndex((x) => x.toLowerCase() === m.toLowerCase());
  const parseMonthYearFromText = (value: any): Date | null => {
    const text = String(value || "");
    if (!text) return null;
    const m = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,.-]+(20\d{2})\b/i);
    if (m) {
      const month = monthToIndex(m[1].slice(0, 3));
      const year = Number(m[2]);
      if (month >= 0 && year >= 2000) return new Date(year, month, 1);
    }
    const y = text.match(/\b(20\d{2})\b/);
    if (y) return new Date(Number(y[1]), 0, 1);
    return null;
  };

  const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
  const pct = (n: number) => `${Math.round(clamp(n))}%`;

  /** Local fallback when backend metrics are not yet loaded. */
  const computeLocalMetricsFallback = () => {
    const cgpa = Number(backendProfile?.student?.current_cgpa ?? 0);
    const backlogs = Number(backendProfile?.student?.active_backlogs ?? 0);
    const skillsCount = currentSkills.length + previousSkills.length;
    const skillsMastered = skillsCount > 0 ? clamp(100 * (1 - Math.exp(-skillsCount / 12))) : 0;
    const academicsScore = cgpa > 0 ? clamp((cgpa / 10) * 100 - backlogs * 15) : 0;
    const overallReadiness = clamp(academicsScore * 0.45 + skillsMastered * 0.30 + 25);
    return {
      overallReadiness,
      skillsMastered,
      placementProbability: overallReadiness,
      aiConfidence: overallReadiness,
    };
  };

  const serverMetrics = (backendProfile as { dashboardMetrics?: Record<string, any> })?.dashboardMetrics;
  const fallback = computeLocalMetricsFallback();
  const dynamic = {
    overallReadiness: serverMetrics?.overallReadiness ?? fallback.overallReadiness,
    skillsMastered: serverMetrics?.coreCompetencies?.score ?? fallback.skillsMastered,
    placementProbability: serverMetrics?.placementFitIndex?.score ?? fallback.placementProbability,
    aiConfidence: serverMetrics?.profileCompleteness?.score ?? fallback.aiConfidence,
  };
  const readinessStatusLabel = serverMetrics?.readinessStatusLabel
    ?? (dynamic.overallReadiness >= 75 ? "EXCELLENT"
      : dynamic.overallReadiness >= 55 ? "GOOD"
      : dynamic.overallReadiness >= 35 ? "BUILDING" : "GETTING STARTED");
  const readinessEncouragement = serverMetrics?.readinessEncouragement
    ?? (dynamic.overallReadiness >= 55
      ? "Solid progress — add projects and assessment scores to strengthen your fit."
      : "Keep building your profile to unlock stronger placement signals.");
  const roleNoiseWords = new Set([
    "pune", "mumbai", "india", "college", "university", "institute", "school", "present",
    "jun", "june", "jul", "july", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar", "apr", "may",
    "btech", "bachelor", "hsc", "ssc", "cgpa", "gmail", "linkedin", "github", "address", "phone", "email",
    "computer", "engineering", "student", "resume", "summary",
    "secondary", "certificate", "certification", "certifications", "board", "junior", "senior", "marks", "rank"
  ]);

  const normalizeInterest = (v: any) =>
    String(v || "")
      .toLowerCase()
      .replace(/[^a-z0-9+#./\s-]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

  const suggestedInterests = (() => {
    // Keep suggestions focused: skills + project titles only (avoid education/cert noise).
    const blobs = [
      ...currentSkills, ...previousSkills,
      ...(Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p: any) => p?.title || "") : []),
    ]
      .map((x) => String(x || "").toLowerCase())
      .join(" ");

    const tokens = blobs
      .split(/[^a-z0-9+#./-]+/g)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !/^\d+$/.test(t))
      .filter((t) => !roleNoiseWords.has(t))
      .filter((t) => !/^(20\d{2}|\d{1,2})$/.test(t));

    // Prefer tokens that look like tech keywords
    const techish = tokens.filter((t) => /[+#./]/.test(t) || /^(react|node|express|sql|mysql|postgres|mongodb|python|java|dsa|api|docker|aws|git|github|typescript|javascript|tailwind|next|ml|ai|pandas|numpy)$/.test(t));

    const counts = new Map<string, number>();
    techish.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);

    const existing = new Set((careerInterests || []).map((x) => normalizeInterest(x)));
    return sorted.filter((k) => !existing.has(normalizeInterest(k))).slice(0, 18);
  })();

  const topJourneyKeywords = (() => {
    const blobs = [
      ...currentSkills, ...previousSkills,
      ...(Array.isArray(resumeSections?.experience) ? resumeSections.experience : []),
      ...(Array.isArray(resumeSections?.education) ? resumeSections.education : []),
      ...(Array.isArray(resumeSections?.certifications)
        ? resumeSections.certifications.map((c: any) => (typeof c === "string" ? c : String(c?.label || "")))
        : []),
      ...(Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p: any) => p?.title || "") : []),
      ...(careerInterests || []),
    ]
      .map((x) => String(x || "").toLowerCase())
      .join(" ");

    const tokens = blobs
      .split(/[^a-z0-9+#./-]+/g)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !/^\d+$/.test(t))
      .filter((t) => !roleNoiseWords.has(t))
      .filter((t) => !/^(20\d{2}|\d{1,2})$/.test(t));

    const counts = new Map<string, number>();
    tokens.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([k]) => k);
  })();

  const roleRecommendation = (() => {
    const targetRole = String(resumeParsed?.target_role || "").trim();
    if (targetRole) {
      return {
        title: targetRole,
        confidence: Math.round(Number(resumeParsed?.target_role_match || 0)),
        trend: "UP",
      };
    }

    const backendRole = String(resumeParsed?.inferred_role || "").trim();
    const backendConfidence = Number(resumeParsed?.inferred_role_confidence ?? 0);
    if (backendRole) {
      return {
        title: backendRole,
        confidence: Math.round(clamp(backendConfidence || dynamic.aiConfidence, 35, 96)),
        trend: "UP",
      };
    }

    const skillsSet = new Set([...currentSkills, ...previousSkills].map((s: string) => normalizeToken(s)));
    const interestsSet = new Set((careerInterests || []).map((i) => normalizeToken(i)));
    const evidenceBlob = [
      ...(Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p: any) => p?.title || "") : []),
      ...(Array.isArray(resumeSections?.experience) ? resumeSections.experience : []),
      ...(Array.isArray(resumeSections?.certifications)
        ? resumeSections.certifications.map((c: any) => (typeof c === "string" ? c : String(c?.label || "")))
        : []),
      ...(topJourneyKeywords || []),
      ...(careerInterests || []),
      ...currentSkills, ...previousSkills,
    ].join(" ").toLowerCase();

    const roleTaxonomy = [
      {
        title: "Full Stack Developer",
        signals: ["react", "node", "express", "javascript", "typescript", "html", "css", "api", "mongodb", "mysql", "sql"],
      },
      {
        title: "Backend Developer",
        signals: ["node", "express", "java", "spring", "api", "microservice", "redis", "sql", "postgres", "backend"],
      },
      {
        title: "Frontend Developer",
        signals: ["react", "next", "javascript", "typescript", "html", "css", "tailwind", "frontend", "ui"],
      },
      {
        title: "Data / ML Engineer",
        signals: ["python", "pandas", "numpy", "machine learning", "deep learning", "tensorflow", "pytorch", "data", "analytics"],
      },
      {
        title: "DevOps / Cloud Engineer",
        signals: ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", "terraform", "cloud", "devops"],
      },
      {
        title: "Software Engineer",
        signals: ["dsa", "algorithm", "problem solving", "oop", "java", "c++", "software", "developer"],
      },
    ];

    const scored = roleTaxonomy.map((role) => {
      let score = 0;
      for (const s of role.signals) {
        const key = s.toLowerCase();
        const inSkills = Array.from(skillsSet).some((x: unknown) => String(x).includes(key));
        const inInterests = Array.from(interestsSet).some((x) => x.includes(key) || key.includes(x));
        const inJourney = evidenceBlob.includes(key);
        if (inSkills) score += 5;
        if (inInterests) score += 6;
        if (inJourney) score += 3;
      }
      return { ...role, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored[0];
    const second = scored[1];
    const margin = Math.max(0, Number(top?.score || 0) - Number(second?.score || 0));
    const projects = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const exp = Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0;
    const certs = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0;
    const baseDensity = currentSkills.length + previousSkills.length + projects + exp + certs + (careerInterests || []).length;
    const confidence = clamp(45 + baseDensity * 3 + margin * 2, 42, 96);

    return {
      title: top?.title || "Software Engineer",
      confidence: Math.round(confidence),
      trend: margin >= 4 ? "UP" : "STABLE",
    };
  })();

  const roleSkillCards = [
    {
      label: "Technical Skills",
      score: Math.round(dynamic.skillsMastered),
      color: "text-blue-400",
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
    },
    {
      label: "Soft Skills",
      score: Math.round(45 + Math.min(currentAchievements.length + previousAchievements.length, 6) * 8),
      color: "text-amber-400",
      bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
    },
    {
      label: "Experience",
      score: Math.round(35 + Math.min(((Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0) * 9) + ((Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0) * 6), 60)),
      color: "text-green-400",
      bg: isDark ? "bg-green-500/10" : "bg-green-50",
    }
  ];
  const toggleInterest = (interest: string) => {
    setCareerInterests((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const key = normalizeInterest(interest);
      const idx = next.findIndex((x) => normalizeInterest(x) === key);
      if (idx >= 0) {
        next.splice(idx, 1);
        return next;
      }
      return [...next, String(interest || "").trim()].slice(0, 6);
    });
  };
  const addInterestFromInput = () => {
    const val = String(interestInput || "").trim();
    if (!val) return;
    toggleInterest(val);
    setInterestInput("");
  };

  const normalizedResumeTimeline = (() => {
    const edu = Array.isArray(resumeSections?.education) ? resumeSections.education : [];
    const exp = Array.isArray(resumeSections?.experience) ? resumeSections.experience : [];
    const certs = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : [];
    const ach = [...currentAchievements, ...previousAchievements];
    const projectBlocks = Array.isArray(resumeSections?.projects) ? resumeSections.projects : [];

    const inferredEvents: any[] = [];

    edu.forEach((line: any) => inferredEvents.push({ source: "education", title: String(line || ""), date: parseMonthYearFromText(line) }));
    exp.forEach((line: any) => inferredEvents.push({ source: "experience", title: String(line || ""), date: parseMonthYearFromText(line) }));
    certs.forEach((line: any) => {
      const title = typeof line === "string" ? line : String(line?.label || "");
      inferredEvents.push({ source: "certification", title, date: parseMonthYearFromText(title) });
    });
    ach.forEach((line: any) => inferredEvents.push({ source: "achievement", title: String(line || ""), date: parseMonthYearFromText(line) }));
    projectBlocks.forEach((p: any) => inferredEvents.push({ source: "project", title: String(p?.title || ""), date: parseMonthYearFromText(p?.title || "") }));

    const filtered = inferredEvents
      .filter((e) => String(e.title || "").trim().length >= 4)
      .map((e) => ({ ...e, date: e.date || new Date() }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return filtered.slice(-12);
  })();

  // Evolution Track Data (resume timeline-driven)
  const evolutionData = (() => {
    const eventDates = normalizedResumeTimeline.map((e) => e.date).filter((d: Date) => d instanceof Date && !Number.isNaN(d.getTime()));
    const now = new Date();
    const anchor = eventDates.length > 0 ? eventDates[eventDates.length - 1] : now;
    const months: { key: string; month: string; year: number; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()], year: d.getFullYear(), date: d });
    }

    const counts = months.map((m) => {
      const sameMonthEvents = normalizedResumeTimeline.filter((e) => e.date.getMonth() === m.date.getMonth() && e.date.getFullYear() === m.date.getFullYear()).length;
      return sameMonthEvents;
    });

    let cumulative = 0;
    return months.map((m, idx) => {
      cumulative += counts[idx];
      const momentum = cumulative * 4 + counts[idx] * 6;
      const technicalBase = clamp(dynamic.skillsMastered * 0.55 + momentum + idx * 2, 25, 95);
      const overallBase = clamp(dynamic.overallReadiness * 0.5 + momentum + idx * 2, 20, 95);
      return {
        month: m.month,
        overall: Math.round(overallBase),
        technical: Math.round(technicalBase),
      };
    });
  })();

  // Dashboard quick stats — sourced from unified backend metrics when available
  const quickStats = [
    {
      label: serverMetrics?.targetRoleAlignment?.label ?? (resumeParsed?.target_role ? `Match: ${resumeParsed.target_role}` : "Overall Readiness"),
      value: pct(serverMetrics?.targetRoleAlignment?.score ?? resumeParsed?.target_role_match ?? dynamic.overallReadiness),
      change: serverMetrics?.targetRoleAlignment?.badge ?? (resumeParsed?.target_role ? "LLM Evaluated" : "Readiness Score"),
      trend: (serverMetrics?.targetRoleAlignment?.score ?? resumeParsed?.target_role_match ?? dynamic.overallReadiness) >= 60 ? "up" : "down",
      icon: Target,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      description: serverMetrics?.targetRoleAlignment?.description ?? (resumeParsed?.target_role ? "Target Role Alignment" : "Placement Preparedness"),
    },
    {
      label: serverMetrics?.coreCompetencies?.label ?? "Skills Mastered",
      value: pct(dynamic.skillsMastered),
      change: serverMetrics?.coreCompetencies?.badge ?? "Computed",
      trend: dynamic.skillsMastered >= 60 ? "up" : "down",
      icon: Award,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      description: serverMetrics?.coreCompetencies?.description ?? "Core Competencies",
    },
    {
      label: serverMetrics?.placementFitIndex?.label ?? "Placement Fit Index",
      value: pct(dynamic.placementProbability),
      change: serverMetrics?.placementFitIndex?.badge ?? "Computed",
      trend: dynamic.placementProbability >= 60 ? "up" : "down",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      description: serverMetrics?.placementFitIndex?.description ?? "Overall Fit",
    },
    {
      label: serverMetrics?.profileCompleteness?.label ?? "Profile Completeness",
      value: pct(dynamic.aiConfidence),
      change: serverMetrics?.profileCompleteness?.badge ?? "Resume Analysis",
      trend: dynamic.aiConfidence >= 70 ? "up" : "down",
      icon: Brain,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      description: serverMetrics?.profileCompleteness?.description ?? "Resume & Profile Coverage",
    },
  ];

  // Dynamic Skill Data (resume/profile-driven)
  const skillData = (() => {
    const projectCount = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const expCount = Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0;
    const certCount = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0;
    const totalSkills = currentSkills.length + previousSkills.length;
    const allSkills = [...currentSkills, ...previousSkills];
    const allAchievements = [...currentAchievements, ...previousAchievements];

    const achievementsCount = allAchievements.length;

    const hasAny = (keywords: string[]) =>
      (allSkills || []).some((s: string) => keywords.some((k) => s.toLowerCase().includes(k)));

    const codingSignals = [
      "dsa", "algorithm", "leetcode", "problem solving", "c++", "java", "python", "competitive"
    ];
    const dbSignals = ["sql", "mysql", "postgres", "mongodb", "database", "dbms", "redis"];
    const webSignals = ["react", "node", "express", "next", "html", "css", "typescript", "javascript"];
    const sysSignals = ["system design", "microservice", "docker", "kubernetes", "aws", "scalable"];

    const codingScore = clamp(
      totalSkills * 3 +
      (hasAny(codingSignals) ? 18 : 0) +
      Math.min(projectCount, 3) * 6 +
      Math.min(expCount, 2) * 5
    );
    const systemDesignScore = clamp(
      (hasAny(sysSignals) ? 28 : 8) +
      projectCount * 7 +
      expCount * 8 +
      certCount * 4
    );
    const fullStackScore = clamp(
      (hasAny(webSignals) ? 28 : 12) +
      projectCount * 10 +
      expCount * 8 +
      Math.min(totalSkills, 20) * 1.5
    );
    const databaseScore = clamp(
      (hasAny(dbSignals) ? 32 : 10) +
      projectCount * 7 +
      certCount * 6 +
      expCount * 5
    );
    const communicationScore = clamp(
      30 +
      Math.min(achievementsCount, 6) * 8 +
      Math.min(projectCount + expCount, 8) * 4
    );
    const teamProjectScore = clamp(
      25 +
      projectCount * 10 +
      expCount * 8 +
      Math.min(achievementsCount, 5) * 5
    );

    const mk = (skill: string, student: number, industry: number, target: number, category: string) => {
      const gap = clamp(target - student, 0, 100);
      const priority = gap >= 18 ? "critical" : gap >= 10 ? "high" : "medium";
      const improvement =
        gap >= 18 ? `+${gap}% needed` :
          gap >= 10 ? `+${gap}% target` :
            "Maintaining momentum";
      return { skill, student: Math.round(student), industry, target, gap: Math.round(gap), category, priority, improvement };
    };

    return [
      mk("DSA", codingScore, 85, 80, "Technical"),
      mk("System Design", systemDesignScore, 75, 68, "Technical"),
      mk("Full Stack Dev", fullStackScore, 82, 78, "Technical"),
      mk("Database Design", databaseScore, 80, 75, "Technical"),
      mk("Communication", communicationScore, 80, 74, "Soft Skills"),
      mk("Team Projects", teamProjectScore, 85, 78, "Experience"),
    ];
  })();

  // Role-aware radar: required benchmarks shift by inferred role; all values clamped 0–100 (fixes tooltip >100).
  const radarSkillData = (() => {
    const title = String(roleRecommendation?.title || "Software Engineer").toLowerCase();
    let required: number[];
    if (title.includes("frontend")) {
      required = [78, 82, 82, 76, 56, 82, 68];
    } else if (title.includes("backend")) {
      required = [82, 78, 76, 84, 80, 76, 70];
    } else if (title.includes("data") || title.includes("ml")) {
      required = [74, 78, 84, 80, 58, 78, 74];
    } else if (title.includes("devops") || title.includes("cloud")) {
      required = [72, 84, 76, 76, 82, 82, 72];
    } else if (title.includes("qa") || title.includes("test")) {
      required = [68, 74, 88, 76, 56, 86, 68];
    } else if (title.includes("full stack")) {
      required = [84, 80, 78, 82, 72, 78, 70];
    } else {
      required = [85, 78, 80, 85, 75, 80, 72];
    }
    required = required.map((n) => Math.round(clamp(n, 0, 100)));

    const dsa = clamp(Number(skillData.find((s) => s.skill === "DSA")?.student ?? 0), 0, 100);
    const sys = clamp(Number(skillData.find((s) => s.skill === "System Design")?.student ?? 0), 0, 100);
    const team = clamp(Number(skillData.find((s) => s.skill === "Team Projects")?.student ?? 0), 0, 100);
    const comm = clamp(Number(skillData.find((s) => s.skill === "Communication")?.student ?? 0), 0, 100);
    const full = clamp(Number(skillData.find((s) => s.skill === "Full Stack Dev")?.student ?? 0), 0, 100);
    const problem = clamp(Math.round(dsa * 0.55 + sys * 0.45), 0, 100);
    const lead = clamp(Math.round(comm * 0.75 + team * 0.25 - 6), 0, 100);

    let coding = dsa;
    let projects = team;
    if (title.includes("frontend")) {
      coding = clamp(Math.round(dsa * 0.45 + full * 0.55), 0, 100);
      projects = clamp(Math.round(team * 0.5 + full * 0.5), 0, 100);
    } else if (title.includes("backend")) {
      const db = clamp(Number(skillData.find((s) => s.skill === "Database Design")?.student ?? 0), 0, 100);
      coding = clamp(Math.round(dsa * 0.65 + db * 0.35), 0, 100);
      projects = clamp(Math.round(team * 0.55 + db * 0.45), 0, 100);
    } else if (title.includes("data") || title.includes("ml")) {
      coding = clamp(Math.round(dsa * 0.6 + full * 0.2 + sys * 0.2), 0, 100);
    } else if (title.includes("devops") || title.includes("cloud")) {
      coding = clamp(Math.round(sys * 0.55 + dsa * 0.45), 0, 100);
      projects = clamp(Math.round(team * 0.6 + sys * 0.4), 0, 100);
    } else if (title.includes("qa") || title.includes("test")) {
      coding = clamp(Math.round(dsa * 0.5 + comm * 0.5), 0, 100);
      projects = clamp(Math.round(team * 0.65 + dsa * 0.35), 0, 100);
    }

    const rows = [
      { skill: "Coding", current: coding, required: required[0], category: "Technical" },
      { skill: "Projects", current: projects, required: required[1], category: "Experience" },
      { skill: "Communication", current: comm, required: required[2], category: "Soft Skills" },
      { skill: "Problem Solving", current: problem, required: required[3], category: "Technical" },
      { skill: "System Design", current: sys, required: required[4], category: "Technical" },
      { skill: "Teamwork", current: team, required: required[5], category: "Soft Skills" },
      { skill: "Leadership", current: lead, required: required[6], category: "Soft Skills" },
    ];
    return rows.map((r) => ({
      ...r,
      current: Math.round(clamp(r.current, 0, 100)),
      required: Math.round(clamp(r.required, 0, 100)),
    }));
  })();


  // AI-Powered Recommendations (dynamic from roadmap API when available)
  const recommendations = (() => {
    const llmRecs = Array.isArray(roadmapData?.computed?.llmRecommendations) ? roadmapData.computed.llmRecommendations : [];
    if (llmRecs.length > 0) {
      return llmRecs.map((r: any) => ({
        title: r?.title || "Personalized action",
        description: r?.description || "Generated from your profile and resume signals.",
        source: "LLM Mentor",
        priority: r?.priority || "high",
        impact: r?.impact || "Medium",
        estimatedTime: r?.estimatedTime || "2 weeks",
        category: r?.category || "skills",
        resources: [],
        completion: Number(r?.completion ?? 15),
        actions: [],
      }));
    }

    const focus = Array.isArray(roadmapData?.computed?.summary?.focus) ? roadmapData.computed.summary.focus : [];
    const tasks30 = Array.isArray(roadmapData?.computed?.roadmap?.next30Days) ? roadmapData.computed.roadmap.next30Days : [];

    const categoryPriority = (category: string) => {
      const c = String(category || "").toLowerCase();
      if (c.includes("academics") || c.includes("aptitude") || c.includes("coding")) return "critical";
      if (c.includes("interview") || c.includes("skills")) return "high";
      return "medium";
    };

    const focusGapByKey = new Map<string, number>((focus || []).map((f: any) => [String(f?.key || ""), Number(f?.score || 0)]));

    if (tasks30.length > 0) {
      return tasks30.slice(0, 4).map((t: any) => {
        const category = String(t?.category || "general");
        const gap = focusGapByKey.get(category) ?? 55;
        const completion = Math.max(10, Math.min(80, 100 - Math.round(gap)));
        const effort = Number(t?.effortHours || 0);
        const estimatedTime =
          effort >= 40 ? "6 weeks" :
            effort >= 24 ? "4 weeks" :
              effort >= 12 ? "2 weeks" : "1 week";

        return {
          title: t?.title || "Recommended action",
          description: t?.reason || "Action generated from your current resume/profile gaps.",
          source: "AI Insight",
          priority: categoryPriority(category),
          impact: gap >= 70 ? "High" : gap >= 45 ? "Medium" : "Low",
          estimatedTime,
          category,
          resources: [],
          completion,
          actions: [],
        };
      });
    }

    return [
      {
        title: "Build your next resume-backed project milestone",
        description: "Convert one current skill gap into a demonstrable project artifact this month.",
        source: "AI Insight",
        priority: "high",
        impact: "High",
        estimatedTime: "2 weeks",
        category: "portfolio",
        resources: [],
        completion: 15,
        actions: []
      }
    ];
  })();

  const mentorshipSummary = (() => {
    const llmRecs = Array.isArray(roadmapData?.computed?.llmRecommendations) ? roadmapData.computed.llmRecommendations : [];
    if (llmRecs.length > 0) {
      const priorities = llmRecs.map((r: any) => String(r?.priority || "")).filter(Boolean);
      const criticalCount = priorities.filter((p: string) => p === "critical").length;
      const focusText = llmRecs.slice(0, 2).map((r: any) => r?.title).filter(Boolean).join(" + ");
      return criticalCount > 0
        ? `LLM identified ${criticalCount} critical area(s). Start with: ${focusText}.`
        : `LLM suggests highest-impact next steps: ${focusText}.`;
    }
    const focus = Array.isArray(roadmapData?.computed?.summary?.focus) ? roadmapData.computed.summary : null;
    if (focus?.focus?.length) {
      const top = focus.focus[0];
      return `Current top gap is ${top?.title || "readiness"} — improve this first for maximum placement impact.`;
    }
    return "Update your scores and generate plan to get a personalized summary.";
  })();

  // Timeline & Milestones (resume-driven)
  const timeline = (() => {
    const iconBySource: Record<string, any> = {
      education: GraduationCap,
      experience: Briefcase,
      project: Code,
      certification: Award,
      achievement: Trophy,
    };
    const colorBySource: Record<string, string> = {
      education: "bg-blue-500",
      experience: "bg-green-500",
      project: "bg-purple-500",
      certification: "bg-orange-500",
      achievement: "bg-pink-500",
    };

    if (normalizedResumeTimeline.length > 0) {
      return normalizedResumeTimeline.slice(-8).map((item: any, idx: number, arr: any[]) => {
        const Icon = iconBySource[item.source] || BookOpen;
        const color = colorBySource[item.source] || "bg-indigo-500";
        const status = idx === arr.length - 1 ? "in-progress" : "completed";
        const dateLabel = `${MONTHS[item.date.getMonth()]} ${item.date.getFullYear()}`;
        return {
          date: dateLabel,
          event: item.title.length > 90 ? `${item.title.slice(0, 90)}...` : item.title,
          type: item.source,
          status,
          icon: Icon,
          color,
        };
      });
    }

    return [
      {
        date: "Resume Pending",
        event: "Upload resume to unlock timeline",
        type: "resume",
        status: "planned",
        icon: Upload,
        color: "bg-slate-500",
      }
    ];
  })();

  // Placement drives from TPO — fetched from API and shown under Opportunities
  const initialJobsCache = readDashboardCache<{ jobs: any[] }>(DASHBOARD_CACHE_KEYS.studentJobs);
  const [placementDrives, setPlacementDrives] = useState<any[]>(() => initialJobsCache?.jobs ?? []);
  const [loadingDrives, setLoadingDrives] = useState(() => !initialJobsCache);
  const [appliedJobMap, setAppliedJobMap] = useState<Record<number, string>>({});
  const [selectedDrive, setSelectedDrive] = useState<StudentPlacementDrive | null>(null);
  const [driveDialogOpen, setDriveDialogOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const data = await studentApi.getApplications();
      const map: Record<number, string> = {};
      for (const app of data.applications || []) {
        if (app.job_id) map[app.job_id] = app.application_status || "APPLIED";
      }
      setAppliedJobMap(map);
    } catch (e) {
      console.error("fetchApplications failed", e);
    }
  }, []);

  const fetchDrives = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent && !readDashboardCache(DASHBOARD_CACHE_KEYS.studentJobs)) {
      setLoadingDrives(true);
    }
    try {
      const data = await studentApi.getJobs();
      const jobs = data.jobs || [];
      setPlacementDrives(jobs);
      writeDashboardCache(DASHBOARD_CACHE_KEYS.studentJobs, { jobs });
    } catch (e) {
      console.error("fetchDrives failed", e);
    } finally {
      setLoadingDrives(false);
    }
  }, []);

  useEffect(() => {
    if (!backendProfile) return;
    const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.studentJobs);
    fetchDrives({ silent: !!cached });
    fetchApplications();
  }, [backendProfile, fetchDrives, fetchApplications]);

  const manualRefresh = useManualRefresh(async () => {
    if (!backendProfile) return;
    await Promise.all([
      fetchMarqueeData({ silent: true }),
      fetchDrives({ silent: true }),
      fetchApplications(),
      fetchRoadmap({ silent: true }),
      refreshUser(),
    ]);
    setLastSyncedAt(Date.now());
    toast.success("Dashboard data refreshed.");
  });

  useEffect(() => {
    if (backendProfile && !loadingMarquee && !loadingDrives && !loadingRoadmap) {
      setLastSyncedAt((prev) => prev ?? Date.now());
    }
  }, [backendProfile, loadingMarquee, loadingDrives, loadingRoadmap]);

  const drivesWithMatch = placementDrives.map((d, idx) => {
    const requiredSkills = Array.isArray(d.required_skills)
      ? d.required_skills
      : Array.isArray(d.requirements)
        ? d.requirements
        : [];

    const deadlineLabel = d.deadline_note
      || (d.end_date ? new Date(d.end_date).toLocaleDateString() : "TBD");

    return {
      ...d,
      id: d.job_id,
      companyName: d.company_name,
      role: d.job_title,
      description: d.job_description,
      job_description: d.job_description,
      drive_description: d.drive_description,
      drive_name: d.drive_name,
      requirements: requiredSkills,
      required_skills: requiredSkills,
      eligible_branches: Array.isArray(d.eligible_branches) ? d.eligible_branches : [],
      application_link: d.application_link,
      dos: d.dos,
      donts: d.donts,
      deadline: deadlineLabel,
      deadline_note: d.deadline_note,
      start_date: d.start_date,
      schedule_note: d.schedule_note,
      activity_schedule: d.activity_schedule,
      stipend_value: d.stipend_value,
      website: d.website,
      location: d.location,
      application_status: appliedJobMap[d.job_id] ?? null,
      job_type: d.job_type || "PLACEMENT",
      color: [
        "bg-gradient-to-br from-blue-500 to-green-500",
        "bg-gradient-to-br from-orange-500 to-yellow-500",
        "bg-gradient-to-br from-blue-600 to-green-600",
        "bg-gradient-to-br from-blue-400 to-blue-600",
        "bg-gradient-to-br from-purple-500 to-pink-500",
      ][idx % 5],
    };
  });

  const openDriveDialog = (drive: StudentPlacementDrive) => {
    setSelectedDrive(drive);
    setDriveDialogOpen(true);
  };

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

  // Quick Actions
  const quickActions = [
    {
      title: "Start Practice",
      description: "Solve coding problems",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      action: () => {
        setActiveTab("company-kit");
        navigate("/student/dashboard?tab=company-kit");
      }
    },
    {
      title: "Resources",
      description: "Practice & prep",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      action: () => {
        setActiveTab("assessment-hub");
        navigate("/student/dashboard?tab=assessment-hub");
      }
    },
    {
      title: "View Drives",
      description: "Placement drives from TPO",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      action: () => {
        setActiveTab("opportunities");
        navigate("/student/dashboard?tab=opportunities");
      }
    },
    {
      title: "Study Plan",
      description: "Generate roadmap",
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      action: () => {
        setActiveTab("learning");
        navigate("/student/dashboard?tab=learning");
      }
    }
  ];

  const unclearedMarqueeItems = marqueeItems.filter((i) => !clearedNotifIds.has(i.id));
  const bellItems = [...systemNotificationItems, ...unclearedMarqueeItems];

  // Upcoming Tasks (roadmap-driven)
  const upcomingTasks = (() => {
    const tasks7 = Array.isArray(roadmapData?.computed?.roadmap?.next7Days) ? roadmapData.computed.roadmap.next7Days : [];
    if (tasks7.length > 0) {
      return tasks7.slice(0, 6).map((t: any) => {
        const effort = Number(t?.effortHours || 0);
        return {
          task: String(t?.title || "Recommended task"),
          due: effort >= 12 ? "This week" : effort >= 6 ? "3 days" : "Tomorrow",
          priority: effort >= 10 ? "high" : "medium",
          status: "pending",
        };
      });
    }
    const projects = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const skills = currentSkills.length + previousSkills.length;
    const backlogTask = projects < 2 ? "Build one more project and update resume" : "Revise recent projects for interviews";
    return [
      { task: backlogTask, due: "This week", priority: "high", status: "pending" },
      { task: skills < 8 ? "Add 3 core skills from your learning this week" : "Practice skill-based interview questions", due: "3 days", priority: "medium", status: "in-progress" },
    ];
  })();

  const performanceSummaryCards = (() => {
    const projectCount = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const expCount = Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0;
    const certCount = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0;
    const technicalDelta = Math.max(1, Math.round(dynamic.skillsMastered / 10));
    const softDelta = Math.max(1, Math.round((skillData.find((s) => s.skill === "Communication")?.student || 0) / 14));
    const overallDelta = Math.max(1, Math.round((dynamic.overallReadiness - 50) / 4));
    const solvedEstimate = Math.round(projectCount * 18 + expCount * 14 + certCount * 8 + (currentSkills.length + previousSkills.length) * 2);
    return [
      { value: `${overallDelta >= 0 ? "+" : ""}${overallDelta}%`, label: "Overall improvement", tone: "blue" },
      { value: `+${technicalDelta}%`, label: "Technical Skills", tone: "green" },
      { value: `+${softDelta}%`, label: "Soft Skills", tone: "purple" },
      { value: String(Math.max(0, solvedEstimate)), label: "Problems Solved (estimated)", tone: "amber" },
    ];
  })();

  // Weekly Goals
  const weeklyGoals = [
    { task: "Complete 20 LeetCode Problems", completed: 15, total: 20, priority: "high" },
    { task: "Finish System Design Course Module 3", completed: 2, total: 5, priority: "high" },
    { task: "Update Resume with Recent Project", completed: 0, total: 1, priority: "medium" },
    { task: "Practice 3 Mock Interviews", completed: 1, total: 3, priority: "medium" },
  ];

  // Sidebar sections group STUDENT_SIDEBAR_LINKS (see dashboard/sidebarConfig.ts)
  const sidebarLinks = STUDENT_SIDEBAR_LINKS;

  const sidebarSections: Array<{ title: string; ids: Array<(typeof sidebarLinks)[number]["id"]> }> = [
    { title: "PROFILE TRACKER", ids: ["overview", "announcements", "skills", "internships"] },
    { title: "OPPORTUNITIES", ids: ["opportunities", "learning"] },
    { title: "RESOURCES", ids: ["careers", "webinars", "corporateNews"] },
    { title: "PRACTICE & PREP", ids: ["assessment-hub", "company-kit"] },
    { title: "COMMUNITY", ids: ["feedback"] },
  ];

  return (
    <div className={`relative flex h-dvh max-h-dvh min-h-0 overflow-hidden ${isDark ? "bg-[#0c0c14]" : "bg-background"} font-manrope text-foreground selection:bg-blue-500/30`}>
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
        <SheetContent side="left" className={`${isDark ? "bg-[#0c0c14]" : "bg-white"} w-[min(18rem,calc(100vw-1rem))] max-w-full p-0 [&>button]:hidden`}>
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
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${isActive
                            ? isDark
                              ? "bg-white/10 text-blue-300"
                              : "bg-blue-50 text-blue-700"
                            : isDark
                              ? "text-slate-300 hover:bg-white/10"
                              : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? (isDark ? "text-blue-300" : "text-blue-700") : (isDark ? "text-slate-400" : "text-slate-500")}`} />
                            <span className="font-semibold text-sm">{link.label}</span>
                          </div>
                          {link.id === "announcements" && marqueeItems.filter(i => !clearedNotifIds.has(i.id)).length > 0 && (
                            <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                              {marqueeItems.filter(i => !clearedNotifIds.has(i.id)).length}
                            </span>
                          )}
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
                onClick={() => void performClientLogout(navigate)}
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
      <aside className={`relative z-50 hidden h-dvh max-h-dvh shrink-0 flex-col overflow-visible transition-all duration-500 lg:sticky lg:top-0 lg:flex ${isSidebarOpen ? "w-56" : "w-[5.5rem]"} ${isSidebarOpen ? "p-3 pr-2" : "p-2.5"} bg-transparent`}>
        <div className={`flex-1 min-w-0 h-full ${isDark ? "bg-[#0c0c14]" : "bg-white"} ${isDark ? "border-white/10" : "border-slate-200"} rounded-[2.5rem] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden relative`}>
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-blue-500/5" : "from-blue-500/5"} via-transparent ${isDark ? "to-purple-500/5" : "to-purple-500/5"} opacity-50 pointer-events-none`}></div>

          {/* Header: brand logo & name */}
          <div className={`flex items-center gap-0 relative z-10 transition-all flex-shrink-0 ${isSidebarOpen ? "px-4 pt-5 pb-3.5" : "p-2.5 py-5 justify-center"}`}>
            <div
              className="group cursor-pointer flex items-center gap-0"
              onClick={() => navigate("/")}
              title="NextGen Career Hub"
            >
              <img
                src="/NG/NextGen_light.png"
                alt="NextGen Logo"
                className={`${isSidebarOpen ? "h-12 w-12" : "h-10 w-10"} object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110`}
              />
              {isSidebarOpen && (
                <div className="min-w-0 animate-fadeIn overflow-hidden flex flex-col justify-center">
                  <div className="font-black text-[1.7rem] tracking-tighter leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NextGen
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"} opacity-80 whitespace-nowrap`}>
                    AI-Driven
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 min-w-0 flex flex-col overflow-y-auto sidebar-scrollbar pt-1 ${isSidebarOpen ? "px-2.5 pr-2" : "px-1.5"}`}>
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
                      <motion.button
                        key={link.id}
                        onClick={() => {
                          setActiveTab(link.id);
                          navigate(`/student/dashboard?tab=${link.id}`);
                        }}
                        title={link.label}
                        whileTap={{ scale: 0.93 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`w-full flex items-center gap-3 rounded-xl transition-colors duration-200 relative flex-shrink-0 ${!isSidebarOpen ? "justify-center p-3" : "px-3 py-2.5"} ${isActive
                          ? isDark
                            ? "bg-blue-500/20 ring-1 ring-blue-400/40 text-blue-200"
                            : "bg-blue-100 ring-1 ring-blue-200 text-blue-800"
                          : isDark
                            ? "text-slate-300 hover:bg-white/10"
                            : "text-slate-700 hover:bg-slate-100"
                          }`}
                      >
                        <motion.span
                          animate={isActive ? { rotate: [0, -12, 12, -6, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.45, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                        <Icon className={`transition-colors ${isSidebarOpen ? "w-5 h-5" : "w-6 h-6"} ${isActive ? (isDark ? "text-blue-300" : "text-blue-700") : (isDark ? "text-slate-400" : "text-slate-500")}`} />
                        </motion.span>
                        {isSidebarOpen && <span className="font-semibold text-sm whitespace-nowrap">{link.label}</span>}
                        {marqueeItems.filter(i => !clearedNotifIds.has(i.id)).length > 0 && (
                          <span className={`absolute ${!isSidebarOpen ? "top-1.5 right-1.5" : "right-3"} flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-black bg-red-500 text-white shadow-md ${link.id === "announcements" ? "animate-pulse" : "hidden"}`}>
                            {marqueeItems.filter(i => !clearedNotifIds.has(i.id)).length}
                          </span>
                        )}
                        {isSidebarOpen && isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className={`absolute left-0 w-1 h-6 rounded-r-full ${isDark ? "bg-blue-400" : "bg-blue-600"}`}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
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
          className={`absolute top-6 -right-12 z-[60] h-10 w-10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isDark
            ? "text-slate-400 hover:text-white hover:bg-white/10"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
        className={`flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar relative bg-transparent ${activeTab === "company-kit" ? "flex flex-col pt-6 sm:pt-8 lg:pt-10" : "p-4 sm:p-6 lg:p-8"}`}
      >
        <div className={`w-full max-w-[1400px] mx-auto ${activeTab === "company-kit" ? "flex flex-col space-y-4 sm:space-y-5 min-h-0 px-4 sm:px-6 lg:px-8" : "space-y-4 sm:space-y-5 lg:space-y-8"}`}>

          {/* Important Announcements Marquee — always visible when there are important items */}
          {!loadingMarquee && marqueeItems.filter(i => i.isImportant && !clearedNotifIds.has(i.id)).length > 0 && (
            <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-red-500/30 bg-red-500/5" : "border-red-200 bg-red-50"} flex items-center gap-3 pr-3 relative`}>
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white relative z-10">
                <motion.span
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                  className="text-base"
                >
                  🔔
                </motion.span>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Important</span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden py-3">
                <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
                  {[...marqueeItems.filter(i => i.isImportant && !clearedNotifIds.has(i.id)), ...marqueeItems.filter(i => i.isImportant && !clearedNotifIds.has(i.id))].map((item, idx) => (
                    <span key={`${item.id}-${idx}`} className={`inline-flex items-center gap-2 mr-16 text-sm font-semibold ${isDark ? "text-red-200" : "text-red-800"}`}>
                      <span className="text-base">📢</span>
                      {item.text.replace(/^(?:📢|📅)\s*/, '')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative z-10 bg-inherit pl-2">

                <Button
                  onClick={() => {
                    const importantItems = marqueeItems.filter(i => i.isImportant && !clearedNotifIds.has(i.id));
                    setClearedNotifIds(prev => {
                      const next = new Set(prev);
                      importantItems.forEach(item => next.add(item.id));
                      localStorage.setItem("cleared-notif-ids", JSON.stringify(Array.from(next)));
                      return next;
                    });
                    toast.success("Important alerts cleared");
                  }}
                  variant="ghost"
                  className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider ${isDark ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-200 text-red-700"}`}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Slim Smart Announcement Banner (overview tab) */}
          {activeTab === "overview" && !loadingMarquee && marqueeItems.filter(i => !i.isImportant && !clearedNotifIds.has(i.id)).length > 0 && (
            <div className={`rounded-2xl border transition-all duration-300 ${isDark ? "border-blue-500/20 bg-blue-500/5" : "border-blue-100 bg-blue-50/50"} p-4 flex items-center justify-between gap-4 mb-4 shadow-sm relative overflow-hidden`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0 text-base">📢</span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {marqueeItems.filter(i => !i.isImportant && !clearedNotifIds.has(i.id))[0]?.text.replace(/^(?:📢|📅)\s*/, '')}
                  </p>
                  {marqueeItems.filter(i => !i.isImportant && !clearedNotifIds.has(i.id)).length > 1 && (
                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"} font-medium`}>
                      and {marqueeItems.filter(i => !i.isImportant && !clearedNotifIds.has(i.id)).length - 1} other update(s) on the Notice Board
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => {
                    setActiveTab("announcements");
                    navigate("/student/dashboard?tab=announcements");
                  }}
                  variant="ghost"
                  className={`h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider ${isDark ? "hover:bg-white/10 text-blue-400" : "hover:bg-slate-200 text-blue-700"}`}
                >
                  View All
                </Button>
                <button
                  onClick={() => toggleNotificationRead(marqueeItems.filter(i => !i.isImportant && !clearedNotifIds.has(i.id))[0]?.id)}
                  className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-slate-200" : "hover:bg-slate-200 text-slate-500 hover:text-slate-800"}`}
                  title="Dismiss"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border`}>
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse" />
                <Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'} relative z-10`} />
              </div>
              <div className="text-center space-y-2">
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Loading Dashboard</h3>
                <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Synchronizing profile data...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab !== "company-kit" && (
                <header className={`flex items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 lg:pl-16`}>

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
                    {(() => {
                      const currentLink = sidebarLinks.find(l => l.id === activeTab);
                      const pageTitle = activeTab === "skills" ? "Skills & Achievements" : (currentLink?.label || activeTab);
                      const pageSubtitle = currentLink?.subtitle || "";
                      return (
                        <div className="min-w-0">
                          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"} tracking-tight leading-tight`}>
                            {pageTitle}
                          </h1>
                          {pageSubtitle && (
                            <p className={`text-xs sm:text-sm font-medium mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"} tracking-wide`}>
                              {pageSubtitle}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                  </div>

                  {/* Premium Header Controls - Relocated for better accessibility */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <DashboardSyncBar
                      lastSyncedAt={lastSyncedAt}
                      isSyncing={manualRefresh.isRefreshing}
                      canRefresh={manualRefresh.canRefresh}
                      refreshLabel={manualRefresh.label}
                      onRefresh={() => void manualRefresh.refresh()}
                    />
                    
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
                        className={`hidden sm:flex h-11 px-4 lg:px-6 rounded-2xl font-bold text-xs uppercase tracking-wider gap-2 transform transition-all hover:scale-105 active:scale-95 shrink-0 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}
                      >
                        <span>Company Wise Kit</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      </Button>
                    )}

                    {/* Edit Pencil icon button in top navbar for internships tab */}
                    {activeTab === "internships" && (
                      <button
                        type="button"
                        onClick={() => setIsEditingInternships(!isEditingInternships)}
                        title={isEditingInternships ? "Done Editing" : "Edit Details"}
                        className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-all transform hover:scale-105 active:scale-95 shrink-0 ${
                          isEditingInternships
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : isDark
                            ? "bg-white/5 border-white/10 text-blue-400 hover:bg-white/10"
                            : "bg-white border-slate-200 text-blue-600 shadow-sm"
                        }`}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    )}

                    <div className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}>
                      <ThemeToggle className="!h-10 !w-10 !rounded-xl border-0 bg-transparent hover:bg-transparent" />
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          className={`h-11 w-11 flex items-center justify-center rounded-2xl border transition-all relative group ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50"}`}
                        >
                          <motion.div
                            animate={bellItems.length > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                            transition={{ duration: 0.6, delay: 0.4, repeat: Infinity, repeatDelay: 5 }}
                          >
                            <Bell className="w-5 h-5" />
                          </motion.div>
                          {bellItems.length > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background"
                            >
                              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-70" />
                            </motion.div>
                          )}
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={12} className={`w-[min(22rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] p-0 rounded-[2rem] overflow-hidden border-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:w-[390px] sm:max-w-none ${isDark ? "bg-[#0c0c14]" : "bg-white"}`}>
                        {/* Header */}
                        <div className={`p-5 border-b ${isDark ? "border-white/5" : "border-slate-100"} flex items-center justify-between`}>
                          <div>
                            <h3 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"} tracking-tight`}>Notifications</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                              {bellItems.length > 0 ? `${bellItems.length} new update${bellItems.length > 1 ? "s" : ""}` : "All caught up!"}
                            </p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"}`}>
                            <Bell className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                          </div>
                        </div>

                        {/* Notification items */}
                        <div className="p-3 space-y-2 max-h-[360px] overflow-y-auto">
                          {bellItems.length === 0 ? (
                            <div className={`text-center py-10 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                              <p className="text-sm font-semibold">No new notifications</p>
                              <p className="text-xs mt-1 opacity-60">You're all caught up!</p>
                            </div>
                          ) : (
                            bellItems.map((item, idx) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                onClick={() => item.type === "system" ? void toggleNotificationRead(item.id) : undefined}
                                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${item.type === "system" ? "cursor-pointer" : "cursor-default"} ${item.type === "event"
                                    ? isDark ? "bg-purple-500/5 border-purple-500/15" : "bg-purple-50 border-purple-100"
                                    : item.type === "system"
                                      ? isDark ? "bg-emerald-500/5 border-emerald-500/15" : "bg-emerald-50 border-emerald-100"
                                    : isDark ? "bg-blue-500/5 border-blue-500/15" : "bg-blue-50 border-blue-100"
                                  }`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${item.type === "event"
                                    ? isDark ? "bg-purple-500/20" : "bg-purple-100"
                                    : item.type === "system"
                                      ? isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                                    : isDark ? "bg-blue-500/20" : "bg-blue-100"
                                  }`}>
                                  {item.type === "event" ? "📅" : item.type === "system" ? "🔔" : "📢"}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-black uppercase tracking-wider mb-0.5 ${item.type === "event"
                                      ? isDark ? "text-purple-400" : "text-purple-600"
                                      : item.type === "system"
                                        ? isDark ? "text-emerald-400" : "text-emerald-600"
                                      : isDark ? "text-blue-400" : "text-blue-600"
                                    }`}>
                                    {item.type === "event" ? "Upcoming Event" : item.type === "system" ? "Placement Update" : "Announcement"}
                                  </p>
                                  <p className={`text-sm font-semibold leading-snug ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                                    {item.text.replace(/^(📅 Upcoming Event: |📢 )/, "")}
                                  </p>
                                </div>
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === "event" ? "bg-purple-500" : item.type === "system" ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`} />
                              </motion.div>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        <div className={`p-4 border-t ${isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50"} flex items-center justify-between`}>
                          <button
                            onClick={() => {
                              setActiveTab("announcements");
                              navigate("/student/dashboard?tab=announcements");
                            }}
                            className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} transition-colors`}
                          >
                            View Notice Board →
                          </button>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                            {bellItems.length} total
                          </span>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div onMouseEnter={handleProfileMouseEnter} onMouseLeave={handleProfileMouseLeave}>
                      <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen} modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-2.5 focus:outline-none group">
                            <div className="relative">
                              <Avatar className={`w-10 h-10 rounded-2xl border-2 transition-all group-hover:border-blue-500/50 ${isDark ? "border-white/10" : "border-white shadow-md shadow-slate-200/50"}`}>
                                <AvatarImage src={studentProfile.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs">{studentProfile.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${isDark ? "border-[#0c0c14]" : "border-white"} bg-green-500 shadow-sm`} />
                            </div>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          side="left"
                          align="start" 
                          sideOffset={16} 
                          onMouseEnter={handleProfileMouseEnter} 
                          onMouseLeave={handleProfileMouseLeave}
                          className={`w-56 p-1.5 rounded-2xl animate-in fade-in zoom-in-95 duration-200 border ${isDark ? "bg-[#0c0c14]/90 backdrop-blur-2xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white" : "bg-white/90 backdrop-blur-2xl border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.1)] text-slate-900"}`}
                        >
                          <DropdownMenuLabel className="p-0 mb-1.5">
                            <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"}`}>
                              <Avatar className="w-9 h-9 rounded-lg shadow-inner border border-white/10">
                                <AvatarImage src={studentProfile.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm shadow-inner">{studentProfile.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0 text-left justify-center">
                                <span className={`font-bold text-[13px] tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>{studentProfile.name}</span>
                                <span className={`text-[11px] truncate font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{studentProfile.email}</span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className={`${isDark ? "bg-white/10" : "bg-slate-100"} -mx-1.5 my-1.5`} />
                          <DropdownMenuGroup className="space-y-0.5">
                            <DropdownMenuItem onClick={() => navigate("/student/setting")} className={`rounded-xl flex items-center gap-2.5 p-2 transition-all cursor-pointer ${isDark ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-slate-100 focus:bg-slate-100"}`}>
                              <div className={`w-7 h-7 rounded-lg ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"} flex items-center justify-center shadow-inner`}>
                                <Settings className="w-3.5 h-3.5" />
                              </div>
                              <span className={`font-semibold text-[13px] ${isDark ? "text-white" : "text-slate-900"}`}>Account Settings</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator className={`${isDark ? "bg-white/10" : "bg-slate-100"} -mx-1.5 my-1.5`} />
                          <DropdownMenuItem onClick={() => void performClientLogout(navigate)} className={`rounded-xl flex items-center gap-2.5 p-2 transition-all cursor-pointer group/signout ${isDark ? "hover:bg-red-500/10 focus:bg-red-500/10 text-red-400" : "hover:bg-red-50 focus:bg-red-50 text-red-600"}`}>
                            <div className={`w-7 h-7 rounded-lg ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"} flex items-center justify-center transition-colors group-hover/signout:bg-red-500/20 group-hover/signout:text-red-500 shadow-inner`}>
                              <LogOut className="w-3.5 h-3.5" />
                            </div>
                            <span className={`font-bold text-[13px] ${isDark ? "text-red-400" : "text-red-600"}`}>Sign Out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </header>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full flex-1 flex flex-col min-h-0"
                >
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Hero Welcome Card — staggered entrance */}
                      <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative group`}>
                        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${isDark ? "bg-blue-500/5" : "bg-blue-500/5"} rounded-full -mr-80 -mt-80 blur-[150px] pointer-events-none`}></div>
                        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? "bg-purple-500/5" : "bg-purple-500/5"} rounded-full -ml-60 -mb-60 blur-[100px] pointer-events-none`}></div>

                        <CardContent className="p-5 sm:p-6">
                          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 relative z-10">
                            <div className="flex-1">
                              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} mb-2 sm:mb-3 tracking-tight leading-tight`}>
                                Welcome back,<br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {studentProfile.name.split(' ')[0]}! 👋
                                </span>
                              </h2>
                              <p className={`${isDark ? "text-blue-100/80" : "text-slate-600"} text-base sm:text-lg font-medium mb-4 sm:mb-5 max-w-2xl leading-relaxed`}>
                                Your current readiness status is{" "}
                                <span className={`font-extrabold px-3 py-1 rounded-lg transition-all ${dynamic.overallReadiness >= 75
                                  ? isDark ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-green-50 text-green-700 border border-green-200"
                                  : dynamic.overallReadiness >= 55
                                    ? isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200"
                                    : dynamic.overallReadiness >= 35
                                      ? isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-200"
                                      : isDark ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-700 border border-orange-200"
                                  }`}>
                                  {readinessStatusLabel}
                                </span>.
                                {" "}{readinessEncouragement}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <div className={`flex items-center gap-2 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-4 py-1.5 rounded-xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                                  <GraduationCap className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-blue-600"}`} />
                                  <span className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>{studentProfile.branch}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-4 py-1.5 rounded-xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                                  <Award className={`w-5 h-5 ${isDark ? "text-yellow-300" : "text-yellow-600"}`} />
                                  <span className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>GPA: {studentProfile.cgpa}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${isDark ? "bg-white/10" : "bg-gray-100"} backdrop-blur-md px-4 py-1.5 rounded-xl ${isDark ? "border-white/10" : "border-gray-200"}`}>
                                  <Target className={`w-5 h-5 ${isDark ? "text-green-300" : "text-green-600"}`} />
                                  <span className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>{studentProfile.year}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 w-full lg:w-fit">
                              <Button
                                onClick={() => setActiveTab("assessment-hub")}
                                className="h-10 px-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:opacity-90 font-black text-sm rounded-xl flex-1 shadow-md shadow-blue-500/30 gap-2 ring-2 ring-blue-500/20"
                              >
                                <Rocket className="w-5 h-5" />
                                Assessment Hub
                              </Button>
                              <Button
                                onClick={handleResumeClick}
                                disabled={uploadingResume}
                                className="
    h-10 px-5 flex-1 rounded-xl gap-2
    bg-indigo-600 text-white
    font-semibold text-sm
    transition-all duration-300
    hover:bg-indigo-700 hover:shadow-md
    hover:shadow-indigo-600/40
    active:scale-[0.97]
  "
                              >
                                {uploadingResume ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : resumeUploadState === "success" ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                                ) : (
                                  <UploadIcon className="w-5 h-5" />
                                )}
                                {uploadingResume
                                  ? "Uploading..."
                                  : resumeUploadState === "success"
                                    ? "Uploaded"
                                    : "Resume (PDF)"}
                              </Button>
                              <input
                                type="file"
                                ref={resumeInputRef}
                                onChange={onResumeFileChange}
                                accept=".pdf"
                                className="hidden"
                              />
                              {resumeUploadStatusText && (
                                <div
                                  className={`mt-2 text-xs font-bold ${resumeUploadState === "success"
                                    ? "text-green-400"
                                    : resumeUploadState === "error"
                                      ? "text-red-400"
                                      : "text-blue-300"
                                    }`}
                                >
                                  {resumeUploadStatusText}
                                </div>
                              )}

                            </div>
                          </div>
                        </CardContent>
                      </Card>



                      {/* Quick Stats Grid — staggered entrance */}
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                      >
                        {quickStats.map((stat, idx) => {
                          const Icon = stat.icon;
                          const pctNum = parseInt(stat.value) || 0;
                          const radius = 22;
                          const circumference = 2 * Math.PI * radius;
                          const strokeOffset = circumference - (pctNum / 100) * circumference;
                          return (
                            <motion.div
                              key={idx}
                              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } }}
                            >
                              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                                <CardContent className="p-4 sm:p-5 lg:p-6">
                                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                                      <svg className="stat-ring w-full h-full" viewBox="0 0 52 52">
                                        <circle cx="26" cy="26" r={radius} fill="none" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="3" />
                                        <circle cx="26" cy="26" r={radius} fill="none" stroke="url(#statGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeOffset} />
                                        <defs><linearGradient id="statGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
                                      </svg>
                                      <div className={`absolute inset-0 flex items-center justify-center`}>
                                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${stat.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                                          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${stat.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                      }`}>
                                      {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                                      {stat.change}
                                    </div>
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className={`text-[10px] sm:text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider leading-none opacity-80`}>{stat.label}</p>
                                    <p className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"} tracking-tight py-1 tabular-nums`}>{stat.value}</p>
                                    <p className={`text-[10px] sm:text-xs font-medium ${isDark ? "text-gray-400/60" : "text-gray-600/80"} tracking-wide`}>{stat.description}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      {/* Career Goal Panel + Quick Actions — staggered entrance */}
                      <motion.div
                        className="grid lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {/* Career Goal Panel */}
                        <div className="lg:col-span-2">
                          <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[3rem] overflow-hidden shadow-2xl`}>
                            <CardContent className="p-8 sm:p-9 space-y-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                  <p className={`text-xs font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-[0.24em] opacity-70`}>Current Direction Signal</p>
                                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                                    {roleRecommendation.title}
                                  </p>
                                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} font-semibold max-w-xl`}>
                                    Guidance hint from resume and skills.
                                  </p>
                                </div>
                                <div className={`${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-xl px-3 py-2.5 ${isDark ? "border-blue-500/20" : "border-blue-200"} flex items-center gap-3`}>
                                  <div className={`w-11 h-11 ${isDark ? "bg-white/5" : "bg-white"} rounded-lg flex items-center justify-center shadow-lg confidence-pulse-ring`}>
                                    <span className="text-sm font-black text-blue-500">{roleRecommendation.confidence}%</span>
                                  </div>
                                  <div>
                                    <p className={`text-[11px] font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Confidence</p>
                                    <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Use with your goals</p>
                                  </div>
                                </div>
                              </div>



                              <div className={`h-2 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden shadow-inner`}>
                                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full" style={{ width: `${roleRecommendation.confidence}%` }}></div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {roleSkillCards.map((item, i) => (
                                  <div key={i} className={`p-3 rounded-xl ${item.bg} ${isDark ? "border-white/5" : "border-gray-200"} border flex flex-col gap-0.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-default`}>
                                    <span className={`text-[11px] font-black ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>{item.label}</span>
                                    <span className={`${item.color} text-lg font-black`}>
                                      {item.score >= 75 ? "High" : item.score >= 55 ? "Medium" : "Building"}
                                    </span>
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
                                const accentColors: Record<string, string> = {
                                  "from-blue-500 to-blue-600": "#3b82f6",
                                  "from-purple-500 to-purple-600": "#8b5cf6",
                                  "from-green-500 to-green-600": "#22c55e",
                                  "from-orange-500 to-orange-600": "#f97316",
                                };
                                return (
                                  <button
                                    key={idx}
                                    onClick={action.action}
                                    className={`quick-action-card p-5 ${isDark ? "bg-[#0c0c14]/40 border-white/[0.06] hover:bg-white/[0.06]" : "bg-white/90 border-slate-200 hover:border-blue-200"} backdrop-blur-3xl rounded-2xl group hover:scale-[1.04] cursor-pointer text-left shadow-sm hover:shadow-xl hover:-translate-y-0.5`}
                                    style={{ "--accent-color": accentColors[action.color] || "#3b82f6" } as React.CSSProperties}
                                  >
                                    <div className={`w-11 h-11 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg mb-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                                      <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className={`text-sm font-black ${isDark ? "text-white group-hover:text-blue-300" : "text-gray-900 group-hover:text-blue-700"} mb-0.5 transition-colors duration-200`}>{action.title}</h4>
                                    <p className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"} font-medium flex items-center gap-1`}>
                                      {action.description}
                                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200" />
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === "skills" && (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        {/* Summary Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                          {[
                            {
                              label: "Total Skills",
                              value: currentSkills.length + previousSkills.length,
                              tone: isDark ? "from-blue-500/15 to-cyan-500/10 border-blue-500/20" : "from-blue-50 to-cyan-50 border-blue-200",
                            },
                            {
                              label: "Total Achievements",
                              value: currentAchievements.length + previousAchievements.length,
                              tone: isDark ? "from-amber-500/15 to-orange-500/10 border-amber-500/20" : "from-amber-50 to-orange-50 border-amber-200",
                            },
                            {
                              label: "Profile Completion",
                              value: `${Math.min(100, Math.round((((currentSkills.length >= 8 ? 1 : currentSkills.length / 8) * 0.6 + ((currentAchievements.length >= 3 ? 1 : currentAchievements.length / 3) * 0.4)) * 100)))}%`,
                              tone: isDark ? "from-green-500/15 to-emerald-500/10 border-green-500/20" : "from-green-50 to-emerald-50 border-green-200",
                            },
                          ].map((s) => (
                            <div key={s.label} className={`rounded-2xl border bg-gradient-to-br p-4 ${s.tone}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                              <p className={`mt-1 text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Edit Actions */}
                        <div className="flex shrink-0">
                          {!manualEditMode ? (
                            <Button onClick={() => setManualEditMode(true)} className="h-12 rounded-2xl font-black" variant="secondary">
                              Edit
                            </Button>
                          ) : (
                            <div className="flex gap-3">
                              <Button
                                onClick={resetToResumeOnly}
                                variant="outline"
                                className="h-12 rounded-2xl font-black border-dashed border-blue-500/50 text-blue-500 hover:bg-blue-500/5"
                              >
                                Sync with Resume
                              </Button>
                              <Button onClick={saveManualSkillsAndAchievements} disabled={savingManualProfile} className="h-12 rounded-2xl font-black">
                                {savingManualProfile ? "Saving..." : "Save Updates"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${isDark ? "border-white/10 bg-gradient-to-br from-white/10 via-white/[0.05] to-white/[0.02]" : "border-slate-200 bg-gradient-to-br from-white to-slate-50"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/15" : "bg-blue-100"}`}>
                                <Code className="h-4 w-4 text-blue-500" />
                              </div>
                              <p className={`text-base font-extrabold uppercase tracking-wide ${isDark ? "text-slate-100" : "text-slate-700"}`}>Skills</p>
                            </div>
                            <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                              {currentSkills.length}
                            </span>
                          </div>
                          <div className={`mt-4 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                          {manualEditMode && (
                            <div className="mt-4 flex gap-2">
                              <input
                                value={newSkillInput}
                                onChange={(e) => setNewSkillInput(e.target.value)}
                                placeholder="e.g., LangChain, SHAP, SQL"
                                className={`flex-1 h-11 px-4 rounded-xl text-sm font-semibold outline-none border transition-all ${isDark ? "bg-[#0c0c14]/60 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 shadow-sm"}`}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const raw = newSkillInput.trim();
                                  const v = cleanSkillToken(raw);
                                  if (!v) {
                                    toast.error("Please enter a valid skill.");
                                    return;
                                  }
                                  setNewSkillInput("");
                                  const isDuplicate = [...currentSkills, ...previousSkills].some((s) => s.toLowerCase() === v.toLowerCase());
                                  if (isDuplicate) return;
                                  setPendingSkills((prev) => [...prev, v]);
                                }}
                                className="h-11 rounded-xl font-black px-5"
                              >
                                Add
                              </Button>
                            </div>
                          )}

                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2.5">
                              {(manualEditMode || showAllSkillsCard
                                ? currentSkills
                                : currentSkills.slice(0, 3)
                              ).map((s: string) => (
                                <button
                                  type="button"
                                  key={s}
                                  onClick={() => { if (manualEditMode) removeSkill(s); }}
                                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${isDark ? "bg-white/10 border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-700"}`}
                                >
                                  {s} {manualEditMode && <span className="ml-2 text-red-500">×</span>}
                                </button>
                              ))}
                              {!manualEditMode && currentSkills.length > 3 && (
                                <button
                                  type="button"
                                  onClick={() => setShowAllSkillsCard(!showAllSkillsCard)}
                                  className={`px-3.5 py-2 rounded-full text-xs font-bold border border-dashed transition-all ${isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"}`}
                                >
                                  {showAllSkillsCard ? "Show Less" : `+${currentSkills.length - 3} more`}
                                </button>
                              )}
                              {currentSkills.length === 0 && !manualEditMode && (
                                <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No skills added yet.</p>
                              )}
                            </div>

                            {previousSkills.length > 0 && (
                              <div className="mt-6 pt-4 border-t border-dashed border-white/10">
                                <button
                                  onClick={() => setShowPreviousSkills(!showPreviousSkills)}
                                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 flex items-center gap-2 transition-colors"
                                >
                                  {showPreviousSkills ? "Hide" : "Show"} Previous Skills ({previousSkills.length})
                                </button>
                                <AnimatePresence>
                                  {showPreviousSkills && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {previousSkills.map((s: string) => (
                                          <div key={s} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${isDark ? "bg-white/5 border-white/5 text-slate-500" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                                            {s}
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${isDark ? "border-white/10 bg-gradient-to-br from-white/10 via-white/[0.05] to-white/[0.02]" : "border-slate-200 bg-gradient-to-br from-white to-slate-50"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${isDark ? "bg-amber-500/15" : "bg-amber-100"}`}>
                                <Trophy className="h-4 w-4 text-amber-500" />
                              </div>
                              <p className={`text-base font-extrabold uppercase tracking-wide ${isDark ? "text-slate-100" : "text-slate-700"}`}>Achievements</p>
                            </div>
                            <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                              {currentAchievements.length}
                            </span>
                          </div>
                          <div className={`mt-4 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                          {manualEditMode && (
                            <div className="mt-4 flex gap-2">
                              <input
                                value={newAchievementInput}
                                onChange={(e) => setNewAchievementInput(e.target.value)}
                                placeholder="e.g., 2nd Rank – 93.17% (HSC)"
                                className={`flex-1 h-11 px-4 rounded-xl text-sm font-semibold outline-none border transition-all ${isDark ? "bg-[#0c0c14]/60 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 shadow-sm"}`}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  const raw = newAchievementInput.trim();
                                  const v = cleanAchievementToken(raw);
                                  if (!v) {
                                    toast.error("Please enter a valid achievement.");
                                    return;
                                  }
                                  setNewAchievementInput("");
                                  const isDuplicate = [...currentAchievements, ...previousAchievements].some((a) => a.toLowerCase() === v.toLowerCase());
                                  if (isDuplicate) return;
                                  setPendingAchievements((prev) => [...prev, v]);
                                }}
                                className="h-11 rounded-xl font-black px-5"
                              >
                                Add
                              </Button>
                            </div>
                          )}

                          <div className="mt-4 space-y-3">
                            {currentAchievements.map((a: string) => (
                              <div key={a} className={`group relative p-4 rounded-2xl border transition-all ${isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                                <div className="flex gap-3">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  <p className="text-sm font-bold leading-relaxed">{a}</p>
                                </div>
                                {manualEditMode && (
                                  <button
                                    onClick={() => removeAchievement(a)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {currentAchievements.length === 0 && !manualEditMode && (
                              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No achievements added yet.</p>
                            )}

                            {previousAchievements.length > 0 && (
                              <div className="mt-6 pt-4 border-t border-dashed border-white/10">
                                <button
                                  onClick={() => setShowPreviousAchievements(!showPreviousAchievements)}
                                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-400 flex items-center gap-2 transition-colors"
                                >
                                  {showPreviousAchievements ? "Hide" : "Show"} Previous Achievements ({previousAchievements.length})
                                </button>
                                <AnimatePresence>
                                  {showPreviousAchievements && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="space-y-2 mt-3">
                                        {previousAchievements.map((a: string) => (
                                          <div key={a} className={`p-3 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/5 text-slate-500" : "bg-slate-50/50 border-slate-100 text-slate-400"}`}>
                                            <p className="text-[11px] font-medium italic opacity-70 line-clamp-2">{a}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 10x Feature: Market Readiness & Skill Gaps */}
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className={`lg:col-span-2 border-0 shadow-2xl ${isDark ? "bg-blue-500/5 border-blue-500/10" : "bg-blue-50/50 border-blue-100"}`}>
                          <CardContent className="p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-8">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black flex items-center gap-2">
                                  <Target className="w-5 h-5 text-blue-500" />
                                  Market Readiness Analysis
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium">Comparing your profile with institutional recruitment trends</p>
                              </div>
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-black">AI ANALYZED</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-500 opacity-80">
                                  {resumeParsed?.target_role ? `Missing for ${resumeParsed.target_role}` : "Trending Missing Skills"}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {(Array.isArray(resumeParsed?.missing_skills_for_target) && resumeParsed.missing_skills_for_target.length > 0
                                    ? resumeParsed.missing_skills_for_target.slice(0, 4)
                                    : ["Docker", "TypeScript", "AWS", "System Design"]).map((skill: string) => (
                                      <div key={skill} className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"} hover:border-blue-500/50 transition-all cursor-help`}>
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-sm font-bold">{skill}</span>
                                        <Plus className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                                      </div>
                                    ))}
                                </div>
                                <p className={`text-[11px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                  * These skills are mentioned in 80% of active high-package drives but missing from your resume.
                                </p>
                              </div>

                              <div className="space-y-6">
                                <p className="text-xs font-black uppercase tracking-widest text-green-500 opacity-80">Top Company Match</p>
                                <div className="space-y-4">
                                  {[
                                    { name: "eQ Technologic", match: 85, color: "bg-blue-500" },
                                    { name: "Google (SDE Intern)", match: 62, color: "bg-purple-500" },
                                    { name: "TCS Ninja", match: 98, color: "bg-green-500" }
                                  ].map(company => (
                                    <div key={company.name} className="space-y-2">
                                      <div className="flex justify-between items-center text-sm font-black">
                                        <span>{company.name}</span>
                                        <span className={company.match > 80 ? "text-green-500" : "text-blue-500"}>{company.match}%</span>
                                      </div>
                                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div className={`h-full ${company.color} transition-all duration-1000`} style={{ width: `${company.match}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={`border-0 shadow-2xl ${isDark ? "bg-purple-500/5" : "bg-purple-50/50"}`}>
                          <CardContent className="p-5 sm:p-6 space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-lg font-black leading-tight">Resume Optimization Score</h4>
                              </div>
                            </div>

                            <div className="flex items-end gap-2">
                              <span className="text-4xl font-black text-purple-500">74</span>
                              <span className="text-xl font-black text-muted-foreground mb-1">/100</span>
                            </div>

                            <ul className="space-y-3">
                              <li className="flex items-center gap-3 text-xs font-bold text-green-500">
                                <CheckCircle2 className="w-4 h-4" /> Strong project descriptions
                              </li>
                              <li className="flex items-center gap-3 text-xs font-bold text-orange-500">
                                <AlertCircle className="w-4 h-4" /> Achievements need quantifiable data
                              </li>
                            </ul>

                            <Button className="w-full h-11 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-xl">
                              OPTIMIZE RESUME
                            </Button>
                          </CardContent>
                        </Card>
                      </div>



                    </div>
                  )}

                  {/* Announcements notice board tab */}
                  {activeTab === "announcements" && (
                    <div className="space-y-6">
                      {/* Notice Board Page Header */}

                      {/* Filter Toolbar */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "all", label: "All Updates" },
                            { id: "important", label: "🔥 Important" },
                            { id: "announcements", label: "📢 Announcements" },
                            { id: "events", label: "📅 Events" }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setNoticeFilter(tab.id as any)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${noticeFilter === tab.id
                                  ? isDark
                                    ? "bg-blue-500/20 border-blue-400/40 text-blue-200 shadow-sm"
                                    : "bg-blue-100 border-blue-200 text-blue-800 shadow-sm"
                                  : isDark
                                    ? "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border w-full md:w-80 transition-all ${isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}>
                          <Search className="w-4 h-4 text-slate-500" />
                          <input
                            value={noticeSearch}
                            onChange={(e) => setNoticeSearch(e.target.value)}
                            placeholder="Search announcements..."
                            className="bg-transparent border-0 outline-none w-full text-sm font-semibold placeholder:text-slate-500 placeholder:font-medium"
                          />
                        </div>
                      </div>

                      {/* Notices List */}
                      {(() => {
                        const filteredItems = marqueeItems
                          .filter((item) => {
                            if (noticeFilter === "important") return item.isImportant;
                            if (noticeFilter === "announcements") return item.type === "announcement";
                            if (noticeFilter === "events") return item.type === "event";
                            return true;
                          })
                          .filter((item) =>
                            item.text.toLowerCase().includes(noticeSearch.toLowerCase())
                          );

                        return (
                          <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence mode="popLayout">
                              {filteredItems.map((item) => {
                                const isEvent = item.type === "event";
                                const isImportant = item.isImportant;
                                const isRead = clearedNotifIds.has(item.id);

                                // Visual theme for the card based on type/importance/read status
                                let cardTheme = "";
                                let iconContainerTheme = "";
                                let badgeTheme = "";
                                let badgeLabel = "";

                                if (isRead) {
                                  cardTheme = isDark
                                    ? "bg-[#131320]/25 border-white/5 text-slate-500 opacity-60 hover:border-white/10"
                                    : "bg-slate-50/40 border-slate-100 text-slate-400 opacity-60 hover:border-slate-200";
                                  iconContainerTheme = isDark
                                    ? "bg-white/5 text-slate-500"
                                    : "bg-slate-100 text-slate-400";
                                  badgeTheme = isDark
                                    ? "bg-white/5 text-slate-500 border border-white/5"
                                    : "bg-slate-100 text-slate-400 border border-slate-200/50";
                                  badgeLabel = isImportant
                                    ? "Important Notice (Read)"
                                    : isEvent
                                      ? "Placement Event (Read)"
                                      : "General Notice (Read)";
                                } else {
                                  cardTheme = isDark
                                    ? "bg-[#131320]/60 border-white/5 text-slate-100 hover:border-slate-800"
                                    : "bg-white border-slate-100 text-slate-800 hover:border-slate-300";
                                  iconContainerTheme = isDark
                                    ? "bg-slate-800/40 text-slate-300"
                                    : "bg-slate-100 text-slate-600";
                                  badgeTheme = isDark
                                    ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                    : "bg-slate-100 text-slate-600 border border-slate-200";
                                  badgeLabel = "General Notice";

                                  if (isImportant) {
                                    cardTheme = isDark
                                      ? "bg-red-500/5 border-red-500/20 text-slate-100 hover:border-red-500/35 shadow-red-950/10"
                                      : "bg-red-50/50 border-red-200 text-slate-800 hover:border-red-300 shadow-red-100/50";
                                    iconContainerTheme = isDark
                                      ? "bg-red-500/10 text-red-400"
                                      : "bg-red-100 text-red-600";
                                    badgeTheme = isDark
                                      ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                                      : "bg-red-100 text-red-600 border border-red-200";
                                    badgeLabel = "Important Notice";
                                  } else if (isEvent) {
                                    cardTheme = isDark
                                      ? "bg-purple-500/5 border-purple-500/20 text-slate-100 hover:border-purple-500/35"
                                      : "bg-purple-50/50 border-purple-200 text-slate-800 hover:border-purple-300";
                                    iconContainerTheme = isDark
                                      ? "bg-purple-500/10 text-purple-400"
                                      : "bg-purple-100 text-purple-600";
                                    badgeTheme = isDark
                                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                      : "bg-purple-100 text-purple-600 border border-purple-200";
                                    badgeLabel = "Placement Event";
                                  }
                                }

                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 25,
                                      layout: { duration: 0.2 }
                                    }}
                                    className={`rounded-[2rem] border p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-5 transition-all shadow-sm ${cardTheme}`}
                                  >
                                    <div className="flex items-start gap-4 min-w-0">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl ${iconContainerTheme}`}>
                                        {isImportant ? "🔥" : isEvent ? "📅" : "📢"}
                                      </div>
                                      <div className="min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${badgeTheme}`}>
                                            {badgeLabel}
                                          </span>
                                        </div>
                                        <p className={`text-base font-semibold leading-relaxed tracking-tight ${isDark ? "text-slate-100" : "text-slate-800"} ${isRead ? "line-through opacity-85" : ""}`}>
                                          {item.text.replace(/^(📅 Upcoming Event: |📢 )/, "")}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-start shrink-0">
                                      <Button
                                        onClick={() => toggleNotificationRead(item.id)}
                                        variant="outline"
                                        className={`h-10 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border ${isRead
                                            ? isDark
                                              ? "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                              : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                            : isImportant
                                              ? isDark
                                                ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                                                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300"
                                              : isDark
                                                ? "border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                                                : "border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                          }`}
                                      >
                                        {isRead ? (
                                          <>
                                            <Check className="w-4 h-4 text-green-500 animate-in zoom-in duration-200" />
                                            <span>Mark Unread</span>
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Mark as Read</span>
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </motion.div>
                                );
                              })}

                              {filteredItems.length === 0 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className={`text-center py-16 rounded-[2.5rem] border border-dashed ${isDark ? "border-white/10 bg-white/[0.01]" : "border-slate-200 bg-slate-50/50"
                                    }`}
                                >
                                  <Bell className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-30" />
                                  <h3 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-800"}`}>No updates found</h3>
                                  <p className={`text-sm mt-1.5 max-w-sm mx-auto ${isDark ? "text-slate-400" : "text-slate-500"} font-medium`}>
                                    {noticeSearch
                                      ? "Try searching for another keyword or check active filters."
                                      : "You are all caught up! There are no new announcements."}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Internships Tab (Resume-driven) */}
                  {activeTab === "internships" && (
                    <Internships
                      isDark={isDark}
                      resumeSections={resumeSections}
                      isEditing={isEditingInternships}
                      setIsEditing={setIsEditingInternships}
                      onAfterSectionsSave={async () => {
                        try {
                          await refreshUser();
                          setRoadmapData(null);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    />
                  )}

                  {activeTab === "resume" && (
                    <div className="space-y-8">
                      <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[2.5rem] overflow-hidden`}>
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-2">
                              <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Resume</p>
                              <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Projects & Experience</h2>
                              <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-2xl`}>
                                This tab shows structured details extracted from your engineering resume. If anything is missing, you can update manually.
                              </p>
                            </div>
                            <Button onClick={handleResumeClick} disabled={uploadingResume} className="h-12 rounded-2xl font-black">
                              {uploadingResume ? "Uploading..." : "Upload Updated Resume"}
                            </Button>
                          </div>

                          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Education</p>
                              <div className="mt-3 space-y-2">
                                {(Array.isArray(resumeSections?.education) ? resumeSections.education : []).slice(0, 10).map((e: string, idx: number) => (
                                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{e}</div>
                                ))}
                                {(Array.isArray(resumeSections?.education) ? resumeSections.education.length : 0) === 0 && (
                                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No education extracted yet.</p>
                                )}
                              </div>
                            </div>

                            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Certifications</p>
                              <div className="mt-3 space-y-2">
                                {(Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : []).slice(0, 10).map((c: any, idx: number) => (
                                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {typeof c === "string" ? c : String(c?.label || "")}
                                  </div>
                                ))}
                                {(Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0) === 0 && (
                                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No certifications extracted yet.</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Projects</p>
                              <div className="mt-3 space-y-3">
                                {(Array.isArray(resumeSections?.projects) ? resumeSections.projects : []).slice(0, 6).map((p: any, idx: number) => (
                                  <div key={idx} className={`${isDark ? "bg-black/20" : "bg-slate-50"} rounded-xl p-4 border ${isDark ? "border-white/5" : "border-slate-200"}`}>
                                    <p className={`font-black text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{p?.title || "Project"}</p>
                                    {Array.isArray(p?.bullets) && p.bullets.length > 0 && (
                                      <ul className={`mt-2 space-y-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                        {p.bullets.slice(0, 5).map((b: string, i: number) => (
                                          <li key={i} className="flex gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                                            <span>{b}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                                {(Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0) === 0 && (
                                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No projects extracted yet.</p>
                                )}
                              </div>
                            </div>

                            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Internships / Experience / Activities</p>
                              <div className="mt-3 space-y-2">
                                {(Array.isArray(resumeSections?.experience) ? resumeSections.experience : []).slice(0, 12).map((e: string, idx: number) => (
                                  <div key={idx} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500/70 flex-shrink-0" />
                                    <span>{e}</span>
                                  </div>
                                ))}
                                {(Array.isArray(resumeSections?.extracurricular) ? resumeSections.extracurricular : []).slice(0, 12).map((e: string, idx: number) => (
                                  <div key={`x-${idx}`} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500/70 flex-shrink-0" />
                                    <span>{e}</span>
                                  </div>
                                ))}
                                {(Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0) === 0 &&
                                  (Array.isArray(resumeSections?.extracurricular) ? resumeSections.extracurricular.length : 0) === 0 && (
                                    <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No experience extracted yet.</p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Opportunities Tab */}
                  {activeTab === "opportunities" && (
                    <div className="space-y-6">
                      {drivesWithMatch.length === 0 ? (
                        <div className={`${isDark ? "bg-[#0c0c14]/40" : "bg-card/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-slate-200/50"} rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-12 text-center`}>
                          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No drives yet. When your TPO creates a placement or internship drive, it will appear here with full notice-board details.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {drivesWithMatch.map((drive, idx) => {
                            const isInternship = drive.job_type === "INTERNSHIP";
                            return (
                            <div key={drive.id} className={`group p-6 ${isDark ? "border-white/5 bg-[#0c0c14]/40 hover:bg-white/5" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-3xl transition-all shadow-sm border flex flex-col`}>
                              <div className="flex items-center justify-between mb-3">
                                <Badge
                                  className={`font-black text-[10px] uppercase tracking-wider ${
                                    isInternship
                                      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                                      : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                  }`}
                                >
                                  {isInternship ? "Internship Drive" : "Placement Drive"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mb-5">
                                <div className={`w-12 h-12 ${drive.color || "bg-blue-500"} rounded-2xl flex items-center justify-center shadow-md shrink-0`}>
                                  <span className="text-xl font-black text-white">{drive.companyName ? drive.companyName.charAt(0) : "C"}</span>
                                </div>
                                <div className="min-w-0">
                                  <h4 className={`text-lg font-black leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{drive.companyName}</h4>
                                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-wider">{drive.role}</p>
                                  {drive.schedule_note && (
                                    <p className={`text-[10px] font-semibold mt-1 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                      {drive.schedule_note}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-5">
                                {drive.package_value && (
                                  <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                                      <Banknote className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                        {isInternship ? "Stipend" : "CTC"}
                                      </span>
                                      <span className={`text-xs font-black truncate ${isDark ? "text-slate-200" : "text-slate-800"}`} title={String(drive.package_value)}>
                                        {drive.package_value}{isInternship ? "K/mo" : " LPA"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {drive.location && (
                                  <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                                      <MapPin className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Location</span>
                                      <span className={`text-xs font-black truncate ${isDark ? "text-slate-200" : "text-slate-800"}`} title={String(drive.location)}>{drive.location}</span>
                                    </div>
                                  </div>
                                )}
                                {(Number(drive.min_cgpa) > 0 || drive.max_backlogs_allowed !== null) && (
                                  <div className={`col-span-2 flex items-center gap-2 p-2.5 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                                      <GraduationCap className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black min-w-0 truncate">
                                      {Number(drive.min_cgpa) > 0 && (
                                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>{drive.min_cgpa}+ CGPA</span>
                                      )}
                                      {Number(drive.min_cgpa) > 0 && drive.max_backlogs_allowed !== null && (
                                        <span className={isDark ? "text-slate-600" : "text-slate-400"}>•</span>
                                      )}
                                      {drive.max_backlogs_allowed !== null && (
                                        <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                                          {drive.max_backlogs_allowed === 0 ? "No Backlogs" : `Up to ${drive.max_backlogs_allowed} Backlogs`}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-auto gap-3">
                                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                  Deadline: {drive.deadline}
                                </span>
                                <div className="flex items-center gap-2">
                                  {drive.application_status && (
                                    <Badge className="font-black text-[10px] uppercase bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                                      Applied
                                    </Badge>
                                  )}
                                  <Button
                                    variant="outline"
                                    className={`h-9 px-4 rounded-lg font-black text-xs uppercase ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}
                                    onClick={() => openDriveDialog(drive)}
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                    Details
                                  </Button>
                                  <Button
                                    className="h-9 px-5 rounded-lg font-black text-xs uppercase bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-105"
                                    onClick={() => openDriveDialog(drive)}
                                  >
                                    {drive.application_status ? "View" : "Apply"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      )}
                      <PlacementDriveDetailDialog
                        open={driveDialogOpen}
                        onOpenChange={setDriveDialogOpen}
                        drive={selectedDrive}
                        isDark={isDark}
                        isApplied={Boolean(selectedDrive && appliedJobMap[selectedDrive.id])}
                        onApplied={(jobId, status) => {
                          setAppliedJobMap((prev) => ({ ...prev, [jobId]: status || "APPLIED" }));
                        }}
                      />
                    </div>
                  )}

                  {/* Learning Tab */}
                  {activeTab === "learning" && (
                    <div className="space-y-8">
                      <div className={`relative rounded-3xl border p-5 sm:p-6 overflow-hidden ${isDark ? "border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" : "border-blue-100 bg-gradient-to-br from-blue-50 to-white"}`}>
                        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl ${isDark ? "bg-blue-500/15" : "bg-blue-300/30"}`} />
                        <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl ${isDark ? "bg-purple-500/15" : "bg-purple-300/30"}`} />

                        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                                <Brain className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
                              </div>
                              <div>

                                <h3 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                  Your Dynamic Roadmap
                                </h3>
                              </div>
                            </div>
                            <p className={`text-xs sm:text-sm font-semibold max-w-2xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              Premium mentorship guidance built from your CGPA, resume (projects/skills), and score.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => fetchRoadmap()}
                              disabled={loadingRoadmap}
                              className={`${isDark ? "bg-white/10 hover:bg-white/15 text-white border-white/10" : ""} rounded-xl h-9 text-sm px-4 font-black`}
                            >
                              {loadingRoadmap ? "Refreshing..." : "Refresh"}
                            </Button>
                            <Button
                              onClick={async () => {
                                try {
                                  setSavingPerformance(true);
                                  await studentApi.updatePerformance(performanceDraft);
                                  toast.success("Scores updated.");
                                  setRoadmapData(null);
                                  await fetchRoadmap();
                                } catch (e) {
                                  console.error("Failed to update performance", e);
                                  toast.error("Failed to update scores.");
                                } finally {
                                  setSavingPerformance(false);
                                }
                              }}
                              disabled={savingPerformance}
                              className="rounded-xl h-9 text-sm px-4 font-black"
                            >
                              {savingPerformance ? "Saving..." : "Save Scores"}
                            </Button>
                          </div>
                        </div>

                        <div className="relative mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {[
                            { label: "Readiness", value: pct(dynamic.overallReadiness), tone: "blue" },
                            { label: "Placement Fit", value: pct(dynamic.placementProbability), tone: "violet" },
                            { label: "Profile Completeness", value: pct(dynamic.aiConfidence), tone: "emerald" },
                            {
                              label: "Active Tasks",
                              value: String(
                                (roadmapData?.computed?.roadmap?.next7Days?.length || 0) +
                                (roadmapData?.computed?.roadmap?.next30Days?.length || 0) +
                                (roadmapData?.computed?.roadmap?.next90Days?.length || 0)
                              ),
                              tone: "amber",
                            },
                          ].map((kpi) => (
                            <div
                              key={kpi.label}
                              className={`rounded-xl border p-3 ${isDark
                                ? "border-white/10 bg-black/20"
                                : "border-slate-200 bg-white/80"
                                }`}
                            >
                              <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.label}</p>
                              <p className={`mt-1 text-lg sm:text-xl font-black ${kpi.tone === "blue" ? "text-blue-500" :
                                kpi.tone === "violet" ? "text-violet-500" :
                                  kpi.tone === "emerald" ? "text-emerald-500" :
                                    "text-amber-500"
                                }`}>{kpi.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid xl:grid-cols-5 gap-5 mt-6">
                        {/* Score inputs */}
                        <div className={`xl:col-span-2 p-5 sm:p-6 rounded-3xl flex flex-col xl:h-[480px] ${isDark ? "bg-white/5 border border-white/5" : "bg-slate-50/60 border border-slate-200/60"}`}>
                          <div className="flex items-center gap-2.5 mb-4 shrink-0">
                            <Sparkles className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                            <h4 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Calibrate Your Inputs</h4>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-4 shrink-0">
                            {[
                              { key: "amcat_quant", label: "AMCAT Quant" },
                              { key: "amcat_logical", label: "AMCAT Logical" },
                              { key: "amcat_verbal", label: "AMCAT Verbal" },
                              { key: "coding_test_score", label: "Coding Test" },
                              { key: "mock_interview_score", label: "Mock Interview" },
                              { key: "endsem_percentage", label: "End-sem %" },
                            ].map((f) => (
                              <label key={f.key} className="flex flex-col gap-1.5">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.label}</span>
                                <div className="relative group">
                                  <input
                                    value={performanceDraft?.[f.key] ?? ""}
                                    onChange={(e) => setPerformanceDraft((prev: any) => ({ ...(prev || {}), [f.key]: e.target.value }))}
                                    inputMode="numeric"
                                    placeholder="--"
                                    className={`w-full h-9 pl-3 pr-9 text-sm rounded-lg outline-none font-bold transition-all duration-300 ${isDark
                                      ? "bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:bg-white/10"
                                      : "bg-slate-100/50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/60 focus:bg-white"
                                      }`}
                                  />
                                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>/100</span>
                                </div>
                              </label>
                            ))}
                          </div>

                          <p className={`text-xs mt-4 shrink-0 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            After uploading a resume, click <span className="font-black">Refresh</span> to re-calculate with your latest projects, experience and skills.
                          </p>

                          <div className="mt-auto pt-5 space-y-3 shrink-0 flex flex-col justify-end">
                            <Button
                              onClick={onGeneratePersonalPlan}
                              disabled={savingPerformance || loadingRoadmap}
                              className="w-full rounded-xl font-black h-9 text-sm shrink-0"
                            >
                              {savingPerformance ? "Generating Mentor Plan..." : "Generate AI Mentor Plan"}
                            </Button>

                            <div className={`rounded-xl p-3 border shrink-0 ${isDark ? "bg-[#0c0c14]/60 border-white/10" : "bg-white border-slate-200"}`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                                Mentor Brief
                              </p>
                              <p className={`mt-1.5 text-xs font-semibold leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"} line-clamp-2`}>
                                {mentorshipSummary}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Roadmap tasks */}
                        <div className={`xl:col-span-3 p-5 sm:p-6 rounded-3xl flex flex-col xl:h-[480px] max-xl:max-h-[500px] ${isDark ? "bg-white/5 border border-white/5" : "bg-slate-50/60 border border-slate-200/60"}`}>
                          <div className="flex items-center gap-2.5 mb-5 shrink-0">
                            <Target className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                            <h4 className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>What To Do Next</h4>
                          </div>

                          {loadingRoadmap && !roadmapData ? (
                            <div className={`p-4 rounded-xl text-sm ${isDark ? "bg-white/5" : "bg-white"} border ${isDark ? "border-white/5" : "border-slate-200"}`}>
                              <p className={`${isDark ? "text-slate-300" : "text-slate-700"} font-bold`}>Calculating your roadmap...</p>
                            </div>
                          ) : (
                            <div className="space-y-3 overflow-y-auto pr-2 -mr-2 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                              <div className="flex flex-col gap-4">
                                {[
                                  {
                                    title: "Next 7 days",
                                    key: "next7Days",
                                    tone: "blue",
                                    gradient: "from-blue-600/5 to-cyan-500/5",
                                    border: "border-blue-500/20",
                                    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                  },
                                  {
                                    title: "Next 30 days",
                                    key: "next30Days",
                                    tone: "violet",
                                    gradient: "from-violet-600/5 to-fuchsia-500/5",
                                    border: "border-violet-500/20",
                                    badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                                  },
                                  {
                                    title: "Next 90 days",
                                    key: "next90Days",
                                    tone: "emerald",
                                    gradient: "from-emerald-600/5 to-teal-500/5",
                                    border: "border-emerald-500/20",
                                    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                  },
                                ].map((b) => {
                                  const items = roadmapData?.computed?.roadmap?.[b.key] || [];
                                  const isExpanded = expandedRoadmapSections[b.key] || false;
                                  const displayItems = isExpanded ? items : items.slice(0, 1);
                                  if (items.length === 0) return null;
                                  return (
                                    <div
                                      key={b.key}
                                      className={`rounded-2xl p-4 border bg-gradient-to-r ${b.gradient} ${isDark ? b.border : "border-slate-200/80"} flex flex-col`}
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{b.title}</div>
                                        <Badge className={`${b.badgeBg} border rounded-full px-2.5 py-0.5 text-[10px] font-black`}>
                                          {Array.isArray(items) ? items.length : 0} Tasks
                                        </Badge>
                                      </div>
                                      <div className="flex flex-col gap-2.5">
                                        {displayItems.map((t: any, idx: number) => {
                                          const taskId = `${b.key}-${t.id || t.title || idx}`;
                                          const isCompleted = completedRoadmapTasks.includes(taskId);
                                          return (
                                            <div
                                              key={taskId}
                                              onClick={() => toggleTaskCompletion(taskId)}
                                              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer select-none ${isCompleted
                                                ? (isDark ? "bg-black/40 border-green-500/20 opacity-60" : "bg-green-50/30 border-green-200/50 opacity-70")
                                                : (isDark ? "bg-[#0c0c14]/60 border-white/5 hover:border-white/15 hover:bg-black/20" : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300/80")
                                                }`}
                                            >
                                              <div className="flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                                                {isCompleted ? (
                                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                  <div className="relative w-4 h-4">
                                                    <Circle className={`absolute inset-0 w-4 h-4 transition-opacity ${isDark ? "text-slate-600" : "text-slate-400"} group-hover:opacity-0`} />
                                                    <CheckCircle2 className="absolute inset-0 w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                  </div>
                                                )}
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className={`text-xs sm:text-sm break-words font-extrabold leading-snug transition-all duration-300 ${isCompleted
                                                  ? (isDark ? "text-slate-500 line-through" : "text-slate-400 line-through")
                                                  : (isDark ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900")
                                                  }`}>
                                                  {t.title}
                                                </div>
                                                {t.reason && (
                                                  <div className={`text-xs sm:text-sm break-words leading-snug mt-1 font-medium transition-all duration-300 ${isCompleted
                                                    ? (isDark ? "text-slate-600" : "text-slate-400")
                                                    : (isDark ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-600")
                                                    }`}>
                                                    {t.reason}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {items.length > 1 && (
                                        <div className="mt-3 flex justify-start">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedRoadmapSections(prev => ({ ...prev, [b.key]: !prev[b.key] }))}
                                            className={`text-xs font-black transition-colors px-3 py-1 h-auto ${isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                                          >
                                            {isExpanded ? "SHOW LESS" : `SHOW ALL ${items.length} TASKS`}
                                            <ChevronDown className={`ml-1.5 w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Careers Tab */}
                  {activeTab === "careers" && (
                    <div className="space-y-10">
                      <Careers isDashboard />
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
                      <CorporateNewsPage isDashboard />
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
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className={`cta-shimmer cta-gradient-animate bg-gradient-to-r ${isDark ? "from-blue-500/10 via-purple-500/10 to-indigo-500/10" : "from-blue-50 via-purple-50/80 to-indigo-50"} backdrop-blur-xl ${isDark ? "border border-white/[0.06]" : "border border-slate-200"} p-8 rounded-3xl shadow-2xl relative overflow-hidden group mt-12 mb-4`}
                    >
                      <div className={`absolute top-0 right-0 w-80 h-80 ${isDark ? "bg-blue-500/5" : "bg-blue-500/5"} rounded-full -mr-40 -mt-40 blur-3xl group-hover:scale-110 transition-all duration-700`}></div>
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                        <div>
                          <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"} mb-2 tracking-tight`}>Accelerate company-wise prep 🚀</h3>
                          <p className={`text-base font-bold ${isDark ? "text-gray-400" : "text-gray-600"} opacity-80`}>Focus on targeted company kits, patterns, and role-specific practice paths.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <Button
                            variant="outline"
                            className={`h-12 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 ${isDark ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/5" : "border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 hover:shadow-lg hover:shadow-slate-200/50"}`}
                            onClick={() => {
                              setActiveTab("opportunities");
                              navigate("/student/dashboard?tab=opportunities");
                            }}
                          >
                            <Briefcase className="w-5 h-5 mr-3" />
                            View Drives
                          </Button>
                          <Button
                            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/30 gap-3 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95"
                            onClick={() => {
                              setActiveTab("company-kit");
                              navigate("/student/dashboard?tab=company-kit");
                            }}
                          >
                            <Building2 className="w-6 h-6" />
                            Open Company Kit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>

        <Dialog open={showTargetRoleModal} onOpenChange={(open) => !evaluatingRole && setShowTargetRoleModal(open)}>
          <DialogContent className={`${isDark ? "bg-[#1A1A24] border-[#2A2A38] text-white" : "bg-white text-gray-900"}`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-500" />
                Select Target Role
              </DialogTitle>
              <DialogDescription className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Your resume was uploaded successfully! To provide accurate metrics, what role are you targeting with this resume?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="e.g., Frontend Developer, Data Scientist, SDE at Google"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTargetRoleSubmit();
                }}
                disabled={evaluatingRole}
                className={`h-12 ${isDark ? "bg-[#252530] border-gray-700 text-white" : "bg-gray-50 border-gray-300"}`}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTargetRoleModal(false)}
                disabled={evaluatingRole}
                className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
              >
                Skip for now
              </Button>
              <Button
                onClick={handleTargetRoleSubmit}
                disabled={evaluatingRole || !targetRoleInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {evaluatingRole ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Evaluate Resume"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}

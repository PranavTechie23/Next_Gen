import { useState, Fragment, useRef, useEffect } from "react";
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
import Internships from "@/pages/student/Internships";
import { studentApi } from "@/services/studentApi";
import { getPlacementDrives, computeDriveMatch } from "@/data/placementDrives";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ComposedChart, Scatter
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
  Newspaper, DollarSign, CreditCard, FileCheck, Sparkles, HelpCircle, Menu, PanelLeft, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const [backendProfile, setBackendProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [savingPerformance, setSavingPerformance] = useState(false);
  const [uploadingAmcat, setUploadingAmcat] = useState(false);
  const [resumeUploadState, setResumeUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [resumeUploadStatusText, setResumeUploadStatusText] = useState<string>("");
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
  const [performanceDraft, setPerformanceDraft] = useState<any>({
    amcat_quant: "",
    amcat_verbal: "",
    amcat_logical: "",
    endsem_percentage: "",
    mock_interview_score: "",
    coding_test_score: "",
  });
  const [deptEvents, setDeptEvents] = useState<any[]>([]);
  const [loadingDeptEvents, setLoadingDeptEvents] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const data = await studentApi.getProfile();
        setBackendProfile(data);
      } catch (error: any) {
        console.error("Failed to fetch student profile", error);
        if (error?.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("student-career-interests", JSON.stringify(careerInterests || []));
      }
    } catch {
      // ignore persistence errors
    }
  }, [careerInterests]);

  const fetchRoadmap = async () => {
    try {
      setLoadingRoadmap(true);
      const data = await studentApi.getRoadmap();
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
      fetchRoadmap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProfile, backendProfile]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingDeptEvents(true);
        const data = await studentApi.getDeptEvents();
        setDeptEvents(data || []);
      } catch (err) {
        console.error("Failed to fetch dept events", err);
      } finally {
        setLoadingDeptEvents(false);
      }
    };
    if (activeTab === "overview" && !loadingProfile && backendProfile) {
      fetchEvents();
    }
  }, [activeTab, loadingProfile, backendProfile]);

  // Load roadmap on first visit to Mentorship tab (and after resume upload/profile updates)
  useEffect(() => {
    if (activeTab === "learning" && !loadingProfile && backendProfile && !roadmapData && !loadingRoadmap) {
      fetchRoadmap();
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
    avatar: backendProfile?.profile?.avatar_url || ""
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
        await studentApi.uploadResume(file);
        // Force full recomputation refresh after every new resume upload.
        const [profileResult, roadmapResult] = await Promise.allSettled([
          studentApi.getProfile(),
          studentApi.getRoadmap(),
        ]);

        if (profileResult.status === "fulfilled") {
          setBackendProfile(profileResult.value);
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
        } else {
          // Keep UI working even if roadmap refresh fails once; retry path already exists in UI.
          setRoadmapData(null);
        }

        setResumeUploadState("success");
        setResumeUploadStatusText("Resume parsed and dashboard updated.");
        toast.success(`Resume "${file.name}" uploaded and parsed successfully!`);
        setTimeout(() => {
          setResumeUploadState("idle");
          setResumeUploadStatusText("");
        }, 3500);
      } catch (error) {
        console.error("Resume upload failed", error);
        setResumeUploadState("error");
        setResumeUploadStatusText("Resume upload failed. Please try again.");
        toast.error("Resume upload failed. Please try again.");
      } finally {
        setUploadingResume(false);
        e.target.value = "";
      }
    }
  };
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
      .replace(/^[•\-\u2022]\s*/, "")
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
  const baseMergedSkills: string[] = Array.from(
    new Set((parsedResumeSkills.length ? parsedResumeSkills : profileSkills) as string[])
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

  const [pendingSkills, setPendingSkills] = useState<string[]>([]);
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const [removedSkills, setRemovedSkills] = useState<string[]>([]);
  const [removedAchievements, setRemovedAchievements] = useState<string[]>([]);
  const mergedSkills: string[] = Array.from(
    new Set(
      [...baseMergedSkills, ...pendingSkills].filter(
        (s) => !removedSkills.some((r) => normalizeToken(r) === normalizeToken(s))
      )
    )
  );
  const mergedAchievements: string[] = Array.from(
    new Set(
      [...baseMergedAchievements, ...pendingAchievements].filter(
        (a) =>
          !removedAchievements.some(
            (r) =>
              String(r || "").toLowerCase().replace(/\s+/g, " ").trim() ===
              String(a || "").toLowerCase().replace(/\s+/g, " ").trim()
          )
      )
    )
  );

  const [newSkillInput, setNewSkillInput] = useState("");
  const [newAchievementInput, setNewAchievementInput] = useState("");
  const [savingManualProfile, setSavingManualProfile] = useState(false);
  const [manualEditMode, setManualEditMode] = useState(false);
  const [showAllSkillsCard, setShowAllSkillsCard] = useState(false);
  const [showAllAchievementsCard, setShowAllAchievementsCard] = useState(false);

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
      const uniqueSkillNames = (mergedSkills || []).reduce<string[]>((acc, skillName) => {
        const cleaned = String(skillName || "").trim();
        if (!cleaned) return acc;
        const normalized = cleaned.toLowerCase();
        const exists = acc.some((item) => item.toLowerCase() === normalized);
        if (!exists) acc.push(cleaned);
        return acc;
      }, []);
      const skillsPayload = uniqueSkillNames.map((name) => ({ name, proficiency_level: "BEGINNER" }));
      await studentApi.updateSubjectiveProfile({
        skills: skillsPayload,
        achievements: mergedAchievements,
      });
      const refreshed = await studentApi.getProfile();
      setBackendProfile(refreshed);
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
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const computeDynamicMetrics = () => {
    const cgpa = Number(backendProfile?.student?.current_cgpa ?? 0);
    const backlogs = Number(backendProfile?.student?.active_backlogs ?? 0);

    const projectsFromResume = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const experienceFromResume = Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0;
    const extracurricularFromResume = Array.isArray(resumeSections?.extracurricular) ? resumeSections.extracurricular.length : 0;
    const certificationsFromResume = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0;
    const summaryPresent = !!resumeSections?.summary;
    const skillsCount = Array.isArray(mergedSkills) ? mergedSkills.length : 0;

    // Skills mastery: saturating curve based on skill count
    const skillsMastered = clamp(100 * (1 - Math.exp(-skillsCount / 12)));

    // Portfolio strength (projects + experience + certifications), capped
    const portfolioRaw =
      projectsFromResume * 10 +
      experienceFromResume * 6 +
      extracurricularFromResume * 2 +
      certificationsFromResume * 6 +
      (summaryPresent ? 8 : 0);
    const portfolioScore = clamp(portfolioRaw, 0, 100);

    // Academics score (CGPA scale 0-10; penalize backlogs)
    const academicsScore = clamp((cgpa / 10) * 100 - backlogs * 15);

    // Overall readiness (weighted)
    const overallReadiness = clamp(
      academicsScore * 0.45 +
      skillsMastered * 0.30 +
      portfolioScore * 0.25
    );

    // Placement probability (logistic mapping from readiness + academics)
    const logit =
      -2.2 +
      (overallReadiness / 100) * 3.2 +
      (academicsScore / 100) * 1.4 -
      backlogs * 0.35;
    const placementProbability = clamp(sigmoid(logit) * 100);

    // AI confidence = confidence in our computed score (data completeness)
    const hasPhone = !!resumeParsed?.phone || !!backendProfile?.profile?.phone;
    const hasLinks = !!(
      backendProfile?.profile?.github_url ||
      backendProfile?.profile?.linkedin_url ||
      resumeParsed?.github_url ||
      resumeParsed?.linkedin_url
    );
    const completenessSignals = [
      cgpa > 0,
      skillsCount >= 5,
      projectsFromResume > 0,
      summaryPresent,
      hasPhone,
      hasLinks,
    ];
    const completeness = completenessSignals.filter(Boolean).length / completenessSignals.length;
    const aiConfidence = clamp(55 + completeness * 45);

    return {
      overallReadiness,
      skillsMastered,
      placementProbability,
      aiConfidence,
    };
  };

  const dynamic = computeDynamicMetrics();
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
      ...(mergedSkills || []),
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
      ...(mergedSkills || []),
      ...(Array.isArray(resumeSections?.experience) ? resumeSections.experience : []),
      ...(Array.isArray(resumeSections?.education) ? resumeSections.education : []),
      ...(Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : []),
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
    const backendRole = String(resumeParsed?.inferred_role || "").trim();
    const backendConfidence = Number(resumeParsed?.inferred_role_confidence ?? 0);
    if (backendRole) {
      return {
        title: backendRole,
        confidence: Math.round(clamp(backendConfidence || dynamic.aiConfidence, 35, 96)),
        trend: "UP",
      };
    }

    const skillsSet = new Set((mergedSkills || []).map((s: string) => normalizeToken(s)));
    const interestsSet = new Set((careerInterests || []).map((i) => normalizeToken(i)));
    const evidenceBlob = [
      ...(Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p: any) => p?.title || "") : []),
      ...(Array.isArray(resumeSections?.experience) ? resumeSections.experience : []),
      ...(Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : []),
      ...(topJourneyKeywords || []),
      ...(careerInterests || []),
      ...(mergedSkills || []),
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
        const inSkills = Array.from(skillsSet).some((x) => x.includes(key));
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
    const baseDensity = (mergedSkills || []).length + projects + exp + certs + (careerInterests || []).length;
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
      score: Math.round(45 + Math.min((mergedAchievements || []).length, 6) * 8),
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
    const ach = Array.isArray(mergedAchievements) ? mergedAchievements : [];
    const projectBlocks = Array.isArray(resumeSections?.projects) ? resumeSections.projects : [];

    const inferredEvents: any[] = [];

    edu.forEach((line: any) => inferredEvents.push({ source: "education", title: String(line || ""), date: parseMonthYearFromText(line) }));
    exp.forEach((line: any) => inferredEvents.push({ source: "experience", title: String(line || ""), date: parseMonthYearFromText(line) }));
    certs.forEach((line: any) => inferredEvents.push({ source: "certification", title: String(line || ""), date: parseMonthYearFromText(line) }));
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

  // Enhanced Quick Stats (Dynamic)
  const quickStats = [
    {
      label: "Overall Readiness",
      value: pct(dynamic.overallReadiness),
      change: "Dynamic",
      trend: dynamic.overallReadiness >= 60 ? "up" : "down",
      icon: Target,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      description: "Placement Preparedness"
    },
    {
      label: "Skills Mastered",
      value: pct(dynamic.skillsMastered),
      change: "Dynamic",
      trend: dynamic.skillsMastered >= 60 ? "up" : "down",
      icon: Award,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      description: "Core Competencies"
    },
    {
      label: "Placement Probability",
      value: pct(dynamic.placementProbability),
      change: "Dynamic",
      trend: dynamic.placementProbability >= 60 ? "up" : "down",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      description: "Overall Fit"
    },
    {
      label: "AI Confidence",
      value: pct(dynamic.aiConfidence),
      change: "Dynamic",
      trend: dynamic.aiConfidence >= 70 ? "up" : "down",
      icon: Brain,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      description: "Score Confidence"
    }
  ];

  // Dynamic Skill Data (resume/profile-driven)
  const skillData = (() => {
    const projectCount = Array.isArray(resumeSections?.projects) ? resumeSections.projects.length : 0;
    const expCount = Array.isArray(resumeSections?.experience) ? resumeSections.experience.length : 0;
    const certCount = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications.length : 0;
    const achievementsCount = Array.isArray(mergedAchievements) ? mergedAchievements.length : 0;
    const totalSkills = Array.isArray(mergedSkills) ? mergedSkills.length : 0;

    const hasAny = (keywords: string[]) =>
      (mergedSkills || []).some((s: string) => keywords.some((k) => s.toLowerCase().includes(k)));

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

  // Placement drives from TPO (ticket creation) — shown as "Drives" with match %
  const placementDrives = getPlacementDrives();
  const studentSkills = mergedSkills;
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
    const skills = Array.isArray(mergedSkills) ? mergedSkills.length : 0;
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
    const solvedEstimate = Math.round(projectCount * 18 + expCount * 14 + certCount * 8 + (mergedSkills?.length || 0) * 2);
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

  // Sidebar Links - All Student Features (All as tabs, no navigation)
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: PaletteIcon },
    { id: "internships", label: "Internships", icon: BriefcaseIcon },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "opportunities", label: "Drives", icon: BriefcaseIcon },
    { id: "learning", label: "Mentorship", icon: UsersIcon },

    { id: "webinars", label: "Webinars", icon: Play },

    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "corporateNews", label: "Corporate News", icon: Newspaper },

    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "assessment-hub", label: "Resources", icon: Zap },
    { id: "company-kit", label: "Company Wise Kit", icon: Building2 },
  ];

  const sidebarSections: Array<{ title: string; ids: Array<(typeof sidebarLinks)[number]["id"]> }> = [
    { title: "PROFILE TRACKER", ids: ["overview", "skills", "internships"] },
    { title: "QUESTION TRACKER", ids: ["opportunities", "learning"] },
    { title: "RESOURCES", ids: ["careers", "webinars", "corporateNews"] },
    { title: "COMMUNITY", ids: ["feedback"] },
    { title: "PRACTICE & PREP", ids: ["assessment-hub", "company-kit"] },
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
                onClick={() => performClientLogout(navigate)}
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
      <aside className={`relative z-50 hidden h-dvh max-h-dvh shrink-0 flex-col overflow-visible transition-all duration-500 lg:sticky lg:top-0 lg:flex ${isSidebarOpen ? "w-72" : "w-[6rem]"} ${isSidebarOpen ? "p-4 pr-2" : "p-3"} bg-transparent`}>
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
        className={`flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar relative bg-transparent ${activeTab === "company-kit" || activeTab === "careers" ? "flex flex-col pt-6 sm:pt-8 lg:pt-10" : "p-4 sm:p-6 lg:p-8"}`}
      >
        <div className={`${activeTab === "company-kit" ? "w-full px-4 sm:px-6 lg:px-8" : "max-w-[1400px] mx-auto"} ${activeTab === "company-kit" ? "flex flex-col space-y-4 sm:space-y-6 min-h-0" : "space-y-6 sm:space-y-8 lg:space-y-10"}`}>

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
              {activeTab !== "company-kit" && activeTab !== "careers" && (
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
                      {activeTab === "skills" ? "Skills & Achievements" : (sidebarLinks.find(l => l.id === activeTab)?.label || activeTab)}
                    </h1>
                    <p className={`${isDark ? "text-blue-400" : "text-blue-600"} text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-90 mt-1 border-b-0 no-underline`}>
                      {activeTab === "overview" ? "Career Readiness Dashboard" :
                        activeTab === "skills" ? "Skill Architecture Analysis" :
                          activeTab === "resume" ? "Resume: Projects, Education, Experience" :
                            activeTab === "opportunities" ? "Placement Drives" :
                              activeTab === "learning" ? "Learning & Development" :
                                activeTab === "careers" ? "Career Opportunities & Resources" :
                                  activeTab === "webinars" ? "Live Learning Sessions" :
                                    activeTab === "corporateNews" ? "Industry News & Updates" :
                                      activeTab === "feedback" ? "Share Your Feedback" :
                                        activeTab === "assessment-hub" ? "Resources — End-to-End Prep" :
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
                      <PopoverContent align="end" sideOffset={12} className={`w-[min(22rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] p-0 rounded-[2rem] overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:w-[380px] sm:max-w-none ${isDark ? "bg-[#0c0c14]" : "bg-white"}`}>
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
                      <DropdownMenuContent align="end" sideOffset={12} className={`w-72 p-3 rounded-3xl animate-in fade-in zoom-in-95 duration-200 border ${isDark ? "bg-[#0c0c14]/90 backdrop-blur-2xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white" : "bg-white/90 backdrop-blur-2xl border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.1)] text-slate-900"}`}>
                        <DropdownMenuLabel className="p-0 mb-2">
                          <div className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"}`}>
                            <Avatar className="w-12 h-12 rounded-xl shadow-inner border border-white/10">
                              <AvatarImage src={studentProfile.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg shadow-inner">{studentProfile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 text-left justify-center">
                              <span className={`font-extrabold text-sm tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>{studentProfile.name}</span>
                              <span className={`text-xs truncate font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{studentProfile.email}</span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className={`${isDark ? "bg-white/10" : "bg-slate-100"} -mx-3 my-2`} />
                        <DropdownMenuGroup className="space-y-1">
                          <DropdownMenuItem onClick={() => navigate("/student/setting")} className={`rounded-2xl flex items-center gap-3 p-3 transition-all cursor-pointer ${isDark ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-slate-100 focus:bg-slate-100"}`}>
                            <div className={`w-9 h-9 rounded-xl ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"} flex items-center justify-center shadow-inner`}>
                              <Settings className="w-4.5 h-4.5" />
                            </div>
                            <span className="font-semibold text-sm">Account Settings</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className={`${isDark ? "bg-white/10" : "bg-slate-100"} -mx-3 my-2`} />
                        <DropdownMenuItem onClick={() => performClientLogout(navigate)} className={`rounded-2xl flex items-center gap-3 p-3 transition-all cursor-pointer group/signout ${isDark ? "hover:bg-red-500/10 focus:bg-red-500/10 text-red-400" : "hover:bg-red-50 focus:bg-red-50 text-red-600"}`}>
                          <div className={`w-9 h-9 rounded-xl ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-600"} flex items-center justify-center transition-colors group-hover/signout:bg-red-500/20 group-hover/signout:text-red-500 shadow-inner`}>
                            <LogOut className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-bold text-sm">Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </header>
              )}


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
                        disabled={uploadingResume}
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
                        {uploadingResume ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : resumeUploadState === "success" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-300" />
                        ) : (
                          <UploadIcon className="w-6 h-6" />
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
                          className={`mt-2 text-xs font-bold ${
                            resumeUploadState === "success"
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
                        <div className={`${isDark ? "bg-blue-500/10" : "bg-blue-50"} rounded-xl px-3 py-2 ${isDark ? "border-blue-500/20" : "border-blue-200"} flex items-center gap-3`}>
                          <div className={`w-10 h-10 ${isDark ? "bg-white/5" : "bg-white"} rounded-lg flex items-center justify-center shadow-lg ${isDark ? "border-blue-500/20" : "border-blue-200"}`}>
                            <span className="text-sm font-black text-blue-400">{roleRecommendation.confidence}%</span>
                          </div>
                          <div>
                            <p className={`text-[11px] font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Confidence</p>
                            <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Use with your goals</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-600"} mr-1`}>Interests</p>
                          {careerInterests.slice(0, 4).map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className="text-xs px-3 py-1.5 rounded-full border font-semibold transition bg-blue-500 text-white border-blue-500"
                              title="Click to remove"
                            >
                              {interest}
                            </button>
                          ))}
                          {careerInterests.length > 4 && (
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}>
                              +{careerInterests.length - 4} more
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addInterestFromInput();
                              }
                            }}
                            placeholder="Type your interest (e.g. distributed systems)"
                            className={`h-10 rounded-xl px-3 text-sm border flex-1 ${
                              isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                          <Button type="button" onClick={addInterestFromInput} className="h-10 rounded-xl">
                            Add Interest
                          </Button>
                        </div>
                        {suggestedInterests.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"} mr-1`}>Suggested from resume</p>
                            {suggestedInterests
                              .slice(0, 4)
                              .map((k) => (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => toggleInterest(k)}
                                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${
                                    isDark
                                      ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {k}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className={`h-2 ${isDark ? "bg-white/5" : "bg-gray-200"} rounded-full overflow-hidden shadow-inner`}>
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full" style={{ width: `${roleRecommendation.confidence}%` }}></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {roleSkillCards.map((item, i) => (
                          <div key={i} className={`p-3 rounded-xl ${item.bg} ${isDark ? "border-white/5" : "border-gray-200"} flex flex-col gap-0.5`}>
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

                  {/* Upcoming Dept Events */}
                  <div>
                    <h3 className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"} tracking-tighter mb-4 px-2`}>Dept Events</h3>
                    <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[2.5rem] overflow-hidden`}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {loadingDeptEvents ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checking for events...</p>
                            </div>
                          ) : deptEvents.length > 0 ? (
                            deptEvents.map((event, idx) => (
                              <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100 shadow-sm"}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                                  <Calendar className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`text-sm font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}>{event.title}</h4>
                                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"} mt-0.5`}>
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                                    {event.type || 'Event'}
                                  </div>
                                  {event.meetingLink && (
                                    <Button 
                                      size="sm" 
                                      className="h-7 px-3 text-[10px] font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                                      onClick={() => window.open(event.meetingLink, '_blank')}
                                    >
                                      Join Now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                                <Calendar className="w-8 h-8 text-muted-foreground opacity-20" />
                              </div>
                              <div className="space-y-1">
                                <p className={`text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>No upcoming events</p>
                                <p className={`text-[10px] font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}>Your department head hasn't scheduled anything yet.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
                    {recommendations.slice(0, 3).map((rec: any, idx: number) => (
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

                          <Button
                            className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all"
                            onClick={() => {
                              setActiveTab("learning");
                              navigate("/student/dashboard?tab=learning");
                              toast.success(`Opened personalized plan for: ${rec.title}`);
                            }}
                          >
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
              {/* Manual Update: Skills + Achievements */}
              <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[2.5rem] overflow-hidden`}>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-2">
                      <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manual Updates</p>
                      <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-2xl`}>
                        Add only missing items. Keep entries short and relevant.
                      </p>
                    </div>
                    {!manualEditMode ? (
                      <Button onClick={() => setManualEditMode(true)} className="h-12 rounded-2xl font-black" variant="secondary">
                        Edit
                      </Button>
                    ) : (
                      <Button onClick={saveManualSkillsAndAchievements} disabled={savingManualProfile} className="h-12 rounded-2xl font-black">
                        {savingManualProfile ? "Saving..." : "Save Updates"}
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Add Skill</p>
                      <div className="mt-3 flex gap-2">
                        <input
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          placeholder="e.g., LangChain, SHAP, SQL"
                          disabled={!manualEditMode}
                          className={`flex-1 h-11 px-4 rounded-2xl text-sm font-semibold outline-none border transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 shadow-inner"}`}
                        />
                        <Button
                          type="button"
                          disabled={!manualEditMode}
                          onClick={() => {
                            const raw = newSkillInput.trim();
                            const v = cleanSkillToken(raw);
                            if (!v) {
                              toast.error("Please enter a valid skill.");
                              return;
                            }
                            setNewSkillInput("");
                            if (mergedSkills.some((s) => s.toLowerCase() === v.toLowerCase())) return;
                            setPendingSkills((prev) => [...prev, v]);
                          }}
                          className="h-11 rounded-2xl font-black px-5"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Add Achievement</p>
                      <div className="mt-3 flex gap-2">
                        <input
                          value={newAchievementInput}
                          onChange={(e) => setNewAchievementInput(e.target.value)}
                          placeholder="e.g., 2nd Rank – 93.17% (HSC)"
                          disabled={!manualEditMode}
                          className={`flex-1 h-11 px-4 rounded-2xl text-sm font-semibold outline-none border transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 shadow-inner"}`}
                        />
                        <Button
                          type="button"
                          disabled={!manualEditMode}
                          onClick={() => {
                            const raw = newAchievementInput.trim();
                            const v = cleanAchievementToken(raw);
                            if (!v) {
                              toast.error("Please enter a valid achievement.");
                              return;
                            }
                            setNewAchievementInput("");
                            if (mergedAchievements.some((a) => a.toLowerCase() === v.toLowerCase())) return;
                            setPendingAchievements((prev) => [...prev, v]);
                          }}
                          className="h-11 rounded-2xl font-black px-5"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Skills Captured",
                        value: (mergedSkills || []).length,
                        tone: isDark ? "from-blue-500/15 to-cyan-500/10 border-blue-500/20" : "from-blue-50 to-cyan-50 border-blue-200",
                      },
                      {
                        label: "Achievements",
                        value: (mergedAchievements || []).length,
                        tone: isDark ? "from-amber-500/15 to-orange-500/10 border-amber-500/20" : "from-amber-50 to-orange-50 border-amber-200",
                      },
                      {
                        label: "Profile Completion",
                        value: `${Math.min(100, Math.round((((mergedSkills || []).length >= 8 ? 1 : (mergedSkills || []).length / 8) * 0.6 + (((mergedAchievements || []).length >= 3 ? 1 : (mergedAchievements || []).length / 3) * 0.4)) * 100))}%`,
                        tone: isDark ? "from-green-500/15 to-emerald-500/10 border-green-500/20" : "from-green-50 to-emerald-50 border-green-200",
                      },
                    ].map((s) => (
                      <div key={s.label} className={`rounded-2xl border bg-gradient-to-br p-4 ${s.tone}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                        <p className={`mt-1 text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${isDark ? "border-white/10 bg-gradient-to-br from-white/10 via-white/[0.05] to-white/[0.02]" : "border-slate-200 bg-gradient-to-br from-white to-slate-50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/15" : "bg-blue-100"}`}>
                            <Code className="h-4 w-4 text-blue-500" />
                          </div>
                          <p className={`text-base font-extrabold uppercase tracking-wide ${isDark ? "text-slate-100" : "text-slate-700"}`}>Current Skills</p>
                        </div>
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                          {(mergedSkills || []).length}
                        </span>
                      </div>
                      <div className={`mt-4 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                      <div className={`${showAllSkillsCard ? "mt-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar" : "mt-4"}`}>
                        <div className="flex flex-wrap gap-2.5">
                          {(showAllSkillsCard ? (mergedSkills || []) : (mergedSkills || []).slice(0, 14)).map((s: string) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => {
                                if (manualEditMode) removeSkill(s);
                              }}
                              title={manualEditMode ? "Remove skill" : undefined}
                              className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                                isDark
                                  ? "bg-white/10 border-white/10 text-slate-100 hover:bg-white/15"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700"
                              }`}
                            >
                              {s}
                              {manualEditMode && <span className="ml-2 text-red-500 text-base font-black leading-none">×</span>}
                            </button>
                          ))}
                          {(!mergedSkills || mergedSkills.length === 0) && (
                            <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No skills added yet.</p>
                          )}
                        </div>
                        {(mergedSkills || []).length > 14 && (
                          <button
                            type="button"
                            onClick={() => setShowAllSkillsCard((v) => !v)}
                            className={`mt-3 text-xs font-bold underline-offset-2 hover:underline ${isDark ? "text-blue-300" : "text-blue-700"}`}
                          >
                            {showAllSkillsCard ? "Show less" : `Show all ${(mergedSkills || []).length} skills`}
                          </button>
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
                          {(mergedAchievements || []).length}
                        </span>
                      </div>
                      <div className={`mt-4 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                      <div className={`${showAllAchievementsCard ? "mt-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar" : "mt-4"}`}>
                        {(showAllAchievementsCard ? (mergedAchievements || []) : (mergedAchievements || []).slice(0, 4)).map((a: string, idx: number) => (
                          <div
                            key={idx}
                            className={`mb-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium leading-relaxed flex items-start gap-2 ${
                              isDark
                                ? "bg-white/10 border-white/10 text-slate-100"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/70 flex-shrink-0" />
                            <span className={`${showAllAchievementsCard ? "" : "line-clamp-2"}`}>{a}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (manualEditMode) removeAchievement(a);
                              }}
                              title={manualEditMode ? "Remove achievement" : undefined}
                              className={`ml-auto px-1 py-0.5 rounded ${
                                manualEditMode
                                  ? isDark
                                    ? "text-red-400 hover:text-red-300"
                                    : "text-red-600 hover:text-red-700"
                                  : "text-transparent pointer-events-none"
                              }`}
                            >
                              <span className="text-base font-black leading-none">×</span>
                            </button>
                          </div>
                        ))}
                        {(mergedAchievements || []).length > 4 && (
                          <button
                            type="button"
                            onClick={() => setShowAllAchievementsCard((v) => !v)}
                            className={`text-xs font-bold underline-offset-2 hover:underline pl-4 ${isDark ? "text-amber-300" : "text-amber-700"}`}
                          >
                            {showAllAchievementsCard ? "Show less" : `Show all ${(mergedAchievements || []).length} achievements`}
                          </button>
                        )}
                        {(!mergedAchievements || mergedAchievements.length === 0) && (
                          <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-500"}`}>
                            No achievements yet. Add one above to strengthen your profile.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"} ml-16 mt-1`}>
                        Holistic view vs. benchmarks for{" "}
                        <span className={`${isDark ? "text-blue-300" : "text-blue-700"}`}>{roleRecommendation.title}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className={`inline-flex items-center h-11 px-4 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer border ${isDark ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingAmcat ? "Uploading AMCAT..." : "Upload AMCAT PDF"}
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={onAmcatReportChange}
                          disabled={uploadingAmcat}
                        />
                      </label>
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
                  </div>
                  <div className="h-96">
                    {viewMode === "radar" ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarSkillData}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: isDark ? '#9ca3af' : '#64748b' }} />
                          <Radar
                            name="Your Skills"
                            dataKey="current"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                          <Radar
                            name="Role benchmark"
                            dataKey="required"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.2}
                          />
                          <Legend
                            wrapperStyle={{
                              color: isDark ? "#e5e7eb" : "#334155",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              return (
                                <div
                                  className={`rounded-xl border px-3 py-2 text-sm shadow-lg ${
                                    isDark
                                      ? "border-white/10 bg-[#0c0c14] text-white"
                                      : "border-slate-200 bg-white text-slate-900"
                                  }`}
                                >
                                  <p className="font-black mb-1">{label}</p>
                                  {payload.map((entry: any) => (
                                    <p key={String(entry.name)} className="font-semibold tabular-nums">
                                      {entry.name}: {Math.round(clamp(Number(entry.value), 0, 100))}
                                      <span className="opacity-60 font-normal"> / 100</span>
                                    </p>
                                  ))}
                                </div>
                              );
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

            </div>
          )}

          {/* Internships Tab (Resume-driven) */}
          {activeTab === "internships" && (
            <Internships
              isDark={isDark}
              resumeSections={resumeSections}
              onAfterSectionsSave={async () => {
                try {
                  const refreshed = await studentApi.getProfile();
                  setBackendProfile(refreshed);
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
                <CardContent className="p-6 sm:p-10">
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
                        {(Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : []).slice(0, 10).map((c: string, idx: number) => (
                          <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{c}</div>
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
                <CardContent className="p-6 sm:p-8 lg:p-12">
                  <div className={`relative rounded-[2rem] border p-6 sm:p-8 overflow-hidden ${isDark ? "border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" : "border-blue-100 bg-gradient-to-br from-blue-50 to-white"}`}>
                    <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl ${isDark ? "bg-blue-500/15" : "bg-blue-300/30"}`} />
                    <div className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${isDark ? "bg-purple-500/15" : "bg-purple-300/30"}`} />

                    <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                            <Brain className={`w-6 h-6 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
                          </div>
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${isDark ? "text-blue-300/80" : "text-blue-700/80"}`}>
                              AI Mentor Console
                            </p>
                            <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                              Your Dynamic Roadmap
                            </h3>
                          </div>
                        </div>
                        <p className={`text-sm sm:text-base font-semibold max-w-2xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Premium mentorship guidance built from your CGPA, resume (projects/skills), and score signals.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => fetchRoadmap()}
                          disabled={loadingRoadmap}
                          className={`${isDark ? "bg-white/10 hover:bg-white/15 text-white border-white/10" : ""} rounded-2xl font-black`}
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
                          className="rounded-2xl font-black"
                        >
                          {savingPerformance ? "Saving..." : "Save Scores"}
                        </Button>
                      </div>
                    </div>

                    <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { label: "Readiness", value: `${pct(dynamic.overallReadiness)}%`, tone: "blue" },
                        { label: "Placement Fit", value: `${pct(dynamic.placementProbability)}%`, tone: "violet" },
                        { label: "AI Confidence", value: `${pct(dynamic.aiConfidence)}%`, tone: "emerald" },
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
                          className={`rounded-2xl border p-4 ${
                            isDark
                              ? "border-white/10 bg-black/20"
                              : "border-slate-200 bg-white/80"
                          }`}
                        >
                          <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.label}</p>
                          <p className={`mt-1 text-xl sm:text-2xl font-black ${
                            kpi.tone === "blue" ? "text-blue-500" :
                            kpi.tone === "violet" ? "text-violet-500" :
                            kpi.tone === "emerald" ? "text-emerald-500" :
                            "text-amber-500"
                          }`}>{kpi.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid xl:grid-cols-5 gap-6 mt-8">
                    {/* Score inputs */}
                    <div className={`xl:col-span-2 p-6 sm:p-7 rounded-[2rem] ${isDark ? "bg-white/5 border border-white/5" : "bg-slate-50/60 border border-slate-200/60"}`}>
                      <div className="flex items-center gap-3 mb-5">
                        <Sparkles className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                        <h4 className={`text-lg sm:text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Calibrate Your Inputs</h4>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: "amcat_quant", label: "AMCAT Quant (0-100)" },
                          { key: "amcat_logical", label: "AMCAT Logical (0-100)" },
                          { key: "amcat_verbal", label: "AMCAT Verbal (0-100)" },
                          { key: "coding_test_score", label: "Coding Test (0-100)" },
                          { key: "mock_interview_score", label: "Mock Interview (0-100)" },
                          { key: "endsem_percentage", label: "End-sem % (0-100)" },
                        ].map((f) => (
                          <label key={f.key} className="flex flex-col gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.label}</span>
                            <input
                              value={performanceDraft?.[f.key] ?? ""}
                              onChange={(e) => setPerformanceDraft((prev: any) => ({ ...(prev || {}), [f.key]: e.target.value }))}
                              inputMode="numeric"
                              placeholder="Optional"
                              className={`h-11 px-4 rounded-2xl outline-none transition-colors ${
                                isDark
                                  ? "bg-[#0c0c14]/60 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/60"
                                  : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/60"
                              }`}
                            />
                          </label>
                        ))}
                      </div>

                      <p className={`text-xs mt-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        After uploading a resume, click <span className="font-black">Refresh</span> to re-calculate with your latest projects, experience and skills.
                      </p>

                      <div className="mt-5 space-y-3">
                        <Button
                          onClick={onGeneratePersonalPlan}
                          disabled={savingPerformance || loadingRoadmap}
                          className="w-full rounded-2xl font-black h-11"
                        >
                          {savingPerformance ? "Generating Mentor Plan..." : "Generate AI Mentor Plan"}
                        </Button>

                        <div className={`rounded-2xl p-4 border ${isDark ? "bg-[#0c0c14]/60 border-white/10" : "bg-white border-slate-200"}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            Mentor Brief
                          </p>
                          <p className={`mt-2 text-sm font-semibold leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                            {mentorshipSummary}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Roadmap tasks */}
                    <div className={`xl:col-span-3 p-6 sm:p-7 rounded-[2rem] ${isDark ? "bg-white/5 border border-white/5" : "bg-slate-50/60 border border-slate-200/60"}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <Target className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                        <h4 className={`text-lg sm:text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>What To Do Next</h4>
                      </div>

                      {loadingRoadmap && !roadmapData ? (
                        <div className={`p-6 rounded-2xl ${isDark ? "bg-white/5" : "bg-white"} border ${isDark ? "border-white/5" : "border-slate-200"}`}>
                          <p className={`${isDark ? "text-slate-300" : "text-slate-700"} font-bold`}>Calculating your roadmap...</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            { title: "Next 7 days", key: "next7Days", tone: "blue" },
                            { title: "Next 30 days", key: "next30Days", tone: "violet" },
                            { title: "Next 90 days", key: "next90Days", tone: "emerald" },
                          ].map((b) => {
                            const items = roadmapData?.computed?.roadmap?.[b.key] || [];
                            return (
                              <div key={b.key} className={`rounded-2xl p-4 border ${isDark ? "bg-[#0c0c14]/40 border-white/8" : "bg-white border-slate-200/70"}`}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{b.title}</div>
                                  <Badge className={`${isDark ? "bg-white/10 text-slate-200 border-white/10" : "bg-slate-100 text-slate-700 border-slate-200"} rounded-xl`}>
                                    {Array.isArray(items) ? items.length : 0}
                                  </Badge>
                                </div>
                                <div className="space-y-2.5">
                                  {(Array.isArray(items) ? items : []).slice(0, 4).map((t: any) => (
                                    <div key={t.id || t.title} className="flex items-start gap-2.5">
                                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${
                                        b.tone === "blue" ? (isDark ? "text-blue-300" : "text-blue-600")
                                        : b.tone === "violet" ? (isDark ? "text-violet-300" : "text-violet-600")
                                        : (isDark ? "text-emerald-300" : "text-emerald-600")
                                      }`} />
                                      <div className="min-w-0">
                                        <div className={`text-sm font-bold leading-snug ${isDark ? "text-slate-100" : "text-slate-900"}`}>{t.title}</div>
                                        {t.reason && (
                                          <div className={`text-[11px] leading-snug ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t.reason}</div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {Array.isArray(items) && items.length > 4 && (
                                    <div className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                      +{items.length - 4} more items
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                  <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"} mb-3 tracking-tight`}>Accelerate company-wise prep 🚀</h3>
                  <p className={`text-lg font-bold ${isDark ? "text-gray-400" : "text-gray-600"} opacity-80`}>Focus on targeted company kits, patterns, and role-specific practice paths.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className={`h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest ${isDark ? "border-white/30 text-white hover:bg-white/10" : "border-gray-300 text-gray-900 hover:bg-gray-100"}`}
                    onClick={() => {
                      setActiveTab("opportunities");
                      navigate("/student/dashboard?tab=opportunities");
                    }}
                  >
                    <Briefcase className="w-6 h-6 mr-3" />
                    View Drives
                  </Button>
                  <Button
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/30 gap-3 text-white"
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
            </div>
          )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
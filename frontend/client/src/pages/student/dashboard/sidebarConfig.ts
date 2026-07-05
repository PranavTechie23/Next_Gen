import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Megaphone,
  Palette as PaletteIcon,
  Briefcase as BriefcaseIcon,
  FileText,
  Users as UsersIcon,
  Play,
  Briefcase,
  Newspaper,
  MessageSquare,
  Zap,
  Building2,
} from "lucide-react";

export type StudentSidebarLink = {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
};

/** Sidebar tabs for StudentDashboard — synced to URL via ?tab= */
export const STUDENT_SIDEBAR_LINKS: StudentSidebarLink[] = [
  { id: "overview", label: "Dashboard", subtitle: "Your career command center", icon: LayoutDashboard },
  { id: "announcements", label: "Announcements", subtitle: "Latest notices & updates", icon: Megaphone },
  { id: "skills", label: "Skills", subtitle: "Manage your competencies & achievements", icon: PaletteIcon },
  { id: "internships", label: "Internships", subtitle: "Discover real-world opportunities", icon: BriefcaseIcon },
  { id: "resume", label: "Resume", subtitle: "Build & optimize your resume", icon: FileText },
  { id: "opportunities", label: "Placement Drives", subtitle: "Openings from your TPO", icon: BriefcaseIcon },

  { id: "webinars", label: "Webinars", subtitle: "Live sessions & workshops", icon: Play },
  { id: "careers", label: "Career Explorer", subtitle: "Explore roles & industries", icon: Briefcase },
  { id: "corporateNews", label: "Corporate News", subtitle: "Latest industry updates", icon: Newspaper },
  { id: "feedback", label: "Feedback", subtitle: "Share your thoughts", icon: MessageSquare },
  { id: "assessment-hub", label: "Resources", subtitle: "Practice tests & study material", icon: Zap },
  { id: "company-kit", label: "Company Wise Kit", subtitle: "Targeted company prep", icon: Building2 },
];

export type MarqueeItem = {
  id: string;
  text: string;
  type: "announcement" | "event" | "system";
  isImportant?: boolean;
};

export function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

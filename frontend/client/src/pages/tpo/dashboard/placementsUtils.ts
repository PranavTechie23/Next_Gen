export const APPLICATION_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "SELECTED", label: "Selected" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "APPLIED", label: "Applied" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS_OPTIONS)[number]["value"];

export interface PlacementApplication {
  id?: number;
  student_id?: number;
  job_id?: number;
  student_name?: string | null;
  student_email?: string;
  roll_number?: string | null;
  company_name?: string;
  job_title?: string;
  package_value?: number | string | null;
  applied_at?: string | null;
  branch?: string;
  status?: string;
  current_round?: string;
  drive_id?: number;
  drive_name?: string;
}

export function formatApplicationStatus(status?: string): string {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function getApplicationStatusStyles(status?: string): string {
  switch (status) {
    case "SELECTED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "INTERVIEW_SCHEDULED":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
    case "SHORTLISTED":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300";
    case "APPLIED":
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export function formatPlacementDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPackage(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return "—";
  return `${num.toFixed(1)} LPA`;
}

export function getStudentDisplayName(app: PlacementApplication): string {
  if (app.student_name?.trim()) return app.student_name.trim();
  if (app.roll_number?.trim()) return app.roll_number.trim();
  if (app.student_email) {
    const local = app.student_email.split("@")[0];
    return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Unknown Student";
}

export function getStudentInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

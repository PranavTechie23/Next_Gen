import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentApi } from "@/services/studentApi";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react";

export type StudentPlacementDrive = {
  id: number;
  job_id?: number;
  companyName: string;
  role: string;
  description?: string;
  job_description?: string;
  drive_description?: string;
  drive_name?: string;
  package_value?: number | string;
  stipend_value?: number | string | null;
  location?: string;
  min_cgpa?: number;
  max_backlogs_allowed?: number | null;
  eligible_branches?: string[];
  deadline?: string;
  deadline_note?: string;
  end_date?: string;
  start_date?: string;
  schedule_note?: string;
  activity_schedule?: string;
  website?: string;
  application_link?: string;
  required_skills?: string[];
  requirements?: string[];
  dos?: string[];
  donts?: string[];
  job_type?: "PLACEMENT" | "INTERNSHIP";
  application_status?: string | null;
};

const FALLBACK_DOS = [
  "Read the full job description and eligibility criteria before applying.",
  "Keep your resume and profile updated on the platform.",
  "Apply only if you meet the CGPA and backlog requirements.",
  "Complete the Google Form honestly with accurate details.",
];

const FALLBACK_DONTS = [
  "Do not apply if you are debarred from placements.",
  "Do not submit false or inflated academic or skill information.",
  "Do not share the application link with ineligible students.",
  "Do not miss the application deadline set by your TPO.",
];

type PlacementDriveDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: StudentPlacementDrive | null;
  isDark: boolean;
  isApplied: boolean;
  onApplied: (jobId: number, status?: string) => void;
};

function formatSchedule(drive: StudentPlacementDrive) {
  if (drive.schedule_note?.trim()) return drive.schedule_note.trim();
  const parts: string[] = [];
  if (drive.start_date) {
    parts.push(new Date(drive.start_date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }));
  }
  if (drive.deadline_note?.trim()) parts.push(drive.deadline_note.trim());
  else if (drive.deadline) parts.push(drive.deadline);
  else if (drive.end_date) {
    parts.push(new Date(drive.end_date).toLocaleDateString("en-IN"));
  }
  return parts.length ? parts.join(" · ") : "As communicated by TPO";
}

function formatBranches(branches?: string[]) {
  if (!Array.isArray(branches) || branches.length === 0) return "All eligible branches";
  return branches.join(", ");
}

function formatCriteria(drive: StudentPlacementDrive) {
  const lines: string[] = [];
  lines.push(`Branches: ${formatBranches(drive.eligible_branches)}`);
  if (Number(drive.min_cgpa) > 0) lines.push(`CGPA ≥ ${drive.min_cgpa}`);
  else lines.push("No minimum CGPA");
  if (drive.max_backlogs_allowed != null) {
    lines.push(
      drive.max_backlogs_allowed === 0
        ? "No active backlogs"
        : `Up to ${drive.max_backlogs_allowed} backlogs allowed`
    );
  }
  return lines;
}

type NoticeCellProps = {
  title: string;
  children: ReactNode;
  isDark: boolean;
  accent?: string;
};

function NoticeCell({ title, children, isDark, accent }: NoticeCellProps) {
  return (
    <div
      className={`flex flex-col border ${
        isDark ? "border-white/10 bg-[#12121c]" : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b ${
          isDark
            ? "border-white/10 bg-white/5 text-slate-300"
            : "border-slate-200 bg-slate-100 text-slate-700"
        } ${accent || ""}`}
      >
        {title}
      </div>
      <div className={`flex-1 p-3 text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
        {children}
      </div>
    </div>
  );
}

export function PlacementDriveDetailDialog({
  open,
  onOpenChange,
  drive,
  isDark,
  isApplied,
  onApplied,
}: PlacementDriveDetailDialogProps) {
  const [applying, setApplying] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  if (!drive) return null;

  const jobId = drive.job_id ?? drive.id;
  const skills = drive.required_skills?.length
    ? drive.required_skills
    : drive.requirements ?? [];
  const dos = drive.dos?.length ? drive.dos : FALLBACK_DOS;
  const donts = drive.donts?.length ? drive.donts : FALLBACK_DONTS;
  const jd = drive.job_description || drive.description || drive.drive_description;
  const hasFormLink = Boolean(drive.application_link?.trim());
  const isInternship = drive.job_type === "INTERNSHIP";
  const hasCtc = drive.package_value != null && Number(drive.package_value) > 0;
  const hasStipend = drive.stipend_value != null && Number(drive.stipend_value) > 0;
  const driveTitle = drive.drive_name || `${drive.companyName} Campus Drive`;

  const handleProceed = async () => {
    if (!hasFormLink) {
      toast.error("No application form link has been added by your TPO yet.");
      return;
    }
    if (!acknowledged) {
      toast.error("Please confirm you have read the Do's and Don'ts.");
      return;
    }

    setApplying(true);
    try {
      if (!isApplied) {
        await studentApi.applyForJob(jobId);
        onApplied(jobId, "APPLIED");
      }
      window.open(drive.application_link!, "_blank", "noopener,noreferrer");
      toast.success(
        isApplied
          ? "Application form opened."
          : "Application recorded. Complete the Google Form in the new tab."
      );
      onOpenChange(false);
      setAcknowledged(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Could not process your application.";
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  const panelClass = isDark
    ? "border-white/10 bg-[#0a0a12] text-white"
    : "border-slate-200 bg-slate-50 text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-600";
  const sectionClass = isDark
    ? "rounded-xl border border-white/10 bg-[#12121c] p-4"
    : "rounded-xl border border-slate-200 bg-white p-4";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setAcknowledged(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className={`w-[98vw] sm:max-w-5xl max-h-[92vh] overflow-y-auto p-0 gap-0 ${panelClass}`}>
        {/* Notice board header */}
        <div
          className={`px-5 py-4 border-b ${
            isDark ? "border-white/10 bg-gradient-to-r from-[#1a1a2e] to-[#12121c]" : "border-slate-200 bg-gradient-to-r from-slate-800 to-slate-700 text-white"
          }`}
        >
          <DialogHeader className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`font-black text-[10px] uppercase tracking-wider ${
                  isInternship
                    ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/40"
                    : "bg-blue-500/30 text-blue-100 border-blue-400/40"
                }`}
              >
                {isInternship ? "Internship Drive" : "Placement Drive"}
              </Badge>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {driveTitle}
            </DialogTitle>
            <p className="text-sm font-bold text-emerald-300">
              Welcomes Team {drive.companyName}
            </p>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Main notice table — like PICT T&P board */}
          <div className={`overflow-hidden rounded-xl border ${isDark ? "border-white/10" : "border-slate-300"}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
              <NoticeCell title="Day, Date & Time" isDark={isDark}>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span className="font-semibold whitespace-pre-wrap">{formatSchedule(drive)}</span>
                </div>
              </NoticeCell>

              <NoticeCell title="Company Details" isDark={isDark} accent={isDark ? "text-emerald-300" : "text-emerald-700"}>
                <div className="space-y-1.5 font-medium">
                  <p>
                    <span className={mutedClass}>Name: </span>
                    <span className="font-black text-emerald-500">{drive.companyName}</span>
                  </p>
                  {hasCtc && (
                    <p>
                      <span className={mutedClass}>CTC: </span>
                      <span className="font-black">{drive.package_value} LPA (FTE)</span>
                    </p>
                  )}
                  {hasStipend && (
                    <p>
                      <span className={mutedClass}>Stipend: </span>
                      <span className="font-black">
                        {Number(drive.stipend_value).toLocaleString("en-IN")}/-
                      </span>
                    </p>
                  )}
                  {!hasCtc && !hasStipend && isInternship && (
                    <p className={mutedClass}>Stipend: As per company policy</p>
                  )}
                  {!hasCtc && !hasStipend && !isInternship && (
                    <p className={mutedClass}>CTC: To be disclosed</p>
                  )}
                  <p>
                    <span className={mutedClass}>Profile: </span>
                    <span className="font-bold uppercase">{drive.role}</span>
                  </p>
                  {drive.website && (
                    <p className="flex items-center gap-1.5 break-all">
                      <Globe className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                      <a
                        href={drive.website.startsWith("http") ? drive.website : `https://${drive.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-semibold"
                      >
                        {drive.website.replace(/^https?:\/\//, "")}
                      </a>
                    </p>
                  )}
                </div>
              </NoticeCell>

              <NoticeCell title="Branch & Criteria" isDark={isDark} accent={isDark ? "text-purple-300" : "text-purple-700"}>
                <ul className="space-y-1">
                  {formatCriteria(drive).map((line) => (
                    <li key={line} className="font-medium">{line}</li>
                  ))}
                </ul>
              </NoticeCell>

              <NoticeCell title="Activity" isDark={isDark}>
                <p className="font-medium whitespace-pre-wrap">
                  {drive.activity_schedule?.trim() || "Pre-Placement Talk · Assessment · Technical & HR Interviews"}
                </p>
              </NoticeCell>

              <NoticeCell title="Venue" isDark={isDark}>
                <p className="font-black text-emerald-500">
                  {drive.location?.trim() || "T&P Cell — check with placement office"}
                </p>
              </NoticeCell>
            </div>
          </div>

          {/* Skills Required */}
          <div className={sectionClass}>
            <p className={`mb-3 text-xs font-black uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>
              Skills Required
            </p>
            {skills.length > 0 ? (
              <ul className={`space-y-1.5 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {skills.map((skill, i) => (
                  <li key={skill} className="flex gap-2">
                    <span className="font-black text-amber-500 shrink-0">{i + 1}.</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : jd ? (
              <p className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {jd}
              </p>
            ) : (
              <p className={mutedClass}>Details will be shared by your TPO.</p>
            )}
          </div>

          {/* Do's & Don'ts */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${sectionClass} ${isDark ? "border-emerald-500/20" : "border-emerald-200"}`}>
              <div className="mb-3 flex items-center gap-2 text-emerald-500">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-wider">Do&apos;s</p>
              </div>
              <ul className="space-y-2">
                {dos.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${sectionClass} ${isDark ? "border-red-500/20" : "border-red-200"}`}>
              <div className="mb-3 flex items-center gap-2 text-red-500">
                <ShieldX className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-wider">Don&apos;ts</p>
              </div>
              <ul className="space-y-2">
                {donts.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!hasFormLink && (
            <div className={`flex items-start gap-3 rounded-xl border p-4 ${isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}>
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className={`text-sm font-semibold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
                Your TPO has not added a Google Form link for this drive yet. Check back later or contact the placement cell.
              </p>
            </div>
          )}

          {hasFormLink && (
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                I have read the drive notice, Do&apos;s and Don&apos;ts, and confirm I meet the eligibility criteria.
              </span>
            </label>
          )}

          {isApplied && (
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${isDark ? "border-blue-500/30 bg-blue-500/10 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-bold">
                You have already applied for this drive. You can reopen the form if needed.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className={`px-5 py-4 border-t gap-2 sm:gap-0 ${isDark ? "border-white/10 bg-[#0c0c14]" : "border-slate-200 bg-white"}`}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Close
          </Button>
          <Button
            onClick={handleProceed}
            disabled={applying || !hasFormLink}
            className="rounded-xl bg-blue-500 font-black uppercase tracking-wider hover:bg-blue-600"
          >
            {applying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                {isApplied ? "Open Google Form" : "Apply & Open Form"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

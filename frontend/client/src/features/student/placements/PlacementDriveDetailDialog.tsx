import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { studentApi } from "@/services/studentApi";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
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
  location?: string;
  min_cgpa?: number;
  max_backlogs_allowed?: number | null;
  deadline?: string;
  deadline_note?: string;
  end_date?: string;
  application_link?: string;
  required_skills?: string[];
  requirements?: string[];
  dos?: string[];
  donts?: string[];
  match?: number;
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

function formatDeadline(drive: StudentPlacementDrive) {
  if (drive.deadline_note) return drive.deadline_note;
  if (drive.deadline) return drive.deadline;
  if (drive.end_date) return new Date(drive.end_date).toLocaleDateString();
  return "As communicated by TPO";
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
    ? "border-white/10 bg-[#0c0c14]/95 text-white"
    : "border-slate-200 bg-white text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-600";
  const sectionClass = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 p-4"
    : "rounded-2xl border border-slate-200 bg-slate-50 p-4";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setAcknowledged(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${panelClass}`}>
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                {drive.companyName}
              </DialogTitle>
              <DialogDescription className={`mt-1 text-sm font-bold uppercase tracking-wider ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {drive.role}
              </DialogDescription>
              {drive.drive_name && (
                <p className={`mt-2 text-xs font-semibold ${mutedClass}`}>
                  Drive: {drive.drive_name}
                </p>
              )}
            </div>
            {typeof drive.match === "number" && (
              <div className="shrink-0 text-right">
                <p className={`text-[10px] font-black uppercase tracking-wider ${mutedClass}`}>
                  Your match
                </p>
                <p className="text-2xl font-black text-blue-500">{drive.match}%</p>
                <Progress value={drive.match} className="mt-1 h-1.5 w-20" />
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {drive.package_value != null && Number(drive.package_value) > 0 && (
              <div className={sectionClass}>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-500">
                  <Banknote className="h-3.5 w-3.5" /> CTC
                </div>
                <p className="text-sm font-black">{drive.package_value} LPA</p>
              </div>
            )}
            {drive.location && (
              <div className={sectionClass}>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-500">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </div>
                <p className="text-sm font-black">{drive.location}</p>
              </div>
            )}
            <div className={sectionClass}>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-500">
                <GraduationCap className="h-3.5 w-3.5" /> Eligibility
              </div>
              <p className="text-sm font-bold">
                {Number(drive.min_cgpa) > 0 ? `${drive.min_cgpa}+ CGPA` : "No min CGPA"}
                {drive.max_backlogs_allowed != null && (
                  <> · {drive.max_backlogs_allowed === 0 ? "No backlogs" : `Up to ${drive.max_backlogs_allowed} backlogs`}</>
                )}
              </p>
            </div>
          </div>

          <div className={sectionClass}>
            <p className={`mb-1 text-[10px] font-black uppercase tracking-wider ${mutedClass}`}>
              Deadline
            </p>
            <p className="text-sm font-bold">{formatDeadline(drive)}</p>
          </div>

          {jd && (
            <div className={sectionClass}>
              <p className={`mb-2 text-[10px] font-black uppercase tracking-wider ${mutedClass}`}>
                Job description (from TPO)
              </p>
              <p className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {jd}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div className={sectionClass}>
              <p className={`mb-2 text-[10px] font-black uppercase tracking-wider ${mutedClass}`}>
                Required skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-bold">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
            <div className={`flex items-start gap-3 rounded-2xl border p-4 ${isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}>
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className={`text-sm font-semibold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
                Your TPO has not added a Google Form link for this drive yet. Check back later or contact the placement cell.
              </p>
            </div>
          )}

          {hasFormLink && (
            <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                I have read the drive details, Do&apos;s and Don&apos;ts, and confirm I meet the eligibility criteria.
              </span>
            </label>
          )}

          {isApplied && (
            <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${isDark ? "border-blue-500/30 bg-blue-500/10 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-bold">
                You have already applied for this drive. You can reopen the form if needed.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Cancel
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

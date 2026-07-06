import { useQuery } from "@tanstack/react-query";
import { TPOApi } from "@/services/TPOApi";
import { queryKeys } from "@/lib/queryClient";
import { resolveUploadUrl } from "@/lib/authSession";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  computeReadinessScore,
  getReadinessIssues,
  getStudentStatusLabel,
} from "@/features/tpo/shared/readinessUtils";
import {
  formatApplicationStatus,
  formatPackage,
  formatPlacementDate,
  getApplicationStatusStyles,
} from "@/pages/tpo/dashboard/placementsUtils";
import { EducationProfileList } from "@/features/shared/EducationProfileList";
import {
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Loader2,
  Mail,
  Target,
  Trophy,
  Activity,
  Award,
  Code2,
  ExternalLink,
  Globe,
  FileText,
  Linkedin,
  MapPin
} from "lucide-react";

type StudentProfileDrawerProps = {
  studentId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewApplications?: () => void;
};

export function StudentProfileDrawer({
  studentId,
  open,
  onOpenChange,
  onViewApplications,
}: StudentProfileDrawerProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.TPO.studentDetail(studentId ?? "none"),
    queryFn: () => TPOApi.getStudentDetail(studentId!),
    enabled: open && studentId != null,
  });

  const readinessScore = data
    ? computeReadinessScore({
        current_cgpa: data.current_cgpa,
        active_backlogs: data.active_backlogs,
        skills_count: data.skills?.length ?? 0,
        has_resume: data.resume_url,
        is_placed: data.is_placed,
      })
    : 0;

  const status = data
    ? getStudentStatusLabel({
        current_cgpa: data.current_cgpa,
        active_backlogs: data.active_backlogs,
        skills_count: data.skills?.length ?? 0,
        has_resume: data.resume_url,
        is_placed: data.is_placed,
      })
    : null;

  const issues = data
    ? getReadinessIssues({
        current_cgpa: data.current_cgpa,
        active_backlogs: data.active_backlogs,
        skills_count: data.skills?.length ?? 0,
        has_resume: data.resume_url,
      })
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-[min(100vw,24rem)] flex-col p-0 sm:max-w-[540px] sm:w-[540px] border-border/40 bg-background/95">
        {isLoading || !data ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
              <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
              <p className="text-muted-foreground font-medium">Loading student profile...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Hero Header */}
            <div className="relative p-6 pb-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-b border-border/20">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {(data.full_name || data.email?.split('@')[0] || 'S').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl font-black text-foreground truncate">
                      {data.full_name || (data.email?.split('@')[0] || 'Student Profile').replace('.', ' ')}
                    </SheetTitle>
                    <Badge className={`rounded-full font-bold text-[9px] uppercase tracking-wider ${data.is_placed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                      {data.is_placed ? 'Placed' : 'Unplaced'}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      {data.roll_number}
                    </span>
                    <span className="h-3 w-px bg-border/40" />
                    <span>{data.branch || "No branch"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-6 pb-6">
                {/* Academic Scorecard */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Academic Scorecard
                  </h3>
                  <div className="grid grid-cols-4 gap-2.5 bg-muted/20 p-3.5 rounded-xl border border-border/30">
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">CGPA</p>
                      <p className="font-black text-base text-primary">{data.current_cgpa && !isNaN(Number(data.current_cgpa)) ? Number(data.current_cgpa).toFixed(2) : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">Backlogs</p>
                      <p className={`font-black text-base ${data.active_backlogs > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{data.active_backlogs || 0}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">10th</p>
                      <p className="font-black text-base text-foreground">{data.tenth_marks ? `${data.tenth_marks}%` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                        {data.twelfth_marks != null ? '12th' : (data.diploma_marks != null ? 'Diploma' : '12th/Diploma')}
                      </p>
                      <p className="font-black text-base text-foreground">
                        {data.twelfth_marks != null ? `${data.twelfth_marks}%` : (data.diploma_marks != null ? `${data.diploma_marks}%` : 'N/A')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education Background */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Education Background
                  </h3>
                  <EducationProfileList entries={data.education_entries} />
                </div>

                {/* Assessment Analytics */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Assessment Analytics
                  </h3>
                  {data.performance ? (
                    <div className="space-y-4 bg-muted/15 p-4 rounded-xl border border-border/30 shadow-inner">
                      {/* AMCAT Cognitive Suite */}
                      <div className="space-y-3">
                        <p className="text-[9px] font-black tracking-wider uppercase text-muted-foreground/60 border-b border-border/15 pb-1">Cognitive & Aptitude (AMCAT)</p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Quantitative Ability</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{data.performance.amcat_quant || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: `${data.performance.amcat_quant || 0}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Logical Reasoning</span>
                            <span className="text-purple-600 dark:text-purple-400">{data.performance.amcat_logical || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: `${data.performance.amcat_logical || 0}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Verbal Ability</span>
                            <span className="text-pink-600 dark:text-pink-400">{data.performance.amcat_verbal || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{ width: `${data.performance.amcat_verbal || 0}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Practical Suite */}
                      <div className="space-y-3 pt-1">
                        <p className="text-[9px] font-black tracking-wider uppercase text-muted-foreground/60 border-b border-border/15 pb-1">Practical & Communication</p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Coding Test Score</span>
                            <span className="text-blue-600 dark:text-blue-400">{data.performance.coding_test_score || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${data.performance.coding_test_score || 0}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Mock Interview Performance</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{data.performance.mock_interview_score || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: `${data.performance.mock_interview_score || 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/10 p-4 rounded-xl border border-dashed border-border/40 text-center">
                      <Activity className="w-6 h-6 text-muted-foreground/45 mx-auto mb-1.5" />
                      <p className="text-xs text-muted-foreground">No assessment reports linked yet for this student.</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    Skills & Competencies
                  </h3>
                  {data.skills && data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {data.skills.map((skill: any, idx: number) => {
                        return (
                          <Badge key={idx} variant="secondary" className={`px-2.5 py-1 text-xs font-bold rounded-lg border bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20`}>
                            {skill.name}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No skills added yet.</p>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-pink-500" />
                    Featured Projects
                  </h3>
                  {data.projects && data.projects.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {data.projects.map((project: any) => (
                        <div key={project.id} className="p-4 bg-muted/20 rounded-xl border border-border/30 hover:border-border/60 shadow-sm transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-extrabold text-sm text-foreground">{project.title}</h4>
                            {project.project_link && (
                              <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="p-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No projects added yet.</p>
                  )}
                </div>

                {/* Professional Footprint */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    Professional Footprint
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {data.resume_url ? (
                        <a href={resolveUploadUrl(data.resume_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all border border-blue-500/20 hover:bg-blue-500/15">
                          <FileText className="w-3.5 h-3.5" /> View Resume
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-2 bg-muted/40 text-muted-foreground/60 rounded-xl text-xs border border-border/30 border-dashed">
                          <FileText className="w-3.5 h-3.5 opacity-50" /> No Resume Uploaded
                        </span>
                      )}

                      {data.linkedin_url && (
                        <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/15 text-[#0A66C2] rounded-xl text-xs font-bold transition-all border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20">
                          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}

                      {data.github_url && (
                        <a href={data.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-500/10 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-500/20 hover:bg-slate-500/20">
                          <Globe className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                    </div>

                    {data.address && (
                      <div className="bg-muted/10 p-3.5 rounded-xl border border-border/20 flex gap-2.5 items-start">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Address</p>
                          <p className="text-xs text-foreground leading-relaxed">{data.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Placement Applications (TPO Specific) */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Placement applications
                    </h3>
                    {onViewApplications && (data.applications?.length ?? 0) > 0 && (
                      <button
                        type="button"
                        onClick={onViewApplications}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View in pipeline
                      </button>
                    )}
                  </div>

                  {(data.applications?.length ?? 0) === 0 ? (
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No applications yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.applications.map((app: any) => (
                        <div key={app.id} className="rounded-xl border border-border/60 bg-muted/10 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{app.company_name}</p>
                              <p className="text-sm text-muted-foreground">{app.job_title}</p>
                            </div>
                            <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getApplicationStatusStyles(app.status)}`}>
                              {formatApplicationStatus(app.status)}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{formatPackage(app.package_value)}</span>
                            <span>{formatPlacementDate(app.applied_at)}</span>
                            {app.current_round ? <span>{app.current_round}</span> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!data.is_placed && issues.length > 0 && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                      <Target className="h-4 w-4" />
                      Suggested next step
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {issues[0]?.label === "Resume not uploaded"
                        ? "Ask the student to upload a resume before the next drive."
                        : issues[0]?.label.includes("backlog")
                          ? "Schedule a meeting with the student and HOD to resolve academic blockers."
                          : "Recommend targeted skill training based on upcoming drive requirements."}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Sticky Action Footer */}
            <SheetFooter className="p-4 border-t border-border/20 bg-muted/20">
              <Button variant="outline" className="w-full rounded-xl border-border/40 hover:bg-muted/50 h-10 font-bold" onClick={() => onOpenChange(false)}>
                Close Profile
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

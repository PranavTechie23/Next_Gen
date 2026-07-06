import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TPOApi } from "@/services/TPOApi";
import { queryKeys } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentProfileDrawer } from "@/features/tpo/students/StudentProfileDrawer";
import { UpdateApplicationStatusDialog } from "@/features/tpo/placements/UpdateApplicationStatusDialog";
import {
  APPLICATION_STATUS_OPTIONS,
  formatApplicationStatus,
  formatPackage,
  formatPlacementDate,
  getApplicationStatusStyles,
  getStudentDisplayName,
  getStudentInitials,
  type PlacementApplication,
} from "@/pages/tpo/dashboard/placementsUtils";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

const PLACEMENTS_PER_PAGE = 12;

const PIPELINE_STAGES = [
  { value: "all", label: "All" },
  { value: "APPLIED", label: "Applied" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview" },
  { value: "SELECTED", label: "Selected" },
  { value: "REJECTED", label: "Rejected" },
] as const;

type TPOPlacementsTabProps = {
  branchOptions: { branch: string }[];
  initialSearch?: string;
};

export function TPOPlacementsTab({ branchOptions, initialSearch = "" }: TPOPlacementsTabProps) {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [status, setStatus] = useState("all");
  const [branch, setBranch] = useState("all");
  const [company, setCompany] = useState("all");
  const [drive, setDrive] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<PlacementApplication | null>(null);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setDebouncedSearch(initialSearch);
      setPage(1);
    }
  }, [initialSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: companiesData } = useQuery({
    queryKey: queryKeys.TPO.companies,
    queryFn: () => TPOApi.getCompanies(),
  });

  const { data: drivesData } = useQuery({
    queryKey: queryKeys.TPO.drives,
    queryFn: () => TPOApi.getDrives(),
  });

  const companies: { company_name?: string; id?: number }[] = Array.isArray(companiesData)
    ? companiesData
    : companiesData?.companies ?? [];
  const drives: { id: number; role?: string; companyName?: string; drive_name?: string }[] =
    drivesData?.drives ?? [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.TPO.applications({
      page,
      limit: PLACEMENTS_PER_PAGE,
      search: debouncedSearch,
      status,
      branch,
      company,
      drive,
    }),
    queryFn: () =>
      TPOApi.getApplications({
        page,
        limit: PLACEMENTS_PER_PAGE,
        search: debouncedSearch,
        status,
        branch,
        company,
        drive,
      }),
  });

  const applications = data?.applications ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};

  const openStatusDialog = (application: PlacementApplication) => {
    setSelectedApplication(application);
    setStatusDialogOpen(true);
  };

  const openStudentProfile = (studentId?: number) => {
    if (!studentId) return;
    setSelectedStudentId(studentId);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Total Applications</p>
                <p className="text-4xl font-black text-foreground">
                  {(summary.total ?? pagination.totalItems ?? 0).toLocaleString()}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Offers (Selected)</p>
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {(summary.selected ?? 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">In Pipeline</p>
                <p className="text-4xl font-black text-foreground">{(summary.inPipeline ?? 0).toLocaleString()}</p>
              </div>
              <Clock className="h-10 w-10 text-violet-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Avg. Package</p>
                <p className="text-4xl font-black text-primary">
                  {summary.avgPackage != null ? `${summary.avgPackage} LPA` : "—"}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage.value}
            type="button"
            onClick={() => {
              setStatus(stage.value);
              setPage(1);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              status === stage.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50"
            )}
          >
            {stage.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, company, role, or drive..."
            className="h-12 pl-10"
          />
        </div>
        <Select value={company} onValueChange={(value) => { setCompany(value); setPage(1); }}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => {
              const name = c.company_name ?? (c as any).name;
              if (!name) return null;
              return (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={drive} onValueChange={(value) => { setDrive(value); setPage(1); }}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="All Drives" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drives</SelectItem>
            {drives.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {(d as any).drive_name || d.role || `${d.companyName} Drive`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={branch} onValueChange={(value) => { setBranch(value); setPage(1); }}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branchOptions.map((b) => (
              <SelectItem key={b.branch} value={b.branch}>
                {b.branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden border border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/30">
                <tr>
                  {["Student", "Company / Drive", "Role", "Package", "Applied", "Stage", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-t border-border/10">
                      {Array.from({ length: 7 }).map((__, cellIdx) => (
                        <td key={cellIdx} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : applications.length > 0 ? (
                  applications.map((placement: PlacementApplication) => {
                    const studentName = getStudentDisplayName(placement);
                    return (
                      <tr key={placement.id ?? `${placement.student_id}-${placement.job_title}`} className="border-t border-border/10 transition-colors hover:bg-muted/40">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {getStudentInitials(studentName)}
                            </div>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => openStudentProfile(placement.student_id)}
                                className="truncate font-semibold text-foreground hover:text-primary hover:underline"
                              >
                                {studentName}
                              </button>
                              {placement.student_email && (
                                <p className="truncate text-xs text-muted-foreground">{placement.student_email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <div>
                              <span className="font-medium text-foreground">{placement.company_name || "—"}</span>
                              {(placement as any).drive_name && (
                                <p className="text-xs text-muted-foreground">{(placement as any).drive_name}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-foreground">{placement.job_title || "—"}</td>
                        <td className="px-5 py-4 font-semibold text-primary">{formatPackage(placement.package_value)}</td>
                        <td className="px-5 py-4 text-muted-foreground">{formatPlacementDate(placement.applied_at)}</td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getApplicationStatusStyles(placement.status)}`}>
                              {formatApplicationStatus(placement.status)}
                            </span>
                            {placement.current_round && (
                              <p className="text-[10px] text-muted-foreground">{placement.current_round}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openStudentProfile(placement.student_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openStatusDialog(placement)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                          <Briefcase className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-base font-semibold text-foreground">No applications in pipeline</p>
                        <p className="text-sm text-muted-foreground">
                          {search || status !== "all" || branch !== "all" || company !== "all" || drive !== "all"
                            ? "Try adjusting your filters."
                            : "Applications appear here once students apply to placement drives."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching || page >= (pagination.totalPages || 1)}
            onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          {isFetching && (
            <Badge variant="secondary" className="ml-1">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Updating
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Page {pagination.currentPage || page} of {pagination.totalPages || 1} · {pagination.totalItems ?? 0} applications
        </div>
      </div>

      <StudentProfileDrawer
        studentId={selectedStudentId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <UpdateApplicationStatusDialog
        application={selectedApplication}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </>
  );
}

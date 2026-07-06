import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TPOApi } from "@/services/TPOApi";
import { deptApi } from "@/services/deptApi";
import { queryKeys } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentProfileDrawer } from "@/features/tpo/students/StudentProfileDrawer";
import {
  computeReadinessScore,
  getProfileCompleteness,
  getStudentStatusLabel,
} from "@/features/tpo/shared/readinessUtils";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  Upload,
  Users,
} from "lucide-react";

const STUDENTS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { value: "all", label: "All Students" },
  { value: "ready", label: "Placement Ready" },
  { value: "at_risk", label: "At Risk" },
  { value: "placed", label: "Placed" },
  { value: "unplaced", label: "Unplaced" },
] as const;

type TPOStudentsTabProps = {
  branchOptions: { branch: string }[];
  onNavigateToPlacements?: (search?: string) => void;
};

export function TPOStudentsTab({ branchOptions, onNavigateToPlacements }: TPOStudentsTabProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.TPO.students({
      page,
      limit: STUDENTS_PER_PAGE,
      search: debouncedSearch,
      branch,
      status,
    }),
    queryFn: () =>
      TPOApi.getStudents({
        page,
        limit: STUDENTS_PER_PAGE,
        search: debouncedSearch,
        branch,
        status,
      }),
  });

  const students = data?.students ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};

  const openProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setDrawerOpen(true);
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      await deptApi.uploadStudentsExcel(file);
      toast.success("Students data uploaded successfully.");
      void queryClient.invalidateQueries({ queryKey: ["TPO", "students"] });
    } catch {
      toast.error("Failed to upload students data.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Total Students</p>
                <p className="text-4xl font-black text-foreground">{(summary.total ?? 0).toLocaleString()}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Placement Ready</p>
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {(summary.placementReady ?? 0).toLocaleString()}
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
                <p className="mb-2 text-base font-semibold text-muted-foreground">At Risk</p>
                <p className="text-4xl font-black text-red-600 dark:text-red-400">
                  {(summary.atRisk ?? 0).toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-base font-semibold text-muted-foreground">Placed</p>
                <p className="text-4xl font-black text-violet-600 dark:text-violet-400">
                  {(summary.placed ?? 0).toLocaleString()}
                </p>
              </div>
              <Award className="h-10 w-10 text-violet-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, branch, or email..."
            className="h-12 pl-10"
          />
        </div>
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
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="All Students" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
                  {["Student", "Branch", "Academics", "Readiness", "Profile", "Applications", "Status", ""].map((col) => (
                    <th
                      key={col || "actions"}
                      className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-t border-border/10">
                      {Array.from({ length: 8 }).map((__, cellIdx) => (
                        <td key={cellIdx} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : students.length > 0 ? (
                  students.map((student: any) => {
                    const readiness = computeReadinessScore(student);
                    const completeness = getProfileCompleteness(student);
                    const statusMeta = getStudentStatusLabel(student);
                    const displayName = student.full_name || student.roll_number;

                    return (
                      <tr
                        key={student.user_id}
                        className="border-t border-border/10 transition-colors hover:bg-muted/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {(displayName || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">{displayName}</p>
                              <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium text-muted-foreground">{student.branch || "—"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-foreground">{Number(student.current_cgpa).toFixed(2)} CGPA</p>
                          <p className="text-xs text-muted-foreground">{student.active_backlogs ?? 0} backlogs</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full ${readiness >= 70 ? "bg-emerald-500" : readiness >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${readiness}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">{readiness}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">{completeness}% complete</p>
                            <div className="flex gap-1">
                              {student.has_resume ? (
                                <Badge variant="outline" className="text-[10px]">Resume</Badge>
                              ) : (
                                <Badge variant="outline" className="border-amber-300 text-[10px] text-amber-700">No resume</Badge>
                              )}
                              <Badge variant="outline" className="text-[10px]">{student.skills_count ?? 0} skills</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {Number(student.application_count) > 0 ? (
                            <button
                              type="button"
                              onClick={() => onNavigateToPlacements?.(student.roll_number || student.email)}
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              {student.application_count} applied
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">None yet</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openProfile(student.user_id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                          <Users className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-base font-semibold text-foreground">No students found</p>
                        <p className="text-sm text-muted-foreground">
                          {search || status !== "all" || branch !== "all"
                            ? "Try adjusting your search or filters."
                            : "Import your student roster via Excel to get started."}
                        </p>
                        {!search && status === "all" && branch === "all" && (
                          <Button size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                            <Upload className="h-4 w-4" />
                            Import Excel
                          </Button>
                        )}
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
          Page {pagination.currentPage || page} of {pagination.totalPages || 1} · {pagination.totalItems ?? 0} students
        </div>
      </div>

      <StudentProfileDrawer
        studentId={selectedStudentId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onViewApplications={() => {
          setDrawerOpen(false);
          const student = students.find((s: any) => s.user_id === selectedStudentId);
          onNavigateToPlacements?.(student?.roll_number || student?.email);
        }}
      />
    </>
  );
}

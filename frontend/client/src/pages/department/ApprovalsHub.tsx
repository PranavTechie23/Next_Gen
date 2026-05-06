import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { deptApi } from '@/services/deptApi';
import { toast } from 'sonner';

export type ActionFilter = 'all' | 'critical' | 'profile' | 'eligible' | 'placed';

type StudentSummary = {
  user_id: string | number;
  roll_number?: string;
  email?: string;
  current_cgpa?: number | string | null;
  active_backlogs?: number | string | null;
  is_placed?: number | boolean;
  resume_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  readiness: number;
  readiness_band?: string;
  profile_completeness?: number;
  issues: string[];
  issue_count?: number;
};

function isPlaced(student: StudentSummary) {
  return student.is_placed === true || student.is_placed === 1;
}

function studentName(student: StudentSummary) {
  return student.email?.split('@')[0] || student.roll_number || 'Student';
}

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getReadiness(student: StudentSummary) {
  const cgpa = numberValue(student.current_cgpa);
  const backlogs = numberValue(student.active_backlogs);
  let score = 25;

  if (cgpa >= 8) score += 25;
  else if (cgpa >= 7) score += 18;
  else if (cgpa >= 6) score += 10;

  if (backlogs === 0) score += 20;
  if (student.resume_url) score += 15;
  if (student.linkedin_url || student.github_url) score += 15;

  return Math.min(score, 100);
}

function getIssues(student: StudentSummary) {
  const issues: string[] = [];
  const cgpa = numberValue(student.current_cgpa);
  const backlogs = numberValue(student.active_backlogs);

  if (!student.current_cgpa) issues.push('CGPA missing');
  else if (cgpa < 7) issues.push('Below 7.0 CGPA');
  if (backlogs > 0) issues.push(`${backlogs} active backlog${backlogs > 1 ? 's' : ''}`);
  if (!student.resume_url) issues.push('Resume missing');
  if (!student.linkedin_url && !student.github_url) issues.push('Profile links missing');

  return issues;
}

function readinessTone(score: number) {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function ApprovalsHub({
  externalSearch = '',
  initialFilter = 'all',
}: {
  externalSearch?: string;
  initialFilter?: ActionFilter;
}) {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(externalSearch);
  const [filter, setFilter] = useState<ActionFilter>(initialFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await deptApi.getDepartmentStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch department action data:', error);
      toast.error('Failed to load action center');
    } finally {
      setLoading(false);
    }
  };

  const enrichedStudents = useMemo(
    () =>
      students.map((student) => {
        const readiness = getReadiness(student);
        const issues = getIssues(student);
        return { ...student, readiness, issues };
      }),
    [students],
  );

  const stats = useMemo(() => {
    const total = enrichedStudents.length;
    const placed = enrichedStudents.filter(isPlaced).length;
    const ready = enrichedStudents.filter((student) => student.readiness >= 80 && !isPlaced(student)).length;
    const critical = enrichedStudents.filter((student) => student.issues.length >= 2 && !isPlaced(student)).length;
    const missingResume = enrichedStudents.filter((student) => !student.resume_url && !isPlaced(student)).length;

    return { total, placed, ready, critical, missingResume };
  }, [enrichedStudents]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return enrichedStudents
      .filter((student) => {
        const matchesSearch =
          !term ||
          student.roll_number?.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term);

        if (!matchesSearch) return false;
        if (filter === 'critical') return student.issues.length >= 2 && !isPlaced(student);
        if (filter === 'profile') return (!student.resume_url || (!student.linkedin_url && !student.github_url)) && !isPlaced(student);
        if (filter === 'eligible') return student.readiness >= 80 && !isPlaced(student);
        if (filter === 'placed') return isPlaced(student);
        return true;
      })
      .sort((a, b) => {
        if (isPlaced(a) !== isPlaced(b)) return isPlaced(a) ? 1 : -1;
        return a.readiness - b.readiness;
      });
  }, [enrichedStudents, filter, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleExport = async () => {
    try {
      setExporting(true);
      await deptApi.downloadStudentReadinessCsv();
      toast.success('Student readiness export downloaded.');
    } catch (error) {
      console.error('Failed to export readiness CSV:', error);
      toast.error('Could not export readiness data');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Initializing Action Center...</p>
        </div>
      </div>
    );
  }

  const filters: { id: ActionFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Students', count: stats.total },
    { id: 'critical', label: 'Follow-up', count: stats.critical },
    { id: 'profile', label: 'Gaps', count: stats.missingResume },
    { id: 'eligible', label: 'Ready', count: stats.ready },
    { id: 'placed', label: 'Placed', count: stats.placed },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-500/10 dark:border-white/5 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 dark:from-blue-600/10 dark:to-purple-600/10 p-8 lg:p-12">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-500">
              <Sparkles className="h-3 w-3" />
              Intelligence Engine Active
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
              Student <span className="text-blue-500">Readiness</span> Desk
            </h1>
            <p className="max-w-2xl text-base font-medium text-muted-foreground/80 leading-relaxed">
              Real-time intelligence on student placement eligibility and academic progress. 
              Spot bottlenecks before they impact your department's success.
            </p>
          </div>
          <Button 
            onClick={handleExport} 
            disabled={exporting} 
            size="lg"
            className="h-14 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-white/90 shadow-2xl shadow-blue-500/10 dark:shadow-white/10 px-8 font-bold transition-all active:scale-95"
          >
            {exporting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
            Export Intelligence
          </Button>
        </div>
        
        {/* Background Glows */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Modern Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Strength', value: stats.total, icon: Users, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
          { label: 'Market Ready', value: stats.ready, icon: UserCheck, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
          { label: 'Risk Factor', value: stats.critical, icon: ShieldAlert, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
          { label: 'Success Ratio', value: stats.placed, icon: Briefcase, color: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-border/40 dark:border-white/5 bg-background/60 dark:bg-[#0c0c14]/40 backdrop-blur-3xl rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5">
            <CardContent className="flex items-center gap-5 p-6">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.color} ${stat.shadow} shadow-lg transition-transform group-hover:rotate-6`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Control Panel */}
      <Card className="overflow-hidden border-border/40 dark:border-white/5 bg-background/60 dark:bg-[#0c0c14]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-xl shadow-black/5">
        <CardContent className="p-0">
          <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between border-b border-border/40 dark:border-white/5 bg-muted/30 dark:bg-white/5">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find student by roll or email..."
                className="w-full rounded-2xl border border-border/40 dark:border-white/5 bg-background/60 dark:bg-black/40 h-14 pl-12 pr-6 text-sm font-bold text-foreground outline-none transition-all focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`flex items-center gap-3 px-5 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === item.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-muted dark:bg-white/5 text-muted-foreground hover:bg-muted/80 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white'
                  } border border-border/40 dark:border-transparent`}
                >
                  {item.label}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${filter === item.id ? 'bg-white/20' : 'bg-white/5'}`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {paginatedStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Zero Critical Issues Found</h3>
              <p className="mt-2 max-w-sm text-sm font-medium text-muted-foreground/60">
                All students in this category are meeting the current requirements. Great work!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40 dark:divide-white/5">
              {paginatedStudents.map((student) => (
                <div key={student.user_id} className="group grid gap-6 p-8 transition-all hover:bg-muted/30 dark:hover:bg-white/[0.02] lg:grid-cols-[1.5fr_1fr_1.5fr_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate text-lg font-black text-foreground group-hover:text-blue-500 transition-colors">
                        {studentName(student)}
                      </h3>
                      <Badge className={`${isPlaced(student) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} border-none font-black text-[10px] uppercase tracking-widest`}>
                        {isPlaced(student) ? 'Success' : 'Active'}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-muted-foreground/60">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        {student.roll_number || 'STU-000'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        {student.email || 'pending@campus.edu'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Readiness Matrix</span>
                      <span className={`text-sm font-black ${readinessTone(student.readiness)}`}>{student.readiness}%</span>
                    </div>
                    <Progress value={student.readiness} className="h-2 bg-muted dark:bg-white/5" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {student.issues.length === 0 ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[11px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4" />
                        Optimized
                      </div>
                    ) : (
                      student.issues.slice(0, 2).map((issue) => (
                        <div key={issue} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-3 w-3" />
                          {issue}
                        </div>
                      ))
                    )}
                    {student.issues.length > 2 && (
                      <div className="px-3 py-2 rounded-xl bg-white/5 text-muted-foreground text-[10px] font-black">
                        +{student.issues.length - 2} MORE
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center justify-center w-16 h-12 rounded-xl border border-border/40 dark:border-white/5 bg-muted/40 dark:bg-black/20">
                        <span className="text-[9px] font-black text-muted-foreground/60 dark:text-muted-foreground/40 uppercase">CGPA</span>
                        <span className="text-xs font-black">{student.current_cgpa || '0.0'}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center w-16 h-12 rounded-xl border border-border/40 dark:border-white/5 bg-muted/40 dark:bg-black/20">
                        <span className="text-[9px] font-black text-muted-foreground/60 dark:text-muted-foreground/40 uppercase">B-Log</span>
                        <span className="text-xs font-black">{student.active_backlogs || 0}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-blue-500/10 hover:text-blue-500">
                      <TrendingUp className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-8 border-t border-border/40 dark:border-white/5 bg-muted/10 dark:bg-white/[0.01]">
              <p className="text-xs font-bold text-muted-foreground/60">
                Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of {filteredStudents.length} students
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-white/5 bg-transparent hover:bg-white/5 font-bold"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 p-0 rounded-xl font-bold ${currentPage === page ? 'bg-blue-500 text-white' : 'border-white/5 bg-transparent hover:bg-white/5'}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-white/5 bg-transparent hover:bg-white/5 font-bold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actionable Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Strategic Follow-up', desc: 'Prioritize students with multiple risk factors to improve overall department eligibility.', icon: Target, color: 'text-blue-500' },
          { title: 'Portfolio Excellence', desc: 'Ensure all students have verified resume and professional profile links before major drives.', icon: FileText, color: 'text-emerald-500' },
          { title: 'Intelligence Export', desc: 'Generate point-in-time readiness snapshots for institutional reporting and drive planning.', icon: TrendingUp, color: 'text-purple-500' },
        ].map((item, i) => (
          <Card key={i} className="border-border/40 dark:border-white/5 bg-background/60 dark:bg-[#0c0c14]/40 backdrop-blur-3xl rounded-3xl p-6 shadow-sm">
            <CardContent className="p-0">
              <item.icon className={`mb-4 h-6 w-6 ${item.color}`} />
              <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground/60 leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

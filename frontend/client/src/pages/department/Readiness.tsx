import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MousePointer,
  Rocket,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { deptApi } from '@/services/deptApi';
import { toast } from 'sonner';

// --- Expanded Student Profile Model ---
type StudentProfile = {
  // Basic Info
  user_id: string | number;
  roll_number?: string;
  email?: string;
  name?: string;
  department?: string;
  year_of_study?: number;
  
  // Academics
  current_cgpa?: number | string | null;
  active_backlogs?: number | string | null;
  tenth_percentage?: number | string | null;
  twelfth_percentage?: number | string | null;
  diploma_percentage?: number | string | null;
  academic_achievements?: string[];
  
  // Technical Skills
  technical_skills?: string[];
  certifications?: string[];
  coding_platforms?: {
    leetcode?: string;
    hackerrank?: string;
    codeforces?: string;
    github_stars?: number;
    total_commits?: number;
  };
  projects?: {
    title: string;
    tech_stack: string[];
    link?: string;
  }[];
  
  // Professional Presence
  resume_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  personal_website?: string | null;
  
  // Soft Skills & Extracurricular
  soft_skills?: string[];
  extracurricular?: string[];
  leadership_roles?: string[];
  internships?: {
    company: string;
    role: string;
    duration: string;
  }[];
  
  // Placement Status
  is_placed?: number | boolean;
  placed_company?: string;
  placed_package?: number;
  interview_experience?: number; // number of interviews attended
  
  // Engagement Metrics
  profile_last_updated?: string;
  placement_drive_attendance?: number;
  mock_interview_attended?: boolean;
  resume_review_attended?: boolean;
  workshop_attended?: string[];
};

// --- Multi-Dimensional Readiness Weights ---
const READINESS_WEIGHTS = {
  ACADEMICS: 0.25,
  TECHNICAL_SKILLS: 0.25,
  PROFESSIONAL_PRESENCE: 0.20,
  SOFT_SKILLS: 0.15,
  PLACEMENT_PREPAREDNESS: 0.15,
};

// --- Scoring Functions ---

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isPlaced(student: StudentProfile) {
  return student.is_placed === true || student.is_placed === 1;
}

// 1. Academic Score (25%)
function calculateAcademicScore(student: StudentProfile): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;
  
  const cgpa = numberValue(student.current_cgpa);
  const backlogs = numberValue(student.active_backlogs);
  const tenth = numberValue(student.tenth_percentage);
  const twelfth = numberValue(student.twelfth_percentage);
  const diploma = numberValue(student.diploma_percentage);
  const max12thOrDiploma = Math.max(twelfth, diploma);
  
  // CGPA (10 points)
  if (cgpa >= 8.5) { score += 10; details.push('Excellent CGPA (8.5+)'); }
  else if (cgpa >= 7.5) { score += 8; details.push('Good CGPA (7.5+)'); }
  else if (cgpa >= 6.5) { score += 6; details.push('Satisfactory CGPA'); }
  else if (cgpa >= 5.5) { score += 4; details.push('Needs improvement'); }
  else if (cgpa > 0) { score += 2; details.push('Critical - CGPA below 5.5'); }
  else { details.push('CGPA not recorded'); }
  
  // Backlogs (8 points)
  if (backlogs === 0) { score += 8; details.push('No active backlogs'); }
  else if (backlogs <= 2) { score += 4; details.push(`${backlogs} backlog(s) - manageable`); }
  else { details.push(`${backlogs} backlogs - urgent attention needed`); }
  
  // 10th/12th/Diploma performance (7 points)
  if (tenth >= 75 || max12thOrDiploma >= 75) {
    score += 4;
    details.push('Strong 10th/12th/Diploma performance');
  } else if (tenth >= 60 || max12thOrDiploma >= 60) {
    score += 2;
    details.push('Average 10th/12th/Diploma scores');
  }
  
  // Academic achievements
  if (student.academic_achievements && student.academic_achievements.length > 0) {
    score += 3;
    details.push(`${student.academic_achievements.length} academic achievements`);
  }
  
  return { score: Math.min(score, 25), details };
}

// 2. Technical Skills Score (25%)
function calculateTechnicalScore(student: StudentProfile): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;
  
  const skills = student.technical_skills || [];
  const certifications = student.certifications || [];
  const projects = student.projects || [];
  const coding = student.coding_platforms || {};
  
  // Skills breadth and depth (8 points)
  if (skills.length >= 10) { score += 8; details.push('Extensive tech stack (10+ skills)'); }
  else if (skills.length >= 6) { score += 6; details.push('Good tech stack'); }
  else if (skills.length >= 3) { score += 3; details.push('Basic tech skills'); }
  else { details.push('Limited technical skills'); }
  
  // Skills relevance - check for in-demand skills
  const inDemandSkills = ['Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'SQL', 'JavaScript', 'TypeScript', 'C++', 'Spring Boot'];
  const relevantSkills = skills.filter(s => inDemandSkills.some(demand => s.toLowerCase().includes(demand.toLowerCase())));
  if (relevantSkills.length >= 3) {
    score += 4;
    details.push(`${relevantSkills.length} in-demand skills`);
  }
  
  // Projects (7 points)
  if (projects.length >= 4) { score += 7; details.push('Strong project portfolio (4+)'); }
  else if (projects.length >= 2) { score += 4; details.push(`${projects.length} quality projects`); }
  else if (projects.length >= 1) { score += 2; details.push('At least 1 project'); }
  else { details.push('No projects listed'); }
  
  // Coding platforms (5 points)
  const hasLeetcode = !!coding.leetcode;
  const hasHackerrank = !!coding.hackerrank;
  const hasCodeforces = !!coding.codeforces;
  const platformCount = [hasLeetcode, hasHackerrank, hasCodeforces].filter(Boolean).length;
  
  if (platformCount >= 2) { score += 5; details.push('Active on multiple coding platforms'); }
  else if (platformCount >= 1) { score += 3; details.push('Active on coding platform'); }
  else { details.push('No coding platform presence'); }
  
  // Certifications (5 points)
  if (certifications.length >= 3) { score += 5; details.push(`${certifications.length} certifications`); }
  else if (certifications.length >= 1) { score += 3; details.push(`${certifications.length} certification(s)`); }
  
  return { score: Math.min(score, 25), details };
}

// 3. Professional Presence Score (20%)
function calculatePresenceScore(student: StudentProfile): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;
  
  // Resume (5 points)
  if (student.resume_url) {
    score += 5;
    details.push('Resume uploaded');
  } else {
    details.push('Resume missing - critical');
  }
  
  // LinkedIn (5 points)
  if (student.linkedin_url) {
    score += 5;
    details.push('LinkedIn profile present');
    
    // Check LinkedIn completeness - if URL has "linkedin.com/in/" it's likely a full profile
    if (student.linkedin_url.includes('linkedin.com/in/')) {
      score += 2;
      details.push('Complete LinkedIn profile');
    }
  } else {
    details.push('LinkedIn missing - important for networking');
  }
  
  // GitHub/Portfolio (5 points)
  if (student.github_url) {
    score += 3;
    details.push('GitHub presence');
    
    // Check for activity indicators
    if (student.coding_platforms?.github_stars && student.coding_platforms.github_stars > 5) {
      score += 2;
      details.push('Active GitHub with stars');
    }
  }
  
  if (student.portfolio_url || student.personal_website) {
    score += 2;
    details.push('Personal portfolio/website');
  }
  
  if (!student.github_url && !student.portfolio_url) {
    details.push('No GitHub or portfolio - consider adding');
  }
  
  return { score: Math.min(score, 20), details };
}

// 4. Soft Skills & Extracurricular Score (15%)
function calculateSoftSkillsScore(student: StudentProfile): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;
  
  const softSkills = student.soft_skills || [];
  const extracurricular = student.extracurricular || [];
  const leadership = student.leadership_roles || [];
  const internships = student.internships || [];
  
  // Soft skills (5 points)
  if (softSkills.length >= 5) { score += 5; details.push('Strong soft skills profile'); }
  else if (softSkills.length >= 3) { score += 3; details.push('Good soft skills'); }
  else if (softSkills.length >= 1) { score += 1; details.push('Basic soft skills'); }
  else { details.push('Soft skills not listed'); }
  
  // Extracurricular (4 points)
  if (extracurricular.length >= 3) { score += 4; details.push('Active extracurricular involvement'); }
  else if (extracurricular.length >= 1) { score += 2; details.push(`${extracurricular.length} extracurricular activity`); }
  else { details.push('No extracurricular activities'); }
  
  // Leadership (3 points)
  if (leadership.length >= 2) { score += 3; details.push('Strong leadership experience'); }
  else if (leadership.length >= 1) { score += 2; details.push(`${leadership.length} leadership role`); }
  
  // Internships (3 points)
  if (internships.length >= 2) { score += 3; details.push('Multiple internships'); }
  else if (internships.length >= 1) { score += 2; details.push(`${internships.length} internship experience`); }
  else { details.push('No internship experience'); }
  
  return { score: Math.min(score, 15), details };
}

// 5. Placement Preparedness Score (15%)
function calculatePreparednessScore(student: StudentProfile): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;
  
  // Mock interview (4 points)
  if (student.mock_interview_attended) {
    score += 4;
    details.push('Mock interview attended');
  } else {
    details.push('Mock interview not attended - recommended');
  }
  
  // Resume review (3 points)
  if (student.resume_review_attended) {
    score += 3;
    details.push('Resume review attended');
  } else {
    details.push('Resume review not attended');
  }
  
  // Workshops (4 points)
  const workshops = student.workshop_attended || [];
  if (workshops.length >= 3) { score += 4; details.push('Attended 3+ workshops'); }
  else if (workshops.length >= 1) { score += 2; details.push(`Attended ${workshops.length} workshop(s)`); }
  else { details.push('No workshops attended'); }
  
  // Placement drive attendance (4 points)
  const attendance = student.placement_drive_attendance || 0;
  if (attendance >= 5) { score += 4; details.push('Regular placement drive attendance'); }
  else if (attendance >= 2) { score += 2; details.push(`${attendance} placement drives attended`); }
  else { details.push('Low placement drive attendance'); }
  
  return { score: Math.min(score, 15), details };
}

// --- Main Readiness Calculation ---
function calculateReadiness(student: StudentProfile): {
  overall: number;
  components: {
    academics: { score: number; max: number; percentage: number; details: string[] };
    technical: { score: number; max: number; percentage: number; details: string[] };
    presence: { score: number; max: number; percentage: number; details: string[] };
    softSkills: { score: number; max: number; percentage: number; details: string[] };
    preparedness: { score: number; max: number; percentage: number; details: string[] };
  };
  summary: string;
  recommendations: string[];
  category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'critical';
} {
  const academics = calculateAcademicScore(student);
  const technical = calculateTechnicalScore(student);
  const presence = calculatePresenceScore(student);
  const softSkills = calculateSoftSkillsScore(student);
  const preparedness = calculatePreparednessScore(student);
  
  // Weighted components
  const academicWeighted = (academics.score / 25) * 100 * READINESS_WEIGHTS.ACADEMICS;
  const technicalWeighted = (technical.score / 25) * 100 * READINESS_WEIGHTS.TECHNICAL_SKILLS;
  const presenceWeighted = (presence.score / 20) * 100 * READINESS_WEIGHTS.PROFESSIONAL_PRESENCE;
  const softSkillsWeighted = (softSkills.score / 15) * 100 * READINESS_WEIGHTS.SOFT_SKILLS;
  const preparednessWeighted = (preparedness.score / 15) * 100 * READINESS_WEIGHTS.PLACEMENT_PREPAREDNESS;
  
  const overall = Math.round(academicWeighted + technicalWeighted + presenceWeighted + softSkillsWeighted + preparednessWeighted);
  
  // Category determination
  let category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'critical';
  if (overall >= 85) category = 'platinum';
  else if (overall >= 70) category = 'gold';
  else if (overall >= 55) category = 'silver';
  else if (overall >= 40) category = 'bronze';
  else category = 'critical';
  
  // Generate summary
  const allDetails = [...academics.details, ...technical.details, ...presence.details, ...softSkills.details, ...preparedness.details];
  const strengths = allDetails.filter(d => d.includes('Excellent') || d.includes('Strong') || d.includes('Good') || d.includes('Active'));
  const weaknesses = allDetails.filter(d => d.includes('missing') || d.includes('critical') || d.includes('Needs') || d.includes('No') || d.includes('Limited'));
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (weaknesses.length > 0) {
    recommendations.push(`Focus on improving: ${weaknesses.slice(0, 3).join('; ')}`);
  }
  if (!student.resume_url) recommendations.push('Upload resume immediately');
  if (!student.linkedin_url) recommendations.push('Create and optimize LinkedIn profile');
  if ((student.technical_skills || []).length < 5) recommendations.push('Expand technical skills with in-demand technologies');
  if ((student.projects || []).length < 2) recommendations.push('Build 1-2 quality projects to showcase');
  if (!student.mock_interview_attended) recommendations.push('Attend mock interview for practice');
  if (recommendations.length === 0) {
    recommendations.push('Maintain strong profile and start applying to target companies');
    if (!isPlaced(student)) {
      recommendations.push('Consider applying to Dream and Super Dream companies');
    }
  }
  
  return {
    overall,
    components: {
      academics: { score: academics.score, max: 25, percentage: Math.round((academics.score / 25) * 100), details: academics.details },
      technical: { score: technical.score, max: 25, percentage: Math.round((technical.score / 25) * 100), details: technical.details },
      presence: { score: presence.score, max: 20, percentage: Math.round((presence.score / 20) * 100), details: presence.details },
      softSkills: { score: softSkills.score, max: 15, percentage: Math.round((softSkills.score / 15) * 100), details: softSkills.details },
      preparedness: { score: preparedness.score, max: 15, percentage: Math.round((preparedness.score / 15) * 100), details: preparedness.details },
    },
    summary: `${strengths.length > 0 ? `Strengths: ${strengths.slice(0, 2).join(', ')}` : 'Needs significant improvement'}${weaknesses.length > 0 ? ` | Areas to work: ${weaknesses.slice(0, 2).join(', ')}` : ''}`,
    recommendations,
    category,
  };
}

export type ActionFilter = 'all' | 'critical' | 'profile' | 'eligible' | 'placed';

type EnrichedStudent = StudentProfile & {
  readiness: ReturnType<typeof calculateReadiness>;
};

// --- Main Component ---
export function ReadinessHub({
  externalSearch = '',
  initialFilter = 'all',
  hideStats = false,
}: {
  externalSearch?: string;
  initialFilter?: ActionFilter;
  hideStats?: boolean;
}): React.JSX.Element {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(externalSearch);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'bottlenecks']));
  const [selectedStudent, setSelectedStudent] = useState<EnrichedStudent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await deptApi.getDepartmentStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch department readiness page data:', error);
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  // Enrich students with readiness data
  const enrichedStudents = useMemo(() => {
    return students.map(student => {
      const readiness = calculateReadiness(student);
      return { ...student, readiness };
    });
  }, [students]);

  // Department-level insights
  const insights = useMemo(() => {
    const total = enrichedStudents.length;
    const placed = enrichedStudents.filter(isPlaced).length;
    const unplaced = enrichedStudents.filter(s => !isPlaced(s));
    
    
    // Component averages
    const componentAverages = {
      academics: total ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.readiness.components.academics.percentage, 0) / total) : 0,
      technical: total ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.readiness.components.technical.percentage, 0) / total) : 0,
      presence: total ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.readiness.components.presence.percentage, 0) / total) : 0,
      softSkills: total ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.readiness.components.softSkills.percentage, 0) / total) : 0,
      preparedness: total ? Math.round(enrichedStudents.reduce((sum, s) => sum + s.readiness.components.preparedness.percentage, 0) / total) : 0,
    };
    
    // Top bottlenecks by component
    const componentScores = [
      { name: 'Professional Presence', avg: componentAverages.presence, key: 'presence' },
      { name: 'Placement Prep', avg: componentAverages.preparedness, key: 'preparedness' },
      { name: 'Technical Skills', avg: componentAverages.technical, key: 'technical' },
      { name: 'Soft Skills', avg: componentAverages.softSkills, key: 'softSkills' },
      { name: 'Academics', avg: componentAverages.academics, key: 'academics' },
    ].sort((a, b) => a.avg - b.avg);
    
   
    
    // Students needing urgent attention
    const urgentAttention: EnrichedStudent[] = (unplaced
      .filter(s => s.readiness.category === 'critical')
      .sort((a, b) => a.readiness.overall - b.readiness.overall)
      .slice(0, 5)) as any;
    
    // Most improved potential - find students with the most impactful fix
    const mostFixable: EnrichedStudent[] = (unplaced
      .filter(s => s.readiness.recommendations.length > 0)
      .sort((a, b) => b.readiness.recommendations.length - a.readiness.recommendations.length)
      .slice(0, 5)) as any;
    
    return {
      total,
      placed,
      unplaced: unplaced.length,
      placementRate: total ? Math.round((placed / total) * 100) : 0,
      componentAverages,
      bottlenecks: componentScores,
      urgentAttention,
      mostFixable,
      avgReadiness: unplaced.length ? Math.round(unplaced.reduce((sum, s) => sum + s.readiness.overall, 0) / unplaced.length) : 0,
    };
  }, [enrichedStudents]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

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
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Analyzing Student Profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      {!hideStats && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 p-6">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Placement <span className="text-primary">Readiness</span> Intelligence
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Multi-dimensional analysis of student placement preparedness
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="h-10 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 px-5 font-bold transition-all active:scale-95"
            >
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export Data
            </Button>
          </div>
        </div>
      )}      

      {/* Component Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Component Analysis */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-black mb-4">Department Component Averages</h3>
            <div className="space-y-3">
              {[
                { label: 'Academics', value: insights.componentAverages.academics, color: 'bg-blue-500', icon: GraduationCap },
                { label: 'Technical Skills', value: insights.componentAverages.technical, color: 'bg-indigo-500', icon: Code2 },
                { label: 'Professional Presence', value: insights.componentAverages.presence, color: 'bg-emerald-500', icon: Linkedin },
                { label: 'Soft Skills', value: insights.componentAverages.softSkills, color: 'bg-amber-500', icon: Heart },
                { label: 'Placement Prep', value: insights.componentAverages.preparedness, color: 'bg-purple-500', icon: Target },
              ].map((comp) => (
                <div key={comp.label}>
                  <div className="flex items-center justify-between text-sm font-bold mb-1">
                    <span className="flex items-center gap-2">
                      <comp.icon className="h-4 w-4" />
                      {comp.label}
                    </span>
                    <span className={`${comp.value >= 70 ? 'text-emerald-600' : comp.value >= 50 ? 'text-amber-600' : 'text-pink-600'}`}>
                      {comp.value}%
                    </span>
                  </div>
                  <Progress value={comp.value} className="h-2" indicatorClassName={comp.color} />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-bold text-amber-700">
                <Target className="h-3 w-3 inline mr-1" />
                Biggest gap: {insights.bottlenecks[0]?.name} ({insights.bottlenecks[0]?.avg}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Actionable Insights */}
        <div className="space-y-6">
          {/* Top Bottleneck */}
          {insights.bottlenecks[0] && (
            <Card className="border-2 border-amber-500/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-amber-600">Critical Bottleneck</p>
                    <h4 className="font-black">{insights.bottlenecks[0].name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Department average: {insights.bottlenecks[0].avg}% 
                      {insights.bottlenecks[0].avg < 50 && ' — Urgent intervention needed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/40">
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/40 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">{selectedStudent.name || selectedStudent.email?.split('@')[0]}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.roll_number} • {selectedStudent.department}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>✕</Button>
            </div>
            <div className="p-5 space-y-6">
              {/* Readiness Score */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black">{selectedStudent.readiness.overall}%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Readiness</p>
                </div>
                <div className="flex-1">
                  <Badge className={`text-lg px-4 py-1 font-bold ${
                    selectedStudent.readiness.category === 'platinum' ? 'bg-purple-600' :
                    selectedStudent.readiness.category === 'gold' ? 'bg-amber-500' :
                    selectedStudent.readiness.category === 'silver' ? 'bg-slate-400' :
                    selectedStudent.readiness.category === 'bronze' ? 'bg-orange-600' :
                    'bg-red-500'
                  }`}>
                    {selectedStudent.readiness.category.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Component Scores */}
              <div className="space-y-3">
                {Object.entries(selectedStudent.readiness.components).map(([key, compVal]) => {
                  const comp = compVal as { score: number; max: number; percentage: number; details: string[] };
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{comp.percentage}%</span>
                      </div>
                      <Progress value={comp.percentage} className="h-2" />
                      <div className="mt-1 text-xs text-muted-foreground">
                        {comp.details.slice(0, 3).map((d: string, i: number) => (
                          <span key={i} className="inline-block mr-2">• {d}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Recommendations
                </h4>
                <ul className="mt-2 space-y-1">
                  {selectedStudent.readiness.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Student Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Skills</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(selectedStudent.technical_skills || []).slice(0, 8).map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                    {(selectedStudent.technical_skills || []).length > 8 && (
                      <span className="text-xs text-muted-foreground">+{((selectedStudent.technical_skills || [])).length - 8} more</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projects</p>
                  <p className="text-sm font-medium">{(selectedStudent.projects || []).length} projects</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internships</p>
                  <p className="text-sm font-medium">{(selectedStudent.internships || []).length} internships</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certifications</p>
                  <p className="text-sm font-medium">{(selectedStudent.certifications || []).length} certifications</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border/40">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Recommendations
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
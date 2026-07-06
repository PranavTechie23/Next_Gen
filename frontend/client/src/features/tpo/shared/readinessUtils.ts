export type StudentReadinessInput = {
  current_cgpa?: number | string | null;
  active_backlogs?: number | null;
  skills_count?: number | null;
  has_resume?: number | boolean | null;
  has_profile_link?: number | boolean | null;
  is_placed?: number | boolean | null;
};

export type ReadinessIssue = {
  label: string;
  severity: "high" | "medium" | "low";
};

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

/** Mirrors backend readinessCalculator.js — keep in sync when weights change. */
export function computeReadinessScore(student: StudentReadinessInput): number {
  const cgpa = Number(student.current_cgpa ?? 0);
  const backlogs = Number(student.active_backlogs ?? 0);
  const skills = Number(student.skills_count ?? 0);
  const hasResume = Boolean(student.has_resume);
  const hasProfileLink = Boolean(student.has_profile_link);

  let academics = (cgpa / 10) * 100;
  if (backlogs > 0) academics -= backlogs * 15;
  academics = clamp(academics);

  const skillsScore = clamp(100 * (1 - Math.exp(-skills / 8)));

  let portfolio = 0;
  if (hasResume) portfolio += 40;
  if (hasProfileLink) portfolio += 20;
  portfolio = clamp(portfolio);

  const weights = { academics: 0.5, skills: 0.3, portfolio: 0.2 };
  const total = (academics * weights.academics)
    + (skillsScore * weights.skills)
    + (portfolio * weights.portfolio);

  let score = Math.round(clamp(total));
  if (student.is_placed) score = Math.max(score, 90);
  return score;
}

export function getReadinessIssues(student: StudentReadinessInput): ReadinessIssue[] {
  const issues: ReadinessIssue[] = [];
  const cgpa = Number(student.current_cgpa ?? 0);
  const backlogs = Number(student.active_backlogs ?? 0);
  const skills = Number(student.skills_count ?? 0);

  if (!cgpa) issues.push({ label: "CGPA missing", severity: "medium" });
  else if (cgpa < 7) issues.push({ label: "CGPA below 7.0", severity: "medium" });

  if (backlogs > 0) {
    issues.push({
      label: `${backlogs} active backlog${backlogs > 1 ? "s" : ""}`,
      severity: "high",
    });
  }

  if (skills < 3) issues.push({ label: "Fewer than 3 skills listed", severity: "medium" });
  if (!student.has_resume) issues.push({ label: "Resume not uploaded", severity: "medium" });
  if (!student.has_profile_link) {
    issues.push({ label: "LinkedIn/GitHub not linked", severity: "low" });
  }

  return issues;
}

export function getStudentStatusLabel(student: StudentReadinessInput): {
  label: string;
  className: string;
} {
  if (student.is_placed) {
    return {
      label: "Placed",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    };
  }

  const issues = getReadinessIssues(student);
  if (issues.some((i) => i.severity === "high")) {
    return {
      label: "At Risk",
      className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
    };
  }

  const score = computeReadinessScore(student);
  if (score >= 70) {
    return {
      label: "Ready",
      className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
    };
  }

  return {
    label: "Needs Work",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  };
}

export function getProfileCompleteness(student: StudentReadinessInput): number {
  let filled = 0;
  const total = 5;
  if (Number(student.current_cgpa) > 0) filled += 1;
  if (Number(student.skills_count) >= 3) filled += 1;
  if (student.has_resume) filled += 1;
  if (student.has_profile_link) filled += 1;
  if (Number(student.active_backlogs) === 0 || student.active_backlogs != null) filled += 1;
  return Math.round((filled / total) * 100);
}

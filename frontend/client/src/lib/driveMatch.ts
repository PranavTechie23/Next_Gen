/** Compute eligibility match (0–100) for a student against a drive/job posting. */
export interface DriveMatchInput {
  minCgpa?: number;
  maxBacklogs?: number;
  requirements?: string[];
}

export function computeDriveMatch(
  drive: DriveMatchInput,
  studentCgpa: number,
  studentSkills: string[],
  studentBacklogs = 0
): number {
  let score = 0;
  const weights = { cgpa: 40, skills: 40, backlogs: 20 };

  const minCgpa = drive.minCgpa ?? 0;
  if (minCgpa <= 0) {
    score += weights.cgpa;
  } else if (studentCgpa >= minCgpa) {
    score += weights.cgpa;
  } else {
    score += Math.max(0, weights.cgpa * (studentCgpa / minCgpa));
  }

  const requirements = drive.requirements ?? [];
  if (requirements.length === 0) {
    score += weights.skills;
  } else {
    const normalizedSkills = studentSkills.map((s) => s.toLowerCase());
    const matched = requirements.filter((req) =>
      normalizedSkills.some((skill) => skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill))
    );
    score += weights.skills * (matched.length / requirements.length);
  }

  const maxBacklogs = drive.maxBacklogs ?? 0;
  if (studentBacklogs <= maxBacklogs) {
    score += weights.backlogs;
  } else {
    score += Math.max(0, weights.backlogs - (studentBacklogs - maxBacklogs) * 5);
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

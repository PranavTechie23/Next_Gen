/**
 * Shared placement drives: TPO creates drives (tickets), students see them under "Drives" with match %.
 * Stored in localStorage until backend exists.
 */

export const PLACEMENT_DRIVES_STORAGE_KEY = "campus_career_placement_drives";

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  description: string; // JD / job description
  requirements: string[]; // skills etc.
  minCgpa: number;
  maxBacklogs: number;
  applicationLink: string; // e.g. Google Form URL
  deadline: string; // ISO date or display string
  createdAt: string; // ISO
}

export function getPlacementDrives(): PlacementDrive[] {
  try {
    const raw = localStorage.getItem(PLACEMENT_DRIVES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlacementDrive(drive: Omit<PlacementDrive, "id" | "createdAt">): PlacementDrive {
  const list = getPlacementDrives();
  const created: PlacementDrive = {
    ...drive,
    id: `drive-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(created);
  localStorage.setItem(PLACEMENT_DRIVES_STORAGE_KEY, JSON.stringify(list));
  return created;
}

/**
 * Compute match percentage (0–100) for a student against a drive.
 * Uses: CGPA eligibility, required skills overlap, backlogs (if provided).
 */
export function computeDriveMatch(
  drive: PlacementDrive,
  studentCgpa: number,
  studentSkills: string[],
  studentBacklogs: number = 0
): number {
  let score = 0;
  const weights = { cgpa: 35, skills: 45, backlogs: 20 };

  // CGPA: full points if >= minCgpa, else proportional
  if (studentCgpa >= drive.minCgpa) {
    score += weights.cgpa;
  } else {
    score += weights.cgpa * Math.max(0, studentCgpa / drive.minCgpa);
  }

  // Skills: overlap / required (normalized)
  const required = drive.requirements.map((s) => s.toLowerCase().trim());
  const student = new Set(studentSkills.map((s) => s.toLowerCase().trim()));
  if (required.length === 0) {
    score += weights.skills;
  } else {
    const matchCount = required.filter((r) => student.has(r) || [...student].some((s) => s.includes(r) || r.includes(s))).length;
    score += weights.skills * (matchCount / required.length);
  }

  // Backlogs: full points if within limit
  if (studentBacklogs <= drive.maxBacklogs) {
    score += weights.backlogs;
  } else {
    score += 0;
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

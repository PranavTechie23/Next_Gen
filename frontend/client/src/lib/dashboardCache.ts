/** Shared client-side dashboard cache — instant paint + stale-while-revalidate. */

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const DASHBOARD_SYNC_MS = 2 * 60 * 1000;

export const DASHBOARD_CACHE_KEYS = {
  TPO: "dashboard-cache-TPO-v1",
  dept: "dashboard-cache-dept-v1",
  deptProfile: "dashboard-cache-dept-profile-v1",
  deptReadiness: "dashboard-cache-dept-readiness-v1",
  studentProfile: "dashboard-cache-student-profile-v1",
  studentFeed: "dashboard-cache-student-feed-v1",
  studentJobs: "dashboard-cache-student-jobs-v1",
  studentRoadmap: "dashboard-cache-student-roadmap-v1",
} as const;

type CacheEntry<T> = { savedAt: number; payload: T };

export function readDashboardCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed?.payload || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.payload;
  } catch {
    return null;
  }
}

export function writeDashboardCache<T>(key: string, payload: T): void {
  try {
    const entry: CacheEntry<T> = { savedAt: Date.now(), payload };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Quota or private mode
  }
}

export function clearAllDashboardCaches(): void {
  try {
    Object.values(DASHBOARD_CACHE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}

/** Strip server _meta before persisting locally. */
export function stripMeta<T extends Record<string, unknown>>(data: T): Omit<T, "_meta"> {
  const { _meta, ...rest } = data;
  return rest as Omit<T, "_meta">;
}

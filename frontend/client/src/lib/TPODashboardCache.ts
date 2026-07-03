/** @deprecated Use dashboardCache.ts — kept for backward-compatible imports. */
import {
  DASHBOARD_CACHE_KEYS,
  DASHBOARD_SYNC_MS,
  readDashboardCache,
  writeDashboardCache,
  clearAllDashboardCaches,
} from "@/lib/dashboardCache";

export { DASHBOARD_SYNC_MS as TPO_DASHBOARD_SYNC_MS, clearAllDashboardCaches };

export function readTPODashboardCache(): Record<string, unknown> | null {
  return readDashboardCache(DASHBOARD_CACHE_KEYS.TPO);
}

export function writeTPODashboardCache(payload: Record<string, unknown>): void {
  writeDashboardCache(DASHBOARD_CACHE_KEYS.TPO, payload);
}

export function clearTPODashboardCache(): void {
  try {
    localStorage.removeItem(DASHBOARD_CACHE_KEYS.TPO);
  } catch {
    // ignore
  }
}

export function clearAllRoleDashboardCaches(): void {
  clearAllDashboardCaches();
}

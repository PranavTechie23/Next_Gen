import { buildApiUrl } from "@/lib/api";
import { sessionClient } from "@/lib/apiClient";

export type SessionUser = {
  id: number;
  email: string;
  role: string;
  institution_id?: number | null;
};

const USER_ROLE_KEY = "userRole";

/** Remove legacy token storage and session hints. */
export function clearClientAuthState(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  sessionStorage.removeItem(USER_ROLE_KEY);
}

export function setSessionRole(role: string): void {
  sessionStorage.setItem(USER_ROLE_KEY, role);
}

export function getUserRole(): string | null {
  return sessionStorage.getItem(USER_ROLE_KEY) || localStorage.getItem("userRole");
}

export function normalizeRole(role: string | null | undefined): string {
  return String(role || "")
    .trim()
    .toUpperCase();
}

/** @deprecated Cookie auth — use fetchAuthSession instead. */
export function getAuthToken(): string | null {
  return null;
}

export function isAuthenticated(): boolean {
  return !!getUserRole();
}

export function dashboardPathForRole(role: string | null | undefined): string {
  switch (normalizeRole(role)) {
    case "SUPER_ADMIN":
      return "/super-admin";
    case "STUDENT":
      return "/student/dashboard?tab=overview";
    case "TPO_ADMIN":
      return "/tpo/dashboard?tab=overview";
    case "TPO_HEAD":
      return "/department/dashboard?tab=overview";
    default:
      return "/login";
  }
}

export async function fetchAuthSession(): Promise<{ authenticated: boolean; user?: SessionUser }> {
  const response = await sessionClient.get(buildApiUrl("/auth/me"));
  return response.data;
}

export async function logoutSession(): Promise<void> {
  try {
    await sessionClient.post(buildApiUrl("/auth/logout"));
  } catch {
    // Still clear client state if server logout fails (expired session, network).
  } finally {
    clearClientAuthState();
  }
}

/** Map legacy /uploads/* paths to authenticated /api/files/* routes. */
export function resolveUploadUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/api/files/")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const match = url.match(/\/uploads\/(resumes|avatars)\/([^/?#]+)/i);
  if (match) {
    return `/api/files/${match[1].toLowerCase()}/${match[2]}`;
  }
  return url;
}

import { QueryClient } from "@tanstack/react-query";

export const MANUAL_REFRESH_COOLDOWN_MS = 15 * 60 * 1000;

export const queryKeys = {
  notifications: {
    all: ["notifications"] as const,
    list: (params?: { status?: string; page?: number; limit?: number }) =>
      ["notifications", "list", params] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  TPO: {
    analytics: (params?: Record<string, unknown>) => ["TPO", "analytics", params] as const,
    applications: (params: Record<string, unknown>) => ["TPO", "applications", params] as const,
    students: (params: Record<string, unknown>) => ["TPO", "students", params] as const,
    studentDetail: (id: number | string) => ["TPO", "student", id] as const,
    drives: ["TPO", "drives"] as const,
    companies: ["TPO", "companies"] as const,
  },
  dept: {
    dashboard: ["dept", "dashboard"] as const,
    profile: ["dept", "profile"] as const,
    readiness: ["dept", "readiness"] as const,
    events: ["dept", "events"] as const,
    amcat: ["dept", "amcat"] as const,
  },
  student: {
    profile: ["student", "profile"] as const,
    jobs: ["student", "jobs"] as const,
    roadmap: ["student", "roadmap"] as const,
  },
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MANUAL_REFRESH_COOLDOWN_MS,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

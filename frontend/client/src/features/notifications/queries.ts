import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/services/notificationApi";
import { queryKeys } from "@/lib/queryClient";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => notificationApi.getUnreadCount(),
    staleTime: 60_000,
  });
}

export function useNotifications(params?: { status?: "read" | "unread"; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationApi.getNotifications(params),
  });
}

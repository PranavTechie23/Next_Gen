import { createApiClient } from "@/lib/apiClient";

export type AppNotification = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const api = createApiClient("/notifications");

export const notificationApi = {
  getNotifications: async (params?: {
    status?: "read" | "unread";
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<{
      notifications: AppNotification[];
      total: number;
      unread_count?: number;
    }>("", { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get<{ unread_count: number }>("/unread-count");
    return response.data.unread_count;
  },

  markAsRead: async (id: number) => {
    const response = await api.put(`/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/read-all");
    return response.data;
  },

  deleteNotification: async (id: number) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

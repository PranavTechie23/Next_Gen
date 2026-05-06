import axios from "axios";
import { buildApiUrl } from "@/lib/api";

const api = axios.create({
  baseURL: buildApiUrl("/admin"),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  getDashboardAnalytics: async () => {
    const response = await api.get("analytics/dashboard");
    return response.data;
  },

  getStudents: async (params: { 
    page?: number, 
    limit?: number, 
    search?: string, 
    branch?: string, 
    status?: string 
  }) => {
    const response = await api.get("students", { params });
    return response.data;
  },

  downloadReportCsv: async (path: string, filename: string) => {
    const response = await api.get(path, {
      params: { format: "csv" },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  getWebinars: async (params?: {
    scope?: "all" | "upcoming" | "past";
    status?: "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
    search?: string;
  }) => {
    const response = await api.get("webinars", { params });
    return response.data;
  },

  createWebinar: async (payload: any) => {
    const response = await api.post("webinars", payload);
    return response.data;
  },

  updateWebinar: async (id: string | number, payload: any) => {
    const response = await api.put(`webinars/${id}`, payload);
    return response.data;
  },

  downloadShortlistedStudentsCsv: async (filters: any, filename: string) => {
    const response = await api.get('reports/shortlisted', {
      params: { ...filters, format: "csv" },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};


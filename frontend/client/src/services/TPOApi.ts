import { createApiClient } from "@/lib/apiClient";

const api = createApiClient("/TPO");

export type DashboardAnalyticsParams = {
  year?: string | number;
  /** Comma-separated department ids or branch codes/names */
  branch?: string;
  refresh?: boolean;
};

export type AnalyticsFilterOptions = {
  years: number[];
  branches: { id: number; name: string; code: string | null; batchYear: number | null }[];
  batchYearNote?: string;
  scopedToDepartment?: boolean;
};

export const TPOApi = {
  getDashboardAnalytics: async (params?: DashboardAnalyticsParams) => {
    const response = await api.get("analytics/dashboard", { params });
    return response.data;
  },

  getAnalyticsFilterOptions: async (params?: { year?: string }) => {
    const response = await api.get("analytics/filter-options", { params });
    return response.data as AnalyticsFilterOptions;
  },

  getShortlistCount: async (params: { minCgpa: number; maxBacklogs: number; skills: string }) => {
    const response = await api.get("analytics/shortlist-count", { params });
    return response.data;
  },

  getJdParseStats: async () => {
    const response = await api.get("jd/stats");
    return response.data as { parseCount: number; aiConfigured: boolean };
  },

  parseJobDescriptionPdf: async (file: File) => {
    const formData = new FormData();
    formData.append("jd", file);
    const response = await api.post("jd/parse", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as {
      filters: { cgpa: number; backlogs: number; skills: string[]; branches: string[] };
      source: string;
      aiConfigured: boolean;
      parseCount: number;
    };
  },

  getStudents: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    branch?: string;
    status?: string;
  }) => {
    const response = await api.get("students", { params });
    return response.data;
  },

  getStudentDetail: async (id: string | number) => {
    const response = await api.get(`students/${id}`);
    return response.data;
  },

  getApplications: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    branch?: string;
    status?: string;
    company?: string;
    drive?: string;
  }) => {
    const response = await api.get("applications", { params });
    return response.data;
  },

  updateApplicationStatus: async (
    id: string | number,
    payload: { status: string; current_round?: string }
  ) => {
    const response = await api.put(`applications/${id}/status`, payload);
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

  downloadCustomReportCsv: async (reportType: string, filename: string) => {
    const response = await api.post('reports/custom', { reportType }, {
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

  deleteDeptEvent: async (id: string | number) => {
    const response = await api.delete(`dept-events/${id}`);
    return response.data;
  },

  deleteWebinar: async (id: string | number) => {
    const response = await api.delete(`webinars/${id}`);
    return response.data;
  },

  getDrives: async () => {
    const response = await api.get("drives");
    return response.data;
  },

  createDrive: async (payload: any) => {
    const response = await api.post("drives", payload);
    return response.data;
  },

  updateDriveStatus: async (
    id: string | number, 
    status: string, 
    details?: { selectedStudents?: number[], malesSelected?: number, femalesSelected?: number }
  ) => {
    const payload = { status, ...details };
    const response = await api.put(`drives/${id}/status`, payload);
    return response.data;
  },

  quickCreateDrive: async (payload: any) => {
    const response = await api.post("drives/quick", payload);
    return response.data;
  },

  updateDrive: async (id: string | number, payload: any) => {
    const response = await api.put(`drives/${id}`, payload);
    return response.data;
  },

  deleteDrive: async (id: string | number) => {
    const response = await api.delete(`drives/${id}`);
    return response.data;
  },

  addJobToDrive: async (driveId: string | number, payload: any) => {
    const response = await api.post(`drives/${driveId}/jobs`, payload);
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get("companies"); // Assuming this might be needed
    return response.data;
  },

  createCompany: async (payload: { name: string; hr_email?: string }) => {
    const response = await api.post("companies", payload);
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

  createAnnouncement: async (payload: { title: string; message: string; expires_at?: string }) => {
    const response = await api.post("announcements", payload);
    return response.data;
  },

  getAnnouncements: async (params?: { limit?: number }) => {
    const response = await api.get("announcements", { params });
    return response.data;
  },

  updateAnnouncement: async (id: string | number, payload: { title: string; message: string; expires_at?: string }) => {
    const response = await api.put(`announcements/${id}`, payload);
    return response.data;
  },

  deleteAnnouncement: async (id: string | number) => {
    const response = await api.delete(`announcements/${id}`);
    return response.data;
  },
};


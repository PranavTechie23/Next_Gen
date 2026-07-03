import { createApiClient } from "@/lib/apiClient";

const api = createApiClient("/dept");

type ExportCriteria = { minCgpa: string; maxBacklogs: string; minReadiness: string };

function criteriaQuery(criteria?: ExportCriteria) {
  if (!criteria) return "";
  const params = new URLSearchParams();
  if (criteria.minCgpa) params.set("minCgpa", criteria.minCgpa);
  if (criteria.maxBacklogs) params.set("maxBacklogs", criteria.maxBacklogs);
  if (criteria.minReadiness) params.set("minReadiness", criteria.minReadiness);
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function downloadDeptBlob(path: string, fallbackFilename: string) {
  const response = await api.get(path, { responseType: "blob" });
  const disposition = response.headers["content-disposition"] as string | undefined;
  let filename = fallbackFilename;
  const m = disposition?.match(/filename="([^"]+)"/i) || disposition?.match(/filename=([^;\s]+)/i);
  if (m?.[1]) filename = decodeURIComponent(m[1].replace(/"/g, ""));
  const rawType = response.headers["content-type"];
  const type =
    typeof rawType === "string"
      ? rawType
      : Array.isArray(rawType)
        ? rawType[0]
        : "application/octet-stream";
  const url = URL.createObjectURL(new Blob([response.data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const deptApi = {
  getDeptProfile: async () => {
    const response = await api.get("me");
    return response.data;
  },

  getDepartmentStudents: async () => {
    const response = await api.get("students");
    return response.data;
  },

  getReadinessDesk: async () => {
    const response = await api.get("readiness");
    return response.data;
  },

  getStudentDetails: async (id: string | number) => {
    const response = await api.get(`students/${id}`);
    return response.data;
  },

  createStudentsManually: async (students: any[]) => {
    const response = await api.post("students", { students });
    return response.data;
  },

  uploadStudentsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("students/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadCompanyStatsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("company-stats/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateStudentAcademicData: async (id: string | number, data: any) => {
    const response = await api.put(`students/${id}`, data);
    return response.data;
  },

  getRecentlyUpdatedProfiles: async () => {
    const response = await api.get("approvals/resumes");
    return response.data;
  },

  reviewStudentProfile: async (id: string | number, action: "APPROVE" | "REJECT", fields: string[]) => {
    const response = await api.put(`approvals/resumes/${id}`, { action, fields });
    return response.data;
  },

  getDashboardStats: async (params?: { refresh?: boolean }) => {
    const response = await api.get("dashboard/stats", { params });
    return response.data;
  },

  getAmcatStats: async () => {
    const response = await api.get("analytics/amcat");
    return response.data;
  },

  getWebinarRecommendations: async () => {
    const response = await api.get("webinars/recommendations");
    return response.data;
  },

  downloadPlacementReportPdf: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/placement-pdf${criteriaQuery(criteria)}`, "dept-placement-report.pdf");
  },

  downloadStudentReadinessCsv: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/student-readiness.csv${criteriaQuery(criteria)}`, "student-readiness.csv");
  },

  downloadUnplacedStudentsCsv: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/unplaced-students.csv${criteriaQuery(criteria)}`, "unplaced-students.csv");
  },

  downloadProfileGapsCsv: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/profile-gaps.csv${criteriaQuery(criteria)}`, "profile-gaps.csv");
  },

  downloadPlacedPackagesCsv: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/placed-packages.csv${criteriaQuery(criteria)}`, "placed-packages.csv");
  },

  downloadEligibilityCsv: async (criteria?: ExportCriteria) => {
    await downloadDeptBlob(`reports/eligibility.csv${criteriaQuery(criteria)}`, "eligible-students.csv");
  },

  getDeptEvents: async () => {
    const response = await api.get("events");
    return response.data;
  },

  saveDeptEvent: async (event: { title: string; date: string; type: string; meetingLink?: string }) => {
    const response = await api.post("events", event);
    return response.data;
  },

  updateDeptEvent: async (
    id: number,
    event: { title: string; date: string; type: string; meetingLink?: string }
  ) => {
    const response = await api.put(`events/${id}`, event);
    return response.data;
  },

  deleteDeptEvent: async (id: number) => {
    const response = await api.delete(`events/${id}`);
    return response.data;
  },
};

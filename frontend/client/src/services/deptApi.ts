import axios from 'axios';
import { buildApiUrl } from "@/lib/api";

// Setup axios instance with auth header if needed (assuming token is stored in localStorage or similar)
const api = axios.create({
  baseURL: buildApiUrl('/dept'),
});

async function downloadDeptBlob(path: string, fallbackFilename: string) {
  const response = await api.get(path, { responseType: 'blob' });
  const disposition = response.headers['content-disposition'] as string | undefined;
  let filename = fallbackFilename;
  const m = disposition?.match(/filename="([^"]+)"/i) || disposition?.match(/filename=([^;\s]+)/i);
  if (m?.[1]) filename = decodeURIComponent(m[1].replace(/"/g, ''));
  const type = response.headers['content-type'] || 'application/octet-stream';
  const url = URL.createObjectURL(new Blob([response.data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const deptApi = {
  getDeptProfile: async () => {
    const response = await api.get('me');
    return response.data;
  },

  // Students Management
  getDepartmentStudents: async () => {
    const response = await api.get('students');
    return response.data;
  },

  getReadinessDesk: async () => {
    const response = await api.get('readiness');
    return response.data;
  },

  getStudentDetails: async (id: string | number) => {
    const response = await api.get(`students/${id}`);
    return response.data;
  },

  createStudentsManually: async (students: any[]) => {
    const response = await api.post('students', { students });
    return response.data;
  },

  uploadStudentsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('students/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadCompanyStatsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('company-stats/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStudentAcademicData: async (id: string | number, data: any) => {
    const response = await api.put(`students/${id}`, data);
    return response.data;
  },

  // Approvals
  getRecentlyUpdatedProfiles: async () => {
    const response = await api.get('approvals/resumes');
    return response.data;
  },

  reviewStudentProfile: async (id: string | number, action: 'APPROVE' | 'REJECT', fields: string[]) => {
    const response = await api.put(`approvals/resumes/${id}`, { action, fields });
    return response.data;
  },

  // Analytics
  getDashboardStats: async () => {
    const response = await api.get('dashboard/stats');
    return response.data;
  },

  getWebinarRecommendations: async () => {
    const response = await api.get('webinars/recommendations');
    return response.data;
  },

  /** Triggers browser download of department placement PDF. */
  downloadPlacementReportPdf: async () => {
    await downloadDeptBlob('reports/placement-pdf', 'dept-placement-report.pdf');
  },

  /** Triggers browser download of student readiness CSV. */
  downloadStudentReadinessCsv: async () => {
    await downloadDeptBlob('reports/student-readiness.csv', 'student-readiness.csv');
  },

  downloadUnplacedStudentsCsv: async () => {
    await downloadDeptBlob('reports/unplaced-students.csv', 'unplaced-students.csv');
  },

  downloadProfileGapsCsv: async () => {
    await downloadDeptBlob('reports/profile-gaps.csv', 'profile-gaps.csv');
  },

  downloadPlacedPackagesCsv: async () => {
    await downloadDeptBlob('reports/placed-packages.csv', 'placed-packages.csv');
  },

  downloadEligibilityCsv: async (criteria: { minCgpa: string; maxBacklogs: string; minReadiness: string }) => {
    const params = new URLSearchParams();
    if (criteria.minCgpa) params.set('minCgpa', criteria.minCgpa);
    if (criteria.maxBacklogs) params.set('maxBacklogs', criteria.maxBacklogs);
    if (criteria.minReadiness) params.set('minReadiness', criteria.minReadiness);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    await downloadDeptBlob(`reports/eligibility.csv${suffix}`, 'eligible-students.csv');
  },

  saveDeptEvent: async (event: { title: string; date: string; type: string; meetingLink?: string }) => {
    const response = await api.post('events', event);
    return response.data;
  },
};

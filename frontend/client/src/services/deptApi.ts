import axios from 'axios';

const API_BASE_URL = '/api/dept';

// Setup axios instance with auth header if needed (assuming token is stored in localStorage or similar)
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const deptApi = {
  // Students Management
  getDepartmentStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getStudentDetails: async (id: string | number) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createStudentsManually: async (students: any[]) => {
    const response = await api.post('/students', { students });
    return response.data;
  },

  uploadStudentsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/students/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadCompanyStatsExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/company-stats/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStudentAcademicData: async (id: string | number, data: any) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  // Approvals
  getRecentlyUpdatedProfiles: async () => {
    const response = await api.get('/approvals/resumes');
    return response.data;
  },

  reviewStudentProfile: async (id: string | number, action: 'APPROVE' | 'REJECT', fields: string[]) => {
    const response = await api.put(`/approvals/resumes/${id}`, { action, fields });
    return response.data;
  },

  // Analytics
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getWebinarRecommendations: async () => {
    const response = await api.get('/webinars/recommendations');
    return response.data;
  },

  /** Triggers browser download of department placement PDF. */
  downloadPlacementReportPdf: async () => {
    const response = await api.get('/reports/placement-pdf', { responseType: 'blob' });
    const disposition = response.headers['content-disposition'] as string | undefined;
    let filename = 'dept-placement-report.pdf';
    const m = disposition?.match(/filename="([^"]+)"/i) || disposition?.match(/filename=([^;\s]+)/i);
    if (m?.[1]) filename = decodeURIComponent(m[1].replace(/"/g, ''));
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  /** Triggers browser download of student readiness CSV. */
  downloadStudentReadinessCsv: async () => {
    const response = await api.get('/reports/student-readiness.csv', { responseType: 'blob' });
    const disposition = response.headers['content-disposition'] as string | undefined;
    let filename = 'student-readiness.csv';
    const m = disposition?.match(/filename="([^"]+)"/i) || disposition?.match(/filename=([^;\s]+)/i);
    if (m?.[1]) filename = decodeURIComponent(m[1].replace(/"/g, ''));
    const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};

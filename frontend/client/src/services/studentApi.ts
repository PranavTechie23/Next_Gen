import axios from 'axios';
import { buildApiUrl } from "@/lib/api";

// Setup axios instance with auth header 
const api = axios.create({
  baseURL: buildApiUrl('/student'),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const studentApi = {
  // Get full student profile (academic, subjective data, etc.)
  getProfile: async () => {
    const response = await api.get('profile');
    return response.data;
  },

  // Update subjective profile fields (resume, LinkedIn, GitHub, etc.)
  updateSubjectiveProfile: async (data: any) => {
    const response = await api.put('profile/subjective', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateResumeSections: async (sections: any) => {
    const response = await api.put('profile/resume-sections', { sections });
    return response.data;
  },

  evaluateTargetRole: async (targetRole: string) => {
    const response = await api.post('profile/target-role', { target_role: targetRole });
    return response.data;
  },

  // Dynamic Roadmap (Mentorship)
  getRoadmap: async () => {
    const response = await api.get('roadmap');
    return response.data;
  },

  updatePerformance: async (data: any) => {
    const response = await api.put('performance', data);
    return response.data;
  },

  uploadAmcatReport: async (file: File) => {
    const formData = new FormData();
    formData.append('report', file);
    const response = await api.post('performance/amcat-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Company Wise Kit - stats
  getCompanyStats: async (companyName: string) => {
    const response = await api.get('company-stats', { params: { company: companyName } });
    return response.data;
  },
  
  // Jobs
  getJobs: async () => {
    const response = await api.get('jobs');
    return response.data;
  },
  
  getJobDetails: async (id: string | number) => {
    const response = await api.get(`jobs/${id}`);
    return response.data;
  },
  
  applyForJob: async (id: string | number) => {
    const response = await api.post(`jobs/${id}/apply`);
    return response.data;
  },
  
  // Applications
  getApplications: async () => {
    const response = await api.get('applications');
    return response.data;
  },

  getWebinars: async (params?: { scope?: 'all' | 'upcoming' | 'past'; search?: string }) => {
    const response = await api.get('webinars', { params });
    return response.data;
  },

  registerWebinar: async (id: string | number) => {
    const response = await api.post(`webinars/${id}/register`);
    return response.data;
  },

  getDeptEvents: async () => {
    const response = await api.get('dept-events');
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get('announcements');
    return response.data;
  },

  submitPlatformFeedback: async (data: { type: string, subject: string, description: string }) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    const response = await axios.post(buildApiUrl('/platform-feedback'), data, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },
};


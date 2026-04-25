import axios from 'axios';

const API_BASE_URL = '/api/student';

// Setup axios instance with auth header 
const api = axios.create({
  baseURL: API_BASE_URL,
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
    const response = await api.get('/profile');
    return response.data;
  },

  // Update subjective profile fields (resume, LinkedIn, GitHub, etc.)
  updateSubjectiveProfile: async (data: any) => {
    const response = await api.put('/profile/subjective', data);
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Dynamic Roadmap (Mentorship)
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },

  updatePerformance: async (data: any) => {
    const response = await api.put('/performance', data);
    return response.data;
  },

  // Company Wise Kit - stats
  getCompanyStats: async (companyName: string) => {
    const response = await api.get('/company-stats', { params: { company: companyName } });
    return response.data;
  },
  
  // Jobs
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  getJobDetails: async (id: string | number) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  applyForJob: async (id: string | number) => {
    const response = await api.post(`/jobs/${id}/apply`);
    return response.data;
  },
  
  // Applications
  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  }
};

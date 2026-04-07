import axios from 'axios';

const API_BASE_URL = '/api/student';

// Setup axios instance with auth header 
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

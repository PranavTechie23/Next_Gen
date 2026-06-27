import axios from 'axios';
import { buildApiUrl } from "@/lib/api";
import { Company } from "@/data/companyProblemPools";

const api = axios.create({
  baseURL: buildApiUrl('/assessment'),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const assessmentApi = {
  getAllKits: async (): Promise<Company[]> => {
    const response = await api.get('/kits');
    return response.data;
  },

  getKitById: async (id: string): Promise<Company> => {
    const response = await api.get(`/kits/${id}`);
    return response.data;
  },
};

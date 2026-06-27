import axios from 'axios';
import { buildApiUrl } from "@/lib/api";

const api = axios.create({
  baseURL: buildApiUrl('/public'),
});

export const publicApi = {
  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
  getFaqs: async () => {
    const response = await api.get('/faqs');
    return response.data;
  },
};

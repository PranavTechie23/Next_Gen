import { createApiClient } from "@/lib/apiClient";

const api = createApiClient("/public");

export const publicApi = {
  getTestimonials: async () => {
    const response = await api.get("/testimonials");
    return response.data;
  },
  getFaqs: async () => {
    const response = await api.get("/faqs");
    return response.data;
  },
};

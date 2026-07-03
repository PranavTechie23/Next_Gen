import { createApiClient } from "@/lib/apiClient";
import { Company } from "@/data/companyProblemPools";

const api = createApiClient("/assessment");

export const assessmentApi = {
  getAllKits: async (): Promise<Company[]> => {
    const response = await api.get("/kits");
    return response.data;
  },

  getKitById: async (id: string): Promise<Company> => {
    const response = await api.get(`/kits/${id}`);
    return response.data;
  },
};

import { Company } from "@/data/companyProblemPools";
import { assessmentApi } from "./assessmentApi";

export const problemService = {
    getAllCompanies: async (): Promise<Company[]> => {
        try {
            return await assessmentApi.getAllKits();
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            return [];
        }
    },

    getCompanyById: async (id: string): Promise<Company | undefined> => {
        try {
            return await assessmentApi.getKitById(id);
        } catch (error) {
            console.error(`Failed to fetch company with id ${id}:`, error);
            return undefined;
        }
    },
};

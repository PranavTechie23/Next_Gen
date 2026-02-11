import { MAJOR_COMPANIES } from "@/data/companyListMajor";
import { OTHER_COMPANIES } from "@/data/companyListOthers";
import { EXTRA_COMPANIES } from "@/data/companyListExtra";
import { Company } from "@/data/companyProblemPools";

// In a real application, this would fetch from an API endpoint
// e.g., https://alfa-leetcode-api.onrender.com/problems?company=google

export const problemService = {
    getAllCompanies: async (): Promise<Company[]> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Combine all company data
        const allCompanies = [
            ...MAJOR_COMPANIES,
            ...OTHER_COMPANIES,
            ...EXTRA_COMPANIES,
        ];

        // Deduplicate companies by ID
        const uniqueCompanies = Array.from(
            new Map(allCompanies.map((c) => [c.id, c])).values()
        );

        return uniqueCompanies;
    },

    getCompanyById: async (id: string): Promise<Company | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const all = [
            ...MAJOR_COMPANIES,
            ...OTHER_COMPANIES,
            ...EXTRA_COMPANIES,
        ];
        return all.find((c) => c.id === id);
    },
};

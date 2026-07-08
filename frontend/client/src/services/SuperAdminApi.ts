import { createApiClient } from "@/lib/apiClient";

const api = createApiClient("/super-admin");

export const SuperAdminApi = {
    generateKey: async (notes?: string) => {
        const response = await api.post('/keys', { notes });
        return response.data;
    },
    listKeys: async () => {
        const response = await api.get('/keys');
        return response.data;
    },
    revokeKey: async (id: number) => {
        const response = await api.delete(`/keys/${id}`);
        return response.data;
    }
};

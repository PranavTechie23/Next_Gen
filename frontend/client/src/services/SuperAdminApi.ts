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
    },
    // Metrics
    getMetrics: async () => {
        const response = await api.get('/metrics');
        return response.data;
    },

    // Announcements
    createAnnouncement: async (data: any) => {
        const response = await api.post('/announcements', data);
        return response.data;
    },
    listAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },

    // Institutions
    toggleInstitutionStatus: async (id: number, is_active: boolean) => {
        const response = await api.put(`/institutions/${id}/toggle-status`, { is_active });
        return response.data;
    },

    // Users
    listUsers: async (params?: { page?: number, limit?: number, search?: string, role?: string, institution_id?: string }) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Impersonation
    impersonateUser: async (userId: number) => {
        const response = await api.post(`/impersonate/${userId}`);
        return response.data;
    },

    // System Settings
    getSettings: async () => {
        const response = await api.get('/settings');
        return response.data;
    },
    updateSetting: async (key: string, value: string) => {
        const response = await api.put(`/settings/${key}`, { value });
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async () => {
        const response = await api.get('/audit-logs');
        return response.data;
    },
    listInstitutions: async () => {
        const response = await api.get('/institutions');
        return response.data;
    },
    createCompanyKit: async (data: { institution_id: number; id?: string; name: string; tier?: string; description?: string; avg_package?: string; logo_url?: string; gradient?: string; }) => {
        const response = await api.post('/company-kits', data);
        return response.data;
    },
    createCodingProblem: async (data: { institution_id: number; company_id: string; title: string; difficulty?: string; topic?: string; url?: string; pool_type?: string; }) => {
        const response = await api.post('/coding-problems', data);
        return response.data;
    }
};

import { useApi } from './apiService';

// Interface pour les utilisateurs
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les entreprises
export interface Company {
  id: string;
  name: string;
  status: string;
  industry: string;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    nextBillingDate?: string;
  };
}

// Interface pour les statistiques du tableau de bord
export interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  activeCompanies: number;
  totalCompanies: number;
  revenueCurrentMonth: number;
  revenueLastMonth: number;
  growthRate: number;
  tokenUsage: {
    total: number;
    byCategory: Record<string, number>;
  };
}

// Service d'API pour l'administration
export const useAdminApi = () => {
  const api = useApi();

  return {
    // Gestion des utilisateurs
    getUsers: () => api.get<AdminUser[]>('/admin/users'),
    getUserById: (id: string) => api.get<AdminUser>(`/admin/users/${id}`),
    createUser: (userData: Partial<AdminUser>) => api.post<AdminUser>('/admin/users', userData),
    updateUser: (id: string, userData: Partial<AdminUser>) => api.put<AdminUser>(`/admin/users/${id}`, userData),
    deleteUser: (id: string) => api.delete<void>(`/admin/users/${id}`),
    
    // Gestion des entreprises
    getCompanies: () => api.get<Company[]>('/admin/companies'),
    getCompanyById: (id: string) => api.get<Company>(`/admin/companies/${id}`),
    updateCompany: (id: string, companyData: Partial<Company>) => api.put<Company>(`/admin/companies/${id}`, companyData),
    
    // Tableau de bord et statistiques
    getDashboardStats: () => api.get<DashboardStats>('/admin/dashboard/stats'),
    
    // Paramètres système
    getSettings: () => api.get('/admin/settings'),
    updateSetting: (id: string, value: string | number | boolean | Record<string, unknown>) => 
      api.put(`/admin/settings/${id}`, { value }),
    
    // Rapports et exports
    generateUserReport: (filters: { 
      status?: string; 
      role?: string; 
      dateRange?: { start: string; end: string } 
    }) => api.post('/admin/reports/users', filters),    generateRevenueReport: (period: string) => api.get(`/admin/reports/revenue?period=${period}`),
    
    // Fonctionnalités spécifiques
    approveCustomer: (id: string) => api.post(`/admin/customers/${id}/approve`, {}),
    rejectCustomer: (id: string, reason: string) => api.post(`/admin/customers/${id}/reject`, { reason }),
    resetUserPassword: (userId: string) => api.post(`/admin/users/${userId}/reset-password`, {}),
  };
};

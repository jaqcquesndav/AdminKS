import apiClient from './client';
import { API_ENDPOINTS, replaceUrlParams } from './config';
import { cloudinaryService } from '../cloudinary';
import type { User, UserRole, UserStatus, UserStatistics, ActivityStatistics, CustomerAccount } from '../../types/user';

interface UserListResponse {
  users: User[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface UserActivityResponse {
  activities: Array<{
    id: string;
    action: string;
    timestamp: string;
    ipAddress: string;
    device: string;
    browser: string;
    details?: Record<string, unknown>;
  }>;
  totalCount: number;
}

interface UserSessionResponse {
  sessions: Array<{
    id: string;
    ipAddress: string;
    device: string;
    browser: string;
    location: string;
    startTime: string;
    lastActivity: string;
    active: boolean;
  }>;
  totalCount: number;
}

export const usersApi = {
  // Obtenir la liste des utilisateurs
  getAll: async (params?: {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.users.list, { params });
    return response.data;
  },

  // Obtenir un utilisateur par son ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Obtenir le profil de l'utilisateur actuel
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.users.profile);
    return response.data;
  },

  // Mettre à jour le profil de l'utilisateur actuel
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.users.update, data);
    return response.data;
  },

  // Créer un nouvel utilisateur
  create: async (userData: {
    email: string;
    name: string;
    role: UserRole;
    password?: string;
    sendInvitation?: boolean;
    permissions?: string[];
    departement?: string;
    phoneNumber?: string;
  }): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.users.create, userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  delete: async (id: string): Promise<void> => {
    const url = replaceUrlParams(API_ENDPOINTS.users.delete, { id });
    await apiClient.delete(url);
  },

  // Changer le mot de passe
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/users/change-password', data);
    return response.data;
  },

  // Obtenir les activités d'un utilisateur
  getActivities: async (id: string, params?: { page?: number; limit?: number }): Promise<UserActivityResponse> => {
    const url = replaceUrlParams(API_ENDPOINTS.users.activities, { id });
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  // Obtenir les sessions actives d'un utilisateur
  getSessions: async (id: string): Promise<UserSessionResponse> => {
    const url = replaceUrlParams(API_ENDPOINTS.users.sessions, { id });
    const response = await apiClient.get(url);
    return response.data;
  },

  // Terminer une session
  terminateSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/sessions/${sessionId}`);
  },

  // Téléverser un avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      // Upload to Cloudinary first
      const cloudinaryResponse = await cloudinaryService.upload(file, 'avatars');
      
      // Send the Cloudinary URL to the backend
      const response = await apiClient.post('/users/avatar', {
        avatarUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Obtenir les statistiques des utilisateurs
  getStatistics: async (): Promise<UserStatistics> => {
    const response = await apiClient.get('/admin/users/statistics');
    return response.data;
  },

  // Obtenir les statistiques d'activité
  getActivityStatistics: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<ActivityStatistics> => {
    const response = await apiClient.get('/admin/activity/statistics', { params: { period } });
    return response.data;
  },

  // Réinitialiser le mot de passe d'un utilisateur (en tant qu'admin)
  resetUserPassword: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/admin/users/${userId}/reset-password`);
    return response.data;
  },

  // Activer ou désactiver un utilisateur
  toggleUserStatus: async (userId: string, active: boolean): Promise<User> => {
    const response = await apiClient.post(`/admin/users/${userId}/toggle-status`, { active });
    return response.data;
  },

  // Obtenir la liste des comptes clients
  getCustomerAccounts: async (params?: { 
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ accounts: CustomerAccount[]; totalCount: number }> => {
    const response = await apiClient.get('/admin/customer-accounts', { params });
    return response.data;
  }
};

export default usersApi;
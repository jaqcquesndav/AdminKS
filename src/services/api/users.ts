import { apiClient, API_ENDPOINTS, replaceUrlParams, handleApiError } from './index';
import { cloudinaryService } from '../cloudinary';
import type { User } from '../../types/user';
import type { ActivityLog, UserSession } from '../../types/activity';

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.users.list);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUser: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(
        replaceUrlParams(API_ENDPOINTS.users.profile, { id })
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.users.create, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateUser: async (id: string, data: Partial<User>, avatar?: File): Promise<User> => {
    try {
      let avatarUrl;
      if (avatar) {
        const cloudinaryResponse = await cloudinaryService.upload(avatar, 'avatars');
        avatarUrl = cloudinaryResponse.secure_url;
      }

      const response = await apiClient.put(
        replaceUrlParams(API_ENDPOINTS.users.update, { id }), 
        {
          ...data,
          ...(avatarUrl && { avatar: avatarUrl })
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(
        replaceUrlParams(API_ENDPOINTS.users.delete, { id })
      );
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserActivities: async (userId: string): Promise<ActivityLog[]> => {
    try {
      const response = await apiClient.get(
        replaceUrlParams(API_ENDPOINTS.users.activities, { id: userId })
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserSessions: async (userId: string): Promise<UserSession[]> => {
    try {
      const response = await apiClient.get(
        replaceUrlParams(API_ENDPOINTS.users.sessions, { id: userId })
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  terminateSession: async (userId: string, sessionId: string): Promise<void> => {
    try {
      await apiClient.delete(
        replaceUrlParams(`${API_ENDPOINTS.users.sessions}/${sessionId}`, { id: userId })
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
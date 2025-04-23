import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type { Notification, NotificationPreferences, NotificationType } from '../../types/notification';

interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

export const notificationsApi = {
  // Récupérer toutes les notifications
  getAll: async (params?: { limit?: number; offset?: number; read?: boolean }): Promise<NotificationListResponse> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // Récupérer le nombre de notifications non lues
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  // Marquer une notification comme lue
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  // Supprimer une notification
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Récupérer les préférences de notification
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  },

  // Mettre à jour les préférences de notification
  updatePreferences: async (preferences: NotificationPreferences): Promise<NotificationPreferences> => {
    const response = await apiClient.put('/notifications/preferences', preferences);
    return response.data;
  },

  // S'abonner aux notifications en temps réel (WebSocket)
  subscribeToRealtime: (callback: (notification: Notification) => void) => {
    // Cette fonction sera implémentée plus tard avec WebSockets ou SSE
    // Pour l'instant, elle est un placeholder
    console.log('WebSocket subscription would be initialized here');
    return {
      unsubscribe: () => {
        console.log('WebSocket connection would be closed here');
      }
    };
  },

  // Récupérer les notifications par type
  getByType: async (type: NotificationType): Promise<NotificationListResponse> => {
    const response = await apiClient.get(`/notifications/type/${type}`);
    return response.data;
  }
};

export default notificationsApi;
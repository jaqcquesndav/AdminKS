import api from './client';
import type { Notification } from '../../types/notification';

// Mock data pour le développement
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'security',
    title: 'Nouvelle connexion détectée',
    message: 'Une nouvelle connexion a été détectée depuis Chrome/Windows',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    metadata: {
      deviceInfo: 'Chrome/Windows',
      location: 'Goma, RD Congo'
    }
  },
  {
    id: '2',
    type: 'subscription',
    title: 'Abonnement expirant bientôt',
    message: 'Votre abonnement ERP Suite expire dans 7 jours',
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    metadata: {
      subscriptionId: 'sub_123',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  },
  {
    id: '3',
    type: 'document',
    title: 'Document vérifié',
    message: 'Votre RCCM a été vérifié avec succès',
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: {
      documentId: 'doc_123',
      documentType: 'rccm'
    }
  },
  {
    id: '4',
    type: 'payment',
    title: 'Paiement reçu',
    message: 'Paiement de 50 USD reçu pour l\'abonnement mensuel',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      paymentId: 'pay_123',
      amount: 50,
      currency: 'USD'
    }
  }
];

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; limit?: number }): Promise<Notification[]> => {
    try {
      if (import.meta.env.DEV) {
        await delay(800); // Simuler la latence
        return MOCK_NOTIFICATIONS;
      }

      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error('Impossible de charger les notifications');
    }
  },

  markAsRead: async (notificationIds: string[]): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        await delay(500);
        return;
      }

      await api.post('/notifications/read', { notificationIds });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      throw new Error('Impossible de marquer les notifications comme lues');
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        await delay(500);
        return;
      }

      await api.post('/notifications/read-all');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Impossible de marquer toutes les notifications comme lues');
    }
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        await delay(500);
        return;
      }

      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new Error('Impossible de supprimer la notification');
    }
  },

  deleteAllNotifications: async (): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        await delay(500);
        return;
      }

      await api.delete('/notifications');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      throw new Error('Impossible de supprimer toutes les notifications');
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      if (import.meta.env.DEV) {
        await delay(300);
        return MOCK_NOTIFICATIONS.filter(n => !n.read).length;
      }

      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw new Error('Impossible de récupérer le nombre de notifications non lues');
    }
  },

  subscribeToNotifications: (callback: (notification: Notification) => void) => {
    if (import.meta.env.DEV) {
      // Simuler des notifications en temps réel en mode développement
      const interval = setInterval(() => {
        const types: Notification['type'][] = ['security', 'payment', 'document', 'subscription'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const mockNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: `Nouvelle notification ${randomType}`,
          message: `Ceci est une notification de test de type ${randomType}`,
          read: false,
          timestamp: new Date(),
          metadata: {
            testData: 'mock'
          }
        };

        // 10% de chance d'envoyer une notification
        if (Math.random() < 0.1) {
          callback(mockNotification);
        }
      }, 10000); // Vérifier toutes les 10 secondes

      return () => clearInterval(interval);
    }

    try {
      const eventSource = new EventSource('/api/notifications/subscribe');
      
      eventSource.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        callback(notification);
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
      };

      return () => eventSource.close();
    } catch (error) {
      console.error('Failed to setup SSE:', error);
      throw new Error('Impossible de configurer les notifications en temps réel');
    }
  }
};
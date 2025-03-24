import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../services/api/notifications';
import { useToastStore } from '../components/common/ToastContainer';
import type { Notification } from '../types/notification';

// Intervalle de polling en ms quand WebSocket n'est pas disponible
const POLLING_INTERVAL = 30000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      addToast('error', 'Erreur lors du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await notificationsApi.markAsRead(notificationIds);
      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      addToast('error', 'Erreur lors du marquage des notifications');
    }
  }, [addToast]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      addToast('error', 'Erreur lors du marquage des notifications');
    }
  }, [addToast]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== notificationId);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      addToast('error', 'Erreur lors de la suppression de la notification');
    }
  }, [addToast]);

  // Fonction pour gérer les nouvelles notifications
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
    addToast(notification.type, notification.message);
  }, [addToast]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let pollingInterval: NodeJS.Timeout | undefined;

    const setupRealTimeUpdates = async () => {
      // Essayer d'abord Server-Sent Events (SSE)
      try {
        cleanup = notificationsApi.subscribeToNotifications(handleNewNotification);
        setWsConnected(true);
        return;
      } catch (error) {
        console.log('SSE not available, falling back to polling');
      }

      // Fallback au polling
      setWsConnected(false);
      pollingInterval = setInterval(loadNotifications, POLLING_INTERVAL);
    };

    // Charger les notifications initiales
    loadNotifications();

    // Configurer les mises à jour en temps réel
    setupRealTimeUpdates();

    return () => {
      if (cleanup) {
        cleanup();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [loadNotifications, handleNewNotification]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isRealTime: wsConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  };
}
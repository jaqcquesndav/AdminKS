import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../services/notifications/notificationsApiService';
import { useToastContext } from '../contexts/ToastContext';
import type { Notification, NotificationType } from '../types/notification';

// Intervalle de polling en ms quand WebSocket n'est pas disponible
const POLLING_INTERVAL = 30000;

// Fonction pour convertir NotificationType vers ToastType
const mapNotificationTypeToToastType = (type: NotificationType): 'info' | 'success' | 'warning' | 'error' => {
  switch (type) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'security':
    case 'payment':
    case 'subscription':
    case 'document':
    case 'info':
    default:
      return 'info';
  }
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const { showToast } = useToastContext();

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data.notifications);
      const unreadCountData = await notificationsApi.getUnreadCount();
      setUnreadCount(unreadCountData.count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      showToast('error', 'Erreur lors du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      // API accepts only one ID at a time, so we need to call it for each ID
      for (const id of notificationIds) {
        await notificationsApi.markAsRead(id);
      }
      
      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      showToast('error', 'Erreur lors du marquage des notifications');
    }
  }, [showToast]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      showToast('error', 'Erreur lors du marquage des notifications');
    }
  }, [showToast]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.delete(notificationId);
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== notificationId);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showToast('error', 'Erreur lors de la suppression de la notification');
    }
  }, [showToast]);

  // Fonction pour gérer les nouvelles notifications
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
    showToast(mapNotificationTypeToToastType(notification.type), notification.message);
  }, [showToast]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let pollingInterval: NodeJS.Timeout | undefined;

    const setupRealTimeUpdates = async () => {
      // Essayer d'abord Server-Sent Events (SSE)
      try {
        const subscription = notificationsApi.subscribeToRealtime(handleNewNotification);
        setWsConnected(true);
        cleanup = subscription.unsubscribe;
        return;
      } catch {
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
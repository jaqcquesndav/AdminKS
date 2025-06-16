import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../services/api/apiService';
import { useToast } from './useToast';

export interface NotificationPreference {
  id: string; // e.g., 'emailMarketing', 'pushActivity'
  label: string; // User-friendly label for the preference
  description: string; // Description of what the notification is for
  channel: 'email' | 'push' | 'sms'; // Channel of notification
  type: string; // Category like 'marketing', 'security', 'features', 'activity', 'chat', 'alerts'
  isEnabled: boolean;
}

export interface NotificationPreferencesData {
  preferences: NotificationPreference[];
  // emailAddress?: string; // Could be part of this if notifications are tied to a specific admin email
  // pushNotificationToken?: string; // For push notifications setup
}

export const useNotificationPreferences = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotificationPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<NotificationPreferencesData>('/admin/settings/notifications');
      // Assuming the API returns a flat list of preferences or a structure that can be mapped to it.
      // If the API returns preferences grouped by channel/type, adjust mapping accordingly.
      setPreferences(response.data.preferences || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch notification preferences.';
      setError(msg);
      showToast('error', msg);
      // Fallback to a default set of preferences if API fails or returns empty
      // This part is optional and depends on desired behavior
      // setPreferences(getDefaultPreferences()); 
    } finally {
      setIsLoading(false);
    }
  }, [api, showToast]);

  const updateNotificationPreference = useCallback(async (preferenceId: string, isEnabled: boolean) => {
    setIsUpdating(true);
    setError(null);
    try {
      // API might expect the full list or just the changed item
      // This example assumes updating a single preference by its ID
      // PUT /admin/settings/notifications/{preferenceId} or PATCH /admin/settings/notifications
      const response = await api.put<NotificationPreference>(`/admin/settings/notifications/${preferenceId}`, { isEnabled });
      
      setPreferences(prev => 
        prev.map(p => p.id === preferenceId ? { ...p, isEnabled: response.data.isEnabled } : p)
      );
      showToast('success', 'Notification preference updated.');
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update notification preference.';
      setError(msg);
      showToast('error', msg);
      // Optionally revert UI change on error
      // setPreferences(prev => prev.map(p => p.id === preferenceId ? { ...p, isEnabled: !isEnabled } : p));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast]);
  
  // Alternative: Update all preferences at once
  const updateAllNotificationPreferences = useCallback(async (updatedPreferences: NotificationPreference[]) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await api.put<NotificationPreferencesData>('/admin/settings/notifications', { preferences: updatedPreferences });
      setPreferences(response.data.preferences || []);
      showToast('success', 'Notification preferences updated.');
      return response.data.preferences;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update notification preferences.';
      setError(msg);
      showToast('error', msg);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast]);


  useEffect(() => {
    fetchNotificationPreferences();
  }, [fetchNotificationPreferences]);

  return {
    preferences,
    isLoading,
    isUpdating,
    error,
    fetchNotificationPreferences,
    updateNotificationPreference,
    updateAllNotificationPreferences // Expose this if batch updates are preferred
  };
};

// Example of default preferences if needed for fallback or initial state before API call
// const getDefaultPreferences = (): NotificationPreference[] => [
//   { id: 'emailMarketing', label: 'Marketing Emails', description: 'Receive updates on new products and promotions.', channel: 'email', type: 'marketing', isEnabled: true },
//   { id: 'emailSecurity', label: 'Security Alerts', description: 'Receive alerts for important security events.', channel: 'email', type: 'security', isEnabled: true },
//   { id: 'emailFeatures', label: 'Feature Updates', description: 'Receive notifications about new features and improvements.', channel: 'email', type: 'features', isEnabled: false },
//   { id: 'pushActivity', label: 'Account Activity Push', description: 'Get push notifications for important account activities.', channel: 'push', type: 'activity', isEnabled: true },
//   { id: 'pushChat', label: 'Chat Message Push', description: 'Get push notifications for new chat messages.', channel: 'push', type: 'chat', isEnabled: false },
//   { id: 'smsAlerts', label: 'Critical SMS Alerts', description: 'Receive SMS for critical system alerts.', channel: 'sms', type: 'alerts', isEnabled: false },
// ];

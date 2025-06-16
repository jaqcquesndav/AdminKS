import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../services/api/apiService';
import { useToast } from './useToast';

export interface AppSetting {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
}

export const useAppSettings = () => {
  const api = useApi();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Stores ID of setting being updated
  const [error, setError] = useState<string | null>(null);

  const fetchAppSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming api.getSettings() is available and returns { data: AppSetting[] }
      // This was used in APISettingsPage.tsx directly before
      const response = await api.get<{ data: AppSetting[] }>('/settings'); // Assuming a generic GET to /settings
      setSettings(response.data.data); // Adjust if response structure is different, e.g. response.data directly
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch app settings.';
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error('Failed to fetch app settings:', err);
      setSettings([]); // Ensure settings is an empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [api, showToast]);

  const updateAppSetting = useCallback(async (settingId: string, newValue: string) => {
    setIsUpdating(settingId);
    setError(null);
    try {
      // Assuming an API endpoint like PUT /settings/{id}
      // The body might need to be { value: newValue } or the full setting object
      await api.put(`/settings/${settingId}`, { value: newValue });

      setSettings(prevSettings =>
        prevSettings.map(s => (s.id === settingId ? { ...s, value: newValue } : s))
      );
      showToast('success', `Setting '${settingId}' updated successfully.`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update setting '${settingId}'.`;
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error(`Failed to update setting ${settingId}:`, err);
    } finally {
      setIsUpdating(null);
    }
  }, [api, showToast]);

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  return {
    settings,
    isLoading,
    isUpdating,
    error,
    fetchAppSettings,
    updateAppSetting,
  };
};

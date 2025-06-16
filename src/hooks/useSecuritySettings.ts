import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../services/api/apiService';
import { useToast } from './useToast';

// Define types for security settings, active sessions, and login history
// These should ideally be in your types directory, e.g., src/types/security.ts

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string; // ISO date string
  isCurrent: boolean;
  browser?: string;
  os?: string;
}

export interface LoginAttempt {
  id: string;
  date: string; // ISO date string
  ipAddress: string;
  device: string;
  location: string;
  status: 'successful' | 'failed';
  userAgent?: string;
}

export interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  // Potentially other settings like password policy, etc.
}

export const useSecuritySettings = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsData | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecuritySettings = useCallback(async () => {
    setIsLoadingSettings(true);
    setError(null);
    try {
      const response = await api.get<SecuritySettingsData>('/admin/security/settings');
      setSecuritySettings(response.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch security settings.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [api, showToast]);

  const fetchActiveSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setError(null);
    try {
      const response = await api.get<{ sessions: ActiveSession[] }>('/admin/security/sessions');
      setActiveSessions(response.data.sessions);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch active sessions.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [api, showToast]);

  const fetchLoginHistory = useCallback(async (limit: number = 10) => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const response = await api.get<{ history: LoginAttempt[] }>(`/admin/security/login-history?limit=${limit}`);
      setLoginHistory(response.data.history);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch login history.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [api, showToast]);

  const updateTwoFactorAuth = useCallback(async (enabled: boolean) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await api.put<SecuritySettingsData>('/admin/security/settings/2fa', { enabled });
      setSecuritySettings(response.data);
      showToast('success', `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`);
      return response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update 2FA status.';
      setError(msg);
      showToast('error', msg);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      await api.put('/admin/security/password', { currentPassword, newPassword });
      showToast('success', 'Password changed successfully.');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change password.';
      setError(msg);
      showToast('error', msg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast]);

  const terminateSession = useCallback(async (sessionId: string) => {
    setIsUpdating(true); // Or a more specific loading state
    setError(null);
    try {
      await api.delete(`/admin/security/sessions/${sessionId}`);
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      showToast('success', 'Session terminated successfully.');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to terminate session.';
      setError(msg);
      showToast('error', msg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast]);
  
  const terminateAllOtherSessions = useCallback(async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await api.delete('/admin/security/sessions/all-other');
      // Refetch or filter locally. Refetching is safer.
      fetchActiveSessions(); 
      showToast('success', 'All other sessions terminated.');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to terminate all other sessions.';
      setError(msg);
      showToast('error', msg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast, fetchActiveSessions]);


  useEffect(() => {
    fetchSecuritySettings();
    fetchActiveSessions();
    fetchLoginHistory();
  }, [fetchSecuritySettings, fetchActiveSessions, fetchLoginHistory]);

  return {
    securitySettings,
    activeSessions,
    loginHistory,
    isLoading: isLoadingSettings || isLoadingSessions || isLoadingHistory,
    isUpdating,
    error,
    fetchSecuritySettings,
    fetchActiveSessions,
    fetchLoginHistory,
    updateTwoFactorAuth,
    changePassword,
    terminateSession,
    terminateAllOtherSessions,
  };
};

import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from '../services/api/apiService';
import { useToast } from './useToast';
import type { UserProfile } from '../types/user'; // Assuming UserProfile type exists

// If UserProfile doesn't exist or needs adjustment, define it here or in ../types/user.ts
// export interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   phoneNumber?: string;
//   position?: string;
//   avatarUrl?: string;
//   // Add other relevant fields
// }

export const useAdminProfile = () => {
  const api = useApi();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Refs to manage connection errors and prevent excessive retries
  const retryCount = useRef(0);
  const hasConnectionError = useRef(false);
  const lastErrorTime = useRef<number>(0);
  const isMounted = useRef(true);
  
  // Time constants
  const ERROR_COOLDOWN_MS = 30000; // 30 seconds
  const MAX_RETRY_COUNT = 3;

  const fetchAdminProfile = useCallback(async () => {
    // Don't fetch if component is unmounted
    if (!isMounted.current) return;
    
    // Check if we're in error cooldown period
    const now = Date.now();
    if (hasConnectionError.current && (now - lastErrorTime.current < ERROR_COOLDOWN_MS)) {
      console.log(`Skipping profile fetch - in cooldown period (${Math.round((now - lastErrorTime.current) / 1000)}s elapsed)`);
      return;
    }
    
    // Skip if we've reached maximum retry attempts
    if (hasConnectionError.current && retryCount.current >= MAX_RETRY_COUNT) {
      console.log(`Skipping profile fetch - reached maximum retry attempts (${MAX_RETRY_COUNT})`);
      return;
    }

    // Only set loading on initial fetch, not retries
    if (!hasConnectionError.current) {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Attempt to fetch the profile
      const response = await api.get<UserProfile>('/admin/profile');
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProfile(response.data);
        // Reset error tracking on success
        hasConnectionError.current = false;
        retryCount.current = 0;
      }
    } catch (err: unknown) {
      // Only handle errors if component is still mounted
      if (!isMounted.current) return;
      
      // Check if it's a network connection error
      const isConnectionError =
        err instanceof Error &&
        (err.message.includes('Network Error') ||
         err.message.includes('ERR_CONNECTION_REFUSED') ||
         err.message.includes('timeout') ||
         err.message.includes('ECONNREFUSED'));

      if (isConnectionError) {
        hasConnectionError.current = true;
        retryCount.current += 1;
        lastErrorTime.current = Date.now();

        // Only show toast for the first connection error
        if (retryCount.current === 1) {
          showToast('error', 'Cannot connect to server. Check your network connection.');
        }

        // Log detailed error info but limit noise in console
        if (retryCount.current <= MAX_RETRY_COUNT) {
          console.error(`Connection error (attempt ${retryCount.current}):`, err instanceof Error ? err.message : 'Unknown error');
        } else if (retryCount.current === MAX_RETRY_COUNT + 1) {
          console.error('Multiple connection errors. Suppressing further logs.');
        }
      } else {
        // For other errors, show normally
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin profile.';
        setError(errorMessage);
        showToast('error', errorMessage);
        console.error('Failed to fetch admin profile:', err instanceof Error ? err.message : err);
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [api, showToast, ERROR_COOLDOWN_MS, MAX_RETRY_COUNT]);

  const updateAdminProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!profile) {
      showToast('error', 'Profile data not loaded yet.');
      return null;
    }
    setIsUpdating(true);
    setError(null);
    try {
      // Assume API endpoint PUT /admin/profile or /users/me
      const response = await api.put<UserProfile>('/admin/profile', data);
      setProfile(response.data); // Update local state with response from API
      showToast('success', 'Admin profile updated successfully.');
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update admin profile.';
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error('Failed to update admin profile:', err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [api, showToast, profile]);

  const updateAdminAvatar = useCallback(async (avatarFile: File) => {
    if (!profile) {
      showToast('error', 'Profile data not loaded yet.');
      return null;
    }
    setIsUpdating(true); // Can use the same updating flag or a dedicated one
    setError(null);
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      // Assume API endpoint POST /admin/profile/avatar or similar, using multipart/form-data
      const response = await api.postMultipart<UserProfile>('/admin/profile/avatar', formData);
      setProfile(response.data); // Update profile with new avatar URL from response
      showToast('success', 'Admin avatar updated successfully.');
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update admin avatar.';
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error('Failed to update admin avatar:', err);
      return null;
    } finally {
      setIsUpdating(false);
    }  }, [api, showToast, profile]);
  // Modified useEffect to limit connection attempts and handle component lifecycle
  useEffect(() => {
    isMounted.current = true;
    
    // Initial fetch
    fetchAdminProfile();

    // Set up a refresh interval with progressive backoff
    let refreshDelay = 5 * 60 * 1000; // Start with 5 minutes
    
    // If we're in error state, use progressive backoff timing
    if (hasConnectionError.current) {
      // 30s, 2m, 5m based on retry count
      refreshDelay = Math.min(30 * 1000 * Math.pow(4, retryCount.current - 1), 5 * 60 * 1000);
    }
    
    const intervalId = setInterval(() => {
      // Only attempt refresh if not in error state or if error cooldown has passed
      if (!hasConnectionError.current || (Date.now() - lastErrorTime.current > ERROR_COOLDOWN_MS)) {
        fetchAdminProfile();
      }
    }, refreshDelay);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [fetchAdminProfile, ERROR_COOLDOWN_MS]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    fetchAdminProfile,
    updateAdminProfile,
    updateAdminAvatar,
  };
};

import { useState, useCallback, useEffect } from 'react';
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

  const fetchAdminProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assume API endpoint /admin/profile or /users/me or similar
      const response = await api.get<UserProfile>('/admin/profile');
      setProfile(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin profile.';
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error('Failed to fetch admin profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [api, showToast]);

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
    }
  }, [api, showToast, profile]);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

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

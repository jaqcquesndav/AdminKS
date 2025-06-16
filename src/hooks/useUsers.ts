import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../components/common/ToastContainer';
import { useUserService } from '../services/users/userService';
import type { User, UserRole } from '../types/user';

export function useUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore(state => state.addToast);
  const userService = useUserService();

  const loadUsers = useCallback(async (requestingUserRole?: UserRole, requestingUserCompanyId?: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers(requestingUserRole, requestingUserCompanyId);
      setUsers(data);
    } catch (err) { // Changed variable name to err
      console.error('Failed to load users:', err);
      addToast('error', t('users.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userService]);

  type CreateUserDataHook = Parameters<typeof userService.createUser>[0];

  const createUser = useCallback(async (data: CreateUserDataHook) => {
    try {
      const newUser = await userService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      addToast('success', t('users.notifications.created'));
      return newUser;
    } catch (err) { // Changed variable name to err
      addToast('error', err instanceof Error ? err.message : t('users.errors.createFailed'));
      throw err; // Re-throw err
    }
  }, [addToast, t, userService]);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(id, data);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      addToast('success', t('users.notifications.updated'));
      return updatedUser;
    } catch (err) { // Changed variable name to err
      addToast('error', t('users.errors.updateFailed'));
      throw err; // Re-throw err
    }
  }, [addToast, t, userService]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      addToast('success', t('users.notifications.deleted'));
    } catch (err) { // Changed variable name to err
      addToast('error', t('users.errors.deleteFailed'));
      throw err; // Re-throw err
    }
  }, [addToast, t, userService]);
  
  const getUserById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const user = await userService.getUserById(id);
      return user;
    } catch (err) { // Changed variable name to err
      console.error(`Failed to load user ${id}:`, err);
      addToast('error', t('users.errors.loadSingleFailed'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userService]);

  return {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
}
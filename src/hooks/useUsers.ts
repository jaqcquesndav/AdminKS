import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../components/common/ToastContainer';
import * as userService from '../services/userService';
import type { User } from '../types/user';

export function useUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      addToast('error', t('users.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t]);

  const createUser = useCallback(async (data: Parameters<typeof userService.createUser>[0]) => {
    try {
      const newUser = await userService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      addToast('success', t('users.notifications.created'));
      return newUser;
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : t('users.errors.createFailed'));
      throw error;
    }
  }, [addToast, t]);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(id, data);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      addToast('success', t('users.notifications.updated'));
      return updatedUser;
    } catch (error) {
      addToast('error', t('users.errors.updateFailed'));
      throw error;
    }
  }, [addToast, t]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      addToast('success', t('users.notifications.deleted'));
    } catch (error) {
      addToast('error', t('users.errors.deleteFailed'));
      throw error;
    }
  }, [addToast, t]);

  return {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  };
}
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../components/common/ToastContainer';
import { useUserService } from '../services/users/userService';
import { useUserTokenService, UserTokenStats } from '../services/users/userTokenService';
import { useCustomerService } from '../services/customers/customerService'; // Import customer service
import type { User, UserRole } from '../types/user';
import type { ActivityLog, UserSession } from '../types/activity';

export function useUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userActivities, setUserActivities] = useState<ActivityLog[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [tokenStats, setTokenStats] = useState<UserTokenStats | null>(null);
  const addToast = useToastStore(state => state.addToast);
  const userService = useUserService();
  const userTokenService = useUserTokenService();
  const customerService = useCustomerService(); // Add customer service

  // Helper to enrich external users with customer data
  const enrichUsersWithCustomerData = useCallback(async (usersData: User[]): Promise<User[]> => {
    const externalUsers = usersData.filter(user => 
      user.userType === 'external' && user.customerAccountId && !user.customerName
    );
    
    // Process in batches to avoid too many simultaneous requests
    const enrichedUsers = [...usersData];
    
    for (const user of externalUsers) {
      try {
        if (user.customerAccountId) {
          const customerData = await customerService.getCustomerById(user.customerAccountId);
          if (customerData && customerData.customer) {
            const userIndex = enrichedUsers.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
              enrichedUsers[userIndex] = {
                ...enrichedUsers[userIndex],
                customerName: customerData.customer.name,
                customerType: customerData.customer.type === 'financial' ? 'financial_institution' : 'pme'
              };
            }
          }
        }
      } catch (err) {
        console.error(`Failed to get customer data for user ${user.id}:`, err);
        // Continue with next user even if one fails
      }
    }
    
    return enrichedUsers;
  }, [customerService]);

  const loadUsers = useCallback(async (requestingUserRole?: UserRole, requestingUserCompanyId?: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers(requestingUserRole, requestingUserCompanyId);
      // Enrich external users with customer data when missing
      const enrichedUsers = await enrichUsersWithCustomerData(data);
      setUsers(enrichedUsers);
    } catch (err) { // Changed variable name to err
      console.error('Failed to load users:', err);
      addToast('error', t('users.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userService, enrichUsersWithCustomerData]);

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

  const terminateUserSession = useCallback(async (userId: string, sessionId: string) => {
    try {
      // Assuming userService will have a method to terminate a session
      await userService.terminateUserSession(userId, sessionId);
      // Optionally, you might want to refresh user data or specific session list here
      addToast('success', t('users.notifications.sessionTerminated', 'Session terminated successfully.'));
    } catch (err) {
      console.error(`Failed to terminate session ${sessionId} for user ${userId}:`, err);
      addToast('error', t('users.errors.sessionTerminationFailed', 'Failed to terminate session.'));
      throw err; // Re-throw err
    }
  }, [addToast, t, userService]);

  const loadUserActivities = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const activities = await userService.getUserActivities(userId);
      setUserActivities(activities);
    } catch (err) {
      console.error(`Failed to load activities for user ${userId}:`, err);
      addToast('error', t('users.errors.loadActivitiesFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userService]);

  const loadUserSessions = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const sessions = await userService.getUserSessions(userId);
      setUserSessions(sessions);
    } catch (err) {
      console.error(`Failed to load sessions for user ${userId}:`, err);
      addToast('error', t('users.errors.loadSessionsFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userService]);

  const loadTokenStats = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const stats = await userTokenService.getUserTokenStats(userId);
      setTokenStats(stats);
    } catch (err) {
      console.error(`Failed to load token stats for user ${userId}:`, err);
      addToast('error', t('users.errors.loadTokenStatsFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, userTokenService]);

  return {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    terminateUserSession, // Added terminateUserSession to returned object
    userActivities,
    userSessions,
    tokenStats,
    loadUserActivities,
    loadUserSessions,
    loadTokenStats,
  };
}
import { useAdminApi, AdminUser } from '../api/adminApiService';
import type { User, UserRole, UserType, UserStatus, OrganizationType } from '../../types/user';
import type { ActivityLog, UserSession } from '../../types/activity'; // Import activity types
import { ROLE_PERMISSIONS } from '../../types/user';

// Helper to map AdminUser from API to frontend User type
const mapAdminUserToUser = (adminUser: AdminUser): User => {
  return {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role as UserRole,
    status: adminUser.status as UserStatus,
    userType: adminUser.userType as UserType || 'internal', // Default to internal if not specified
    customerAccountId: adminUser.customerAccountId, // Customer ID for external users
    customerName: adminUser.companyName, // Map API's companyName to customerName for clarity
    customerType: adminUser.companyType as OrganizationType, // Map API's companyType to customerType
    createdAt: adminUser.createdAt,
    lastLogin: adminUser.lastLogin,
    permissions: (adminUser.role as UserRole) ? 
      ROLE_PERMISSIONS[adminUser.role as UserRole].map(permission => ({
        applicationId: 'default',
        permissions: [permission]
      })) : [],
    // Ensure all other fields expected by frontend User type are mapped
  };
};

// Maps frontend User data to the structure expected by the Admin API for creating users
const mapUserToCreateAdminUserData = (data: CreateUserDataInternal): Partial<AdminUser> => {
  return {
    name: data.name,
    email: data.email,
    role: data.role,
    // Password, userType, customerAccountId are not part of AdminUser type.
    // Backend API and AdminUser type need to be updated if these are to be managed via this API.
  };
};

// Maps frontend User data to the structure expected by the Admin API for updating users
const mapUserToUpdateAdminUserData = (data: Partial<User>): Partial<AdminUser> => {
  return {
    name: data.name,
    // email: data.email, // Typically, email is not updatable or has a specific process.
    role: data.role,
    status: data.status,
    // userType and customerAccountId are not part of AdminUser type.
  };
};

// Interface for data received by createUser within userService
interface CreateUserDataInternal {
  name: string;
  email: string;
  password?: string; // Password handling needs clarification (e.g., Auth0 flow)
  role: UserRole;
  userType: UserType;
  customerAccountId?: string;
}

// This is now a custom hook that provides user service functions.
// It correctly uses the useAdminApi hook internally.
export const useUserService = () => {
  const adminApi = useAdminApi();
  const getUsers = async (
    requestingUserRole?: UserRole,
    requestingUserCompanyId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; totalCount: number; page: number; totalPages: number }> => {
    const response = await adminApi.getUsers({
      role: requestingUserRole,
      companyId: requestingUserCompanyId,
      page,
      limit,
    });
    if (response && response.data && Array.isArray(response.data.users)) {
      return {
        users: response.data.users.map(mapAdminUserToUser),
        totalCount: response.data.totalCount,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    }
    // fallback vide
    return { users: [], totalCount: 0, page: 1, totalPages: 1 };
  };

  const createUser = async (data: CreateUserDataInternal): Promise<User> => {
    const apiData = mapUserToCreateAdminUserData(data);
    // Note: Password, userType, customerAccountId are not sent via current adminApi.createUser
    // This might require backend API changes or a different user creation flow (e.g., via Auth0 directly)
    const response = await adminApi.createUser(apiData);
    if (response && response.data) {
      return mapAdminUserToUser(response.data);
    }
    throw new Error('Failed to create user - no data returned from API');
  };

  const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    const apiData = mapUserToUpdateAdminUserData(data);
    const response = await adminApi.updateUser(id, apiData);
    if (response && response.data) {
      return mapAdminUserToUser(response.data);
    }
    throw new Error('Failed to update user - no data returned from API');
  };

  const deleteUser = async (id: string): Promise<void> => {
    await adminApi.deleteUser(id);
  };
  
  const getUserById = async (id: string): Promise<User | null> => {
    const response = await adminApi.getUserById(id);
    if (response && response.data) {
      return mapAdminUserToUser(response.data);
    }
    return null;
  };

  const terminateUserSession = async (userId: string, sessionId: string): Promise<void> => {
    // This is a placeholder. The actual implementation will depend on how sessions are managed.
    // If sessions are managed by Auth0 or another external provider, this might involve an API call to that provider.
    // If sessions are managed internally, this would involve an API call to your backend to invalidate the session.
    console.log(`Terminating session ${sessionId} for user ${userId}`);
    // Example: await adminApi.terminateUserSession(userId, sessionId);
    // For now, we'll simulate success.
    return Promise.resolve();
  };

  const getUserActivities = async (userId: string): Promise<ActivityLog[]> => {
    // This is a placeholder - implement the actual API call when available
    console.log(`Getting activities for user ${userId}`);
    // Simulated response
    return Promise.resolve([]);
  };

  const getUserSessions = async (userId: string): Promise<UserSession[]> => {
    // This is a placeholder - implement the actual API call when available
    console.log(`Getting sessions for user ${userId}`);
    // Simulated response
    return Promise.resolve([]);
  };

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    terminateUserSession,
    getUserActivities,
    getUserSessions,
  };
};
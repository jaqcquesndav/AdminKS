import { useAdminApi, AdminUser } from '../api/adminApiService';
import type { User, UserRole, UserType, UserStatus } from '../../types/user'; // Added UserStatus
import { ROLE_PERMISSIONS } from '../../types/user';

// Helper to map AdminUser from API to frontend User type
const mapAdminUserToUser = (adminUser: AdminUser): User => {
  return {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role as UserRole,
    status: adminUser.status as UserStatus, // Added cast, ensure backend status strings match UserStatus literals
    userType: 'internal', // Placeholder: Determine from role or add to AdminUser API type
    customerAccountId: undefined, // Placeholder: Add to AdminUser API type if needed
    createdAt: adminUser.createdAt,
    lastLogin: adminUser.lastLogin,
    permissions: ROLE_PERMISSIONS[adminUser.role as UserRole] || [],
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

  const getUsers = async (requestingUserRole?: UserRole, requestingUserCompanyId?: string): Promise<User[]> => {
    console.log('useUserService.getUsers called with role:', requestingUserRole, 'companyId:', requestingUserCompanyId);
    // TODO: Implement API filtering if backend supports it.
    // Example: const response = await adminApi.getUsers({ params: { role: requestingUserRole, companyId: requestingUserCompanyId } });
    const response = await adminApi.getUsers();
    if (response && response.data) {
      return response.data.map(mapAdminUserToUser);
    }
    return [];
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

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};
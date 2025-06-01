import type { User, UserRole, UserType } from '../../types/user'; // Added UserType
import { ROLE_PERMISSIONS } from '../../types/user'; // Import ROLE_PERMISSIONS

// In-memory storage for users (replace with API calls in production)
const users = new Map<string, User>();

// Add default admin user
const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Jean Dupont',
  email: 'jean.dupont@kiota-suite.com',
  role: 'super_admin',
  userType: 'internal', // Added userType
  status: 'active',
  createdAt: new Date().toISOString(),
  lastLogin: new Date('2024-01-15T08:30:00').toISOString(),
  // Permissions will now be derived from ROLE_PERMISSIONS based on the role
  permissions: ROLE_PERMISSIONS.super_admin 
};

// Initialize with default admin
users.set(defaultAdmin.id, defaultAdmin);

interface CreateUserData {
  name: string;
  email: string;
  password: string; // Password handling will need a proper hashing mechanism in a real app
  role: UserRole;
  userType: UserType; // Added userType
  customerAccountId?: string; // Added customerAccountId, optional
}

export async function createUser(data: CreateUserData): Promise<User> {
  // Check if email already exists
  if (Array.from(users.values()).some(user => user.email === data.email)) {
    throw new Error('Email already exists');
  }

  // Validate customerAccountId for external users
  if (data.userType === 'external' && !data.customerAccountId) {
    throw new Error('customerAccountId is required for external users');
  }
  if (data.userType === 'internal' && data.customerAccountId) {
    // Or handle this case as an error, depending on desired logic
    console.warn('customerAccountId is provided for an internal user and will be ignored.');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    userType: data.userType,
    customerAccountId: data.userType === 'external' ? data.customerAccountId : undefined,
    status: 'pending', // New users could start as pending until email verification or admin approval
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(), // Or undefined until first login
    permissions: ROLE_PERMISSIONS[data.role] || [], // Assign permissions based on role
  };

  users.set(newUser.id, newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<User> { // email and createdAt usually not updatable directly
  const user = users.get(id);
  if (!user) {
    throw new Error('User not found');
  }

  // Prevent changing userType or customerAccountId directly if that's the business rule
  // Or add specific functions for such changes if allowed under certain conditions
  let newPermissions = user.permissions;
  if (data.role && data.role !== user.role) {
    newPermissions = ROLE_PERMISSIONS[data.role] || [];
  }

  const updatedUser: User = {
     ...user, 
     ...data, 
     permissions: newPermissions, 
     // Ensure customerAccountId is handled correctly if role/userType changes imply it
     customerAccountId: data.userType === 'external' 
                        ? (data.customerAccountId || user.customerAccountId) 
                        : undefined,
    updatedAt: new Date().toISOString(), // Assuming User type will have updatedAt
    };
  users.set(id, updatedUser);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  if (!users.delete(id)) {
    throw new Error('User not found');
  }
}

// getUsers might need to accept a parameter indicating the role of the requester
// to filter results accordingly (e.g., a company_admin only sees their company users)
export async function getUsers(requestingUserRole?: UserRole, requestingUserCompanyId?: string): Promise<User[]> {
  const allUsers = Array.from(users.values());

  if (requestingUserRole === 'super_admin') {
    return allUsers;
  }

  if (requestingUserRole === 'company_admin' && requestingUserCompanyId) {
    return allUsers.filter(user => user.userType === 'external' && user.customerAccountId === requestingUserCompanyId);
  }

  // Handle internal users who are not super_admins
  // They can see all other internal users
  const internalRoles: UserRole[] = ['cto', 'growth_finance', 'customer_support', 'content_manager'];
  if (requestingUserRole && internalRoles.includes(requestingUserRole)) {
    return allUsers.filter(user => user.userType === 'internal');
  }

  // Default: if no specific role matches above, or if role is company_user or other external without company_admin rights,
  // they should probably only see themselves (handled by getMyProfile) or no one through this generic getter.
  // For now, returning an empty array for unhandled roles or insufficient permissions.
  return [];
}

// It would be good to add a getMyProfile function
export async function getMyProfile(userId: string): Promise<User | undefined> {
  return users.get(userId);
}

// Function for super_admin to get users by company
export async function getUsersByCompany(companyId: string): Promise<User[]> {
  // This assumes super_admin rights or specific permission check elsewhere
  return Array.from(users.values()).filter(user => user.customerAccountId === companyId && user.userType === 'external');
}

// Function for a company_admin to update a user within their company
export async function updateCompanyUser(companyAdminId: string, targetUserId: string, data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'userType' | 'customerAccountId'>>): Promise<User> {
  const admin = users.get(companyAdminId);
  if (!admin || admin.role !== 'company_admin' || admin.userType !== 'external') {
    throw new Error('Unauthorized: Not a company admin.');
  }

  const user = users.get(targetUserId);
  if (!user || user.customerAccountId !== admin.customerAccountId) {
    throw new Error('User not found in this company or user is not an external user.');
  }

  // Company admin cannot change the role to super_admin or other internal roles.
  if (data.role && (data.role === 'super_admin' || data.role === 'cto' || data.role === 'growth_finance' || data.role === 'customer_support' || data.role === 'content_manager')) {
    throw new Error('Company admin cannot assign internal Kiota roles.');
  }
  // Company admin can only assign 'company_admin' or 'company_user' from their own company.
  if (data.role && data.role !== 'company_admin' && data.role !== 'company_user') {
    throw new Error('Invalid role assignment by company admin.');
  }

  let newPermissions = user.permissions;
  if (data.role && data.role !== user.role) {
    newPermissions = ROLE_PERMISSIONS[data.role] || [];
  }

  const updatedUser: User = {
    ...user,
    ...data,
    permissions: newPermissions,
    updatedAt: new Date().toISOString(), // Assuming User type will have updatedAt
  };

  users.set(targetUserId, updatedUser);
  return updatedUser;
}
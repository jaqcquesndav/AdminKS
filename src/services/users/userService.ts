import type { User } from '../types/user';
import type { ApplicationPermission } from '../types/permissions';
import { DEFAULT_PERMISSIONS } from '../types/permissions';

// In-memory storage for users (replace with API calls in production)
const users = new Map<string, User>();

// Add default admin user
const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Jean Dupont',
  email: 'jean.dupont@kiota-suite.com',
  role: 'admin',
  status: 'active',
  lastLogin: new Date('2024-01-15T08:30:00'),
  permissions: [
    {
      applicationId: 'accounting',
      permissions: ['read', 'write', 'admin']
    },
    {
      applicationId: 'sales',
      permissions: ['read', 'write', 'admin']
    },
    {
      applicationId: 'inventory',
      permissions: ['read', 'write', 'admin']
    }
  ]
};

// Initialize with default admin
users.set(defaultAdmin.id, defaultAdmin);

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  permissions: ApplicationPermission[];
}

export async function createUser(data: CreateUserData): Promise<User> {
  // Check if email already exists
  if (Array.from(users.values()).some(user => user.email === data.email)) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    status: 'active',
    lastLogin: new Date(),
    permissions: data.permissions.length > 0 
      ? data.permissions 
      : DEFAULT_PERMISSIONS[data.role].map(permission => ({
          applicationId: 'default',
          permissions: [permission]
        }))
  };

  users.set(newUser.id, newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const user = users.get(id);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = { ...user, ...data };
  users.set(id, updatedUser);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  if (!users.delete(id)) {
    throw new Error('User not found');
  }
}

export async function getUsers(): Promise<User[]> {
  return Array.from(users.values());
}
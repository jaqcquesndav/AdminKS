import type { AuthUser } from '../types/auth';

// Mock data for development
const USERS = new Map<string, AuthUser>();

// Superadmin credentials
const SUPERADMIN_EMAIL = 'admin@kiota-suite.com';
const SUPERADMIN_PASSWORD = 'K10t@Adm1n2024!';

const SUPERADMIN_USER: AuthUser = {
  id: 'sa-01-kiota',
  email: SUPERADMIN_EMAIL,
  role: 'superadmin',
  name: 'Administrateur Système',
};

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  // Check superadmin
  if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
    return SUPERADMIN_USER;
  }

  // Check registered users
  const user = Array.from(USERS.values()).find(u => u.email === email);
  if (user) {
    // In production, verify password hash
    return user;
  }

  return null;
}

export async function registerUser(data: { 
  name: string; 
  email: string; 
  password: string; 
}): Promise<AuthUser | null> {
  // Check if email already exists
  if (Array.from(USERS.values()).some(u => u.email === data.email)) {
    throw new Error('Email already exists');
  }

  // Create new user
  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: 'user',
  };

  // Store user
  USERS.set(newUser.id, newUser);

  return newUser;
}
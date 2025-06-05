import type { AuthUser, SignUpData } from '../types';

const USERS = new Map<string, AuthUser>();

// Superadmin credentials
const SUPERADMIN_EMAIL = 'admin@wanzo-suite.com';
const SUPERADMIN_PASSWORD = 'K10t@Adm1n2024!';

const SUPERADMIN_USER: AuthUser = {
  id: 'sa-01-wanzo',
  email: SUPERADMIN_EMAIL,
  role: 'admin',
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

export async function registerUser(data: SignUpData): Promise<AuthUser | null> {
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

export async function requestPasswordReset(email: string): Promise<void> {
  // In a real app, this would:
  // 1. Generate a reset token
  // 2. Save it to the database with an expiration
  // 3. Send an email with the reset link
  
  // For demo purposes, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user exists
  const userExists = Array.from(USERS.values()).some(u => u.email === email);
  if (!userExists) {
    throw new Error('Aucun compte associé à cette adresse e-mail');
  }
}
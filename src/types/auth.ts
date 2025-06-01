import type { UserRole, UserType } from './user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole; // Updated to use UserRole
  userType: UserType; // Added userType
  customerAccountId?: string; // Added customerAccountId
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
  // Pour la réponse avec 2FA
  requiresTwoFactor?: boolean;
  twoFactorMethods?: ('email' | 'sms')[];
  tempToken?: string;
}

// Adding missing types needed by services
export interface AuthResponseBase {
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    picture?: string;
  };
  // Pour la réponse avec 2FA
  requiresTwoFactor?: boolean;
  twoFactorMethods?: ('email' | 'sms')[];
  tempToken?: string;
}

export interface AuthResponseExtended {
  token: string;
  user: import('./user').User;
  // Pour la réponse avec 2FA
  requiresTwoFactor?: boolean;
  twoFactorMethods?: ('email' | 'sms')[];
  tempToken?: string;
}

export interface TwoFactorVerification {
  code: string;
  method: 'email' | 'sms';
}
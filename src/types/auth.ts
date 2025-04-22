export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'admin' | 'user' | 'superadmin' | 'cto' | 'growth_finance' | 'customer_support';
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
}

export interface TwoFactorVerification {
  code: string;
  method: 'email' | 'sms';
}
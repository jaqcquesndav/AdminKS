export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'super_admin' | 'cto' | 'growth_finance' | 'customer_support' | 'content_manager' | 'admin' | 'user';
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
}

export interface AuthResponseExtended {
  token: string;
  user: import('./user').User;
}

export interface TwoFactorVerification {
  code: string;
  method: 'email' | 'sms';
}
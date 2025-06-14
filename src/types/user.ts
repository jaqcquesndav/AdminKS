// Types d'utilisateurs pour le système d'administration Wanzo

export type UserRole = 'super_admin' | 'cto' | 'growth_finance' | 'customer_support' | 'content_manager' | 'company_admin' | 'company_user';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type OrganizationType = 'pme' | 'financial_institution';
export type UserType = 'internal' | 'external'; // Added UserType

// Type représentant un utilisateur du système d'administration
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  userType: UserType; // Added userType field
  customerAccountId?: string; // Added customerAccountId field
  avatar?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string; // Added updatedAt field
  lastLogin?: string;
  permissions: string[];
  departement?: string;
  phoneNumber?: string;
}

// Type représentant un compte client (PME ou Institution Financière)
export interface CustomerAccount {
  id: string;
  name: string;
  type: OrganizationType;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  subscription: {
    plan: string;
    status: 'active' | 'expired' | 'trial' | 'canceled';
    expiresAt?: string;
  };
  usersCount: number;
  country: string;
  city?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large';
  tokensBalance: number;
  tokensPurchased: number;
  lastActivity?: string;
}

// Type pour les statistiques utilisateurs
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByRole: Record<string, number>;
  usersByCountry: Record<string, number>;
  userGrowth: {
    date: string;
    count: number;
  }[];
}

// Type pour les statistiques d'activité
export interface ActivityStatistics {
  totalLogins: number;
  averageSessionTime: number;
  activeSessionsNow: number;
  peakTimeToday: string;
  loginsByDevice: Record<string, number>;
  loginsByApp: Record<string, number>;
  timeSeriesActivity: {
    date: string;
    count: number;
  }[];
}

// Permissions pour les différents rôles
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['all'],
  cto: ['view_system_metrics', 'manage_system_settings', 'view_user_metrics', 'view_financial_metrics', 'manage_technical_settings'],
  growth_finance: ['view_financial_metrics', 'manage_subscriptions', 'view_customer_accounts', 'manage_billing', 'view_revenue_reports'],
  customer_support: ['view_customer_accounts', 'manage_customer_issues', 'view_basic_metrics'],
  content_manager: ['manage_content', 'view_basic_metrics'],
  company_admin: [
    'manage_company_users',
    'view_company_data',
    'manage_company_settings',
    'manage_company_subscription',
    'assign_company_user_roles',
    'view_company_billing_history',
    'use_subscribed_apps'
  ],
  company_user: [
    'view_own_profile',
    'edit_own_profile',
    'use_subscribed_apps',
    'view_limited_company_data'
  ]
};
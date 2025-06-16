// Types d'utilisateurs pour le système d'administration Wanzo

export type UserRole = 'super_admin' | 'cto' | 'growth_finance' | 'customer_support' | 'content_manager' | 'company_admin' | 'company_user';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type OrganizationType = 'pme' | 'financial_institution';
export type UserType = 'internal' | 'external'; // 'internal' = Wanzo staff, 'external' = customer users

// Interface pour les permissions par application
// Cette interface est utilisée par UserPermissionsForm, mais pas encore implémentée
// dans l'API ou dans les composants actuels
export interface ApplicationPermission {
  applicationId: string;
  permissions: string[]; // Permissions génériques pour l'instant, à remplacer par des types plus précis à l'avenir
}

// Type représentant un utilisateur du système d'administration
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  userType: UserType; // 'internal' = Wanzo staff, 'external' = customer users
  customerAccountId?: string; // ID of the customer account for external users
  customerName?: string; // Name of the customer (for external users)
  customerType?: OrganizationType; // Type of the customer (pme/financial_institution)
  avatar?: string; // This could be avatarUrl
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  permissions: ApplicationPermission[];
  departement?: string;
  phoneNumber?: string;
  position?: string; // Position for admin profile
  // Le type de permissions pourra évoluer vers ApplicationPermission[] dans une future version
  // applicationPermissions?: ApplicationPermission[];
}

// Specific type for Admin Profile, can extend User or be separate
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  avatarUrl?: string; // Consistent with useAdminProfile
  // Add other relevant fields from the User type if they are part of the profile form
  role?: UserRole; // Optional: if role is displayed/managed here
  // Consider if other User fields like status, createdAt are needed for display
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
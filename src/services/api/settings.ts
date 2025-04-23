import apiClient from './client';
import { API_ENDPOINTS, replaceUrlParams } from './config';

export interface GeneralSettings {
  companyName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorEnabled: boolean;
  twoFactorMethods: ('email' | 'sms' | 'authenticator')[];
  sessionTimeout: number;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  notifyOn: {
    newCustomer: boolean;
    newInvoice: boolean;
    paymentReceived: boolean;
    lowTokens: boolean;
    securityAlerts: boolean;
  };
}

export interface BillingSettings {
  defaultCurrency: string;
  taxRate: number;
  paymentMethods: string[];
  invoiceDueDays: number;
  invoiceNotes: string;
  autoGenerateInvoices: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  density: 'compact' | 'comfortable' | 'spacious';
  fontFamily: string;
  fontSize: string;
  customCss?: string;
}

export type SettingsSection = 'general' | 'security' | 'notifications' | 'billing' | 'appearance';

export interface Settings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  billing: BillingSettings;
  appearance: AppearanceSettings;
}

export const settingsApi = {
  // Obtenir tous les paramètres
  getAll: async (): Promise<Settings> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  // Obtenir les paramètres généraux
  getGeneral: async (): Promise<GeneralSettings> => {
    const response = await apiClient.get(API_ENDPOINTS.settings.general);
    return response.data;
  },

  // Obtenir les paramètres de sécurité
  getSecurity: async (): Promise<SecuritySettings> => {
    const response = await apiClient.get(API_ENDPOINTS.settings.security);
    return response.data;
  },

  // Obtenir les paramètres de notifications
  getNotifications: async (): Promise<NotificationSettings> => {
    const response = await apiClient.get(API_ENDPOINTS.settings.notifications);
    return response.data;
  },

  // Obtenir les paramètres de facturation
  getBilling: async (): Promise<BillingSettings> => {
    const response = await apiClient.get(API_ENDPOINTS.settings.billing);
    return response.data;
  },

  // Obtenir les paramètres d'apparence
  getAppearance: async (): Promise<AppearanceSettings> => {
    const response = await apiClient.get(API_ENDPOINTS.settings.appearance);
    return response.data;
  },

  // Mettre à jour une section de paramètres
  update: async <T>(section: SettingsSection, data: T): Promise<T> => {
    const url = replaceUrlParams(API_ENDPOINTS.settings.update, { section });
    const response = await apiClient.put(url, data);
    return response.data;
  }
};

export default settingsApi;
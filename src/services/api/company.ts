export const API_BASE_URL = 'http://localhost:8000/admin';

export const API_ENDPOINTS = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    status: '/auth/status',
    twoFactor: {
      verify: '/auth/2fa/verify',
      setup: '/auth/2fa/setup'
    }
  },
  users: {
    profile: '/users/profile',
    update: '/users/update',
    list: '/users',
    create: '/users/create',
    delete: '/users/:id',
    activities: '/users/:id/activities',
    sessions: '/users/:id/sessions'
  },
  company: {
    profile: '/company/profile',
    update: '/company/update',
    documents: '/company/documents',
    uploadDocument: '/company/documents/upload'
  },
  subscriptions: {
    list: '/subscriptions',
    plans: '/subscriptions/plans',
    create: '/subscriptions/create',
    cancel: '/subscriptions/:id/cancel',
    renew: '/subscriptions/:id/renew'
  },
  tokens: {
    balance: '/tokens/balance',
    purchase: '/tokens/purchase',
    usage: '/tokens/usage',
    history: '/tokens/history'
  }
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;

// Fonction utilitaire pour remplacer les paramètres dans les URLs
export function replaceUrlParams(url: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    url
  );
}
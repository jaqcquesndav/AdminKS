export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    me: '/auth/me',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
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
  // Added dedicated document endpoints
  DOCUMENTS: '/company/:companyId/documents',
  DOCUMENT_DETAIL: '/documents/:documentId',
  UPLOAD_DOCUMENT: '/company/:companyId/documents/upload',
  DOCUMENT_STATUS: '/documents/:documentId/status',
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
  },
  customers: {
    list: '/customers',
    financial: '/customers/financial',
    corporate: '/customers/corporate',
    individual: '/customers/individual',
    create: '/customers/create',
    update: '/customers/:id',
    delete: '/customers/:id',
    getById: '/customers/:id',
    statistics: '/customers/statistics'
  },
  finance: {
    transactions: '/finance/transactions',
    invoices: '/finance/invoices',
    payments: '/finance/payments',
    revenue: '/finance/revenue',
    expenses: '/finance/expenses',
    createTransaction: '/finance/transactions/create',
    createInvoice: '/finance/invoices/create',
    getInvoice: '/finance/invoices/:id',
    payInvoice: '/finance/invoices/:id/pay'
  },
  dashboard: {
    summary: '/dashboard/summary',
    customerStats: '/dashboard/customers',
    financialStats: '/dashboard/financial',
    tokenStats: '/dashboard/tokens',
    activityStream: '/dashboard/activities'
  },
  settings: {
    general: '/settings/general',
    security: '/settings/security',
    notifications: '/settings/notifications',
    billing: '/settings/billing',
    appearance: '/settings/appearance',
    update: '/settings/:section'
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
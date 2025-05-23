# Documentation API de Configuration

Cette documentation décrit la structure de configuration des API utilisée dans l'application Ksuit Admin.

## Structure générale

Toutes les API de l'application Ksuit Admin sont configurées dans le fichier `src/services/api/config.ts`. Ce fichier centralise les points d'accès (endpoints) de toutes les API utilisées par l'application front-end pour communiquer avec le backend.

## Base URL

L'URL de base de l'API est définie par la variable d'environnement `VITE_API_URL`.

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## En-têtes par défaut

Les en-têtes HTTP par défaut pour toutes les requêtes API sont :

```javascript
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;
```

## Endpoints des API

Les URL des API sont organisées par domaine fonctionnel :

### API d'authentification

```javascript
auth: {
  me: '/auth/me',
  logout: '/auth/logout',
  refresh: '/auth/refresh'
}
```

### API des utilisateurs

```javascript
users: {
  profile: '/users/profile',
  update: '/users/update',
  list: '/users',
  create: '/users/create',
  delete: '/users/:id',
  activities: '/users/:id/activities',
  sessions: '/users/:id/sessions'
}
```

### API de l'entreprise

```javascript
company: {
  profile: '/company/profile',
  update: '/company/update',
  documents: '/company/documents',
  uploadDocument: '/company/documents/upload'
}
```

### API des abonnements

```javascript
subscriptions: {
  list: '/subscriptions',
  plans: '/subscriptions/plans',
  create: '/subscriptions/create',
  cancel: '/subscriptions/:id/cancel',
  renew: '/subscriptions/:id/renew'
}
```

### API des tokens

```javascript
tokens: {
  balance: '/tokens/balance',
  purchase: '/tokens/purchase',
  usage: '/tokens/usage',
  history: '/tokens/history'
}
```

### API des clients

```javascript
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
}
```

### API financière

```javascript
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
}
```

### API du tableau de bord

```javascript
dashboard: {
  summary: '/dashboard/summary',
  customerStats: '/dashboard/customers',
  financialStats: '/dashboard/financial',
  tokenStats: '/dashboard/tokens',
  activityStream: '/dashboard/activities'
}
```

### API des paramètres

```javascript
settings: {
  general: '/settings/general',
  security: '/settings/security',
  notifications: '/settings/notifications',
  billing: '/settings/billing',
  appearance: '/settings/appearance',
  update: '/settings/:section'
}
```

## Utilitaire de remplacement des paramètres

La fonction `replaceUrlParams` est utilisée pour remplacer les paramètres dynamiques dans les URL :

```javascript
export function replaceUrlParams(url: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    url
  );
}
```

### Exemple d'utilisation

```javascript
// Pour obtenir un client avec l'ID "abc123"
const url = replaceUrlParams(API_ENDPOINTS.customers.getById, { id: 'abc123' });
// Résultat: '/customers/abc123'

// Pour annuler un abonnement avec l'ID "sub456"
const url = replaceUrlParams(API_ENDPOINTS.subscriptions.cancel, { id: 'sub456' });
// Résultat: '/subscriptions/sub456/cancel'
```

## Structure du client API

Le client API principal est configuré dans `src/services/api/client.ts` avec :

1. Configuration de base avec axios
2. Intercepteurs pour l'authentification
3. Gestion automatique des erreurs
4. Gestion du rafraîchissement des tokens

## Bonnes pratiques

1. **Centralisation** : Toutes les URL d'API sont centralisées dans ce fichier pour faciliter la maintenance
2. **Typage fort** : L'utilisation de `as const` garantit un typage TypeScript strict
3. **Paramétrage** : Les segments d'URL variables utilisent la notation `:paramName` pour être remplacés dynamiquement
4. **Modularité** : Les endpoints sont regroupés par domaine fonctionnel

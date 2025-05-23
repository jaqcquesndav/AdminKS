# Documentation API des Paramètres

Cette documentation décrit les endpoints de gestion des paramètres système disponibles dans l'application Ksuit Admin.

## Base URL

Tous les endpoints commencent par `/settings`.

## Aperçu des Paramètres

L'API des paramètres permet de configurer différents aspects de l'application :
- Paramètres généraux
- Paramètres de sécurité
- Notifications
- Facturation
- Apparence

## Endpoints

### 1. Obtenir tous les paramètres

**Endpoint:** `GET /settings`

**Description:** Récupère tous les paramètres système dans un seul appel.

**Réponse réussie (200 OK):**
```json
{
  "general": {
    "companyName": "Kiota Tech",
    "language": "fr",
    "timezone": "Africa/Kinshasa",
    "dateFormat": "DD/MM/YYYY",
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#1E40AF",
    "secondaryColor": "#9333EA"
  },
  "security": {
    "passwordPolicy": {
      "minLength": 10,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "expiryDays": 90
    },
    "twoFactorEnabled": true,
    "twoFactorMethods": ["email", "authenticator"],
    "sessionTimeout": 30
  },
  "notifications": {
    "email": true,
    "sms": true,
    "push": true,
    "inApp": true,
    "notifyOn": {
      "newCustomer": true,
      "newInvoice": true,
      "paymentReceived": true,
      "lowTokens": true,
      "securityAlerts": true
    }
  },
  "billing": {
    "defaultCurrency": "USD",
    "taxRate": 16.5,
    "paymentMethods": ["card", "bank_transfer", "mobile_money"],
    "invoiceDueDays": 15,
    "invoiceNotes": "Paiement dû dans les 15 jours",
    "autoGenerateInvoices": true
  },
  "appearance": {
    "theme": "light",
    "density": "comfortable",
    "fontFamily": "Inter",
    "fontSize": "medium"
  }
}
```

### 2. Paramètres généraux

#### 2.1. Obtenir les paramètres généraux

**Endpoint:** `GET /settings/general`

**Description:** Récupère uniquement les paramètres généraux du système.

**Réponse réussie (200 OK):**
```json
{
  "companyName": "Kiota Tech",
  "language": "fr",
  "timezone": "Africa/Kinshasa",
  "dateFormat": "DD/MM/YYYY",
  "logoUrl": "https://example.com/logo.png",
  "primaryColor": "#1E40AF",
  "secondaryColor": "#9333EA"
}
```

#### 2.2. Mettre à jour les paramètres généraux

**Endpoint:** `PUT /settings/general`

**Description:** Met à jour les paramètres généraux du système.

**Requête:**
```json
{
  "companyName": "Kiota Technologies",
  "language": "en",
  "timezone": "Africa/Kinshasa",
  "dateFormat": "MM/DD/YYYY"
}
```

**Réponse réussie (200 OK):**
```json
{
  "companyName": "Kiota Technologies",
  "language": "en",
  "timezone": "Africa/Kinshasa",
  "dateFormat": "MM/DD/YYYY",
  "logoUrl": "https://example.com/logo.png",
  "primaryColor": "#1E40AF",
  "secondaryColor": "#9333EA"
}
```

### 3. Paramètres de sécurité

#### 3.1. Obtenir les paramètres de sécurité

**Endpoint:** `GET /settings/security`

**Description:** Récupère les paramètres de sécurité du système.

**Réponse réussie (200 OK):**
```json
{
  "passwordPolicy": {
    "minLength": 10,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true,
    "expiryDays": 90
  },
  "twoFactorEnabled": true,
  "twoFactorMethods": ["email", "authenticator"],
  "sessionTimeout": 30
}
```

#### 3.2. Mettre à jour les paramètres de sécurité

**Endpoint:** `PUT /settings/security`

**Description:** Met à jour les paramètres de sécurité du système.

**Requête:**
```json
{
  "passwordPolicy": {
    "minLength": 12,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true,
    "expiryDays": 60
  },
  "twoFactorEnabled": true,
  "twoFactorMethods": ["email", "sms", "authenticator"],
  "sessionTimeout": 15
}
```

**Réponse réussie (200 OK):**
```json
{
  "passwordPolicy": {
    "minLength": 12,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true,
    "expiryDays": 60
  },
  "twoFactorEnabled": true,
  "twoFactorMethods": ["email", "sms", "authenticator"],
  "sessionTimeout": 15
}
```

### 4. Paramètres de notifications

#### 4.1. Obtenir les paramètres de notifications

**Endpoint:** `GET /settings/notifications`

**Description:** Récupère les paramètres de notifications du système.

**Réponse réussie (200 OK):**
```json
{
  "email": true,
  "sms": true,
  "push": true,
  "inApp": true,
  "notifyOn": {
    "newCustomer": true,
    "newInvoice": true,
    "paymentReceived": true,
    "lowTokens": true,
    "securityAlerts": true
  }
}
```

#### 4.2. Mettre à jour les paramètres de notifications

**Endpoint:** `PUT /settings/notifications`

**Description:** Met à jour les paramètres de notifications du système.

**Requête:**
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "inApp": true,
  "notifyOn": {
    "newCustomer": false,
    "newInvoice": true,
    "paymentReceived": true,
    "lowTokens": true,
    "securityAlerts": true
  }
}
```

**Réponse réussie (200 OK):**
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "inApp": true,
  "notifyOn": {
    "newCustomer": false,
    "newInvoice": true,
    "paymentReceived": true,
    "lowTokens": true,
    "securityAlerts": true
  }
}
```

### 5. Paramètres de facturation

#### 5.1. Obtenir les paramètres de facturation

**Endpoint:** `GET /settings/billing`

**Description:** Récupère les paramètres de facturation du système.

**Réponse réussie (200 OK):**
```json
{
  "defaultCurrency": "USD",
  "taxRate": 16.5,
  "paymentMethods": ["card", "bank_transfer", "mobile_money"],
  "invoiceDueDays": 15,
  "invoiceNotes": "Paiement dû dans les 15 jours",
  "autoGenerateInvoices": true
}
```

#### 5.2. Mettre à jour les paramètres de facturation

**Endpoint:** `PUT /settings/billing`

**Description:** Met à jour les paramètres de facturation du système.

**Requête:**
```json
{
  "defaultCurrency": "EUR",
  "taxRate": 20,
  "paymentMethods": ["card", "bank_transfer", "mobile_money", "crypto"],
  "invoiceDueDays": 30,
  "invoiceNotes": "Paiement dû dans les 30 jours",
  "autoGenerateInvoices": true
}
```

**Réponse réussie (200 OK):**
```json
{
  "defaultCurrency": "EUR",
  "taxRate": 20,
  "paymentMethods": ["card", "bank_transfer", "mobile_money", "crypto"],
  "invoiceDueDays": 30,
  "invoiceNotes": "Paiement dû dans les 30 jours",
  "autoGenerateInvoices": true
}
```

### 6. Paramètres d'apparence

#### 6.1. Obtenir les paramètres d'apparence

**Endpoint:** `GET /settings/appearance`

**Description:** Récupère les paramètres d'apparence de l'application.

**Réponse réussie (200 OK):**
```json
{
  "theme": "light",
  "density": "comfortable",
  "fontFamily": "Inter",
  "fontSize": "medium"
}
```

#### 6.2. Mettre à jour les paramètres d'apparence

**Endpoint:** `PUT /settings/appearance`

**Description:** Met à jour les paramètres d'apparence de l'application.

**Requête:**
```json
{
  "theme": "dark",
  "density": "compact",
  "fontFamily": "Roboto",
  "fontSize": "small"
}
```

**Réponse réussie (200 OK):**
```json
{
  "theme": "dark",
  "density": "compact",
  "fontFamily": "Roboto",
  "fontSize": "small"
}
```

### 7. Mettre à jour une section spécifique

**Endpoint:** `PUT /settings/:section`

**Description:** Méthode générique pour mettre à jour n'importe quelle section de paramètres. Le paramètre `:section` peut être une des valeurs suivantes : `general`, `security`, `notifications`, `billing`, `appearance`.

**Paramètres de chemin:**
- `section` : Le nom de la section à mettre à jour.

**Requête:**
```json
{
  // Corps dépend de la section à mettre à jour
}
```

**Réponse réussie (200 OK):**
```json
{
  // Résultat dépend de la section mise à jour
}
```

## Codes d'erreur communs

- `400 Bad Request` : La requête contient des données invalides ou malformées
- `401 Unauthorized` : Authentification requise
- `403 Forbidden` : L'utilisateur n'a pas les permissions requises
- `404 Not Found` : La section de paramètres demandée n'existe pas
- `422 Unprocessable Entity` : La requête est bien formée mais contient des erreurs de validation

## Schémas de données

### GeneralSettings
```typescript
{
  companyName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
```

### SecuritySettings
```typescript
{
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
```

### NotificationSettings
```typescript
{
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
```

### BillingSettings
```typescript
{
  defaultCurrency: string;
  taxRate: number;
  paymentMethods: string[];
  invoiceDueDays: number;
  invoiceNotes: string;
  autoGenerateInvoices: boolean;
}
```

### AppearanceSettings
```typescript
{
  theme: 'light' | 'dark' | 'system';
  density: 'compact' | 'comfortable' | 'spacious';
  fontFamily: string;
  fontSize: string;
  customCss?: string;
}
```

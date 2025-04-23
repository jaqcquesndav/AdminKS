# API de Gestion des Abonnements

Cette documentation décrit les endpoints disponibles pour gérer les abonnements, les plans et les paiements associés dans l'application Admin de Kiota Suit. Cette application est utilisée exclusivement par l'équipe administrative de i-Kiotahub (propriétaire de Kiota Suit) pour gérer les abonnements et tokens de leurs clients.

## Table des matières
- [Plans d'abonnement](#plans-dabonnement)
- [Gestion des abonnements](#gestion-des-abonnements)
- [Renouvellement et annulation](#renouvellement-et-annulation)
- [Packages de tokens](#packages-de-tokens)
- [Transactions et utilisation des tokens](#transactions-et-utilisation-des-tokens)
- [Statistiques](#statistiques)
- [Types de données](#types-de-données)

## Plans d'abonnement

### Récupérer les plans disponibles

Retourne la liste des plans d'abonnement disponibles sur la plateforme Kiota Suit.

```
GET /subscriptions/plans
```

**Paramètres**
- Aucun

**Réponse**
```json
{
  "plans": [
    {
      "id": "plan_starter",
      "name": "Starter",
      "type": "basic",
      "price": 49.99,
      "currency": "USD",
      "interval": "monthly",
      "features": ["5 utilisateurs", "10 projets", "Support par email"],
      "tokensIncluded": 1000,
      "maxUsers": 5,
      "applicableFor": ["small_business", "startup"],
      "availableApps": ["accounting_web"]
    },
    // Autres plans...
  ]
}
```

## Gestion des abonnements

### Récupérer les abonnements d'un client

Retourne la liste des abonnements pour un client spécifique de Kiota Suit.

```
GET /customers/:customerId/subscriptions
```

**Paramètres**
- `customerId` (dans l'URL) : ID du client dans Kiota Suit

**Réponse**
```json
{
  "subscriptions": [
    {
      "id": "sub_123456",
      "customerId": "123",
      "planId": "plan_enterprise",
      "status": "active",
      "startDate": "2023-01-15",
      "endDate": "2023-12-15",
      "renewalDate": "2023-12-15",
      "autoRenew": true,
      "paymentMethod": "credit_card",
      "price": 499.99,
      "currency": "USD",
      "lastPaymentDate": "2023-01-15",
      "nextPaymentDate": "2023-12-15"
    }
  ],
  "totalCount": 1
}
```

### Récupérer tous les abonnements (administrateur)

Retourne la liste de tous les abonnements clients de la plateforme Kiota Suit (réservé aux administrateurs i-Kiotahub).

```
GET /subscriptions
```

**Paramètres**
- `status` (optionnel) : Filtrer par statut d'abonnement
- `startDate` (optionnel) : Date de début pour filtrer
- `endDate` (optionnel) : Date de fin pour filtrer
- `page` (optionnel) : Page à récupérer pour la pagination
- `limit` (optionnel) : Nombre d'éléments par page

**Réponse**
```json
{
  "subscriptions": [
    {
      "id": "sub_123456",
      "customerId": "123",
      "planId": "plan_enterprise",
      "status": "active",
      "startDate": "2023-01-15",
      "endDate": "2023-12-15",
      "renewalDate": "2023-12-15",
      "autoRenew": true,
      "paymentMethod": "credit_card",
      "price": 499.99,
      "currency": "USD",
      "lastPaymentDate": "2023-01-15",
      "nextPaymentDate": "2023-12-15"
    },
    // Autres abonnements...
  ],
  "totalCount": 50
}
```

### Créer un abonnement

Crée un nouvel abonnement pour un client de Kiota Suit.

```
POST /subscriptions/create
```

**Paramètres**
```json
{
  "customerId": "123",
  "planId": "plan_enterprise",
  "paymentMethod": "credit_card",
  "autoRenew": true
}
```

**Réponse**
```json
{
  "id": "sub_123456",
  "customerId": "123",
  "planId": "plan_enterprise",
  "status": "active",
  "startDate": "2023-04-23",
  "endDate": "2024-04-23",
  "autoRenew": true,
  "paymentMethod": "credit_card",
  "price": 499.99,
  "currency": "USD",
  "lastPaymentDate": "2023-04-23",
  "nextPaymentDate": "2024-04-23"
}
```

## Renouvellement et annulation

### Annuler un abonnement

Annule un abonnement existant.

```
POST /subscriptions/:id/cancel
```

**Paramètres**
- `id` (dans l'URL) : ID de l'abonnement
- `reason` (optionnel) : Raison de l'annulation

**Réponse**
```json
{
  "id": "sub_123456",
  "customerId": "123",
  "planId": "plan_enterprise",
  "status": "canceled",
  "startDate": "2023-01-15",
  "endDate": "2023-12-15",
  "autoRenew": false,
  "paymentMethod": "credit_card",
  "price": 499.99,
  "currency": "USD",
  "lastPaymentDate": "2023-01-15"
}
```

### Renouveler un abonnement

Renouvelle un abonnement qui a expiré ou qui a été annulé.

```
POST /subscriptions/:id/renew
```

**Paramètres**
- `id` (dans l'URL) : ID de l'abonnement
```json
{
  "method": "credit_card",
  "transactionReference": "txn_123456"
}
```

**Réponse**
```json
{
  "id": "sub_123456",
  "customerId": "123",
  "planId": "plan_enterprise",
  "status": "active",
  "startDate": "2023-01-15",
  "endDate": "2024-12-15",
  "renewalDate": "2024-12-15",
  "autoRenew": true,
  "paymentMethod": "credit_card",
  "price": 499.99,
  "currency": "USD",
  "lastPaymentDate": "2023-04-23",
  "nextPaymentDate": "2024-12-15"
}
```

## Packages de tokens

### Récupérer les packages de tokens disponibles

Retourne la liste des packages de tokens disponibles à l'achat.

```
GET /tokens/packages
```

**Paramètres**
- Aucun

**Réponse**
```json
{
  "packages": [
    {
      "id": "tokens_basic",
      "name": "Pack de base",
      "tokenAmount": 5000,
      "price": 49.99,
      "currency": "USD",
      "discount": null
    },
    {
      "id": "tokens_premium",
      "name": "Pack premium",
      "tokenAmount": 25000,
      "price": 199.99,
      "currency": "USD",
      "discount": 20
    },
    // Autres packages...
  ]
}
```

### Acheter un package de tokens

Permet à un client d'acheter un package de tokens.

```
POST /tokens/purchase
```

**Paramètres**
```json
{
  "packageId": "tokens_premium",
  "customerId": "123",
  "paymentMethod": "credit_card",
  "transactionReference": "txn_123456"
}
```

**Réponse**
```json
{
  "id": "token_txn_123456",
  "customerId": "123",
  "packageId": "tokens_premium",
  "amount": 25000,
  "cost": 199.99,
  "currency": "USD",
  "date": "2023-04-23",
  "paymentMethod": "credit_card",
  "paymentStatus": "completed",
  "transactionId": "txn_123456",
  "receipt": "https://example.com/receipts/token_txn_123456.pdf"
}
```

## Transactions et utilisation des tokens

### Récupérer l'historique des transactions de tokens

Retourne l'historique des transactions de tokens pour un client.

```
GET /tokens/transactions
```

**Paramètres**
- `customerId` (optionnel) : ID du client
- `startDate` (optionnel) : Date de début pour filtrer
- `endDate` (optionnel) : Date de fin pour filtrer
- `page` (optionnel) : Page à récupérer pour la pagination
- `limit` (optionnel) : Nombre d'éléments par page

**Réponse**
```json
{
  "transactions": [
    {
      "id": "token_txn_123456",
      "customerId": "123",
      "packageId": "tokens_premium",
      "amount": 25000,
      "cost": 199.99,
      "currency": "USD",
      "date": "2023-04-23",
      "paymentMethod": "credit_card",
      "paymentStatus": "completed",
      "transactionId": "txn_123456",
      "receipt": "https://example.com/receipts/token_txn_123456.pdf"
    },
    // Autres transactions...
  ],
  "totalCount": 10
}
```

### Récupérer l'utilisation des tokens

Retourne les détails d'utilisation des tokens.

```
GET /tokens/usage
```

**Paramètres**
- `customerId` (optionnel) : ID du client
- `userId` (optionnel) : ID de l'utilisateur
- `appType` (optionnel) : Type d'application
- `startDate` (optionnel) : Date de début pour filtrer
- `endDate` (optionnel) : Date de fin pour filtrer
- `page` (optionnel) : Page à récupérer pour la pagination
- `limit` (optionnel) : Nombre d'éléments par page

**Réponse**
```json
{
  "usages": [
    {
      "id": "usage_123456",
      "customerId": "123",
      "userId": "user_123",
      "appType": "accounting_web",
      "tokensUsed": 150,
      "date": "2023-04-23",
      "feature": "ai_reporting",
      "prompt": "Générer un rapport de revenus mensuel",
      "responseTokens": 100,
      "requestTokens": 50,
      "cost": 0.15
    },
    // Autres utilisations...
  ],
  "totalCount": 50,
  "totalTokensUsed": 5000
}
```

### Vérifier le solde de tokens

Récupère le solde de tokens pour un client.

```
GET /customers/:customerId/tokens/balance
```

**Paramètres**
- `customerId` (dans l'URL) : ID du client

**Réponse**
```json
{
  "available": 20000,
  "used": 5000,
  "allocated": 25000
}
```

## Statistiques

### Récupérer les statistiques de revenus

Récupère les statistiques de revenus générés par les abonnements et tokens (réservé aux administrateurs i-Kiotahub).

```
GET /admin/statistics/revenue
```

**Paramètres**
- `period` (optionnel) : Période pour les statistiques ('daily', 'weekly', 'monthly', 'yearly')

**Réponse**
```json
{
  "totalRevenue": 50000.00,
  "subscriptionRevenue": 40000.00,
  "tokenRevenue": 10000.00,
  "revenueTrend": [
    {
      "date": "2023-03-01",
      "amount": 15000.00,
      "type": "subscription"
    },
    // Autres données de tendance...
  ],
  "revenueByCountry": {
    "US": 25000.00,
    "FR": 15000.00,
    "CD": 10000.00
  },
  "revenueByPlan": {
    "plan_enterprise": 30000.00,
    "plan_pro": 10000.00,
    "plan_starter": 5000.00
  },
  "conversionRate": 15.5,
  "churnRate": 3.2,
  "averageRevenuePerUser": 125.00
}
```

### Récupérer les statistiques des tokens

Récupère les statistiques d'utilisation des tokens sur la plateforme Kiota Suit (réservé aux administrateurs i-Kiotahub).

```
GET /admin/statistics/tokens
```

**Paramètres**
- `period` (optionnel) : Période pour les statistiques ('daily', 'weekly', 'monthly', 'yearly')

**Réponse**
```json
{
  "totalTokensUsed": 1500000,
  "totalTokensSold": 2000000,
  "tokensUsedToday": 25000,
  "tokensCostToday": 250.00,
  "revenueFromTokens": 20000.00,
  "profitFromTokens": 15000.00,
  "tokenUsageByApp": {
    "accounting_web": 800000,
    "accounting_mobile": 400000,
    "portfolio_management": 300000
  },
  "tokenUsageByFeature": {
    "ai_reporting": 500000,
    "document_analysis": 700000,
    "chat_assistance": 300000
  },
  "tokenUsageTrend": [
    {
      "date": "2023-04-01",
      "used": 50000,
      "cost": 500.00,
      "revenue": 750.00
    },
    // Autres données de tendance...
  ]
}
```

### Valider un paiement manuel

Valide un paiement manuel effectué par un client de Kiota Suit (réservé aux administrateurs i-Kiotahub).

```
POST /payments/:transactionId/validate
```

**Paramètres**
- `transactionId` (dans l'URL) : ID de la transaction à valider
```json
{
  "validatedBy": "admin_123",
  "notes": "Paiement reçu par virement bancaire"
}
```

**Réponse**
```json
{
  "id": "payment_123456",
  "customerId": "123",
  "amount": 499.99,
  "currency": "USD",
  "method": "manual_payment",
  "status": "completed",
  "date": "2023-04-23",
  "description": "Abonnement Enterprise",
  "referenceNumber": "wire_123456",
  "proofDocument": "https://example.com/proofs/wire_123456.pdf",
  "validatedBy": "admin_123",
  "validatedAt": "2023-04-23T14:32:15Z",
  "notes": "Paiement reçu par virement bancaire"
}
```

## Types de données

### ApplicationGroup
```typescript
interface ApplicationGroup {
  id: string;
  name: string;
  description: string;
  applications: Application[];
  monthlyPrice: {
    usd: number;
    cdf: number;
    fcfa: number;
  };
  yearlyPrice: {
    usd: number;
    cdf: number;
    fcfa: number;
  };
  tokenBonus: {
    monthly: number;
    yearly: number;
  };
}
```

### Application
```typescript
interface Application {
  id: string;
  name: string;
  description: string;
  features: string[];
}
```

### SubscriptionPlanDefinition
```typescript
interface SubscriptionPlanDefinition {
  id: string;
  name: string;
  type: SubscriptionPlan;
  price: number;
  currency: SupportedCurrency;
  interval: 'monthly' | 'yearly';
  features: string[];
  tokensIncluded: number;
  maxUsers: number;
  applicableFor: OrganizationType[];
  availableApps: AppType[];
}
```

### CustomerSubscription
```typescript
interface CustomerSubscription {
  id: string;
  customerId: string;
  planId: string;
  status: PlanStatus;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  price: number;
  currency: SupportedCurrency;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}
```

### TokenPackage
```typescript
interface TokenPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  currency: SupportedCurrency;
  discount?: number;
}
```

### TokenTransaction
```typescript
interface TokenTransaction {
  id: string;
  customerId: string;
  packageId?: string;
  amount: number;
  cost: number;
  currency: SupportedCurrency;
  date: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  receipt?: string;
}
```

### TokenUsage
```typescript
interface TokenUsage {
  id: string;
  customerId: string;
  userId: string;
  appType: AppType;
  tokensUsed: number;
  date: string;
  feature: string;
  prompt?: string;
  responseTokens: number;
  requestTokens: number;
  cost: number;
}
```

### Types de statuts et méthodes
```typescript
type PlanStatus = 'active' | 'expired' | 'trial' | 'canceled' | 'pending';
type AppType = 'accounting_mobile' | 'accounting_web' | 'portfolio_management';
type PaymentMethod = 'credit_card' | 'mobile_money' | 'manual_payment';
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
```
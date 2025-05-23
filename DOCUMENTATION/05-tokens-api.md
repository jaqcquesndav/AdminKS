# Documentation API des Tokens

Cette documentation décrit les endpoints de gestion des tokens disponibles dans l'application Ksuit Admin, utilisée exclusivement par l'équipe administrative de i-Kiotahub.

## Base URL

Les endpoints commencent par `/tokens` pour les opérations standard et `/admin/tokens` pour les opérations administratives.

## Endpoints

### 1. Vérifier le solde des tokens

**Endpoint:** `GET /tokens/balance`

**Description:** Récupère le solde actuel des tokens d'un client de Kiota Suit.

**Paramètres de requête:** Aucun. L'identité du client est déterminée à partir du token d'authentification.

**Réponse réussie (200 OK):**
```json
{
  "available": 500,
  "allocated": 600,
  "used": 100,
  "lastUpdated": "2025-04-20T14:30:00Z"
}
```

**Droits d'accès:** Utilisateur authentifié avec rôle "admin" ou "finance".

### 2. Acheter des tokens

**Endpoint:** `POST /tokens/purchase`

**Description:** Permet d'enregistrer l'achat d'un package de tokens pour un client. Le justificatif de paiement (si fourni) est d'abord chargé sur Cloudinary, puis l'URL est transmise au backend.

**Requête sans justificatif:**
```json
{
  "customerId": "string",
  "packageId": "string",
  "paymentMethod": "string",
  "transactionReference": "string" // Optionnel
}
```

**Requête avec justificatif (après upload Cloudinary):**
```json
{
  "customerId": "string",
  "packageId": "string",
  "paymentMethod": "string",
  "transactionReference": "string", // Optionnel
  "proofDocumentUrl": "string",
  "proofDocumentPublicId": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "transaction": {
    "id": "string",
    "amount": 100,
    "tokenAmount": 500,
    "status": "pending",
    "paymentMethod": "string",
    "transactionReference": "string",
    "proofDocumentUrl": "string",
    "createdAt": "2025-04-20T14:30:00Z"
  },
  "newBalance": {
    "available": 500,
    "allocated": 600,
    "used": 100,
    "lastUpdated": "2025-04-20T14:30:00Z"
  }
}
```

### 3. Obtenir les packages de tokens disponibles

**Endpoint:** `GET /tokens/packages`

**Description:** Récupère la liste des packages de tokens disponibles à l'achat pour les clients de Kiota Suit.

**Réponse réussie (200 OK):**
```json
{
  "packages": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "tokenAmount": 100,
      "price": 19.99,
      "currency": "USD",
      "pricePerToken": 0.1999,
      "isPopular": false,
      "features": ["string"],
      "validityPeriod": 30 // jours
    }
  ]
}
```

### 4. Récupérer l'historique d'utilisation des tokens

**Endpoint:** `GET /tokens/usage`

**Description:** Récupère l'historique d'utilisation des tokens d'un client avec pagination et filtrage.

**Paramètres de requête:**
```
customerId: string    // ID du client
startDate: string    // Format YYYY-MM-DD
endDate: string      // Format YYYY-MM-DD
appType: string      // Filtrer par type d'application
feature: string      // Filtrer par fonctionnalité
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'entrées par page
```

**Réponse réussie (200 OK):**
```json
{
  "usages": [
    {
      "id": "string",
      "timestamp": "2025-04-20T14:30:00Z",
      "tokensUsed": 5,
      "appType": "string",
      "feature": "string",
      "description": "string",
      "userId": "string"
    }
  ],
  "totalCount": 42,
  "totalTokensUsed": 250
}
```

### 5. Récupérer l'historique des transactions de tokens

**Endpoint:** `GET /tokens/history`

**Description:** Récupère l'historique des transactions de tokens (achats, allocations) d'un client avec pagination et filtrage.

**Paramètres de requête:**
```
customerId: string    // ID du client
startDate: string    // Format YYYY-MM-DD
endDate: string      // Format YYYY-MM-DD
status: string       // Filtrer par statut (pending, completed, canceled, rejected)
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'entrées par page
```

**Réponse réussie (200 OK):**
```json
{
  "transactions": [
    {
      "id": "string",
      "amount": 19.99,
      "tokenAmount": 100,
      "status": "completed",
      "paymentMethod": "string",
      "transactionReference": "string",
      "proofDocumentUrl": "string",
      "createdAt": "2025-04-20T14:30:00Z",
      "completedAt": "2025-04-20T15:00:00Z"
    }
  ],
  "totalCount": 15
}
```

### 6. Obtenir les statistiques d'utilisation des tokens par période

**Endpoint:** `GET /tokens/usage/stats`

**Description:** Récupère les statistiques d'utilisation des tokens d'un client, regroupées par période.

**Paramètres de requête:**
```
customerId: string    // ID du client
period: string       // 'daily', 'weekly', 'monthly', 'yearly'
```

**Réponse réussie (200 OK):**
```json
{
  "2025-04-20": 45,
  "2025-04-19": 32,
  "2025-04-18": 56,
  // ... autres périodes
}
```

### 7. Obtenir les statistiques d'utilisation des tokens par fonctionnalité

**Endpoint:** `GET /tokens/usage/features`

**Description:** Récupère les statistiques d'utilisation des tokens d'un client, regroupées par fonctionnalité.

**Paramètres de requête:**
```
customerId: string    // ID du client
```

**Réponse réussie (200 OK):**
```json
{
  "api-calls": 120,
  "document-processing": 85,
  "analytics": 65,
  "other": 30
}
```

### 8. Obtenir les statistiques d'utilisation des tokens par application

**Endpoint:** `GET /tokens/usage/apps`

**Description:** Récupère les statistiques d'utilisation des tokens d'un client, regroupées par application.

**Paramètres de requête:**
```
customerId: string    // ID du client
```

**Réponse réussie (200 OK):**
```json
{
  "accounting_web": 180,
  "portfolio_management": 95,
  "accounting_mobile": 25
}
```

## Endpoints administratifs

Ces endpoints sont réservés aux administrateurs de i-Kiotahub (Super Admin, CTO, Finance, Responsable croissance).

### 1. Obtenir toutes les statistiques des tokens

**Endpoint:** `GET /admin/tokens/statistics`

**Description:** Récupère des statistiques détaillées sur l'utilisation des tokens à travers la plateforme Kiota Suit.

**Paramètres de requête:**
```
period: string    // 'daily', 'weekly', 'monthly', 'yearly'
```

**Réponse réussie (200 OK):**
```json
{
  "totalTokensIssued": 10000,
  "totalTokensUsed": 6500,
  "totalTokensAvailable": 3500,
  "averageDailyUsage": 125,
  "topFeatures": {
    "api-calls": 2500,
    "document-processing": 1800,
    "analytics": 1200
  },
  "topClients": [
    {
      "clientId": "string",
      "clientName": "string",
      "tokensUsed": 450
    }
  ],
  "usageByPeriod": {
    "2025-04-20": 145,
    "2025-04-19": 132
  },
  "revenueGenerated": 2500,
  "currency": "USD"
}
```

### 2. Allouer des tokens à un client

**Endpoint:** `POST /admin/tokens/allocate`

**Description:** Alloue un certain nombre de tokens à un client spécifique de Kiota Suit.

**Requête:**
```json
{
  "customerId": "string",
  "amount": 100,
  "reason": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "newBalance": {
    "available": 500,
    "allocated": 600,
    "used": 100,
    "lastUpdated": "2025-04-20T14:30:00Z"
  }
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "string",
  "message": "Solde de tokens insuffisant pour l'allocation"
}
```

## Processus d'achat avec justificatif de paiement

Le processus d'achat de tokens avec téléchargement de justificatif se déroule comme suit:

1. L'administrateur i-Kiotahub télécharge d'abord le justificatif de paiement du client sur Cloudinary
2. Cloudinary renvoie une URL et un ID public
3. L'administrateur envoie ces informations avec les détails d'achat au backend
4. Le backend vérifie le paiement à l'aide du justificatif et confirme la transaction
5. Les tokens sont alloués au compte client correspondant dans Kiota Suit

Ce processus en deux étapes permet:
- Une gestion sécurisée des documents de paiement
- Une vérification manuelle des paiements par l'équipe financière de i-Kiotahub
- L'attribution des tokens uniquement après vérification du justificatif

# Documentation API du Tableau de Bord

Cette documentation détaille les endpoints, paramètres et réponses de l'API du tableau de bord (Dashboard) de Kiota Suit Admin, mise à jour en avril 2025.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Endpoints](#endpoints)
    - [Résumé du tableau de bord](#résumé-du-tableau-de-bord)
    - [Statistiques clients](#statistiques-clients)
    - [Statistiques financières](#statistiques-financières)
    - [Statistiques des tokens](#statistiques-des-tokens)
    - [Flux d'activités](#flux-dactivités)
3. [Structures de données](#structures-de-données)
4. [Codes d'erreur](#codes-derreur)
5. [Exemples](#exemples)

## Vue d'ensemble

L'API du tableau de bord fournit des données agrégées et des statistiques pour alimenter le tableau de bord d'administration de Kiota Suit. Elle permet d'accéder aux informations concernant les clients, les finances, l'utilisation des tokens et les activités récentes.

Base URL: `/dashboard`

## Endpoints

### Résumé du tableau de bord

Récupère un résumé global des statistiques principales.

**Endpoint:** `GET /dashboard/summary`

**Description:** Fournit une vue d'ensemble des indicateurs clés de performance de la plateforme.

**Paramètres:** Aucun

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse:**
```json
{
  "activeCustomers": 1897,
  "totalRevenue": 156890.45,
  "pendingInvoices": 8,
  "tokenUsage": 468975320,
  "recentActivities": [
    {
      "id": "act-123",
      "type": "payment",
      "description": "Paiement reçu de Client X",
      "timestamp": "2025-04-22T15:30:00Z",
      "user": {
        "id": "user-456",
        "name": "Jean Dupont",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "finance" ou "cto".

### Statistiques clients

Récupère les statistiques détaillées concernant les clients.

**Endpoint:** `GET /dashboard/customers`

**Description:** Fournit des informations détaillées sur les statistiques des utilisateurs et clients.

**Paramètres:**
- `period` (optionnel): Période pour les données de tendance (`daily`, `weekly`, `monthly`, `yearly`). Par défaut: `monthly`

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse:**
```json
{
  "totalUsers": 2458,
  "activeUsers": 1897,
  "newUsersToday": 37,
  "usersByRole": {
    "admin": 12,
    "user": 2446
  },
  "usersByCountry": {
    "RDC": 1856,
    "Rwanda": 342,
    "Burundi": 112,
    "Kenya": 87,
    "Autres": 61
  },
  "userGrowth": [
    { "date": "2025-01", "count": 2050 },
    { "date": "2025-02", "count": 2190 },
    { "date": "2025-03", "count": 2340 },
    { "date": "2025-04", "count": 2458 }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### Statistiques financières

Récupère les statistiques financières pour la période spécifiée.

**Endpoint:** `GET /dashboard/financial`

**Description:** Fournit des données détaillées sur les revenus et les performances financières.

**Paramètres:**
- `period` (optionnel): Période pour les données (`daily`, `weekly`, `monthly`, `yearly`). Par défaut: `monthly`

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse:**
```json
{
  "totalRevenue": {
    "usd": 156890.45,
    "local": 3922261.25,
    "localCurrency": "CDF"
  },
  "recurringRevenue": 124567.90,
  "oneTimeRevenue": 32322.55,
  "tokenRevenue": 32322.55,
  "revenueTrend": [
    { "date": "2025-01-01", "amount": 36789.45, "type": "subscription" },
    { "date": "2025-01-01", "amount": 7845.65, "type": "token" },
    { "date": "2025-02-01", "amount": 38967.55, "type": "subscription" },
    { "date": "2025-02-01", "amount": 8234.70, "type": "token" }
  ],
  "revenueByCountry": {
    "RDC": 98675.34,
    "Rwanda": 35790.23,
    "Burundi": 12456.78,
    "Kenya": 7423.56,
    "Autres": 2544.54
  },
  "revenueByPlan": {
    "base": 25678.90,
    "standard": 75432.12,
    "premium": 42345.67,
    "enterprise": 13433.76
  },
  "revenueByPaymentMethod": {
    "credit_card": 45678.90,
    "bank_transfer": 85432.12,
    "mobile_money": 25779.43
  },
  "conversionRate": 5.6,
  "churnRate": 2.1,
  "averageRevenuePerCustomer": 63.82
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "finance" ou "growth_finance".

### Statistiques des tokens

Récupère les statistiques d'utilisation des tokens.

**Endpoint:** `GET /dashboard/tokens`

**Description:** Fournit des données détaillées sur l'utilisation des tokens, réparties par période, type de client et application.

**Paramètres:**
- `period` (optionnel): Période pour les données (`daily`, `weekly`, `monthly`, `yearly`). Par défaut: `monthly`

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse:**
```json
{
  "allocated": 750000000,
  "used": 468975320,
  "available": 281024680,
  "usageByPeriod": {
    "2025-04-01": 5678234,
    "2025-04-02": 5234567,
    "2025-04-03": 4987234,
    "2025-04-04": 5346789,
    "2025-04-05": 6234567,
    "2025-04-06": 5879234,
    "2025-04-07": 5674390
  },
  "usageByCustomerType": {
    "financial": 256789450,
    "corporate": 134567230,
    "individual": 77618640
  },
  "tokenUsageByApp": {
    "accounting_mobile": 256789450,
    "accounting_web": 134567230,
    "portfolio_management": 77618640
  },
  "tokenUsageByFeature": {
    "document_analysis": 155678230,
    "financial_analysis": 134567890,
    "reporting": 89754320,
    "customer_support": 45678910,
    "other": 43295970
  },
  "tokensUsedToday": 5674390,
  "tokensCostToday": 56.74,
  "revenueFromTokens": 32322.55,
  "profitFromTokens": 14256.78
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "finance", "cto" ou "growth_finance".

### Flux d'activités

Récupère le flux d'activités récentes dans le système.

**Endpoint:** `GET /dashboard/activities`

**Description:** Fournit une liste chronologique des activités récentes (connexions, paiements, modifications de configuration, etc.).

**Paramètres:**
- `limit` (optionnel): Nombre maximum d'activités à retourner. Par défaut: `10`
- `type` (optionnel): Filtrer par type d'activité (payment, user, system, etc.)

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse:**
```json
[
  {
    "id": "act-123",
    "type": "customer",
    "description": "Nouveau client enregistré",
    "timestamp": "2025-04-23T10:23:45Z",
    "user": {
      "id": "user-456",
      "name": "Jean Dupont",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  {
    "id": "act-124",
    "type": "payment",
    "description": "Paiement reçu - 2500€",
    "timestamp": "2025-04-23T09:15:30Z",
    "user": {
      "id": "user-789",
      "name": "Marie Martin",
      "avatar": "https://example.com/avatar2.jpg"
    }
  }
]
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin".

## Structures de données

### DashboardSummary

Structure représentant le résumé général du tableau de bord.

| Champ | Type | Description |
|-------|------|-------------|
| activeCustomers | number | Nombre de clients actifs |
| totalRevenue | number | Revenu total en devise principale |
| pendingInvoices | number | Nombre de factures en attente |
| tokenUsage | number | Utilisation totale des tokens |
| recentActivities | Array | Liste des activités récentes |

### CustomerStatistics

Structure représentant les statistiques des clients.

| Champ | Type | Description |
|-------|------|-------------|
| totalUsers | number | Nombre total d'utilisateurs |
| activeUsers | number | Nombre d'utilisateurs actifs |
| newUsersToday | number | Nouveaux utilisateurs aujourd'hui |
| usersByRole | Object | Répartition des utilisateurs par rôle |
| usersByCountry | Object | Répartition des utilisateurs par pays |
| userGrowth | Array | Évolution du nombre d'utilisateurs dans le temps |

### FinancialSummary

Structure représentant les statistiques financières.

| Champ | Type | Description |
|-------|------|-------------|
| totalRevenue | Object | Revenu total en USD et devise locale |
| recurringRevenue | number | Revenu récurrent |
| oneTimeRevenue | number | Revenu ponctuel |
| tokenRevenue | number | Revenu des tokens |
| revenueTrend | Array | Tendance des revenus dans le temps |
| revenueByCountry | Object | Répartition des revenus par pays |
| revenueByPlan | Object | Répartition des revenus par plan |
| revenueByPaymentMethod | Object | Répartition des revenus par méthode de paiement |
| conversionRate | number | Taux de conversion en pourcentage |
| churnRate | number | Taux d'attrition en pourcentage |
| averageRevenuePerCustomer | number | Revenu moyen par client |

### TokenStats

Structure représentant les statistiques d'utilisation des tokens.

| Champ | Type | Description |
|-------|------|-------------|
| allocated | number | Nombre total de tokens alloués |
| used | number | Nombre de tokens utilisés |
| available | number | Nombre de tokens disponibles |
| usageByPeriod | Object | Utilisation par période |
| usageByCustomerType | Object | Utilisation par type de client |
| tokenUsageByApp | Object | Utilisation par application |
| tokenUsageByFeature | Object | Utilisation par fonctionnalité |
| tokensUsedToday | number | Tokens utilisés aujourd'hui |
| tokensCostToday | number | Coût des tokens utilisés aujourd'hui |
| revenueFromTokens | number | Revenu généré par les tokens |
| profitFromTokens | number | Profit généré par les tokens |

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide - Les paramètres fournis sont incorrects |
| 401 | Non autorisé - Authentification requise |
| 403 | Interdit - Droits insuffisants pour accéder à cette ressource |
| 404 | Non trouvé - La ressource demandée n'existe pas |
| 500 | Erreur serveur - Une erreur est survenue côté serveur |

## Exemples

### Exemple de requête pour obtenir le résumé du tableau de bord

```javascript
const fetchDashboardSummary = async () => {
  try {
    const response = await fetch('https://api.kiotsuite.com/dashboard/summary', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
};
```

### Exemple de requête pour obtenir les statistiques des tokens par mois

```javascript
const fetchTokenStats = async () => {
  try {
    const response = await fetch('https://api.kiotsuite.com/dashboard/tokens?period=monthly', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de tokens:', error);
  }
};
```

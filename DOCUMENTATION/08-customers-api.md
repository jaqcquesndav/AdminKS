# Documentation API des Clients

Cette documentation décrit les endpoints de gestion des clients disponibles dans l'application Ksuit Admin, utilisée exclusivement par l'équipe administrative de i-Kiotahub, mise à jour en avril 2025.

## Base URL

Les endpoints commencent par `/customers` pour les opérations standard.

## Endpoints

### 1. Lister les clients

**Endpoint:** `GET /customers`

**Description:** Récupère la liste des clients de Kiota Suit avec pagination et filtrage.

**Paramètres de requête:**
```
search: string       // Recherche par nom, email ou identifiant
status: string       // Filtrer par statut (active, inactive, pending, suspended)
industry: string     // Filtrer par secteur d'activité
plan: string         // Filtrer par type d'abonnement
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'entrées par page
sortBy: string       // Champ de tri
sortOrder: string    // Ordre de tri (asc, desc)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "customers": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "logo": "string",
      "industry": "string",
      "country": "string",
      "status": "active",
      "plan": "string",
      "subscriptionEndDate": "2025-04-20T14:30:00Z",
      "totalUsers": 15,
      "availableTokens": 500,
      "createdAt": "2025-01-20T14:30:00Z"
    }
  ],
  "totalCount": 42,
  "page": 1,
  "limit": 10
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "customer_support" ou "finance".

### 2. Obtenir les détails d'un client

**Endpoint:** `GET /customers/:id`

**Description:** Récupère les détails complets d'un client spécifique.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "logo": "string",
  "industry": "string",
  "website": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "status": "active",
  "plan": "string",
  "subscriptionDetails": {
    "id": "string",
    "startDate": "2025-01-20T14:30:00Z",
    "endDate": "2025-04-20T14:30:00Z",
    "autoRenew": true,
    "paymentMethod": "string",
    "lastPayment": "2025-03-20T14:30:00Z"
  },
  "primaryContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "billingContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "technicalContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "users": {
    "total": 15,
    "active": 12,
    "inactive": 3
  },
  "tokens": {
    "available": 500,
    "allocated": 600,
    "used": 100,
    "lastUpdated": "2025-04-20T14:30:00Z"
  },
  "settings": {
    "language": "fr",
    "timezone": "Europe/Paris",
    "currency": "EUR",
    "notificationPreferences": {}
  },
  "notes": "string",
  "tags": ["string"],
  "createdAt": "2025-01-20T14:30:00Z",
  "updatedAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "customer_support" ou "finance".

### 3. Créer un nouveau client

**Endpoint:** `POST /customers`

**Description:** Crée un nouveau client dans la plateforme Kiota Suit.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "industry": "string",
  "website": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "plan": "string",
  "primaryContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "billingContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "technicalContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "initialTokens": 100,
  "notes": "string",
  "tags": ["string"]
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "status": "pending",
  "createdAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "validation_error",
  "message": "Validation échouée",
  "details": [
    {
      "field": "email",
      "message": "Email déjà utilisé par un autre client"
    }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin".

### 4. Mettre à jour un client

**Endpoint:** `PUT /customers/:id`

**Description:** Met à jour les informations d'un client existant.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "industry": "string",
  "website": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "primaryContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "billingContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "technicalContact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position": "string"
  },
  "notes": "string",
  "tags": ["string"]
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "updatedAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### 5. Changer le statut d'un client

**Endpoint:** `PATCH /customers/:id/status`

**Description:** Modifie le statut d'un client (activation, suspension).

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "status": "active|inactive|suspended",
  "reason": "string"  // Optionnel
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "status": "string",
  "updatedAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_status",
  "message": "Statut non valide"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin".

### 6. Changer l'abonnement d'un client

**Endpoint:** `PATCH /customers/:id/subscription`

**Description:** Modifie l'abonnement d'un client existant.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "plan": "string",
  "startDate": "2025-04-20T14:30:00Z",
  "autoRenew": true,
  "paymentMethod": "string",
  "paymentReference": "string"  // Optionnel
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "plan": "string",
  "subscriptionDetails": {
    "id": "string",
    "startDate": "2025-04-20T14:30:00Z",
    "endDate": "2025-07-20T14:30:00Z",
    "autoRenew": true,
    "paymentMethod": "string",
    "lastPayment": "2025-04-20T14:30:00Z"
  },
  "updatedAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_plan",
  "message": "Plan d'abonnement non valide"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

### 7. Obtenir les utilisateurs d'un client

**Endpoint:** `GET /customers/:id/users`

**Description:** Récupère la liste des utilisateurs associés à un client spécifique.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Paramètres de requête:**
```
status: string       // Filtrer par statut (active, inactive, pending)
role: string         // Filtrer par rôle
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'entrées par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "status": "active",
      "lastLogin": "2025-04-20T14:30:00Z",
      "createdAt": "2025-01-20T14:30:00Z"
    }
  ],
  "totalCount": 15,
  "page": 1,
  "limit": 10
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### 8. Obtenir l'historique des activités d'un client

**Endpoint:** `GET /customers/:id/activity`

**Description:** Récupère l'historique des activités associées à un client.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Paramètres de requête:**
```
type: string         // Filtrer par type d'activité
startDate: string    // Format YYYY-MM-DD
endDate: string      // Format YYYY-MM-DD
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'entrées par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "activities": [
    {
      "id": "string",
      "type": "string",
      "description": "string",
      "performedBy": {
        "id": "string",
        "name": "string",
        "role": "string"
      },
      "timestamp": "2025-04-20T14:30:00Z",
      "metadata": {}
    }
  ],
  "totalCount": 42,
  "page": 1,
  "limit": 10
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "customer_support" ou "audit".

### 9. Générer un rapport sur le client

**Endpoint:** `GET /customers/:id/report`

**Description:** Génère un rapport détaillé sur un client spécifique.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Paramètres de requête:**
```
format: string       // Format du rapport (pdf, csv, json)
period: string       // Période du rapport (30d, 90d, 180d, 365d, all)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "reportUrl": "string",
  "expiresAt": "2025-04-22T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_format",
  "message": "Format de rapport non pris en charge"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "customer_support" ou "finance".

### 10. Obtenir les statistiques des clients

**Endpoint:** `GET /customers/statistics`

**Description:** Récupère des statistiques globales sur les clients de Kiota Suit.

**Paramètres de requête:**
```
period: string       // Période (30d, 90d, 180d, 365d)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "totalCustomers": 50,
  "activeCustomers": 45,
  "inactiveCustomers": 3,
  "suspendedCustomers": 2,
  "customersByPlan": {
    "basic": 15,
    "premium": 25,
    "enterprise": 10
  },
  "customersByIndustry": {
    "finance": 12,
    "healthcare": 8,
    "retail": 15,
    "technology": 10,
    "other": 5
  },
  "customersByCountry": {
    "Cameroun": 25,
    "France": 15,
    "Canada": 5,
    "Côte d'Ivoire": 3,
    "Sénégal": 2
  },
  "newCustomers": {
    "last30Days": 5,
    "last90Days": 12,
    "last180Days": 20,
    "last365Days": 35
  },
  "churnRate": {
    "last30Days": 1.2,
    "last90Days": 3.5,
    "last180Days": 5.2,
    "last365Days": 7.8
  },
  "averageRevenuePerCustomer": 1250,
  "currency": "USD"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

## Gestion des Contacts Clients

### 1. Ajouter un contact client

**Endpoint:** `POST /customers/:id/contacts`

**Description:** Ajoute un nouveau contact à un client existant.

**Paramètres de chemin:**
```
id: string       // Identifiant unique du client
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "isPrimary": false,
  "type": "general|technical|billing"
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "type": "string",
  "createdAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "customer_not_found",
  "message": "Client non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### 2. Mettre à jour un contact client

**Endpoint:** `PUT /customers/:customerId/contacts/:contactId`

**Description:** Met à jour les informations d'un contact client existant.

**Paramètres de chemin:**
```
customerId: string   // Identifiant unique du client
contactId: string    // Identifiant unique du contact
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "isPrimary": false,
  "type": "general|technical|billing"
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "type": "string",
  "updatedAt": "2025-04-20T14:30:00Z"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "contact_not_found",
  "message": "Contact non trouvé"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "customer_support".

### 3. Supprimer un contact client

**Endpoint:** `DELETE /customers/:customerId/contacts/:contactId`

**Description:** Supprime un contact client existant.

**Paramètres de chemin:**
```
customerId: string   // Identifiant unique du client
contactId: string    // Identifiant unique du contact
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (204 No Content)**

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "contact_not_found",
  "message": "Contact non trouvé"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "primary_contact_delete",
  "message": "Impossible de supprimer le contact principal"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin".

## Processus d'onboarding client

Le processus d'onboarding d'un nouveau client dans Kiota Suit se déroule comme suit:

1. Création du profil client par l'administrateur i-Kiotahub avec identification du type de client (`financial`, `corporate`, `individual` ou `pme`)
2. Configuration de l'abonnement initial (type d'abonnement: `freemium`, `standard`, `premium` ou `enterprise`)
3. Attribution d'un nombre initial de tokens selon le type d'abonnement
4. Création du compte administrateur principal du client avec statut `pending`
5. Envoi des informations de connexion au contact principal
6. Configuration des paramètres spécifiques au client (devise, langue, etc.)
7. Activation du compte client (passage du statut de `pending` à `active`)

Ce processus garantit:
- Une configuration correcte de chaque client dans le système
- Une personnalisation selon les besoins spécifiques du client
- L'accès immédiat aux fonctionnalités appropriées de Kiota Suit

### États possibles d'un client

Un client dans le système peut avoir les statuts suivants:
- `pending`: En attente d'activation après création initiale
- `active`: Client actif avec accès complet aux services
- `inactive`: Client temporairement désactivé
- `suspended`: Client suspendu pour raison administrative ou de paiement

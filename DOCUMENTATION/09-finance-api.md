# Documentation API de Finance

Cette documentation décrit les endpoints de gestion financière disponibles dans l'application Ksuit Admin, mise à jour en avril 2025.

## Base URL

Tous les endpoints commencent par `/finance`.

## Types et Statuts

### Types de transactions
- `payment` : Paiement reçu
- `invoice` : Facture émise
- `refund` : Remboursement effectué
- `credit` : Crédit accordé
- `debit` : Débit effectué

### Statuts de transactions
- `completed` : Transaction complétée
- `pending` : En attente
- `failed` : Échec de la transaction
- `canceled` : Transaction annulée

### Méthodes de paiement
- `bank_transfer` : Virement bancaire
- `card` : Carte bancaire
- `mobile_money` : Paiement mobile
- `crypto` : Cryptomonnaie
- `cash` : Espèces

### Statuts de factures
- `paid` : Facture payée
- `pending` : En attente de paiement
- `overdue` : En retard de paiement
- `canceled` : Facture annulée

## Endpoints

### 1. Transactions

#### 1.1. Obtenir la liste des transactions

**Endpoint:** `GET /finance/transactions`

**Description:** Récupère la liste des transactions avec pagination et filtrage.

**Paramètres de requête:**
```
search: string            // Terme de recherche
type: string              // Filtrer par type ('payment', 'invoice', 'refund', 'credit', 'debit', 'all')
status: string            // Filtrer par statut ('completed', 'pending', 'failed', 'canceled', 'all')
startDate: string         // Date de début (format YYYY-MM-DD)
endDate: string           // Date de fin (format YYYY-MM-DD)
customerId: string        // Filtrer par ID client
page: number              // Numéro de page (commence à 1)
limit: number             // Nombre de transactions par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "transactions": [
    {
      "id": "string",
      "reference": "string",
      "amount": 1000,
      "currency": "USD",
      "type": "payment",
      "status": "completed",
      "createdAt": "2025-04-20T14:30:00Z",
      "updatedAt": "2025-04-20T14:35:00Z",
      "description": "string",
      "customerId": "string",
      "customerName": "string",
      "paymentMethod": "bank_transfer",
      "metadata": {
        "bankName": "string",
        "accountNumber": "string"
      }
    }
  ],
  "totalCount": 42,
  "page": 1,
  "totalPages": 5
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

#### 1.2. Créer une nouvelle transaction

**Endpoint:** `POST /finance/transactions`

**Description:** Crée une nouvelle transaction dans le système.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "customerId": "string",
  "amount": 1000,
  "currency": "USD",
  "type": "payment",
  "description": "string",
  "paymentMethod": "bank_transfer",
  "metadata": {
    "bankName": "string",
    "accountNumber": "string"
  }
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "reference": "string",
  "amount": 1000,
  "currency": "USD",
  "type": "payment",
  "status": "completed",
  "createdAt": "2025-04-23T14:30:00Z",
  "updatedAt": "2025-04-23T14:30:00Z",
  "description": "string",
  "customerId": "string",
  "customerName": "string",
  "paymentMethod": "bank_transfer",
  "metadata": {
    "bankName": "string",
    "accountNumber": "string"
  }
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "validation_error",
  "message": "Validation échouée",
  "details": [
    {
      "field": "amount",
      "message": "Le montant doit être supérieur à zéro"
    }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

### 2. Factures

#### 2.1. Obtenir la liste des factures

**Endpoint:** `GET /finance/invoices`

**Description:** Récupère la liste des factures avec pagination et filtrage.

**Paramètres de requête:**
```
search: string            // Terme de recherche
status: string            // Filtrer par statut ('paid', 'pending', 'overdue', 'canceled', 'all')
customerId: string        // Filtrer par ID client
startDate: string         // Date de début (format YYYY-MM-DD)
endDate: string           // Date de fin (format YYYY-MM-DD)
page: number              // Numéro de page (commence à 1)
limit: number             // Nombre de factures par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "invoices": [
    {
      "id": "string",
      "invoiceNumber": "INV-2025-0001",
      "customerId": "string",
      "customerName": "string",
      "amount": 2500,
      "currency": "USD",
      "status": "pending",
      "issueDate": "2025-04-20T00:00:00Z",
      "dueDate": "2025-05-20T00:00:00Z",
      "subtotal": 2300,
      "taxAmount": 200,
      "discountAmount": 0,
      "totalAmount": 2500
    }
  ],
  "totalCount": 15,
  "page": 1,
  "totalPages": 2
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "finance" ou "customer_support".

#### 2.2. Obtenir une facture par ID

**Endpoint:** `GET /finance/invoices/{id}`

**Description:** Récupère les détails complets d'une facture spécifique.

**Paramètres de chemin:**
```
id: string       // Identifiant unique de la facture
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "invoiceNumber": "INV-2025-0001",
  "customerId": "string",
  "customerName": "string",
  "amount": 2500,
  "currency": "USD",
  "status": "pending",
  "issueDate": "2025-04-20T00:00:00Z",
  "dueDate": "2025-05-20T00:00:00Z",
  "paidDate": null,
  "items": [
    {
      "id": "string",
      "description": "Service Premium - Abonnement mensuel",
      "quantity": 1,
      "unitPrice": 2000,
      "subtotal": 2000,
      "taxRate": 10,
      "taxAmount": 200
    },
    {
      "id": "string",
      "description": "Tokens supplémentaires",
      "quantity": 3,
      "unitPrice": 100,
      "subtotal": 300
    }
  ],
  "subtotal": 2300,
  "taxAmount": 200,
  "discountAmount": 0,
  "totalAmount": 2500,
  "notes": "Merci pour votre confiance."
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "invoice_not_found",
  "message": "Facture non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin", "finance" ou "customer_support".

#### 2.3. Créer une nouvelle facture

**Endpoint:** `POST /finance/invoices`

**Description:** Crée une nouvelle facture dans le système.

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "customerId": "string",
  "items": [
    {
      "description": "Service Premium - Abonnement mensuel",
      "quantity": 1,
      "unitPrice": 2000,
      "taxRate": 10
    },
    {
      "description": "Tokens supplémentaires",
      "quantity": 3,
      "unitPrice": 100
    }
  ],
  "dueDate": "2025-05-20T00:00:00Z",
  "notes": "Merci pour votre confiance.",
  "currency": "USD"
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "invoiceNumber": "INV-2025-0001",
  "customerId": "string",
  "customerName": "string",
  "amount": 2500,
  "currency": "USD",
  "status": "pending",
  "issueDate": "2025-04-23T00:00:00Z",
  "dueDate": "2025-05-20T00:00:00Z",
  "items": [
    {
      "id": "string",
      "description": "Service Premium - Abonnement mensuel",
      "quantity": 1,
      "unitPrice": 2000,
      "subtotal": 2000,
      "taxRate": 10,
      "taxAmount": 200
    },
    {
      "id": "string",
      "description": "Tokens supplémentaires",
      "quantity": 3,
      "unitPrice": 100,
      "subtotal": 300
    }
  ],
  "subtotal": 2300,
  "taxAmount": 200,
  "discountAmount": 0,
  "totalAmount": 2500,
  "notes": "Merci pour votre confiance."
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "validation_error",
  "message": "Validation échouée",
  "details": [
    {
      "field": "customerId",
      "message": "ID client requis"
    }
  ]
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

#### 2.4. Payer une facture

**Endpoint:** `POST /finance/invoices/{id}/pay`

**Description:** Enregistre le paiement d'une facture.

**Paramètres de chemin:**
```
id: string       // Identifiant unique de la facture
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Requête:**
```json
{
  "method": "bank_transfer",
  "transactionReference": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "invoiceId": "string",
  "customerId": "string",
  "amount": 2500,
  "currency": "USD",
  "method": "bank_transfer",
  "status": "completed",
  "transactionReference": "string",
  "paidAt": "2025-04-23T15:30:00Z",
  "description": "Paiement de la facture INV-2025-0001"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_operation",
  "message": "La facture a déjà été payée"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "invoice_not_found",
  "message": "Facture non trouvée"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

### 3. Paiements

#### 3.1. Obtenir la liste des paiements

**Endpoint:** `GET /finance/payments`

**Description:** Récupère la liste des paiements avec pagination et filtrage.

**Paramètres de requête:**
```
search: string            // Terme de recherche
status: string            // Filtrer par statut ('completed', 'pending', 'failed', 'canceled', 'all')
customerId: string        // Filtrer par ID client
startDate: string         // Date de début (format YYYY-MM-DD)
endDate: string           // Date de fin (format YYYY-MM-DD)
page: number              // Numéro de page (commence à 1)
limit: number             // Nombre de paiements par page
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "payments": [
    {
      "id": "string",
      "invoiceId": "string",
      "customerId": "string",
      "amount": 2500,
      "currency": "USD",
      "method": "bank_transfer",
      "status": "completed",
      "transactionReference": "string",
      "paidAt": "2025-04-23T15:30:00Z",
      "description": "Paiement de la facture INV-2025-0001"
    }
  ],
  "totalCount": 25,
  "page": 1,
  "totalPages": 3
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

### 4. Analyses financières

#### 4.1. Obtenir les statistiques de revenus

**Endpoint:** `GET /finance/revenue`

**Description:** Récupère des statistiques sur les revenus selon une période spécifiée.

**Paramètres de requête:**
```
period: string        // 'daily', 'weekly', 'monthly', 'yearly'
startDate: string     // Format YYYY-MM-DD (optionnel)
endDate: string       // Format YYYY-MM-DD (optionnel)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "totalRevenue": 125000,
  "pendingInvoices": 5,
  "pendingAmount": 12500,
  "overduAmount": 3000,
  "paidInvoices": 45,
  "revenueByMonth": {
    "2025-01": 18500,
    "2025-02": 22300,
    "2025-03": 27500,
    "2025-04": 56700
  },
  "topCustomers": [
    {
      "customerId": "string",
      "customerName": "string",
      "totalSpent": 25000
    },
    {
      "customerId": "string",
      "customerName": "string",
      "totalSpent": 18500
    }
  ]
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_period",
  "message": "Période non valide"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

#### 4.2. Obtenir les statistiques de dépenses

**Endpoint:** `GET /finance/expenses`

**Description:** Récupère des statistiques sur les dépenses selon une période spécifiée.

**Paramètres de requête:**
```
period: string        // 'daily', 'weekly', 'monthly', 'yearly'
startDate: string     // Format YYYY-MM-DD (optionnel)
endDate: string       // Format YYYY-MM-DD (optionnel)
```

**Headers requis:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Réponse réussie (200 OK):**
```json
{
  "totalExpenses": 40000,
  "expensesByCategory": {
    "services": 25000,
    "marketing": 8000,
    "infrastructure": 7000
  },
  "expensesByMonth": {
    "2025-01": 8500,
    "2025-02": 9300,
    "2025-03": 10500,
    "2025-04": 11700
  }
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "invalid_period",
  "message": "Période non valide"
}
```

**Droits d'accès requis:** Utilisateur authentifié avec rôle "admin" ou "finance".

## Processus de facturation et paiement

Le processus complet de facturation et de paiement dans le système suit généralement ces étapes:

1. Création d'une facture pour un client avec les éléments détaillés et les taxes applicables
2. Notification au client de la disponibilité d'une nouvelle facture
3. Suivi des factures en attente et envoi de rappels pour les factures dont l'échéance approche
4. Enregistrement du paiement lorsque celui-ci est reçu
5. Mise à jour automatique du statut de la facture
6. Génération des transactions correspondantes pour la comptabilité

Ce système permet une gestion financière complète tout en gardant une trace détaillée des transactions pour la conformité fiscale et les rapports financiers.

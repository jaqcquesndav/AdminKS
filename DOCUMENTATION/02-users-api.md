# Documentation API des Utilisateurs

Cette documentation décrit les endpoints de gestion des utilisateurs disponibles dans l'application Ksuit Admin.

## Base URL

Tous les endpoints commencent par `/users` ou `/admin` pour les opérations administratives.

## Endpoints

### 1. Lister les utilisateurs

**Endpoint:** `GET /users`

**Description:** Récupère la liste des utilisateurs avec pagination et filtrage.

**Paramètres de requête:**
```
search: string       // Terme de recherche
role: string         // Filtre par rôle
status: string       // Filtre par statut
page: number         // Numéro de page (commence à 1)
limit: number        // Nombre d'utilisateurs par page
```

**Réponse réussie (200 OK):**
```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "status": "string",
      "picture": "string",
      "phoneNumber": "string",
      "departement": "string",
      "lastLogin": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalCount": 50,
  "page": 1,
  "totalPages": 5
}
```

### 2. Obtenir un utilisateur par ID

**Endpoint:** `GET /users/{id}`

**Description:** Récupère les détails d'un utilisateur spécifique.

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "status": "string",
  "picture": "string",
  "phoneNumber": "string",
  "departement": "string",
  "permissions": ["string"],
  "lastLogin": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "string",
  "message": "Utilisateur non trouvé"
}
```

### 3. Obtenir le profil utilisateur courant

**Endpoint:** `GET /users/profile`

**Description:** Récupère les détails du profil de l'utilisateur actuellement connecté.

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "status": "string",
  "picture": "string",
  "phoneNumber": "string",
  "departement": "string",
  "permissions": ["string"],
  "lastLogin": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 4. Mettre à jour le profil utilisateur

**Endpoint:** `PUT /users/profile`

**Description:** Met à jour le profil de l'utilisateur connecté.

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "departement": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "status": "string",
  "picture": "string",
  "phoneNumber": "string",
  "departement": "string",
  "updatedAt": "string"
}
```

### 5. Créer un nouvel utilisateur

**Endpoint:** `POST /users`

**Description:** Crée un nouvel utilisateur dans le système.

**Requête:**
```json
{
  "email": "string",
  "name": "string",
  "role": "string",
  "password": "string",        // Optionnel
  "sendInvitation": true,      // Optionnel, si true un email d'invitation sera envoyé
  "permissions": ["string"],   // Optionnel, permissions spécifiques
  "departement": "string",     // Optionnel
  "phoneNumber": "string"      // Optionnel
}
```

**Réponse réussie (201 Created):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "status": "string",
  "departement": "string",
  "phoneNumber": "string",
  "createdAt": "string"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "string",
  "message": "Email déjà utilisé"
}
```

### 6. Mettre à jour un utilisateur

**Endpoint:** `PUT /users/{id}`

**Description:** Met à jour les informations d'un utilisateur spécifique.

**Requête:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "string",
  "departement": "string",
  "phoneNumber": "string",
  "permissions": ["string"]
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "status": "string",
  "picture": "string",
  "phoneNumber": "string",
  "departement": "string",
  "permissions": ["string"],
  "updatedAt": "string"
}
```

### 7. Supprimer un utilisateur

**Endpoint:** `DELETE /users/{id}`

**Description:** Supprime un utilisateur du système.

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

**Réponse d'erreur (404 Not Found):**
```json
{
  "error": "string",
  "message": "Utilisateur non trouvé"
}
```

### 8. Changer le mot de passe

**Endpoint:** `POST /users/change-password`

**Description:** Change le mot de passe de l'utilisateur connecté.

**Requête:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Mot de passe changé avec succès"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "string",
  "message": "Le mot de passe actuel est incorrect ou les nouveaux mots de passe ne correspondent pas"
}
```

### 9. Obtenir l'historique des activités d'un utilisateur

**Endpoint:** `GET /users/{id}/activities`

**Description:** Récupère l'historique des activités d'un utilisateur.

**Paramètres de requête:**
```
page: number     // Numéro de page (commence à 1)
limit: number    // Nombre d'activités par page
```

**Réponse réussie (200 OK):**
```json
{
  "activities": [
    {
      "id": "string",
      "action": "string",
      "timestamp": "string",
      "ipAddress": "string",
      "device": "string",
      "browser": "string",
      "details": {
        // Détails spécifiques à l'action
      }
    }
  ],
  "totalCount": 42
}
```

### 10. Obtenir les sessions actives d'un utilisateur

**Endpoint:** `GET /users/{id}/sessions`

**Description:** Récupère les sessions actives d'un utilisateur.

**Réponse réussie (200 OK):**
```json
{
  "sessions": [
    {
      "id": "string",
      "ipAddress": "string",
      "device": "string",
      "browser": "string",
      "location": "string",
      "startTime": "string",
      "lastActivity": "string",
      "active": true
    }
  ],
  "totalCount": 3
}
```

### 11. Terminer une session

**Endpoint:** `DELETE /sessions/{sessionId}`

**Description:** Termine une session spécifique (déconnecte l'appareil).

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Session terminée avec succès"
}
```

### 12. Télécharger un avatar

**Endpoint:** `POST /users/avatar`

**Description:** Télécharge un nouvel avatar pour l'utilisateur connecté. L'avatar est d'abord chargé sur Cloudinary, puis l'URL est envoyée au backend.

**Requête:**
```json
{
  "avatarUrl": "string",   // URL Cloudinary de l'image téléchargée
  "publicId": "string"     // ID public Cloudinary
}
```

**Réponse réussie (200 OK):**
```json
{
  "avatarUrl": "string",
  "message": "Avatar mis à jour avec succès"
}
```

## Endpoints administratifs

Ces endpoints sont réservés aux utilisateurs avec des droits d'administrateur.

### 1. Statistiques des utilisateurs

**Endpoint:** `GET /admin/users/statistics`

**Description:** Récupère des statistiques globales sur les utilisateurs du système.

**Réponse réussie (200 OK):**
```json
{
  "totalUsers": 120,
  "activeUsers": 98,
  "inactiveUsers": 22,
  "usersByRole": {
    "admin": 5,
    "user": 95,
    "customer_support": 10,
    "growth_finance": 8,
    "cto": 2
  },
  "newUsersThisMonth": 12,
  "avgSessionsPerUser": 5.3
}
```

### 2. Statistiques d'activité

**Endpoint:** `GET /admin/activity/statistics`

**Description:** Récupère des statistiques sur les activités des utilisateurs.

**Paramètres de requête:**
```
period: string    // 'daily', 'weekly', 'monthly'
```

**Réponse réussie (200 OK):**
```json
{
  "totalActivities": 1250,
  "uniqueUsers": 87,
  "activityByDate": [
    {
      "date": "2025-04-22",
      "count": 145
    },
    {
      "date": "2025-04-21",
      "count": 132
    }
    // ... autres dates
  ],
  "activityByType": {
    "login": 210,
    "logout": 185,
    "profile_update": 45,
    "password_change": 12,
    "document_upload": 89,
    "other": 709
  }
}
```

### 3. Réinitialiser le mot de passe d'un utilisateur

**Endpoint:** `POST /admin/users/{userId}/reset-password`

**Description:** Réinitialise le mot de passe d'un utilisateur spécifique et lui envoie un email avec un lien de réinitialisation.

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Email de réinitialisation de mot de passe envoyé"
}
```

### 4. Activer/désactiver un utilisateur

**Endpoint:** `POST /admin/users/{userId}/toggle-status`

**Description:** Active ou désactive un compte utilisateur.

**Requête:**
```json
{
  "active": true    // true pour activer, false pour désactiver
}
```

**Réponse réussie (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "status": "active", // ou "inactive"
  "updatedAt": "string"
}
```

### 5. Obtenir la liste des comptes clients

**Endpoint:** `GET /admin/customer-accounts`

**Description:** Récupère la liste des comptes clients.

**Paramètres de requête:**
```
type: string       // Type de client
status: string     // Statut du compte
search: string     // Terme de recherche
page: number       // Numéro de page (commence à 1)
limit: number      // Nombre de clients par page
```

**Réponse réussie (200 OK):**
```json
{
  "accounts": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "email": "string",
      "phoneNumber": "string",
      "address": {
        "street": "string",
        "city": "string",
        "zipCode": "string",
        "country": "string"
      },
      "contactPerson": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "lastActivity": "string",
      "createdAt": "string"
    }
  ],
  "totalCount": 85
}

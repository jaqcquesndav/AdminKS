# Documentation API d'Authentification

Cette documentation décrit les endpoints d'authentification disponibles dans l'application Ksuit Admin.

## Base URL

Tous les endpoints commencent par `/auth`.

## Endpoints

### 1. Connexion

**Endpoint:** `POST /auth/login`

**Description:** Authentifie un utilisateur avec son nom d'utilisateur et son mot de passe.

**Requête:**
```json
{
  "username": "string", // Email de l'utilisateur
  "password": "string"  // Mot de passe de l'utilisateur
}
```

**Réponse réussie (200 OK):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "picture": "string", // Optionnel, URL de la photo de profil
    "role": "string"     // Un des rôles: 'admin', 'user', 'superadmin', 'cto', 'growth_finance', 'customer_support'
  }
}
```

**Réponse avec 2FA requis (200 OK):**
```json
{
  "requiresTwoFactor": true,
  "twoFactorMethods": ["email", "sms"],
  "tempToken": "string" // Token temporaire pour la vérification 2FA
}
```

**Réponse d'erreur (401 Unauthorized):**
```json
{
  "error": "string",
  "message": "Identifiants invalides"
}
```

### 2. Vérification à deux facteurs

**Endpoint:** `POST /auth/2fa/verify`

**Description:** Vérifie un code d'authentification à deux facteurs.

**Requête:**
```json
{
  "code": "string",       // Code de vérification
  "method": "string"      // Méthode utilisée ('email' ou 'sms')
}
```

**Réponse réussie (200 OK):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "picture": "string", // Optionnel, URL de la photo de profil
    "role": "string"     // Un des rôles: 'admin', 'user', 'superadmin', 'cto', 'growth_finance', 'customer_support'
  }
}
```

**Réponse d'erreur (401 Unauthorized):**
```json
{
  "error": "string",
  "message": "Code invalide ou expiré"
}
```

### 3. Configuration de l'authentification à deux facteurs

**Endpoint:** `POST /auth/2fa/setup`

**Description:** Configure la méthode d'authentification à deux facteurs pour un utilisateur.

**Requête:**
```json
{
  "method": "string",  // Méthode de vérification ('email' ou 'sms')
  "contact": "string"  // Email ou numéro de téléphone selon la méthode
}
```

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Méthode 2FA configurée avec succès"
}
```

**Réponse d'erreur (400 Bad Request):**
```json
{
  "error": "string",
  "message": "Contact invalide ou non pris en charge"
}
```

### 4. Actualisation du token

**Endpoint:** `POST /auth/refresh`

**Description:** Actualise un token d'accès expiré en utilisant un token de rafraîchissement.

**Requête:**
```json
{
  "refreshToken": "string"  // Token de rafraîchissement
}
```

**Réponse réussie (200 OK):**
```json
{
  "token": "string",
  "refreshToken": "string", // Nouveau token de rafraîchissement
  "expiresIn": 3600         // Durée de validité du token en secondes
}
```

**Réponse d'erreur (401 Unauthorized):**
```json
{
  "error": "string",
  "message": "Token de rafraîchissement invalide ou expiré"
}
```

### 5. Déconnexion

**Endpoint:** `POST /auth/logout`

**Description:** Déconnecte l'utilisateur en invalidant son token.

**Requête:** 
Aucun corps requis, mais doit inclure le token dans l'en-tête Authorization.

**Réponse réussie (200 OK):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

## Authentification KS (OIDC)

### 1. Initiation de l'authentification KS

**Endpoint:** `GET /auth/ks/authorize`

**Description:** Démarre le processus d'authentification OAuth2/OIDC avec KS.

**Réponse réussie (200 OK):**
```json
{
  "authorizationUrl": "string" // URL pour rediriger l'utilisateur
}
```

### 2. Callback d'authentification KS

**Endpoint:** `POST /auth/ks/callback`

**Description:** Traite le callback d'authentification KS.

**Requête:**
```json
{
  "code": "string" // Code d'autorisation reçu du serveur OAuth2/OIDC
}
```

**Réponse réussie (200 OK):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "picture": "string", // Optionnel, URL de la photo de profil
    "role": "string"     // Un des rôles: 'admin', 'user', 'superadmin', 'cto', 'growth_finance', 'customer_support'
  }
}
```

### 3. Déconnexion KS

**Endpoint:** `POST /auth/ks/logout`

**Description:** Déconnecte l'utilisateur du système KS.

**Réponse réussie (200 OK):**
```json
{
  "logoutUrl": "string" // URL pour terminer la déconnexion du côté KS
}
```

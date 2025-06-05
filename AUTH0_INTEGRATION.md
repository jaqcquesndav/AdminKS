# Intégration Auth0 - Documentation Technique

## Vue d'ensemble
Cette documentation décrit l'intégration d'Auth0 dans l'application d'administration wanzo Suite. L'implémentation a été conçue pour fonctionner parallèlement au système d'authentification de démonstration existant, permettant une transition en douceur vers Auth0 tout en conservant la capacité de se connecter avec des comptes de démonstration.

## Architecture

### Flux d'authentification

1. **Login initié par l'utilisateur**
   - L'utilisateur clique sur "Se connecter"
   - Le composant `UniversalLoginButton` détecte s'il s'agit d'un email de démonstration ou d'une authentification Auth0

2. **Authentification Auth0**
   - Redirection vers Auth0 pour authentification
   - Après authentification réussie, Auth0 redirige vers notre callback URL
   - Le token et les informations utilisateur d'Auth0 sont récupérés et stockés

3. **Authentification Démo**
   - Pas de redirection externe, authentification directe
   - Utilise le système de mock pour simuler l'authentification

4. **Protection des routes**
   - Composant `ProtectedRoute` vérifie l'authentification via Auth0 ou le système démo
   - `RoleBasedRoute` vérifie les autorisations basées sur les rôles

5. **Requêtes API**
   - Les tokens d'authentification sont automatiquement attachés aux requêtes API
   - Headers spécifiques ajoutés pour distinguer les types d'authentification

### Composants principaux

#### Services

- **authService**: Service d'authentification central qui gère à la fois Auth0 et l'authentification démo
- **auth0Service**: Service utilitaire pour convertir les données utilisateur Auth0 vers notre format interne

#### Composants React

- **AuthProvider**: Wrapper Auth0Provider avec configuration
- **UniversalLoginButton**: Composant de login qui gère à la fois Auth0 et démo
- **UniversalLogoutButton**: Composant de déconnexion unifié
- **Auth0Status**: Affiche l'état d'authentification actuel
- **ProtectedRoute**: Protection des routes unifiée

#### Hooks

- **useAuth**: Hook Zustand pour l'état d'authentification local
- **useUserInfo**: Hook utilitaire pour accéder aux informations utilisateur

## Configuration Auth0

### Variables d'environnement
```
VITE_AUTH0_DOMAIN=votre-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=votre-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
VITE_AUTH0_AUDIENCE=https://api.wanzo.com
VITE_AUTH0_SCOPE="openid profile email"
```

### Claims personnalisés
L'application s'attend à ce que les utilisateurs Auth0 aient les claims personnalisés suivants:

- `https://api.wanzo.com/role`: Rôle de l'utilisateur (super_admin, customer_support, etc.)
- `https://api.wanzo.com/scopes`: Permissions spécifiques (séparées par des espaces)
- `https://api.wanzo.com/userType`: Type d'utilisateur (internal, external)
- `https://api.wanzo.com/customerAccountId`: ID du compte client (pour les utilisateurs externes)

## Mode de démonstration

Le système maintient la compatibilité avec le mode démo via:

- Variable `USE_MOCK_AUTH` pour activer/désactiver globalement le mode démo
- Fonction `isDemoEmail()` pour détecter automatiquement les emails de démonstration
- Structure conditionnelle dans l'interface pour basculer entre les modes

## Transition progressive

Cette implémentation permet une transition progressive vers Auth0:

1. Les utilisateurs existants peuvent continuer à utiliser le mode démo
2. Les nouveaux utilisateurs sont dirigés vers Auth0
3. L'API backend peut accepter les deux types de tokens
4. L'interface identifie clairement quel mode est utilisé

## Recommandations pour la suite

1. **Suppression progressive du mode démo**:
   - Définir une date limite pour la désactivation complète
   - Ajouter des avertissements dans l'interface pour les utilisateurs démo

2. **Règles Auth0**:
   - Créer des règles dans Auth0 pour mapper automatiquement les rôles
   - Synchroniser les métadonnées utilisateur avec le backend

3. **Sécurité**:
   - Implémenter la vérification des scopes plus rigoureusement
   - Ajouter des mécanismes de révocation de token

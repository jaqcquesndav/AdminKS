import { User } from '@auth0/auth0-react';
import type { AuthUser } from '../../types/auth';

/**
 * Convertit un utilisateur Auth0 en AuthUser interne
 */
export function convertAuth0UserToAuthUser(auth0User: User): AuthUser {
  return {
    id: auth0User.sub || '',
    name: auth0User.name || '',
    email: auth0User.email || '',
    picture: auth0User.picture,
    // Récupérer le rôle depuis le claim personnalisé d'Auth0 
    // Ou utiliser une valeur par défaut
    role: auth0User['https://api.wanzo.com/role'] || 'user',
    userType: auth0User['https://api.wanzo.com/userType'] || 'internal',
    customerAccountId: auth0User['https://api.wanzo.com/customerAccountId'],
  };
}

/**
 * Extrait les scopes d'un utilisateur Auth0
 */
export function getAuth0UserScopes(auth0User: User): string[] {
  // Les scopes sont généralement stockés dans un claim personnalisé
  const scopesString = auth0User['https://api.wanzo.com/scopes'] || '';
  return scopesString.split(' ').filter(Boolean);
}

/**
 * Vérifie si un utilisateur Auth0 a les scopes requis
 */
export function hasRequiredScopes(auth0User: User, requiredScopes: string[]): boolean {
  if (!requiredScopes.length) return true;
  
  const userScopes = getAuth0UserScopes(auth0User);
  return requiredScopes.every(scope => userScopes.includes(scope));
}

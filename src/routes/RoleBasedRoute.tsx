import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserInfo } from '../hooks/useAuth';
import { authService } from '../services/auth/authService';
import { USE_MOCK_AUTH } from '../utils/mockAuth';

interface RoleBasedRouteProps {
  requiredRoles: string[];
  requiredScopes?: string[];
}

export function RoleBasedRoute({ requiredRoles, requiredScopes = [] }: RoleBasedRouteProps) {
  const userInfo = useUserInfo();
  const { isAuthenticated: isAuth0Authenticated, user: auth0User } = useAuth0();
  const isUsingAuth0 = !USE_MOCK_AUTH && authService.isAuth0Authentication();
  
  // Vérification pour Auth0
  if (isUsingAuth0 && isAuth0Authenticated && auth0User) {
    // Vérifier les scopes pour Auth0 si nécessaire
    if (requiredScopes.length > 0) {
      const userScopes = (auth0User['https://api.wanzo.com/scopes'] || '').split(' ');
      const hasRequiredScopes = requiredScopes.every(scope => 
        userScopes.includes(scope)
      );
      
      if (!hasRequiredScopes) {
        return <Navigate to="/dashboard" replace />;
      }
    }
    
    // Vérifier le rôle Auth0
    const auth0Role = auth0User['https://api.wanzo.com/role'] || '';
    const isAuth0Admin = auth0Role === 'super_admin' || auth0Role === 'admin';
    
    if (isAuth0Admin) {
      return <Outlet />;
    }
    
    const hasRequiredRoleInAuth0 = requiredRoles.includes(auth0Role);
    if (hasRequiredRoleInAuth0) {
      return <Outlet />;
    }
  } else {
    // Logique existante pour les utilisateurs de démo
    // Si l'utilisateur est super admin, il a accès à tout
    if (userInfo.isSuperAdmin) {
      return <Outlet />;
    }
    
    // Vérifier si l'utilisateur a un des rôles requis
    const hasRequiredRole = requiredRoles.some(role => userInfo.hasRole(role));
    
    if (hasRequiredRole) {
      return <Outlet />;
    }
  }

  // Rediriger vers le dashboard si l'utilisateur n'a pas les permissions
  return <Navigate to="/dashboard" replace />;
}
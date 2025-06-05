import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
  const { isAuthenticated: isAuth0Authenticated, user: auth0User, isLoading: isAuth0Loading } = useAuth0();
  const isDemoAuthenticated = authService.isAuthenticated();
  const isUsingAuth0 = !USE_MOCK_AUTH && authService.isAuth0Authentication();
  const location = useLocation();
  
  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isAuth0Loading && !USE_MOCK_AUTH) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = USE_MOCK_AUTH ? isDemoAuthenticated : (isAuth0Authenticated || isDemoAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Vérification pour Auth0
  if (isUsingAuth0 && isAuth0Authenticated && auth0User) {
    // Vérifier les scopes pour Auth0 si nécessaire
    if (requiredScopes.length > 0) {
      const userScopes = (auth0User['https://api.wanzo.com/scopes'] || '').split(' ');
      const hasRequiredScopes = requiredScopes.every(scope => 
        userScopes.includes(scope)
      );
      
      if (!hasRequiredScopes) {
        return <Navigate to="/non-autorise" replace />;
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
    }  } else if (isDemoAuthenticated) {
    // Logique pour les utilisateurs de démo
    // Si l'utilisateur est super admin, il a accès à tout
    if (userInfo.role === 'super_admin' || userInfo.isSuperAdmin) {
      console.log("Super admin access granted via role or isSuperAdmin flag");
      return <Outlet />;
    }
    
    // Vérifier si l'utilisateur a un des rôles requis
    const hasRequiredRole = requiredRoles.some(role => userInfo.hasRole(role));
    console.log("Required roles:", requiredRoles, "Has required role:", hasRequiredRole);
    
    if (hasRequiredRole) {
      return <Outlet />;
    }
  }

  // Rediriger vers la page non autorisée si l'utilisateur n'a pas les permissions
  return <Navigate to="/non-autorise" replace />;
}
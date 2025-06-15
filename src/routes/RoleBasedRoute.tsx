import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface RoleBasedRouteProps {
  requiredRoles: string[];
  requiredScopes?: string[];
}

export function RoleBasedRoute({ requiredRoles, requiredScopes = [] }: RoleBasedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const location = useLocation();
  
  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Vérifier les scopes si nécessaire
  if (requiredScopes.length > 0) {
    const userScopes = (user['https://api.wanzo.com/scopes'] || '').split(' ');
    const hasRequiredScopes = requiredScopes.every(scope => 
      userScopes.includes(scope)
    );
    
    if (!hasRequiredScopes) {
      return <Navigate to="/non-autorise" replace />;
    }
  }
  
  // Vérifier le rôle Auth0
  const auth0Role = user['https://api.wanzo.com/role'] || '';
  const isAuth0Admin = auth0Role === 'super_admin' || auth0Role === 'admin';
  
  if (isAuth0Admin) {
    return <Outlet />;
  }
  
  const hasRequiredRoleInAuth0 = requiredRoles.includes(auth0Role);
  if (hasRequiredRoleInAuth0) {
    return <Outlet />;
  }

  // Rediriger vers la page non autorisée si l'utilisateur n'a pas les permissions
  return <Navigate to="/non-autorise" replace />;
}
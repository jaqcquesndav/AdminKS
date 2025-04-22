import { Navigate, Outlet } from 'react-router-dom';
import { useUserInfo } from '../hooks/useAuth';

interface RoleBasedRouteProps {
  requiredRoles: string[];
}

export function RoleBasedRoute({ requiredRoles }: RoleBasedRouteProps) {
  const userInfo = useUserInfo();
  
  // Si l'utilisateur est super admin, il a accès à tout
  if (userInfo.isSuperAdmin) {
    return <Outlet />;
  }
  
  // Vérifier si l'utilisateur a un des rôles requis
  const hasRequiredRole = requiredRoles.some(role => userInfo.hasRole(role));
  
  if (hasRequiredRole) {
    return <Outlet />;
  }

  // Rediriger vers le dashboard si l'utilisateur n'a pas les permissions
  return <Navigate to="/dashboard" replace />;
}
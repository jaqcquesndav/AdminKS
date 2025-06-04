import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredScopes?: string[];
}

export const Auth0ProtectedRoute = ({ 
  children, 
  requiredScopes = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  
  // Afficher un indicateur de chargement
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // Vérifier l'authentification
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier les autorisations si nécessaire
  if (requiredScopes.length > 0) {
    const userScopes = (user?.['https://api.wanzo.com/scopes'] || '').split(' ');
    const hasRequiredScopes = requiredScopes.every(scope => 
      userScopes.includes(scope)
    );
    
    if (!hasRequiredScopes) {
      return <Navigate to="/non-autorise" replace />;
    }
  }
  
  return <>{children}</>;
};

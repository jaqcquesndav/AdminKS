import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredScopes?: string[];
}

export const Auth0ProtectedRoute = ({ 
  children, 
  requiredScopes = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const location = useLocation();
  
  // Afficher un indicateur de chargement amélioré
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Vérifier l'authentification
  if (!isAuthenticated) {
    // Rediriger vers la page de login
    return <Navigate to="/login" replace state={{ from: location }} />;
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

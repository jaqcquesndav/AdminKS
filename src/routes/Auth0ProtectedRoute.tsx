import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';
import { USE_MOCK_AUTH } from '../utils/mockAuth';
import { authService } from '../services/auth/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredScopes?: string[];
}

export const Auth0ProtectedRoute = ({ 
  children, 
  requiredScopes = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const isDemoAuthenticated = authService.isAuthenticated();
  const location = useLocation();  // Si on utilise l'authentification de démo, on vérifie les droits du super admin
  if (USE_MOCK_AUTH) {
    const userInfo = authService.getStoredUser();
    console.log("Auth0ProtectedRoute - Demo auth user:", userInfo);
    
    if (!isDemoAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    
    // Pour la démo, le super admin a accès à tout
    if (userInfo?.role === 'super_admin') {
      console.log("Auth0ProtectedRoute - Super admin access granted");
      return <>{children}</>;
    }
    
    // Les autres utilisateurs de démo n'ont pas accès aux fonctionnalités Auth0-protégées
    return <Navigate to="/non-autorise" replace />;
  }
  
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

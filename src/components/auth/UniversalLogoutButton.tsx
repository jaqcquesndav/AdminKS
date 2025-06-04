import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth/authService';
import { USE_MOCK_AUTH } from '../../utils/mockAuth';

interface LogoutButtonProps {
  className?: string;
}

export const UniversalLogoutButton = ({ className }: LogoutButtonProps) => {
  const { logout: auth0Logout } = useAuth0();
  const { logout: localLogout } = useAuth();
  const isAuth0User = !USE_MOCK_AUTH && authService.isAuth0Authentication();

  const handleLogout = () => {
    // Déconnecter l'utilisateur de notre système interne
    localLogout();
    
    // Si c'est un utilisateur Auth0, également déconnecter de Auth0
    if (isAuth0User) {
      auth0Logout({ 
        logoutParams: {
          returnTo: window.location.origin + '/login'
        }
      });
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={className || "btn btn-danger"}
    >
      Déconnexion
    </button>
  );
};

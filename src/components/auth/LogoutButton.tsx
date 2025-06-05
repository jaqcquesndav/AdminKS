import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button 
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: `${window.location.origin}/login` 
        } 
      })}
      className="btn btn-secondary"
    >
      Déconnexion
    </button>
  );
};

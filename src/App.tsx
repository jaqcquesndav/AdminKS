import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { ToastProvider } from './contexts/ToastContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/authService';
import { USE_MOCK_AUTH, AUTO_LOGIN, mockLogin } from './utils/mockAuth';

function App() {
  const { login } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      // Initialize auth service to handle token in URL and apply initial auth state
      authService.initialize();

      // Restore auth state from localStorage or mock auth
      const user = authService.getStoredUser();
      const token = authService.getToken();
      
      // Only set login state if we have both user and token
      if (user && token) {
        console.log('Initializing with user:', user.name, 'role:', user.role);
        login(user, token);
      } else if (USE_MOCK_AUTH && AUTO_LOGIN) {
        console.log('Auto-login activé avec authentification simulée');
        try {
          // Utiliser mockLogin pour obtenir un utilisateur de démo
          const authResponse = await mockLogin();
          if (authResponse?.user && authResponse?.token) {
            console.log('Auto-login réussi avec utilisateur de démo:', authResponse.user.name);
            login(authResponse.user, authResponse.token);
          }
        } catch (error) {
          console.error('Échec de l\'auto-login:', error);
        }
      } else if (USE_MOCK_AUTH) {
        console.warn('Mock auth is enabled but AUTO_LOGIN is disabled or no valid user/token was found.');
      }
    };

    initAuth();
  }, [login]);

  return (
    <Router>
      <ToastProvider>
        <CurrencyProvider>
          <AppRoutes />
        </CurrencyProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
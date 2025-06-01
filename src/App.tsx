import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react'; // Added useEffect import
import { AppRoutes } from './routes';
import { ToastProvider } from './contexts/ToastContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/auth/authService'; // Corrected import path
import { USE_MOCK_AUTH, AUTO_LOGIN, mockLogin, getCurrentDemoUser } from './utils/mockAuth'; // Added getCurrentDemoUser

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
          // Call mockLogin with the expected credentials object
          const authResponse = await mockLogin({ 
            username: getCurrentDemoUser().email, // Use current demo user's email
            password: 'password' // Mock password, as it's not used by mockLogin logic but is expected
          });

          if (authResponse.token && authResponse.user) {
            // Ensure the user object conforms to AuthUser by adding email and role
            const demoUser = getCurrentDemoUser(); // Get the full demo user object
            login(
              { 
                id: authResponse.user.id, 
                name: authResponse.user.name, 
                email: demoUser.email, // Add email from demoUser
                role: demoUser.role, // Add role from demoUser
                picture: demoUser.picture // Add picture from demoUser
              }, 
              authResponse.token
            );
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
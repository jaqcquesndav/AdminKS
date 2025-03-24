import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastContainer } from './components/common/ToastContainer';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/authService';

function App() {
  const { login } = useAuth();

  useEffect(() => {
    // Initialize auth service to handle token in URL
    authService.initialize();

    // Restore auth state from localStorage
    const user = authService.getStoredUser();
    const token = authService.getToken();
    if (user && token) {
      login(user, token);
    }
  }, [login]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
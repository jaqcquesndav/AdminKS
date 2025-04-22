import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { authService } from '../../services/authService';

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  
  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, rediriger vers le dashboard
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Fonction pour changer de mode d'authentification
  const switchMode = (newMode: AuthMode) => {
    navigate(`/${newMode}`);
  };

  // Gestion de la connexion
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ username: email, password });
      
      // Vérifier si la connexion a réussi
      if (response) {
        console.log('Connexion réussie, redirection vers le dashboard');
        
        // Redirection forcée pour éviter les problèmes avec react-router
        window.location.href = '/dashboard';
        return;
      }
      
      setError('Identifiants incorrects. Veuillez réessayer.');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  // Gestion de l'authentification avec KS Auth
  const handleKsAuth = async () => {
    try {
      // Redirection vers le service KS Auth
      window.location.href = import.meta.env.VITE_KS_AUTH_URL || '/auth/callback';
    } catch (error) {
      console.error('Erreur d\'authentification KS:', error);
      setError('Erreur lors de l\'authentification avec KS Auth.');
    }
  };

  // Gestion de l'inscription
  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    try {
      // Pour l'instant, rediriger vers login puisque register n'est pas implémenté
      // Dans une implémentation réelle, on appellerait une API d'enregistrement
      console.log('Inscription avec les données:', data);
      navigate('/login');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  // Gestion de la réinitialisation du mot de passe
  const handleForgotPassword = async (email: string) => {
    try {
      // Simulation de la réinitialisation du mot de passe
      console.log('Demande de réinitialisation pour:', email);
      // Un message de succès est affiché par le composant ForgotPasswordForm
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      setError('Erreur lors de la réinitialisation. Veuillez réessayer.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Kiota Suit Admin</h1>
          <p className="text-gray-600">
            {mode === 'login' && 'Connectez-vous à votre compte'}
            {mode === 'register' && 'Créez un nouveau compte'}
            {mode === 'forgotPassword' && 'Réinitialisez votre mot de passe'}
          </p>
        </div>
        
        {mode === 'login' && (
          <LoginForm 
            onSubmit={handleLogin}
            onKsAuth={handleKsAuth}
            error={error}
            onSwitchToSignUp={() => switchMode('register')}
            onForgotPassword={() => switchMode('forgotPassword')}
          />
        )}
        
        {mode === 'register' && (
          <SignUpForm 
            onSubmit={handleSignUp}
            error={error}
            onSwitchToLogin={() => switchMode('login')}
          />
        )}
        
        {mode === 'forgotPassword' && (
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword}
            error={error}
            onBack={() => switchMode('login')}
          />
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { authService } from '../../services/authService';

export function SignupPage() {
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      // Utiliser le service d'authentification pour l'inscription
      await authService.login({ 
        username: data.email, // Utilisation de username au lieu de email pour correspondre à LoginCredentials
        password: data.password,
        // Note: Pour une véritable inscription, vous utiliseriez une méthode signup
      });
      
      // Rediriger vers la page de tableau de bord après succès
      navigate('/dashboard');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      console.error(err);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              connectez-vous à votre compte existant
            </a>
          </p>
        </div>
        <SignUpForm 
          onSubmit={handleSubmit} 
          onSwitchToLogin={handleSwitchToLogin}
          error={error}
        />
      </div>
    </div>
  );
}
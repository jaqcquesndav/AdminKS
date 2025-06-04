import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../../services/auth/authService';
import { USE_MOCK_AUTH, isDemoEmail } from '../../utils/mockAuth';

interface UniversalLoginButtonProps {
  className?: string;
  onLoginSuccess?: () => void;
}

export const UniversalLoginButton = ({ className, onLoginSuccess }: UniversalLoginButtonProps) => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isDemoEmail(email)) {
        throw new Error('Email non reconnu pour le mode démo');
      }
      
      // Utiliser le service d'authentification pour la connexion démo
      const result = await authService.login(email, password || 'demo');
      
      if (result && result.token) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError('Échec de connexion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth0Login = () => {
    loginWithRedirect();
  };

  // Si on est en mode démo et que l'email est un email de démo
  const isDemoMode = USE_MOCK_AUTH || (email && isDemoEmail(email));

  return (
    <div className="login-container">
      {isDemoMode ? (
        <form onSubmit={handleDemoLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Mot de passe (optionnel pour la démo)</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button 
            type="submit" 
            className={className || "btn btn-primary w-100"}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter (Démo)'}
          </button>
        </form>
      ) : (
        <button 
          onClick={handleAuth0Login} 
          className={className || "btn btn-primary w-100"}
        >
          Se connecter avec Auth0
        </button>
      )}

      {/* Option pour basculer entre les modes */}
      <div className="mt-3 text-center">
        <button 
          className="btn btn-link"
          onClick={() => setEmail(isDemoMode ? '' : 'super-admin@example.com')}
        >
          {isDemoMode ? 'Utiliser Auth0' : 'Utiliser le mode démo'}
        </button>
      </div>
    </div>
  );
};

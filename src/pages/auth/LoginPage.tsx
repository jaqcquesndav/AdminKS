import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { authenticateUser } from '../../utils/auth';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password);
      if (user) {
        login(user);
        navigate('/', { replace: true });
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.errors.general'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { authService } from '../../services/auth/authService';
import { useToastStore } from '../../components/common/ToastContainer';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const addToast = useToastStore(state => state.addToast);

  const handleSubmit = async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
      addToast('success', 'Email de réinitialisation envoyé');
    } catch {
      setError('Une erreur est survenue lors de l\'envoi de l\'email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          onBack={() => navigate('/login')}
          error={error}
        />
      </div>
    </div>
  );
}
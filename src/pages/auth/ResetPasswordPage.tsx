import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import { authService } from '../../services/auth/authService';
import { useToastStore } from '../../components/common/ToastContainer';

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const addToast = useToastStore(state => state.addToast);

  const handleSubmit = async (data: { password: string; token: string }) => {
    try {
      await authService.resetPassword(data.token, data.password);
      addToast('success', 'Mot de passe réinitialisé avec succès');
      navigate('/login');
    } catch (err) {
      console.error("Password reset failed:", err);
      setError('Une erreur est survenue lors de la réinitialisation du mot de passe');
    }
  };

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <ResetPasswordForm
          onSubmit={handleSubmit}
          token={token}
          error={error}
        />
      </div>
    </div>
  );
}
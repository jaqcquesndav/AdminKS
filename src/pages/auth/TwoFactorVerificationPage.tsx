import { useNavigate } from 'react-router-dom';
import { TwoFactorVerification } from '../../components/auth/TwoFactorVerification';
import { authService } from '../../services/auth/authService';

export function TwoFactorVerificationPage() {
  const navigate = useNavigate();
  
  const handleVerify = async (code: string) => {
    try {
      await authService.verifyTwoFactor(code, 'email'); // Pass code and method as separate arguments
      navigate('/dashboard');
    } catch (error) {
      console.error('Verification failed:', error);
      // La gestion des erreurs est gérée dans le composant
    }
  };
  
  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <TwoFactorVerification 
          onVerify={handleVerify}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Copy, Shield } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { useToastStore } from '../common/ToastContainer';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'qrcode' | 'verify' | 'backupCodes'>('intro');
  const [setupData, setSetupData] = useState<{
    qrCode?: string;
    secret?: string;
    backupCodes?: string[];
  }>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const data = await authService.setupTwoFactor();
      setSetupData(data);
      setStep('qrcode');
    } catch {
      addToast('error', 'Erreur lors de la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await authService.verifyTwoFactor(verificationCode);
      const backupCodes = await authService.generateBackupCodes();
      setSetupData(prev => ({ ...prev, backupCodes }));
      setStep('backupCodes');
    } catch {
      addToast('error', 'Code invalide');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Copié dans le presse-papier');
  };

  return (
    <div className="space-y-6">
      {step === 'intro' && (
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h2 className="text-xl font-bold mb-4">
            Authentification à deux facteurs
          </h2>
          <p className="text-gray-600 mb-6">
            Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Plus tard
            </button>
            <button
              onClick={handleSetup}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Configurer
            </button>
          </div>
        </div>
      )}

      {step === 'qrcode' && setupData.qrCode && (
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">
            Scannez le QR code
          </h3>
          <div className="mb-6">
            <img
              src={setupData.qrCode}
              alt="QR Code"
              className="mx-auto"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <input
              type="text"
              value={setupData.secret}
              readOnly
              className="px-3 py-2 border rounded-md"
            />
            <button
              onClick={() => copyToClipboard(setupData.secret!)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setStep('verify')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Continuer
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Vérification
          </h3>
          <p className="text-gray-600">
            Entrez le code généré par votre application d'authentification
          </p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="000000"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Vérifier
            </button>
          </div>
        </div>
      )}

      {step === 'backupCodes' && setupData.backupCodes && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Codes de secours
          </h3>
          <p className="text-gray-600">
            Conservez ces codes dans un endroit sûr. Ils vous permettront de vous connecter si vous perdez l'accès à votre application d'authentification.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {setupData.backupCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <code className="font-mono">{code}</code>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Terminer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
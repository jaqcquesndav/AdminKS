import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Button } from '../common/Button';

interface TwoFactorVerificationFormProps {
  method: 'email' | 'sms';
  contact: string;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function TwoFactorVerificationForm({
  method,
  contact,
  onVerify,
  onCancel
}: TwoFactorVerificationFormProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      await onVerify(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code invalide');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">
          {t('auth.2fa.verify.title')}
        </h2>
        <p className="text-gray-600 mt-2">
          {t('auth.2fa.verify.description')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.2fa.verify.code')}
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="123456"
            maxLength={6}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {t('auth.2fa.verify.codeSent', {
              method: method === 'email' ? 'e-mail' : 'SMS',
              contact: contact
            })}
          </p>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {t('auth.2fa.verify.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
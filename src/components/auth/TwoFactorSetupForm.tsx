import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone } from 'lucide-react';
import { Button } from '../common/Button';

interface TwoFactorSetupFormProps {
  onSubmit: (method: 'email' | 'sms', contact: string) => Promise<void>;
  onVerify: (code: string) => Promise<void>;
  onSkip: () => void;
}

export function TwoFactorSetupForm({ onSubmit, onVerify, onSkip }: TwoFactorSetupFormProps) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'method' | 'verify'>('method');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      if (step === 'method') {
        await onSubmit(method, contact);
        setStep('verify');
      } else {
        await onVerify(code);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {t('auth.2fa.setup.title')}
        </h2>
        <p className="text-gray-600 mt-2">
          {t('auth.2fa.setup.description')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 'method' ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.2fa.setup.method')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg ${
                      method === 'email'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Mail className="w-6 h-6 mr-2" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('sms')}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg ${
                      method === 'sms'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {method === 'email' ? t('auth.2fa.setup.email') : t('auth.2fa.setup.phone')}
                </label>
                <div className="relative">
                  {method === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  )}
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    placeholder={method === 'email' ? 'exemple@entreprise.com' : '+243 999 999 999'}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={onSkip}
              >
                {t('auth.2fa.setup.skip')}
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                {t('auth.2fa.setup.continue')}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
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
                  contact
                })}
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
              >
                {t('common.back')}
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                {t('auth.2fa.verify.submit')}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
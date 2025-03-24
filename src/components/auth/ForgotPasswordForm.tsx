import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  error?: string;
}

export function ForgotPasswordForm({ onSubmit, onBack, error }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email);
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Email envoyé</h2>
        <p className="text-gray-600 mb-6">
          Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
        </p>
        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={onBack}
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        Mot de passe oublié
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Entrez votre adresse e-mail pour réinitialiser votre mot de passe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse e-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="exemple@entreprise.com"
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            icon={ArrowLeft}
          >
            Retour à la connexion
          </Button>
        </div>
      </form>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useToastStore } from '../common/ToastContainer';

interface TwoFactorVerificationProps {
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function TwoFactorVerification({ onVerify, onCancel }: TwoFactorVerificationProps) {
  const [pins, setPins] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addToast = useToastStore(state => state.addToast);

  // Pour la démo, simuler l'envoi du code par email
  useEffect(() => {
    const demoCode = '123456';
    addToast('info', `Code de démonstration : ${demoCode}`);
  }, [addToast]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    // Déplacer le focus vers le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pins[index] && index > 0) {
      const newPins = [...pins];
      newPins[index - 1] = '';
      setPins(newPins);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newPins = [...pins];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newPins[i] = char;
    });
    setPins(newPins);

    // Focus sur le dernier champ rempli ou le suivant
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = pins.join('');
    if (code.length !== 6) {
      addToast('error', 'Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(code);
    } catch (error) {
      addToast('error', 'Code invalide');
      // Réinitialiser les champs en cas d'erreur
      setPins(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          Vérification en deux étapes
        </h2>
        <p className="text-gray-600">
          Entrez le code à 6 chiffres envoyé à votre adresse email
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center space-x-3">
          {pins.map((pin, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              value={pin}
              onChange={e => handlePinChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       transition-all duration-200"
              maxLength={1}
              required
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={isLoading || pins.some(p => !p)}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg 
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
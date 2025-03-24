import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PinInputProps {
  length?: number;
  onChange: (pin: string) => void;
  error?: string;
}

export function PinInput({ length = 4, onChange, error }: PinInputProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange(values.join(''));
  }, [values, onChange]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d*$/.test(paste)) return;

    const newValues = [...values];
    paste.split('').forEach((char, i) => {
      if (i < length) newValues[i] = char;
    });
    setValues(newValues);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('payment.pin.label')}
      </label>
      <div className="flex justify-center space-x-2">
        {values.map((value, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="password"
            value={value}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            maxLength={1}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
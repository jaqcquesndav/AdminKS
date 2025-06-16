import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h3 className="font-medium">{t('chat.title', 'Support')}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500"
        aria-label={t('chat.closeChat', 'Fermer le chat')}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
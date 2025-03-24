import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h3 className="font-medium">Support</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500"
        aria-label="Fermer le chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
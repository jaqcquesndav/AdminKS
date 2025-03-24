import React from 'react';
import { X } from 'lucide-react';
import { overlayClasses, modalClasses, headerClasses, contentClasses } from './styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={overlayClasses}>
      <div className="fixed inset-0" onClick={onClose} />
      <div className={modalClasses}>
        <div className={headerClasses}>
          <h3 className="text-lg font-medium truncate">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={contentClasses}>
          {children}
        </div>
      </div>
    </div>
  );
}
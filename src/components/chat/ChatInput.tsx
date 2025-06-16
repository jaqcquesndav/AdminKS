import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileSelect: (file: File) => void;
}

export function ChatInput({ onSend, onFileSelect }: ChatInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t('chat.messagePlaceholder')}
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary dark:focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={2}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="chat-file"
            accept="image/*,.pdf,.doc,.docx"
          />          <label
            htmlFor="chat-file"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
            aria-label={t('chat.attachFile', 'Joindre un fichier')}
          >
            <Paperclip className="w-5 h-5" />
          </label>
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-primary hover:bg-primary-light text-white rounded-lg disabled:opacity-50"
            aria-label={t('chat.sendMessage', 'Envoyer un message')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
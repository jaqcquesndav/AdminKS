import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export function ChatButton() {
  const { toggleChat } = useChat();

  return (
    <button
      onClick={toggleChat}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      aria-label="Toggle chat"
    >
      <MessageSquare className="w-5 h-5" />
    </button>
  );
}
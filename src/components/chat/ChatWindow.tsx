import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { isChatOpen, closeChat } = useChat();
  const { messages, isTyping, sendMessage, sendAttachment } = useChatMessages();

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50">
      <ChatHeader onClose={closeChat} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSend={sendMessage} onFileSelect={sendAttachment} />
    </div>
  );
}
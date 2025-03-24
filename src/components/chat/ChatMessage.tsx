import React from 'react';
import { format } from 'date-fns';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  const containerClasses = [
    'flex',
    isUser ? 'justify-end' : 'justify-start',
    'mb-4'
  ].join(' ');

  const messageClasses = [
    'max-w-[70%]',
    isUser ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700',
    'rounded-lg',
    'px-4',
    'py-2'
  ].join(' ');

  const timeClasses = [
    'text-xs',
    'mt-1',
    isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
  ].join(' ');

  return (
    <div className={containerClasses}>
      <div className={messageClasses}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={timeClasses}>
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
}
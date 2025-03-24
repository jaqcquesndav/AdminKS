```tsx
import React from 'react';
import { format } from 'date-fns';
import type { ChatMessage } from '../../types/chat';

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg px-4 py-2`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
}
```
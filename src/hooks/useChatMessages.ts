import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/chat';

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response
    setIsTyping(true);
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. Our team will get back to you soon.',
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const sendAttachment = useCallback(async (file: File) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content: '',
      sender: 'user',
      timestamp: new Date(),
      attachments: [{
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name
      }]
    };
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    sendAttachment
  };
}
import { useState, useCallback, useRef, useEffect } from 'react';
import { chatApi } from '../services/api/chat';
import { useToastStore } from '../components/common/ToastContainer';
import type { ChatMessage, ChatAttachment } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const addToast = useToastStore(state => state.addToast);
  const wsRef = useRef<ReturnType<typeof chatApi.connectToWebSocket> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const loadMessages = useCallback(async (before?: Date) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await chatApi.getMessages({ before });
      setMessages(prev => [...prev, ...data]);
      setHasMore(data.length === 20); // Assuming page size of 20
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError(error instanceof Error ? error : new Error('Failed to load messages'));
      addToast('error', 'Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addToast]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      const message = await chatApi.sendMessage(content);
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      addToast('error', 'Erreur lors de l\'envoi du message');
      throw error;
    }
  }, [addToast]);

  const sendAttachment = useCallback(async (file: File): Promise<void> => {
    try {
      const attachment = await chatApi.uploadAttachment(file);
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: '',
        sender: 'user',
        timestamp: new Date(),
        read: false,
        attachments: [attachment]
      };
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Failed to upload attachment:', error);
      addToast('error', 'Erreur lors de l\'envoi du fichier');
      throw error;
    }
  }, [addToast]);

  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    chatApi.startTyping();
    typingTimeoutRef.current = setTimeout(() => {
      chatApi.stopTyping();
    }, 3000);
  }, []);

  useEffect(() => {
    // Connect to WebSocket
    wsRef.current = chatApi.connectToWebSocket({
      onMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onTyping: (isTyping) => {
        setIsTyping(isTyping);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        addToast('error', 'Erreur de connexion au chat');
      }
    });

    // Load initial messages
    loadMessages();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [loadMessages, addToast]);

  return {
    messages,
    isTyping,
    isLoading,
    hasMore,
    error,
    sendMessage,
    sendAttachment,
    loadMore: loadMessages,
    handleTyping
  };
}
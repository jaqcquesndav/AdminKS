import { useState, useCallback, useRef, useEffect } from 'react';
import { chatApi } from '../services/chat/chatApiService';
import { useToastStore } from '../components/common/ToastContainer';
import type { ChatMessage, ChatTypingEvent } from '../types/chat';

export function useChat(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const addToast = useToastStore(state => state.addToast);
  const wsRef = useRef<ReturnType<typeof chatApi.subscribeToChat> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId);

  useEffect(() => {
    setCurrentSessionId(sessionId);
  }, [sessionId]);

  const loadMessages = useCallback(async (beforeMessageId?: string) => {
    if (isLoading || !currentSessionId) return;
    setIsLoading(true);
    try {
      const response = await chatApi.getMessages(currentSessionId, { before: beforeMessageId, limit: 20 });
      setMessages(prev => (beforeMessageId ? [...response.messages, ...prev] : [...prev, ...response.messages]));
      setHasMore(response.hasMore);
    } catch (err) {
      console.error('Failed to load messages:', err);
      const loadError = err instanceof Error ? err : new Error('Failed to load messages');
      setError(loadError);
      addToast('error', loadError.message || 'Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addToast, currentSessionId]);

  const sendMessageInternal = useCallback(async (content: string, attachments?: File[]) => {
    if (!currentSessionId) {
      addToast('error', 'Aucune session de chat active.');
      throw new Error('Aucune session de chat active.');
    }
    try {
      const message = await chatApi.sendMessage(currentSessionId, { content, attachments });
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      console.error('Failed to send message:', err);
      const sendError = err instanceof Error ? err : new Error('Failed to send message');
      addToast('error', sendError.message || 'Erreur lors de l\'envoi du message');
      throw sendError;
    }
  }, [addToast, currentSessionId]);

  const sendAttachment = useCallback(async (file: File, content: string = '') => {
    return sendMessageInternal(content, [file]);
  }, [sendMessageInternal]);


  const handleTypingEvent = useCallback((isCurrentlyTyping: boolean) => {
    if (!currentSessionId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    chatApi.sendTypingEvent(currentSessionId, isCurrentlyTyping);

    if (isCurrentlyTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        if (currentSessionId) {
          chatApi.sendTypingEvent(currentSessionId, false);
        }
      }, 3000);
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (!currentSessionId) {
      if (wsRef.current) {
        wsRef.current.unsubscribe();
        wsRef.current = null;
      }
      setMessages([]); // Clear messages if no session ID
      setIsTyping(false);
      setHasMore(true); // Reset pagination
      setError(null);
      return;
    }

    wsRef.current = chatApi.subscribeToChat(currentSessionId, {
      onMessage: (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      },
      onTyping: (event: ChatTypingEvent) => {
        setIsTyping(event.isTyping);
      },
    });

    loadMessages(); // Load initial messages for the new session

    return () => {
      if (wsRef.current) {
        wsRef.current.unsubscribe();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentSessionId, loadMessages, addToast]);

  return {
    messages,
    isTyping,
    isLoading,
    hasMore,
    error,
    sendMessage: sendMessageInternal, // Expose the internal sendMessage
    sendAttachment,
    loadMoreMessages: () => {
      if (messages.length > 0 && hasMore && !isLoading) {
        loadMessages(messages[0].id); // Pass ID of the oldest message to fetch earlier ones
      }
    },
    sendTypingEvent: handleTypingEvent // Renamed for clarity
  };
}
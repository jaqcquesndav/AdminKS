import api from './client';
import { cloudinaryService } from '../cloudinary';
import type { ChatMessage, ChatAttachment } from '../../types/chat';

export const chatApi = {
  getMessages: async (params?: { 
    page?: number; 
    limit?: number;
    before?: Date;
  }): Promise<ChatMessage[]> => {
    const response = await api.get('/chat/messages', { params });
    return response.data;
  },

  sendMessage: async (content: string): Promise<ChatMessage> => {
    const response = await api.post('/chat/messages', { content });
    return response.data;
  },

  uploadAttachment: async (file: File): Promise<ChatAttachment> => {
    // Upload to Cloudinary first
    const cloudinaryResponse = await cloudinaryService.upload(file, 'chat');

    // Then send attachment metadata to our API
    const response = await api.post('/chat/attachments', {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      type: file.type,
      name: file.name
    });
    
    return response.data;
  },

  markAsRead: async (messageIds: string[]): Promise<void> => {
    await api.post('/chat/messages/read', { messageIds });
  },

  startTyping: async (): Promise<void> => {
    await api.post('/chat/typing/start');
  },

  stopTyping: async (): Promise<void> => {
    await api.post('/chat/typing/stop');
  },

  connectToWebSocket: (callbacks: {
    onMessage: (message: ChatMessage) => void;
    onTyping: (isTyping: boolean) => void;
    onError: (error: Error) => void;
  }) => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/chat`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'message':
          callbacks.onMessage(data.message);
          break;
        case 'typing':
          callbacks.onTyping(data.isTyping);
          break;
        case 'error':
          callbacks.onError(new Error(data.message));
          break;
      }
    };

    return {
      disconnect: () => ws.close(),
      send: (message: any) => ws.send(JSON.stringify(message))
    };
  }
};
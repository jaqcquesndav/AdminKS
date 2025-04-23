import apiClient from './client';
import type { ChatMessage, ChatSession, ChatAttachment, ChatTypingEvent } from '../../types/chat';

interface ChatSessionListResponse {
  sessions: ChatSession[];
  totalCount: number;
}

interface ChatMessageListResponse {
  messages: ChatMessage[];
  totalCount: number;
  hasMore: boolean;
}

export const chatApi = {
  // Obtenir toutes les sessions de chat
  getSessions: async (params?: {
    status?: 'active' | 'closed';
    page?: number;
    limit?: number;
  }): Promise<ChatSessionListResponse> => {
    const response = await apiClient.get('/chat/sessions', { params });
    return response.data;
  },

  // Obtenir une session de chat par son ID
  getSessionById: async (sessionId: string): Promise<ChatSession> => {
    const response = await apiClient.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  // Créer une nouvelle session de chat
  createSession: async (data: {
    subject?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
  }): Promise<ChatSession> => {
    const response = await apiClient.post('/chat/sessions', data);
    return response.data;
  },

  // Fermer une session de chat
  closeSession: async (sessionId: string): Promise<ChatSession> => {
    const response = await apiClient.put(`/chat/sessions/${sessionId}/close`);
    return response.data;
  },

  // Attribuer un agent à une session de chat
  assignAgent: async (sessionId: string, agentId: string): Promise<ChatSession> => {
    const response = await apiClient.put(`/chat/sessions/${sessionId}/assign`, { agentId });
    return response.data;
  },

  // Obtenir les messages d'une session de chat
  getMessages: async (sessionId: string, params?: {
    before?: string; // ID du message pour pagination
    limit?: number;
  }): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`, { params });
    return response.data;
  },

  // Envoyer un message dans une session de chat
  sendMessage: async (sessionId: string, data: {
    content: string;
    attachments?: File[];
  }): Promise<ChatMessage> => {
    if (!data.attachments || data.attachments.length === 0) {
      // Envoi sans pièces jointes
      const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
        content: data.content
      });
      return response.data;
    } else {
      // Envoi avec pièces jointes
      const formData = new FormData();
      formData.append('content', data.content);
      
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    }
  },

  // Télécharger une pièce jointe
  downloadAttachment: async (attachmentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/chat/attachments/${attachmentId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Marquer les messages comme lus
  markAsRead: async (sessionId: string, messageIds: string[]): Promise<void> => {
    await apiClient.put(`/chat/sessions/${sessionId}/read`, { messageIds });
  },

  // Envoyer un événement de frappe
  sendTypingEvent: async (sessionId: string, isTyping: boolean): Promise<void> => {
    await apiClient.post(`/chat/sessions/${sessionId}/typing`, { isTyping });
  },

  // Obtenir les statistiques du chat
  getChatStats: async (): Promise<{
    totalSessions: number;
    activeSessions: number;
    averageResponseTime: number;
    messagesExchanged: number;
  }> => {
    const response = await apiClient.get('/chat/stats');
    return response.data;
  },
  
  // S'abonner aux mises à jour du chat en temps réel
  subscribeToChat: (sessionId: string, callbacks: {
    onMessage?: (message: ChatMessage) => void;
    onTyping?: (event: ChatTypingEvent) => void;
    onSessionUpdate?: (session: ChatSession) => void;
  }) => {
    // Cette fonction sera implémentée avec WebSockets
    console.log(`WebSocket subscription would be initialized for session ${sessionId}`);
    return {
      unsubscribe: () => {
        console.log(`WebSocket connection for session ${sessionId} would be closed`);
      }
    };
  }
};

export default chatApi;
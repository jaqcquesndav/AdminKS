export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
  read: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'; // Added status property
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  url: string;
  type: string;
  name: string;
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: unknown; // Changed from any to unknown
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: 'active' | 'closed';
  startedAt: Date;
  endedAt?: Date;
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface ChatTypingEvent {
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}
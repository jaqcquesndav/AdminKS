export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
  read: boolean;
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
    [key: string]: any;
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
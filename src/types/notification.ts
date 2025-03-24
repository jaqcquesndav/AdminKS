export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'security'
  | 'payment'
  | 'subscription'
  | 'document';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  metadata?: {
    link?: string;
    documentId?: string;
    paymentId?: string;
    subscriptionId?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    security: boolean;
    payments: boolean;
    documents: boolean;
    system: boolean;
  };
}
export type ActivityType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'error';

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  applicationId: string;
  applicationName: string;
  type: ActivityType;
  action: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  applicationId: string;
  applicationName: string;
  ipAddress: string;
  userAgent: string;
  startedAt: Date;
  lastActivityAt: Date;
  status: 'active' | 'expired';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  applicationId: string;
  applicationName: string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
}
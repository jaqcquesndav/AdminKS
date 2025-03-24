export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date;
  permissions: ApplicationPermission[];
  tokenLimit: {
    monthly: number;
    used: number;
    remaining: number;
  };
  tokenUsage: TokenUsage[];
  kyc: {
    idCard?: {
      type: 'nationalId' | 'passport';
      number: string;
      expiryDate: Date;
      fileUrl: string;
      verified: boolean;
    };
    signature?: {
      fileUrl: string;
      timestamp: Date;
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    twoFactorAuth: {
      enabled: boolean;
      method: 'email' | 'sms' | null;
      contact?: string;
    };
  };
}
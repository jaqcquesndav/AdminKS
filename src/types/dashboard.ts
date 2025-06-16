// Dashboard statistics type definition
export interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  revenueCurrentMonth?: number;
  tokenUsage?: {
    total?: number;
  };
  // Add other fields as needed
}

// import for production use
// import { useAdminApi } from '../api/adminApiService';
import type { TokenUsage } from '../../types/subscription';

export interface UserTokenStats {
  monthlyLimit: number;
  used: number;
  remaining: number;
  usageHistory: TokenUsage[];
}

export const useUserTokenService = () => {
  // commented out for now as we're using mock data
  // const adminApi = useAdminApi();

  const getUserTokenStats = async (userId: string): Promise<UserTokenStats> => {
    try {
      // This would be the actual API call in production
      // const response = await adminApi.getUserTokenStats(userId);
      // return response.data;
      
      // For now, we'll return mock data
      // In production, replace this with the actual API call
      return getMockTokenStats(userId);
    } catch (error) {
      console.error('Error fetching user token stats:', error);
      throw new Error('Failed to fetch token usage statistics');
    }
  };

  return {
    getUserTokenStats
  };
};

// Helper function to generate mock token stats for development
function getMockTokenStats(userId: string): UserTokenStats {
  const monthlyLimit = 500000;
  const used = Math.floor(Math.random() * 400000);
  const remaining = monthlyLimit - used;
  
  const usageHistory: TokenUsage[] = Array.from({ length: 5 }, (_, i) => ({
    id: `usage-${userId}-${i}`,
    customerId: `customer-${userId}`,
    userId,
    appType: 'accounting_web',
    tokensUsed: Math.floor(Math.random() * 10000) + 1000,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    feature: ['text_generation', 'text_summarization', 'data_analysis'][Math.floor(Math.random() * 3)],
    prompt: 'Sample prompt text...',
    responseTokens: Math.floor(Math.random() * 5000) + 500,
    requestTokens: Math.floor(Math.random() * 500) + 50,
    cost: Math.random() * 0.5,
  }));
  
  return {
    monthlyLimit,
    used,
    remaining,
    usageHistory
  };
}

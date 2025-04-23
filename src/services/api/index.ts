export { default as apiClient, handleApiError } from './client';
export { API_BASE_URL, API_ENDPOINTS, replaceUrlParams } from './config';

// Export des services API
export { authApi } from './auth';
export { usersApi } from './users';
export { customersApi } from './customers';
export { financeApi } from './finance';
export { dashboardApi } from './dashboard';
export { notificationsApi } from './notifications';
export { documentsApi } from './documents';
export { subscriptionApi } from './subscription';
export { tokensApi } from './tokens';
export { settingsApi } from './settings';
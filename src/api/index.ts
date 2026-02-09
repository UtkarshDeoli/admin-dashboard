/**
 * API Index
 * Export all API modules from a single location
 */

// Re-export central API utilities
export * from "@/lib/api";

// Export API modules
export * as authApi from "./auth.api";
export * as usersApi from "./users.api";
export * as dashboardApi from "./dashboard.api";
export * as settingsApi from "./settings.api";

// Export individual functions for convenience
export { login, signup, logout, requestPasswordReset, confirmPasswordReset, refreshToken } from "./auth.api";
export { 
  getUsers, 
  getUserById, 
  getCurrentUser, 
  createUser, 
  updateUser, 
  updateCurrentUser, 
  deleteUser, 
  changePassword 
} from "./users.api";
export { 
  getDashboardStats, 
  getRevenueChart, 
  getRecentActivity, 
  getDashboardData 
} from "./dashboard.api";
export { 
  getSettings, 
  updateGeneralSettings, 
  updateNotificationSettings, 
  updateSecuritySettings, 
  updateAppearanceSettings 
} from "./settings.api";

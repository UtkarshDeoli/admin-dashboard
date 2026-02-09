/**
 * Settings API
 * Contains all API calls related to application settings
 */

import { get, put, ApiResponse } from "@/lib/api";

// Types
export interface AppSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    orderNotifications: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  appearance: {
    theme: "light" | "dark" | "system";
    primaryColor: string;
    sidebarCollapsed: boolean;
  };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderNotifications: boolean;
  marketingEmails: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
}

/**
 * Get all application settings
 */
export async function getSettings(): Promise<ApiResponse<AppSettings>> {
  return get<AppSettings>("/settings");
}

/**
 * Update general settings
 */
export async function updateGeneralSettings(
  settings: Partial<AppSettings["general"]>
): Promise<ApiResponse<AppSettings["general"]>> {
  return put<AppSettings["general"]>("/settings/general", settings);
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<ApiResponse<NotificationSettings>> {
  return put<NotificationSettings>("/settings/notifications", settings);
}

/**
 * Update security settings
 */
export async function updateSecuritySettings(
  settings: Partial<SecuritySettings>
): Promise<ApiResponse<SecuritySettings>> {
  return put<SecuritySettings>("/settings/security", settings);
}

/**
 * Update appearance settings
 */
export async function updateAppearanceSettings(
  settings: Partial<AppSettings["appearance"]>
): Promise<ApiResponse<AppSettings["appearance"]>> {
  return put<AppSettings["appearance"]>("/settings/appearance", settings);
}

export default {
  getSettings,
  updateGeneralSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateAppearanceSettings,
};

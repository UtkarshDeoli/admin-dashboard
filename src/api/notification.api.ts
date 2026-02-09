/**
 * Notification API
 * Contains all API calls related to sending push notifications using Firebase FCM
 */

import { getPocketBase } from "@/lib/pocketbase";

// Notification payload interface
export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Send notification to FCM tokens via server-side API
 */
export async function sendNotification(
  tokens: string[],
  payload: NotificationPayload
): Promise<{ success: boolean; sent: number; failed: number; error?: string }> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokens,
        title: payload.title,
        body: payload.body,
        data: payload.data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, sent: 0, failed: tokens.length, error: result.error };
    }

    return { success: result.success, sent: result.sent, failed: result.failed };
  } catch (error) {
    console.error("Send notification error:", error);
    return { success: false, sent: 0, failed: tokens.length, error: "Failed to send notifications" };
  }
}

/**
 * Get FCM tokens for selected businesses
 */
export function getSelectedBusinessTokens(
  businesses: { fcm: string }[]
): string[] {
  return businesses
    .filter(b => b.fcm && typeof b.fcm === 'string' && b.fcm.length > 0)
    .map(b => b.fcm);
}

/**
 * Get FCM tokens for selected users
 */
export function getSelectedUserTokens(
  users: { fcm: string }[]
): string[] {
  return users
    .filter(u => u.fcm && typeof u.fcm === 'string' && u.fcm.length > 0)
    .map(u => u.fcm);
}

/**
 * Authentication API
 * Contains all API calls related to authentication using PocketBase
 */

import { getPocketBase, setAuthStore, PocketBaseUser, SUPERUSERS_COLLECTION } from "@/lib/pocketbase";
import PocketBase from "pocketbase";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    avatar?: string;
  };
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

// Helper to convert PocketBase user to AuthResponse format
function toAuthResponse(pb: PocketBase, record: PocketBaseUser): AuthResponse {
  return {
    user: {
      id: record.id,
      email: record.email,
      name: record.name,
      avatar: record.avatar,
      role: (record as unknown as { role?: string })?.role,
    },
    token: pb.authStore.token,
  };
}

/**
 * Login with email and password using _superusers collection
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const pb = getPocketBase();
    const authData = await pb.collection(SUPERUSERS_COLLECTION).authWithPassword(email, password);

    // Save auth to localStorage
    setAuthStore({
      token: pb.authStore.token,
      model: authData.record as unknown as PocketBaseUser,
    });

    return {
      success: true,
      data: toAuthResponse(pb, authData.record as unknown as PocketBaseUser),
    };
  } catch (error: unknown) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      const pbError = error as { data?: { message?: string } };
      if (pbError.data?.message) {
        return { success: false, error: pbError.data.message };
      }
    }

    return { success: false, error: "Invalid email or password" };
  }
}

/**
 * Signup - Not available for superusers (admin only)
 * Superusers must be created directly in PocketBase dashboard
 */
export async function signup(
  _name: string,
  _email: string,
  _password: string
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  return { success: false, error: "Superuser accounts cannot be created through this interface. Please create them in the PocketBase dashboard." };
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  const pb = getPocketBase();
  pb.authStore.clear();
  setAuthStore(null);
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const pb = getPocketBase();
    await pb.collection(SUPERUSERS_COLLECTION).requestPasswordReset(email);
    return { success: true };
  } catch (error: unknown) {
    console.error("Password reset error:", error);

    if (error instanceof Error) {
      const pbError = error as { data?: { message?: string } };
      if (pbError.data?.message) {
        return { success: false, error: pbError.data.message };
      }
    }

    return { success: false, error: "Failed to request password reset" };
  }
}

/**
 * Confirm password reset with token
 * Note: PocketBase handles password reset via email confirmation
 */
export async function confirmPasswordReset(
  _token: string,
  _password: string
): Promise<{ success: boolean; error?: string }> {
  // PocketBase doesn't use tokens for password reset confirmation
  // The password reset is done through the email confirmation flow
  return { success: false, error: "Use the password reset link sent to your email" };
}

/**
 * Refresh authentication token
 * Note: PocketBase handles token refresh automatically via authStore
 */
export async function refreshToken(): Promise<{ success: boolean; token?: string; error?: string }> {
  const pb = getPocketBase();

  if (!pb.authStore.isValid) {
    return { success: false, error: "Session expired" };
  }

  return {
    success: true,
    token: pb.authStore.token,
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const pb = getPocketBase();

    if (!pb.authStore.isValid || !pb.authStore.model) {
      return { success: false, error: "Not authenticated" };
    }

    return {
      success: true,
      data: toAuthResponse(pb, pb.authStore.model as unknown as PocketBaseUser),
    };
  } catch (error: unknown) {
    console.error("Get current user error:", error);
    return { success: false, error: "Failed to get current user" };
  }
}

export default {
  login,
  signup,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  refreshToken,
  getCurrentUser,
};

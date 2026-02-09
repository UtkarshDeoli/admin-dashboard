/**
 * Authentication API
 * Contains all API calls related to authentication
 */

import { post, ApiResponse, setAuthToken, clearAuthToken } from "@/lib/api";

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

/**
 * Login with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await post<AuthResponse>("/auth/login", { email, password }, { requiresAuth: false });
  
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Signup with name, email, and password
 */
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await post<AuthResponse>(
    "/auth/signup",
    { name, email, password },
    { requiresAuth: false }
  );
  
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint if needed
    // await post("/auth/logout");
  } finally {
    clearAuthToken();
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  email: string
): Promise<ApiResponse<{ message: string }>> {
  return post<{ message: string }>(
    "/auth/password-reset",
    { email },
    { requiresAuth: false }
  );
}

/**
 * Confirm password reset with token
 */
export async function confirmPasswordReset(
  token: string,
  password: string
): Promise<ApiResponse<{ message: string }>> {
  return post<{ message: string }>(
    "/auth/password-reset/confirm",
    { token, password },
    { requiresAuth: false }
  );
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  const response = await post<{ token: string }>("/auth/refresh-token", {});
  
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  
  return response;
}

export default {
  login,
  signup,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  refreshToken,
};

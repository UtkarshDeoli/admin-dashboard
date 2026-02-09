/**
 * Central API utility for making HTTP requests
 * This file contains the base fetch function and common API utilities
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Common headers for API requests
const getDefaultHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
});

// Get authorization header with token
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("t_pannel_token") : null;
  return {
    ...getDefaultHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Response type for API calls
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Request options type
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | unknown;
  headers?: HeadersInit;
  requiresAuth?: boolean;
  cache?: RequestCache;
}

/**
 * Base fetch function with error handling
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options
 * @returns ApiResponse with data, error, and status
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
    cache = "no-store",
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders = requiresAuth ? getAuthHeaders() : getDefaultHeaders();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...requestHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    // Handle response
    const status = response.status;

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      // Handle 401 Unauthorized - redirect to login
      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("t_pannel_token");
        localStorage.removeItem("t_pannel_user");
        window.location.href = "/auth/signin";
      }

      return {
        data: null,
        error: errorMessage,
        status,
      };
    }

    // Parse successful response
    let data: T | null = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    return {
      data,
      error: null,
      status,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * GET request helper
 */
export async function get<T>(
  endpoint: string,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  body: Record<string, unknown> | unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * PUT request helper
 */
export async function put<T>(
  endpoint: string,
  body: Record<string, unknown> | unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, { ...options, method: "PUT", body });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  endpoint: string,
  body: Record<string, unknown> | unknown,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, { ...options, method: "PATCH", body });
}

/**
 * DELETE request helper
 */
export async function del<T>(
  endpoint: string,
  options: Omit<RequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("t_pannel_token", token);
  }
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("t_pannel_token");
  }
  return null;
}

/**
 * Clear auth token from localStorage
 */
export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("t_pannel_token");
    localStorage.removeItem("t_pannel_user");
  }
}

// Export default object with all methods
export default {
  fetch: fetchApi,
  get,
  post,
  put,
  patch,
  delete: del,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
};

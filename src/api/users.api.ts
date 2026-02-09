/**
 * Users API
 * Contains all API calls related to user management
 */

import { get, post, put, del, ApiResponse } from "@/lib/api";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

/**
 * Get all users with pagination
 */
export async function getUsers(
  params: UserQueryParams = {}
): Promise<ApiResponse<UserListResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.role) queryParams.append("role", params.role);
  
  const queryString = queryParams.toString();
  const endpoint = `/users${queryString ? `?${queryString}` : ""}`;
  
  return get<UserListResponse>(endpoint);
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return get<User>(`/users/${id}`);
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return get<User>("/users/me");
}

/**
 * Create a new user
 */
export async function createUser(
  data: UserCreateRequest
): Promise<ApiResponse<User>> {
  return post<User>("/users", data);
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  data: UserUpdateRequest
): Promise<ApiResponse<User>> {
  return put<User>(`/users/${id}`, data);
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(
  data: UserUpdateRequest
): Promise<ApiResponse<User>> {
  return put<User>("/users/me", data);
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/users/${id}`);
}

/**
 * Change user password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> {
  return post<{ message: string }>("/users/me/password", {
    currentPassword,
    newPassword,
  });
}

export default {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  changePassword,
};

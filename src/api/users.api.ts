/**
 * Users API
 * Contains all API calls related to Users using PocketBase
 */

import { getPocketBase } from "@/lib/pocketbase";
import PocketBase from "pocketbase";

// User types based on PocketBase schema
export interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  profile_picture: string;
  Name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  fcm: string;
  created: string;
  updated: string;
}

export interface UserListResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: User[];
}

/**
 * Get paginated list of users
 */
export async function getUsers(
  page: number = 1,
  perPage: number = 50,
  filter?: string
): Promise<{ success: boolean; data?: UserListResponse; error?: string }> {
  try {
    const pb = getPocketBase();
    const result = await pb.collection("User").getList<User>(page, perPage, {
      filter: filter || "",
    });

    return {
      success: true,
      data: {
        page: result.page,
        perPage: result.perPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        items: result.items as unknown as User[],
      },
    };
  } catch (error: unknown) {
    // Ignore cancelled requests (PocketBase auto-cancellation)
    const pbError = error as { status?: number; message?: string };
    if (pbError.status === 0 || pbError.message?.includes('aborted')) {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get users error:", error);
    if (error instanceof Error) {
      const err = error as { data?: { message?: string } };
      if (err.data?.message) {
        return { success: false, error: err.data.message };
      }
    }
    return { success: false, error: "Failed to fetch users" };
  }
}

/**
 * Get all users
 */
export async function getAllUsers(
  sort?: string
): Promise<{ success: boolean; data?: User[]; error?: string }> {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("User").getFullList<User>({
      sort: sort || "-created",
    });

    return { success: true, data: records as unknown as User[] };
  } catch (error: unknown) {
    // Ignore cancelled requests (PocketBase auto-cancellation)
    const pbError = error as { status?: number; message?: string };
    if (pbError.status === 0 || pbError.message?.includes('aborted')) {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get all users error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(
  id: string
): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    const pb = getPocketBase();
    const record = await pb.collection("User").getOne<User>(id);

    return { success: true, data: record as unknown as User };
  } catch (error: unknown) {
    // Ignore cancelled requests
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get user by ID error:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

/**
 * Search users
 */
export async function searchUsers(
  query: string
): Promise<{ success: boolean; data?: User[]; error?: string }> {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("User").getFullList<User>({
      filter: `Name ~ "${query}" || email ~ "${query}" || phone ~ "${query}"`,
    });

    return { success: true, data: records as unknown as User[] };
  } catch (error: unknown) {
    // Ignore cancelled requests
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Search users error:", error);
    return { success: false, error: "Failed to search users" };
  }
}

export default {
  getUsers,
  getAllUsers,
  getUserById,
  searchUsers,
};

import PocketBase from 'pocketbase';

// PocketBase URL - Change this to your PocketBase server URL
export const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://citysync.utkarshdeoli.in';

// Superusers collection name
export const SUPERUSERS_COLLECTION = '_superusers';

// Users collection name
export const USERS_COLLECTION = 'users';

// Create a singleton PocketBase instance
let pb: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (!pb) {
    pb = new PocketBase(POCKETBASE_URL);
  }
  return pb;
}

// Auth store key for localStorage
export const PB_AUTH_STORE_KEY = 'pb_auth';

// User type for PocketBase
export interface PocketBaseUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  created: string;
  updated: string;
}

// Auth response type
export interface AuthResponse {
  user: PocketBaseUser;
  token: string;
}

// Helper to get auth store data
export function getAuthStore() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(PB_AUTH_STORE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Helper to set auth store data
export function setAuthStore(data: { token: string; model: PocketBaseUser } | null) {
  if (typeof window !== 'undefined') {
    if (data) {
      localStorage.setItem(PB_AUTH_STORE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(PB_AUTH_STORE_KEY);
    }
  }
}

// Initialize PocketBase with auth from localStorage
export async function initPocketBase() {
  const pb = getPocketBase();
  const authData = getAuthStore();
  
  if (authData?.token) {
    pb.authStore.save(authData.token, authData.model);
  }
  
  return pb;
}

export default getPocketBase;

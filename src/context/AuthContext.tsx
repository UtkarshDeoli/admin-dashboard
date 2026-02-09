"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import PocketBase from "pocketbase";
import {
  getPocketBase,
  setAuthStore,
  PB_AUTH_STORE_KEY,
  PocketBaseUser,
  SUPERUSERS_COLLECTION,
} from "@/lib/pocketbase";

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  pb: PocketBase;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pb, setPb] = useState<PocketBase | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize PocketBase and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const pocketbase = getPocketBase();
        setPb(pocketbase);

        // Load auth from localStorage
        const storedAuth = localStorage.getItem(PB_AUTH_STORE_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          pocketbase.authStore.save(authData.token, authData.model);

          if (pocketbase.authStore.isValid) {
            setUser(authData.model as User);
          } else {
            // Token expired, clear auth
            localStorage.removeItem(PB_AUTH_STORE_KEY);
            pocketbase.authStore.clear();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

      if (!user && !isPublicRoute) {
        // Redirect to signin if not authenticated and trying to access protected route
        router.push("/auth/signin");
      } else if (user && isPublicRoute) {
        // Redirect to home if authenticated and trying to access auth pages
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  // Login function using _superusers collection
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!pb) {
      return { success: false, error: "PocketBase not initialized" };
    }

    try {
      setIsLoading(true);

      // Authenticate with _superusers collection
      const authData = await pb.collection(SUPERUSERS_COLLECTION).authWithPassword(email, password);

      // Save auth to localStorage
      setAuthStore({
        token: pb.authStore.token,
        model: authData.record as unknown as PocketBaseUser,
      });

      setUser(authData.record as unknown as User);

      return { success: true };
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Handle PocketBase error
      if (error instanceof Error) {
        const pbError = error as { data?: { message?: string } };
        if (pbError.data?.message) {
          return { success: false, error: pbError.data.message };
        }
      }

      return { success: false, error: "Invalid email or password" };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - Not available for superusers (admin only)
  // Superusers must be created directly in PocketBase dashboard
  const signup = async (_name: string, _email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: "Superuser accounts cannot be created through this interface. Please create them in the PocketBase dashboard." };
  };

  // Logout function
  const logout = () => {
    if (pb) {
      pb.authStore.clear();
    }
    setAuthStore(null);
    setUser(null);
    router.push("/auth/signin");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    pb: pb || getPocketBase(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

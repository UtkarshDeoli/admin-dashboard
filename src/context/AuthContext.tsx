"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup"];

// Storage key for user data
const USER_STORAGE_KEY = "t_pannel_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
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

  // Login function - will be connected to API later
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // For now, simulate a successful login with mock data
      // const response = await authApi.login(email, password);
      
      // Simulated delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "admin",
      };
      
      setUser(mockUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Invalid email or password" };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - will be connected to API later
  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await authApi.signup(name, email, password);
      
      // Simulated delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: "1",
        email,
        name,
        role: "admin",
      };
      
      setUser(mockUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Failed to create account" };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push("/auth/signin");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
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

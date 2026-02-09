/**
 * Business API
 * Contains all API calls related to Business using PocketBase
 */

import { getPocketBase } from "@/lib/pocketbase";
import PocketBase from "pocketbase";

// Business types based on PocketBase schema

export interface BusinessAddress {
  address: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
}

export interface BusinessLocation {
  lat: number;
  long: number;
}

export interface BusinessDaysOfOperation {
  [key: string]: boolean;
}

export interface Category{
  id:string;
  collectionId: string;
  collectionName: string;
  name: string;
  description: string,
  image: string,
  }

export interface Business {
  id: string;
  collectionId: string;
  collectionName: string;
  business_name: string;
  Active: boolean;
  isMember: boolean;
  owner_name: string;
  phone_number: number;
  email: string;
  contact_email: string;
  display_picture: string;
  category: string | Category;
  business_type: string;
  images: string[];
  views: number;
  average_rating: number;
  minutes_visited: number;
  website: string;
  address: BusinessAddress;
  location: BusinessLocation;
  days_of_operation: BusinessDaysOfOperation;
  hours_of_operation: string;
  status_control: boolean;
  Status: boolean;
  fcm: string;
  created: string;
  updated: string;
  expand: any;
}

export interface BusinessListResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: Business[];
}

/**
 * Get paginated list of businesses
 */
export async function getBusinesses(
  page: number = 1,
  perPage: number = 50,
  filter?: string
): Promise<{ success: boolean; data?: BusinessListResponse; error?: string }> {
  try {
    const pb = getPocketBase();
    // include relation records by using `expand`; replace with your actual relation field names
    const result = await pb.collection("Business").getList<Business>(page, perPage, {
      filter: filter || "",
      expand: 'category',
    });
    return {
      success: true,
      data: {
        page: result.page,
        perPage: result.perPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        items: result.items as unknown as Business[],
      },
    };
  } catch (error: unknown) {
    // Ignore cancelled requests (PocketBase auto-cancellation)
    const pbError = error as { status?: number; message?: string };
    if (pbError.status === 0 || pbError.message?.includes('aborted')) {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get businesses error:", error);
    if (error instanceof Error) {
      const err = error as { data?: { message?: string } };
      if (err.data?.message) {
        return { success: false, error: err.data.message };
      }
    }
    return { success: false, error: "Failed to fetch businesses" };
  }
}

/**
 * Get all businesses
 */
export async function getAllBusinesses(
  sort?: string
): Promise<{ success: boolean; data?: Business[]; error?: string }> {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("Business").getFullList<Business>({
      sort: sort || "-created",
      expand: 'category',
    });

    return { success: true, data: records as unknown as Business[] };
  } catch (error: unknown) {
    // Ignore cancelled requests (PocketBase auto-cancellation)
    const pbError = error as { status?: number; message?: string };
    if (pbError.status === 0 || pbError.message?.includes('aborted')) {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get all businesses error:", error);
    return { success: false, error: "Failed to fetch businesses" };
  }
}

/**
 * Get a single business by ID
 */
export async function getBusinessById(
  id: string
): Promise<{ success: boolean; data?: Business; error?: string }> {
  try {
    const pb = getPocketBase();
    const record = await pb.collection("Business").getOne<Business>(id, {
      expand: 'category',
    });

    return { success: true, data: record as unknown as Business };
  } catch (error: unknown) {
    // Ignore cancelled requests
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Get business by ID error:", error);
    return { success: false, error: "Failed to fetch business" };
  }
}

/**
 * Search businesses
 */
export async function searchBusinesses(
  query: string
): Promise<{ success: boolean; data?: Business[]; error?: string }> {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("Business").getFullList<Business>({
      filter: `business_name ~ "${query}" || owner_name ~ "${query}" || email ~ "${query}"`,
      expand: 'category',
    });

    return { success: true, data: records as unknown as Business[] };
  } catch (error: unknown) {
    // Ignore cancelled requests
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    
    console.error("Search businesses error:", error);
    return { success: false, error: "Failed to search businesses" };
  }
}

export default {
  getBusinesses,
  getAllBusinesses,
  getBusinessById,
  searchBusinesses,
};


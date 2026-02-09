/**
 * Dashboard API
 * Contains all API calls related to dashboard data
 */

import { get, ApiResponse } from "@/lib/api";

// Types
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface RecentActivity {
  id: string;
  type: "order" | "user" | "product" | "payment";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: ChartData;
  recentActivity: RecentActivity[];
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return get<DashboardStats>("/dashboard/stats");
}

/**
 * Get revenue chart data
 */
export async function getRevenueChart(
  period: "week" | "month" | "year" = "month"
): Promise<ApiResponse<ChartData>> {
  return get<ChartData>(`/dashboard/charts/revenue?period=${period}`);
}

/**
 * Get recent activity
 */
export async function getRecentActivity(
  limit: number = 10
): Promise<ApiResponse<RecentActivity[]>> {
  return get<RecentActivity[]>(`/dashboard/activity?limit=${limit}`);
}

/**
 * Get all dashboard data
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  return get<DashboardData>("/dashboard");
}

export default {
  getDashboardStats,
  getRevenueChart,
  getRecentActivity,
  getDashboardData,
};

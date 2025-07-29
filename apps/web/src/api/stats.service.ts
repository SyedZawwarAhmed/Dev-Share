import apiService from "@/lib/api";

export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  const data = await apiService.get<DashboardStats>("/stats/dashboard");
  return data.data;
};
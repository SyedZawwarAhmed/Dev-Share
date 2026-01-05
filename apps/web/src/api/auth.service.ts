import apiService from "@/lib/api";

export const getUserService = async () => {
  const data = await apiService.get<User>("/auth/me");
  return data.data;
};

export const disconnectAccountService = async (provider: string) => {
  const data = await apiService.delete<User>(`/auth/disconnect/${provider}`);
  return data.data;
};

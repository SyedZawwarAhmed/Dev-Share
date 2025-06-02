import apiService from "@/lib/api";

export const getUserService = async () => {
  const data = await apiService.get<User>("/auth/me");
  return data.data;
};

import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import apiService from "./api";

export async function handleLoginCallback(searchParams: URLSearchParams) {
  const { setToken, setError, setLoading } = useAuthStore.getState();

  try {
    setLoading(true);
    const token = searchParams.get("token");

    if (!token) {
      throw new Error("Missing user information");
    }

    setToken(decodeURIComponent(token));
    toast.success("Successfully logged in!");
    return true;
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "Failed to process login",
    );
    toast.error("Login failed. Please try again.");
    return false;
  } finally {
    setLoading(false);
  }
}

export async function logout() {
  const { logout: clearAuth } = useAuthStore.getState();
  const data = await apiService.post("/api/auth/logout");
  clearAuth();
  toast.success("Successfully logged out!");
  return data.data;
}


export const getAuthUrl = (platform: Platform, userId?: string) => {
  switch (platform) {
    case "LINKEDIN":
      return `${import.meta.env.VITE_API_URL}/auth/linkedin`;
    case "TWITTER":
      return `${import.meta.env.VITE_API_URL}/auth/twitter${userId ? `?userId=${userId}` : ''}`;
    case "BLUESKY":
      return `${import.meta.env.VITE_API_URL}/auth/bluesky`;
    default:
      return "#";
  }
};

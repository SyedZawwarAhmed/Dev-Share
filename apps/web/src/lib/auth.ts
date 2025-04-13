import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { fetchApi } from "./fetch";

export async function handleGoogleCallback(searchParams: URLSearchParams) {
  const { setUser, setError, setLoading } = useAuthStore.getState();

  try {
    setLoading(true);
    const id = searchParams.get("id");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");

    if (!firstName || !lastName || !email) {
      throw new Error("Missing user information");
    }

    const user = {
      id: decodeURIComponent(id ?? ""),
      firstName: decodeURIComponent(firstName ?? ""),
      lastName: decodeURIComponent(lastName ?? ""),
      email: decodeURIComponent(email),
    };

    setUser(user);
    toast.success("Successfully logged in!");
    return true;
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "Failed to process login"
    );
    toast.error("Login failed. Please try again.");
    return false;
  } finally {
    setLoading(false);
  }
}

export async function logout() {
  const { logout: clearAuth } = useAuthStore.getState();

  try {
    const response = await fetchApi("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    clearAuth();
    toast.success("Successfully logged out!");
    return true;
  } catch (error) {
    console.error("\n\n ---> apps/web/src/lib/auth.ts:52 -> error: ", error);
    toast.error("Logout failed. Please try again.");
    return false;
  }
}

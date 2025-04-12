import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, setError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      !isAuthenticated &&
      pathname !== "/" &&
      pathname !== "/login" &&
      pathname !== "/signup" &&
      pathname !== "/callback"
    ) {
      navigate({ to: "/login" });
      setLoading(false);
    } else if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/signup")
    ) {
      navigate({ to: "/dashboard" });
      setLoading(false);
    }
    // const checkAuth = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('/api/auth/me', {
    //       credentials: 'include', // Important for cookies
    //     });
    //     if (!response.ok) {
    //       throw new Error('Authentication failed');
    //     }
    //     const userData = await response.json();
    //     setUser(userData);
    //   } catch (error) {
    //     setError(error instanceof Error ? error.message : 'Authentication failed');
    //     navigate({ to: '/login' });
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // checkAuth();
  }, [setUser, setLoading, setError, navigate, isAuthenticated, pathname]);
  return <>{children}</>;
}

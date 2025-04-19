import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

export const useAuthStore = create<
  AuthState & {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
  }
>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set(initialState),
    }),
    {
      name: "auth-storage",
    }
  )
);

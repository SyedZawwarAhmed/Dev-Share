type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

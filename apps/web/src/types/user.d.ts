type Account = {
  id: string;
  userId: string;
  type: string; // oauth, email, etc
  provider: string; // google, github, email, etc
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
};

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  
  // Authentication related fields
  accounts?: Account[];
  
  // Social media profiles
  linkedinUrl?: string;
  twitterUrl?: string;
  blueskyUrl?: string;
  githubUrl?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

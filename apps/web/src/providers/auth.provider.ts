// import { ReactNode, useEffect } from 'react';
// import { useNavigate } from '@tanstack/react-router';
// import { useAuthStore } from '@/stores/auth.store';

// type AuthProviderProps = {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const { setUser, setLoading, setError } = useAuthStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/auth/me', {
//           credentials: 'include', // Important for cookies
//         });

//         if (!response.ok) {
//           throw new Error('Authentication failed');
//         }

//         const userData = await response.json();
//         setUser(userData);
//       } catch (error) {
//         setError(error instanceof Error ? error.message : 'Authentication failed');
//         navigate({ to: '/login' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [setUser, setLoading, setError, navigate]);

//   return <>{children}</>;
// }

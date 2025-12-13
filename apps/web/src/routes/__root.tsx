import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth.provider";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell>
          <Outlet />
        </AppShell>
        <TanStackRouterDevtools />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

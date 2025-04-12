import AppHeader from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth.provider";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <AppHeader />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </AuthProvider>
  );
}

import AppHeader from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AppHeader />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </>
  );
}

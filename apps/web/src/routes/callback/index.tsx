import { getUserService } from "@/api/auth.service";
import { handleLoginCallback } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/callback/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const data = await getUserService();
        setUser(data);
        navigate({ to: "/dashboard" });
      } catch (error) {
        console.log(
          "\n\n ---> apps/web/src/routes/callback/index.tsx:29 -> error: ",
          error,
        );
        navigate({ to: "/login" });
      }
    },
    enabled: !!token,
  });
  console.log(
    "\n\n ---> apps/web/src/routes/callback/index.tsx:23 -> user: ",
    user,
  );

  useEffect(() => {
    handleLoginCallback(searchParams);
  }, [searchParams, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background text-sm font-semibold">
            DS
          </span>
          <span className="text-sm font-semibold tracking-tight">DevShare</span>
        </div>

        <div className="rounded-xl border bg-card p-8">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-cyan-500"></div>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Processing your login</h2>
          <p className="text-muted-foreground">
            Please wait while we authenticate your account...
          </p>
        </div>
      </div>
    </div>
  );
}

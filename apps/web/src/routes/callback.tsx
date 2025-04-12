import { handleGoogleCallback } from "@/lib/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  useEffect(() => {
    const processCallback = async () => {
      const success = await handleGoogleCallback(searchParams);
      navigate({ to: success ? "/dashboard" : "/login" });
    };

    processCallback();
  }, [searchParams, navigate]);

  return <div>Processing login...</div>;
}

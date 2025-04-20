import { handleGoogleCallback } from "@/lib/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/callback/")({
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            DevShare
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-8">
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Processing your login
            </h2>
            <p className="text-slate-600">
              Please wait while we authenticate your account...
            </p>
          </>
        </div>
      </div>
    </div>
  );
}

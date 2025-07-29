import DashboardStats from "@/components/dashboard-stats";
import ScheduledPosts from "@/components/scheduled-posts";
import RecentNotes from "@/components/recent-notes";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  
  const hasConnectedPlatforms = user?.accounts?.some(account => 
    ["LINKEDIN", "X", "BLUESKY"].includes(account.provider)
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold text-purple-800 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            DevShare
          </h1>
          <p className="text-slate-600">
            Automate your developer learning posts
          </p>
        </div>
        <Link to="/new-note">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Learning Note
          </Button>
        </Link>
      </div>

      {!hasConnectedPlatforms && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ExternalLink className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 mb-1">
                  Connect your social media accounts
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  To start sharing your learning posts automatically, connect at least one social media platform.
                </p>
                <Link to="/connected-platforms">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Connect Platforms
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:items-start">
        <div className="md:col-span-2 min-h-full">
          <ScheduledPosts />
        </div>
        <div className="md:h-fit">
          <RecentNotes />
        </div>
      </div>
    </main>
  );
}

import DashboardStats from "@/components/dashboard-stats";
import ScheduledPosts from "@/components/scheduled-posts";
import RecentNotes from "@/components/recent-notes";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
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

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <ScheduledPosts />
        </div>
        <div>
          <RecentNotes />
        </div>
      </div>
    </main>
  );
}

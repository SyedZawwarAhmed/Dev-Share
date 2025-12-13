import DashboardStats from "@/components/dashboard-stats";
import ScheduledPosts from "@/components/scheduled-posts";
import RecentNotes from "@/components/recent-notes";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, FileText, PlusCircle, Send } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Divider } from "@/components/layout/Divider";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  
  const hasConnectedPlatforms = user?.accounts?.some(account => 
    ["LINKEDIN", "X", "BLUESKY"].includes(account.provider)
  );

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description="Automate your developer learning posts"
        actions={
          <Link to="/new-note">
            <Button variant="gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              New learning note
            </Button>
          </Link>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {!hasConnectedPlatforms ? (
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-muted">
                  <ExternalLink className="h-5 w-5 text-cyan-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold">
                    Connect your platforms to start publishing
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect LinkedIn, X, or Bluesky to generate and schedule posts straight from your notes.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/connected-platforms">
                      <Button variant="outline">Connect platforms</Button>
                    </Link>
                    <Link to="/new-note">
                      <Button variant="gradient">Create a note</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={hasConnectedPlatforms ? "" : "mt-6"}>
            <DashboardStats />
          </div>

          <div className="mt-6">
            <ScheduledPosts />
          </div>
        </div>

        <div className="lg:col-span-4">
            <RecentNotes />

            {!user ? (
              <EmptyState
                title="Sign in to personalize"
                description="Your stats and recent notes will appear here once you’re logged in."
              />
            ) : null}
          </div>
        </div>
    </Page>
  );
}

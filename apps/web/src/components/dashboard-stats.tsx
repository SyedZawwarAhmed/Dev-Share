import { Calendar, MessageSquare, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/api/stats.service";

const items = [
  {
    key: "notes",
    label: "Notes",
    to: { to: "/notes" as const, search: { search: "" as const } },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-cyan-600"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    value: (s?: DashboardStats) => s?.totalNotes ?? 0,
  },
  {
    key: "posts",
    label: "Posts",
    to: { to: "/posts" as const },
    icon: <MessageSquare className="h-5 w-5 text-cyan-600" />,
    value: (s?: DashboardStats) => s?.totalPosts ?? 0,
  },
  {
    key: "scheduled",
    label: "Scheduled",
    to: { to: "/posts" as const, search: { status: "scheduled" as const } },
    icon: <Calendar className="h-5 w-5 text-cyan-600" />,
    value: (s?: DashboardStats) => s?.scheduledPosts ?? 0,
  },
] as const;

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsService,
  });

  return (
    <div className="rounded-2xl border bg-card">
      <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => {
          const content = (
            <div className="flex items-center gap-3 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  item.icon
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <div className="mt-0.5 text-2xl font-semibold tracking-tight">
                  {isLoading ? (
                    <span className="inline-block h-7 w-10 rounded bg-muted" />
                  ) : (
                    item.value(stats)
                  )}
                </div>
              </div>
            </div>
          );

          return item.to ? (
            <Link
              key={item.key}
              to={item.to.to}
              // @ts-expect-error - different routes have different search shapes
              search={item.to.search}
              className="block transition-colors hover:bg-accent/40"
            >
              {content}
            </Link>
          ) : (
            <div key={item.key}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}

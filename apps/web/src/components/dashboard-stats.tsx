import { Calendar, MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/api/stats.service";

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsService,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-slate-200 rounded-lg mr-4 animate-pulse">
                  <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                </div>
                <div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse mb-2 w-12"></div>
                  <div className="h-7 bg-slate-200 rounded animate-pulse w-8"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to="/notes" search={{ search: "" }} className="block">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
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
                  className="h-6 w-6 text-purple-600"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Notes</p>
                <h3 className="text-2xl font-bold text-purple-900">{stats?.totalNotes || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/posts" className="block">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Posts</p>
                <h3 className="text-2xl font-bold text-blue-900">{stats?.totalPosts || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/posts" search={{ status: "scheduled" }} className="block">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Scheduled
                </p>
                <h3 className="text-2xl font-bold text-emerald-900">{stats?.scheduledPosts || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg mr-4">
              <ThumbsUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Engagements</p>
              <h3 className="text-2xl font-bold text-amber-900">1.2k</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

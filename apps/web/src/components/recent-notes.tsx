import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNotesService } from "@/api/note.service";
import { formatDate } from "@/lib/date-time";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function RecentNotes() {
  const queryParams = {
    search: "",
    orderBy: "desc" as const,
    page: 1,
    limit: 3,
  };

  const { data: recentNotesData, isLoading } = useQuery({
    queryKey: ["notes", queryParams],
    queryFn: async () => getNotesService(queryParams),
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader title="Recent notes" description="Your latest learning notes." />
        </div>
        <Divider />
        <div className="px-6 py-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground/40" />
          <p className="text-sm">Loading notes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="px-6 py-5">
        <SectionHeader title="Recent notes" description="Your latest learning notes." />
      </div>
      <Divider />
      <div className="px-6 py-5 space-y-4">
        {recentNotesData && recentNotesData.notes.length > 0 ? (
          recentNotesData.notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border p-3 transition-colors hover:bg-accent/40"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-cyan-600" />
                <span className="font-medium text-sm">{note.title}</span>
                {note.postCount > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-xs bg-blue-50 border-blue-200 text-blue-700"
                  >
                    {note.postCount} {note.postCount === 1 ? "Post" : "Posts"}
                  </Badge>
                )}
              </div>
              <p className="mb-2 text-xs text-muted-foreground">
                Added {formatDate(note.createdAt)}
              </p>
              <div className="flex justify-end">
                {note.postCount > 0 ? (
                  <Link to={"/notes/$id/posts"} params={{ id: note.id }}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      View Posts
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <Link to={"/notes/$id/create-posts"} params={{ id: note.id }}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Create Posts
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[160px] items-center justify-center rounded-xl border bg-muted/20 text-muted-foreground">
            <p className="text-sm">No notes yet</p>
          </div>
        )}

        <Link to="/notes" className="block text-center">
          <Button variant="link" size="sm" className="text-cyan-600 hover:text-cyan-700">
            View all notes
          </Button>
        </Link>
      </div>
    </div>
  );
}

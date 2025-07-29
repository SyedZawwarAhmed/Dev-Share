import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNotesService } from "@/api/note.service";
import { formatDate } from "@/lib/date-time";

export default function RecentNotes() {
  const queryParams = { search: "", orderBy: "desc" as const, page: 1, limit: 3 };
  
  const { data: recentNotes, isLoading } = useQuery({
    queryKey: ["notes", queryParams],
    queryFn: async () => getNotesService(queryParams),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Learning Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-300 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Loading...</h3>
            <p>Please wait while we fetch your notes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Learning Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentNotes && recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <div key={note.id} className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-purple-600" />
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
              <p className="text-xs text-slate-500 mb-2">
                Added {formatDate(new Date(note.createdAt))}
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
          <div className="text-center py-8 text-slate-500">
            <p>No notes yet</p>
          </div>
        )}

        <Link to="/notes" className="block text-center">
          <Button variant="link" size="sm" className="text-purple-600">
            View all notes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

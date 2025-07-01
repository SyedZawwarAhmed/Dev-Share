import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getNoteService, updateNoteService } from "@/api/note.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/notes/$id/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: note } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNoteService(id),
  });
  const { mutate: updateNote, isPending: isNoteUpdating } = useMutation({
    mutationFn: (data: UpdateNotePayload) => updateNoteService(id, data),
    onSuccess: () => {
      toast("Note updated", {
        description: "Your learning note has been updated successfully.",
      });
      navigate({ to: "/notes" });
    },
  });
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      toast("Missing title", {
        description: "Please provide a title for your note.",
      });
      return;
    }

    if (!content.trim()) {
      toast("Missing content", {
        description: "Please provide content for your note.",
      });
      return;
    }

    updateNote({
      title,
      content,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/notes"
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Notes
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">
            Edit Learning Note
          </h1>
          <p className="text-slate-600">Update your learning note content</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., React Server Components"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Your Notes</Label>
              <Textarea
                id="notes"
                placeholder="Write your raw learning notes here..."
                className="min-h-[300px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
              <p>
                <strong>Note:</strong> If this note already has associated
                posts, editing the note content won't automatically update those
                posts. You'll need to regenerate or manually edit the posts if
                you want them to reflect these changes.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/notes">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isNoteUpdating}
          >
            {isNoteUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

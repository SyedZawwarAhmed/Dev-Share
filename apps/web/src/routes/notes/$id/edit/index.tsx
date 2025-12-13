import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getNoteService, updateNoteService } from "@/api/note.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

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
    <Page>
      <div className="mb-6">
        <Link
          to="/notes"
          className="flex items-center text-cyan-700 hover:text-cyan-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to notes
        </Link>
      </div>

      <PageHeader
        title="Edit note"
        description="Update your learning note content."
      />

      <div className="rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader
            title="Edit note"
            description="Update title and content. Existing posts won’t automatically update."
          />
        </div>
        <Divider />
        <div className="px-6 py-5 space-y-4">
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
            <Label htmlFor="notes">Your notes</Label>
            <Textarea
              id="notes"
              placeholder="Write your raw learning notes here..."
              className="min-h-[340px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="rounded-xl border bg-amber-50 p-4 text-sm text-amber-800">
            <p>
              <strong>Note:</strong> If this note already has associated posts, editing the note won’t automatically update them.
            </p>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/notes">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} variant="gradient" disabled={isNoteUpdating}>
            {isNoteUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Page>
  );
}

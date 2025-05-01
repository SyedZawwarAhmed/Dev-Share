import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/notes/$id/edit/")({
  component: RouteComponent,
});

// Mock data for the note
const mockNote = {
  id: 1,
  title: "Next.js Server Actions",
  content:
    "Server Actions are a Next.js feature built on top of React Actions. They allow you to define async server functions that can be called directly from your components. This eliminates the need for API endpoints!\n\nKey features:\n- No need for API routes\n- Progressive enhancement\n- Works with and without JavaScript\n- Form handling is much simpler\n- Built-in security against CSRF attacks\n\nExample usage:\n```tsx\n'use server'\n\nasync function submitForm(formData: FormData) {\n  // Server-side code here\n  const name = formData.get('name')\n  await saveToDatabase({ name })\n}\n```\n\nThis is a game-changer for building forms and mutations in Next.js applications.",
  createdAt: "2023-04-05T14:30:00Z",
  status: "active",
};

function RouteComponent() {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(mockNote.title);
  const [content, setContent] = useState(mockNote.content);

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

    setIsSaving(true);
    // Simulate saving to database
    setTimeout(() => {
      toast("Note updated", {
        description: "Your learning note has been updated successfully.",
      });
      setIsSaving(false);
      // In a real app, redirect back to the notes list
      window.location.href = "/notes";
    }, 1500);
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
            disabled={isSaving}
          >
            {isSaving ? (
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

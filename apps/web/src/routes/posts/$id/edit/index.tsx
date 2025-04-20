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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

// Mock data for the post
const mockPost = {
  id: 101,
  noteId: 1,
  noteTitle: "Next.js Server Actions",
  platform: "linkedin",
  content:
    "I recently explored Next.js Server Actions and discovered significant performance benefits.\n\nKey advantages include:\n• No need for API routes\n• Progressive enhancement\n• Works with and without JavaScript\n• Simplified form handling\n• Built-in CSRF protection\n\nThis approach represents a paradigm shift in how we build React applications, combining the best of server-rendered and client-side experiences.\n\nHave you integrated Server Actions into your workflow? I'd love to hear about your experience. #WebDevelopment #ReactJS #NextJS #FrontendDevelopment",
  status: "scheduled",
  scheduledFor: "2023-04-07T15:00:00Z",
  createdAt: "2023-04-05T16:30:00Z",
  updatedAt: "2023-04-05T16:45:00Z",
};

export const Route = createFileRoute("/posts/$id/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(mockPost.content);

  const handleSave = () => {
    if (!content.trim()) {
      toast("Missing content", {
        description: "Please provide content for your post.",
      });
      return;
    }

    setIsSaving(true);
    // Simulate saving to database
    setTimeout(() => {
      toast("Post updated", {
        description: "Your post has been updated successfully.",
      });
      setIsSaving(false);
      // In a real app, redirect back to the posts list
      window.location.href = "/posts";
    }, 1500);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return (
          <Badge variant="outline" className="mb-2 bg-blue-50 border-blue-200">
            <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
            LinkedIn Format
          </Badge>
        );
      case "twitter":
        return (
          <Badge variant="outline" className="mb-2 bg-sky-50 border-sky-200">
            <Twitter className="h-3 w-3 mr-1 text-sky-500" />X Format
          </Badge>
        );
      case "bluesky":
        return (
          <Badge
            variant="outline"
            className="mb-2 bg-indigo-50 border-indigo-200"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
            >
              <path
                d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z"
                fill="#0085FF"
              />
            </svg>
            Bluesky Format
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          to="/posts"
          search={{ status: "" }}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Posts
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Edit Post</h1>
          <p className="text-slate-600">
            Editing {mockPost.platform} post for note: {mockPost.noteTitle}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getPlatformIcon(mockPost.platform)}

            <Textarea
              placeholder={`Enter your ${mockPost.platform} post content`}
              className="min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="text-sm text-slate-500">
              <p>
                <strong>Note:</strong> This post is for the {mockPost.platform}{" "}
                platform. Make sure your content is optimized for this
                platform's audience and format.
              </p>
              {mockPost.platform === "twitter" && (
                <p className="mt-2">
                  Remember that X (Twitter) has a character limit of 280
                  characters.
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/posts" search={{ status: "" }}>
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

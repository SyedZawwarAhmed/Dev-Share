import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter } from "lucide-react";
import { getPostService, updatePostService } from "@/api/post.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePostSchema } from "@/schemas/post.schema";
import { z } from "zod";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const Route = createFileRoute("/posts/$id/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostService(id),
  });

  const { mutate: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: (post: z.infer<typeof updatePostSchema>) =>
      updatePostService(id, post),
    onSuccess: () => {
      toast.success("Post updated successfully");
      navigate({ to: "/posts" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  const handleSave = async () => {
    if (!post) return;
    const { userId, note, noteId, ...rest } = post;
    updatePost({
      ...rest,
      content,
    });
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
            className="mb-2 bg-zinc-50 border-zinc-200"
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
    <Page className="max-w-3xl">
      <div className="mb-6">
        <Link
          to="/posts"
          className="flex items-center text-cyan-700 hover:text-cyan-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to posts
        </Link>
      </div>

      <PageHeader
        title="Edit post"
        description={
          <>
            Editing post for note:{" "}
            {isLoadingPost ? "Loading…" : post?.note?.title}
          </>
        }
      />

      <div className="rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader
            title="Edit content"
            description="Make edits, then save changes."
          />
        </div>
        <Divider />
        <div className="px-6 py-5 space-y-4">
          {post?.platform ? getPlatformIcon(post?.platform) : null}
          <Textarea
            placeholder="Enter your post content"
            className="min-h-[320px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> This post is platform-specific. Keep the tone and length appropriate for the selected network.
            </p>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/posts">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} variant="gradient">
            {isUpdatingPost ? (
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

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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter } from "lucide-react";
import { getPostService, updatePostService } from "@/api/post.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePostSchema } from "@/schemas/post.schema";
import { z } from "zod";

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
            Editing post for note:{" "}
            {isLoadingPost ? "Loading..." : post?.note?.title}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {post?.platform ? getPlatformIcon(post?.platform) : null}
            <Textarea
              placeholder={`Enter your post content`}
              className="min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="text-sm text-slate-500">
              <p>
                <strong>Note:</strong> This post is for the platform. Make sure
                your content is optimized for this platform's audience and
                format.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/posts">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isUpdatingPost ? (
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

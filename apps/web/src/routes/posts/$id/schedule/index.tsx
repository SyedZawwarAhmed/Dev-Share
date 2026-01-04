import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPostService, schedulePostService } from "@/api/post.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const Route = createFileRoute("/posts/$id/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { data: post } = useQuery({
    queryKey: ["post", params.id],
    queryFn: async () => getPostService(params.id),
  });

  const { mutate: schedulePost, isPending: isScheduling } = useMutation({
    mutationFn: async () => {
      if (!date || !time) {
        toast("Missing information", {
          description: "Please select both a date and time for scheduling.",
        });
        return;
      }
      if (!post) {
        throw new Error("Post not found.");
      }
      // Convert local datetime to UTC before sending to server
      const localDateTime = new Date(`${date}T${time}`);
      const utcDateTime = localDateTime.toISOString();
      await schedulePostService(post.id, { scheduledFor: utcDateTime });
    },
    onSuccess: () => {
      toast("Post created", {
        description: "Your post has been scheduled successfully.",
      });
      navigate({ to: "/posts" });
    },
    onError: (error) => {
      console.error("\n\n ---> schedule/index.tsx:61 -> error: ", error);
      if (error instanceof ZodError) {
        toast.error(fromZodError(error).message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return (
          <Badge variant="outline" className="mb-2 bg-blue-50 border-blue-200">
            <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
            LinkedIn
          </Badge>
        );
      case "twitter":
        return (
          <Badge variant="outline" className="mb-2 bg-sky-50 border-sky-200">
            <Twitter className="h-3 w-3 mr-1 text-sky-500" />X
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPlatformLabel = (platform?: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn";
      case "twitter":
        return "X (Twitter)";
      default:
        return "Unsupported platform";
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <Page>
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
        title="Schedule post"
        description={`Schedule your ${getPlatformLabel(post?.platform)} post for note: ${post?.note?.title ?? ""}`}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border bg-card">
            <div className="px-6 py-5">
              <SectionHeader title="Preview" description="Double-check the content before scheduling." />
            </div>
            <Divider />
            <div className="px-6 py-5 space-y-4">
              {post ? <div className="flex items-center gap-2">{getPlatformIcon(post.platform)}</div> : null}
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="whitespace-pre-line text-sm text-foreground">{post?.content}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border bg-card">
            <div className="px-6 py-5">
              <SectionHeader title="Schedule" description="Pick a date and time." />
            </div>
            <Divider />
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                <p>
                  <strong>Tip:</strong> Weekdays during working hours tend to perform well for professional content.
                </p>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between px-6 py-5">
              <Link to="/posts">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={() => schedulePost()} variant="gradient" disabled={isScheduling}>
                {isScheduling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

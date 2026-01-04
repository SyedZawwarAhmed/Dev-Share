import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Edit,
  Linkedin,
  MoreHorizontal,
  Twitter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPostsService } from "@/api/post.service";
import { formatDate } from "@/lib/date-time";
import { POST_STATUSES } from "@/constants/post";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Divider } from "@/components/layout/Divider";

export default function ScheduledPosts() {
  const [, setActiveTab] = useState("upcoming");

  const scheduledParams = {
    status: "scheduled" as (typeof POST_STATUSES)[number],
    limit: 3,
  };
  const draftParams = {
    status: "draft" as (typeof POST_STATUSES)[number],
    limit: 3,
  };

  const { data: scheduledPosts, isLoading: isScheduledLoading } = useQuery({
    queryKey: ["posts", scheduledParams],
    queryFn: () => getPostsService(scheduledParams),
  });

  const { data: draftPosts, isLoading: isDraftLoading } = useQuery({
    queryKey: ["posts", draftParams],
    queryFn: () => getPostsService(draftParams),
  });

  const isLoading = isScheduledLoading || isDraftLoading;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "LINKEDIN":
        return <Linkedin className="h-3 w-3 mr-1 text-blue-600" />;
      case "TWITTER":
        return <Twitter className="h-3 w-3 mr-1 text-sky-500" />;
      default:
        return null;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "LINKEDIN":
        return "LinkedIn";
      case "TWITTER":
        return "X";
      default:
        return "Unsupported platform";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader
            title="Your posts"
            description="Upcoming scheduled posts and drafts."
          />
        </div>
        <Divider />
        <div className="px-6 py-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground/40" />
          <p className="text-sm">Loading posts…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="px-6 py-5">
        <SectionHeader
          title="Your posts"
          description="Upcoming scheduled posts and drafts."
        />
      </div>
      <Divider />
      <div className="px-6 py-5">
        <Tabs
          defaultValue="upcoming"
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({scheduledPosts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftPosts?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4 flex-1">
            {scheduledPosts && scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div key={post.id} className="rounded-xl border p-4">
                  <div className="flex justify-between items-start mb-3">
                    {post.scheduledFor ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-zinc-950 text-white">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.scheduledFor.toString())}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(post.scheduledFor.toString())}
                        </Badge>
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <Link
                        to={"/posts/$id/edit"}
                        params={{ id: post.id.toString() }}
                      >
                        <Button size="sm" variant="outline" className="h-8">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Post now</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="mb-2 line-clamp-3 text-sm text-foreground">
                    {post.content}
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    From note: {post.note?.title || "Unknown Note"}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Your account
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-muted/40"
                      >
                        {getPlatformIcon(post.platform)}
                        {getPlatformLabel(post.platform)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-xl border bg-muted/20 text-muted-foreground">
                <p className="text-sm">No scheduled posts</p>
              </div>
            )}

            {scheduledPosts && scheduledPosts.length > 0 && (
              <div className="text-center">
                <Link to="/posts" search={{ status: "scheduled" }}>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-cyan-600 hover:text-cyan-700"
                  >
                    View all scheduled posts
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="mt-4 space-y-4 flex-1">
            {draftPosts && draftPosts.length > 0 ? (
              draftPosts.map((post) => (
                <div key={post.id} className="rounded-xl border p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700"
                      >
                        Draft
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-muted/40"
                      >
                        {getPlatformIcon(post.platform)}
                        {getPlatformLabel(post.platform)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={"/posts/$id/edit"}
                        params={{ id: post.id.toString() }}
                      >
                        <Button size="sm" variant="outline" className="h-8">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link
                        to={"/posts/$id/schedule"}
                        params={{ id: post.id.toString() }}
                      >
                        <Button
                          size="sm"
                          variant="gradient"
                          className="h-8"
                        >
                          Schedule
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="mb-2 line-clamp-3 text-sm text-foreground">
                    {post.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From note: {post.note?.title || "Unknown Note"}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-xl border bg-muted/20 text-muted-foreground">
                <p className="text-sm">No draft posts</p>
              </div>
            )}

            {draftPosts && draftPosts.length > 0 && (
              <div className="text-center">
                <Link to="/posts" search={{ status: "draft" }}>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-cyan-600 hover:text-cyan-700"
                  >
                    View all draft posts
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

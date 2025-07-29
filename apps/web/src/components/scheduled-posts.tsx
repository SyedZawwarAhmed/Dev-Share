import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      case "BLUESKY":
        return (
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
          >
            <path d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z" fill="#0085FF" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center py-12 text-slate-500">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-300 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Loading...</h3>
            <p>Please wait while we fetch your posts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs
          defaultValue="upcoming"
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({scheduledPosts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({draftPosts?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4 flex-1">
            {scheduledPosts && scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    {post.scheduledFor ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-600">
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

                  <p className="text-slate-700 mb-2 line-clamp-3">
                    {post.content}
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    From note: {post.note?.title || "Unknown Note"}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600">
                        Your account
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 border-slate-200"
                      >
                        {getPlatformIcon(post.platform)}
                        {post.platform === "LINKEDIN"
                          ? "LinkedIn"
                          : post.platform === "X"
                            ? "X"
                            : post.platform === "BLUESKY"
                              ? "Bluesky"
                              : post.platform}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500 min-h-[335px] flex items-center justify-center">
                <p>No scheduled posts</p>
              </div>
            )}

            {scheduledPosts && scheduledPosts.length > 0 && (
              <div className="text-center">
                <Link to="/posts" search={{ status: "scheduled" }}>
                  <Button variant="link" size="sm" className="text-purple-600">
                    View all scheduled posts
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="mt-4 space-y-4 flex-1">
            {draftPosts && draftPosts.length > 0 ? (
              draftPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
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
                        className="bg-slate-50 border-slate-200"
                      >
                        {getPlatformIcon(post.platform)}
                        {post.platform === "LINKEDIN"
                          ? "LinkedIn"
                          : post.platform === "X"
                            ? "X"
                            : post.platform === "BLUESKY"
                              ? "Bluesky"
                              : post.platform}
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
                          className="h-8 bg-purple-600 hover:bg-purple-700"
                        >
                          Schedule
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-2 line-clamp-3">
                    {post.content}
                  </p>
                  <p className="text-xs text-slate-500">
                    From note: {post.note?.title || "Unknown Note"}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500 min-h-[335px] flex items-center justify-center">
                <p>No draft posts</p>
              </div>
            )}

            {draftPosts && draftPosts.length > 0 && (
              <div className="text-center">
                <Link to="/posts" search={{ status: "draft" }}>
                  <Button variant="link" size="sm" className="text-purple-600">
                    View all draft posts
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

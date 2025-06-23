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

// Mock data for posts
const mockPosts = [
  {
    id: 101,
    noteId: 1,
    noteTitle: "Next.js Server Actions",
    platform: "linkedin",
    content:
      "I recently explored Next.js Server Actions and discovered significant performance benefits.\n\nKey advantages include:\n• No need for API routes\n• Progressive enhancement\n• Works with and without JavaScript\n• Simplified form handling\n• Built-in CSRF protection\n\nThis approach represents a paradigm shift in how we build React applications, combining the best of server-rendered and client-side experiences.\n\nHave you integrated Server Actions into your workflow? I'd love to hear about your experience. #WebDevelopment #ReactJS #NextJS #FrontendDevelopment",
    status: "scheduled",
    scheduledFor: "2023-04-07T15:00:00Z",
    createdAt: "2023-04-05T16:30:00Z",
  },
  {
    id: 102,
    noteId: 1,
    noteTitle: "Next.js Server Actions",
    platform: "twitter",
    content:
      "Just learned about Next.js Server Actions! 🚀\n\nThey let you define server functions that can be called directly from components - no API routes needed.\n\nForm handling is so much simpler now!\n\n#webdev #reactjs #nextjs",
    status: "draft",
    createdAt: "2023-04-05T16:30:00Z",
  },
  {
    id: 105,
    noteId: 4,
    noteTitle: "CSS Container Queries",
    platform: "linkedin",
    content:
      "CSS Container Queries are a game-changer for component-based design systems!\n\nUnlike media queries that look at the viewport size, container queries let you style elements based on their parent container's size.\n\nThis means you can create truly responsive components that adapt to their context, not just the screen size.\n\nHere's a simple example:\n\n.container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .component {\n    /* Styles for larger containers */\n  }\n}\n\nHave you started using container queries in production? #CSS #WebDevelopment #ResponsiveDesign",
    status: "scheduled",
    scheduledFor: "2023-04-08T10:00:00Z",
    createdAt: "2023-04-02T14:30:00Z",
  },
  {
    id: 106,
    noteId: 4,
    noteTitle: "CSS Container Queries",
    platform: "bluesky",
    content:
      "CSS Container Queries are finally here and they're amazing! 🎉\n\nNow we can style elements based on their parent container's size instead of just the viewport.\n\nPerfect for component-based design systems where components need to adapt to their context.\n\n```css\n.container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n  }\n}\n```\n\n#CSS #WebDev #FrontEnd",
    status: "scheduled",
    scheduledFor: "2023-04-08T11:00:00Z",
    createdAt: "2023-04-02T14:30:00Z",
  },
];

export default function ScheduledPosts() {
  const [, setActiveTab] = useState("upcoming");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

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
      case "linkedin":
        return <Linkedin className="h-3 w-3 mr-1 text-blue-600" />;
      case "twitter":
        return <Twitter className="h-3 w-3 mr-1 text-sky-500" />;
      case "bluesky":
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

  const scheduledPosts = mockPosts.filter(
    (post) => post.status === "scheduled",
  );
  const draftPosts = mockPosts.filter((post) => post.status === "draft");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({scheduledPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({draftPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    {post.scheduledFor ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.scheduledFor)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(post.scheduledFor)}
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
                    From note: {post.noteTitle}
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
                        {post.platform === "linkedin"
                          ? "LinkedIn"
                          : post.platform === "twitter"
                            ? "X"
                            : post.platform === "bluesky"
                              ? "Bluesky"
                              : post.platform}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No scheduled posts</p>
              </div>
            )}

            <div className="text-center">
              <Link to="/posts" search={{ status: "scheduled" }}>
                <Button variant="link" size="sm" className="text-purple-600">
                  View all scheduled posts
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-4 space-y-4">
            {draftPosts.length > 0 ? (
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
                        {post.platform === "linkedin"
                          ? "LinkedIn"
                          : post.platform === "twitter"
                            ? "X"
                            : post.platform === "bluesky"
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
                    From note: {post.noteTitle}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No draft posts</p>
              </div>
            )}

            <div className="text-center">
              <Link to="/posts" search={{ status: "draft" }}>
                <Button variant="link" size="sm" className="text-purple-600">
                  View all draft posts
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

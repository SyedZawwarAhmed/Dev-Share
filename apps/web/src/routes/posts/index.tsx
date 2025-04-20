import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin, Twitter } from "lucide-react";

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
    updatedAt: "2023-04-05T16:45:00Z",
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
    updatedAt: "2023-04-05T16:45:00Z",
  },
  {
    id: 103,
    noteId: 2,
    noteTitle: "React Optimistic UI",
    platform: "linkedin",
    content:
      "Optimistic UI updates are a pattern where we update the UI before the server confirms the change. This creates a more responsive user experience.\n\nI've been implementing this pattern with React and found it particularly powerful when combined with React Query or SWR.\n\nHave you used optimistic updates in your applications? What challenges did you face?\n\n#ReactJS #WebDevelopment #UX #FrontendDevelopment",
    status: "published",
    publishedAt: "2023-04-04T12:00:00Z",
    createdAt: "2023-04-04T10:30:00Z",
    updatedAt: "2023-04-04T10:45:00Z",
  },
  {
    id: 104,
    noteId: 2,
    noteTitle: "React Optimistic UI",
    platform: "twitter",
    content:
      "TIL about Optimistic UI in React 🔥\n\nUpdate the UI immediately on user action, then sync with the server in the background.\n\nResult: Apps feel lightning fast!\n\nWorks great with React Query & SWR.\n\n#reactjs #webdev #ux",
    status: "published",
    publishedAt: "2023-04-04T12:05:00Z",
    createdAt: "2023-04-04T10:30:00Z",
    updatedAt: "2023-04-04T10:45:00Z",
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
    updatedAt: "2023-04-02T14:45:00Z",
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
    updatedAt: "2023-04-02T14:45:00Z",
  },
];

export const Route = createFileRoute("/posts/")({
  component: RouteComponent,
  validateSearch: (search?: { status?: "draft" | "scheduled" | "" }) => {
    return {
      status: search?.status,
    };
  },
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort posts
  const filteredPosts = mockPosts
    .filter((post) => {
      // Search filter
      const matchesSearch =
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.noteTitle.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      // Platform filter
      const matchesPlatform =
        platformFilter === "all" || post.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesPlatform;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Linkedin className="h-5 w-5 text-blue-600" />
          </div>
        );
      case "twitter":
        return (
          <div className="p-2 bg-sky-100 rounded-lg">
            <Twitter className="h-5 w-5 text-sky-500" />
          </div>
        );
      case "bluesky":
        return (
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z"
                fill="#0085FF"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn";
      case "twitter":
        return "X (Twitter)";
      case "bluesky":
        return "Bluesky";
      default:
        return platform;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-amber-50 border-amber-200 text-amber-700"
          >
            Draft
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700"
          >
            Scheduled
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-blue-50 border-blue-200 text-blue-700"
          >
            Published
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">All Posts</h1>
          <p className="text-slate-600">
            Manage your social media posts across all platforms
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="bluesky">Bluesky</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="m-0">
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {getPlatformIcon(post.platform)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">
                              {getPlatformName(post.platform)}
                            </h3>
                            {getStatusBadge(post.status)}
                            <Badge variant="outline" className="text-xs">
                              {post.noteTitle}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                            <Calendar className="h-3 w-3" />
                            <span>Created: {formatDate(post.createdAt)}</span>

                            {post.status === "scheduled" &&
                              post.scheduledFor && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Scheduled for:{" "}
                                    {formatDate(post.scheduledFor)} at{" "}
                                    {formatTime(post.scheduledFor)}
                                  </span>
                                </>
                              )}

                            {post.status === "published" &&
                              post.publishedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Published: {formatDate(post.publishedAt)} at{" "}
                                    {formatTime(post.publishedAt)}
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
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
                            <Link
                              to={`/posts/$id/edit`}
                              params={{ id: post.id.toString() }}
                            >
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Post
                              </DropdownMenuItem>
                            </Link>
                            {post.status === "draft" && (
                              <Link
                                to={`/posts/$id/schedule`}
                                params={{ id: post.id.toString() }}
                              >
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule Post
                                </DropdownMenuItem>
                              </Link>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-slate-300"
                >
                  <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M4 12a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4Z" />
                  <path d="M8 18v-4" />
                  <path d="M12 18v-4" />
                  <path d="M4 14h8" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="grid" className="m-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start gap-2 mb-3">
                      {getPlatformIcon(post.platform)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h3 className="font-medium">
                            {getPlatformName(post.platform)}
                          </h3>
                          {getStatusBadge(post.status)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {post.noteTitle}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link
                            to={`/posts/$id/edit`}
                            params={{ id: post.id.toString() }}
                          >
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Post
                            </DropdownMenuItem>
                          </Link>
                          {post.status === "draft" && (
                            <Link
                              to={`/posts/$id/schedule`}
                              params={{ id: post.id.toString() }}
                            >
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Post
                              </DropdownMenuItem>
                            </Link>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-6 mb-4">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between mt-auto text-xs text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-slate-300"
                >
                  <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M4 12a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4Z" />
                  <path d="M8 18v-4" />
                  <path d="M12 18v-4" />
                  <path d="M4 14h8" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Linkedin, Twitter } from "lucide-react";

// Mock data for the note
const mockNote = {
  id: 1,
  title: "Next.js Server Actions",
  content:
    "Server Actions are a Next.js feature built on top of React Actions. They allow you to define async server functions that can be called directly from your components. This eliminates the need for API endpoints!",
  createdAt: "2023-04-05T14:30:00Z",
  status: "active",
};

// Mock data for posts
const mockPosts = [
  {
    id: 101,
    noteId: 1,
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
    platform: "twitter",
    content:
      "Just learned about Next.js Server Actions! 🚀\n\nThey let you define server functions that can be called directly from components - no API routes needed.\n\nForm handling is so much simpler now!\n\n#webdev #reactjs #nextjs",
    status: "draft",
    createdAt: "2023-04-05T16:30:00Z",
    updatedAt: "2023-04-05T16:45:00Z",
  },
];

export const Route = createFileRoute("/notes/$id/create-posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [activeTab, setActiveTab] = useState<string>("all");

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

  const filteredPosts =
    activeTab === "all"
      ? mockPosts
      : mockPosts.filter(
          (post) => post.status === activeTab || post.platform === activeTab
        );

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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
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
            Posts for: {mockNote.title}
          </h1>
          <p className="text-slate-600">
            Manage your social media posts for this note
          </p>
        </div>
        <Link to={`/notes/$id/create-posts`} params={{ id: params.id }}>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create More Posts
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Source Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 rounded-lg border">
            <p>{mockNote.content}</p>
            <div className="mt-2 text-sm text-slate-500">
              Created on {formatDate(mockNote.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="twitter">X (Twitter)</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="m-0">
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
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-line">
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
                              to={"/notes/$id/posts/$postId/edit"}
                              params={{
                                id: params.id,
                                postId: post.id.toString(),
                              }}
                            >
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Post
                              </DropdownMenuItem>
                            </Link>
                            {post.status === "draft" && (
                              <Link
                                to={"/notes/$id/posts/$postId/schedule"}
                                params={{
                                  id: params.id,
                                  postId: post.id.toString(),
                                }}
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
                <p>No posts match your current filter</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

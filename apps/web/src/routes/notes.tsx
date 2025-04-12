import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Edit,
  FileText,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Wand2,
} from "lucide-react";
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

// Mock data for notes
const mockNotes = [
  {
    id: 1,
    title: "Next.js Server Actions",
    content:
      "Server Actions are a Next.js feature built on top of React Actions...",
    createdAt: "2023-04-05T14:30:00Z",
    status: "draft",
    platforms: [],
  },
  {
    id: 2,
    title: "React Optimistic UI",
    content:
      "Optimistic UI updates are a pattern where we update the UI before...",
    createdAt: "2023-04-04T10:15:00Z",
    status: "published",
    platforms: ["linkedin", "twitter"],
  },
  {
    id: 3,
    title: "Rust Web Development",
    content:
      "Exploring Rust for web development today. The performance benefits...",
    createdAt: "2023-04-02T09:45:00Z",
    status: "draft",
    platforms: [],
  },
  {
    id: 4,
    title: "CSS Container Queries",
    content:
      "Container queries allow you to apply styles to an element based on...",
    createdAt: "2023-04-01T16:20:00Z",
    status: "scheduled",
    platforms: ["linkedin", "bluesky"],
    scheduledFor: "2023-04-07T09:00:00Z",
  },
  {
    id: 5,
    title: "TypeScript 5.0 Features",
    content:
      "TypeScript 5.0 introduces several new features including const type parameters...",
    createdAt: "2023-03-28T11:10:00Z",
    status: "published",
    platforms: ["linkedin", "twitter", "bluesky"],
  },
  {
    id: 6,
    title: "Web Animation API",
    content:
      "The Web Animations API provides a way to control animation sequences...",
    createdAt: "2023-03-25T13:40:00Z",
    status: "draft",
    platforms: [],
  },
  {
    id: 7,
    title: "GraphQL Subscriptions",
    content:
      "GraphQL subscriptions provide a way to push data from the server to clients...",
    createdAt: "2023-03-22T15:30:00Z",
    status: "published",
    platforms: ["linkedin"],
  },
];

export const Route = createFileRoute("/notes")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort notes
  const filteredNotes = mockNotes
    .filter((note) => {
      // Search filter
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || note.status === statusFilter;

      return matchesSearch && matchesStatus;
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

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">
            Your Learning Notes
          </h1>
          <p className="text-slate-600">
            Manage and organize your developer knowledge
          </p>
        </div>
        <Link to="/new-note">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
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
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{note.title}</h3>
                            {note.status === "draft" && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-amber-50 border-amber-200 text-amber-700"
                              >
                                Draft
                              </Badge>
                            )}
                            {note.status === "scheduled" && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700"
                              >
                                Scheduled
                              </Badge>
                            )}
                            {note.status === "published" && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                              >
                                Published
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                            {note.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(note.createdAt)}</span>

                            {note.status === "scheduled" &&
                              note.scheduledFor && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Scheduled for{" "}
                                    {formatDate(note.scheduledFor)}
                                  </span>
                                </>
                              )}

                            {note.platforms.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  {note.platforms.includes("linkedin") && (
                                    <svg
                                      className="h-3 w-3 text-blue-600"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                  )}
                                  {note.platforms.includes("twitter") && (
                                    <svg
                                      className="h-3 w-3 text-sky-500"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                  )}
                                  {note.platforms.includes("bluesky") && (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 16 16"
                                      fill="#0085FF"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                    >
                                      <path d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z" />
                                    </svg>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {note.status === "draft" && (
                          <Button size="sm" variant="outline" className="h-8">
                            <Wand2 className="h-3 w-3 mr-1" />
                            Create Post
                          </Button>
                        )}
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
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Note
                            </DropdownMenuItem>
                            {note.status === "draft" && (
                              <DropdownMenuItem>
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate Post
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Note
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
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="grid" className="m-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{note.title}</h3>
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
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Note
                          </DropdownMenuItem>
                          {note.status === "draft" && (
                            <DropdownMenuItem>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Generate Post
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Note
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mb-3">
                      {note.status === "draft" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-amber-50 border-amber-200 text-amber-700"
                        >
                          Draft
                        </Badge>
                      )}
                      {note.status === "scheduled" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700"
                        >
                          Scheduled
                        </Badge>
                      )}
                      {note.status === "published" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                        >
                          Published
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between mt-auto text-xs text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>

                      {note.platforms.length > 0 && (
                        <div className="flex items-center gap-1">
                          {note.platforms.includes("linkedin") && (
                            <svg
                              className="h-3 w-3 text-blue-600"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          )}
                          {note.platforms.includes("twitter") && (
                            <svg
                              className="h-3 w-3 text-sky-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          )}
                          {note.platforms.includes("bluesky") && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="#0085FF"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                            >
                              <path d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {note.status === "draft" && (
                    <div className="p-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs h-7"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Create Post
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Edit,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Linkedin, Twitter } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNoteService } from "@/api/note.service";
import { getPostsService, publishPostService } from "@/api/post.service";
import { getStatusBadge } from "@/components/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/notes/$id/posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  const queryClient = useQueryClient();
  const { data: note } = useQuery({
    queryKey: [`note-${params.id}`],
    queryFn: async () => getNoteService(params.id),
  });

  const { data: posts, isPending: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostsService(),
  });


  const { mutate: publishPost, isPending: isPublishing } = useMutation({
    mutationFn: publishPostService,
    onSuccess: () => {
      setShowSuccessDialog(true);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to publish post");
    },
    onSettled: (_, __, variables) => {
      setPostConfirmationDialogs((prev) => ({
        ...prev,
        [variables]: false,
      }));
    }
  });


  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [postConfirmationDialogs, setPostConfirmationDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
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

  const filteredPosts = posts || []

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

  const getPlatformName = (platform: Platform) => {
    switch (platform) {
      case "LINKEDIN":
        return "LinkedIn";
      case "TWITTER":
        return "X (Twitter)";
      case "BLUESKY":
        return "Bluesky";
      default:
        return platform;
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  const handlePostNow = (postId: string) => {
    publishPost(postId);
  };

  const handlePostConfirmationDialog = (postId: string, isOpen: boolean) => {
    setPostConfirmationDialogs((prev) => ({
      ...prev,
      [postId]: isOpen,
    }));
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link
          to="/notes"
          search={{
            search: ''
          }}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Notes
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">
            Posts for: {note?.title}
          </h1>
          <p className="text-slate-600">
            Manage your social media posts for this note
          </p>
        </div>
        <Link
          to={"/notes/$id/create-posts"}
          params={{
            id: params.id,
          }}
        >
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
            <p>{note?.content}</p>
            <div className="mt-2 text-sm text-slate-500">
              Created on {formatDate(note?.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

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

      {isPostsLoading ? (
        <div className="text-center py-12 text-slate-500">
          <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-300 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading...</h3>
          <p>Please wait while we fetch your posts</p>
        </div>
      ) : (
        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="m-0">
            <div className="space-y-4">
              {(filteredPosts?.length ?? 0) > 0 ? (
                filteredPosts?.map((post) => (
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
                              {getStatusBadge(post?.status)}
                              <Badge variant="outline" className="text-xs">
                                {post?.note.title}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                              <Calendar className="h-3 w-3" />
                              <span>Created: {formatDate(post.createdAt)}</span>

                              {post?.status === "SCHEDULED" &&
                                post.scheduledFor && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Scheduled for:{" "}
                                      {formatDate(
                                        post?.scheduledFor?.toString()
                                      )}{" "}
                                      at{" "}
                                      {formatTime(
                                        post?.scheduledFor?.toString()
                                      )}
                                    </span>
                                  </>
                                )}

                              {post?.status === "PUBLISHED" &&
                                post.publishedAt && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Published:{" "}
                                      {formatDate(
                                        post?.publishedAt?.toString()
                                      )}{" "}
                                      at{" "}
                                      {formatTime(
                                        post?.publishedAt?.toString()
                                      )}
                                    </span>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DropdownMenu modal={false}>
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
                              {post?.status === "DRAFT" && (
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
                              {post?.status === "DRAFT" && (
                                <DropdownMenuItem
                                  onClick={() => handlePostConfirmationDialog(post.id, true)}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Post Now
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <ConfirmationDialog
                            open={postConfirmationDialogs[post.id] || false}
                            onOpenChange={(isOpen) => handlePostConfirmationDialog(post.id, isOpen)}
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. Are you sure you want to publish this post?"
                            onConfirm={() => handlePostNow(post.id)}
                            loading={isPublishing}
                          />
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
              {(filteredPosts?.length ?? 0) > 0 ? (
                filteredPosts?.map((post) => (
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
                            {post?.note?.title}
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
                            {post?.status === "DRAFT" && (
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

                            {post?.status === "DRAFT" && (
                              <DropdownMenuItem
                                onClick={() => handlePostConfirmationDialog(post.id, true)}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Post Now
                              </DropdownMenuItem>
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
                    
                    <ConfirmationDialog
                      open={postConfirmationDialogs[post.id] || false}
                      onOpenChange={(isOpen) => handlePostConfirmationDialog(post.id, isOpen)}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. Are you sure you want to publish this post?"
                      onConfirm={() => handlePostNow(post.id)}
                      loading={isPublishing}
                    />
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
      )}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
              Post Published Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-center">
              Your post has been published successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

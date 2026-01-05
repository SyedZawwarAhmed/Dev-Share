import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Edit,
  Loader2,
  MoreHorizontal,
  Search,
  Send,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { LinkedInReauthDialog } from "@/components/linkedin-reauth-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { getPostsService, publishPostService, deletePostService, markAsPublishedService } from "@/api/post.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { useConfigStore } from "@/stores/config.store";
import { useDebounce } from "@/lib/hooks";
import { getPostsFiltersSchema } from "@/schemas/post.schema";
import { z } from "zod";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { Toolbar } from "@/components/layout/Toolbar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/posts/")({
  component: RouteComponent,
  validateSearch: (search?: { 
    search?: string; 
    status?: string; 
    platform?: string; 
    sortBy?: string; 
  }) => {
    const result: {
      search?: string;
      status?: string;
      platform?: string;
      sortBy?: string;
    } = {};
    if (search?.search) {
      result.search = search.search;
    }
    if (search?.status) {
      result.status = search.status;
    }
    if (search?.platform) {
      result.platform = search.platform;
    }
    if (search?.sortBy) {
      result.sortBy = search.sortBy;
    }
    return result;
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { postsView, setPostsView } = useConfigStore();

  const { mutate: publishPost, isPending: isPublishing } = useMutation({
    mutationFn: publishPostService,
    onSuccess: () => {
      setShowSuccessDialog(true);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      // Check if it's a LinkedIn authentication error based on 400 status + LinkedIn message
      const isLinkedInAuthError = error?.response?.status === 400 && 
        (error?.message?.includes('LinkedIn') || error?.response?.data?.message?.includes('LinkedIn'));
      
      if (isLinkedInAuthError) {
        setShowLinkedInReauthDialog(true);
      } else {
        toast.error("Failed to publish post");
      }
    },
    onSettled: (_, __, variables) => {
      setPostConfirmationDialogs((prev) => ({
        ...prev,
        [variables]: false,
      }));
    },
  });

  const { mutateAsync: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: deletePostService,
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    },
    onSettled: (_, __, variables) => {
      setDeleteDialogs((prev) => ({
        ...prev,
        [variables]: false,
      }));
    },
  });

  const { mutate: markAsPublished, isPending: isMarkingAsPublished } = useMutation({
    mutationFn: markAsPublishedService,
    onSuccess: () => {
      toast.success("Post marked as published!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error marking post as published:", error);
      toast.error("Failed to mark post as published. Please try again.");
    },
    onSettled: (_, __, variables) => {
      setMarkPublishedDialogs((prev) => ({
        ...prev,
        [variables]: false,
      }));
    },
  });

  const [searchInput, setSearchInput] = useState(searchParams?.search || "");
  const [statusFilter, setStatusFilter] = useState(searchParams?.status || "all");
  const [platformFilter, setPlatformFilter] = useState(searchParams?.platform || "all");
  const [sortBy, setSortBy] = useState(searchParams?.sortBy || "newest");

  const debouncedSearch = useDebounce(searchInput, 300);
  const [postConfirmationDialogs, setPostConfirmationDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [markPublishedDialogs, setMarkPublishedDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteDialogs, setDeleteDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLinkedInReauthDialog, setShowLinkedInReauthDialog] = useState(false);

  useEffect(() => {
    const newSearch: {
      search?: string;
      status?: string;
      platform?: string;
      sortBy?: string;
    } = {};
    
    if (debouncedSearch) newSearch.search = debouncedSearch;
    if (statusFilter !== "all") newSearch.status = statusFilter;
    if (platformFilter !== "all") newSearch.platform = platformFilter;
    if (sortBy !== "newest") newSearch.sortBy = sortBy;

    const currentSearch = searchParams || {};
    const hasChanged = 
      currentSearch.search !== (debouncedSearch || undefined) ||
      currentSearch.status !== (statusFilter !== "all" ? statusFilter : undefined) ||
      currentSearch.platform !== (platformFilter !== "all" ? platformFilter : undefined) ||
      currentSearch.sortBy !== (sortBy !== "newest" ? sortBy : undefined);

    if (hasChanged) {
      navigate({
        to: ".",
        search: newSearch,
        replace: true,
      });
    }
  }, [debouncedSearch, statusFilter, platformFilter, sortBy, searchParams, navigate]);

  useEffect(() => {
    if (searchParams?.search !== searchInput) {
      setSearchInput(searchParams?.search || "");
    }
    if (searchParams?.status !== statusFilter) {
      setStatusFilter(searchParams?.status || "all");
    }
    if (searchParams?.platform !== platformFilter) {
      setPlatformFilter(searchParams?.platform || "all");
    }
    if (searchParams?.sortBy !== sortBy) {
      setSortBy(searchParams?.sortBy || "newest");
    }
  }, [searchParams]);

  const { data: posts, isPending: isPostsLoading } = useQuery({
    queryKey: ["posts", debouncedSearch, statusFilter, platformFilter, sortBy],
    queryFn: async () => {
      const filters: z.infer<typeof getPostsFiltersSchema> = {
        orderBy: sortBy !== "newest" ? "asc" : "desc",
      };

      if (debouncedSearch) {
        filters.search = debouncedSearch;
      }

      if (statusFilter !== "all") {
        filters.status = statusFilter as z.infer<typeof getPostsFiltersSchema>["status"];
      }

      if (platformFilter !== "all") {
        filters.platform = platformFilter as z.infer<typeof getPostsFiltersSchema>["platform"];
      }

      return getPostsService(filters);
    },
  });

  const filteredPosts = posts || [];

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
          <div className="rounded-lg border bg-muted p-2">
            <Linkedin className="h-5 w-5 text-cyan-700" />
          </div>
        );
      case "twitter":
        return (
          <div className="rounded-lg border bg-muted p-2">
            <XIcon className="h-5 w-5 text-slate-900" />
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
      default:
        return "Unsupported platform";
    }
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

  const handleDeleteDialog = (postId: string, isOpen: boolean) => {
    setDeleteDialogs((prev) => ({
      ...prev,
      [postId]: isOpen,
    }));
  };

  const handleMarkPublishedDialog = (postId: string, isOpen: boolean) => {
    setMarkPublishedDialogs((prev) => ({
      ...prev,
      [postId]: isOpen,
    }));
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  return (
    <Page>
      <PageHeader
        title="Posts"
        description="Review drafts, schedule, and publish across platforms."
      />

      <Toolbar sticky className="mb-6">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts…"
                className="pl-8"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
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
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>

              <Tabs
                defaultValue={postsView}
                onValueChange={(value) => setPostsView(value as ConfigState["postsView"])}
              >
                <TabsList>
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </Toolbar>

      {isPostsLoading ? (
        <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-muted-foreground/50" />
          <p className="text-sm">Loading posts…</p>
        </div>
      ) : (
        <Tabs
          defaultValue={postsView}
          className="pb-8"
          onValueChange={(value) => setPostsView(value as ConfigState["postsView"])}
        >
          <TabsContent value="list" className="m-0">
            <div className="space-y-4">
              {(filteredPosts?.length ?? 0) > 0 ? (
                filteredPosts?.map((post) => (
                  <div
                    key={post.id}
                    className={cn(
                      "rounded-2xl border bg-card transition-colors hover:bg-accent/40"
                    )}
                  >
                    <div className="p-4 sm:p-5">
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
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
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
                              {post?.status !== "PUBLISHED" && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkPublishedDialog(post.id, true)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark as Published
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteDialog(post.id, true)}
                              >
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
                          
                          <ConfirmationDialog
                            open={markPublishedDialogs[post.id] || false}
                            onOpenChange={(isOpen) => handleMarkPublishedDialog(post.id, isOpen)}
                            title="Mark as Published"
                            description="This will mark the post as published without actually posting it to social media. Are you sure you want to continue?"
                            onConfirm={() => markAsPublished(post.id)}
                            loading={isMarkingAsPublished}
                          />
                          
                          <ConfirmationDialog
                            open={deleteDialogs[post.id] || false}
                            onOpenChange={(isOpen) => handleDeleteDialog(post.id, isOpen)}
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. Are you sure you want to delete this post?"
                            confirmVariant="destructive"
                            onConfirm={() => deletePost(post.id)}
                            loading={isDeletingPost}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No posts found"
                  description="Create posts from a note, or adjust your filters."
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="grid" className="m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredPosts?.length ?? 0) > 0 ? (
                filteredPosts?.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl border bg-card transition-colors hover:bg-accent/40 h-full flex flex-col"
                  >
                    <div className="p-4 sm:p-5 flex-1">
                      <div className="flex items-start gap-2 mb-3">
                        {getPlatformIcon(post.platform)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <h3 className="font-medium">
                              {getPlatformName(post.platform)}
                            </h3>
                            {getStatusBadge(post.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post?.note?.title}
                          </p>
                        </div>
                        <DropdownMenu modal={false}>
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
                            {post?.status !== "PUBLISHED" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkPublishedDialog(post.id, true)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Published
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteDialog(post.id, true)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-6 mb-4">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ConfirmationDialog
                      open={postConfirmationDialogs[post.id] || false}
                      onOpenChange={(isOpen) => handlePostConfirmationDialog(post.id, isOpen)}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. Are you sure you want to publish this post?"
                      onConfirm={() => handlePostNow(post.id)}
                      loading={isPublishing}
                    />
                    
                    <ConfirmationDialog
                      open={markPublishedDialogs[post.id] || false}
                      onOpenChange={(isOpen) => handleMarkPublishedDialog(post.id, isOpen)}
                      title="Mark as Published"
                      description="This will mark the post as published without actually posting it to social media. Are you sure you want to continue?"
                      onConfirm={() => markAsPublished(post.id)}
                      loading={isMarkingAsPublished}
                    />
                    
                    <ConfirmationDialog
                      open={deleteDialogs[post.id] || false}
                      onOpenChange={(isOpen) => handleDeleteDialog(post.id, isOpen)}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. Are you sure you want to delete this post?"
                      confirmVariant="destructive"
                      onConfirm={() => deletePost(post.id)}
                      loading={isDeletingPost}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="No posts found"
                    description="Create posts from a note, or adjust your filters."
                  />
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
              variant="gradient"
              className="w-full sm:w-auto"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LinkedInReauthDialog
        open={showLinkedInReauthDialog}
        onOpenChange={setShowLinkedInReauthDialog}
      />
    </Page>
  );
}

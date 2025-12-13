import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Edit,
  FileText,
  Loader2,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNoteService, getNotesService } from "@/api/note.service";
import { formatDate } from "@/lib/date-time";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks";
import { useConfigStore } from "@/stores/config.store";
import { getNotesBodySchema } from "@/schemas/note.schema";
import { z } from "zod";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { Toolbar } from "@/components/layout/Toolbar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes/")({
  component: RouteComponent,
  validateSearch: (search?: { search?: string; sortBy?: string }) => {
    const result: {
      search?: string;
      sortBy?: string;
    } = {};
    if (search?.search) {
      result.search = search.search;
    }
    if (search?.sortBy) {
      result.sortBy = search.sortBy;
    }
    return result;
  },
});

function NoteCard({
  note,
  viewType,
  deleteDialogs,
  handleDeleteDialog,
  deleteNote,
  isDeletingNote,
}: {
  note: Note;
  viewType: "list" | "grid";
  deleteDialogs: { [key: string]: boolean };
  handleDeleteDialog: (noteId: string, isOpen: boolean) => void;
  deleteNote: (noteId: string) => void;
  isDeletingNote: boolean;
}) {
  const isGridView = viewType === "grid";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card",
        isGridView
          ? "flex h-full flex-col"
          : "transition-colors hover:bg-accent/40",
      )}
    >
      <div className={cn("p-4 sm:p-5", isGridView ? "flex-1" : null)}>
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            isGridView ? "mb-3" : null,
          )}
        >
          <div
            className={cn(
              "flex items-start gap-3",
              isGridView ? "min-w-0 flex-1 gap-2" : null,
            )}
          >
            <div className="rounded-xl border bg-muted p-2">
              <FileText
                className={cn(
                  "text-cyan-600",
                  isGridView ? "h-4 w-4" : "h-5 w-5",
                )}
              />
            </div>
            <div className={cn(isGridView ? "min-w-0 flex-1" : null)}>
              <div className="mb-1 flex items-center gap-2">
                <h3
                  className={cn("font-medium", isGridView ? "truncate" : null)}
                >
                  {note.title}
                </h3>
                {!isGridView && note?.postCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                  >
                    {note.postCount} {note.postCount === 1 ? "Post" : "Posts"}
                  </Badge>
                ) : null}
              </div>

              {!isGridView ? (
                <>
                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isGridView && note.postCount === 0 ? (
              <Link to={`/notes/$id/create-posts`} params={{ id: note.id }}>
                <Button size="sm" variant="outline" className="h-8">
                  <Wand2 className="mr-1 h-3 w-3" />
                  Create Posts
                </Button>
              </Link>
            ) : null}
            {!isGridView && note.postCount > 0 ? (
              <Link to={`/notes/$id/posts`} params={{ id: note.id }}>
                <Button size="sm" variant="outline" className="h-8">
                  View Posts
                </Button>
              </Link>
            ) : null}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={isGridView ? "h-7 w-7" : "h-8 w-8"}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to={`/notes/$id/edit`} params={{ id: note.id }}>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Note
                  </DropdownMenuItem>
                </Link>
                <Link to={`/notes/$id/create-posts`} params={{ id: note.id }}>
                  <DropdownMenuItem>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Create Posts
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteDialog(note.id, true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmationDialog
              open={deleteDialogs[note.id] || false}
              onOpenChange={(isOpen) => handleDeleteDialog(note.id, isOpen)}
              title="Are you absolutely sure?"
              description="This action cannot be undone. Are you sure you want to delete this note?"
              onConfirm={() => deleteNote(note.id)}
              loading={isDeletingNote}
            />
          </div>
        </div>

        {isGridView ? (
          <>
            <div className="mb-3 flex gap-2">
              {note?.postCount > 0 ? (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                >
                  {note.postCount} {note.postCount === 1 ? "Post" : "Posts"}
                </Badge>
              ) : null}
            </div>

            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
              {note.content}
            </p>

            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {isGridView ? (
        <div className="border-t p-4 sm:p-5">
          {note.postCount === 0 ? (
            <Link to={`/notes/$id/create-posts`} params={{ id: note.id }}>
              <Button size="sm" variant="outline" className="h-8 w-full">
                <Wand2 className="mr-1 h-3 w-3" />
                Create Posts
              </Button>
            </Link>
          ) : (
            <Link to={`/notes/$id/posts`} params={{ id: note.id }}>
              <Button size="sm" variant="outline" className="h-8 w-full">
                View Posts
              </Button>
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}

function RouteComponent() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const { notesView, setNotesView } = useConfigStore();

  const [sortBy, setSortBy] = useState(searchParams?.sortBy || "newest");
  const [deleteDialogs, setDeleteDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchInput, setSearchInput] = useState(searchParams?.search || "");

  const debouncedSearch = useDebounce(searchInput, 300);

  const queryClient = useQueryClient();

  useEffect(() => {
    const newSearch: {
      search?: string;
      sortBy?: string;
    } = {};

    if (debouncedSearch) newSearch.search = debouncedSearch;
    if (sortBy !== "newest") newSearch.sortBy = sortBy;

    const currentSearch = searchParams || {};
    const hasChanged =
      currentSearch.search !== (debouncedSearch || undefined) ||
      currentSearch.sortBy !== (sortBy !== "newest" ? sortBy : undefined);

    if (hasChanged) {
      navigate({
        to: ".",
        search: newSearch,
        replace: true,
      });
    }
  }, [debouncedSearch, sortBy, searchParams, navigate]);

  useEffect(() => {
    if (searchParams?.search !== searchInput) {
      setSearchInput(searchParams?.search || "");
    }
    if (searchParams?.sortBy !== sortBy) {
      setSortBy(searchParams?.sortBy || "newest");
    }
  }, [searchParams]);

  const { data: notesData, isLoading: isNotesLoading } = useQuery({
    queryKey: ["notes", debouncedSearch, sortBy],
    queryFn: async () => {
      const filters: z.infer<typeof getNotesBodySchema> = {
        orderBy: sortBy !== "newest" ? "asc" : "desc",
      };

      if (debouncedSearch) {
        filters.search = debouncedSearch;
      }

      return getNotesService(filters);
    },
  });

  const { mutateAsync: deleteNote, isPending: isDeletingNote } = useMutation({
    mutationFn: deleteNoteService,
    onSuccess: () => {
      toast.success("Note deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error(
        "\n\n ---> apps/web/src/routes/notes.tsx:100 -> error: ",
        error,
      );
      toast.error("Failed to delete note. Please try again.");
    },
    onSettled: (_, __, variables) => {
      setDeleteDialogs((prev) => ({
        ...prev,
        [variables]: false,
      }));
    },
  });

  const handleDeleteDialog = (noteId: string, isOpen: boolean) => {
    setDeleteDialogs((prev) => ({
      ...prev,
      [noteId]: isOpen,
    }));
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  const renderNotes = (viewType: "list" | "grid") => {
    if (!notesData || notesData.notes.length === 0) {
      return (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No notes found"
          description="Try adjusting your search or create a new learning note."
          actionLabel="Create a note"
          onAction={() => navigate({ to: "/new-note" })}
        />
      );
    }

    return (
      <div
        className={
          viewType === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {notesData.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            viewType={viewType}
            deleteDialogs={deleteDialogs}
            handleDeleteDialog={handleDeleteDialog}
            deleteNote={deleteNote}
            isDeletingNote={isDeletingNote}
          />
        ))}
      </div>
    );
  };

  return (
    <Page>
      <PageHeader
        title="Notes"
        description="Capture learning, generate posts, and stay consistent."
        actions={
          <Link to="/new-note">
            <Button variant="gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              New note
            </Button>
          </Link>
        }
      />

      <Toolbar sticky className="mb-6">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes…"
                className="pl-8"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>

              <Tabs
                defaultValue={notesView}
                onValueChange={(value) =>
                  setNotesView(value as ConfigState["notesView"])
                }
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

      {isNotesLoading ? (
        <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-muted-foreground/50" />
          <p className="text-sm">Loading notes…</p>
        </div>
      ) : !notesData ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No notes yet"
          description="Create your first learning note to start generating posts."
          actionLabel="Create a note"
          onAction={() => navigate({ to: "/new-note" })}
        />
      ) : (
        <div className="pb-8">{renderNotes(notesView)}</div>
      )}
    </Page>
  );
}

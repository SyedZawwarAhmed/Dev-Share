import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNoteService, getNotesService } from "@/api/note.service";
import { formatDate } from "@/lib/date-time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks";

export const Route = createFileRoute("/notes/")({
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    search;
  },
  validateSearch: (search?: { search?: string }) => {
    if (!search?.search) return {};
    return {
      search: search?.search || "",
    };
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
    <Card
      className={`hover:shadow-md transition-shadow ${
        isGridView ? "h-full flex flex-col" : ""
      }`}
    >
      <CardContent className={`p-4 ${isGridView ? "flex-1" : ""}`}>
        <div
          className={`flex justify-between items-start ${
            isGridView ? "mb-3" : ""
          }`}
        >
          <div
            className={`flex items-start gap-3 ${
              isGridView ? "gap-2 flex-1 min-w-0" : ""
            }`}
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText
                className={`text-purple-600 ${isGridView ? "h-4 w-4" : "h-5 w-5"}`}
              />
            </div>
            <div className={isGridView ? "flex-1 min-w-0" : ""}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium ${isGridView ? "truncate" : ""}`}>
                  {note.title}
                </h3>
                {!isGridView && note?.postCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                  >
                    {note?.postCount} {note?.postCount === 1 ? "Post" : "Posts"}
                  </Badge>
                )}
              </div>
              {!isGridView && (
                <>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isGridView ? "" : ""}`}>
            {!isGridView && note.postCount === 0 && (
              <Link to={`/notes/$id/create-posts`} params={{ id: note.id }}>
                <Button size="sm" variant="outline" className="h-8">
                  <Wand2 className="h-3 w-3 mr-1" />
                  Create Posts
                </Button>
              </Link>
            )}
            {!isGridView && note.postCount > 0 && (
              <Link to={`/notes/$id/posts`} params={{ id: note.id }}>
                <Button size="sm" variant="outline" className="h-8">
                  View Posts
                </Button>
              </Link>
            )}
            <Dialog
              open={deleteDialogs[note.id]}
              onOpenChange={(isOpen) => handleDeleteDialog(note.id, isOpen)}
            >
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
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Note
                    </DropdownMenuItem>
                  </Link>
                  {note.postCount === 0 && (
                    <Link
                      to={`/notes/$id/create-posts`}
                      params={{ id: note.id }}
                    >
                      <DropdownMenuItem>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Create Posts
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Note
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Are you sure you want to
                    delete this note?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      deleteNote(note.id);
                    }}
                    variant={"gradient"}
                    size={"lg"}
                    loading={isDeletingNote}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isGridView && (
          <>
            <div className="mb-3 flex gap-2">
              {note?.postCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                >
                  {note?.postCount} {note?.postCount === 1 ? "Post" : "Posts"}
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
            </div>
          </>
        )}
      </CardContent>

      {/* Grid view action buttons */}
      {isGridView && (
        <div className="p-4 pt-0">
          {note.postCount === 0 ? (
            <Link to={`/notes/$id/create-posts`} params={{ id: note.id }}>
              <Button size="sm" variant="outline" className="h-8 w-full">
                <Wand2 className="h-3 w-3 mr-1" />
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
      )}
    </Card>
  );
}

function RouteComponent() {
  const { search } = Route.useSearch();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("newest");
  const [deleteDialogs, setDeleteDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchInput, setSearchInput] = useState(search || "");

  const debouncedSearch = useDebounce(searchInput, 300);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (debouncedSearch !== search) {
      navigate({
        to: ".",
        search: { search: debouncedSearch },
        replace: true,
      });
    }
  }, [debouncedSearch, search, navigate]);

  useEffect(() => {
    if (search !== searchInput) {
      setSearchInput(search || "");
    }
  }, [search]);

  const { data: notes, isLoading: isNotesLoading } = useQuery({
    queryKey: ["notes", debouncedSearch, sortBy],
    queryFn: async () =>
      getNotesService({
        search: debouncedSearch,
        orderBy: sortBy !== "newest" ? "asc" : "desc",
      }),
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
    if (!notes || notes.length === 0) {
      return (
        <div className="text-center py-12 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium mb-2">No notes found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
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
        {notes.map((note) => (
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
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2">
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

      {isNotesLoading ? (
        <div className="text-center py-12 text-slate-500">
          <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-300 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading...</h3>
          <p>Please wait while we fetch your notes</p>
        </div>
      ) : !notes ? (
        <div className="text-center py-12 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium mb-2">No notes found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="m-0">
            {renderNotes("list")}
          </TabsContent>

          <TabsContent value="grid" className="m-0">
            {renderNotes("grid")}
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

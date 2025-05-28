import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/notes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteDialogs, setDeleteDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const queryClient = useQueryClient();

  const { data: notes, isLoading: isNotesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotesService,
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

  const filteredNotes = notes
    ?.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || note.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
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
                  <SelectItem value="DRAFT">Drafts</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
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

      {isNotesLoading ? (
        <div className="text-center py-12 text-slate-500">
          <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-300 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading...</h3>
          <p>Please wait while we fetch your notes</p>
        </div>
      ) : !filteredNotes ? (
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
            {
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
                                {note.status === "DRAFT" && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-50 border-amber-200 text-amber-700"
                                  >
                                    Draft
                                  </Badge>
                                )}
                                {note.status === "ACTIVE" && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                                  >
                                    Active
                                  </Badge>
                                )}
                                {note?.postCount > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                                  >
                                    {note?.postCount}{" "}
                                    {note?.postCount === 1 ? "Post" : "Posts"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                                {note.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(note.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {note.postCount === 0 && (
                              <Link
                                to={`/notes/$id/create-posts`}
                                params={{ id: note.id }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                >
                                  <Wand2 className="h-3 w-3 mr-1" />
                                  Create Posts
                                </Button>
                              </Link>
                            )}
                            {note.postCount > 0 && (
                              <Link
                                to={`/notes/$id/posts`}
                                params={{ id: note.id }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                >
                                  View Posts
                                </Button>
                              </Link>
                            )}
                            <Dialog
                              open={deleteDialogs[note.id]}
                              onOpenChange={(isOpen) =>
                                handleDeleteDialog(note.id, isOpen)
                              }
                            >
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
                                    to={`/notes/$id/edit`}
                                    params={{ id: note.id }}
                                  >
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
                                  <DialogTitle>
                                    Are you absolutely sure?
                                  </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. Are you sure
                                    you want to delete this note?
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
            }
          </TabsContent>

          <TabsContent value="grid" className="m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes?.map((note) => (
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
                      <Dialog
                        open={deleteDialogs[note.id]}
                        onOpenChange={(isOpen) =>
                          handleDeleteDialog(note.id, isOpen)
                        }
                      >
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
                              This action cannot be undone. Are you sure you
                              want to delete this note?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              onClick={() => deleteNote(note.id)}
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

                    <div className="mb-3 flex gap-2">
                      {note.status === "DRAFT" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-amber-50 border-amber-200 text-amber-700"
                        >
                          Draft
                        </Badge>
                      )}
                      {note.status === "ACTIVE" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                        >
                          Active
                        </Badge>
                      )}
                      {note?.postCount > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                        >
                          {note?.postCount}{" "}
                          {note?.postCount === 1 ? "Post" : "Posts"}
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
                  </CardContent>

                  {note.postCount === 0 && (
                    <Link
                      to={`/notes/$id/create-posts`}
                      params={{ id: note.id }}
                    >
                      <Button size="sm" variant="outline" className="h-8">
                        <Wand2 className="h-3 w-3 mr-1" />
                        Create Posts
                      </Button>
                    </Link>
                  )}
                  {note.postCount > 0 && (
                    <Link to={`/notes/$id/posts`} params={{ id: note.id }}>
                      <Button size="sm" variant="outline" className="h-8">
                        View Posts
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

import { generatePostsService } from "@/api/gemini.service";
import { addNoteService } from "@/api/note.service";
import { addPostService } from "@/api/post.service";
import SavePostsButton from "@/components/save-posts-button";
import ScheduleModal from "@/components/schedule-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Linkedin, Loader2, Save, Twitter, Wand2, } from "lucide-react";
import { useState } from "react"; import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
export const Route = createFileRoute("/new-note/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const navigate = useNavigate()
  const { mutate: saveDraft, isPending: isDraftSaving } = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast("Please login to save your note", {
          description: "Please login to save your note.",
        });
        return;
      }
      if (!note.title) {
        toast("Missing title", {
          description: "Please provide a title for your note before saving.",
        });
        return;
      }
      await addNoteService(note)
    },
    onSuccess: () => {
      toast("Note saved", {
        description: "Your learning note has been saved.",
      });

      navigate({ to: "/notes", search: { search: '' } });
    },
    onError: (error) => {
      console.error(
        "\n\n ---> apps/web/src/routes/new-note.tsx:59 -> error: ",
        error
      );
    }
  });


  const { mutate: createPost, isPending: isPostSaving } = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast("Please login to save your note", {
          description: "Please login to save your note.",
        });
        return;
      }
      if (!note.title) {
        toast("Missing title", {
          description: "Please provide a title for your note before saving.",
        });
        return;
      }
      const createdNote = await addNoteService(note)
      return await addPostService({
        content: generatedPosts?.LINKEDIN?.post_content ?? "",
        platform: "LINKEDIN",
        published: false,
        noteId: createdNote?.id,
      })
    },
    onSuccess: (post) => {
      toast("Post created", {
        description: "Your post has been created successfully.",
      });
      navigate({ to: `/notes/${post?.noteId}/posts` })
    },
    onError: (error) => {
      console.error(
        "\n\n ---> apps/web/src/routes/new-note.tsx:96 -> error: ",
        error
      );
      if (error instanceof ZodError) {
        toast.error(fromZodError(error).message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const [note, setNote] = useState<CreateNotePayload>({
    title: "",
    content: "",
    status: "DRAFT",
  });
  const [activeTab, setActiveTab] = useState<Platform>("LINKEDIN");
  console.log('activeTab', activeTab)
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    LINKEDIN: false,
    TWITTER: false,
    BLUESKY: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [title] = useState("");
  const [notes] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState({
    LINKEDIN: { post_content: "" },
    TWITTER: { post_content: "" },
    BLUESKY: { post_content: "" },
  });

  const { mutateAsync: generatePosts, isPending: isGenerating } = useMutation({
    mutationFn: generatePostsService,
    onSuccess: (data) => {
      setActiveTab(Object.keys(data)[0] as Platform);
      setSelectedPlatforms({
        LINKEDIN: !!data?.LINKEDIN?.post_content,
        TWITTER: !!data?.TWITTER?.post_content,
        BLUESKY: !!data?.BLUESKY?.post_content,
      });
      setGeneratedPosts(data);
    },
    onError: (error) => {
      console.log(
        "\n\n ---> apps/web/src/routes/notes/$id/create-posts/index.tsx:69 -> error: ",
        error
      );
      toast.error("Failed to generate post. Please try again.");
    },
  });


  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: checked,
    }));
  };

  const handleSchedule = () => {
    if (!title || !notes) {
      toast("Missing information", {
        description:
          "Please provide both a title and notes before scheduling posts.",
      });
      return;
    }

    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (
    date: string,
    time: string,
    timezone: string
  ) => {
    setIsSaving(true);
    setTimeout(() => {
      toast("Note saved and posts scheduled", {
        description: `Your note has been saved and posts scheduled for ${date} at ${time} (${timezone}).`,
      });
      setIsSaving(false);
      setShowScheduleModal(false);
      window.location.href = "/notes";
    }, 1500);
  };


  const handlePostContentChange = (platform: Platform, content: string) => {
    setGeneratedPosts((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], post_content: content },
    }));
  };

  const handlePostNow = () => {
    if (!title || !notes) {
      toast("Missing information", {
        description: "Please provide both a title and notes before posting.",
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      toast("Note saved and posts published", {
        description:
          "Your note has been saved and posts published successfully.",
      });
      setIsSaving(false);
      window.location.href = "/notes";
    }, 1500);
  };

  const hasContent = Object.keys(selectedPlatforms).some(
    (platform) =>
      selectedPlatforms[platform as Platform] &&
      generatedPosts?.[platform as Platform]
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">
        Create New Learning Note
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Raw Learning Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., React Server Components"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Your Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Write your raw learning notes here..."
                  className="min-h-[200px]"
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="LINKEDIN"
                      checked={selectedPlatforms.LINKEDIN}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("LINKEDIN", checked as boolean)
                      }
                      disabled={!user?.accounts?.some(account => account.provider === "LINKEDIN")}
                    />
                    <Label
                      htmlFor="LINKEDIN"
                      className={`text-sm font-normal ${!user?.accounts?.some(account => account.provider === "LINKEDIN")
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      LinkedIn
                      {!user?.accounts?.some(account => account.provider === "LINKEDIN") && (
                        <span className="text-xs text-slate-400 ml-1">(Connect account first)</span>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twitter"
                      checked={selectedPlatforms.TWITTER}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("TWITTER", checked as boolean)
                      }
                      disabled={!user?.accounts?.some(account => account.provider === "TWITTER")}
                    />
                    <Label
                      htmlFor="twitter"
                      className={`text-sm font-normal ${!user?.accounts?.some(account => account.provider === "TWITTER")
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      X (Twitter)
                      {!user?.accounts?.some(account => account.provider === "TWITTER") && (
                        <span className="text-xs text-slate-400 ml-1">(Connect account first)</span>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="BLUESKY"
                      checked={selectedPlatforms.BLUESKY}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("BLUESKY", checked as boolean)
                      }
                      disabled={!user?.accounts?.some(account => account.provider === "BLUESKY")}
                    />
                    <Label
                      htmlFor="BLUESKY"
                      className={`text-sm font-normal ${!user?.accounts?.some(account => account.provider === "BLUESKY")
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      Bluesky
                      {!user?.accounts?.some(account => account.provider === "BLUESKY") && (
                        <span className="text-xs text-slate-400 ml-1">(Connect account first)</span>
                      )}
                    </Label>
                  </div>
                </div>
                {!user?.accounts?.some(account => ["LINKEDIN", "X", "BLUESKY"].includes(account.provider)) && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">
                      <strong>No platforms connected.</strong>{" "}
                      <Link to="/connected-platforms" className="text-amber-800 underline hover:text-amber-900">
                        Connect your social media accounts
                      </Link>{" "}
                      to start generating and posting content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={() => saveDraft()}
              variant="outline"
              className="flex-1"
            >
              {isDraftSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>
            <Button
              onClick={() =>
                generatePosts({
                  content: note.content,
                  platforms: Object.keys(selectedPlatforms).filter(
                    (platform) =>
                      selectedPlatforms[
                      platform as keyof typeof selectedPlatforms
                      ]
                  ) as Platform[],
                })
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Posts
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="LINKEDIN"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as Platform)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="LINKEDIN"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.LINKEDIN}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="TWITTER"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.TWITTER}
                >
                  <Twitter className="h-4 w-4" />X
                </TabsTrigger>
                <TabsTrigger
                  value="BLUESKY"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.BLUESKY}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  Bluesky
                </TabsTrigger>
              </TabsList>

              <TabsContent value="LINKEDIN" className="m-0">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-blue-50 border-blue-200"
                  >
                    <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                    LinkedIn Format
                  </Badge>

                  <Textarea
                    placeholder="LinkedIn post content will appear here"
                    className="min-h-[250px]"
                    value={generatedPosts?.LINKEDIN?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("LINKEDIN", e.target.value)
                    }
                    disabled={!selectedPlatforms.LINKEDIN || isGenerating}
                  />
                </div>
              </TabsContent>

              <TabsContent value="TWITTER" className="m-0">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-sky-50 border-sky-200"
                  >
                    <Twitter className="h-3 w-3 mr-1 text-sky-500" />X Format
                  </Badge>

                  <Textarea
                    placeholder="X post content will appear here"
                    className="min-h-[250px]"
                    value={generatedPosts?.TWITTER?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("TWITTER", e.target.value)
                    }
                    disabled={!selectedPlatforms.TWITTER || isGenerating}
                  />
                </div>
              </TabsContent>

              <TabsContent value="BLUESKY" className="m-0">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-indigo-50 border-indigo-200"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                    >
                      <path
                        d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z"
                        fill="#0085FF"
                      />
                    </svg>
                    Bluesky Format
                  </Badge>

                  <Textarea
                    placeholder="Bluesky post content will appear here"
                    className="min-h-[250px]"
                    value={generatedPosts?.BLUESKY?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("BLUESKY", e.target.value)
                    }
                    disabled={!selectedPlatforms.BLUESKY || isGenerating}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() =>
                generatePosts({
                  content: note?.content ?? "",
                  platforms: Object.keys(selectedPlatforms).filter(
                    (platform) =>
                      selectedPlatforms[
                      platform as keyof typeof selectedPlatforms
                      ]
                  ) as Platform[],
                })
              }
              disabled={
                isGenerating || !Object.values(selectedPlatforms).some(Boolean)
              }
            >
              Regenerate
            </Button>
            <SavePostsButton
              onSaveDraft={createPost}
              onSchedule={handleSchedule}
              onPostNow={handlePostNow}
              isLoading={isPostSaving}
              selectedPlatforms={selectedPlatforms}
              hasContent={hasContent}
            />
          </CardFooter>
        </Card>
      </div>
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleConfirm}
        isLoading={isSaving}
      />
    </main>
  );
}

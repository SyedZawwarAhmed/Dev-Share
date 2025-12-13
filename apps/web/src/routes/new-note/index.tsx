import { generatePostsService } from "@/api/gemini.service";
import { addNoteService } from "@/api/note.service";
import { addPostService } from "@/api/post.service";
import SavePostsButton from "@/components/save-posts-button";
import ScheduleModal from "@/components/schedule-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Linkedin, Loader2, Save, Twitter, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/new-note/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: saveDraft, isPending: isDraftSaving } = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please login to save your note");
      }
      if (!note.title) {
        throw new Error("Please provide a title for your note before saving");
      }
      return await addNoteService(note);
    },
    onSuccess: () => {
      toast("Note saved", {
        description: "Your learning note has been saved.",
      });

      navigate({ to: "/notes", search: { search: "" } });
    },
    onError: (error: any) => {
      console.error(
        "\n\n ---> apps/web/src/routes/new-note.tsx:59 -> error: ",
        error,
      );
      toast.error(error.message || "Failed to save note");
    },
  });

  const { mutate: createPost, isPending: isPostSaving } = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please login to save your note");
      }
      if (!note.title) {
        throw new Error("Please provide a title for your note before saving");
      }
      const createdNote = await addNoteService(note);

      return await Promise.all(
        (Object.keys(generatedPosts) as Platform[])
          .filter((generatedPost) => generatedPost)
          .map((generatedPost) =>
            addPostService({
              content: generatedPosts[generatedPost].post_content ?? "",
              platform: generatedPost,
              published: false,
              noteId: createdNote?.id,
            }),
          ),
      );
    },
    onSuccess: (posts) => {
      if (posts?.length) {
        toast(`Post${posts.length > 1 ? "s" : ""} created`, {
          description: `Your post${posts.length > 1 ? "s" : ""} ${posts.length > 1 ? "have" : "has"} been created successfully.`,
        });
        navigate({ to: `/notes/${posts[0].noteId}/posts` });
      }
    },
    onError: (error: any) => {
      console.error(
        "\n\n ---> apps/web/src/routes/new-note.tsx:96 -> error: ",
        error,
      );
      if (error instanceof ZodError) {
        toast.error(fromZodError(error).message);
      } else {
        toast.error(error.message || "Failed to create posts");
      }
    },
  });

  const [note, setNote] = useState<CreateNotePayload>({
    title: "",
    content: "",
    status: "DRAFT",
  });
  const [activeTab, setActiveTab] = useState<Platform>("LINKEDIN");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    LINKEDIN: false,
    TWITTER: false,
    BLUESKY: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
        error,
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
    if (!note.title || !note.content) {
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
    timezone: string,
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
    if (!note.title || !note.content) {
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
      generatedPosts?.[platform as Platform],
  );

  return (
    <Page size="wide" className="py-6">
      <PageHeader
        title="New note"
        description="Write raw learning notes, generate drafts, then save or schedule."
        variant="compact"
      />

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Main editor */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border bg-card h-full flex flex-col mb-6">
            <div className="px-5 py-4">
              <SectionHeader
                title="Your note"
                description="Write raw learning notes first. You can generate drafts any time."
              />
            </div>
            <Divider />
            <div className="px-6 py-5 space-y-4 flex-1">
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
                <Label htmlFor="notes">Your notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Write your raw learning notes here..."
                  className="min-h-[260px]"
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-card">
            <div className="px-5 py-4">
              <SectionHeader
                title="Generate"
                description="Choose platforms, then generate drafts."
              />
            </div>
            <Divider />
            <div className="px-6 py-5 space-y-4">
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
                      disabled={
                        !user?.accounts?.some(
                          (account) => account.provider === "LINKEDIN",
                        )
                      }
                    />
                    <Label
                      htmlFor="LINKEDIN"
                      className={cn(
                        "text-sm font-normal",
                        !user?.accounts?.some(
                          (account) => account.provider === "LINKEDIN",
                        )
                          ? "text-muted-foreground cursor-not-allowed"
                          : null,
                      )}
                    >
                      LinkedIn{" "}
                      {!user?.accounts?.some(
                        (account) => account.provider === "LINKEDIN",
                      ) ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (Connect account first)
                        </span>
                      ) : null}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twitter"
                      checked={selectedPlatforms.TWITTER}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("TWITTER", checked as boolean)
                      }
                      disabled={
                        !user?.accounts?.some(
                          (account) => account.provider === "TWITTER",
                        )
                      }
                    />
                    <Label
                      htmlFor="twitter"
                      className={cn(
                        "text-sm font-normal",
                        !user?.accounts?.some(
                          (account) => account.provider === "TWITTER",
                        )
                          ? "text-muted-foreground cursor-not-allowed"
                          : null,
                      )}
                    >
                      X (Twitter){" "}
                      {!user?.accounts?.some(
                        (account) => account.provider === "TWITTER",
                      ) ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (Connect account first)
                        </span>
                      ) : null}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="BLUESKY"
                      checked={selectedPlatforms.BLUESKY}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("BLUESKY", checked as boolean)
                      }
                      disabled={
                        !user?.accounts?.some(
                          (account) => account.provider === "BLUESKY",
                        )
                      }
                    />
                    <Label
                      htmlFor="BLUESKY"
                      className={cn(
                        "text-sm font-normal",
                        !user?.accounts?.some(
                          (account) => account.provider === "BLUESKY",
                        )
                          ? "text-muted-foreground cursor-not-allowed"
                          : null,
                      )}
                    >
                      Bluesky{" "}
                      {!user?.accounts?.some(
                        (account) => account.provider === "BLUESKY",
                      ) ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (Connect account first)
                        </span>
                      ) : null}
                    </Label>
                  </div>
                </div>

                {!user?.accounts?.some((account) =>
                  ["LINKEDIN", "X", "BLUESKY"].includes(account.provider),
                ) ? (
                  <div className="mt-2 rounded-xl border bg-amber-50 p-3">
                    <p className="text-sm text-amber-800">
                      <strong>No platforms connected.</strong>{" "}
                      <Link
                        to="/connected-platforms"
                        className="underline underline-offset-2 hover:text-amber-900"
                      >
                        Connect your social media accounts
                      </Link>{" "}
                      to start generating and posting content.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => saveDraft()}
                  variant="outline"
                  disabled={isDraftSaving}
                >
                  {isDraftSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save draft
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
                          ],
                      ) as Platform[],
                    })
                  }
                  variant="gradient"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Generate + Drafts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border bg-card">
            <div className="px-5 py-4">
              <SectionHeader
                title="Generated drafts"
                description="Edit drafts, then save, schedule, or publish."
              />
            </div>
            <Divider />
            <div className="px-6 py-5">
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
                      <Linkedin className="mr-1 h-3 w-3 text-blue-600" />
                      LinkedIn format
                    </Badge>
                    <Textarea
                      placeholder="LinkedIn post content will appear here"
                      className="min-h-[260px]"
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
                      <Twitter className="mr-1 h-3 w-3 text-sky-500" />X format
                    </Badge>
                    <Textarea
                      placeholder="X post content will appear here"
                      className="min-h-[260px]"
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
                      className="mb-2 bg-zinc-50 border-zinc-200"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-3 w-3"
                      >
                        <path
                          d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z"
                          fill="#0085FF"
                        />
                      </svg>
                      Bluesky format
                    </Badge>
                    <Textarea
                      placeholder="Bluesky post content will appear here"
                      className="min-h-[260px]"
                      value={generatedPosts?.BLUESKY?.post_content || ""}
                      onChange={(e) =>
                        handlePostContentChange("BLUESKY", e.target.value)
                      }
                      disabled={!selectedPlatforms.BLUESKY || isGenerating}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Divider />
            <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  generatePosts({
                    content: note?.content ?? "",
                    platforms: Object.keys(selectedPlatforms).filter(
                      (platform) =>
                        selectedPlatforms[
                          platform as keyof typeof selectedPlatforms
                        ],
                    ) as Platform[],
                  })
                }
                disabled={
                  isGenerating ||
                  !Object.values(selectedPlatforms).some(Boolean)
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
            </div>
          </div>
        </div>
      </div>
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleConfirm}
        isLoading={isSaving}
      />
    </Page>
  );
}

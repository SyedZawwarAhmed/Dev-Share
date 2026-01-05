import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";

import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getNoteService } from "@/api/note.service";
import { generatePostsService } from "@/api/gemini.service";
import SavePostsButton from "@/components/save-posts-button";
import ScheduleModal from "@/components/schedule-modal";
import { addPostService } from "@/api/post.service";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const Route = createFileRoute("/notes/$id/create-posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { user } = useAuthStore();

  const { data: note } = useQuery({
    queryKey: [`note-${params.id}`],
    queryFn: async () => getNoteService(params.id),
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Platform>("LINKEDIN");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    LINKEDIN: false,
    TWITTER: false,
  });
  const [generatedPosts, setGeneratedPosts] = useState({
    LINKEDIN: { post_content: "" },
    TWITTER: { post_content: "" },
  });

  const { mutateAsync: generatePosts, isPending: isGenerating } = useMutation({
    mutationFn: generatePostsService,
    onSuccess: (data) => {
      // Ensure we land on a supported platform tab even if the backend returns extra keys
      const nextActive =
        (Object.keys(data) as string[]).find((key) => key === "LINKEDIN" || key === "TWITTER") ??
        "LINKEDIN";
      setActiveTab(nextActive as Platform);
      setSelectedPlatforms({
        LINKEDIN: !!data?.LINKEDIN?.post_content,
        TWITTER: !!data?.TWITTER?.post_content,
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

  const { mutate: createPost, isPending: isSaving } = useMutation({
    mutationFn: addPostService,
    onSuccess: () => {
      toast("Post created", {
        description: "Your post has been created successfully.",
      });
      window.location.href = `/notes/${params.id}/posts`;
    },
    onError: (error) => {
      console.log(
        "\n\n ---> apps/web/src/routes/notes/$id/create-posts/index.tsx:69 -> error: ",
        error
      );
      if (error instanceof ZodError) {
        toast.error(fromZodError(error).message);
      } else {
        toast.error(error.message);
      }
    },
  });

  // const handleSaveDraft = () => {
  //   const hasContent = Object.keys(selectedPlatforms).some(
  //     (platform) =>
  //       selectedPlatforms[platform as Platform] &&
  //       generatedPosts[platform as Platform]?.post_content,
  //   );

  //   if (!hasContent) {
  //     toast("No content to save", {
  //       description:
  //         "Please generate content for at least one platform before saving.",
  //     });
  //     return;
  //   }

  //   setTimeout(() => {
  //     toast("Posts saved as drafts", {
  //       description: "Your posts have been saved successfully.",
  //     });
  //     window.location.href = `/notes/${params.id}/posts`;
  //   }, 1500);
  // };

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: checked,
    }));
  };

  const handlePostContentChange = (platform: Platform, content: string) => {
    setGeneratedPosts((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], post_content: content },
    }));
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (
    date: string,
    time: string,
    timezone: string
  ) => {
    setTimeout(() => {
      toast("Posts scheduled", {
        description: `Your posts have been scheduled for ${date} at ${time} (${timezone}).`,
      });
      setShowScheduleModal(false);
      window.location.href = `/notes/${params.id}/posts`;
    }, 1500);
  };

  const handlePostNow = async () => {
    try {
      // Create posts for all selected platforms and publish them immediately
      const postPromises = Object.keys(selectedPlatforms).map(async (platform) => {
        if (selectedPlatforms[platform as Platform] && generatedPosts[platform as Platform]?.post_content) {
          const post = await addPostService({
            content: generatedPosts[platform as Platform]?.post_content ?? "",
            platform: platform as Platform,
            published: true,
            noteId: note?.id!,
          });
          return post;
        }
      });

      await Promise.all(postPromises.filter(Boolean));
      
      toast("Posts published", {
        description: "Your posts have been published successfully.",
      });
      window.location.href = `/notes/${params.id}/posts`;
    } catch (error) {
      toast.error("Failed to publish posts. Please try again.");
    }
  };

  const hasContent = Object.keys(selectedPlatforms).some(
    (platform) =>
      selectedPlatforms[platform as Platform] &&
      generatedPosts[platform as Platform]?.post_content
  );

  return (
    <Page>
      <div className="mb-6">
        <Link
          to="/notes"
          search={{
            search: ''
          }}
          className="flex items-center text-cyan-700 hover:text-cyan-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to notes
        </Link>
      </div>

      <PageHeader
        title="Create posts"
        description="Generate platform-specific posts from your note."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-2xl border bg-card">
            <div className="px-6 py-5">
              <SectionHeader
                title="Source note"
                description={note?.title ? `From: ${note.title}` : "Loading…"}
              />
            </div>
            <Divider />
            <div className="px-6 py-5 space-y-5">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="whitespace-pre-line text-sm text-foreground">
                  {note?.content}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target platforms</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="LINKEDIN"
                      checked={selectedPlatforms.LINKEDIN}
                      onCheckedChange={(checked) => handlePlatformChange("LINKEDIN", checked as boolean)}
                      disabled={!user?.accounts?.some((account) => account.provider === "LINKEDIN")}
                    />
                    <Label
                      htmlFor="LINKEDIN"
                      className={`text-sm font-normal ${
                        !user?.accounts?.some((account) => account.provider === "LINKEDIN")
                          ? "text-muted-foreground cursor-not-allowed"
                          : ""
                      }`}
                    >
                      LinkedIn{" "}
                      {!user?.accounts?.some((account) => account.provider === "LINKEDIN") ? (
                        <span className="ml-1 text-xs text-muted-foreground">(Connect account first)</span>
                      ) : null}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twitter"
                      checked={selectedPlatforms.TWITTER}
                      onCheckedChange={(checked) => handlePlatformChange("TWITTER", checked as boolean)}
                      disabled={!user?.accounts?.some((account) => account.provider === "TWITTER")}
                    />
                    <Label
                      htmlFor="twitter"
                      className={`text-sm font-normal ${
                        !user?.accounts?.some((account) => account.provider === "TWITTER")
                          ? "text-muted-foreground cursor-not-allowed"
                          : ""
                      }`}
                    >
                      X (Twitter){" "}
                      {!user?.accounts?.some((account) => account.provider === "TWITTER") ? (
                        <span className="ml-1 text-xs text-muted-foreground">(Connect account first)</span>
                      ) : null}
                    </Label>
                  </div>

                </div>

                {!user?.accounts?.some((account) =>
                  ["LINKEDIN", "TWITTER"].includes(account.provider)
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
            </div>
            <Divider />
            <div className="px-6 py-5">
              <Button
                onClick={() =>
                  generatePosts({
                    content: note?.content ?? "",
                    platforms: Object.keys(selectedPlatforms).filter(
                      (platform) => selectedPlatforms[platform as Platform]
                    ) as Platform[],
                  })
                }
                variant="gradient"
                className="w-full"
                disabled={isGenerating || !Object.values(selectedPlatforms).some(Boolean)}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate drafts
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border bg-card">
            <div className="px-6 py-5">
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
              <TabsList className="grid grid-cols-2 mb-4">
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
                  <XIcon className="h-4 w-4" />X
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
                    value={generatedPosts.LINKEDIN?.post_content || ""}
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
                    <XIcon className="h-3 w-3 mr-1 text-slate-900" />X Format
                  </Badge>

                  <Textarea
                    placeholder="X post content will appear here"
                    className="min-h-[250px]"
                    value={generatedPosts.TWITTER?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("TWITTER", e.target.value)
                    }
                    disabled={!selectedPlatforms.TWITTER || isGenerating}
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
            {note?.id ? (
              <SavePostsButton
                onSaveDraft={() => {
                  // Create posts for all selected platforms
                  Object.keys(selectedPlatforms).forEach((platform) => {
                    if (selectedPlatforms[platform as Platform] && generatedPosts[platform as Platform]?.post_content) {
                      createPost({
                        content: generatedPosts[platform as Platform]?.post_content ?? "",
                        platform: platform as Platform,
                        published: false,
                        noteId: note?.id!,
                      });
                    }
                  });
                }}
                onSchedule={handleSchedule}
                onPostNow={handlePostNow}
                isLoading={isSaving}
                selectedPlatforms={selectedPlatforms}
                hasContent={hasContent}
              />
            ) : null}
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Linkedin, Twitter } from "lucide-react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getNoteService } from "@/api/note.service";
import { generatePostsService } from "@/api/gemini.service";
import SavePostsDropdown from "@/components/save-posts-dropdown";
import ScheduleModal from "@/components/schedule-modal";
import { addPostService } from "@/api/post.service";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { useAuthStore } from "@/stores/auth.store";

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
  const [activeTab, setActiveTab] = useState("LINKEDIN");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    LINKEDIN: false,
    X: false,
    BLUESKY: false,
  });
  const [generatedPosts, setGeneratedPosts] = useState({
    LINKEDIN: { post_content: "" },
    X: { post_content: "" },
    BLUESKY: { post_content: "" },
  });

  const { mutateAsync: generatePosts, isPending: isGenerating } = useMutation({
    mutationFn: generatePostsService,
    onSuccess: (data) => {
      setActiveTab(Object.keys(data)[0] as Platform);
      setSelectedPlatforms({
        LINKEDIN: !!data?.LINKEDIN?.post_content,
        X: !!data?.X?.post_content,
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

  const handlePostNow = () => {
    setTimeout(() => {
      toast("Posts published", {
        description: "Your posts have been published successfully.",
      });
      window.location.href = `/notes/${params.id}/posts`;
    }, 1500);
  };

  const hasContent = Object.keys(selectedPlatforms).some(
    (platform) =>
      selectedPlatforms[platform as Platform] &&
      generatedPosts[platform as Platform]?.post_content
  );

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
          <h1 className="text-2xl font-bold text-purple-800">Create Posts</h1>
          <p className="text-slate-600">
            Generate platform-specific posts from your note
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Note */}
        <Card>
          <CardHeader>
            <CardTitle>Source Note: {note?.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="whitespace-pre-line">{note?.content}</div>
            </div>

            <div className="space-y-2">
              <Label>Target Platforms</Label>
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
                        (account) => account.provider === "LINKEDIN"
                      )
                    }
                  />
                  <Label
                    htmlFor="LINKEDIN"
                    className={`text-sm font-normal ${!user?.accounts?.some(
                      (account) => account.provider === "LINKEDIN"
                    )
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    LinkedIn
                    {!user?.accounts?.some(
                      (account) => account.provider === "LINKEDIN"
                    ) && (
                        <span className="text-xs text-slate-400 ml-1">
                          (Connect account first)
                        </span>
                      )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="x"
                    checked={selectedPlatforms.X}
                    onCheckedChange={(checked) =>
                      handlePlatformChange("X", checked as boolean)
                    }
                    disabled={
                      !user?.accounts?.some(
                        (account) => account.provider === "X"
                      )
                    }
                  />
                  <Label
                    htmlFor="x"
                    className={`text-sm font-normal ${!user?.accounts?.some(
                      (account) => account.provider === "X"
                    )
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    X (Twitter)
                    {!user?.accounts?.some(
                      (account) => account.provider === "X"
                    ) && (
                        <span className="text-xs text-slate-400 ml-1">
                          (Connect account first)
                        </span>
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
                    disabled={
                      !user?.accounts?.some(
                        (account) => account.provider === "BLUESKY"
                      )
                    }
                  />
                  <Label
                    htmlFor="BLUESKY"
                    className={`text-sm font-normal ${!user?.accounts?.some(
                      (account) => account.provider === "BLUESKY"
                    )
                        ? "text-slate-400 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    Bluesky
                    {!user?.accounts?.some(
                      (account) => account.provider === "BLUESKY"
                    ) && (
                        <span className="text-xs text-slate-400 ml-1">
                          (Connect account first)
                        </span>
                      )}
                  </Label>
                </div>
              </div>
              {!user?.accounts?.some((account) =>
                ["LINKEDIN", "X", "BLUESKY"].includes(account.provider)
              ) && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">
                      <strong>No platforms connected.</strong>{" "}
                      <Link
                        to="/connected-platforms"
                        className="text-amber-800 underline hover:text-amber-900"
                      >
                        Connect your social media accounts
                      </Link>{" "}
                      to start generating and posting content.
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                generatePosts({
                  content: note?.content ?? "",
                  platforms: Object.keys(selectedPlatforms).filter(
                    (platform) => selectedPlatforms[platform as Platform]
                  ) as Platform[],
                })
              }
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={
                isGenerating || !Object.values(selectedPlatforms).some(Boolean)
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Platform Posts
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Generated Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="LINKEDIN"
              value={activeTab}
              onValueChange={setActiveTab}
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
                  value="x"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.X}
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
                    value={generatedPosts.LINKEDIN?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("LINKEDIN", e.target.value)
                    }
                    disabled={!selectedPlatforms.LINKEDIN || isGenerating}
                  />
                </div>
              </TabsContent>

              <TabsContent value="x" className="m-0">
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
                    value={generatedPosts.X?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("X", e.target.value)
                    }
                    disabled={!selectedPlatforms.X || isGenerating}
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
                    value={generatedPosts.BLUESKY?.post_content || ""}
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
            {note?.id ? (
              <SavePostsDropdown
                onSaveDraft={() =>
                  createPost({
                    content: generatedPosts.LINKEDIN?.post_content ?? "",
                    platform: "LINKEDIN",
                    published: false,
                    noteId: note?.id,
                  })
                }
                onSchedule={handleSchedule}
                onPostNow={handlePostNow}
                isLoading={isSaving}
                selectedPlatforms={selectedPlatforms}
                hasContent={hasContent}
              />
            ) : null}
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

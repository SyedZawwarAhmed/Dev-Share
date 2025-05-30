import { generatePostsService } from "@/api/gemini.service";
import { addNoteService } from "@/api/note.service";
import SavePostsDropdown from "@/components/save-posts-dropdown";
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
import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Loader2, Save, Wand2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/new-note/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { mutate: saveDraft, isPending: isDraftSaving } = useMutation({
    mutationFn: addNoteService,
  });

  const [note, setNote] = useState<CreateNotePayload>({
    title: "",
    content: "",
    status: "DRAFT",
  });
  const [activeTab, setActiveTab] = useState<Platform>("LINKEDIN");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    LINKEDIN: true,
    X: true,
    BLUESKY: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [title] = useState("");
  const [notes] = useState("");

  const {
    data: generatedPosts,
    mutateAsync: generatePosts,
    isPending: isGenerating,
  } = useMutation({
    mutationFn: generatePostsService,
    onSuccess: (data) => {
      setActiveTab(Object.keys(data)[0] as Platform);
      setSelectedPlatforms({
        LINKEDIN: !!data?.LINKEDIN?.post_content,
        X: !!data?.X?.post_content,
        BLUESKY: !!data?.BLUESKY?.post_content,
      });
    },
    onError: (error) => {
      console.log(
        "\n\n ---> apps/web/src/routes/new-note/index.tsx:56 -> error: ",
        error
      );
      toast.error("Failed to generate post. Please try again.");
    },
  });

  const handleSaveDraft = async () => {
    try {
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

      saveDraft(note);
      toast("Draft saved", {
        description: "Your learning note has been saved as a draft.",
      });
    } catch (error) {
      console.error(
        "\n\n ---> apps/web/src/routes/new-note.tsx:96 -> error: ",
        error
      );
    }
  };

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
                      id="linkedin"
                      checked={selectedPlatforms.LINKEDIN}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("linkedin", checked as boolean)
                      }
                    />
                    <Label htmlFor="linkedin" className="text-sm font-normal">
                      LinkedIn
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="x"
                      checked={selectedPlatforms.X}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("x", checked as boolean)
                      }
                    />
                    <Label htmlFor="x" className="text-sm font-normal">
                      X (Twitter)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bluesky"
                      checked={selectedPlatforms.BLUESKY}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("bluesky", checked as boolean)
                      }
                    />
                    <Label htmlFor="bluesky" className="text-sm font-normal">
                      Bluesky
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={handleSaveDraft}
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
            <CardTitle>Generated Social Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="linkedin"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as Platform)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="linkedin"
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
                  <X className="h-4 w-4" />X
                </TabsTrigger>
                <TabsTrigger
                  value="bluesky"
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

              <div className="border rounded-lg p-4 min-h-[300px] bg-slate-50">
                <TabsContent value="linkedin" className="m-0">
                  {generatedPosts?.LINKEDIN ? (
                    <div className="whitespace-pre-line">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-blue-50 border-blue-200"
                      >
                        <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                        LinkedIn Format
                      </Badge>
                      <div className="mt-2">
                        {generatedPosts.LINKEDIN.post_content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 h-full flex items-center justify-center">
                      <p>Your LinkedIn post will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="x" className="m-0">
                  {generatedPosts?.X ? (
                    <div className="whitespace-pre-line">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-sky-50 border-sky-200"
                      >
                        <X className="h-3 w-3 mr-1 text-sky-500" />X Format
                      </Badge>
                      <div className="mt-2">
                        {generatedPosts?.X.post_content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 h-full flex items-center justify-center">
                      <p>Your X post will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bluesky" className="m-0">
                  {generatedPosts?.BLUESKY ? (
                    <div className="whitespace-pre-line">
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
                      <div className="mt-2">
                        {generatedPosts?.BLUESKY.post_content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 h-full flex items-center justify-center">
                      <p>Your Bluesky post will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button
              variant="outline"
              disabled={
                !generatedPosts?.[activeTab] || !selectedPlatforms?.[activeTab]
              }
            >
              Regenerate
            </Button>
            <SavePostsDropdown
              onSaveDraft={handleSaveDraft}
              onSchedule={handleSchedule}
              onPostNow={handlePostNow}
              isLoading={isSaving}
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

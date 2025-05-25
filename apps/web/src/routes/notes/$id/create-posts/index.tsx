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
import { ArrowLeft, Loader2, Save, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/notes/$id/create-posts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  const { data: note } = useQuery({
    queryKey: [`note-${params.id}`],
    queryFn: async () => getNoteService(params.id),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("linkedin");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: true,
    x: true,
    bluesky: false,
  });
  const [generatedPosts, setGeneratedPosts] = useState({
    linkedin: { post_content: "" },
    x: { post_content: "" },
    bluesky: { post_content: "" },
  });

  const { mutateAsync: generatePosts, isPending: isGenerating } = useMutation({
    mutationFn: generatePostsService,
    onSuccess: (data) => {
      setActiveTab(Object.keys(data)[0] as Platform);
      setSelectedPlatforms({
        linkedin: !!data?.linkedin?.post_content,
        x: !!data?.x?.post_content,
        bluesky: !!data?.bluesky?.post_content,
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

  const handleSavePosts = () => {
    // Validate that at least one platform is selected and has content
    const hasContent = Object.keys(selectedPlatforms).some(
      (platform) =>
        selectedPlatforms[platform as Platform] &&
        generatedPosts[platform as Platform]?.post_content,
    );

    if (!hasContent) {
      toast("No content to save", {
        description:
          "Please generate content for at least one platform before saving.",
      });
      return;
    }

    setIsSaving(true);
    // Simulate saving posts
    setTimeout(() => {
      toast("Posts created", {
        description: "Your posts have been saved successfully.",
      });
      setIsSaving(false);
      // In a real app, redirect to the posts list
      window.location.href = `/notes/${params.id}/posts`;
    }, 1500);
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
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
                    id="linkedin"
                    checked={selectedPlatforms.linkedin}
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
                    checked={selectedPlatforms.x}
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
                    checked={selectedPlatforms.bluesky}
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
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                generatePosts({
                  content: note?.content ?? "",
                  platforms: Object.keys(selectedPlatforms).filter(
                    (platform) =>
                      selectedPlatforms[
                        platform as keyof typeof selectedPlatforms
                      ],
                  ) as ("linkedin" | "x" | "bluesky")[],
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
              defaultValue="linkedin"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="linkedin"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.linkedin}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="x"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.x}
                >
                  <Twitter className="h-4 w-4" />X
                </TabsTrigger>
                <TabsTrigger
                  value="bluesky"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.bluesky}
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

              <TabsContent value="linkedin" className="m-0">
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
                    value={generatedPosts.linkedin?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("linkedin", e.target.value)
                    }
                    disabled={!selectedPlatforms.linkedin || isGenerating}
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
                    value={generatedPosts.x?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("x", e.target.value)
                    }
                    disabled={!selectedPlatforms.x || isGenerating}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bluesky" className="m-0">
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
                    value={generatedPosts.bluesky?.post_content || ""}
                    onChange={(e) =>
                      handlePostContentChange("bluesky", e.target.value)
                    }
                    disabled={!selectedPlatforms.bluesky || isGenerating}
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
                      ],
                  ) as ("linkedin" | "x" | "bluesky")[],
                })
              }
              disabled={
                isGenerating || !Object.values(selectedPlatforms).some(Boolean)
              }
            >
              Regenerate
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSavePosts}
              disabled={
                isSaving ||
                !Object.keys(selectedPlatforms).some(
                  (platform) =>
                    selectedPlatforms[platform as Platform] &&
                    generatedPosts[platform as Platform]?.post_content,
                )
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Posts
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

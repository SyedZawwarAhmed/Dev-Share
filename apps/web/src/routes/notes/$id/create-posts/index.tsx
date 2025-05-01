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

export const Route = createFileRoute("/notes/$id/create-posts/")({
  component: RouteComponent,
});

// Mock data for the note
const mockNote = {
  id: 1,
  title: "Next.js Server Actions",
  content:
    "Server Actions are a Next.js feature built on top of React Actions. They allow you to define async server functions that can be called directly from your components. This eliminates the need for API endpoints!\n\nKey features:\n- No need for API routes\n- Progressive enhancement\n- Works with and without JavaScript\n- Form handling is much simpler\n- Built-in security against CSRF attacks\n\nExample usage:\n```tsx\n'use server'\n\nasync function submitForm(formData: FormData) {\n  // Server-side code here\n  const name = formData.get('name')\n  await saveToDatabase({ name })\n}\n```\n\nThis is a game-changer for building forms and mutations in Next.js applications.",
  createdAt: "2023-04-05T14:30:00Z",
  status: "active",
};

function RouteComponent() {
  const params = Route.useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("linkedin");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: true,
    twitter: true,
    bluesky: false,
  });
  const [generatedPosts, setGeneratedPosts] = useState<{
    [key: string]: {
      content: string;
      status: "draft" | "scheduled" | "published";
    };
  }>({
    linkedin: { content: "", status: "draft" },
    twitter: { content: "", status: "draft" },
    bluesky: { content: "", status: "draft" },
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation with platform-specific content
    setTimeout(() => {
      setGeneratedPosts({
        linkedin: {
          content:
            "I recently explored Next.js Server Actions and discovered significant performance benefits.\n\nKey advantages include:\n• No need for API routes\n• Progressive enhancement\n• Works with and without JavaScript\n• Simplified form handling\n• Built-in CSRF protection\n\nThis approach represents a paradigm shift in how we build React applications, combining the best of server-rendered and client-side experiences.\n\nHave you integrated Server Actions into your workflow? I'd love to hear about your experience. #WebDevelopment #ReactJS #NextJS #FrontendDevelopment",
          status: "draft",
        },
        twitter: {
          content:
            "Just learned about Next.js Server Actions! 🚀\n\nThey let you define server functions that can be called directly from components - no API routes needed.\n\nForm handling is so much simpler now!\n\n#webdev #reactjs #nextjs",
          status: "draft",
        },
        bluesky: {
          content:
            "TIL: Next.js Server Actions are changing how we build web apps 💻\n\nThey let you define async server functions that can be called directly from your components, which means:\n- No more API routes needed\n- Progressive enhancement built-in\n- Much simpler form handling\n\nThe coolest part? They work even without JavaScript enabled!\n\n#WebDev #React #NextJS",
          status: "draft",
        },
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleSavePosts = () => {
    // Validate that at least one platform is selected and has content
    const hasContent = Object.keys(selectedPlatforms).some(
      (platform) =>
        selectedPlatforms[platform as keyof typeof selectedPlatforms] &&
        generatedPosts[platform]?.content
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

  const handlePostContentChange = (platform: string, content: string) => {
    setGeneratedPosts((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], content },
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
            <CardTitle>Source Note: {mockNote.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="whitespace-pre-line">{mockNote.content}</div>
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
                      id="twitter"
                      checked={selectedPlatforms.twitter}
                      onCheckedChange={(checked) =>
                        handlePlatformChange("twitter", checked as boolean)
                      }
                    />
                    <Label htmlFor="twitter" className="text-sm font-normal">
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
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
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
                  value="twitter"
                  className="flex items-center gap-1"
                  disabled={!selectedPlatforms.twitter}
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
                    value={generatedPosts.linkedin?.content || ""}
                    onChange={(e) =>
                      handlePostContentChange("linkedin", e.target.value)
                    }
                    disabled={!selectedPlatforms.linkedin || isGenerating}
                  />
                </div>
              </TabsContent>

              <TabsContent value="twitter" className="m-0">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-sky-50 border-sky-200"
                  >
                    <Twitter className="h-3 w-3 mr-1 text-sky-500" />X Format
                  </Badge>

                  <Textarea
                    placeholder="Twitter post content will appear here"
                    className="min-h-[250px]"
                    value={generatedPosts.twitter?.content || ""}
                    onChange={(e) =>
                      handlePostContentChange("twitter", e.target.value)
                    }
                    disabled={!selectedPlatforms.twitter || isGenerating}
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
                    value={generatedPosts.bluesky?.content || ""}
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
              onClick={handleGenerate}
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
                    selectedPlatforms[
                      platform as keyof typeof selectedPlatforms
                    ] && generatedPosts[platform]?.content
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

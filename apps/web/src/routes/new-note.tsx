import { addNote } from "@/api/note.service";
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
import { Linkedin, Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/new-note")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { mutate: saveDraft, isPending: isDraftSaving } = useMutation({
    mutationFn: addNote,
  });

  const [note, setNote] = useState<CreateNotePayload>({
    userId: "",
    title: "",
    content: "",
    status: "DRAFT",
  });
  const [generatedPosts] = useState({
    linkedin: "",
    twitter: "",
    bluesky: "",
  });
  const [activeTab, setActiveTab] = useState("linkedin");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: true,
    twitter: true,
    bluesky: false,
  });

  const handleGenerate = () => {
    // if (!title || !notes) {
    //   toast("Missing information", {
    //     description:
    //       "Please provide both a title and notes before generating posts.",
    //   });
    //   return;
    // }
    // setIsGenerating(true);
    // // Simulate AI generation with platform-specific content
    // setTimeout(() => {
    //   setGeneratedPosts({
    //     linkedin:
    //       "I recently explored React Server Components in Next.js and discovered significant performance benefits.\n\nKey advantages include:\n• Reduced client-side JavaScript\n• Automatic code splitting\n• Direct access to backend resources\n• Improved SEO\n\nThis approach represents a paradigm shift in how we build React applications, combining the best of server-rendered and client-side experiences.\n\nHave you integrated Server Components into your workflow? I'd love to hear about your experience. #WebDevelopment #ReactJS #NextJS #FrontendDevelopment",
    //     twitter:
    //       "Just learned about React Server Components in Next.js! 🚀\n\nThey allow server-side rendering with smaller JS bundles and direct backend access.\n\nGame-changer for performance and DX!\n\n#webdev #reactjs #nextjs",
    //     bluesky:
    //       "TIL: React Server Components in Next.js are changing how we build web apps 💻\n\nThey let you render React components on the server, which means:\n- Less JavaScript sent to the browser\n- Better performance\n- Direct database/filesystem access\n\nThe coolest part? You can mix server and client components in the same app!\n\n#WebDev #React #NextJS",
    //   });
    //   setIsGenerating(false);
    // }, 2000);
  };

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

      saveDraft({ ...note, userId: user.id });
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
              onClick={handleGenerate}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              // disabled={isGenerating}
            >
              {/* {isGenerating ? ( */}
              {/*   <> */}
              {/*     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
              {/*     Generating... */}
              {/*   </> */}
              {/* ) : ( */}
              {/*   <> */}
              {/*     <Wand2 className="mr-2 h-4 w-4" /> */}
              {/*     Generate Posts */}
              {/*   </> */}
              {/* )} */}
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
                  <X className="h-4 w-4" />X
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

              <div className="border rounded-lg p-4 min-h-[300px] bg-slate-50">
                <TabsContent value="linkedin" className="m-0">
                  {generatedPosts.linkedin ? (
                    <div className="whitespace-pre-line">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-blue-50 border-blue-200"
                      >
                        <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                        LinkedIn Format
                      </Badge>
                      <div className="mt-2">{generatedPosts.linkedin}</div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 h-full flex items-center justify-center">
                      <p>Your LinkedIn post will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="twitter" className="m-0">
                  {generatedPosts.twitter ? (
                    <div className="whitespace-pre-line">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-sky-50 border-sky-200"
                      >
                        <X className="h-3 w-3 mr-1 text-sky-500" />X Format
                      </Badge>
                      <div className="mt-2">{generatedPosts.twitter}</div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 h-full flex items-center justify-center">
                      <p>Your X post will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bluesky" className="m-0">
                  {generatedPosts.bluesky ? (
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
                      <div className="mt-2">{generatedPosts.bluesky}</div>
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
                !generatedPosts[activeTab as keyof typeof generatedPosts] ||
                !selectedPlatforms[activeTab as keyof typeof selectedPlatforms]
              }
            >
              Regenerate
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              disabled={
                !generatedPosts[activeTab as keyof typeof generatedPosts] ||
                !selectedPlatforms[activeTab as keyof typeof selectedPlatforms]
              }
            >
              Schedule Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

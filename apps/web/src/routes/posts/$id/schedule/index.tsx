import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlatformAuthModal from "@/components/platform-auth-modal";
import { toast } from "sonner";

// Mock data for the post
const mockPost = {
  id: 102,
  noteId: 1,
  noteTitle: "Next.js Server Actions",
  platform: "X" as Platform,
  content:
    "Just learned about Next.js Server Actions! 🚀\n\nThey let you define server functions that can be called directly from components - no API routes needed.\n\nForm handling is so much simpler now!\n\n#webdev #reactjs #nextjs",
  status: "draft",
  createdAt: "2023-04-05T16:30:00Z",
  updatedAt: "2023-04-05T16:45:00Z",
};

// Mock auth status - in real app this would come from your auth state
const mockAuthStatus = {
  LINKEDIN: true,
  X: false,
  BLUESKY: false,
};

export const Route = createFileRoute("/posts/$id/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const params = Route.useParams();
  const [isScheduling, setIsScheduling] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeZone, setTimeZone] = useState("America/New_York");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    mockAuthStatus[mockPost.platform]
  );

  const handleSchedule = () => {
    // Check if user is authenticated for this platform
    if (!isAuthenticated) {
      // Store the current page URL for redirect after auth
      localStorage.setItem("auth_redirect_url", window.location.href);
      setShowAuthModal(true);
      return;
    }

    if (!date || !time) {
      toast("Missing information", {
        description: "Please select both a date and time for scheduling.",
      });
      return;
    }

    setIsScheduling(true);
    // Simulate scheduling
    setTimeout(() => {
      toast("Post scheduled", {
        description: "Your post has been scheduled successfully.",
      });
      setIsScheduling(false);
      // In a real app, redirect back to the posts list
      window.location.href = "/posts";
    }, 1500);
  };

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
    toast("Account connected", {
      description: `Your ${mockPost.platform} account is now connected.`,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return (
          <Badge variant="outline" className="mb-2 bg-blue-50 border-blue-200">
            <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
            LinkedIn
          </Badge>
        );
      case "twitter":
        return (
          <Badge variant="outline" className="mb-2 bg-sky-50 border-sky-200">
            <Twitter className="h-3 w-3 mr-1 text-sky-500" />X
          </Badge>
        );
      case "bluesky":
        return (
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
            Bluesky
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          to="/posts"
          search={{ status: "" }}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Posts
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Schedule Post</h1>
          <p className="text-slate-600">
            Schedule your {mockPost.platform} post for note:{" "}
            {mockPost.noteTitle}
          </p>
        </div>
      </div>

      {!isAuthenticated && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 mb-1">
                  Authorization Required
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You need to connect your {mockPost.platform} account before
                  you can schedule posts.
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Connect {mockPost.platform === "X" ? "X" : mockPost.platform}{" "}
                  Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getPlatformIcon(mockPost.platform)}
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="whitespace-pre-line">{mockPost.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!isAuthenticated}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!isAuthenticated}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select
                  value={timeZone}
                  onValueChange={setTimeZone}
                  disabled={!isAuthenticated}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time (ET)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (CT)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (MT)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (PT)
                    </SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                <p>
                  <strong>Tip:</strong> Schedule your posts during peak
                  engagement hours for your audience. For professional content,
                  weekdays between 8-10 AM or 4-6 PM often work well.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="/posts" search={{ status: "" }}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSchedule}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isScheduling || (!isAuthenticated && !showAuthModal)}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : !isAuthenticated ? (
                "Connect Account First"
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <PlatformAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        platform={mockPost.platform}
        onAuthComplete={handleAuthComplete}
      />
    </main>
  );
}

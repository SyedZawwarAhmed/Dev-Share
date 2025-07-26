import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Twitter, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import PlatformAuthModal from "@/components/platform-auth-modal";

export const Route = createFileRoute("/connected-platforms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("LINKEDIN");

  const platforms = [
    {
      id: "LINKEDIN" as Platform,
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      isConnected: user?.accounts?.some(account => account.provider === "LINKEDIN") || false,
      username: user?.accounts?.find(account => account.provider === "LINKEDIN")?.providerAccountId || "",
    },
    {
      id: "X" as Platform,
      name: "X (Twitter)",
      icon: <Twitter className="h-6 w-6 text-slate-900" />,
      color: "bg-slate-50 border-slate-200",
      isConnected: user?.accounts?.some(account => account.provider === "X") || false,
      username: user?.accounts?.find(account => account.provider === "X")?.providerAccountId || "",
    },
    {
      id: "BLUESKY" as Platform,
      name: "Bluesky",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 0L14.9282 4V12L8 16L1.0718 12V4L8 0Z" fill="#0085FF" />
        </svg>
      ),
      color: "bg-indigo-50 border-indigo-200",
      isConnected: user?.accounts?.some(account => account.provider === "BLUESKY") || false,
      username: user?.accounts?.find(account => account.provider === "BLUESKY")?.providerAccountId || "",
    },
  ];

  const handleConnectPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setShowAuthModal(true);
  };

  const handleAuthComplete = () => {
    toast.success("Account connected successfully!", {
      description: `Your ${selectedPlatform} account is now connected.`,
    });
    setShowAuthModal(false);
  };

  const connectedCount = platforms.filter(p => p.isConnected).length;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Connected Platforms</h1>
        <p className="text-slate-600">
          Connect your social media accounts to automatically share your learning posts.
        </p>
      </div>

      {connectedCount === 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ExternalLink className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 mb-1">
                  No platforms connected
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  Connect at least one social media platform to start sharing your learning posts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {platform.name}
                    </CardDescription>
                  </div>
                </div>
                {platform.isConnected ? (
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {platform.isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="text-xs">
                        {platform.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{platform.username}</p>
                      <p className="text-xs text-slate-500">Connected account</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleConnectPlatform(platform.id)}
                  >
                    Reconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <div className="p-3 bg-slate-100 rounded-lg inline-block mb-2">
                      {platform.icon}
                    </div>
                    <p className="text-sm text-slate-500">
                      Not connected yet
                    </p>
                  </div>
                  <Button
                    onClick={() => handleConnectPlatform(platform.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Connect {platform.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Why connect your platforms?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Automatically share your learning notes as optimized posts</li>
          <li>• Schedule posts for optimal engagement times</li>
          <li>• Maintain consistent posting across all your platforms</li>
          <li>• Track your content performance in one place</li>
        </ul>
      </div>

      <PlatformAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        platform={selectedPlatform}
        onAuthComplete={handleAuthComplete}
      />
    </main>
  );
} 

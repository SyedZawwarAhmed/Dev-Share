import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Linkedin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Unlink,
} from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import PlatformAuthModal from "@/components/platform-auth-modal";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectAccountService } from "@/api/auth.service";
import { getAuthUrl } from "@/lib/auth";
import { getPlatformName } from "@/lib/utils";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { Divider } from "@/components/layout/Divider";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const Route = createFileRoute("/connected-platforms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, setUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("LINKEDIN");
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showReconnectDialog, setShowReconnectDialog] = useState(false);
  const [actionPlatform, setActionPlatform] = useState<Platform | null>(null);
  const queryClient = useQueryClient();

  const { mutate: disconnectAccount, isPending: isDisconnecting } = useMutation(
    {
      mutationFn: (provider: string) => disconnectAccountService(provider),
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Account disconnected successfully");
        setShowDisconnectDialog(false);
        setActionPlatform(null);
      },
      onError: () => {
        toast.error("Failed to disconnect account");
      },
    }
  );

  const openDisconnectDialog = (platform: Platform) => {
    setActionPlatform(platform);
    setShowDisconnectDialog(true);
  };

  const openReconnectDialog = (platform: Platform) => {
    setActionPlatform(platform);
    setShowReconnectDialog(true);
  };

  const handleDisconnect = () => {
    if (actionPlatform) {
      disconnectAccount(actionPlatform);
    }
  };

  const handleReconnect = () => {
    if (actionPlatform) {
      const userId = actionPlatform === "TWITTER" ? user?.id : undefined;
      window.location.href = getAuthUrl(actionPlatform, userId);
    }
  };

  const platforms = [
    {
      id: "LINKEDIN" as Platform,
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      isConnected:
        user?.accounts?.some((account) => account.provider === "LINKEDIN") ||
        false,
      username:
        user?.accounts?.find((account) => account.provider === "LINKEDIN")
          ?.username || "",
    },
    {
      id: "TWITTER" as Platform,
      name: "X (Twitter)",
      icon: <XIcon className="h-6 w-6 text-slate-900" />,
      color: "bg-slate-50 border-slate-200",
      isConnected:
        user?.accounts?.some((account) => account.provider === "TWITTER") ||
        false,
      username:
        user?.accounts?.find((account) => account.provider === "TWITTER")
          ?.username || "",
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

  const connectedCount = platforms.filter((p) => p.isConnected).length;

  return (
    <Page>
      <PageHeader
        title="Connected Platforms"
        description="Connect your social media accounts to automatically share your learning posts."
      />

      {connectedCount === 0 && (
        <div className="mb-6 rounded-2xl border bg-card p-6">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-muted">
              <ExternalLink className="h-5 w-5 text-cyan-700" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-medium text-foreground">
                No platforms connected
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect at least one social media platform to start sharing your
                learning posts.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader
            title="Platforms"
            description="Connect accounts to generate and publish posts."
          />
        </div>
        <Divider />
        <div className="divide-y">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border ${platform.color}`}>
                  {platform.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{platform.name}</p>
                    {platform.isConnected ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted/40">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not connected
                      </Badge>
                    )}
                  </div>
                  {platform.isConnected ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="/placeholder.svg?height=28&width=28" />
                        <AvatarFallback className="text-xs">
                          {platform.username?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {platform.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Connected account
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Not connected yet
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                {platform.isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReconnectDialog(platform.id)}
                    >
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Reconnect
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDisconnectDialog(platform.id)}
                    >
                      <Unlink className="mr-1.5 h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleConnectPlatform(platform.id)}
                    variant="gradient"
                  >
                    Connect {platform.name}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-card">
        <div className="px-6 py-5">
          <SectionHeader title="Why connect platforms?" />
        </div>
        <Divider />
        <div className="px-6 py-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Automatically turn learning notes into optimized posts</li>
            <li>Schedule posts for consistent publishing</li>
            <li>Publish across platforms without rewriting</li>
            <li>Keep everything organized in one place</li>
          </ul>
        </div>
      </div>

      <PlatformAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        platform={selectedPlatform}
        onAuthComplete={handleAuthComplete}
      />

      <ConfirmationDialog
        open={showDisconnectDialog}
        onOpenChange={setShowDisconnectDialog}
        title={`Disconnect ${getPlatformName(actionPlatform)}?`}
        description={`Are you sure you want to disconnect your ${getPlatformName(actionPlatform)} account? You won't be able to post to this platform until you reconnect.`}
        confirmText="Disconnect"
        confirmVariant="destructive"
        onConfirm={handleDisconnect}
        loading={isDisconnecting}
      />

      <ConfirmationDialog
        open={showReconnectDialog}
        onOpenChange={setShowReconnectDialog}
        title={`Reconnect ${getPlatformName(actionPlatform)}?`}
        description={`You will be redirected to ${getPlatformName(actionPlatform)} to re-authorize your account. This will refresh your access tokens.`}
        confirmText="Reconnect"
        confirmVariant="gradient"
        onConfirm={handleReconnect}
      />
    </Page>
  );
}

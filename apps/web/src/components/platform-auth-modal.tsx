import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink, Shield } from "lucide-react";
import { Linkedin, Twitter } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { getAuthUrl } from "@/lib/auth";

interface PlatformAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  onAuthComplete: () => void;
}

export default function PlatformAuthModal({
  isOpen,
  onClose,
  platform,
  onAuthComplete,
}: PlatformAuthModalProps) {
  const { user } = useAuthStore();

  // Map frontend platform to backend provider
  const getProviderName = (platform: Platform) => {
    if (platform === "TWITTER") return "TWITTER";
    return platform;
  };

  const isAuthenticated = user?.accounts?.some(
    (userAccount) => userAccount.provider === getProviderName(platform),
  );

  const platformConfig = {
    LINKEDIN: {
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      description:
        "Connect your LinkedIn account to share professional content with your network.",
      permissions: ["Post on your behalf", "Access basic profile information"],
    },
    TWITTER: {
      name: "X (Twitter)",
      icon: <Twitter className="h-6 w-6 text-slate-900" />,
      color: "bg-slate-50 border-slate-200",
      description:
        "Connect your X account to share quick updates and engage with the developer community.",
      permissions: [
        "Post tweets on your behalf",
        "Access basic profile information",
      ],
    },
    BLUESKY: {
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
      description:
        "Connect your Bluesky account to share content on the decentralized social network.",
      permissions: ["Post on your behalf", "Access basic profile information"],
    },
  };

  const config = platformConfig[platform];

  const handleAuth = () => {
    const userId = platform === "TWITTER" ? user?.id : undefined;
    window.location.href = getAuthUrl(platform, userId);
  };

  const handleContinue = () => {
    onAuthComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {isAuthenticated
              ? `Connected to ${config.name}`
              : `Connect to ${config.name}`}
          </DialogTitle>
          <DialogDescription>
            {isAuthenticated
              ? `Your ${config.name} account is connected and ready to use.`
              : config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Account Connected
              </span>
              <Badge
                variant="outline"
                className="ml-auto bg-green-100 border-green-300 text-green-700"
              >
                Authorized
              </Badge>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-lg border ${config.color}`}>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-slate-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Permissions Required
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {config.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p>
                  <strong>Secure:</strong> We use OAuth 2.0 for secure
                  authentication. We never store your password and you can
                  revoke access at any time.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isAuthenticated ? (
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleAuth}
              // disabled={isAuthenticating}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {/* {isAuthenticating ? ( */}
              {/*   <> */}
              {/*     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
              {/*     Connecting... */}
              {/*   </> */}
              {/* ) : ( */}
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect {config.name}
              </>
              {/* )} */}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

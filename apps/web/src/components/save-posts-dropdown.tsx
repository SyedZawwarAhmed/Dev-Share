import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Loader2, Save, Send } from "lucide-react";
import PlatformAuthModal from "@/components/platform-auth-modal";
import { toast } from "sonner";

interface SavePostsDropdownProps {
  onSaveDraft: () => void;
  onSchedule: () => void;
  onPostNow: () => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedPlatforms: { [key: string]: boolean };
  hasContent: boolean;
}

// Mock auth status - in real app this would come from your auth state
const mockAuthStatus = {
  linkedin: true,
  x: false,
  bluesky: false,
};

export default function SavePostsDropdown({
  onSaveDraft,
  onSchedule,
  onPostNow,
  isLoading,
  disabled = false,
  selectedPlatforms,
  hasContent,
}: SavePostsDropdownProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "schedule" | "post" | null
  >(null);
  const [authPlatform, setAuthPlatform] = useState<Platform>("linkedin");

  const checkAuthAndExecute = (action: "schedule" | "post") => {
    if (!hasContent) {
      toast("No content to save", {
        description:
          "Please generate content for at least one platform before proceeding.",
      });
      return;
    }

    // Check if any selected platform needs authentication
    const selectedPlatformKeys = Object.keys(selectedPlatforms).filter(
      (platform) => selectedPlatforms[platform],
    ) as Array<keyof typeof mockAuthStatus>;

    const unauthenticatedPlatform = selectedPlatformKeys.find(
      (platform) => !mockAuthStatus[platform],
    );

    if (unauthenticatedPlatform) {
      // Store the current page URL for redirect after auth
      localStorage.setItem("auth_redirect_url", window.location.href);
      setAuthPlatform(unauthenticatedPlatform);
      setPendingAction(action);
      setShowAuthModal(true);
      return;
    }

    // All platforms are authenticated, proceed with action
    if (action === "schedule") {
      onSchedule();
    } else {
      onPostNow();
    }
  };

  const handleAuthComplete = () => {
    toast("Account connected", {
      description: `Your ${authPlatform} account is now connected.`,
    });

    // Execute the pending action
    if (pendingAction === "schedule") {
      onSchedule();
    } else if (pendingAction === "post") {
      onPostNow();
    }

    setPendingAction(null);
  };

  return (
    <>
      <div className="flex">
        <Button
          onClick={onSaveDraft}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-r-none"
          disabled={isLoading || disabled}
        >
          {isLoading ? (
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

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-l-none border-l border-purple-500 px-2"
              disabled={isLoading || disabled}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onSaveDraft} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => checkAuthAndExecute("schedule")}
              disabled={isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Posts
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => checkAuthAndExecute("post")}
              disabled={isLoading}
            >
              <Send className="mr-2 h-4 w-4" />
              Post Now
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PlatformAuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        platform={authPlatform}
        onAuthComplete={handleAuthComplete}
      />
    </>
  );
}

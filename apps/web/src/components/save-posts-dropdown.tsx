import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Loader2, Save, Send } from "lucide-react";
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

export default function SavePostsDropdown({
  onSaveDraft,
  onSchedule,
  onPostNow,
  isLoading,
  disabled = false,
  selectedPlatforms,
  hasContent,
}: SavePostsDropdownProps) {
  const handleAction = (action: "schedule" | "post") => {
    if (!hasContent) {
      toast("No content to save", {
        description:
          "Please generate content for at least one platform before proceeding.",
      });
      return;
    }

    // Check if any platforms are selected
    const hasSelectedPlatforms = Object.values(selectedPlatforms).some(Boolean);
    if (!hasSelectedPlatforms) {
      toast("No platforms selected", {
        description: "Please select at least one platform to post to.",
      });
      return;
    }

    // Execute the action
    if (action === "schedule") {
      onSchedule();
    } else {
      onPostNow();
    }
  };

  return (
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
            onClick={() => handleAction("schedule")}
            disabled={isLoading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Posts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction("post")}
            disabled={isLoading}
          >
            <Send className="mr-2 h-4 w-4" />
            Post Now
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

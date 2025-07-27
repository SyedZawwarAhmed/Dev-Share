import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

type SavePostsDropdownProps = {
  onSaveDraft: () => void;
  onSchedule: () => void;
  onPostNow: () => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedPlatforms: { [key: string]: boolean };
  hasContent: boolean;
}

export default function SavePostsButton({
  onSaveDraft,
  isLoading,
  disabled = false,
}: SavePostsDropdownProps) {

  return (
    <div className="flex">
      <Button
        onClick={onSaveDraft}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-md"
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
    </div>
  );
}

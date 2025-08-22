import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface LinkedInReauthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkedInReauthDialog({ open, onOpenChange }: LinkedInReauthDialogProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleReauthenticate = () => {
    setIsNavigating(true);
    
    // Get the current origin for the callback
    const origin = window.location.origin;
    
    // Navigate to LinkedIn OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/linkedin?redirectUrl=${encodeURIComponent(origin + '/connected-platforms')}`;
  };

  const handleGoToSettings = () => {
    onOpenChange(false);
    window.location.href = '/connected-platforms';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
            LinkedIn Authentication Required
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-center">
            Your LinkedIn access token has expired. Please re-authenticate with LinkedIn to continue posting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Why did this happen?</strong> LinkedIn access tokens expire after 60 days for security reasons. 
            This is normal and helps keep your account safe.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleGoToSettings}
            className="w-full sm:w-auto"
          >
            Go to Settings
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={handleReauthenticate}
            disabled={isNavigating}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isNavigating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting...
              </>
            ) : (
              <>
                Re-authenticate LinkedIn
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
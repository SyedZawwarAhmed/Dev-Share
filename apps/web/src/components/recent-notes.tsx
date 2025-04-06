import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

export default function RecentNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Learning Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">Next.js Server Actions</span>
            <Badge
              variant="outline"
              className="ml-auto text-xs bg-amber-50 border-amber-200 text-amber-700"
            >
              Draft
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mb-2">Added 2 hours ago</p>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Create Post
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">React Optimistic UI</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Added yesterday</p>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Create Post
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">Rust Web Development</span>
            <Badge
              variant="outline"
              className="ml-auto text-xs bg-amber-50 border-amber-200 text-amber-700"
            >
              Draft
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mb-2">Added 3 days ago</p>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Create Post
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <Link to="/notes" className="block text-center">
          <Button variant="link" size="sm" className="text-purple-600">
            View all notes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

import { Badge } from "./ui/badge";

export const getStatusBadge = (status: Post["status"]) => {
  switch (status) {
    case "DRAFT":
      return (
        <Badge
          variant="outline"
          className="text-xs bg-amber-50 border-amber-200 text-amber-700"
        >
          Draft
        </Badge>
      );
    case "SCHEDULED":
      return (
        <Badge
          variant="outline"
          className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700"
        >
          Scheduled
        </Badge>
      );
    case "PUBLISHED":
      return (
        <Badge
          variant="outline"
          className="text-xs bg-blue-50 border-blue-200 text-blue-700"
        >
          Published
        </Badge>
      );
    default:
      return null;
  }
};

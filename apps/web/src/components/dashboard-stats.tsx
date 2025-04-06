import { BarChart3, Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Scheduled</p>
              <h3 className="text-2xl font-bold text-purple-900">3</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Posted</p>
              <h3 className="text-2xl font-bold text-blue-900">42</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg mr-4">
              <ThumbsUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Engagements
              </p>
              <h3 className="text-2xl font-bold text-emerald-900">1.2k</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg mr-4">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Platforms</p>
              <h3 className="text-2xl font-bold text-amber-900">3</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

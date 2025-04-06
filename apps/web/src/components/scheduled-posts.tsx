"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Edit,
  Linkedin,
  MoreHorizontal,
  Send,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ScheduledPosts() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {/* Post 1 */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    Today
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    3:00 PM
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>Post now</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-slate-700 mb-4">
                Just learned how to implement server actions in Next.js 14! 🚀
                The new approach simplifies form handling and data mutations
                without needing API routes. Here's a quick example of how it
                works...
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600">Your account</span>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 border-blue-200"
                  >
                    <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                    LinkedIn
                  </Badge>
                  <Badge variant="outline" className="bg-sky-50 border-sky-200">
                    <Twitter className="h-3 w-3 mr-1 text-sky-500" />X
                  </Badge>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    Tomorrow
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    9:00 AM
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>Post now</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-slate-700 mb-4">
                TIL: You can use the new `useOptimistic` hook in React to create
                responsive UIs that update immediately while the actual
                operation happens in the background. Perfect for form
                submissions!
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600">Your account</span>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 border-blue-200"
                  >
                    <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                    LinkedIn
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 border-amber-200 text-amber-700"
                  >
                    Draft
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>

              <p className="text-slate-700 mb-4">
                Exploring Rust for web development today. The performance
                benefits are impressive, but the learning curve is steep
                compared to JavaScript. Worth it for certain use cases though!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="published" className="mt-4">
            <div className="text-center py-8 text-slate-500">
              <p>Your published posts will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

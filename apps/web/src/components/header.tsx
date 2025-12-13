import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function AppHeader() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Don't show header on auth pages
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  const handleLogout = async () => {
    try {
      logout();
      toast("Successfully logged out!");
      navigate({ to: "/login" });
    } catch (error) {
      console.error(
        "\n\n ---> apps/web/src/components/header.tsx:39 -> error: ",
        error,
      );
      toast("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-white text-sm font-semibold">
              DS
            </span>
            <span className="text-sm font-semibold tracking-tight">DevShare</span>
          </Link>

          <nav className="hidden md:flex ml-8 space-x-1">
            <Link to="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/notes">
              <Button
                variant={
                  pathname === "/notes" || pathname.startsWith("/notes/")
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
              >
                Notes
              </Button>
            </Link>
            <Link to="/posts">
              <Button
                variant={
                  pathname === "/posts" || pathname.startsWith("/posts/")
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
              >
                Posts
              </Button>
            </Link>
            <Link to="/connected-platforms">
              <Button
                variant={
                  pathname === "/connected-platforms" ||
                  pathname.startsWith("/connected-platforms/")
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
              >
                Connected Platforms
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-cyan-500 p-0 text-white">
                  <span className="text-[10px]">2</span>
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="cursor-pointer p-3 hover:bg-zinc-50">
                  <p className="text-sm font-medium">
                    Your post is ready to be published
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    React Server Components post is scheduled for today at 3:00
                    PM
                  </p>
                </div>
                <div className="cursor-pointer p-3 hover:bg-zinc-50">
                  <p className="text-sm font-medium">
                    Post published successfully
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your post about TypeScript 5.0 Features was published to
                    LinkedIn
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-cyan-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt="User" />
                  <AvatarFallback>
                    {user?.firstName?.[0] ?? "U"}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

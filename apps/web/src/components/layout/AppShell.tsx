import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  Plug,
  Send,
} from "lucide-react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (p) => p === "/dashboard",
  },
  {
    to: "/notes",
    label: "Notes",
    icon: NotebookPen,
    isActive: (p) => p === "/notes" || p.startsWith("/notes/"),
  },
  {
    to: "/posts",
    label: "Posts",
    icon: Send,
    isActive: (p) => p === "/posts" || p.startsWith("/posts/"),
  },
  {
    to: "/connected-platforms",
    label: "Platforms",
    icon: Plug,
    isActive: (p) =>
      p === "/connected-platforms" || p.startsWith("/connected-platforms/"),
  },
];

function AppSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
      <div className="flex h-16 items-center gap-2 px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-sm font-semibold">
            DS
          </span>
          <span className="text-sm font-semibold tracking-tight">DevShare</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-950 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-cyan-300" : "text-muted-foreground"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-4 py-4">
        <p className="text-xs text-muted-foreground">
          Keep shipping your learning in public.
        </p>
      </div>
    </aside>
  );
}

function MobileNav({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pathname: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-sm">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-sm font-semibold">
              DS
            </span>
            DevShare
          </DialogTitle>
        </DialogHeader>
        <div className="p-3">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active ? "bg-zinc-950 text-white" : "hover:bg-accent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-cyan-300" : "text-muted-foreground"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // No shell for landing & auth.
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  ) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AppSidebar pathname={pathname} />

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  Welcome back
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.firstName
                    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                    : "DevShare"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/new-note">
                <Button variant="gradient" className="hidden sm:inline-flex">
                  New note
                </Button>
              </Link>

              {/* <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImage} alt="User" />
                      <AvatarFallback>
                        {user?.firstName?.[0] ?? "U"}
                        {user?.lastName?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <MobileNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          pathname={pathname}
        />

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

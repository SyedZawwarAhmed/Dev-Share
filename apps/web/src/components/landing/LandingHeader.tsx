import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Link } from "@tanstack/react-router";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

export function LandingHeader() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-white text-sm font-semibold">
            DS
          </span>
          <span className="text-sm font-semibold tracking-tight">DevShare</span>
        </Link>

        <nav className="flex items-center gap-2">
          <a
            href="#features"
            className={cn(
              "hidden text-sm text-muted-foreground sm:inline-flex",
              landingTheme.accentTextHover
            )}
          >
            Features
          </a>

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  className={cn(
                    "bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
                    landingTheme.accentRing
                  )}
                >
                  Sign up
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button
                className={cn(
                  "bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
                  landingTheme.accentRing
                )}
              >
                Go to dashboard
              </Button>
            </Link>
          )}
        </nav>
      </Container>
    </header>
  );
}



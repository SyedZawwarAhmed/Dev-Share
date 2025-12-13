import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

export function Footer() {
  return (
    <footer className="border-t py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-white text-sm font-semibold">
              DS
            </span>
            <span className="text-sm font-semibold tracking-tight">DevShare</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your developer journey, effortlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#features" className={cn(landingTheme.accentTextHover)}>
            Features
          </a>
          <a href="#how-it-works" className={cn(landingTheme.accentTextHover)}>
            How it works
          </a>
          <span className="text-xs">
            © {new Date().getFullYear()} DevShare
          </span>
        </div>
      </Container>
    </footer>
  );
}



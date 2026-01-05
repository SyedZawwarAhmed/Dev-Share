import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

export function Hero() {
  const { isAuthenticated } = useAuthStore();
  const primaryTo = isAuthenticated ? "/dashboard" : "/signup";

  return (
    <section className="relative overflow-hidden">
      <Container className="relative py-14 sm:py-18 lg:py-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />

        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  landingTheme.accentBg
                )}
              />
              Turn notes into posts. Keep your voice.
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Share your developer journey without the busywork.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 mx-auto max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              DevShare transforms your learning notes into platform-ready posts
              for LinkedIn and X so you can stay consistent while you learn.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center">
              <Link to={primaryTo} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className={cn(
                    "w-full bg-zinc-950 text-white hover:bg-zinc-900 sm:w-auto dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
                    landingTheme.accentRing
                  )}
                >
                  {isAuthenticated ? "Go to dashboard" : "Get started"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "w-full border-zinc-200 bg-white/60 text-zinc-900 hover:bg-white sm:w-auto",
                    landingTheme.accentRing
                  )}
                >
                  See how it works
                </Button>
              </a>
            </div>
          </Reveal>

          {/* <ul className="mt-8 mx-auto grid max-w-2xl gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center justify-center gap-2">
              <Check className={cn("h-4 w-4", landingTheme.accentText)} />
              Generate platform-specific drafts
            </li>
            <li className="flex items-center justify-center gap-2">
              <Check className={cn("h-4 w-4", landingTheme.accentText)} />
              Review, edit, schedule
            </li>
            <li className="flex items-center justify-center gap-2">
              <Check className={cn("h-4 w-4", landingTheme.accentText)} />
              Stay on-brand with your voice
            </li>
            <li className="flex items-center justify-center gap-2">
              <Check className={cn("h-4 w-4", landingTheme.accentText)} />
              Built for developers
            </li>
          </ul> */}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl  border-2 border-gray-100 bg-background shadow-sm sm:rounded-3xl">
              <img
                src="/dashboard-screenshot.png"
                alt="DevShare dashboard preview"
                className="h-auto w-full"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

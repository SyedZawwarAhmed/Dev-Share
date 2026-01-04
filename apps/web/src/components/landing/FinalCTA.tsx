import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

export function FinalCTA() {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border bg-zinc-950 p-8 text-white sm:p-10">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
            <div className="absolute right-0 top-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className={cn("text-xs font-medium", landingTheme.accentText)}>
                  Ready when you are
                </p>
                <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  Make sharing your learning effortless.
                </h2>
                <p className="mt-4 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
                  Start with one note. Get a clean draft. Build a habit.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className={cn(
                      "w-full bg-white text-zinc-950 hover:bg-zinc-200 sm:w-auto",
                      landingTheme.accentRing
                    )}
                  >
                    Start free
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}



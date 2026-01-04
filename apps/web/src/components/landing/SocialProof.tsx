import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

export function SocialProof() {
  return (
    <section className="border-y bg-zinc-50/60 py-10">
      <Container className="grid gap-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Works great for sharing on
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["LinkedIn", "X"].map((name) => (
              <span
                key={name}
                className={cn(
                  "inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-zinc-700",
                  landingTheme.accentBorder
                )}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs text-muted-foreground">From note to draft</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              Minutes
            </p>
          </div>
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs text-muted-foreground">
              Your voice, preserved
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">Consistent</p>
          </div>
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs text-muted-foreground">Review before posting</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">Always</p>
          </div>
        </div>
      </Container>
    </section>
  );
}



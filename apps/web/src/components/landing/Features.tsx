import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  FileText,
  FolderKanban,
  Layers,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

const features = [
  {
    title: "Write notes the way you already do",
    description:
      "Capture what you learned. DevShare turns it into shareable drafts.",
    icon: FileText,
  },
  {
    title: "Generate platform-ready variations",
    description:
      "Get tailored versions for each platform without rewriting.",
    icon: Layers,
  },
  {
    title: "AI that keeps your voice",
    description:
      "Drafts stay technical, accurate, and in your tone.",
    icon: Sparkles,
  },
  {
    title: "Review, edit, and approve",
    description:
      "You’re in control: tweak the draft and publish when it’s right.",
    icon: Wand2,
  },
  {
    title: "Smart scheduling",
    description:
      "Plan posts ahead and keep a steady cadence.",
    icon: CalendarClock,
  },
  {
    title: "Draft library, always organized",
    description:
      "Keep drafts grouped by note and platform for easy revisits.",
    icon: FolderKanban,
  },
];

export function Features() {
  return (
    <section id="features" className="py-14 sm:py-18">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className={cn("text-xs font-medium tracking-wide", landingTheme.accentText)}>
              Features
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything you need to ship your learning in public
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
              DevShare helps you turn daily progress into consistent posts without
              losing depth or authenticity.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }, idx) => (
            <Reveal key={title} delay={0.05 * idx}>
              <Card className="border-zinc-200">
                <CardContent className="pt-6">
                  <div
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background",
                      landingTheme.accentBorder
                    )}
                  >
                    <Icon className={cn("h-5 w-5", landingTheme.accentText)} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}



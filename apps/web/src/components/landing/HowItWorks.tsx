import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "./Container";
import { landingTheme } from "./landing-theme";

const steps = [
  {
    title: "Capture a note",
    description:
      "Write your learning in plain language. No formatting, no pressure.",
  },
  {
    title: "Generate drafts",
    description:
      "DevShare creates platform-specific versions, ready for review and edits.",
  },
  {
    title: "Schedule and ship",
    description:
      "Pick timing, fine-tune the copy, and publish with confidence consistently.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-18">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className={cn("text-xs font-medium tracking-wide", landingTheme.accentText)}>
              How it works
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              A simple workflow that scales with you
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
              Turn daily learning into a habit, not a chore.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <Reveal key={step.title} delay={0.05 * idx}>
              <div className="rounded-2xl border bg-background p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                      landingTheme.accentBorder,
                      landingTheme.accentText
                    )}
                  >
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}



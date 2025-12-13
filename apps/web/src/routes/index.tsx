import { createFileRoute } from "@tanstack/react-router";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { SocialProof } from "@/components/landing/SocialProof";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

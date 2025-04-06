import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const featuresRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              DevShare
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Share Your Developer Journey
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Automatically transform your learning notes into platform-optimized
            social media posts for LinkedIn, X, and Bluesky.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                featuresRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See Features
            </Button>
          </div>

          {/* Preview Image */}
          {/* <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl shadow-purple-200 border overflow-hidden"> */}
          {/*   <img */}
          {/*     src="/placeholder.svg?height=600&width=1200" */}
          {/*     alt="DevShare Dashboard Preview" */}
          {/*     className="w-full h-auto" */}
          {/*   /> */}
          {/*   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
          {/* </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Supercharge Your Developer Branding
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Platform-Optimized Posts
                </h3>
                <p className="text-slate-600">
                  Automatically generate different versions of your content
                  optimized for each social platform's unique audience and
                  format.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600"
                  >
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI-Powered Content
                </h3>
                <p className="text-slate-600">
                  Transform your raw technical notes into engaging, professional
                  posts using advanced AI that understands developer content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.84 6.72 2.28"></path>
                    <path d="M21 3v9h-9"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
                <p className="text-slate-600">
                  Schedule your posts for optimal engagement times and receive
                  notifications before they go live for final review.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            How DevShare Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Note Your Learnings
              </h3>
              <p className="text-slate-600">
                Quickly jot down what you've learned in your own words - no need
                to polish.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Transforms</h3>
              <p className="text-slate-600">
                Our AI creates platform-specific versions optimized for each
                social network.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Review & Share</h3>
              <p className="text-slate-600">
                Edit if needed, schedule, and build your developer brand
                consistently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Loved by Developers
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full overflow-hidden w-12 h-12 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=48&width=48"
                      alt="User avatar"
                    />
                  </div>
                  <div>
                    <p className="text-slate-600 mb-3">
                      "DevShare has completely transformed how I share my
                      learning journey. The platform-specific posts get much
                      better engagement than my generic posts did before."
                    </p>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-slate-500">Frontend Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full overflow-hidden w-12 h-12 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=48&width=48"
                      alt="User avatar"
                    />
                  </div>
                  <div>
                    <p className="text-slate-600 mb-3">
                      "As a busy developer, I never had time to maintain a
                      social presence. DevShare makes it effortless to share
                      what I'm learning without the hassle of crafting posts."
                    </p>
                    <p className="font-semibold">Marcus Johnson</p>
                    <p className="text-sm text-slate-500">Backend Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Share Your Developer Journey?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of developers who are building their personal brand
            while they learn.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-700 hover:bg-gray-100"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">DevShare</h2>
              <p className="text-slate-400">
                Share your developer journey, effortlessly.
              </p>
            </div>
            <div className="text-center text-slate-400">
              <p>
                © {new Date().getFullYear()} DevShare. All rights reserved.
              </p>
            </div>
            {/* <div className="flex gap-8"> */}
            {/*   <Link to='..' href="#" className="hover:text-white transition-colors"> */}
            {/*     About */}
            {/*   </Link> */}
            {/*   <Link to="#" className="hover:text-white transition-colors"> */}
            {/*     Features */}
            {/*   </Link> */}
            {/*   <Link to="#" className="hover:text-white transition-colors"> */}
            {/*     Pricing */}
            {/*   </Link> */}
            {/*   <Link to="#" className="hover:text-white transition-colors"> */}
            {/*     Contact */}
            {/*   </Link> */}
            {/* </div> */}
          </div>
          {/* <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400"> */}
          {/*   <p>© {new Date().getFullYear()} DevShare. All rights reserved.</p> */}
          {/* </div> */}
        </div>
      </footer>
    </div>
  );
}

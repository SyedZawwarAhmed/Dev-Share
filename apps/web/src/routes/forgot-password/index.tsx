import { createFileRoute, Link } from "@tanstack/react-router";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast("Missing email", {
        description: "Please provide your email address.",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Invalid email", {
        description: "Please provide a valid email address.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl" />

      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              to="/login"
              className="flex items-center text-cyan-700 hover:text-cyan-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>

          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Reset your password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you instructions to reset
                your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Check your email</h3>
                  <p className="mb-4 text-muted-foreground">
                    We've sent password reset instructions to{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                  <div className="mb-4 rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-start">
                      <Mail className="mr-3 mt-0.5 h-5 w-5 text-cyan-700" />
                      <div className="text-left text-sm text-muted-foreground">
                        <p className="mb-1">
                          The email contains a link to reset your password. If you
                          don't see it, check your spam folder.
                        </p>
                        <p>The link will expire in 1 hour.</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    Send another email
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-cyan-700 hover:text-cyan-800"
                >
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

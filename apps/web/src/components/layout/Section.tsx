import { cn } from "@/lib/utils";
import * as React from "react";

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("space-y-4", className)} {...props} />;
}



import { cn } from "@/lib/utils";
import * as React from "react";

export function Toolbar({
  sticky = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { sticky?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card",
        sticky
          ? "sticky top-[4.5rem] z-20 backdrop-blur supports-[backdrop-filter]:bg-card/80"
          : null,
        className
      )}
      {...props}
    />
  );
}



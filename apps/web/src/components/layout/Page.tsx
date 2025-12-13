import { cn } from "@/lib/utils";
import * as React from "react";

export function Page({
  size = "default",
  className,
  ...props
}: React.ComponentProps<"main"> & { size?: "default" | "wide" | "narrow" | "full" }) {
  const maxWidth =
    size === "full"
      ? "max-w-none"
      : size === "wide"
        ? "max-w-7xl"
        : size === "narrow"
          ? "max-w-5xl"
          : "max-w-7xl";
  return (
    <main
      className={cn("mx-auto w-full px-4 py-8 sm:px-6", maxWidth, className)}
      {...props}
    />
  );
}



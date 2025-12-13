import { cn } from "@/lib/utils";
import * as React from "react";

export function Divider({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn("border-border", className)}
      {...props}
    />
  );
}



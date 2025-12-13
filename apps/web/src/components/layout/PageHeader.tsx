import { cn } from "@/lib/utils";
import * as React from "react";

export function PageHeader({
  title,
  description,
  actions,
  variant = "default",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <div
      className={cn(
        variant === "compact" ? "mb-5" : "mb-8",
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}



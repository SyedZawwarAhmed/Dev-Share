import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-8 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted text-cyan-700">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button variant="gradient" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}



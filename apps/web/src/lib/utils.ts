import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlatformName(platform: string | null | undefined): string {
  const normalized = platform?.toUpperCase();
  switch (normalized) {
    case "LINKEDIN":
      return "LinkedIn";
    case "TWITTER":
      return "X (Twitter)";
    default:
      return platform ? "Unsupported platform" : "";
  }
}

export type PlatformIconSize = "sm" | "md" | "lg";

const sizeClasses: Record<PlatformIconSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function getPlatformIconClass(
  platform: string | null | undefined,
  size: PlatformIconSize = "md"
): {
  icon: "linkedin" | "twitter" | null;
  className: string;
  colorClassName: string;
} {
  const normalized = platform?.toUpperCase();
  const sizeClass = sizeClasses[size];

  switch (normalized) {
    case "LINKEDIN":
      return {
        icon: "linkedin",
        className: sizeClass,
        colorClassName: "text-blue-600",
      };
    case "TWITTER":
      return {
        icon: "twitter",
        className: sizeClass,
        colorClassName: "text-slate-900",
      };
    default:
      return { icon: null, className: sizeClass, colorClassName: "" };
  }
}

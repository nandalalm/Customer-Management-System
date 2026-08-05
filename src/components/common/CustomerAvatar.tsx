"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CustomerAvatarProps {
  name: string;
  index?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Preset vibrant HSL-tailored gradient palettes
const PALETTES = [
  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
  "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
  "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
  "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white",
  "bg-gradient-to-br from-sky-500 to-blue-600 text-white",
  "bg-gradient-to-br from-teal-500 to-emerald-600 text-white",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPaletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % PALETTES.length;
}

export function CustomerAvatar({
  name,
  index,
  className,
  size = "md",
}: CustomerAvatarProps): React.JSX.Element {
  const initials = useMemo(() => getInitials(name), [name]);
  const paletteClass = useMemo(() => {
    if (typeof index === "number") {
      // Rotating through PALETTES by row index guarantees consecutive rows
      // never share the same avatar color
      return PALETTES[Math.abs(index) % PALETTES.length];
    }
    return PALETTES[getPaletteIndex(name)];
  }, [name, index]);

  const sizeClasses = {
    sm: "size-7 text-xs font-semibold",
    md: "size-8 text-xs font-semibold tracking-wider",
    lg: "size-10 text-sm font-bold tracking-wider",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full shadow-xs select-none",
        sizeClasses[size],
        paletteClass,
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

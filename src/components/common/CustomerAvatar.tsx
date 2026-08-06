"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CustomerAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// 32 Preset vibrant, high-contrast Tailwind gradient palettes
const PALETTES = [
  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
  "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
  "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
  "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white",
  "bg-gradient-to-br from-sky-500 to-indigo-600 text-white",
  "bg-gradient-to-br from-teal-500 to-emerald-600 text-white",
  "bg-gradient-to-br from-red-500 to-rose-600 text-white",
  "bg-gradient-to-br from-orange-500 to-amber-600 text-white",
  "bg-gradient-to-br from-cyan-500 to-blue-600 text-white",
  "bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white",
  "bg-gradient-to-br from-purple-500 to-indigo-600 text-white",
  "bg-gradient-to-br from-lime-500 to-emerald-600 text-white",
  "bg-gradient-to-br from-pink-500 to-rose-600 text-white",
  "bg-gradient-to-br from-indigo-600 to-blue-700 text-white",
  "bg-gradient-to-br from-yellow-500 to-amber-600 text-white",
  "bg-gradient-to-br from-teal-600 to-cyan-700 text-white",
  "bg-gradient-to-br from-emerald-600 to-green-700 text-white",
  "bg-gradient-to-br from-violet-600 to-purple-700 text-white",
  "bg-gradient-to-br from-rose-600 to-red-700 text-white",
  "bg-gradient-to-br from-sky-600 to-teal-700 text-white",
  "bg-gradient-to-br from-amber-600 to-red-600 text-white",
  "bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white",
  "bg-gradient-to-br from-blue-600 to-indigo-700 text-white",
  "bg-gradient-to-br from-emerald-400 to-cyan-600 text-white",
  "bg-gradient-to-br from-indigo-400 to-pink-600 text-white",
  "bg-gradient-to-br from-orange-400 to-rose-600 text-white",
  "bg-gradient-to-br from-purple-400 to-pink-600 text-white",
  "bg-gradient-to-br from-cyan-400 to-indigo-600 text-white",
  "bg-gradient-to-br from-rose-400 to-orange-500 text-white",
  "bg-gradient-to-br from-teal-400 to-blue-600 text-white",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPaletteIndex(name: string): number {
  const str = name.trim().toLowerCase();
  if (!str) return 0;

  let hash = 0;
  const firstCharCode = str.charCodeAt(0);
  const lastCharCode = str.charCodeAt(str.length - 1);

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const combined = Math.abs(hash + firstCharCode * 31 + lastCharCode * 17);
  return combined % PALETTES.length;
}

export function CustomerAvatar({
  name,
  className,
  size = "md",
}: CustomerAvatarProps): React.JSX.Element {
  const initials = useMemo(() => getInitials(name), [name]);
  const paletteClass = useMemo(() => PALETTES[getPaletteIndex(name)], [name]);

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




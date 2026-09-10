import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Tailwind palette stops used in tool/category `gradient` strings. */
const TW: Record<string, string> = {
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "amber-500": "#f59e0b",
  "amber-600": "#d97706",
  "yellow-500": "#eab308",
  "lime-500": "#84cc16",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "emerald-500": "#10b981",
  "emerald-600": "#059669",
  "emerald-700": "#047857",
  "teal-500": "#14b8a6",
  "teal-600": "#0d9488",
  "cyan-500": "#06b6d4",
  "cyan-600": "#0891b2",
  "sky-500": "#0ea5e9",
  "sky-600": "#0284c7",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "violet-500": "#8b5cf6",
  "violet-600": "#7c3aed",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "fuchsia-500": "#d946ef",
  "fuchsia-600": "#c026d3",
  "pink-500": "#ec4899",
  "rose-400": "#fb7185",
  "rose-500": "#f43f5e",
  "rose-600": "#e11d48",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "zinc-600": "#52525b",
  "zinc-700": "#3f3f46",
  "neutral-600": "#525252",
  "neutral-700": "#404040",
  "neutral-900": "#171717",
  "stone-600": "#57534e",
  "stone-700": "#44403c",
  "gray-600": "#4b5563",
};

const FALLBACK = "#0D9B8A";

function tokenToHex(token: string): string | null {
  const arbitrary = token.match(/^\[#([0-9A-Fa-f]{3,8})\]$/);
  if (arbitrary) return `#${arbitrary[1]}`;
  return TW[token] ?? null;
}

/** Resolve `from-red-600 via-pink-500 to-orange-400` (or hex arbitrary values) to CSS colors. */
export function gradientStops(gradient?: string): string[] {
  if (!gradient) return [FALLBACK, "#0B1220"];
  const tokens = [...gradient.matchAll(/(?:from|via|to)-(\[[^\]]+\]|[\w]+-\d{2,3})/g)].map(
    (m) => tokenToHex(m[1])
  );
  const hexes = tokens.filter((h): h is string => Boolean(h));
  if (hexes.length === 0) return [FALLBACK, "#0B1220"];
  if (hexes.length === 1) return [hexes[0], hexes[0]];
  return hexes;
}

export function iconWellStyle(gradient?: string): CSSProperties {
  const stops = gradientStops(gradient);
  return {
    backgroundColor: stops[0],
    backgroundImage: `linear-gradient(135deg, ${stops.join(", ")})`,
    color: "#fff",
  };
}

export function iconWellClass(className?: string): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center text-white shadow-md ring-1 ring-black/20 dark:ring-white/15 [&_svg]:text-white [&_svg]:stroke-white",
    className
  );
}

/** Spread onto a div/span: `{...iconWell(tool.gradient, "h-11 w-11 rounded-xl")}`. */
export function iconWell(gradient?: string, className?: string) {
  return {
    className: iconWellClass(className),
    style: iconWellStyle(gradient),
  };
}

export function IconWell({
  gradient,
  className,
  children,
}: {
  gradient?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={iconWellClass(className)} style={iconWellStyle(gradient)}>
      {children}
    </div>
  );
}

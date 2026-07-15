"use client";

import { cn } from "@/lib/utils";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function BeforeAfterBar({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: {
  before: number;
  after: number;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const saved = before > 0 ? Math.max(0, ((before - after) / before) * 100) : 0;
  const max = Math.max(before, after, 1);
  const beforePct = (before / max) * 100;
  const afterPct = (after / max) * 100;

  return (
    <div className={cn("rounded-xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-theme-heading">Size comparison</p>
        <span className="text-sm font-bold text-accent-emerald">
          {saved > 0.5 ? `${saved.toFixed(0)}% smaller` : saved < -0.5 ? "Grew slightly" : "Similar size"}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <BarRow label={beforeLabel} value={formatBytes(before)} pct={beforePct} color="bg-theme-subtle" />
        <BarRow label={afterLabel} value={formatBytes(after)} pct={afterPct} color="bg-accent" />
      </div>
    </div>
  );
}

function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-theme-muted">
        <span>{label}</span>
        <span className="font-medium tabular-nums text-theme-heading">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-theme-subtle/30">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.max(pct, 4)}%` }} />
      </div>
    </div>
  );
}

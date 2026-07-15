"use client";

import { cn } from "@/lib/utils";

export interface BenchmarkBand {
  label: string;
  min: number;
  max: number;
  color: string;
}

const DEFAULT_BANDS: BenchmarkBand[] = [
  { label: "Low", min: 0, max: 1, color: "bg-amber-500" },
  { label: "Average", min: 1, max: 3, color: "bg-accent" },
  { label: "Strong", min: 3, max: 6, color: "bg-accent-emerald" },
  { label: "Excellent", min: 6, max: 100, color: "bg-emerald-400" },
];

export function BenchmarkGauge({
  value,
  unit = "%",
  bands = DEFAULT_BANDS,
  title = "Benchmark",
  className,
}: {
  value: number;
  unit?: string;
  bands?: BenchmarkBand[];
  title?: string;
  className?: string;
}) {
  const band = bands.find((b) => value >= b.min && value < b.max) ?? bands[bands.length - 1];
  const clamped = Math.min(Math.max(value, 0), 15);
  const fillPct = Math.min((clamped / 15) * 100, 100);

  return (
    <div className={cn("rounded-xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">{title}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-theme-heading">
            {value.toFixed(2)}
            <span className="text-lg text-theme-muted">{unit}</span>
          </p>
        </div>
        <span className="rounded-md border border-theme-subtle px-2.5 py-1 text-xs font-semibold text-theme-heading">
          {band?.label ?? "—"}
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-theme-subtle/40">
        <div
          className={cn("h-full rounded-full transition-all duration-500", band?.color ?? "bg-accent")}
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-theme-subtle">
        {bands.slice(0, 4).map((b) => (
          <span key={b.label} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", b.color)} />
            {b.label} ({b.min}–{b.max === 100 ? `${b.min}+` : b.max}
            {unit})
          </span>
        ))}
      </div>
    </div>
  );
}

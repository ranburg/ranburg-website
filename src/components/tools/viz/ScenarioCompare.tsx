"use client";

import { cn } from "@/lib/utils";

export interface ScenarioRow {
  label: string;
  a: string;
  b: string;
}

export function ScenarioCompare({
  title = "Scenario compare",
  columnA = "A",
  columnB = "B",
  rows,
  className,
}: {
  title?: string;
  columnA?: string;
  columnB?: string;
  rows: ScenarioRow[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-theme-subtle", className)}>
      <div className="border-b border-theme-subtle bg-theme-surface/50 px-4 py-3">
        <p className="text-sm font-semibold text-theme-heading">{title}</p>
      </div>
      <div className="grid grid-cols-3 gap-0 border-b border-theme-subtle bg-theme-surface/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-theme-subtle">
        <span>Metric</span>
        <span className="text-right">{columnA}</span>
        <span className="text-right">{columnB}</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li key={row.label} className="grid grid-cols-3 gap-2 border-b border-theme-subtle/60 px-4 py-2.5 text-sm last:border-b-0">
            <span className="text-theme-muted">{row.label}</span>
            <span className="text-right font-semibold tabular-nums text-theme-heading">{row.a}</span>
            <span className="text-right font-semibold tabular-nums text-accent">{row.b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

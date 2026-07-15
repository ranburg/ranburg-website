"use client";

import { cn } from "@/lib/utils";

export interface KPIItem {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}

export function KPIStrip({ items, className }: { items: KPIItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={cn("grid gap-3", items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "min-w-0 overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface/50 p-4 text-center",
            item.highlight && "border-accent/40 bg-accent/5"
          )}
        >
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-theme-subtle">{item.label}</p>
          <p className="mt-1 break-all text-xl font-bold tabular-nums leading-tight text-theme-heading sm:text-2xl">
            {item.value}
          </p>
          {item.hint && <p className="mt-1 text-xs text-theme-muted">{item.hint}</p>}
        </div>
      ))}
    </div>
  );
}

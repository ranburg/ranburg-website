"use client";

import { formatCurrency, formatCompactCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: number;
  highlight?: boolean;
  variant?: "default" | "emerald" | "blue";
  format?: "currency" | "percent" | "plain";
}

const variants = {
  default: "text-theme-heading",
  emerald: "text-accent-emerald",
  blue: "text-accent",
};

function formatValue(value: number, format: ResultCardProps["format"] = "currency"): string {
  if (format === "percent") return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
  if (format === "plain") return value.toLocaleString();
  return formatCompactCurrency(value);
}

export default function ResultCard({
  label,
  value,
  highlight,
  variant = "default",
  format = "currency",
}: ResultCardProps) {
  const fullTitle = format === "currency" ? formatCurrency(value) : undefined;

  return (
    <div
      className={cn(
        "glass-card min-w-0 overflow-hidden p-4 text-center transition-all sm:p-5",
        highlight && "border-accent/30 shadow-glow"
      )}
    >
      <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        title={fullTitle}
        className={cn(
          "mt-2 min-w-0 break-all font-bold tabular-nums leading-tight",
          variants[variant],
          highlight ? "text-base sm:text-xl lg:text-2xl" : "text-base sm:text-lg lg:text-xl"
        )}
      >
        {formatValue(value, format)}
      </p>
    </div>
  );
}

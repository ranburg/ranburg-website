"use client";

import { formatCurrency } from "@/lib/utils";
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
  return formatCurrency(value);
}

export default function ResultCard({
  label,
  value,
  highlight,
  variant = "default",
  format = "currency",
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-5 text-center transition-all",
        highlight && "border-accent/30 shadow-glow"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={cn("mt-2 font-bold", variants[variant], highlight ? "text-xl sm:text-2xl" : "text-lg sm:text-2xl")}>
        {formatValue(value, format)}
      </p>
    </div>
  );
}

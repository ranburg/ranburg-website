"use client";

import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PurchasingPowerCardProps {
  label: string;
  nominalValue: number;
  presentValue: number;
  highlight?: boolean;
}

export default function PurchasingPowerCard({
  label,
  nominalValue,
  presentValue,
  highlight,
}: PurchasingPowerCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-5",
        highlight && "border-accent-emerald/30"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">
        {formatCurrency(nominalValue)}
      </p>
      <p className="mt-1 text-sm text-accent-emerald">
        Today&apos;s power: {formatCurrency(presentValue)}
      </p>
    </div>
  );
}

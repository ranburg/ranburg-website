"use client";

import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";

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
        "glass-card min-w-0 overflow-hidden p-5",
        highlight && "border-accent-emerald/30"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p
        title={formatCurrency(nominalValue)}
        className="mt-2 break-all text-base font-bold tabular-nums leading-tight text-theme-heading sm:text-xl lg:text-2xl"
      >
        {formatCompactCurrency(nominalValue)}
      </p>
      <p
        title={formatCurrency(presentValue)}
        className="mt-2 break-all text-sm tabular-nums text-accent-emerald"
      >
        Today&apos;s power: {formatCompactCurrency(presentValue)}
      </p>
    </div>
  );
}

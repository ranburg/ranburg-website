"use client";

import { formatCompactNumber, formatNumber } from "@/lib/utils";

interface CalculatorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  onChange: (value: number) => void;
}

export default function CalculatorSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  prefix = "",
  onChange,
}: CalculatorSliderProps) {
  const display = `${prefix}${formatCompactNumber(value)}${unit}`;
  const fullDisplay = `${prefix}${formatNumber(value)}${unit}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="min-w-0 shrink text-sm font-medium text-theme-body">{label}</label>
        <span
          title={fullDisplay}
          className="max-w-[55%] truncate rounded-lg bg-accent/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-accent sm:max-w-[50%] sm:px-3"
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between gap-2 text-xs text-slate-500">
        <span className="truncate">
          {prefix}
          {formatCompactNumber(min)}
          {unit}
        </span>
        <span className="truncate text-right">
          {prefix}
          {formatCompactNumber(max)}
          {unit}
        </span>
      </div>
    </div>
  );
}

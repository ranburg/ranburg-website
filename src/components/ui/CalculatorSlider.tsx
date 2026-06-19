"use client";

import { formatNumber } from "@/lib/utils";

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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-theme-body">{label}</label>
        <span className="rounded-lg bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
          {prefix}
          {formatNumber(value)}
          {unit}
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
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          {prefix}
          {formatNumber(min)}
          {unit}
        </span>
        <span>
          {prefix}
          {formatNumber(max)}
          {unit}
        </span>
      </div>
    </div>
  );
}

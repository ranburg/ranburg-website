"use client";

import { useEffect, useState } from "react";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

function decimalsForStep(step: number): number {
  if (step >= 1) return 0;
  const str = step.toString();
  if (str.includes("e-")) {
    const m = str.match(/e-(\d+)/);
    return m ? Number(m[1]) : 8;
  }
  return (str.split(".")[1] || "").length;
}

function formatInput(value: number, places: number): string {
  if (places > 0) {
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: places,
    });
  }
  return formatNumber(value);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function snap(n: number, step: number, min: number): number {
  if (step <= 0) return n;
  const snapped = min + Math.round((n - min) / step) * step;
  const places = decimalsForStep(step);
  return Number(snapped.toFixed(places));
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
  const places = decimalsForStep(step);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!focused) setDraft(formatInput(value, places));
  }, [value, focused, places]);

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(/,/g, "").replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(parsed)) {
      setDraft(formatInput(value, places));
      return;
    }
    const next = clamp(snap(parsed, step, min), min, max);
    onChange(next);
    setDraft(formatInput(next, places));
  };

  const displayChip = `${prefix}${formatCompactNumber(value)}${unit}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        {label ? (
          <label className="min-w-0 shrink text-sm font-medium text-theme-body">{label}</label>
        ) : (
          <span />
        )}
        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-theme-subtle bg-theme-surface px-2 py-1">
          {prefix ? <span className="text-xs font-medium text-theme-subtle">{prefix}</span> : null}
          <input
            type="text"
            inputMode={places > 0 ? "decimal" : "numeric"}
            aria-label={label || "Value"}
            value={focused ? draft : formatInput(value, places)}
            onFocus={() => {
              setFocused(true);
              setDraft(places > 0 ? String(value) : String(Math.round(value)));
            }}
            onBlur={() => {
              commit(draft);
              setFocused(false);
            }}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-[7.5rem] bg-transparent text-right text-sm font-semibold tabular-nums text-accent outline-none sm:w-[8.5rem]"
          />
          {unit ? <span className="text-xs font-medium text-theme-subtle">{unit.trim()}</span> : null}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label ? `${label} slider` : "Slider"}
      />
      <div className="flex justify-between gap-2 text-[11px] text-theme-subtle">
        <span className="truncate">
          {prefix}
          {formatCompactNumber(min)}
          {unit}
        </span>
        <span className={cn("truncate text-right tabular-nums")} title={displayChip}>
          {prefix}
          {formatCompactNumber(max)}
          {unit}
        </span>
      </div>
    </div>
  );
}

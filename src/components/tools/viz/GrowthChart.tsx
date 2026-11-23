"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface GrowthSeries {
  key: string;
  label: string;
  /** "accent" (filled, default) or "muted" (thin dashed reference line). */
  tone?: "accent" | "muted" | "emerald";
}

interface GrowthChartProps<T extends object> {
  data: T[];
  xKey: keyof T & string;
  series: GrowthSeries[];
  formatValue: (value: number) => string;
  formatAxis?: (value: number) => string;
  formatX?: (value: number | string) => string;
  height?: number;
  ariaLabel: string;
}

const TONE_COLOR: Record<NonNullable<GrowthSeries["tone"]>, string> = {
  accent: "var(--accent)",
  emerald: "var(--accent-emerald)",
  muted: "var(--ink-muted)",
};

/** Theme-aware area chart shared by the planner calculators. */
export function GrowthChart<T extends object>({
  data,
  xKey,
  series,
  formatValue,
  formatAxis,
  formatX,
  height = 260,
  ariaLabel,
}: GrowthChartProps<T>) {
  const uid = useId().replace(/:/g, "");

  return (
    <div className="rounded-2xl border border-theme-subtle bg-theme-surface/40 p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 px-1 text-xs text-theme-muted">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: TONE_COLOR[s.tone ?? "accent"] }} aria-hidden />
            {s.label}
          </span>
        ))}
      </div>
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: TONE_COLOR[s.tone ?? "accent"], stopOpacity: 0.35 }} />
                  <stop offset="100%" style={{ stopColor: TONE_COLOR[s.tone ?? "accent"], stopOpacity: 0 }} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="var(--glass-border)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="var(--ink-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatX}
              minTickGap={24}
            />
            <YAxis
              stroke="var(--ink-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={formatAxis ?? formatValue}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatValue(value), name]}
              labelFormatter={(label) => (formatX ? formatX(label as number | string) : String(label))}
              cursor={{ stroke: "var(--accent)", strokeOpacity: 0.4 }}
              contentStyle={{
                background: "var(--dropdown-bg)",
                border: "1px solid var(--dropdown-border)",
                borderRadius: 14,
                color: "var(--foreground)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--ink-muted)", marginBottom: 4 }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            {series.map((s) => {
              const tone = s.tone ?? "accent";
              const muted = tone === "muted";
              return (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={TONE_COLOR[tone]}
                  strokeWidth={muted ? 1.5 : 2.25}
                  strokeDasharray={muted ? "5 5" : undefined}
                  fill={muted ? "transparent" : `url(#${uid}-${s.key})`}
                  animationDuration={500}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

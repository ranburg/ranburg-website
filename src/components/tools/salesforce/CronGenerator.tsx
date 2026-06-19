"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CronGenerator() {
  const [freq, setFreq] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(6);
  const [dayOfWeek, setDayOfWeek] = useState("MON");
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const cron = useMemo(() => {
    if (freq === "hourly") return `0 ${minute} * * * ?`;
    if (freq === "daily") return `0 ${minute} ${hour} * * ?`;
    if (freq === "weekly") return `0 ${minute} ${hour} ? * ${dayOfWeek}`;
    return `0 ${minute} ${hour} ${dayOfMonth} * ?`;
  }, [freq, minute, hour, dayOfWeek, dayOfMonth]);

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Frequency</label>
          <select value={freq} onChange={(e) => setFreq(e.target.value as typeof freq)} className="input-field mt-1">
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-theme-muted">Minute (0-59)</label>
          <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(+e.target.value)} className="input-field mt-1" />
        </div>
        {freq !== "hourly" && (
          <div>
            <label className="text-sm text-theme-muted">Hour (0-23)</label>
            <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(+e.target.value)} className="input-field mt-1" />
          </div>
        )}
        {freq === "weekly" && (
          <div>
            <label className="text-sm text-theme-muted">Day of Week</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="input-field mt-1">
              {DAYS.slice(1).concat(DAYS[0]).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}
        {freq === "monthly" && (
          <div>
            <label className="text-sm text-theme-muted">Day of Month</label>
            <input type="number" min={1} max={31} value={dayOfMonth} onChange={(e) => setDayOfMonth(+e.target.value)} className="input-field mt-1" />
          </div>
        )}
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-theme-body">Cron Expression</span>
          <CopyButton text={cron} />
        </div>
        <code className="font-mono text-lg text-accent-emerald">{cron}</code>
        <p className="mt-2 text-xs text-theme-subtle">Format: Seconds Minutes Hours Day_of_month Month Day_of_week</p>
      </div>
    </div>
  );
}

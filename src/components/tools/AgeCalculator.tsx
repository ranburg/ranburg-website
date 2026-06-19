"use client";

import { useMemo, useState } from "react";

function diffDates(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

  let nextBirthday = new Date(to.getFullYear(), from.getMonth(), from.getDate());
  if (nextBirthday <= to) nextBirthday = new Date(to.getFullYear() + 1, from.getMonth(), from.getDate());
  const daysToBirthday = Math.ceil((nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays, daysToBirthday };
}

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("1990-01-01");
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => {
    const birth = new Date(dob + "T00:00:00");
    const ref = new Date(asOf + "T00:00:00");
    if (isNaN(birth.getTime()) || isNaN(ref.getTime()) || birth > ref) return null;
    return diffDates(birth, ref);
  }, [dob, asOf]);

  return (
    <div className="space-y-6">
      <div className="glass-card grid gap-6 p-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-theme-body">Date of birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input-field" max={asOf} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-theme-body">Calculate age as of</label>
          <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="input-field" />
        </div>
      </div>

      {result ? (
        <>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
            <p className="text-4xl font-extrabold text-theme-heading sm:text-5xl">
              {result.years} <span className="text-2xl font-semibold text-theme-muted">years</span>{" "}
              {result.months} <span className="text-2xl font-semibold text-theme-muted">months</span>{" "}
              {result.days} <span className="text-2xl font-semibold text-theme-muted">days</span>
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total days lived</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{result.totalDays.toLocaleString()}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Days until next birthday</p>
              <p className="mt-2 text-2xl font-bold text-accent">{result.daysToBirthday}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          Please enter a valid date of birth that is on or before the reference date.
        </p>
      )}
    </div>
  );
}

"use client";

import { useToolUi } from "@/hooks/useToolUi";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";
import HomeLoanVsMutualFund from "@/components/tools/finance/HomeLoanVsMutualFund";

function CalcLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

export function RentVsBuyTool() {
  return <HomeLoanVsMutualFund defaultOccupancy="self_occupy" />;
}

export function BillSplitTool() {
  const { t } = useToolUi("bill-split-calculator");
  const [bill, setBill] = useState(2400);
  const [people, setPeople] = useState(4);
  const [tip, setTip] = useState(10);
  const total = bill * (1 + tip / 100);
  const each = people > 0 ? total / people : 0;
  return (
    <CalcLayout>
      <CalculatorSlider label="Bill amount" value={bill} min={0} max={100000} step={50} prefix="₹" onChange={setBill} />
      <CalculatorSlider label="People" value={people} min={1} max={20} step={1} onChange={setPeople} />
      <CalculatorSlider label="Tip" value={tip} min={0} max={30} step={1} unit="%" onChange={setTip} />
      <KPIStrip
        items={[
          { label: "Total with tip", value: `₹${Math.round(total).toLocaleString("en-IN")}`, highlight: true },
          { label: "Each person", value: `₹${Math.round(each).toLocaleString("en-IN")}` },
          { label: "Tip amount", value: `₹${Math.round(bill * tip / 100).toLocaleString("en-IN")}` },
        ]}
      />
    </CalcLayout>
  );
}

export function CompoundInterestTool() {
  const { t } = useToolUi("compound-interest-calculator");
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState(12);
  const fv = useMemo(() => {
    const r = rate / 100;
    return principal * Math.pow(1 + r / freq, freq * years);
  }, [principal, rate, years, freq]);
  const interest = fv - principal;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  return (
    <CalcLayout>
      <CalculatorSlider label="Principal" value={principal} min={1000} max={10000000} step={1000} prefix="₹" onChange={setPrincipal} />
      <CalculatorSlider label="Annual rate" value={rate} min={1} max={25} step={0.1} unit="%" onChange={setRate} />
      <CalculatorSlider label="Years" value={years} min={1} max={40} step={1} onChange={setYears} />
      <CalculatorSlider label="Compounds / year" value={freq} min={1} max={12} step={1} onChange={setFreq} />
      <KPIStrip
        items={[
          { label: "Future value", value: fmt(fv), highlight: true },
          { label: "Interest earned", value: fmt(interest) },
          { label: "Multiple", value: `${(fv / principal).toFixed(2)}x` },
        ]}
      />
    </CalcLayout>
  );
}

export function SleepCalculatorTool() {
  const { t } = useToolUi("sleep-calculator");
  const [wakeH, setWakeH] = useState(7);
  const [wakeM, setWakeM] = useState(0);
  const cycles = useMemo(() => {
    const wake = wakeH * 60 + wakeM;
    return [6, 5, 4].map((c) => {
      let bed = wake - c * 90 - 15;
      if (bed < 0) bed += 24 * 60;
      const h = Math.floor(bed / 60) % 24;
      const m = bed % 60;
      return { cycles: c, hours: (c * 90) / 60, label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
    });
  }, [wakeH, wakeM]);

  return (
    <CalcLayout>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-theme-body">
          Wake hour (0–23)
          <input type="number" className="input-field mt-1.5" min={0} max={23} value={wakeH} onChange={(e) => setWakeH(Number(e.target.value))} />
        </label>
        <label className="text-sm font-medium text-theme-body">
          Wake minute
          <input type="number" className="input-field mt-1.5" min={0} max={59} value={wakeM} onChange={(e) => setWakeM(Number(e.target.value))} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cycles.map((c) => (
          <div key={c.cycles} className="glass-card p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-theme-subtle">{c.cycles} cycles · {c.hours}h</p>
            <p className="mt-2 text-2xl font-bold text-accent">{c.label}</p>
            <p className="mt-1 text-xs text-theme-muted">Suggested bedtime</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-theme-muted">Based on ~90-minute sleep cycles + 15 min to fall asleep. Not medical advice.</p>
    </CalcLayout>
  );
}

export function SalaryHikeTool() {
  const { t } = useToolUi("salary-hike-calculator");
  const [current, setCurrent] = useState(1200000);
  const [hike, setHike] = useState(15);
  const [tax, setTax] = useState(20);
  const next = current * (1 + hike / 100);
  const takeHomeDelta = ((next - current) * (1 - tax / 100)) / 12;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  return (
    <CalcLayout>
      <CalculatorSlider label="Current CTC (annual)" value={current} min={200000} max={10000000} step={50000} prefix="₹" onChange={setCurrent} />
      <CalculatorSlider label="Hike %" value={hike} min={0} max={50} step={0.5} unit="%" onChange={setHike} />
      <CalculatorSlider label="Approx tax / deductions" value={tax} min={0} max={40} step={1} unit="%" onChange={setTax} />
      <KPIStrip
        items={[
          { label: "New CTC", value: fmt(next), highlight: true },
          { label: "Extra / month (approx)", value: fmt(takeHomeDelta) },
          { label: "Annual raise", value: fmt(next - current) },
        ]}
      />
    </CalcLayout>
  );
}

export function ColorContrastTool() {
  const { t } = useToolUi("color-contrast-checker");
  const [fg, setFg] = useState("#0f766e");
  const [bg, setBg] = useState("#f3f6f4");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  const aaLarge = ratio >= 3;

  return (
    <CalcLayout>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-theme-body">
          Text color
          <input type="color" className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-theme bg-transparent p-1" value={fg} onChange={(e) => setFg(e.target.value)} />
          <input className="input-field mt-2" value={fg} onChange={(e) => setFg(e.target.value)} />
        </label>
        <label className="text-sm font-medium text-theme-body">
          Background
          <input type="color" className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-theme bg-transparent p-1" value={bg} onChange={(e) => setBg(e.target.value)} />
          <input className="input-field mt-2" value={bg} onChange={(e) => setBg(e.target.value)} />
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-theme p-8 text-center text-2xl font-bold" style={{ color: fg, background: bg }}>
        The quick brown fox — sample text
      </div>
      <KPIStrip
        items={[
          { label: "Contrast ratio", value: `${ratio.toFixed(2)}:1`, highlight: true },
          { label: "WCAG AA", value: aa ? "Pass" : "Fail" },
          { label: "AAA / Large AA", value: `${aaa ? "AAA" : "—"} / ${aaLarge ? "OK" : "No"}` },
        ]}
      />
    </CalcLayout>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(fg: string, bg: string) {
  try {
    const L1 = luminance(fg);
    const L2 = luminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 1;
  }
}

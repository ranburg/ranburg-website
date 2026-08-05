"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip, ScenarioCompare } from "@/components/tools/viz";
import { HSN_SAC_SAMPLE } from "@/lib/data/hsnSacSample";
import { IFSC_SAMPLE } from "@/lib/data/ifscSample";

function CalcLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

function fmtInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

/** FY 2026-27 new regime slabs (illustrative planning rates). */
function taxNewRegime(taxable: number): number {
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    const chunk = Math.min(taxable, limit) - prev;
    if (chunk > 0) tax += chunk * rate;
    prev = limit as number;
    if (taxable <= limit) break;
  }
  // Sec 87A-style rebate approximation up to ~12L taxable
  if (taxable <= 1200000) return 0;
  return Math.max(0, tax);
}

function taxOldRegime(taxable: number): number {
  const slabs = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Infinity, 0.3],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    const chunk = Math.min(taxable, limit) - prev;
    if (chunk > 0) tax += chunk * rate;
    prev = limit as number;
    if (taxable <= limit) break;
  }
  if (taxable <= 500000) return 0;
  return Math.max(0, tax);
}

export function CtcInHandTool() {
  const [ctc, setCtc] = useState(1200000);
  const [basicPct, setBasicPct] = useState(40);
  const [metro, setMetro] = useState(true);
  const [pfCapped, setPfCapped] = useState(true);
  const [hraPctOfBasic, setHraPctOfBasic] = useState(40);
  const [rentMonthly, setRentMonthly] = useState(25000);
  const [deductions80c, setDeductions80c] = useState(150000);

  const result = useMemo(() => {
    const basic = (ctc * basicPct) / 100;
    const employerPfRaw = basic * 0.12;
    const employerPf = pfCapped ? Math.min(employerPfRaw, 21600) : employerPfRaw;
    const gratuity = basic * 0.0481;
    const hra = (basic * hraPctOfBasic) / 100;
    const grossAnnual = Math.max(0, ctc - employerPf - gratuity);
    const employeePf = pfCapped ? Math.min(basic * 0.12, 21600) : basic * 0.12;
    const professionalTax = 2400;

    const rentPaid = rentMonthly * 12;
    const hraExempt = Math.max(
      0,
      Math.min(hra, (metro ? 0.5 : 0.4) * basic, Math.max(0, rentPaid - 0.1 * basic))
    );

    const stdNew = 75000;
    const taxableNew = Math.max(0, grossAnnual - stdNew - employeePf);
    const taxNew = taxNewRegime(taxableNew);

    const stdOld = 50000;
    const taxableOld = Math.max(0, grossAnnual - stdOld - hraExempt - Math.min(deductions80c, 150000) - employeePf);
    const taxOld = taxOldRegime(taxableOld);

    const inHandNew = (grossAnnual - employeePf - professionalTax - taxNew) / 12;
    const inHandOld = (grossAnnual - employeePf - professionalTax - taxOld) / 12;

    return {
      basic,
      employerPf,
      gratuity,
      grossAnnual,
      employeePf,
      hraExempt,
      taxNew,
      taxOld,
      inHandNew,
      inHandOld,
      better: inHandNew >= inHandOld ? "New" : "Old",
    };
  }, [ctc, basicPct, metro, pfCapped, hraPctOfBasic, rentMonthly, deductions80c]);

  return (
    <CalcLayout>
      <CalculatorSlider label="Annual CTC" value={ctc} min={300000} max={10000000} step={25000} prefix="₹" onChange={setCtc} />
      <CalculatorSlider label="Basic % of CTC" value={basicPct} min={30} max={60} step={1} unit="%" onChange={setBasicPct} />
      <CalculatorSlider label="HRA % of basic" value={hraPctOfBasic} min={0} max={50} step={1} unit="%" onChange={setHraPctOfBasic} />
      <CalculatorSlider label="Monthly rent paid" value={rentMonthly} min={0} max={150000} step={500} prefix="₹" onChange={setRentMonthly} />
      <CalculatorSlider label="80C deductions (old regime)" value={deductions80c} min={0} max={150000} step={5000} prefix="₹" onChange={setDeductions80c} />
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={metro} onChange={(e) => setMetro(e.target.checked)} /> Metro city (HRA 50%)
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={pfCapped} onChange={(e) => setPfCapped(e.target.checked)} /> PF capped at ₹1,800/mo
        </label>
      </div>
      <KPIStrip
        items={[
          { label: "Monthly in-hand (new)", value: fmtInr(result.inHandNew), highlight: true },
          { label: "Monthly in-hand (old)", value: fmtInr(result.inHandOld) },
          { label: "Better regime", value: result.better },
        ]}
      />
      <ScenarioCompare
        title="Annual tax estimate"
        columnA="New regime"
        columnB="Old regime"
        rows={[
          { label: "Income tax", a: fmtInr(result.taxNew), b: fmtInr(result.taxOld) },
          { label: "HRA exempt", a: "N/A", b: fmtInr(result.hraExempt) },
          { label: "Employee PF", a: fmtInr(result.employeePf), b: fmtInr(result.employeePf) },
        ]}
      />
      <p className="text-xs text-theme-subtle">
        Planning estimate for FY 2026–27 style slabs. Employer PF and gratuity are removed from CTC before take-home. Confirm with your payroll/tax advisor.
      </p>
    </CalcLayout>
  );
}

export function TdsCalculatorTool() {
  const [section, setSection] = useState<"194C" | "194J" | "194I" | "192">("194J");
  const [amount, setAmount] = useState(100000);
  const [hasPan, setHasPan] = useState(true);

  const rate = useMemo(() => {
    const map = { "194C": 0.01, "194J": 0.1, "194I": 0.1, "192": 0 } as const;
    const base = map[section];
    if (section === "192") return 0;
    return hasPan ? base : Math.max(base, 0.2);
  }, [section, hasPan]);

  const tds = section === "192" ? 0 : amount * rate;

  return (
    <CalcLayout>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["194J", "Professional fees 194J"],
            ["194C", "Contractors 194C"],
            ["194I", "Rent 194I"],
            ["192", "Salary 192 (use CTC tool)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${section === id ? "bg-accent text-white" : "border border-theme text-theme-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <CalculatorSlider label="Payment amount" value={amount} min={1000} max={5000000} step={1000} prefix="₹" onChange={setAmount} />
      <label className="inline-flex items-center gap-2 text-sm text-theme-muted">
        <input type="checkbox" checked={hasPan} onChange={(e) => setHasPan(e.target.checked)} /> Payee has PAN
      </label>
      <KPIStrip
        items={[
          { label: "TDS rate", value: `${(rate * 100).toFixed(1)}%`, highlight: true },
          { label: "TDS amount", value: fmtInr(tds) },
          { label: "Net payable", value: fmtInr(amount - tds) },
        ]}
      />
      <p className="text-xs text-theme-subtle">Rates are simplified common cases. Thresholds and surcharge rules can change — verify against current Income Tax guidance.</p>
    </CalcLayout>
  );
}

export function HraExemptionTool() {
  const [basic, setBasic] = useState(500000);
  const [hra, setHra] = useState(200000);
  const [rent, setRent] = useState(240000);
  const [metro, setMetro] = useState(true);

  const result = useMemo(() => {
    const a = hra;
    const b = (metro ? 0.5 : 0.4) * basic;
    const c = Math.max(0, rent - 0.1 * basic);
    const exempt = Math.max(0, Math.min(a, b, c));
    return { a, b, c, exempt, taxableHra: Math.max(0, hra - exempt) };
  }, [basic, hra, rent, metro]);

  return (
    <CalcLayout>
      <CalculatorSlider label="Annual basic salary" value={basic} min={100000} max={5000000} step={10000} prefix="₹" onChange={setBasic} />
      <CalculatorSlider label="Annual HRA received" value={hra} min={0} max={2000000} step={5000} prefix="₹" onChange={setHra} />
      <CalculatorSlider label="Annual rent paid" value={rent} min={0} max={2000000} step={5000} prefix="₹" onChange={setRent} />
      <label className="inline-flex items-center gap-2 text-sm text-theme-muted">
        <input type="checkbox" checked={metro} onChange={(e) => setMetro(e.target.checked)} /> Metro city
      </label>
      <KPIStrip
        items={[
          { label: "HRA exemption", value: fmtInr(result.exempt), highlight: true },
          { label: "Taxable HRA", value: fmtInr(result.taxableHra) },
        ]}
      />
      <p className="text-sm text-theme-muted">
        Exemption = least of: HRA received ({fmtInr(result.a)}), {metro ? "50%" : "40%"} of basic ({fmtInr(result.b)}), rent − 10% basic ({fmtInr(result.c)}).
      </p>
    </CalcLayout>
  );
}

export function GratuityCalculatorTool() {
  const [lastDrawn, setLastDrawn] = useState(50000);
  const [years, setYears] = useState(7);
  const [months, setMonths] = useState(0);

  const result = useMemo(() => {
    const y = years + (months >= 6 ? 1 : 0);
    const amount = (lastDrawn * 15 * y) / 26;
    const taxFreeCap = 2000000;
    return { y, amount, taxable: Math.max(0, amount - taxFreeCap) };
  }, [lastDrawn, years, months]);

  return (
    <CalcLayout>
      <CalculatorSlider label="Last drawn basic + DA (monthly)" value={lastDrawn} min={10000} max={500000} step={1000} prefix="₹" onChange={setLastDrawn} />
      <CalculatorSlider label="Completed years" value={years} min={0} max={40} step={1} unit=" yrs" onChange={setYears} />
      <CalculatorSlider label="Extra months" value={months} min={0} max={11} step={1} unit=" mo" onChange={setMonths} />
      <KPIStrip
        items={[
          { label: "Service years (rounded)", value: `${result.y}`, highlight: true },
          { label: "Gratuity", value: fmtInr(result.amount) },
          { label: "Above ₹20L cap", value: fmtInr(result.taxable) },
        ]}
      />
      <p className="text-xs text-theme-subtle">Formula: (Last drawn salary × 15 × years) / 26. Eligibility typically after 5 years. Tax-free cap commonly cited at ₹20 lakh for private sector — confirm current law.</p>
    </CalcLayout>
  );
}

export function HsnSacFinderTool() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return HSN_SAC_SAMPLE.slice(0, 12);
    return HSN_SAC_SAMPLE.filter(
      (r) => r.code.includes(s) || r.description.toLowerCase().includes(s) || r.type.toLowerCase().includes(s)
    ).slice(0, 40);
  }, [q]);

  return (
    <CalcLayout>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search HSN / SAC code or description…"
        className="input-field"
      />
      <div className="overflow-x-auto rounded-xl border border-theme">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-theme bg-theme-surface/60 text-left text-xs uppercase text-theme-subtle">
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">GST %</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {hits.map((r) => (
              <tr key={`${r.type}-${r.code}`} className="border-b border-theme/60">
                <td className="p-3 font-mono font-semibold text-theme-heading">{r.code}</td>
                <td className="p-3 text-theme-muted">{r.type}</td>
                <td className="p-3">{r.gstRate}%</td>
                <td className="p-3 text-theme-muted">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-theme-subtle">Sample directory for common codes — verify against the official GST tariff before filing.</p>
    </CalcLayout>
  );
}

export function IfscFinderTool() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return IFSC_SAMPLE.slice(0, 10);
    return IFSC_SAMPLE.filter(
      (r) =>
        r.ifsc.toLowerCase().includes(s) ||
        r.bank.toLowerCase().includes(s) ||
        r.branch.toLowerCase().includes(s) ||
        r.city.toLowerCase().includes(s)
    ).slice(0, 40);
  }, [q]);

  return (
    <CalcLayout>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search IFSC, bank, branch, or city…" className="input-field" />
      <div className="overflow-x-auto rounded-xl border border-theme">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-theme bg-theme-surface/60 text-left text-xs uppercase text-theme-subtle">
              <th className="p-3">IFSC</th>
              <th className="p-3">Bank</th>
              <th className="p-3">Branch</th>
              <th className="p-3">City</th>
            </tr>
          </thead>
          <tbody>
            {hits.map((r) => (
              <tr key={r.ifsc} className="border-b border-theme/60">
                <td className="p-3 font-mono font-semibold text-theme-heading">{r.ifsc}</td>
                <td className="p-3">{r.bank}</td>
                <td className="p-3 text-theme-muted">{r.branch}</td>
                <td className="p-3 text-theme-muted">{r.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-theme-subtle">Curated sample of major bank IFSCs for quick lookup. Confirm with your bank before initiating transfers.</p>
    </CalcLayout>
  );
}

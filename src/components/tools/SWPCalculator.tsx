"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

interface LicPolicyRow {
  id: string;
  name: string;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
}

function newPolicy(): LicPolicyRow {
  const y = new Date().getFullYear();
  return {
    id: crypto.randomUUID(),
    name: "LIC endowment",
    startDate: `${y - 10}-04-01`,
    maturityDate: `${y + 5}-04-01`,
    maturityAmount: 500000,
  };
}

function monthsFromToday(isoDate: string): number | null {
  if (!isoDate) return null;
  const t = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(t.getTime())) return null;
  const now = new Date();
  return (t.getFullYear() - now.getFullYear()) * 12 + (t.getMonth() - now.getMonth());
}

export default function SWPCalculator() {
  const [mfCorpus, setMfCorpus] = useState(5000000);
  const [pfBalance, setPfBalance] = useState(0);
  const [includePfNow, setIncludePfNow] = useState(true);
  const [pfAccessDate, setPfAccessDate] = useState("");
  const [pfGrowthRate, setPfGrowthRate] = useState(8.25);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(40000);
  const [returnRate, setReturnRate] = useState(10);
  const [years, setYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(6);
  const [inflationAdjustWithdrawals, setInflationAdjustWithdrawals] = useState(false);
  const [policies, setPolicies] = useState<LicPolicyRow[]>([]);

  const results = useMemo(() => {
    const monthlyRate = returnRate / 12 / 100;
    const pfMonthly = pfGrowthRate / 12 / 100;
    const months = years * 12;

    const starting =
      mfCorpus + (includePfNow && pfBalance > 0 ? pfBalance : 0);

    let balance = starting;
    let pfPocket = !includePfNow && pfBalance > 0 ? pfBalance : 0;
    const pfAccessMonth = !includePfNow ? monthsFromToday(pfAccessDate) : null;

    const injections = policies
      .map((p) => ({
        name: p.name,
        amount: p.maturityAmount,
        month: monthsFromToday(p.maturityDate),
      }))
      .filter((p) => p.month !== null && p.month! >= 0 && p.month! <= months) as {
      name: string;
      amount: number;
      month: number;
    }[];

    const chartData: {
      month: number;
      balance: number;
      balancePV: number;
      withdrawn: number;
      withdrawnPV: number;
    }[] = [{ month: 0, balance: starting, balancePV: starting, withdrawn: 0, withdrawnPV: 0 }];

    let totalWithdrawn = 0;
    let currentWithdrawal = monthlyWithdrawal;
    let licInjected = 0;
    let pfInjected = 0;
    const injectionLog: string[] = [];

    for (let m = 1; m <= months; m++) {
      if (pfPocket > 0) {
        pfPocket *= 1 + pfMonthly;
      }

      for (const inj of injections) {
        if (inj.month === m) {
          balance += inj.amount;
          licInjected += inj.amount;
          injectionLog.push(`Y${(m / 12).toFixed(1)}: ${inj.name} +${formatCurrency(inj.amount)}`);
        }
      }

      if (pfAccessMonth !== null && pfAccessMonth === m && pfPocket > 0) {
        balance += pfPocket;
        pfInjected += pfPocket;
        injectionLog.push(`Y${(m / 12).toFixed(1)}: PF access +${formatCurrency(pfPocket)}`);
        pfPocket = 0;
      }

      if (inflationAdjustWithdrawals && m > 1 && (m - 1) % 12 === 0) {
        currentWithdrawal *= 1 + inflationRate / 100;
      }
      balance = balance * (1 + monthlyRate) - currentWithdrawal;
      if (balance < 0) balance = 0;
      totalWithdrawn += currentWithdrawal;

      if (m % 12 === 0) {
        const y = m / 12;
        chartData.push({
          month: y,
          balance: Math.round(balance),
          balancePV: Math.round(presentValue(balance, inflationRate, y)),
          withdrawn: Math.round(totalWithdrawn),
          withdrawnPV: Math.round(presentValue(totalWithdrawn, inflationRate, y)),
        });
      }
    }

    const finalBalance = Math.max(balance, 0);
    const leftoverPf = pfPocket;
    const finalBalancePV = presentValue(finalBalance, inflationRate, years);
    const totalWithdrawnPV = presentValue(totalWithdrawn, inflationRate, years);
    const startingCorpus = starting;

    return {
      finalBalance,
      finalBalancePV,
      totalWithdrawn,
      totalWithdrawnPV,
      startingCorpus,
      licInjected,
      pfInjected,
      leftoverPf,
      injectionLog,
      pieData: [
        { name: "Withdrawn", value: totalWithdrawn },
        { name: "Remaining SWP", value: finalBalance },
        { name: "Unused PF pocket", value: leftoverPf },
      ].filter((d) => d.value > 0),
      chartData,
    };
  }, [
    mfCorpus,
    pfBalance,
    includePfNow,
    pfAccessDate,
    pfGrowthRate,
    monthlyWithdrawal,
    returnRate,
    years,
    inflationRate,
    inflationAdjustWithdrawals,
    policies,
  ]);

  const updatePolicy = (id: string, patch: Partial<LicPolicyRow>) => {
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card space-y-6 p-8">
          <h2 className="text-xl font-bold text-theme-heading">SWP & investable corpus</h2>
          <CalculatorSlider
            label="Mutual fund / SWP corpus"
            value={mfCorpus}
            min={100000}
            max={50000000}
            step={100000}
            prefix="₹"
            onChange={setMfCorpus}
          />
          <CalculatorSlider
            label="Monthly withdrawal"
            value={monthlyWithdrawal}
            min={1000}
            max={500000}
            step={1000}
            prefix="₹"
            onChange={setMonthlyWithdrawal}
          />
          <CalculatorSlider label="Expected return (invested corpus)" value={returnRate} min={1} max={20} step={0.5} unit="%" onChange={setReturnRate} />
          <CalculatorSlider label="Time period" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />

          <div className="rounded-xl border border-theme p-4 space-y-3">
            <h3 className="text-sm font-semibold text-theme-heading">Provident Fund (PF)</h3>
            <CalculatorSlider label="Current PF balance" value={pfBalance} min={0} max={20000000} step={10000} prefix="₹" onChange={setPfBalance} />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
              <input type="checkbox" checked={includePfNow} onChange={(e) => setIncludePfNow(e.target.checked)} />
              Add PF to SWP corpus from day one
            </label>
            {!includePfNow && pfBalance > 0 && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-theme-subtle">PF access / transfer date</label>
                  <input type="date" value={pfAccessDate} onChange={(e) => setPfAccessDate(e.target.value)} className="input-field" />
                </div>
                <CalculatorSlider label="PF growth until access" value={pfGrowthRate} min={5} max={12} step={0.05} unit="%" onChange={setPfGrowthRate} />
              </>
            )}
            <p className="text-xs text-theme-subtle">
              Project future PF with the{" "}
              <Link href="/tools/pf-calculator" className="text-accent hover:underline">
                PF calculator
              </Link>
              , then paste the balance here.
            </p>
          </div>

          <AdvancedOptions>
            <CalculatorSlider label="Inflation rate" value={inflationRate} min={1} max={15} step={0.5} unit="%" onChange={setInflationRate} />
            <label className="flex cursor-pointer items-center gap-3 text-sm text-theme-muted">
              <input
                type="checkbox"
                checked={inflationAdjustWithdrawals}
                onChange={(e) => setInflationAdjustWithdrawals(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-slate-800 accent-accent"
              />
              Increase withdrawals annually by inflation rate
            </label>
          </AdvancedOptions>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <PurchasingPowerCard
              label="Total final SWP balance"
              nominalValue={results.finalBalance}
              presentValue={results.finalBalancePV}
              highlight
            />
            <PurchasingPowerCard
              label="Total withdrawn"
              nominalValue={results.totalWithdrawn}
              presentValue={results.totalWithdrawnPV}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Starting corpus (MF + PF if now)" value={results.startingCorpus} variant="blue" />
            <ResultCard label="LIC maturities injected" value={results.licInjected} variant="emerald" />
          </div>
          {(results.pfInjected > 0 || results.leftoverPf > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultCard label="PF injected into SWP" value={results.pfInjected} variant="blue" />
              <ResultCard label="PF left outside SWP" value={results.leftoverPf} variant="emerald" />
            </div>
          )}
        </div>
      </div>

      <div className="glass-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-theme-heading">LIC policies (optional, multiple)</h3>
            <p className="mt-1 text-sm text-theme-muted">
              Add each policy’s maturity date and estimated maturity amount. When a policy matures during the SWP
              horizon, that lump sum is added to the invested corpus. Estimate amounts with the{" "}
              <Link href="/tools/lic-maturity-calculator" className="text-accent hover:underline">
                LIC maturity calculator
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPolicies((p) => [...p, newPolicy()])}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> Add LIC policy
          </button>
        </div>

        {policies.length === 0 ? (
          <p className="text-sm text-theme-subtle">No LIC policies added — SWP runs on MF corpus (+ PF rules) only.</p>
        ) : (
          <div className="space-y-4">
            {policies.map((p) => (
              <div key={p.id} className="grid gap-3 rounded-xl border border-theme p-4 md:grid-cols-2 lg:grid-cols-5">
                <input
                  value={p.name}
                  onChange={(e) => updatePolicy(p.id, { name: e.target.value })}
                  className="input-field lg:col-span-2"
                  placeholder="Plan name"
                />
                <div>
                  <label className="mb-1 block text-xs text-theme-subtle">Start date</label>
                  <input type="date" value={p.startDate} onChange={(e) => updatePolicy(p.id, { startDate: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-theme-subtle">Maturity date</label>
                  <input
                    type="date"
                    value={p.maturityDate}
                    onChange={(e) => updatePolicy(p.id, { maturityDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-theme-subtle">Est. maturity ₹</label>
                    <input
                      type="number"
                      min={0}
                      value={p.maturityAmount}
                      onChange={(e) => updatePolicy(p.id, { maturityAmount: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPolicies((prev) => prev.filter((x) => x.id !== p.id))}
                    className="mb-1 rounded-lg p-2 text-theme-subtle hover:text-red-500"
                    aria-label="Remove policy"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.injectionLog.length > 0 && (
          <div className="rounded-xl bg-accent/5 p-4 text-sm text-theme-muted">
            <p className="font-semibold text-theme-heading">Scheduled corpus top-ups</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {results.injectionLog.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-theme-body">Withdrawal breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {results.pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-theme-body">Balance: nominal vs purchasing power</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={results.chartData}>
              <defs>
                <linearGradient id="swpNominal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="swpPV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickFormatter={(v) => `Y${v}`} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              />
              <Legend />
              <Area type="monotone" dataKey="balance" name="Nominal" stroke="#10b981" fill="url(#swpNominal)" strokeWidth={2} />
              <Area type="monotone" dataKey="balancePV" name="Purchasing Power" stroke="#3b82f6" fill="url(#swpPV)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

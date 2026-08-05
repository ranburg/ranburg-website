"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";
import { formatCurrency } from "@/lib/utils";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

/**
 * EPF-style projection with existing balance, monthly contribution, salary hike, and interest.
 */
export default function PfCalculator() {
  const [existingBalance, setExistingBalance] = useState(350000);
  const [monthlyBasic, setMonthlyBasic] = useState(40000);
  const [employeePct, setEmployeePct] = useState(12);
  const [employerPct, setEmployerPct] = useState(12);
  const [capPf, setCapPf] = useState(false);
  const [salaryHike, setSalaryHike] = useState(8);
  const [interestRate, setInterestRate] = useState(8.25);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const monthlyInterest = interestRate / 12 / 100;
    const capAmount = 1800; // classic wage-ceiling style employee PF cap illustration
    let balance = existingBalance;
    let basic = monthlyBasic;
    let totalEmployee = 0;
    let totalEmployer = 0;
    const chart: { year: number; balance: number; contribution: number }[] = [
      { year: 0, balance: Math.round(existingBalance), contribution: 0 },
    ];

    for (let y = 1; y <= years; y++) {
      let yearContrib = 0;
      for (let m = 0; m < 12; m++) {
        let emp = (basic * employeePct) / 100;
        let er = (basic * employerPct) / 100;
        if (capPf) {
          emp = Math.min(emp, capAmount);
          er = Math.min(er, capAmount);
        }
        totalEmployee += emp;
        totalEmployer += er;
        yearContrib += emp + er;
        balance = balance * (1 + monthlyInterest) + emp + er;
      }
      basic *= 1 + salaryHike / 100;
      chart.push({
        year: y,
        balance: Math.round(balance),
        contribution: Math.round(yearContrib),
      });
    }

    const totalContributed = totalEmployee + totalEmployer;
    const interestEarned = balance - existingBalance - totalContributed;

    return {
      finalBalance: balance,
      totalEmployee,
      totalEmployer,
      totalContributed,
      interestEarned,
      chart,
      endingBasic: basic,
    };
  }, [existingBalance, monthlyBasic, employeePct, employerPct, capPf, salaryHike, interestRate, years]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-5 p-6">
        <h3 className="font-semibold text-theme-heading">PF projection inputs</h3>
        <CalculatorSlider
          label="Existing PF balance"
          value={existingBalance}
          min={0}
          max={10000000}
          step={10000}
          prefix="₹"
          onChange={setExistingBalance}
        />
        <CalculatorSlider
          label="Current monthly basic (for PF %)"
          value={monthlyBasic}
          min={5000}
          max={500000}
          step={1000}
          prefix="₹"
          onChange={setMonthlyBasic}
        />
        <CalculatorSlider label="Employee contribution %" value={employeePct} min={0} max={20} step={0.5} unit="%" onChange={setEmployeePct} />
        <CalculatorSlider label="Employer contribution %" value={employerPct} min={0} max={20} step={0.5} unit="%" onChange={setEmployerPct} />
        <CalculatorSlider label="Expected salary hike / year" value={salaryHike} min={0} max={20} step={0.5} unit="%" onChange={setSalaryHike} />
        <CalculatorSlider label="PF interest rate / year" value={interestRate} min={5} max={12} step={0.05} unit="%" onChange={setInterestRate} />
        <CalculatorSlider label="Years to project" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={capPf} onChange={(e) => setCapPf(e.target.checked)} />
          Cap monthly PF at ₹1,800 (wage-ceiling style)
        </label>
        <p className="text-xs text-theme-subtle">
          Monthly contribution starts as {(employeePct + employerPct).toFixed(1)}% of basic (
          {fmt((monthlyBasic * (employeePct + employerPct)) / 100)}), then grows with your salary hike each year.
        </p>
      </div>

      <div className="space-y-5">
        <KPIStrip
          items={[
            { label: "Projected PF corpus", value: fmt(result.finalBalance), highlight: true },
            { label: "Total contributions", value: fmt(result.totalContributed) },
            { label: "Interest earned (est.)", value: fmt(result.interestEarned) },
          ]}
        />
        <KPIStrip
          items={[
            { label: "Employee share", value: fmt(result.totalEmployee) },
            { label: "Employer share", value: fmt(result.totalEmployer) },
            { label: "Basic after hikes", value: fmt(result.endingBasic) },
          ]}
        />
        <div className="glass-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-theme-heading">PF balance over time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="balance" name="PF balance" stroke="#0f766e" fill="#0f766e33" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-theme-subtle">
          Educational EPF-style model. Actual EPFO interest, EPS diversion, taxable withdrawals, and employer structures
          differ. Confirm on the EPFO member portal / UAN passbook.
        </p>
      </div>
    </div>
  );
}

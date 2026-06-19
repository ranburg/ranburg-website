"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#f59e0b"];

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
  const [inflationRate, setInflationRate] = useState(6);

  const results = useMemo(() => {
    const months = tenureUnit === "years" ? tenure * 12 : tenure;
    const monthlyRate = interestRate / 12 / 100;

    let emi: number;
    if (monthlyRate === 0) {
      emi = loanAmount / months;
    } else {
      emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    const tenureYears = tenureUnit === "years" ? tenure : tenure / 12;
    const totalPaymentPV = presentValue(totalPayment, inflationRate, tenureYears);

    const yearlyBreakdown = [];
    let remainingPrincipal = loanAmount;
    for (let y = 1; y <= Math.ceil(months / 12); y++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      const monthsInYear = Math.min(12, months - (y - 1) * 12);

      for (let m = 0; m < monthsInYear; m++) {
        const interestPortion = remainingPrincipal * monthlyRate;
        const principalPortion = emi - interestPortion;
        yearInterest += interestPortion;
        yearPrincipal += principalPortion;
        remainingPrincipal -= principalPortion;
      }

      yearlyBreakdown.push({
        year: `Y${y}`,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      totalPaymentPV,
      pieData: [
        { name: "Principal", value: loanAmount },
        { name: "Interest", value: totalInterest },
      ],
      yearlyBreakdown,
    };
  }, [loanAmount, interestRate, tenure, tenureUnit, inflationRate]);

  const tenureMax = tenureUnit === "years" ? 30 : 360;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-8 p-8">
        <h2 className="text-xl font-bold text-white">Adjust Parameters</h2>
        <CalculatorSlider
          label="Loan Amount"
          value={loanAmount}
          min={100000}
          max={100000000}
          step={100000}
          prefix="₹"
          onChange={setLoanAmount}
        />
        <CalculatorSlider
          label="Interest Rate"
          value={interestRate}
          min={1}
          max={20}
          step={0.1}
          unit="%"
          onChange={setInterestRate}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Loan Tenure</label>
            <div className="flex rounded-lg border border-white/10 p-0.5">
              {(["years", "months"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => {
                    setTenureUnit(unit);
                    setTenure(unit === "years" ? 20 : 240);
                  }}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition-all",
                    tenureUnit === unit
                      ? "bg-accent text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <CalculatorSlider
            label=""
            value={tenure}
            min={1}
            max={tenureMax}
            step={1}
            unit={tenureUnit === "years" ? " yrs" : " mo"}
            onChange={setTenure}
          />
        </div>

        <AdvancedOptions>
          <CalculatorSlider
            label="Inflation Rate (for PV adjustment)"
            value={inflationRate}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            onChange={setInflationRate}
          />
        </AdvancedOptions>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="Monthly EMI" value={results.emi} highlight variant="blue" />
          <ResultCard
            label="Total Interest"
            value={results.totalInterest}
            variant="emerald"
          />
          <ResultCard label="Total Payment" value={results.totalPayment} />
        </div>

        <PurchasingPowerCard
          label="Total Payment"
          nominalValue={results.totalPayment}
          presentValue={results.totalPaymentPV}
          highlight
        />

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">
            Payment Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={results.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {results.pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {results.pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="text-sm text-slate-400">{item.name}</span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">
            Yearly Principal vs Interest
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={results.yearlyBreakdown}>
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="principal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

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
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";

const COLORS = ["#10b981", "#3b82f6"];

export default function SWPCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(40000);
  const [returnRate, setReturnRate] = useState(10);
  const [years, setYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(6);
  const [inflationAdjustWithdrawals, setInflationAdjustWithdrawals] = useState(false);

  const results = useMemo(() => {
    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;
    let balance = totalInvestment;
    const chartData: {
      month: number;
      balance: number;
      balancePV: number;
      withdrawn: number;
      withdrawnPV: number;
    }[] = [{ month: 0, balance: totalInvestment, balancePV: totalInvestment, withdrawn: 0, withdrawnPV: 0 }];

    let totalWithdrawn = 0;
    let currentWithdrawal = monthlyWithdrawal;

    for (let m = 1; m <= months; m++) {
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
    const finalBalancePV = presentValue(finalBalance, inflationRate, years);
    const totalWithdrawnPV = presentValue(totalWithdrawn, inflationRate, years);

    return {
      finalBalance,
      finalBalancePV,
      totalWithdrawn,
      totalWithdrawnPV,
      pieData: [
        { name: "Withdrawn", value: totalWithdrawn },
        { name: "Remaining", value: finalBalance },
      ],
      chartData,
    };
  }, [totalInvestment, monthlyWithdrawal, returnRate, years, inflationRate, inflationAdjustWithdrawals]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-8">
        <h2 className="text-xl font-bold text-white">Adjust Parameters</h2>
        <CalculatorSlider
          label="Total Investment"
          value={totalInvestment}
          min={100000}
          max={50000000}
          step={100000}
          prefix="₹"
          onChange={setTotalInvestment}
        />
        <CalculatorSlider
          label="Monthly Withdrawal"
          value={monthlyWithdrawal}
          min={1000}
          max={500000}
          step={1000}
          prefix="₹"
          onChange={setMonthlyWithdrawal}
        />
        <CalculatorSlider
          label="Expected Return Rate"
          value={returnRate}
          min={1}
          max={20}
          step={0.5}
          unit="%"
          onChange={setReturnRate}
        />
        <CalculatorSlider
          label="Time Period"
          value={years}
          min={1}
          max={40}
          step={1}
          unit=" yrs"
          onChange={setYears}
        />

        <AdvancedOptions>
          <CalculatorSlider
            label="Inflation Rate"
            value={inflationRate}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            onChange={setInflationRate}
          />
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
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
            label="Total Final Balance"
            nominalValue={results.finalBalance}
            presentValue={results.finalBalancePV}
            highlight
          />
          <PurchasingPowerCard
            label="Total Withdrawn"
            nominalValue={results.totalWithdrawn}
            presentValue={results.totalWithdrawnPV}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="Nominal Final Balance"
            value={results.finalBalance}
            variant="blue"
          />
          <ResultCard
            label="Today's Purchasing Power"
            value={results.finalBalancePV}
            variant="emerald"
            highlight
          />
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">Withdrawal Breakdown</h3>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ResponsiveContainer width="100%" height={180}>
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
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">
            Balance: Nominal vs Purchasing Power
          </h3>
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
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
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

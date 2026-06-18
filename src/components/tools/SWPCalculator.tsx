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
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import ResultCard from "@/components/tools/ResultCard";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#10b981", "#3b82f6"];

export default function SWPCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(40000);
  const [returnRate, setReturnRate] = useState(10);
  const [years, setYears] = useState(15);

  const results = useMemo(() => {
    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;
    let balance = totalInvestment;
    const chartData = [{ month: 0, balance: totalInvestment }];

    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      if (balance < 0) balance = 0;
      if (m % 12 === 0) {
        chartData.push({
          month: m / 12,
          balance: Math.round(balance),
        });
      }
    }

    const totalWithdrawn = monthlyWithdrawal * months;
    const finalBalance = Math.max(balance, 0);

    return {
      finalBalance,
      totalWithdrawn,
      pieData: [
        { name: "Withdrawn", value: totalWithdrawn },
        { name: "Remaining", value: finalBalance },
      ],
      chartData,
    };
  }, [totalInvestment, monthlyWithdrawal, returnRate, years]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-8 p-8">
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
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="Total Final Balance"
            value={results.finalBalance}
            highlight
            variant="blue"
          />
          <ResultCard
            label="Total Withdrawn"
            value={results.totalWithdrawn}
            variant="emerald"
          />
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">
            Withdrawal Breakdown
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
            Balance Over Time
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={results.chartData}>
              <defs>
                <linearGradient id="swpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => `Y${v}`}
              />
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
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#10b981"
                fill="url(#swpGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

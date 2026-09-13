"use client";

import { useToolUi } from "@/hooks/useToolUi";

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
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";
import { sipFutureValue } from "@/lib/finance/sipProjection";

const COLORS = ["#3b82f6", "#10b981"];

export default function SIPCalculator() {
  const { t } = useToolUi("sip");
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [stepUpPercent, setStepUpPercent] = useState(0);

  const results = useMemo(() => {
    const { futureValue, totalInvested, chart } = sipFutureValue({
      monthlyInvestment,
      annualReturnPct: returnRate,
      years,
      stepUpPercent,
    });

    const estimatedReturns = futureValue - totalInvested;
    const futureValuePV = presentValue(futureValue, inflationRate, years);

    return {
      totalInvestment: totalInvested,
      estimatedReturns,
      totalValue: futureValue,
      totalValuePV: futureValuePV,
      pieData: [
        { name: t("investedAmount"), value: totalInvested },
        { name: t("wealthGained"), value: Math.max(estimatedReturns, 0) },
      ],
      chartData: chart.map((row) => ({
        year: `Y${row.year}`,
        invested: row.invested,
        value: Math.round(row.value),
        valuePV: Math.round(presentValue(row.value, inflationRate, row.year)),
      })),
    };
  }, [monthlyInvestment, returnRate, years, inflationRate, stepUpPercent, t]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="tool-surface space-y-6 p-5 sm:p-7">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-subtle">{t("adjustParameters")}</h2>
        <CalculatorSlider
          label={t("monthlyInvestment")}
          value={monthlyInvestment}
          min={500}
          max={500000}
          step={500}
          prefix="₹"
          onChange={setMonthlyInvestment}
        />
        <CalculatorSlider
          label={t("expectedReturn")}
          value={returnRate}
          min={1}
          max={30}
          step={0.5}
          unit="%"
          onChange={setReturnRate}
        />
        <CalculatorSlider
          label={t("tenureYears")}
          value={years}
          min={1}
          max={40}
          step={1}
          unit=" yrs"
          onChange={setYears}
        />

        <AdvancedOptions>
          <CalculatorSlider
            label={t("inflationRate")}
            value={inflationRate}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            onChange={setInflationRate}
          />
          <CalculatorSlider
            label={t("annualSipStepUp")}
            value={stepUpPercent}
            min={0}
            max={25}
            step={1}
            unit="%"
            onChange={setStepUpPercent}
          />
        </AdvancedOptions>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label={t("investedAmount")} value={results.totalInvestment} />
          <ResultCard
            label={t("wealthGained")}
            value={results.estimatedReturns}
            variant="emerald"
          />
          <ResultCard
            label={t("maturityAmount")}
            value={results.totalValue}
            highlight
            variant="blue"
          />
        </div>

        <PurchasingPowerCard
          label={t("maturityAmount")}
          nominalValue={results.totalValue}
          presentValue={results.totalValuePV}
          highlight
        />

        <div className="tool-surface p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-theme-body">
            {t("investmentBreakdown")}
          </h3>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="h-[180px] w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
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
            <div className="w-full space-y-3 sm:w-1/2">
              {results.pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="text-sm text-theme-muted">{item.name}</span>
                  <span className="text-sm font-semibold text-theme-heading">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tool-surface p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-theme-body">{t("growthOverTime")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={results.chartData}>
              <defs>
                <linearGradient id="sipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#sipGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

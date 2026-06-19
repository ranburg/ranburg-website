"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";

export default function LTVCACCalculator() {
  const [arpu, setArpu] = useState(5000);
  const [grossMargin, setGrossMargin] = useState(80);
  const [lifespan, setLifespan] = useState(24);
  const [churnRate, setChurnRate] = useState(5);
  const [marketingSpend, setMarketingSpend] = useState(500000);
  const [newCustomers, setNewCustomers] = useState(50);
  const [inflationRate, setInflationRate] = useState(6);
  const [projectionYears, setProjectionYears] = useState(3);

  const results = useMemo(() => {
    const monthlyChurn = churnRate / 100;
    const ltv = monthlyChurn > 0 ? (arpu * (grossMargin / 100)) / monthlyChurn : arpu * lifespan * (grossMargin / 100);
    const cac = newCustomers > 0 ? marketingSpend / newCustomers : 0;
    const ratio = cac > 0 ? ltv / cac : 0;
    const annualRevenue = arpu * 12 * newCustomers * (grossMargin / 100);
    const projectedRevenue = annualRevenue * Math.pow(1.1, projectionYears);
    const projectedRevenuePV = presentValue(projectedRevenue, inflationRate, projectionYears);

    return { ltv, cac, ratio, annualRevenue, projectedRevenue, projectedRevenuePV };
  }, [arpu, grossMargin, lifespan, churnRate, marketingSpend, newCustomers, inflationRate, projectionYears]);

  const ratioColor = results.ratio >= 3 ? "text-accent-emerald" : results.ratio >= 1 ? "text-accent" : "text-red-400";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-8">
        <h2 className="text-xl font-bold text-theme-heading">Business Metrics</h2>
        <CalculatorSlider label="Monthly ARPU" value={arpu} min={100} max={100000} step={100} prefix="₹" onChange={setArpu} />
        <CalculatorSlider label="Gross Margin" value={grossMargin} min={10} max={100} step={1} unit="%" onChange={setGrossMargin} />
        <CalculatorSlider label="Monthly Churn Rate" value={churnRate} min={0.5} max={20} step={0.5} unit="%" onChange={setChurnRate} />
        <CalculatorSlider label="Marketing Spend" value={marketingSpend} min={10000} max={10000000} step={10000} prefix="₹" onChange={setMarketingSpend} />
        <CalculatorSlider label="New Customers Acquired" value={newCustomers} min={1} max={1000} step={1} onChange={setNewCustomers} />

        <AdvancedOptions>
          <CalculatorSlider label="Inflation Rate" value={inflationRate} min={1} max={15} step={0.5} unit="%" onChange={setInflationRate} />
          <CalculatorSlider label="Revenue Projection (Years)" value={projectionYears} min={1} max={10} step={1} unit=" yrs" onChange={setProjectionYears} />
          <CalculatorSlider label="Customer Lifespan (fallback)" value={lifespan} min={1} max={60} step={1} unit=" mo" onChange={setLifespan} />
        </AdvancedOptions>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Customer LTV" value={results.ltv} variant="blue" highlight />
          <ResultCard label="CAC" value={results.cac} />
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-slate-500">LTV:CAC Ratio</p>
          <p className={`mt-2 text-5xl font-bold ${ratioColor}`}>
            {results.ratio.toFixed(1)}:1
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {results.ratio >= 3 ? "Healthy — sustainable growth" : results.ratio >= 1 ? "Break-even zone — optimize CAC" : "Warning — CAC exceeds LTV"}
          </p>
        </div>
        <PurchasingPowerCard
          label={`Projected Annual Revenue (Y${projectionYears})`}
          nominalValue={results.projectedRevenue}
          presentValue={results.projectedRevenuePV}
          highlight
        />
      </div>
    </div>
  );
}

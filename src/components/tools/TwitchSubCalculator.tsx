"use client";

import { useToolUi } from "@/hooks/useToolUi";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import PurchasingPowerCard from "@/components/tools/PurchasingPowerCard";
import { formatCurrency, presentValue } from "@/lib/utils";

const TIER_PRICES = { tier1: 4.99, tier2: 9.99, tier3: 24.99 };

export default function TwitchSubCalculator() {
  const { t } = useToolUi("twitch-sub-revenue");
  const [tier1, setTier1] = useState(200);
  const [tier2, setTier2] = useState(30);
  const [tier3, setTier3] = useState(10);
  const [revenueShare, setRevenueShare] = useState(50);
  const [adRevenue, setAdRevenue] = useState(500);
  const [growthRate, setGrowthRate] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [projectionYears, setProjectionYears] = useState(3);
  const [usdToInr, setUsdToInr] = useState(83);

  const results = useMemo(() => {
    const share = revenueShare / 100;
    const subRevenueUsd =
      tier1 * TIER_PRICES.tier1 * share +
      tier2 * TIER_PRICES.tier2 * share +
      tier3 * TIER_PRICES.tier3 * share;
    const monthlyUsd = subRevenueUsd + adRevenue;
    const monthlyInr = monthlyUsd * usdToInr;
    const annualInr = monthlyInr * 12;
    const projectedAnnual = annualInr * Math.pow(1 + growthRate / 100, projectionYears);
    const projectedPV = presentValue(projectedAnnual, inflationRate, projectionYears);

    return { monthlyInr, annualInr, subRevenueUsd: subRevenueUsd * usdToInr, adRevenueInr: adRevenue * usdToInr, projectedAnnual, projectedPV };
  }, [tier1, tier2, tier3, revenueShare, adRevenue, growthRate, inflationRate, projectionYears, usdToInr]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-8">
        <h2 className="text-xl font-bold text-theme-heading">{t("channelMetrics")}</h2>
        <CalculatorSlider label={t("tier1Subscribers")} value={tier1} min={0} max={10000} step={10} onChange={setTier1} />
        <CalculatorSlider label={t("tier2Subscribers")} value={tier2} min={0} max={2000} step={5} onChange={setTier2} />
        <CalculatorSlider label={t("tier3Subscribers")} value={tier3} min={0} max={500} step={1} onChange={setTier3} />
        <CalculatorSlider label={t("partnerRevenueShare")} value={revenueShare} min={50} max={70} step={1} unit="%" onChange={setRevenueShare} />
        <CalculatorSlider label={t("monthlyAdRevenue")} value={adRevenue} min={0} max={10000} step={50} prefix="$" onChange={setAdRevenue} />

        <AdvancedOptions>
          <CalculatorSlider label={t("annualGrowthRate")} value={growthRate} min={0} max={50} step={1} unit="%" onChange={setGrowthRate} />
          <CalculatorSlider label={t("inflationRate")} value={inflationRate} min={1} max={15} step={0.5} unit="%" onChange={setInflationRate} />
          <CalculatorSlider label={t("projectionPeriod")} value={projectionYears} min={1} max={10} step={1} unit=" yrs" onChange={setProjectionYears} />
          <CalculatorSlider label={t("usdToInrRate")} value={usdToInr} min={70} max={100} step={1} onChange={setUsdToInr} />
        </AdvancedOptions>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label={t("monthlyRevenue")} value={results.monthlyInr} highlight variant="blue" />
          <ResultCard label={t("annualRevenue")} value={results.annualInr} variant="emerald" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label={t("subscriptionRevenueMonthly")} value={results.subRevenueUsd} />
          <ResultCard label={t("adRevenueMonthly")} value={results.adRevenueInr} />
        </div>
        <PurchasingPowerCard
          label={`Projected Annual (Y${projectionYears})`}
          nominalValue={results.projectedAnnual}
          presentValue={results.projectedPV}
          highlight
        />
      </div>
    </div>
  );
}

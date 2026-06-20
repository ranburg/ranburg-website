"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { formatUsd } from "@/lib/socialInsights";

export default function YouTubeRevenueCalculator() {
  const [monthlyViews, setMonthlyViews] = useState(100_000);
  const [rpm, setRpm] = useState(4);
  const [sponsorshipDeals, setSponsorshipDeals] = useState(1);
  const [sponsorshipRate, setSponsorshipRate] = useState(500);
  const [membershipRevenue, setMembershipRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState(8);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const results = useMemo(() => {
    const adRevenue = (monthlyViews / 1000) * rpm;
    const sponsorshipRevenue = sponsorshipDeals * sponsorshipRate;
    const monthlyTotal = adRevenue + sponsorshipRevenue + membershipRevenue;
    const annualTotal = monthlyTotal * 12;

    const chartData = [];
    let views = monthlyViews;
    let cumulative = 0;
    for (let m = 1; m <= projectionMonths; m++) {
      const monthAd = (views / 1000) * rpm;
      const monthTotal = monthAd + sponsorshipRevenue + membershipRevenue;
      cumulative += monthTotal;
      chartData.push({
        month: `M${m}`,
        revenue: Math.round(monthTotal),
        cumulative: Math.round(cumulative),
      });
      views = Math.round(views * (1 + growthRate / 100 / 12));
    }

    return {
      adRevenue,
      sponsorshipRevenue,
      monthlyTotal,
      annualTotal,
      chartData,
    };
  }, [monthlyViews, rpm, sponsorshipDeals, sponsorshipRate, membershipRevenue, growthRate, projectionMonths]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card space-y-6 p-8">
          <h2 className="text-xl font-bold text-theme-heading">Channel Metrics</h2>
          <CalculatorSlider
            label="Monthly Views"
            value={monthlyViews}
            min={1000}
            max={10_000_000}
            step={1000}
            onChange={setMonthlyViews}
          />
          <CalculatorSlider
            label="RPM (Revenue per 1K views)"
            value={rpm}
            min={0.5}
            max={25}
            step={0.5}
            prefix="$"
            onChange={setRpm}
          />
          <CalculatorSlider
            label="Sponsorship Deals / Month"
            value={sponsorshipDeals}
            min={0}
            max={10}
            step={1}
            onChange={setSponsorshipDeals}
          />
          <CalculatorSlider
            label="Avg Sponsorship Rate"
            value={sponsorshipRate}
            min={0}
            max={50_000}
            step={100}
            prefix="$"
            onChange={setSponsorshipRate}
          />
          <AdvancedOptions>
            <CalculatorSlider
              label="Membership Revenue / Month"
              value={membershipRevenue}
              min={0}
              max={10_000}
              step={50}
              prefix="$"
              onChange={setMembershipRevenue}
            />
            <CalculatorSlider
              label="Monthly View Growth"
              value={growthRate}
              min={0}
              max={30}
              step={1}
              unit="%"
              onChange={setGrowthRate}
            />
            <CalculatorSlider
              label="Projection Period"
              value={projectionMonths}
              min={3}
              max={24}
              step={1}
              unit=" mo"
              onChange={setProjectionMonths}
            />
          </AdvancedOptions>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card border-accent/30 p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Ad Revenue / mo</p>
              <p className="mt-2 text-2xl font-bold text-accent">{formatUsd(results.adRevenue)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Revenue / mo</p>
              <p className="mt-2 text-2xl font-bold text-accent-emerald">{formatUsd(results.monthlyTotal)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Sponsorship / mo</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.sponsorshipRevenue)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Annual Revenue</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.annualTotal)}</p>
            </div>
          </div>
          <p className="text-xs text-theme-subtle">
            Typical YouTube RPM ranges: $1–$4 (broad), $4–$12 (finance/tech), $0.5–$2 (entertainment/kids).
            Actual earnings depend on niche, geography, and ad fill rate.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-bold text-theme-heading">Revenue Projection</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData}>
              <defs>
                <linearGradient id="ytRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatUsd(v)} />
              <Tooltip formatter={(v: number) => formatUsd(v)} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Monthly Revenue"
                stroke="#ef4444"
                fill="url(#ytRevGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

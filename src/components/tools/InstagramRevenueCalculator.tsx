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

export default function InstagramRevenueCalculator() {
  const [followers, setFollowers] = useState(50_000);
  const [engagementRate, setEngagementRate] = useState(3);
  const [sponsoredPosts, setSponsoredPosts] = useState(2);
  const [ratePerPost, setRatePerPost] = useState(300);
  const [affiliateCommission, setAffiliateCommission] = useState(200);
  const [reelsBonus, setReelsBonus] = useState(0);
  const [growthRate, setGrowthRate] = useState(5);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const results = useMemo(() => {
    const sponsorshipRevenue = sponsoredPosts * ratePerPost;
    const affiliateRevenue = affiliateCommission;
    const monthlyTotal = sponsorshipRevenue + affiliateRevenue + reelsBonus;
    const annualTotal = monthlyTotal * 12;

    const suggestedRate = Math.max(10, Math.round((followers / 1000) * engagementRate * 2.5));

    const chartData = [];
    let f = followers;
    let cumulative = 0;
    for (let m = 1; m <= projectionMonths; m++) {
      const dynamicRate = Math.max(10, Math.round((f / 1000) * engagementRate * 2.5));
      const monthSponsor = sponsoredPosts * Math.max(ratePerPost, dynamicRate * 0.5);
      const monthTotal = monthSponsor + affiliateRevenue + reelsBonus;
      cumulative += monthTotal;
      chartData.push({
        month: `M${m}`,
        revenue: Math.round(monthTotal),
        followers: Math.round(f),
      });
      f = Math.round(f * (1 + growthRate / 100 / 12));
    }

    return { sponsorshipRevenue, affiliateRevenue, monthlyTotal, annualTotal, suggestedRate, chartData };
  }, [
    followers,
    engagementRate,
    sponsoredPosts,
    ratePerPost,
    affiliateCommission,
    reelsBonus,
    growthRate,
    projectionMonths,
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card space-y-6 p-8">
          <h2 className="text-xl font-bold text-theme-heading">Profile Metrics</h2>
          <CalculatorSlider
            label="Followers"
            value={followers}
            min={500}
            max={5_000_000}
            step={500}
            onChange={setFollowers}
          />
          <CalculatorSlider
            label="Engagement Rate"
            value={engagementRate}
            min={0.5}
            max={15}
            step={0.5}
            unit="%"
            onChange={setEngagementRate}
          />
          <CalculatorSlider
            label="Sponsored Posts / Month"
            value={sponsoredPosts}
            min={0}
            max={12}
            step={1}
            onChange={setSponsoredPosts}
          />
          <CalculatorSlider
            label="Rate per Sponsored Post"
            value={ratePerPost}
            min={0}
            max={25_000}
            step={50}
            prefix="$"
            onChange={setRatePerPost}
          />
          <AdvancedOptions>
            <CalculatorSlider
              label="Affiliate / Shop Revenue / mo"
              value={affiliateCommission}
              min={0}
              max={10_000}
              step={50}
              prefix="$"
              onChange={setAffiliateCommission}
            />
            <CalculatorSlider
              label="Reels Bonus / mo"
              value={reelsBonus}
              min={0}
              max={5000}
              step={50}
              prefix="$"
              onChange={setReelsBonus}
            />
            <CalculatorSlider
              label="Follower Growth / Year"
              value={growthRate}
              min={0}
              max={50}
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
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Sponsorship / mo</p>
              <p className="mt-2 text-2xl font-bold text-accent">{formatUsd(results.sponsorshipRevenue)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Revenue / mo</p>
              <p className="mt-2 text-2xl font-bold text-accent-emerald">{formatUsd(results.monthlyTotal)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Suggested Post Rate</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.suggestedRate)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Annual Revenue</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.annualTotal)}</p>
            </div>
          </div>
          <p className="text-xs text-theme-subtle">
            Instagram creators earn via brand deals, affiliate links, and product sales — not direct ad revenue.
            Suggested rate uses ~$2.50 per 1K followers × engagement factor.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-bold text-theme-heading">Revenue Projection</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData}>
              <defs>
                <linearGradient id="igRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                stroke="#a855f7"
                fill="url(#igRevGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

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
  BarChart,
  Bar,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { formatUsd } from "@/lib/socialInsights";

export default function AdSenseRevenueCalculator() {
  const [pageViews, setPageViews] = useState(100_000);
  const [rpm, setRpm] = useState(5);
  const [ctr, setCtr] = useState(1.5);
  const [cpc, setCpc] = useState(0.35);
  const [trafficGrowth, setTrafficGrowth] = useState(10);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const results = useMemo(() => {
    const monthlyRevenue = (pageViews / 1000) * rpm;
    const clicks = pageViews * (ctr / 100);
    const cpcRevenue = clicks * cpc;
    const annualRevenue = monthlyRevenue * 12;
    const dailyRevenue = monthlyRevenue / 30;
    const dailyPageViews = Math.round(pageViews / 30);

    const chartData = [];
    let views = pageViews;
    for (let m = 1; m <= projectionMonths; m++) {
      const rev = (views / 1000) * rpm;
      chartData.push({
        month: `M${m}`,
        revenue: Math.round(rev),
        pageViews: Math.round(views),
      });
      views = Math.round(views * (1 + trafficGrowth / 100 / 12));
    }

    const nicheComparison = [
      { niche: "Finance", rpm: 12 },
      { niche: "Tech", rpm: 8 },
      { niche: "Health", rpm: 6 },
      { niche: "General", rpm: 4 },
      { niche: "Entertainment", rpm: 2 },
    ].map((n) => ({
      ...n,
      revenue: Math.round((pageViews / 1000) * n.rpm),
    }));

    return {
      monthlyRevenue,
      cpcRevenue,
      annualRevenue,
      dailyRevenue,
      dailyPageViews,
      clicks: Math.round(clicks),
      chartData,
      nicheComparison,
    };
  }, [pageViews, rpm, ctr, cpc, trafficGrowth, projectionMonths]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card space-y-6 p-8">
          <h2 className="text-xl font-bold text-theme-heading">Site Metrics</h2>
          <CalculatorSlider
            label="Monthly Page Views"
            value={pageViews}
            min={1000}
            max={10_000_000}
            step={1000}
            onChange={setPageViews}
          />
          <CalculatorSlider
            label="RPM (Revenue per 1K page views)"
            value={rpm}
            min={0.5}
            max={30}
            step={0.5}
            prefix="$"
            onChange={setRpm}
          />
          <AdvancedOptions>
            <CalculatorSlider
              label="Click-Through Rate (CTR)"
              value={ctr}
              min={0.1}
              max={10}
              step={0.1}
              unit="%"
              onChange={setCtr}
            />
            <CalculatorSlider
              label="Cost per Click (CPC)"
              value={cpc}
              min={0.05}
              max={5}
              step={0.05}
              prefix="$"
              onChange={setCpc}
            />
            <CalculatorSlider
              label="Traffic Growth / Year"
              value={trafficGrowth}
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={setTrafficGrowth}
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
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Monthly Revenue</p>
              <p className="mt-2 text-2xl font-bold text-accent">{formatUsd(results.monthlyRevenue)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Annual Revenue</p>
              <p className="mt-2 text-2xl font-bold text-accent-emerald">{formatUsd(results.annualRevenue)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Daily Revenue</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.dailyRevenue)}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Daily Page Views</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{results.dailyPageViews.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Est. Clicks / mo</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{results.clicks.toLocaleString()}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">CPC-based Revenue</p>
              <p className="mt-2 text-2xl font-bold text-theme-heading">{formatUsd(results.cpcRevenue)}</p>
            </div>
          </div>
          <p className="text-xs text-theme-subtle">
            Google AdSense RPM varies by niche, geography, ad placement, and seasonality.
            Finance and tech blogs often earn $8–$15 RPM; general content $2–$6.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-bold text-theme-heading">Revenue Projection</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.chartData}>
                <defs>
                  <linearGradient id="adsenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                  stroke="#f59e0b"
                  fill="url(#adsenseGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-bold text-theme-heading">Revenue by Niche (your traffic)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.nicheComparison} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tickFormatter={(v) => formatUsd(v)} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="niche" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={(v: number) => formatUsd(v)} />
                <Bar dataKey="revenue" name="Monthly Revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  formatSocialCount,
  formatUsd,
  type GrowthDataPoint,
  type MonetizationStatus,
  type RecentVideoStats,
  type RevenueEstimate,
  type SocialRecommendation,
} from "@/lib/socialInsights";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  TrendingUp,
  Users,
  Eye,
  Video,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function StatCard({ label, value, icon, highlight }: StatCardProps) {
  return (
    <div className={cn("glass-card p-5 text-center", highlight && "border-accent/30")}>
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-theme-subtle">{label}</p>
      <p className="mt-1 text-2xl font-bold text-theme-heading">{value}</p>
    </div>
  );
}

function MonetizationBadge({ status, message }: { status: MonetizationStatus; message: string }) {
  const styles = {
    not_monetized: {
      icon: <AlertCircle className="h-5 w-5" />,
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      label: "Not Monetized Yet",
    },
    eligible: {
      icon: <Clock className="h-5 w-5" />,
      className: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "Eligible for YPP",
    },
    likely_monetized: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      label: "Likely Monetized",
    },
  };
  const s = styles[status];

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4", s.className)}>
      <div className="mt-0.5 shrink-0">{s.icon}</div>
      <div>
        <p className="font-semibold">{s.label}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}

function GrowthChart({
  data,
  platform,
}: {
  data: GrowthDataPoint[];
  platform: "youtube" | "instagram";
}) {
  const primaryLabel = platform === "youtube" ? "Subscribers" : "Followers";
  const secondaryLabel = platform === "youtube" ? "Total Views" : "Posts";

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-theme-heading">Growth Trend</h3>
        <span className="text-xs text-theme-subtle">(estimated)</span>
      </div>
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle, #334155)" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--text-subtle, #94a3b8)" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="var(--text-subtle, #94a3b8)"
              tickFormatter={(v) => formatSocialCount(v)}
            />
            <Tooltip
              formatter={(value: number) => formatSocialCount(value)}
              contentStyle={{
                background: "var(--surface, #1e293b)",
                border: "1px solid var(--border-subtle, #334155)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="primary"
              name={primaryLabel}
              stroke="#3b82f6"
              fill="url(#primaryGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="secondary"
              name={secondaryLabel}
              stroke="#10b981"
              fill="url(#secondaryGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-theme-subtle">
        Historical and projected trends are modeled from public stats and channel age — not official YouTube or Instagram analytics.
      </p>
    </div>
  );
}

function RevenueSection({
  revenue,
  platform,
  monetization,
  showPotentialWhenNotMonetized,
}: {
  revenue: RevenueEstimate;
  platform: "youtube" | "instagram";
  monetization?: { status: MonetizationStatus; message: string };
  showPotentialWhenNotMonetized?: boolean;
}) {
  const isNotMonetized = monetization?.status === "not_monetized";
  const potentialLow = revenue.estimatedMonthlyViews
    ? (revenue.estimatedMonthlyViews / 1000) * revenue.rpmLow
    : 0;
  const potentialHigh = revenue.estimatedMonthlyViews
    ? (revenue.estimatedMonthlyViews / 1000) * revenue.rpmHigh
    : 0;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-theme-heading">Potential Revenue</h3>
      </div>

      {monetization && <MonetizationBadge status={monetization.status} message={monetization.message} />}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-theme-subtle">Monthly (low)</p>
          <p className="mt-1 text-2xl font-bold text-theme-heading">
            {isNotMonetized && !showPotentialWhenNotMonetized
              ? "$0"
              : formatUsd(isNotMonetized ? potentialLow : revenue.monthlyLowUsd)}
          </p>
        </div>
        <div className="glass-card border-accent/30 p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Monthly (mid)</p>
          <p className="mt-1 text-2xl font-bold text-theme-heading">
            {isNotMonetized && !showPotentialWhenNotMonetized
              ? "$0"
              : formatUsd(
                  isNotMonetized
                    ? (potentialLow + potentialHigh) / 2
                    : revenue.monthlyMidUsd
                )}
          </p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-theme-subtle">Monthly (high)</p>
          <p className="mt-1 text-2xl font-bold text-theme-heading">
            {isNotMonetized && !showPotentialWhenNotMonetized
              ? "$0"
              : formatUsd(isNotMonetized ? potentialHigh : revenue.monthlyHighUsd)}
          </p>
        </div>
      </div>

      {isNotMonetized && showPotentialWhenNotMonetized && revenue.estimatedMonthlyViews && (
        <p className="mt-3 text-sm text-theme-muted">
          If monetized: estimated {formatSocialCount(revenue.estimatedMonthlyViews)} monthly views at{" "}
          ${revenue.rpmLow}–${revenue.rpmHigh} RPM could earn{" "}
          {formatUsd(potentialLow)}–{formatUsd(potentialHigh)}/month.
        </p>
      )}

      {!isNotMonetized && (
        <p className="mt-3 text-sm text-theme-muted">
          Annual estimate (mid): <strong>{formatUsd(revenue.annualMidUsd)}</strong>
          {revenue.sponsorshipMidUsd
            ? ` · Sponsorship component ~${formatUsd(revenue.sponsorshipMidUsd)}/mo`
            : revenue.estimatedMonthlyViews
              ? ` · ~${formatSocialCount(revenue.estimatedMonthlyViews)} est. monthly views`
              : ""}
        </p>
      )}

      <p className="mt-2 text-xs text-theme-subtle">{revenue.disclaimer}</p>
    </section>
  );
}

interface SocialInsightResultsProps {
  platform: "youtube" | "instagram";
  avatarUrl: string | null;
  title: string;
  subtitle: string;
  description?: string;
  stats: { label: string; value: string; icon: React.ReactNode }[];
  extraStats?: { label: string; value: string; icon: React.ReactNode }[];
  recommendations: SocialRecommendation[];
  revenue?: RevenueEstimate;
  monetization?: { status: MonetizationStatus; message: string };
  growthSeries?: GrowthDataPoint[];
  recentVideos?: RecentVideoStats[];
}

export default function SocialInsightResults({
  platform,
  avatarUrl,
  title,
  subtitle,
  description,
  stats,
  extraStats,
  recommendations,
  revenue,
  monetization,
  growthSeries,
  recentVideos,
}: SocialInsightResultsProps) {
  const priorityColor = {
    high: "border-red-500/30 bg-red-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-accent/20 bg-accent/5",
  };

  return (
    <div className="space-y-8">
      <div className="glass-card flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full border-2 border-theme-subtle object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-theme-surface">
            {platform === "youtube" ? (
              <Video className="h-8 w-8 text-accent" />
            ) : (
              <ImageIcon className="h-8 w-8 text-accent" />
            )}
          </div>
        )}
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {platform === "youtube" ? "YouTube Channel" : "Instagram Profile"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-theme-heading">{title}</h2>
          <p className="text-sm text-theme-muted">{subtitle}</p>
          {description && (
            <p className="mt-2 line-clamp-3 text-sm text-theme-subtle">{description}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      {extraStats && extraStats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {extraStats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </div>
      )}

      {growthSeries && growthSeries.length > 0 && (
        <GrowthChart data={growthSeries} platform={platform} />
      )}

      {revenue && (
        <RevenueSection
          revenue={revenue}
          platform={platform}
          monetization={monetization}
          showPotentialWhenNotMonetized={platform === "youtube"}
        />
      )}

      {recentVideos && recentVideos.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-bold text-theme-heading">Recent Videos</h3>
          <div className="overflow-x-auto rounded-xl border border-theme-subtle">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-theme-surface text-xs uppercase tracking-wider text-theme-subtle">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Likes</th>
                  <th className="px-4 py-3">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {recentVideos.slice(0, 8).map((v) => (
                  <tr key={v.videoId} className="hover:bg-theme-surface/50">
                    <td className="max-w-[200px] truncate px-4 py-3 font-medium text-theme-heading">
                      {v.title}
                    </td>
                    <td className="px-4 py-3 text-theme-muted">{formatSocialCount(v.views)}</td>
                    <td className="px-4 py-3 text-theme-muted">{formatSocialCount(v.likes)}</td>
                    <td className="px-4 py-3 text-theme-muted">{formatSocialCount(v.comments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-bold text-theme-heading">Growth Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {recommendations.map((rec) => (
            <li
              key={rec.title}
              className={cn("rounded-xl border p-4", priorityColor[rec.priority])}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-theme-heading">{rec.title}</p>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-xs capitalize text-theme-subtle">
                  {rec.priority}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-theme-muted">{rec.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export { formatSocialCount, Users, Eye, Video, TrendingUp };

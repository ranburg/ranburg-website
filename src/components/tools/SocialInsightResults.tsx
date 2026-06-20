"use client";

import { formatSocialCount, type SocialRecommendation } from "@/lib/socialInsights";
import { cn } from "@/lib/utils";
import { Lightbulb, TrendingUp, Users, Eye, Video, Image as ImageIcon } from "lucide-react";

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

interface SocialInsightResultsProps {
  platform: "youtube" | "instagram";
  avatarUrl: string | null;
  title: string;
  subtitle: string;
  description?: string;
  stats: { label: string; value: string; icon: React.ReactNode }[];
  recommendations: SocialRecommendation[];
}

export default function SocialInsightResults({
  platform,
  avatarUrl,
  title,
  subtitle,
  description,
  stats,
  recommendations,
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
            {platform === "youtube" ? <Video className="h-8 w-8 text-accent" /> : <ImageIcon className="h-8 w-8 text-accent" />}
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

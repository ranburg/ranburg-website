"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import { getToolsByMetric, getToolViewCount } from "@/lib/toolAnalytics";
import { TrendingUp, Flame, Calendar } from "lucide-react";

type MetricType = "trending" | "most_used" | "popular_week";

const CONFIG: Record<
  MetricType,
  { title: string; highlight: string; icon: typeof TrendingUp; description: string }
> = {
  trending: {
    title: "Trending",
    highlight: "Tools",
    icon: TrendingUp,
    description: "Tools gaining traction based on recent visits and popularity.",
  },
  most_used: {
    title: "Most Used",
    highlight: "Tools",
    icon: Flame,
    description: "The tools visitors use most often on Ranburg.com.",
  },
  popular_week: {
    title: "Popular This",
    highlight: "Week",
    icon: Calendar,
    description: "Top tools by usage in the last 7 days.",
  },
};

export default function MetricToolsSection({ metric }: { metric: MetricType }) {
  const [items, setItems] = useState<{ slug: string; count: number }[]>([]);
  const cfg = CONFIG[metric];
  const Icon = cfg.icon;

  useEffect(() => {
    setItems(getToolsByMetric(metric, 6));
  }, [metric]);

  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-theme-heading sm:text-3xl">
              {cfg.title} <span className="text-gradient-accent">{cfg.highlight}</span>
            </h2>
            <p className="mt-1 text-theme-muted">{cfg.description}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ slug }) => {
            const tool = getToolBySlug(slug);
            if (!tool) return null;
            const ToolIcon = getToolIcon(tool.icon);
            const cat = getCategoryById(tool.category);
            const seoCat = getPrimarySeoCategoryForTool(slug);
            const views = getToolViewCount(slug);

            return (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="glass-card group flex gap-4 p-5 transition-all hover:border-accent/30 hover:shadow-md"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}>
                  <ToolIcon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate font-semibold text-theme-heading group-hover:text-accent">{tool.title}</p>
                    {views > 0 && (
                      <span className="shrink-0 rounded-full bg-theme-surface px-2 py-0.5 text-xs text-theme-subtle">
                        {views} views
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-accent">
                    {seoCat?.label ?? cat?.label}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-theme-muted">{tool.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

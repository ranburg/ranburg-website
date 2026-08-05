"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { HERO_TOOL_SLUGS } from "@/lib/toolPopularity";
import { getToolsByMetric } from "@/lib/toolAnalytics";
import { cn } from "@/lib/utils";

type Tab = "popular" | "trending" | "new";

export default function ExploreToolsStrip() {
  const [tab, setTab] = useState<Tab>("popular");
  const [trending, setTrending] = useState<string[]>([]);

  useEffect(() => {
    setTrending(getToolsByMetric("trending", 6).map((t) => t.slug));
  }, []);

  const slugs = useMemo(() => {
    if (tab === "new") return RECENT_TOOL_SLUGS.slice(0, 6);
    if (tab === "trending") {
      const t = trending.length ? trending : POPULAR_TOOL_SLUGS.slice(0, 6);
      return t.slice(0, 6);
    }
    return POPULAR_TOOL_SLUGS.filter((s) => !HERO_TOOL_SLUGS.includes(s)).slice(0, 6);
  }, [tab, trending]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" },
    { id: "new", label: "New" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
              Explore <span className="text-gradient-accent">tools</span>
            </h2>
            <p className="mt-2 max-w-xl text-theme-muted">One strip — popular, trending, or newly added. Less scrolling, more clicking.</p>
          </div>
          <Link href="/tools" className="text-sm font-semibold text-accent hover:underline">
            View all tools
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === t.id
                  ? "bg-accent text-white"
                  : "border border-theme bg-theme-surface text-theme-muted hover:border-accent/30"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slugs.map((slug) => (
            <ToolCard key={`${tab}-${slug}`} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

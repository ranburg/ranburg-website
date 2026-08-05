"use client";

import { useEffect, useState } from "react";
import ToolCard from "@/components/tools/ToolCard";
import { getRecentlyViewedSlugs } from "@/lib/toolAnalytics";
import { getToolBySlug } from "@/lib/toolsConfig";

export default function RecentlyUsedTools() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const recent = getRecentlyViewedSlugs(6).filter((s) => Boolean(getToolBySlug(s)));
    setSlugs(recent);
  }, []);

  if (slugs.length === 0) return null;

  return (
    <section className="pb-8 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-theme-heading sm:text-3xl">Continue where you left off</h2>
          <p className="mt-2 text-theme-muted">Tools you opened recently on this device.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slugs.map((slug) => (
            <ToolCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

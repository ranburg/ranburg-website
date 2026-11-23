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
        <div className="mb-8" data-reveal="up">
          <h2 className="section-heading">Continue where you left off</h2>
          <p className="section-lede mt-3">Tools you opened recently on this device.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slugs.map((slug) => (
            <ToolCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

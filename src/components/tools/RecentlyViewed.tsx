"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentlyViewedSlugs } from "@/lib/toolAnalytics";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { Clock } from "lucide-react";

export default function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentlyViewedSlugs(8).filter((s) => s !== excludeSlug));
  }, [excludeSlug]);

  if (slugs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-theme-subtle pt-16">
      <div className="mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-accent" />
        <h2 className="text-2xl font-bold text-theme-heading">Recently Viewed</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {slugs.map((slug) => {
          const tool = getToolBySlug(slug);
          if (!tool) return null;
          const Icon = getToolIcon(tool.icon);
          return (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="glass-card group flex items-center gap-3 p-4 hover:border-accent/30"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="truncate text-sm font-medium text-theme-heading group-hover:text-accent">{tool.title}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

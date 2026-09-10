"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getRecentlyViewedSlugs } from "@/lib/toolAnalytics";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { Clock } from "lucide-react";
import { iconWell } from "@/components/tools/iconWell";

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slugs.map((slug) => {
          const tool = getToolBySlug(slug);
          if (!tool) return null;
          const Icon = getToolIcon(tool.icon, tool.slug);
          return (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-[var(--surface-elevated)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/80 hover:shadow-[0_0_0_2px_rgba(15,118,110,0.25),0_16px_28px_-14px_rgba(15,118,110,0.4)] dark:border-white/10"
            >
              <div {...iconWell(tool.gradient, "h-10 w-10 rounded-xl")}>
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <p className="truncate text-sm font-medium text-theme-heading group-hover:text-accent">{tool.title}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

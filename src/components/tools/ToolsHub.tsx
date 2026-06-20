"use client";

import Link from "next/link";
import { useState } from "react";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS } from "@/lib/toolComingSoonConfig";
import { FEATURED_TOOL_SLUGS, POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import { searchTools } from "@/lib/toolSearch";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import AllToolsNav from "@/components/tools/AllToolsNav";
import SocialHeroTools from "@/components/tools/SocialHeroTools";

function ToolSection({ title, description, slugs }: { title: string; description?: string; slugs: string[] }) {
  const tools = slugs.map(getToolBySlug).filter(Boolean);
  if (tools.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold text-theme-heading">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-theme-muted">{description}</p>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {slugs.map((slug) => (
          <ToolCard key={slug} slug={slug} showCategory />
        ))}
      </div>
    </section>
  );
}

export default function ToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : null;

  const salesforceSlugs = TOOLS_CONFIG.filter((t) => t.category === "salesforce").map((t) => t.slug);
  const financialSlugs = TOOLS_CONFIG.filter((t) => t.category === "financial").map((t) => t.slug);
  const developerSlugs = TOOLS_CONFIG.filter((t) => t.category === "developer").map((t) => t.slug);
  const socialRevenueSlugs = [
    "youtube-revenue-calculator",
    "youtube-channel-insights",
    "instagram-revenue-calculator",
    "instagram-profile-insights",
    "adsense-revenue-calculator",
    "twitch-sub-revenue",
  ];

  return (
    <div className="space-y-16">
      <AllToolsNav variant="compact" className="lg:hidden" />
      <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-theme-subtle bg-[var(--background)]/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ToolSearch
          placeholder="Search tools, calculators, Salesforce utilities…"
          showResults={false}
          showSuggestions
          showTags
          value={searchQuery}
          onQueryChange={setSearchQuery}
        />
      </div>

      {searchResults ? (
        <section>
          <h2 className="text-xl font-bold text-theme-heading">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </h2>
          {searchResults.length === 0 ? (
            <p className="mt-6 text-theme-muted">No tools found. Try another keyword.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((t) => (
                <ToolCard key={t.slug} slug={t.slug} showCategory />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <SocialHeroTools />

          <section>
            <h2 className="text-2xl font-bold text-theme-heading">Browse by Category</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SEO_CATEGORY_HUBS.map((cat) => {
                const Icon = getToolIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="glass-card flex items-center gap-4 p-4 hover:border-accent/30"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-theme-heading">{cat.label}</p>
                      <p className="text-xs text-theme-subtle line-clamp-1">{cat.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <ToolSection title="Featured Tools" description="Our most useful calculators and utilities." slugs={FEATURED_TOOL_SLUGS} />
          <ToolSection title="Popular Tools" slugs={POPULAR_TOOL_SLUGS} />
          <ToolSection title="Social & Revenue Tools" description="YouTube, Instagram, AdSense, and creator income calculators." slugs={socialRevenueSlugs} />
          <ToolSection title="Recently Added" slugs={RECENT_TOOL_SLUGS.filter((s) => getToolBySlug(s))} />
          <ToolSection title="Salesforce Tools" description="Free generators for admins and developers." slugs={salesforceSlugs} />
          <ToolSection title="Financial Calculators" slugs={financialSlugs} />
          <ToolSection title="Developer Tools" slugs={developerSlugs} />

          {COMING_SOON_TOOLS.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-theme-heading">Coming Soon</h2>
              <p className="mt-2 text-theme-muted">New utilities in development — join the waitlist.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {COMING_SOON_TOOLS.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="glass-card flex items-center justify-between p-5 hover:border-accent/30">
                    <div>
                      <p className="font-semibold text-theme-heading">{t.title}</p>
                      <p className="mt-1 text-sm text-theme-muted">{t.shortDescription}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">Soon</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

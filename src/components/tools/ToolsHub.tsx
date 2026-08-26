"use client";

import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS } from "@/lib/toolComingSoonConfig";
import { FEATURED_TOOL_SLUGS, POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { CATALOG_SECTIONS, getCatalogTools, TOOL_CATALOG_COUNT } from "@/lib/catalogDirectory";
import { SEO_CATEGORY_HUBS, PRIMARY_CATEGORY_SLUGS, getToolsForSeoCategory } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import { searchTools } from "@/lib/toolSearch";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
import SocialHeroTools from "@/components/tools/SocialHeroTools";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { Sparkles } from "lucide-react";

function ToolSection({ title, description, slugs }: { title: string; description?: string; slugs: string[] }) {
  const tools = slugs.map(getToolBySlug).filter(Boolean);
  if (tools.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-theme-heading sm:text-xl">{title}</h2>
      {description && <p className="mt-1.5 max-w-2xl text-sm text-theme-muted sm:text-base">{description}</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {slugs.map((slug) => (
          <ToolCard key={slug} slug={slug} showCategory />
        ))}
      </div>
    </section>
  );
}

export default function ToolsHub({
  initialQuery = "",
  title = "Free Online Tools",
  description,
}: {
  initialQuery?: string;
  title?: string;
  description?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchHydrated, setSearchHydrated] = useState(false);
  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : null;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (q) setSearchQuery(q);
    setSearchHydrated(true);
  }, []);

  useEffect(() => {
    if (!searchHydrated) return;
    const url = new URL(window.location.href);
    const next = searchQuery.trim();
    if (next) url.searchParams.set("q", next);
    else url.searchParams.delete("q");
    const nextPath = `${url.pathname}${url.search}`;
    if (`${window.location.pathname}${window.location.search}` !== nextPath) {
      window.history.replaceState({}, "", nextPath);
    }
  }, [searchQuery, searchHydrated]);

  const salesforceSlugs = TOOLS_CONFIG.filter((t) => t.category === "salesforce").map((t) => t.slug);

  return (
    <div className="space-y-14 sm:space-y-16">
      <SearchHeroPanel
        eyebrow={
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" />
            {TOOL_CATALOG_COUNT}+ free tools · no signup
          </p>
        }
        title={<h1 className="mt-4 text-3xl font-semibold tracking-tight text-theme-heading sm:text-4xl lg:text-[2.75rem]">{title}</h1>}
        subtitle={
          description ? <p className="mt-3 max-w-2xl text-base text-theme-muted sm:text-lg">{description}</p> : null
        }
        search={
          <ToolSearch
            placeholder="Search tools, calculators, hashtags, Salesforce…"
            showResults={false}
            showSuggestions
            showTags
            value={searchQuery}
            onQueryChange={setSearchQuery}
          />
        }
      />

      <AdPlaceholder placement="below-hero" />

      {searchResults ? (
        <section>
          <h2 className="text-xl font-bold text-theme-heading">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </h2>
          {searchResults.length === 0 ? (
            <p className="mt-6 text-theme-muted">No tools found. Try another keyword.</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((t) => (
                <ToolCard key={t.slug} slug={t.slug} showCategory />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <h2 className="sr-only">Browse by category</h2>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {PRIMARY_CATEGORY_SLUGS.map((slug) => {
                const cat = SEO_CATEGORY_HUBS.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = getToolsForSeoCategory(slug).length;
                const Icon = getToolIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-theme-subtle bg-[var(--surface-elevated)] px-3.5 py-2 text-sm font-medium text-theme-heading shadow-sm transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${cat.gradient}`}>
                      <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.25} aria-hidden />
                    </span>
                    {cat.label}
                    <span className="text-xs text-theme-subtle">{count}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <SocialHeroTools />

          <ToolSection title="Popular Tools" description="Most used this month — jump in and get an answer fast." slugs={POPULAR_TOOL_SLUGS} />
          <ToolSection title="Featured" description="Our strongest calculators and creator utilities." slugs={FEATURED_TOOL_SLUGS} />

          <AdPlaceholder placement="between-sections" />

          {CATALOG_SECTIONS.map((section) => (
            <ToolSection
              key={section.id}
              title={section.label}
              description={section.description}
              slugs={getCatalogTools(section.slugs).map((t) => t.slug)}
            />
          ))}

          <ToolSection title="Recently Added" slugs={RECENT_TOOL_SLUGS.filter((s) => getToolBySlug(s))} />
          <ToolSection title="Salesforce" description="Generators for admins and developers." slugs={salesforceSlugs} />

          {COMING_SOON_TOOLS.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold tracking-tight text-theme-heading sm:text-xl">Coming Soon</h2>
              <p className="mt-1.5 text-sm text-theme-muted">New utilities in development.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {COMING_SOON_TOOLS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-theme-subtle bg-theme-surface/40 px-5 py-4 transition-colors hover:border-accent/30"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-theme-heading">{t.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-theme-muted">{t.shortDescription}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                      Soon
                    </span>
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

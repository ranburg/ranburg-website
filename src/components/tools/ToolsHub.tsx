"use client";

import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS } from "@/lib/toolComingSoonConfig";
import { FEATURED_TOOL_SLUGS, NEW_TOOL_SLUGS, POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { CATALOG_SECTIONS, getCatalogTools, TOOL_CATALOG_COUNT } from "@/lib/catalogDirectory";
import { SEO_CATEGORY_HUBS, PRIMARY_CATEGORY_SLUGS, getToolsForSeoCategory } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import { searchTools } from "@/lib/toolSearch";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
import SocialHeroTools from "@/components/tools/SocialHeroTools";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { iconWell } from "@/components/tools/iconWell";

function ToolSection({ title, description, slugs }: { title: string; description?: string; slugs: string[] }) {
  const tools = slugs.map(getToolBySlug).filter(Boolean);
  if (tools.length === 0) return null;
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-theme-subtle pb-5" data-reveal="up">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 max-w-2xl text-sm text-theme-muted sm:text-base">{description}</p>}
        </div>
        <span className="text-sm tabular-nums text-theme-subtle">{tools.length} tools</span>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slugs.map((slug, i) => (
          <ToolCard key={slug} slug={slug} showCategory revealIndex={i} />
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
  const newSlugs = NEW_TOOL_SLUGS.filter((s) => getToolBySlug(s));

  return (
    <div className="space-y-16 sm:space-y-20">
      <SearchHeroPanel
        className="rise"
        eyebrow={
          <p className="eyebrow">
            <span className="status-dot" aria-hidden />
            {TOOL_CATALOG_COUNT}+ free tools · no signup
          </p>
        }
        title={
          <h1 className="mt-5 text-4xl font-light leading-[1.08] tracking-[-0.035em] text-theme-heading sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        }
        subtitle={
          description ? <p className="section-lede mt-4 max-w-2xl">{description}</p> : null
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

      {searchResults ? (
        <section>
          <h2 className="text-2xl font-medium tracking-tight text-theme-heading">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </h2>
          {searchResults.length === 0 ? (
            <p className="mt-6 text-theme-muted">No tools found. Try another keyword.</p>
          ) : (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none sm:flex-wrap">
              {PRIMARY_CATEGORY_SLUGS.map((slug) => {
                const cat = SEO_CATEGORY_HUBS.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = getToolsForSeoCategory(slug).length;
                const Icon = getToolIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-theme-subtle bg-[var(--surface-elevated)] py-2 pe-4 ps-2 text-sm text-theme-heading transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                  >
                    <span {...iconWell(cat.gradient, "h-7 w-7 rounded-full shadow-none")}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                    </span>
                    {cat.label}
                    <span className="text-xs tabular-nums text-theme-subtle">{count}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <SocialHeroTools />

          {newSlugs.length > 0 && (
            <ToolSection
              title="Just Added"
              description="Fresh calculators, design generators and focus tools — new this season."
              slugs={newSlugs}
            />
          )}

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
              <div className="border-b border-theme-subtle pb-5" data-reveal="up">
                <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Coming Soon</h2>
                <p className="mt-2 text-sm text-theme-muted">New utilities in development.</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {COMING_SOON_TOOLS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="card flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-300 hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-theme-heading">{t.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-theme-muted">{t.shortDescription}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
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

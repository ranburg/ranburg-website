"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ToolCard from "@/components/tools/ToolCard";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
import { CATALOG_SECTIONS, HOMEPAGE_FEATURED_SLUGS, getCatalogTools } from "@/lib/catalogDirectory";
import { searchTools } from "@/lib/toolSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";

export default function CatalogDirectory() {
  const t = useTranslations("home");
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return searchTools(q);
  }, [query]);

  const featured = getCatalogTools(HOMEPAGE_FEATURED_SLUGS);

  return (
    <section className="pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t("pickEyebrow")}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl">
              {t("pickTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-theme-muted">{t("pickSub")}</p>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            {t("ctaTools")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} slug={tool.slug} showUseCount={false} />
          ))}
        </div>

        <div className="mt-16">
          <SearchHeroPanel
            eyebrow={
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t("exploreTitle")}</p>
            }
            title={
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl">
                {t("catalogTitle")}
              </h2>
            }
            subtitle={<p className="mt-2 max-w-2xl text-theme-muted">{t("catalogSub")}</p>}
            search={
              <label className="relative block">
                <span className="sr-only">{t("catalogFilterLabel")}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("catalogFilterPlaceholder")}
                  className="w-full rounded-xl border border-theme bg-theme-surface py-3 pl-10 pr-4 text-base text-theme-heading placeholder:text-theme-subtle focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 sm:text-sm"
                />
              </label>
            }
          />
        </div>

        <div className="mt-10">
          {searchResults ? (
            <div>
              <p className="mb-6 text-sm text-theme-muted">
                {searchResults.length} {searchResults.length === 1 ? "tool" : "tools"} matching “{query.trim()}”
              </p>
              {searchResults.length === 0 ? (
                <p className="rounded-xl border border-theme-subtle bg-theme-surface/40 px-5 py-8 text-center text-theme-muted">
                  No tools found. Try another keyword or{" "}
                  <Link href="/tools" className="font-semibold text-accent hover:underline">
                    browse the full catalog
                  </Link>
                  .
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((tool) => (
                    <ToolCard key={tool.slug} slug={tool.slug} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-14">
              {CATALOG_SECTIONS.map((section) => {
                const tools = getCatalogTools(section.slugs);
                if (tools.length === 0) return null;
                const Icon = getToolIcon(section.icon);
                const hubCount = TOOLS_CONFIG.filter((t) => section.slugs.includes(t.slug)).length;
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28">
                    <div className="relative mb-6 overflow-hidden rounded-2xl border border-theme">
                      <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-15`} />
                      <div className="relative flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ring-2 ring-white/40 dark:ring-white/10 ${section.gradient}`}
                          >
                            <Icon className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-theme-heading sm:text-xl">{section.label}</h3>
                            <p className="mt-0.5 max-w-2xl text-sm text-theme-muted">{section.description}</p>
                          </div>
                        </div>
                        <Link
                          href={`/tools/${section.hubSlug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-theme bg-[var(--surface-elevated)]/80 px-3 py-1.5 text-sm font-semibold text-accent hover:border-accent/40"
                        >
                          View all
                          <span className="font-normal text-theme-subtle">({hubCount})</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((tool) => (
                        <ToolCard key={tool.slug} slug={tool.slug} showCategory={false} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

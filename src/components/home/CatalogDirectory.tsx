"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ToolCard from "@/components/tools/ToolCard";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
import { CATALOG_SECTIONS, HOMEPAGE_FEATURED_SLUGS, getCatalogTools } from "@/lib/catalogDirectory";
import { searchTools } from "@/lib/toolSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { iconWell } from "@/components/tools/iconWell";

const stagger = (i: number) => ({ "--reveal-delay": `${(i % 3) * 80}ms` }) as CSSProperties;

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
    <section className="pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal="up">
          <div>
            <p className="eyebrow">
              <span className="status-dot" aria-hidden />
              {t("pickEyebrow")}
            </p>
            <h2 className="section-heading mt-5 max-w-3xl">{t("pickTitle")}</h2>
            <p className="section-lede mt-3 max-w-2xl">{t("pickSub")}</p>
          </div>
          <Link href="/tools" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {t("ctaTools")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool, i) => (
            <div key={tool.slug} data-reveal="up" style={stagger(i)} className="h-full">
              <ToolCard slug={tool.slug} showUseCount={false} />
            </div>
          ))}
        </div>

        <div className="mt-20" data-reveal="up">
          <SearchHeroPanel
            eyebrow={
              <p className="eyebrow">
                <span className="status-dot" aria-hidden />
                {t("exploreTitle")}
              </p>
            }
            title={<h2 className="section-heading mt-5 max-w-3xl">{t("catalogTitle")}</h2>}
            subtitle={<p className="section-lede mt-3 max-w-2xl">{t("catalogSub")}</p>}
            search={
              <label className="relative block">
                <span className="sr-only">{t("catalogFilterLabel")}</span>
                <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("catalogFilterPlaceholder")}
                  className="w-full rounded-xl border border-theme-subtle bg-[var(--input-bg)] py-3 pe-4 ps-10 text-base text-theme-heading transition-colors placeholder:text-theme-subtle focus:border-accent/60 focus:outline-none sm:text-sm"
                />
              </label>
            }
          />
        </div>

        <div className="mt-12">
          {searchResults ? (
            <div>
              <p className="mb-6 text-sm text-theme-muted">
                {searchResults.length} {searchResults.length === 1 ? "tool" : "tools"} matching “{query.trim()}”
              </p>
              {searchResults.length === 0 ? (
                <p className="card px-5 py-10 text-center text-theme-muted">
                  No tools found. Try another keyword or{" "}
                  <Link href="/tools" className="font-medium text-accent hover:underline">
                    browse the full catalog
                  </Link>
                  .
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((tool) => (
                    <ToolCard key={tool.slug} slug={tool.slug} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-20">
              {CATALOG_SECTIONS.map((section, sectionIndex) => {
                const tools = getCatalogTools(section.slugs);
                if (tools.length === 0) return null;
                const Icon = getToolIcon(section.icon);
                const hubCount = TOOLS_CONFIG.filter((t) => section.slugs.includes(t.slug)).length;
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28">
                    <div
                      className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-theme-subtle pb-6"
                      data-reveal="up"
                    >
                      <div className="flex items-start gap-4">
                        <span className="hidden pt-1 text-sm tabular-nums text-accent sm:block">
                          0{sectionIndex + 1}
                        </span>
                        <div {...iconWell(section.gradient, "h-12 w-12 rounded-2xl")}>
                          <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-theme-heading sm:text-2xl">{section.label}</h3>
                          <p className="mt-1 max-w-2xl text-sm text-theme-muted">{section.description}</p>
                        </div>
                      </div>
                      <Link
                        href={`/tools/${section.hubSlug}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-theme-subtle bg-theme-surface px-4 py-2 text-sm font-medium text-theme-heading transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                      >
                        View all
                        <span className="font-normal text-theme-subtle">({hubCount})</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
                      </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((tool, i) => (
                        <div key={tool.slug} data-reveal="up" style={stagger(i)} className="h-full">
                          <ToolCard slug={tool.slug} showCategory={false} />
                        </div>
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

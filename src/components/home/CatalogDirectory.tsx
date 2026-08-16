"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ToolCard from "@/components/tools/ToolCard";
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
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} slug={tool.slug} showUseCount={false} />
          ))}
        </div>

        <div className="mt-20 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl">
              {t("catalogTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-theme-muted">{t("catalogSub")}</p>
          </div>
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">{t("catalogFilterLabel")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("catalogFilterPlaceholder")}
              className="input-field w-full pl-10"
            />
          </label>
        </div>

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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {searchResults.map((tool) => (
                  <ToolCard key={tool.slug} slug={tool.slug} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {CATALOG_SECTIONS.map((section) => {
              const tools = getCatalogTools(section.slugs);
              if (tools.length === 0) return null;
              const Icon = getToolIcon(section.icon);
              const hubCount = TOOLS_CONFIG.filter((t) =>
                section.slugs.includes(t.slug)
              ).length;
              return (
                <div key={section.id} id={section.id}>
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient}`}
                      >
                        <Icon className="h-5 w-5 text-white" aria-hidden />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-theme-heading sm:text-2xl">{section.label}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-theme-muted">{section.description}</p>
                      </div>
                    </div>
                    <Link
                      href={`/tools/${section.hubSlug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                    >
                      View all
                      <span className="font-normal text-theme-subtle">({hubCount})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
    </section>
  );
}

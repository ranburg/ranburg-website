import Link from "next/link";
import { SITE } from "@/lib/siteConfig";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import {
  getSeoCategoryHub,
  getToolsForSeoCategory,
  SEO_CATEGORY_HUBS,
  type SeoCategorySlug,
} from "@/lib/toolSeoCategories";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { getToolBySlug } from "@/lib/toolsConfig";
import { TOOL_SEO_CATEGORY_MAP } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import type { Metadata } from "next";

interface ToolCategoryPageProps {
  categorySlug: SeoCategorySlug;
}

export function generateCategoryMetadata(slug: SeoCategorySlug): Metadata {
  const hub = getSeoCategoryHub(slug)!;
  return buildMetadata({
    title: `${hub.headline} | Ranburg.com`,
    description: hub.description,
    path: `/tools/${slug}`,
    keywords: hub.keywords,
  });
}

export function getCategoryStaticParams() {
  return SEO_CATEGORY_HUBS.map((c) => ({ slug: c.slug }));
}

export default function ToolCategoryPage({ categorySlug }: ToolCategoryPageProps) {
  const hub = getSeoCategoryHub(categorySlug);
  if (!hub) return null;

  const tools = getToolsForSeoCategory(categorySlug);
  const popularInCategory = POPULAR_TOOL_SLUGS.filter(
    (s) => TOOL_SEO_CATEGORY_MAP[s]?.includes(categorySlug) && getToolBySlug(s)
  ).slice(0, 6);
  const recentInCategory = RECENT_TOOL_SLUGS.filter(
    (s) => TOOL_SEO_CATEGORY_MAP[s]?.includes(categorySlug) && getToolBySlug(s)
  ).slice(0, 6);
  const related = hub.relatedSlugs
    .map((s) => getSeoCategoryHub(s))
    .filter(Boolean);

  const url = `${SITE.url}/tools/${categorySlug}`;

  return (
    <div className="pb-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: "Tools", url: `${SITE.url}/tools` },
            { name: hub.label, url },
          ]),
          faqJsonLd(hub.faq),
        ]}
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: hub.label },
            ]}
          />
          <div className="mt-6 flex items-start gap-4">
            {(() => {
              const Icon = getToolIcon(hub.icon);
              return (
                <div className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br sm:flex ${hub.gradient}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              );
            })()}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Tool Category</p>
              <h1 className="mt-1 text-3xl font-extrabold text-theme-heading sm:text-4xl">{hub.headline}</h1>
              <p className="mt-3 max-w-3xl text-lg text-theme-muted">{hub.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder placement="below-hero" />
      </div>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolSearch
            placeholder={`Search ${hub.label.toLowerCase()}…`}
            showSuggestions
            showTags
            maxResults={8}
            showCategoryFilter
            seoCategoryFilter={categorySlug}
          />
        </div>
      </section>

      {popularInCategory.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-theme-heading">Popular in {hub.label}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {popularInCategory.map((slug) => (
                <ToolCard key={slug} slug={slug} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-theme-heading">
            {tools.length} {hub.label}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.slug} slug={t.slug} showCategory={false} />
            ))}
          </div>
        </div>
      </section>

      {recentInCategory.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-theme-heading">Recently Added</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recentInCategory.map((slug) => (
                <ToolCard key={slug} slug={slug} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            {hub.intro.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-theme-muted">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-theme-heading">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {hub.faq.map((item) => (
              <div key={item.question} className="glass-card p-5">
                <h3 className="font-semibold text-theme-heading">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-theme-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-theme-heading">Related Categories</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((cat) => {
                if (!cat) return null;
                const Icon = getToolIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="glass-card group flex items-center gap-4 p-5 hover:border-accent/30"
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-theme-heading group-hover:text-accent">{cat.label}</p>
                      <p className="text-xs text-theme-subtle line-clamp-1">{cat.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ConsultingCTA />
      </div>
    </div>
  );
}

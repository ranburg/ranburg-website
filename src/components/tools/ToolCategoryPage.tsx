import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/siteConfig";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, collectionPageJsonLd } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
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

export function generateCategoryMetadata(slug: SeoCategorySlug, locale: AppLocale = "en"): Metadata {
  const hub = getSeoCategoryHub(slug)!;
  return buildMetadata({
    title: `${hub.headline} | Ranburg.com`,
    description: hub.description,
    path: `/tools/${slug}`,
    keywords: hub.keywords,
    locale,
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
          collectionPageJsonLd(
            hub.headline,
            hub.description,
            url,
            tools.slice(0, 40).map((tool) => ({
              name: tool.title,
              url: `${SITE.url}/tools/${tool.slug}`,
            }))
          ),
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
          <div className="mt-6">
            <SearchHeroPanel
              eyebrow={<p className="text-xs font-semibold uppercase tracking-wider text-accent">Tool Category</p>}
              title={<h1 className="mt-2 text-3xl font-extrabold text-theme-heading sm:text-4xl">{hub.headline}</h1>}
              subtitle={<p className="mt-3 max-w-3xl text-base text-theme-muted sm:text-lg">{hub.description}</p>}
              search={
                <ToolSearch
                  placeholder={`Search ${hub.label.toLowerCase()}…`}
                  showSuggestions
                  showTags
                  maxResults={8}
                  showCategoryFilter
                  seoCategoryFilter={categorySlug}
                />
              }
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdPlaceholder placement="below-hero" />
        </div>
      </section>

      {popularInCategory.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-theme-heading">Popular in {hub.label}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[var(--surface-elevated)] p-5 shadow-[0_10px_24px_-16px_rgba(12,31,26,0.4)] transition-all hover:-translate-y-0.5 hover:border-accent/80 hover:shadow-[0_0_0_2px_rgba(15,118,110,0.25),0_18px_36px_-16px_rgba(15,118,110,0.45)] dark:border-white/10"
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ring-2 ring-white/40 dark:ring-white/10 ${cat.gradient}`}>
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
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

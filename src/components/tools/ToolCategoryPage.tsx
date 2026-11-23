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
import { iconWell } from "@/components/tools/iconWell";
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

      <section className="pb-8 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: hub.label },
            ]}
          />
          <div className="rise mt-6">
            <SearchHeroPanel
              eyebrow={
                <p className="eyebrow">
                  <span className="status-dot" aria-hidden />
                  Tool Category
                </p>
              }
              title={
                <h1 className="mt-5 text-4xl font-light leading-[1.08] tracking-[-0.035em] text-theme-heading sm:text-5xl lg:text-6xl">
                  {hub.headline}
                </h1>
              }
              subtitle={<p className="section-lede mt-4 max-w-3xl">{hub.description}</p>}
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

      {popularInCategory.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="border-b border-theme-subtle pb-5 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl" data-reveal="up">
              Popular in {hub.label}
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularInCategory.map((slug, i) => (
                <ToolCard key={slug} slug={slug} showCategory={false} revealIndex={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="border-b border-theme-subtle pb-5 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl" data-reveal="up">
            {tools.length} {hub.label}
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t, i) => (
              <ToolCard key={t.slug} slug={t.slug} showCategory={false} revealIndex={i} />
            ))}
          </div>
        </div>
      </section>

      {recentInCategory.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="border-b border-theme-subtle pb-5 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl" data-reveal="up">
              Recently Added
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentInCategory.map((slug, i) => (
                <ToolCard key={slug} slug={slug} showCategory={false} revealIndex={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-none" data-reveal="up">
            {hub.intro.split("\n\n").map((para, i) => (
              <p key={i} className="mb-5 text-base leading-[1.8] text-theme-muted sm:text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading" data-reveal="up">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {hub.faq.map((item, i) => (
              <div
                key={item.question}
                className="card spotlight p-5 sm:p-6"
                data-reveal="up"
                style={{ "--reveal-delay": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
              >
                <h3 className="text-lg font-medium text-theme-heading">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-theme-muted sm:text-base">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-heading" data-reveal="up">Related Categories</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((cat) => {
                if (!cat) return null;
                const Icon = getToolIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    data-reveal="up"
                    className="card spotlight group flex items-center gap-4 p-5 transition-colors duration-300 hover:border-accent/50"
                  >
                    <div {...iconWell(cat.gradient, "h-11 w-11 rounded-xl")}>
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="font-medium text-theme-heading transition-colors group-hover:text-accent">{cat.label}</p>
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

import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { TOOL_SEO_CONTENT_UPDATED } from "@/lib/toolSeoGenerator";
import { buildSitemapXml, SITEMAP_BASE } from "@/lib/sitemapXml";
import { routing, localizedPath } from "@/i18n/routing";

/**
 * English-only sitemap URLs to cut bot crawl fan-out (locales still work via
 * language switcher + hreflang). Avoids ISR/function burn from 7× URL sets.
 */
export async function GET() {
  const lastmod = TOOL_SEO_CONTENT_UPDATED;
  const prioritySet = new Set<string>(PRIORITY_INDEX_TOOL_SLUGS);
  const locale = routing.defaultLocale;

  const urls = TOOLS_CONFIG.map((t) => ({
    loc: `${SITEMAP_BASE}${localizedPath(locale, `/tools/${t.slug}`)}`,
    lastmod,
    changefreq: "weekly",
    priority: prioritySet.has(t.slug) ? 0.95 : t.category === "salesforce" ? 0.8 : 0.75,
  }));

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { buildSitemapXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";

/** Live tools only — coming-soon pages are noindex and excluded. */
export async function GET() {
  const lastmod = isoDate();
  const prioritySet = new Set<string>(PRIORITY_INDEX_TOOL_SLUGS);

  const urls = TOOLS_CONFIG.map((t) => ({
    loc: `${SITEMAP_BASE}/tools/${t.slug}`,
    lastmod,
    changefreq: "weekly",
    priority: prioritySet.has(t.slug) ? 0.95 : t.category === "salesforce" ? 0.8 : 0.75,
  }));

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

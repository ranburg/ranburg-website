import { BLOG_POSTS } from "@/lib/blogConfig";
import { isIndexableBlogPost } from "@/lib/seoGrowthConfig";
import { buildSitemapXml, SITEMAP_BASE } from "@/lib/sitemapXml";
import { routing, localizedPath } from "@/i18n/routing";

/** English-only blog sitemap — localized posts remain reachable, not crawl-forced. */
export async function GET() {
  const indexable = BLOG_POSTS.filter(isIndexableBlogPost);
  const locale = routing.defaultLocale;
  const urls = [
    {
      loc: `${SITEMAP_BASE}${localizedPath(locale, "/blog")}`,
      changefreq: "weekly",
      priority: 0.8,
    },
    ...indexable.map((p) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, `/blog/${p.slug}`)}`,
      lastmod: p.date,
      changefreq: "monthly",
      priority: 0.75,
    })),
  ];

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

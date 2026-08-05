import { BLOG_POSTS } from "@/lib/blogConfig";
import { isIndexableBlogPost } from "@/lib/seoGrowthConfig";
import { buildSitemapXml, SITEMAP_BASE } from "@/lib/sitemapXml";
import { locales, localizedPath } from "@/i18n/routing";

export async function GET() {
  const indexable = BLOG_POSTS.filter(isIndexableBlogPost);
  const urls = locales.flatMap((locale) => [
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
  ]);

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

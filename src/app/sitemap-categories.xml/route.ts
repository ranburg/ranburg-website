import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { buildSitemapXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";
import { locales, localizedPath } from "@/i18n/routing";

export async function GET() {
  const lastmod = isoDate();
  const urls = locales.flatMap((locale) => [
    { loc: `${SITEMAP_BASE}${localizedPath(locale, "/tools")}`, lastmod, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}${localizedPath(locale, "/tools/salesforce")}`, lastmod, changefreq: "weekly", priority: 0.95 },
    ...SEO_CATEGORY_HUBS.map((c) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, `/tools/${c.slug}`)}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.88,
    })),
  ]);

  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

import { buildSitemapIndexXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";

/** Proper sitemap index — child sitemaps are not urlset entries. */
export async function GET() {
  const lastmod = isoDate();
  const xml = buildSitemapIndexXml([
    { loc: `${SITEMAP_BASE}/sitemap-pages.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-tools.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-categories.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-blog.xml`, lastmod },
  ]);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

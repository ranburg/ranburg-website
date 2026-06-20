import { BLOG_POSTS } from "@/lib/blogConfig";
import { buildSitemapXml, SITEMAP_BASE } from "@/lib/sitemapXml";

export async function GET() {
  const urls = [
    { loc: `${SITEMAP_BASE}/blog`, changefreq: "weekly", priority: 0.8 },
    ...BLOG_POSTS.map((p) => ({
      loc: `${SITEMAP_BASE}/blog/${p.slug}`,
      lastmod: p.date,
      changefreq: "monthly",
      priority: 0.8,
    })),
  ];

  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

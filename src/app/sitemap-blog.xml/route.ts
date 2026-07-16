import { BLOG_POSTS } from "@/lib/blogConfig";
import { isIndexableBlogPost } from "@/lib/seoGrowthConfig";
import { buildSitemapXml, SITEMAP_BASE } from "@/lib/sitemapXml";

export async function GET() {
  const indexable = BLOG_POSTS.filter(isIndexableBlogPost);
  const urls = [
    { loc: `${SITEMAP_BASE}/blog`, changefreq: "weekly", priority: 0.8 },
    ...indexable.map((p) => ({
      loc: `${SITEMAP_BASE}/blog/${p.slug}`,
      lastmod: p.date,
      changefreq: "monthly",
      priority: 0.75,
    })),
  ];

  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

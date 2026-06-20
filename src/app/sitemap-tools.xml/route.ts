import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS } from "@/lib/toolComingSoonConfig";
import { buildSitemapXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";

export async function GET() {
  const lastmod = isoDate();
  const urls = [
    ...TOOLS_CONFIG.map((t) => ({
      loc: `${SITEMAP_BASE}/tools/${t.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: t.category === "salesforce" ? 0.9 : 0.75,
    })),
    ...COMING_SOON_TOOLS.map((t) => ({
      loc: `${SITEMAP_BASE}/tools/${t.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.7,
    })),
  ];

  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

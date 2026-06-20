import { SITE } from "@/lib/siteConfig";

export function buildSitemapXml(urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[]): string {
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority !== undefined ? `\n    <priority>${u.priority}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function buildSitemapIndexXml(sitemaps: { loc: string; lastmod?: string }[]): string {
  const entries = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.loc}</loc>${s.lastmod ? `\n    <lastmod>${s.lastmod}</lastmod>` : ""}
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function isoDate(d = new Date()): string {
  return d.toISOString().split("T")[0];
}

export const SITEMAP_BASE = SITE.url;

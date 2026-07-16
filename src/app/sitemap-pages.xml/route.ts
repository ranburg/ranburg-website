import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { buildSitemapXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";

export async function GET() {
  const lastmod = isoDate();
  const base = SITEMAP_BASE;

  const urls = [
    { loc: base, lastmod, changefreq: "weekly", priority: 1 },
    { loc: `${base}/tools`, lastmod, changefreq: "weekly", priority: 0.95 },
    { loc: `${base}/blog`, lastmod, changefreq: "weekly", priority: 0.85 },
    { loc: `${base}/services`, lastmod, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/case-studies`, lastmod, changefreq: "monthly", priority: 0.6 },
    { loc: `${base}/about`, lastmod, changefreq: "monthly", priority: 0.5 },
    { loc: `${base}/contact`, lastmod, changefreq: "monthly", priority: 0.6 },
    { loc: `${base}/privacy`, lastmod, changefreq: "yearly", priority: 0.3 },
    { loc: `${base}/terms`, lastmod, changefreq: "yearly", priority: 0.3 },
    { loc: `${base}/disclaimer`, lastmod, changefreq: "yearly", priority: 0.3 },
    ...SERVICES_CONFIG.map((s) => ({
      loc: `${base}/services/${s.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.7,
    })),
    ...CASE_STUDIES.map((c) => ({
      loc: `${base}/case-studies/${c.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.65,
    })),
  ];

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

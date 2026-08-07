import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { PERSONAS } from "@/lib/personas";
import { buildSitemapXml, isoDate, SITEMAP_BASE } from "@/lib/sitemapXml";
import { locales, localizedPath } from "@/i18n/routing";

export async function GET() {
  const lastmod = isoDate();
  const pageEntries: { path: string; changefreq: string; priority: number }[] = [
    { path: "/tools", changefreq: "weekly", priority: 0.95 },
    { path: "/blog", changefreq: "weekly", priority: 0.85 },
    { path: "/services", changefreq: "weekly", priority: 0.7 },
    { path: "/case-studies", changefreq: "monthly", priority: 0.6 },
    { path: "/about", changefreq: "monthly", priority: 0.5 },
    { path: "/contact", changefreq: "monthly", priority: 0.6 },
    { path: "/privacy", changefreq: "yearly", priority: 0.3 },
    { path: "/terms", changefreq: "yearly", priority: 0.3 },
    { path: "/disclaimer", changefreq: "yearly", priority: 0.3 },
  ];
  const urls = locales.flatMap((locale) => [
    { loc: `${SITEMAP_BASE}${localizedPath(locale, "/")}`, lastmod, changefreq: "weekly", priority: 1 },
    ...pageEntries.map(({ path, changefreq, priority }) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, path)}`, lastmod, changefreq, priority,
    })),
    ...SERVICES_CONFIG.map((s) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, `/services/${s.slug}`)}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.7,
    })),
    ...CASE_STUDIES.map((c) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, `/case-studies/${c.slug}`)}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.65,
    })),
    ...PERSONAS.map((p) => ({
      loc: `${SITEMAP_BASE}${localizedPath(locale, `/for/${p.slug}`)}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.8,
    })),
  ]);

  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

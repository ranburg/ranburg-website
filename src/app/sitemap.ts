import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { isoDate } from "@/lib/sitemapXml";

/** Sitemap index + static pages (tools, categories, blog are split sitemaps) */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sitemap-tools.xml`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/sitemap-categories.xml`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/sitemap-blog.xml`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const servicePages = SERVICES_CONFIG.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const caseStudyPages = CASE_STUDIES.map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...caseStudyPages];
}

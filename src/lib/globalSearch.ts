import { TOOLS_CONFIG } from "./toolsConfig";
import { COMING_SOON_TOOLS } from "./toolComingSoonConfig";
import { SERVICES_CONFIG } from "./servicesConfig";
import { BLOG_POSTS } from "./blogConfig";
import { CASE_STUDIES } from "./caseStudiesConfig";
import { searchTools } from "./toolSearch";

export type SearchResultType = "tool" | "service" | "blog" | "case-study" | "coming-soon";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export function globalSearch(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  searchTools(q).forEach((t) => {
    results.push({
      type: "tool",
      title: t.title,
      description: t.shortDescription,
      href: `/tools/${t.slug}`,
      badge: "Tool",
    });
  });

  COMING_SOON_TOOLS.filter((t) => {
    const hay = `${t.title} ${t.shortDescription} ${t.seo.keywords.join(" ")}`.toLowerCase();
    return hay.includes(q);
  }).forEach((t) => {
    results.push({
      type: "coming-soon",
      title: t.title,
      description: t.shortDescription,
      href: `/tools/${t.slug}`,
      badge: "Coming Soon",
    });
  });

  SERVICES_CONFIG.filter((s) => {
    const hay = `${s.title} ${s.shortDescription} ${s.seo.keywords.join(" ")}`.toLowerCase();
    return hay.includes(q);
  }).forEach((s) => {
    results.push({
      type: "service",
      title: s.title,
      description: s.shortDescription,
      href: `/services/${s.slug}`,
      badge: "Service",
    });
  });

  BLOG_POSTS.filter((p) => {
    const hay = `${p.title} ${p.excerpt} ${p.seo.keywords.join(" ")}`.toLowerCase();
    return hay.includes(q);
  }).forEach((p) => {
    results.push({
      type: "blog",
      title: p.title,
      description: p.excerpt,
      href: `/blog/${p.slug}`,
      badge: "Blog",
    });
  });

  CASE_STUDIES.filter((c) => {
    const hay = `${c.title} ${c.excerpt} ${c.seo.keywords.join(" ")}`.toLowerCase();
    return hay.includes(q);
  }).forEach((c) => {
    results.push({
      type: "case-study",
      title: c.title,
      description: c.excerpt,
      href: `/case-studies/${c.slug}`,
      badge: "Case Study",
    });
  });

  return results.slice(0, limit);
}

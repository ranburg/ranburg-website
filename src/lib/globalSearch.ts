import { TOOLS_CONFIG } from "./toolsConfig";
import { COMING_SOON_TOOLS } from "./toolComingSoonConfig";
import { BLOG_POSTS } from "./blogConfig";
import { CASE_STUDIES } from "./caseStudiesConfig";
import { searchTools } from "./toolSearch";

export type SearchResultType = "tool" | "service" | "blog" | "case-study" | "coming-soon";

export type GlobalSearchFilter = "all" | "tool" | "blog";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon?: string;
  gradient?: string;
}

function matchesQuery(haystack: string, q: string): boolean {
  const lower = haystack.toLowerCase();
  if (lower.includes(q)) return true;
  return q.split(/\s+/).filter(Boolean).every((word) => lower.includes(word));
}

export function globalSearch(
  query: string,
  limit = 12,
  filter: GlobalSearchFilter = "all"
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  if (filter === "all" || filter === "tool") {
    searchTools(q).forEach((t) => {
      results.push({
        type: "tool",
        title: t.title,
        description: t.shortDescription,
        href: `/tools/${t.slug}`,
        badge: "Tool",
        icon: t.icon,
        gradient: t.gradient,
      });
    });

    COMING_SOON_TOOLS.filter((t) => {
      const hay = `${t.title} ${t.shortDescription} ${t.seo.keywords.join(" ")}`;
      return matchesQuery(hay, q);
    }).forEach((t) => {
      results.push({
        type: "coming-soon",
        title: t.title,
        description: t.shortDescription,
        href: `/tools/${t.slug}`,
        badge: "Coming Soon",
      });
    });
  }

  if (filter === "all") {
    CASE_STUDIES.filter((c) => {
      const hay = `${c.title} ${c.excerpt} ${c.seo.keywords.join(" ")}`;
      return matchesQuery(hay, q);
    }).forEach((c) => {
      results.push({
        type: "case-study",
        title: c.title,
        description: c.excerpt,
        href: `/case-studies/${c.slug}`,
        badge: "Case Study",
      });
    });
  }

  if (filter === "all" || filter === "blog") {
    BLOG_POSTS.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.seo.keywords.join(" ")} ${p.category}`;
      return matchesQuery(hay, q);
    }).forEach((p) => {
      results.push({
        type: "blog",
        title: p.title,
        description: p.excerpt,
        href: `/blog/${p.slug}`,
        badge: "Blog",
      });
    });
  }

  const typeOrder: Record<SearchResultType, number> = {
    tool: 0,
    blog: 1,
    service: 2,
    "case-study": 3,
    "coming-soon": 4,
  };

  return results
    .sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
    .slice(0, limit);
}

export function getToolBySlugFromConfig(slug: string) {
  return TOOLS_CONFIG.find((t) => t.slug === slug);
}

import { TOOL_SEO_CATEGORY_MAP } from "./toolSeoCategories";
import { TOOLS_CONFIG, getToolBySlug, type ToolConfig } from "./toolsConfig";
import { getToolsByMetric } from "./toolAnalytics";
import { TOOL_POPULARITY_ORDER } from "./toolPopularity";

function keywordOverlap(a: ToolConfig, b: ToolConfig): number {
  const kwA = new Set([...a.title.toLowerCase().split(/\s+/), ...(a.seo.keywords ?? []).map((k) => k.toLowerCase())]);
  const kwB = new Set([...b.title.toLowerCase().split(/\s+/), ...(b.seo.keywords ?? []).map((k) => k.toLowerCase())]);
  let overlap = 0;
  for (const w of kwA) if (kwB.has(w) && w.length > 3) overlap++;
  return overlap;
}

function getPopularSlugsForRecommendations(): string[] {
  if (typeof window !== "undefined") {
    try {
      return getToolsByMetric("most_used", 20).map((x) => x.slug);
    } catch {
      /* fallback */
    }
  }
  return TOOL_POPULARITY_ORDER;
}

export function getRecommendedTools(currentSlug: string, limit = 8): ToolConfig[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return TOOLS_CONFIG.filter((t) => t.popular).slice(0, limit);

  const result: ToolConfig[] = [];
  const seen = new Set<string>([currentSlug]);

  const sameCategory = TOOLS_CONFIG.filter(
    (t) => t.category === current.category && !seen.has(t.slug)
  );
  for (const t of sameCategory) {
    if (result.length >= limit) break;
    result.push(t);
    seen.add(t.slug);
  }

  const seoCats = TOOL_SEO_CATEGORY_MAP[currentSlug] ?? [];
  for (const cat of seoCats) {
    for (const t of TOOLS_CONFIG) {
      if (result.length >= limit) break;
      if (seen.has(t.slug)) continue;
      if (TOOL_SEO_CATEGORY_MAP[t.slug]?.includes(cat)) {
        result.push(t);
        seen.add(t.slug);
      }
    }
  }

  const byKeywords = TOOLS_CONFIG
    .filter((t) => !seen.has(t.slug))
    .map((t) => ({ t, score: keywordOverlap(current, t) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  for (const { t } of byKeywords) {
    if (result.length >= limit) break;
    result.push(t);
    seen.add(t.slug);
  }

  const orderedPopular = [
    ...getPopularSlugsForRecommendations(),
    ...TOOL_POPULARITY_ORDER,
    ...TOOLS_CONFIG.filter((t) => t.popular).map((t) => t.slug),
  ];
  for (const slug of orderedPopular) {
    if (result.length >= limit) break;
    if (seen.has(slug)) continue;
    const t = getToolBySlug(slug);
    if (t) {
      result.push(t);
      seen.add(slug);
    }
  }

  const filler = TOOLS_CONFIG.filter((t) => !seen.has(t.slug));
  return [...result, ...filler].slice(0, limit);
}

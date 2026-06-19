import { TOOL_SEO_CATEGORY_MAP } from "./toolSeoCategories";
import { TOOLS_CONFIG, getToolBySlug, type ToolConfig } from "./toolsConfig";

export function getRecommendedTools(currentSlug: string, limit = 8): ToolConfig[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return TOOLS_CONFIG.filter((t) => t.popular).slice(0, limit);

  const result: ToolConfig[] = [];
  const seen = new Set<string>([currentSlug]);

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

  const sameInternal = TOOLS_CONFIG.filter(
    (t) => t.category === current.category && !seen.has(t.slug)
  );
  for (const t of sameInternal) {
    if (result.length >= limit) break;
    result.push(t);
    seen.add(t.slug);
  }

  const popular = TOOLS_CONFIG.filter((t) => t.popular && !seen.has(t.slug));
  for (const t of popular) {
    if (result.length >= limit) break;
    result.push(t);
    seen.add(t.slug);
  }

  const filler = TOOLS_CONFIG.filter((t) => !seen.has(t.slug));
  return [...result, ...filler].slice(0, limit);
}

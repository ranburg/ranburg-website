import { TOOL_CATEGORIES, TOOLS_CONFIG, type ToolConfig, type ToolCategoryId } from "./toolsConfig";
import { SEO_CATEGORY_HUBS, TOOL_SEO_CATEGORY_MAP } from "./toolSeoCategories";

export interface SearchMatch {
  tool: ToolConfig;
  score: number;
  matchedFields: string[];
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean);
}

export function searchTools(query: string, categoryFilter?: ToolCategoryId | "all"): ToolConfig[] {
  return searchToolsDetailed(query, categoryFilter).map((m) => m.tool);
}

export function searchToolsDetailed(
  query: string,
  categoryFilter?: ToolCategoryId | "all"
): SearchMatch[] {
  const q = query.trim().toLowerCase();
  let pool = TOOLS_CONFIG;

  if (categoryFilter && categoryFilter !== "all") {
    pool = pool.filter((t) => t.category === categoryFilter);
  }

  if (!q) return pool.map((tool) => ({ tool, score: 1, matchedFields: [] }));

  const words = tokenize(q);

  return pool
    .map((tool) => {
      const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);
      const seoCats = TOOL_SEO_CATEGORY_MAP[tool.slug] ?? [];
      const seoLabels = seoCats.map((s) => SEO_CATEGORY_HUBS.find((h) => h.slug === s)?.label ?? "");

      const fields: { key: string; text: string; weight: number }[] = [
        { key: "title", text: tool.title, weight: 10 },
        { key: "slug", text: tool.slug.replace(/-/g, " "), weight: 6 },
        { key: "description", text: tool.shortDescription, weight: 8 },
        { key: "badge", text: tool.badge, weight: 4 },
        { key: "category", text: category?.label ?? "", weight: 5 },
        { key: "formula", text: tool.formula, weight: 3 },
        { key: "howto", text: tool.howToUse.join(" "), weight: 4 },
        { key: "keywords", text: (tool.seo.keywords ?? []).join(" "), weight: 7 },
        { key: "seo", text: tool.seo.description, weight: 5 },
        { key: "seocat", text: seoLabels.join(" "), weight: 4 },
      ];

      let score = 0;
      const matchedFields: string[] = [];

      for (const f of fields) {
        const hay = f.text.toLowerCase();
        if (!hay) continue;
        if (hay.includes(q)) {
          score += f.weight * 2;
          matchedFields.push(f.key);
        }
        if (words.every((w) => hay.includes(w))) {
          score += f.weight;
          if (!matchedFields.includes(f.key)) matchedFields.push(f.key);
        }
      }

      return { tool, score, matchedFields };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function highlightMatch(text: string, query: string): { parts: { text: string; match: boolean }[] } {
  const q = query.trim();
  if (!q) return { parts: [{ text, match: false }] };
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex).map((part) => ({
    text: part,
    match: part.toLowerCase() === q.toLowerCase(),
  }));
  return { parts };
}

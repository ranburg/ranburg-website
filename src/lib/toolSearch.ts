import { TOOL_CATEGORIES, TOOLS_CONFIG, type ToolConfig } from "./toolsConfig";

export function searchTools(query: string): ToolConfig[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS_CONFIG;

  return TOOLS_CONFIG.filter((tool) => {
    const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);
    const haystack = [
      tool.title,
      tool.slug,
      tool.shortDescription,
      tool.badge,
      category?.label ?? "",
      category?.description ?? "",
      ...(tool.seo.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q) || q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

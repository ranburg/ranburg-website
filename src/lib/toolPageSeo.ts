import type { ToolConfig, ToolCategoryId } from "@/lib/toolsConfig";

/** Schema.org-friendly applicationCategory (not marketing badges). */
export function getSoftwareApplicationCategory(category: ToolCategoryId): string {
  switch (category) {
    case "financial":
      return "FinanceApplication";
    case "developer":
      return "DeveloperApplication";
    case "salesforce":
      return "BusinessApplication";
    case "productivity":
      return "UtilitiesApplication";
    case "design":
      return "MultimediaApplication";
    default:
      return "UtilitiesApplication";
  }
}

/** Stronger tool page titles that still keep unique tool targeting. */
export function buildToolPageTitle(tool: ToolConfig): string {
  const base = tool.seo.title.trim();
  if (/ranburg/i.test(base) || /\|\s*free/i.test(base)) return base;
  if (/free online/i.test(base)) return `${base} | Ranburg`;
  return `${tool.title} — Free Online Tool | Ranburg`;
}

/** Description with intent keywords when the configured one is thin. */
export function buildToolPageDescription(tool: ToolConfig): string {
  const desc = tool.seo.description.trim();
  if (desc.length >= 140) return desc.slice(0, 160);
  const stepHint = tool.howToUse[0] ? ` ${tool.howToUse[0]}` : "";
  const enriched = `${desc}${stepHint} Free, no signup — results in your browser.`.trim();
  return enriched.slice(0, 160);
}

export function buildToolPageKeywords(tool: ToolConfig): string[] {
  const extras = [
    `how to use ${tool.title}`,
    `free ${tool.title}`,
    `${tool.title} online`,
    "free online tool",
    "ranburg tools",
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of [...tool.seo.keywords, ...extras]) {
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out.slice(0, 18);
}

import type { ToolConfig, ToolCategoryId } from "@/lib/toolsConfig";
import { TOOL_PRIMARY_KEYWORDS } from "@/lib/seoGrowthConfig";

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

/** Primary keyword for a tool — config override or derived from title. */
export function getToolPrimaryKeyword(tool: ToolConfig): string {
  return TOOL_PRIMARY_KEYWORDS[tool.slug] ?? tool.title;
}

const SMALL_WORDS = new Set(["to", "vs", "and", "of", "for", "in", "or"]);

/** Display casing for H1 / title: "EMI calculator" → "EMI Calculator". */
export function formatKeywordAsHeading(keyword: string): string {
  return keyword
    .trim()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && SMALL_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      if (word === word.toUpperCase() && word.length > 1) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/** Visible H1 — must match the primary search query, not a marketing subtitle. */
export function buildToolPageH1(tool: ToolConfig): string {
  return formatKeywordAsHeading(getToolPrimaryKeyword(tool));
}

/**
 * Title pattern: "[Tool Name] - Free Online Tool | Ranburg"
 */
export function buildToolPageTitle(tool: ToolConfig): string {
  const primary = formatKeywordAsHeading(getToolPrimaryKeyword(tool));
  const pattern = `${primary} - Free Online Tool | Ranburg`;
  if (pattern.length <= 60) return pattern;
  const compact = `${primary} - Free Tool | Ranburg`;
  if (compact.length <= 60) return compact;
  return `${primary} | Ranburg`.slice(0, 60);
}

/**
 * Intent-rich meta description (≤160 chars) with free / online / secure / no software signals.
 */
export function buildToolPageDescription(tool: ToolConfig): string {
  const primaryHeading = formatKeywordAsHeading(getToolPrimaryKeyword(tool));
  const primary = primaryHeading.toLowerCase();
  const configured = tool.seo.description.trim();

  // Hand-tuned descriptions that already include convert/free/online intent.
  if (
    configured.length >= 120 &&
    /\bfree\b/i.test(configured) &&
    /\bonline\b/i.test(configured)
  ) {
    return configured.slice(0, 160);
  }

  const intentLead = (() => {
    if (tool.slug.includes("-to-") || /convert/i.test(tool.title)) {
      const cleaned = primary.replace(/\s*converter\s*/gi, " ").replace(/\s+/g, " ").trim();
      return `Convert ${cleaned} online for free.`;
    }
    if (/calculator/i.test(tool.title)) {
      return `Free ${primaryHeading} online — instant results.`;
    }
    if (/generator/i.test(tool.title)) {
      return `Free ${primaryHeading} online — create results in seconds.`;
    }
    return `Free ${primaryHeading} online.`;
  })();

  const body =
    configured.length >= 80
      ? configured
      : `${tool.shortDescription} Fast, secure, no software required.`;

  // Avoid duplicating an intent lead already present in the body.
  const bodyAlreadyHasIntent = new RegExp(
    intentLead.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 24),
    "i"
  ).test(body);

  const lead = bodyAlreadyHasIntent ? "" : `${intentLead} `;
  const needsClose = !/\bno signup\b|\bno account\b|\bfree forever\b/i.test(`${lead}${body}`);
  const combined = `${lead}${body}${needsClose ? " No signup." : ""}`
    .replace(/\s+/g, " ")
    .trim();

  return combined.slice(0, 160);
}

export function buildToolPageKeywords(tool: ToolConfig): string[] {
  const primary = getToolPrimaryKeyword(tool);
  const extras = [
    primary,
    `free ${primary}`,
    `${primary} online`,
    `${primary} free`,
    `online ${primary}`,
    `how to use ${tool.title}`,
    `free ${tool.title}`,
    `${tool.title} online`,
    "free online tool",
    "no signup",
    "ranburg tools",
  ];

  if (tool.slug.includes("-to-")) {
    extras.push(`convert ${tool.slug.replace(/-/g, " ")}`, "batch convert", "secure converter");
  }
  if (tool.category === "design") {
    extras.push("browser image tool", "privacy first converter");
  }
  if (tool.category === "financial") {
    extras.push("India calculator", "free finance tool");
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of [...tool.seo.keywords, ...extras]) {
    const key = k.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(k.trim());
  }
  return out.slice(0, 18);
}

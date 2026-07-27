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

function getActionPhrase(tool: ToolConfig): string {
  const t = tool.title.toLowerCase();
  const parts = tool.slug.split("-to-");

  if (parts.length === 2) {
    const from = parts[0].replace(/-/g, " ").toUpperCase();
    const to = parts[1].replace(/-/g, " ").toUpperCase();
    return `Convert ${from} to ${to} Instantly`;
  }
  if (t.includes("converter") || t.includes("convert")) return "Convert Instantly";
  if (t.includes("calculator")) return "Calculate Instantly";
  if (t.includes("generator")) return "Generate Instantly";
  if (t.includes("formatter") || t.includes("format")) return "Format Instantly";
  if (t.includes("compressor") || t.includes("compress")) return "Compress Instantly";
  if (t.includes("resizer") || t.includes("resize") || t.includes("crop")) return "Edit Images Instantly";
  if (t.includes("insights") || t.includes("analytics")) return "Analyze Instantly";
  if (t.includes("encoder") || t.includes("decoder")) return "Encode Instantly";
  if (t.includes("merge") || t.includes("split") || t.includes("pdf")) return "Process PDFs Instantly";
  return "Instant Results in Your Browser";
}

/**
 * Keyword-front-loaded titles matching competitive SERP patterns.
 * Example: "HEIC to JPG Converter Online Free – Convert HEIC to JPG Instantly"
 */
export function buildToolPageTitle(tool: ToolConfig): string {
  const configured = tool.seo.title.trim();
  // Prefer hand-tuned titles that already include intent keywords.
  if (/online free/i.test(configured) || /–|—/.test(configured)) {
    return configured.slice(0, 75);
  }

  const head = tool.title.toLowerCase().includes("online")
    ? `${tool.title} Free`
    : `${tool.title} Online Free`;
  const title = `${head} – ${getActionPhrase(tool)}`;
  return title.length <= 58 ? `${title} | Ranburg` : title.slice(0, 70);
}

/**
 * Intent-rich meta description (≤160 chars) with free / online / secure / no software signals.
 */
export function buildToolPageDescription(tool: ToolConfig): string {
  const primary = getToolPrimaryKeyword(tool).toLowerCase();
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
      return `Free ${primary} online — instant results.`;
    }
    if (/generator/i.test(tool.title)) {
      return `Free ${primary} online — create results in seconds.`;
    }
    return `Free ${primary} online.`;
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

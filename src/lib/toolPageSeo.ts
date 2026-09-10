import type { ToolConfig, ToolCategoryId } from "@/lib/toolsConfig";
import { TOOL_PRIMARY_KEYWORDS } from "@/lib/seoGrowthConfig";
import type { AppLocale } from "@/i18n/routing";

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
export function buildToolPageH1(tool: ToolConfig, locale: AppLocale = "en"): string {
  if (locale !== "en" && tool.title.trim()) return tool.title.trim();
  return formatKeywordAsHeading(getToolPrimaryKeyword(tool));
}

/** CTR-tuned titles for queries that already get impressions. */
const CTR_TITLE_OVERRIDES: Record<string, string> = {
  "heic-to-jpg": "Convert HEIC to JPG Online Free (No App) | Ranburg",
  "age-calculator": "Age Calculator from Date of Birth | Ranburg",
  "keyword-density-checker": "Free Keyword Density Checker Online | Ranburg",
  "instagram-revenue-calculator": "Instagram Earnings Calculator (1k+) | Ranburg",
  "instagram-profile-insights": "Free Instagram Stats Checker | Ranburg",
  "youtube-hashtag-generator": "YouTube Hashtag Generator Free | Ranburg",
  "youtube-channel-insights": "YouTube Channel Analytics Checker | Ranburg",
  "schema-markup-generator": "Free Schema Markup Generator | Ranburg",
  "youtube-thumbnail-checker": "YouTube Thumbnail Checker Free | Ranburg",
  "percentage-calculator": "Percentage Calculator Online Free | Ranburg",
  "bmi-calculator": "BMI Calculator Online Free | Ranburg",
  "fd-calculator": "FD Calculator India — Maturity | Ranburg",
  "unix-timestamp-converter": "Unix Timestamp Converter Free | Ranburg",
  "discount-calculator": "Discount Calculator Online Free | Ranburg",
  "rd-calculator": "RD Calculator India Free | Ranburg",
  "calorie-calculator": "Calorie Calculator (BMR) Free | Ranburg",
};

const LOCALIZED_TITLE_SUFFIX: Record<AppLocale, string> = {
  en: "Free online tool | Ranburg",
  hi: "मुफ़्त ऑनलाइन टूल | Ranburg",
  ar: "أداة مجانية | Ranburg",
  es: "Herramienta gratis | Ranburg",
  pt: "Ferramenta grátis | Ranburg",
  ja: "無料ツール | Ranburg",
  ko: "무료 온라인 도구 | Ranburg",
};

function looksLikeEnglishSeoTitle(value: string): boolean {
  return /[A-Za-z]/.test(value) && !/[^\u0000-\u007F]/.test(value);
}

/**
 * Title pattern: "[Tool Name] - Free Online Tool | Ranburg"
 */
export function buildToolPageTitle(tool: ToolConfig): string {
  const override = CTR_TITLE_OVERRIDES[tool.slug];
  if (override) return override.slice(0, 60);
  const primary = formatKeywordAsHeading(getToolPrimaryKeyword(tool));
  const pattern = `${primary} - Free Online Tool | Ranburg`;
  if (pattern.length <= 60) return pattern;
  const compact = `${primary} - Free Tool | Ranburg`;
  if (compact.length <= 60) return compact;
  return `${primary} | Ranburg`.slice(0, 60);
}

/** Prefer native-script titles; many locale JSON files still copy English seoTitle. */
export function buildLocalizedToolDocumentTitle(tool: ToolConfig, locale: AppLocale): string {
  if (locale === "en") return buildToolPageTitle(tool);
  const seoTitle = tool.seo.title?.trim();
  if (seoTitle && !looksLikeEnglishSeoTitle(seoTitle)) return seoTitle.slice(0, 60);
  return `${tool.title} — ${LOCALIZED_TITLE_SUFFIX[locale]}`.slice(0, 60);
}

export function buildLocalizedToolDescription(tool: ToolConfig, locale: AppLocale): string {
  if (locale === "en") return buildToolPageDescription(tool);
  const seoDescription = tool.seo.description?.trim();
  if (seoDescription && !looksLikeEnglishSeoTitle(seoDescription)) return seoDescription.slice(0, 160);
  return (tool.shortDescription || buildToolPageDescription(tool)).slice(0, 160);
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
  const intentSnippet = intentLead.slice(0, 24);
  const bodyAlreadyHasIntent = body.toLowerCase().includes(intentSnippet.toLowerCase());

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

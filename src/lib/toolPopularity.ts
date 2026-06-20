import { TOOLS_CONFIG } from "./toolsConfig";

/** Hero social analytics tools — pinned in nav and featured on hub/homepage */
export const HERO_TOOL_SLUGS = [
  "youtube-channel-insights",
  "instagram-profile-insights",
  "youtube-revenue-calculator",
  "instagram-revenue-calculator",
];

/**
 * Tools ordered by expected organic traffic (highest first).
 * High-volume searches: passwords, QR, JSON, social/revenue calculators, GST, EMI, currency.
 */
export const TOOL_POPULARITY_ORDER: string[] = [
  "password-generator",
  "qr-generator",
  "json-formatter",
  "youtube-revenue-calculator",
  "youtube-channel-insights",
  "instagram-revenue-calculator",
  "instagram-profile-insights",
  "adsense-revenue-calculator",
  "currency-converter",
  "gst-calculator",
  "emi",
  "sip",
  "regex-tester",
  "uuid-generator",
  "base64-encoder",
  "pdf-tools",
  "swp",
  "unit-converter",
  "age-calculator",
  "case-converter",
  "minifier",
  "sql-formatter",
  "image-converter",
  "lorem-ipsum",
  "linkedin-formatter",
  "glassmorphism-generator",
  "twitch-sub-revenue",
  "ltv-cac",
  "formula-generator",
  "soql-builder",
  "validation-rule-generator",
  "apex-test-generator",
  "flow-formula-builder",
  "cron-generator",
  "date-formula-helper",
  "governor-limits-calculator",
  "omnistudio-expression-builder",
  "revenue-cloud-pricing-calculator",
];

const popularityIndex = new Map(TOOL_POPULARITY_ORDER.map((slug, i) => [slug, i]));

/** All tools sorted by popularity; unknown slugs fall to the end alphabetically. */
export function getToolsByPopularity(): { slug: string; title: string }[] {
  return [...TOOLS_CONFIG]
    .sort((a, b) => {
      const ai = popularityIndex.get(a.slug) ?? 999;
      const bi = popularityIndex.get(b.slug) ?? 999;
      if (ai !== bi) return ai - bi;
      return a.title.localeCompare(b.title);
    })
    .map((t) => ({ slug: t.slug, title: t.title }));
}

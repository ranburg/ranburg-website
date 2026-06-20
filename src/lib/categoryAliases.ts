import type { SeoCategorySlug } from "./toolSeoCategories";

/** SEO-friendly URL aliases → canonical category slugs */
export const CATEGORY_SLUG_ALIASES: Record<string, SeoCategorySlug> = {
  "seo-tools": "seo",
  "developer-tools": "developer",
  "text-tools": "text",
  "business-tools": "business",
  calculators: "calculators",
  generators: "generators",
};

export function resolveCategorySlug(slug: string): SeoCategorySlug | null {
  if (slug in CATEGORY_SLUG_ALIASES) return CATEGORY_SLUG_ALIASES[slug];
  return null;
}

export function getCategoryAliasRedirects() {
  return Object.entries(CATEGORY_SLUG_ALIASES)
    .filter(([alias, canonical]) => alias !== canonical)
    .map(([alias, canonical]) => ({
      source: `/tools/${alias}`,
      destination: `/tools/${canonical}`,
      permanent: true,
    }));
}

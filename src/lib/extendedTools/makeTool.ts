import type { ToolConfig, ToolCategoryId } from "../toolsConfig";

interface MakeToolOptions {
  slug: string;
  title: string;
  shortDescription: string;
  category: ToolCategoryId;
  icon: string;
  gradient: string;
  badge: string;
  keywords: string[];
  howToUse: string[];
  formula: string;
  faq: { question: string; answer: string }[];
  popular?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export function makeTool(opts: MakeToolOptions): ToolConfig {
  return {
    slug: opts.slug,
    title: opts.title,
    shortDescription: opts.shortDescription,
    category: opts.category,
    icon: opts.icon,
    gradient: opts.gradient,
    badge: opts.badge,
    popular: opts.popular,
    seo: {
      title: opts.seoTitle ?? `${opts.title} — Free Online Tool | Ranburg.com`,
      description: opts.seoDescription ?? opts.shortDescription,
      keywords: opts.keywords,
    },
    howToUse: opts.howToUse,
    formula: opts.formula,
    faq: opts.faq,
  };
}

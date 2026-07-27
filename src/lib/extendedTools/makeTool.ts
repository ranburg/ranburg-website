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

function defaultSeoDescription(title: string, shortDescription: string): string {
  return `${shortDescription} Use ${title} online for free — fast, secure, no software or signup required. Instant results in your browser.`;
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
      title: opts.seoTitle ?? `${opts.title} Online Free – Instant Results | Ranburg`,
      description: opts.seoDescription ?? defaultSeoDescription(opts.title, opts.shortDescription),
      keywords: opts.keywords,
    },
    howToUse: opts.howToUse,
    formula: opts.formula,
    faq: opts.faq,
  };
}

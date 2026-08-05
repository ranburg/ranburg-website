import { getToolBySlug, type ToolConfig } from "@/lib/toolsConfig";

export type LocalizedToolFields = {
  title: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  howToUse: string[];
  faq: { question: string; answer: string }[];
};

type ToolsMetaMessages = Record<string, Partial<LocalizedToolFields>>;

export function localizeTool(
  tool: ToolConfig,
  meta: ToolsMetaMessages | undefined
): ToolConfig & LocalizedToolFields {
  const m = meta?.[tool.slug];
  const title = m?.title ?? tool.title;
  const shortDescription = m?.shortDescription ?? tool.shortDescription;
  const seoTitle = m?.seoTitle ?? tool.seo.title;
  const seoDescription = m?.seoDescription ?? tool.seo.description;
  const howToUse = m?.howToUse?.length ? m.howToUse : tool.howToUse;
  const faq = m?.faq?.length ? m.faq : tool.faq;

  return {
    ...tool,
    title,
    shortDescription,
    seoTitle,
    seoDescription,
    howToUse,
    faq,
    seo: {
      ...tool.seo,
      title: seoTitle,
      description: seoDescription,
    },
  };
}

export function getLocalizedToolBySlug(
  slug: string,
  meta: ToolsMetaMessages | undefined
): (ToolConfig & LocalizedToolFields) | undefined {
  const tool = getToolBySlug(slug);
  if (!tool) return undefined;
  return localizeTool(tool, meta);
}

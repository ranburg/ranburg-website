import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS, getComingSoonTool } from "@/lib/toolComingSoonConfig";
import { isSeoCategorySlug } from "@/lib/toolSeoCategories";
import { buildMetadata } from "@/lib/seo";
import { setRequestLocale, getMessages } from "next-intl/server";
import { localizeTool } from "@/lib/i18n/localizeTool";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import {
  buildToolPageDescription,
  buildToolPageKeywords,
  buildToolPageTitle,
} from "@/lib/toolPageSeo";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ToolComingSoonShell from "@/components/tools/ToolComingSoonShell";
import ToolCategoryPage, {
  generateCategoryMetadata,
  getCategoryStaticParams,
} from "@/components/tools/ToolCategoryPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...getCategoryStaticParams(),
    ...TOOLS_CONFIG.map((tool) => ({ slug: tool.slug })),
    ...COMING_SOON_TOOLS.map((tool) => ({ slug: tool.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isAppLocale(rawLocale) ? rawLocale : "en";
  setRequestLocale(locale);
  if (isSeoCategorySlug(slug)) return generateCategoryMetadata(slug, locale);
  const tool = getToolBySlug(slug);
  if (tool) {
    const messages = await getMessages();
    const localizedTool = localizeTool(
      tool,
      (messages as { tools?: { meta?: Record<string, object> } }).tools?.meta
    );
    return buildMetadata({
      title: localizedTool.seoTitle ?? buildToolPageTitle(localizedTool),
      description: localizedTool.seoDescription ?? buildToolPageDescription(localizedTool),
      path: `/tools/${slug}`,
      keywords: buildToolPageKeywords(localizedTool),
      locale,
    });
  }
  const coming = getComingSoonTool(slug);
  if (coming) {
    return buildMetadata({
      title: coming.seo.title,
      description: coming.seo.description,
      path: `/tools/${slug}`,
      keywords: coming.seo.keywords,
      noIndex: true,
      locale,
    });
  }
  return {};
}

export default async function ToolPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isAppLocale(rawLocale) ? rawLocale : "en";
  setRequestLocale(locale);
  if (isSeoCategorySlug(slug)) return <ToolCategoryPage categorySlug={slug} />;
  if (getToolBySlug(slug)) return <ToolPageShell slug={slug} locale={locale} />;
  const coming = getComingSoonTool(slug);
  if (coming) return <ToolComingSoonShell tool={coming} />;
  notFound();
}

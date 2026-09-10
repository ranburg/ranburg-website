import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getComingSoonTool, getAllComingSoonSlugs } from "@/lib/toolComingSoonConfig";
import { isSeoCategorySlug, SEO_CATEGORY_SLUGS } from "@/lib/toolSeoCategories";
import { buildMetadata } from "@/lib/seo";
import { setRequestLocale, getMessages } from "next-intl/server";
import { localizeTool } from "@/lib/i18n/localizeTool";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import {
  buildLocalizedToolDescription,
  buildLocalizedToolDocumentTitle,
  buildToolPageKeywords,
} from "@/lib/toolPageSeo";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ToolComingSoonShell from "@/components/tools/ToolComingSoonShell";
import ToolCategoryPage, {
  generateCategoryMetadata,
} from "@/components/tools/ToolCategoryPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...TOOLS_CONFIG.map((tool) => tool.slug),
    ...getAllComingSoonSlugs(),
    ...SEO_CATEGORY_SLUGS,
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const dynamic = "force-static";

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
      title: buildLocalizedToolDocumentTitle(localizedTool, locale),
      description: buildLocalizedToolDescription(localizedTool, locale),
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

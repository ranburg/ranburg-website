import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS, getComingSoonTool } from "@/lib/toolComingSoonConfig";
import { isSeoCategorySlug } from "@/lib/toolSeoCategories";
import { buildMetadata } from "@/lib/seo";
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
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...getCategoryStaticParams(),
    ...TOOLS_CONFIG.map((tool) => ({ slug: tool.slug })),
    ...COMING_SOON_TOOLS.map((tool) => ({ slug: tool.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isSeoCategorySlug(slug)) return generateCategoryMetadata(slug);
  const tool = getToolBySlug(slug);
  if (tool) {
    return buildMetadata({
      title: buildToolPageTitle(tool),
      description: buildToolPageDescription(tool),
      path: `/tools/${slug}`,
      keywords: buildToolPageKeywords(tool),
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
    });
  }
  return {};
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  if (isSeoCategorySlug(slug)) return <ToolCategoryPage categorySlug={slug} />;
  if (getToolBySlug(slug)) return <ToolPageShell slug={slug} />;
  const coming = getComingSoonTool(slug);
  if (coming) return <ToolComingSoonShell tool={coming} />;
  notFound();
}

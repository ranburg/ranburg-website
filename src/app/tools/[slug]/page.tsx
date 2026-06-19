import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS, getComingSoonTool } from "@/lib/toolComingSoonConfig";
import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ToolComingSoonShell from "@/components/tools/ToolComingSoonShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...TOOLS_CONFIG.map((tool) => ({ slug: tool.slug })),
    ...COMING_SOON_TOOLS.map((tool) => ({ slug: tool.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (tool) {
    return buildMetadata({
      title: tool.seo.title,
      description: tool.seo.description,
      path: `/tools/${slug}`,
      keywords: tool.seo.keywords,
    });
  }
  const coming = getComingSoonTool(slug);
  if (coming) {
    return buildMetadata({
      title: coming.seo.title,
      description: coming.seo.description,
      path: `/tools/${slug}`,
      keywords: coming.seo.keywords,
    });
  }
  return {};
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  if (getToolBySlug(slug)) return <ToolPageShell slug={slug} />;
  const coming = getComingSoonTool(slug);
  if (coming) return <ToolComingSoonShell tool={coming} />;
  notFound();
}

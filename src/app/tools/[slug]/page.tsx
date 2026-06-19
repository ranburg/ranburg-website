import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS_CONFIG, getToolBySlug } from "@/lib/toolsConfig";
import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/tools/ToolPageShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS_CONFIG.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return buildMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    path: `/tools/${slug}`,
    keywords: tool.seo.keywords,
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getToolBySlug(slug)) notFound();
  return <ToolPageShell slug={slug} />;
}

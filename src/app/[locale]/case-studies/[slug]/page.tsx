import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/caseStudiesConfig";
import { buildMetadata } from "@/lib/seo";
import CaseStudyPageShell from "@/components/case-studies/CaseStudyPageShell";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  return buildMetadata({
    title: study.seo.title,
    description: study.seo.description,
    path: `/case-studies/${slug}`,
    keywords: study.seo.keywords,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  if (!getCaseStudyBySlug(slug)) notFound();
  return <CaseStudyPageShell slug={slug} />;
}

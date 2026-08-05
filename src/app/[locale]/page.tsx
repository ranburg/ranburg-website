import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import Hero from "@/components/home/Hero";
import ToolsVideoBanner from "@/components/home/ToolsVideoBanner";
import ToolPlayground from "@/components/home/ToolPlayground";
import UseCasePaths from "@/components/home/UseCasePaths";
import SocialToolsSpotlight from "@/components/home/SocialToolsSpotlight";
import RecentlyUsedTools from "@/components/home/RecentlyUsedTools";
import ExploreToolsStrip from "@/components/home/ExploreToolsStrip";
import ToolCategoryCards from "@/components/home/ToolCategoryCards";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

const TOOL_COUNT = TOOLS_CONFIG.length;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isAppLocale(rawLocale) ? rawLocale : "en";
  setRequestLocale(locale);
  const t = await getTranslations("home");
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/",
    locale,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  setRequestLocale(isAppLocale(rawLocale) ? rawLocale : "en");
  return (
    <>
      <Hero />
      <ToolPlayground />
      <UseCasePaths />
      <ToolsVideoBanner />
      <SocialToolsSpotlight />
      <RecentlyUsedTools />
      <ExploreToolsStrip />
      <ToolCategoryCards />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
    </>
  );
}

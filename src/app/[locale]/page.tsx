import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/home/Hero";
import HomeBanners from "@/components/home/HomeBanners";
import ToolsVideoBanner from "@/components/home/ToolsVideoBanner";
import CatalogDirectory from "@/components/home/CatalogDirectory";
import RecentlyUsedTools from "@/components/home/RecentlyUsedTools";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

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
    keywords: [
      "free online tools",
      "EMI calculator",
      "SIP calculator",
      "GST calculator",
      "HEIC to JPG",
      "PDF merge",
      "image compressor",
      "invoice generator",
      "CTC to in-hand calculator",
      "JSON formatter",
      "Ranburg",
    ],
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  setRequestLocale(isAppLocale(rawLocale) ? rawLocale : "en");
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd(
          "Ranburg free online tools",
          SITE.description,
          SITE.url,
          PRIORITY_INDEX_TOOL_SLUGS.slice(0, 12).map((slug) => {
            const tool = TOOLS_CONFIG.find((item) => item.slug === slug);
            return {
              name: tool?.title ?? slug,
              url: `${SITE.url}/tools/${slug}`,
            };
          })
        )}
      />
      <Hero />
      <HomeBanners />
      <ToolsVideoBanner />
      <CatalogDirectory />
      <RecentlyUsedTools />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
    </>
  );
}

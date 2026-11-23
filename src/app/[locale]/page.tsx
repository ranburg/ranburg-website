import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/home/Hero";
import HomeBanners from "@/components/home/HomeBanners";
import HomeMarquee from "@/components/home/HomeMarquee";
import HowItWorks from "@/components/home/HowItWorks";
import NewToolsSection from "@/components/home/NewToolsSection";
import BlogPreview from "@/components/home/BlogPreview";
import HomeCta from "@/components/home/HomeCta";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

const ToolsVideoBanner = dynamic(() => import("@/components/home/ToolsVideoBanner"));
const CatalogDirectory = dynamic(() => import("@/components/home/CatalogDirectory"));
const RecentlyUsedTools = dynamic(() => import("@/components/home/RecentlyUsedTools"));

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
          "Ranburg free EMI, SIP, GST calculators and PDF tools",
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
      <HomeMarquee />
      <HomeBanners />
      <ToolsVideoBanner />
      <HowItWorks />
      <NewToolsSection />
      <CatalogDirectory />
      <RecentlyUsedTools />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <BlogPreview />
      <HomeCta />
    </>
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import Hero from "@/components/home/Hero";
import SocialToolsSpotlight from "@/components/home/SocialToolsSpotlight";
import PopularTools from "@/components/home/PopularTools";
import RecentlyAddedTools from "@/components/home/RecentlyAddedTools";
import MetricToolsSection from "@/components/home/MetricToolsSection";
import ToolCategoryCards from "@/components/home/ToolCategoryCards";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

const TOOL_COUNT = TOOLS_CONFIG.length;

export const metadata: Metadata = buildMetadata({
  title: `Free Online Tools — ${TOOL_COUNT}+ Calculators & Utilities | Ranburg`,
  description: `${TOOL_COUNT}+ free online tools: revenue calculators, YouTube & Instagram analytics, SEO generators, image/PDF utilities, and Salesforce helpers. Instant results, no signup.`,
  path: "/",
  keywords: [
    "free online tools",
    "developer tools",
    "calculators online",
    "YouTube analytics",
    "Instagram revenue calculator",
    "EMI calculator",
    "SEO tools",
    "ranburg tools",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialToolsSpotlight />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <PopularTools />
      <ToolCategoryCards />
      <MetricToolsSection metric="trending" />
      <RecentlyAddedTools />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
    </>
  );
}

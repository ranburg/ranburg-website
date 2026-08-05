import type { Metadata } from "next";
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

export const metadata: Metadata = buildMetadata({
  title: `Free Online Tools — ${TOOL_COUNT}+ Calculators & Utilities | Ranburg`,
  description: `${TOOL_COUNT}+ free online tools: CTC salary, invoices, YouTube & Instagram analytics, SEO generators, image/PDF utilities. Instant results, no signup.`,
  path: "/",
  keywords: [
    "free online tools",
    "ctc to in hand calculator",
    "invoice generator free",
    "youtube revenue calculator",
    "EMI calculator",
    "GST calculator",
    "safe zone checker",
    "ranburg tools",
  ],
});

export default function HomePage() {
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

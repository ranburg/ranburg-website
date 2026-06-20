import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import SocialToolsSpotlight from "@/components/home/SocialToolsSpotlight";
import PopularTools from "@/components/home/PopularTools";
import RecentlyAddedTools from "@/components/home/RecentlyAddedTools";
import MetricToolsSection from "@/components/home/MetricToolsSection";
import ToolCategoryCards from "@/components/home/ToolCategoryCards";
import CaseStudiesPreview from "@/components/home/CaseStudiesPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Tools — Calculators, Developer Utilities & Business Tools | Ranburg.com",
  description:
    "40+ free online tools: calculators, JSON formatters, GST, invoice generator, YouTube & Instagram analytics, Salesforce utilities, and more. No signup, instant results.",
  path: "/",
  keywords: [
    "free online tools",
    "developer tools",
    "calculators online",
    "GST calculator",
    "invoice generator",
    "business tools",
    "SEO tools",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialToolsSpotlight />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <PopularTools />
      <RecentlyAddedTools />
      <MetricToolsSection metric="trending" />
      <MetricToolsSection metric="most_used" />
      <MetricToolsSection metric="popular_week" />
      <ToolCategoryCards />
      <CaseStudiesPreview />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <ServicesPreview />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <ConsultingCTA />
      </div>
    </>
  );
}

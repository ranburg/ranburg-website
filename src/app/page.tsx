import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import PopularTools from "@/components/home/PopularTools";
import RecentlyAddedTools from "@/components/home/RecentlyAddedTools";
import ToolCategoryCards from "@/components/home/ToolCategoryCards";
import CaseStudiesPreview from "@/components/home/CaseStudiesPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Tools — Developers, SEO, Calculators & Business | Ranburg.com",
  description:
    "Free online tools for developers, businesses, and SEO professionals. Calculators, converters, formatters, generators, and Salesforce utilities — fast, free, no signup.",
  path: "/",
  keywords: [
    "free online tools",
    "developer tools",
    "SEO tools",
    "calculator online",
    "business tools",
    "free utilities",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTools />
      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      <RecentlyAddedTools />
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

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import SocialToolsSpotlight from "@/components/home/SocialToolsSpotlight";
import PopularTools from "@/components/home/PopularTools";
import RecentlyAddedTools from "@/components/home/RecentlyAddedTools";
import ToolCategoryCards from "@/components/home/ToolCategoryCards";
import CaseStudiesPreview from "@/components/home/CaseStudiesPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const metadata: Metadata = buildMetadata({
  title: "Free YouTube & Instagram Analytics — Channel Stats & Revenue Tools | Ranburg.com",
  description:
    "Free YouTube channel analytics and Instagram profile analyzer. Check subscribers, followers, revenue estimates, monetization status, and growth tips. Plus 38+ developer and business tools.",
  path: "/",
  keywords: [
    "YouTube channel analytics",
    "Instagram profile analyzer",
    "YouTube revenue calculator",
    "Instagram earnings estimator",
    "free online tools",
    "creator tools",
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

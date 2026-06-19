import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import TrustTicker from "@/components/home/TrustTicker";
import ServicesPreview from "@/components/home/ServicesPreview";
import { CTASection } from "@/components/home/ServicesPreview";
import ToolsPromo from "@/components/home/ToolsPromo";

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Consulting & Development Services | Ranburg LLP",
  description:
    "Certified Salesforce consultants in Jaipur, India specializing in OmniStudio, Revenue Cloud, Industries Cloud, LWC, and enterprise integrations.",
  path: "/",
  keywords: [
    "Salesforce consulting India",
    "Salesforce consultant Jaipur",
    "OmniStudio development",
    "Revenue Cloud consultant",
    "Salesforce developer India",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustTicker />
      <ServicesPreview />
      <ToolsPromo />
      <CTASection />
    </>
  );
}

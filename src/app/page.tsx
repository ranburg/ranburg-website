import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import TrustTicker from "@/components/home/TrustTicker";
import SalesforceExpertise from "@/components/home/SalesforceExpertise";
import ServicesPreview from "@/components/home/ServicesPreview";
import { CTASection } from "@/components/home/ServicesPreview";
import CaseStudiesPreview from "@/components/home/CaseStudiesPreview";
import ToolsPromo from "@/components/home/ToolsPromo";

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Consulting, Revenue Cloud & Software Development Services | Ranburg LLP",
  description:
    "Certified Salesforce consultants in India. OmniStudio, Revenue Cloud, Industries Cloud, LWC, integrations & free developer tools. Schedule a consultation.",
  path: "/",
  keywords: [
    "Salesforce consulting India",
    "Revenue Cloud consultant",
    "OmniStudio development",
    "Salesforce developer Jaipur",
    "Salesforce consulting services",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustTicker />
      <SalesforceExpertise />
      <ServicesPreview />
      <CaseStudiesPreview />
      <ToolsPromo />
      <CTASection />
    </>
  );
}

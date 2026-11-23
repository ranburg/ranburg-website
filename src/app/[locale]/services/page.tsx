import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import ServiceBento, { ServicesCTA } from "@/components/services/ServiceBento";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Consulting Services | Ranburg LLP",
  description:
    "OmniStudio, Revenue Cloud, Industries Cloud, LWC, integrations, managed services, and staff augmentation from certified Salesforce consultants in Jaipur, India.",
  path: "/services",
  keywords: [
    "Salesforce consulting services",
    "Salesforce development India",
    "OmniStudio consultant",
    "Revenue Cloud implementation",
    "Experience Cloud development",
  ],
});

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Salesforce Services"
        title={
          <>
            Certified <span className="text-gradient-accent font-semibold">Salesforce</span> Consulting & Development
          </>
        }
        lede={
          <>
            From OmniStudio and Revenue Cloud to LWC and enterprise integrations — Ranburg LLP delivers
            end-to-end Salesforce programs for global clients from Jaipur, India.
          </>
        }
      >
        <Button href="/contact" size="lg" icon>Discuss Your Salesforce Project</Button>
      </PageHero>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceBento />
          <ServicesCTA />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ServiceBento, { ServicesCTA } from "@/components/services/ServiceBento";
import Button from "@/components/ui/Button";

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

export default function ServicesPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Salesforce Services</p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Certified <span className="text-gradient-accent">Salesforce</span> Consulting & Development
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-theme-muted">
              From OmniStudio and Revenue Cloud to LWC and enterprise integrations — Ranburg LLP delivers
              end-to-end Salesforce programs for global clients from Jaipur, India.
            </p>
            <div className="mt-8">
              <Button href="/contact" icon>Discuss Your Salesforce Project</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceBento />
          <ServicesCTA />
        </div>
      </section>
    </div>
  );
}

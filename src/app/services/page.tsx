import type { Metadata } from "next";
import ServiceBento, { ServicesCTA } from "@/components/services/ServiceBento";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Ranburg LLP's IT services: custom software, cloud DevOps, enterprise solutions, web & mobile apps, and IT consulting.",
};

export default function ServicesPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              What We Offer
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Comprehensive <span className="text-gradient-accent">IT Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              From strategy to deployment, we provide end-to-end technology solutions
              that drive growth, efficiency, and competitive advantage.
            </p>
            <div className="mt-8">
              <Button href="/contact" icon>
                Discuss Your Project
              </Button>
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

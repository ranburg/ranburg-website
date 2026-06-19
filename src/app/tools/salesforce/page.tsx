import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SALESFORCE_TOOL_SECTIONS } from "@/lib/salesforceToolsHub";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Free Salesforce Developer Tools | Formula, SOQL, Apex & More | Ranburg",
  description:
    "Free Salesforce tools: formula generator, SOQL builder, cron scheduler, Apex test generator, validation rules, governor limits, and Revenue Cloud calculators.",
  path: "/tools/salesforce",
  keywords: [
    "Salesforce tools",
    "Salesforce formula generator",
    "SOQL builder",
    "Salesforce cron generator",
    "free Salesforce developer tools",
  ],
});

export default function SalesforceToolsHubPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Salesforce Tool Hub</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-theme-heading sm:text-5xl">
            Free <span className="text-gradient-accent">Salesforce</span> Developer Tools
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-theme-muted">
            Formula builders, SOQL tools, Apex helpers, flow utilities, and Revenue Cloud calculators —
            built by Ranburg LLP Salesforce consultants. No signup, runs in your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" icon>Discuss Your Salesforce Project</Button>
            <Button href="/services/salesforce-development" variant="outline">
              Salesforce Development Services
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          {SALESFORCE_TOOL_SECTIONS.map((section) => {
            const uniqueSlugs = [...new Set(section.slugs)];
            const tools = uniqueSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
            if (tools.length === 0) return null;

            return (
              <div key={section.id}>
                <h2 className="text-2xl font-bold text-theme-heading">{section.label}</h2>
                <p className="mt-2 max-w-2xl text-theme-muted">{section.description}</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => {
                    if (!tool) return null;
                    const Icon = getToolIcon(tool.icon);
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="glass-card group flex h-full flex-col p-6 hover:border-accent/30"
                      >
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-theme-heading group-hover:text-accent">{tool.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-theme-muted">{tool.shortDescription}</p>
                        <span className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                          Open Tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 text-center">
            <h2 className="text-2xl font-bold text-theme-heading">Need Expert Salesforce Help?</h2>
            <p className="mx-auto mt-4 max-w-xl text-theme-muted">
              Ranburg LLP provides OmniStudio, Revenue Cloud, Industries Cloud, LWC, and integration services from Jaipur, India.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg" icon>Schedule Consultation</Button>
              <Button href="/services" variant="outline" size="lg">View All Services</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

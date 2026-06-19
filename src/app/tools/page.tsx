import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ToolsHub from "@/components/tools/ToolsHub";

export const metadata: Metadata = buildMetadata({
  title: "Free Salesforce Tools & Online Utilities | Ranburg",
  description:
    "Free Salesforce formula generator, SOQL builder, cron scheduler, validation rule helper, and 20+ developer utilities. No signup — runs in your browser.",
  path: "/tools",
  keywords: [
    "Salesforce formula generator",
    "Salesforce SOQL builder",
    "Salesforce cron generator",
    "free Salesforce tools",
    "Salesforce validation rule generator",
  ],
});

export default function ToolsPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Tools Directory</p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Free <span className="text-gradient-accent">Salesforce</span> & Developer Tools
            </h1>
            <p className="mt-6 text-lg text-theme-muted">
              Salesforce cron generators, formula builders, SOQL tools, financial calculators, and more —
              all free, instant, and processed entirely in your browser.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolsHub />
        </div>
      </section>
    </div>
  );
}

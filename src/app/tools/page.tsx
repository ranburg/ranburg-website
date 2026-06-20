import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ToolsHub from "@/components/tools/ToolsHub";
import AllToolsNav from "@/components/tools/AllToolsNav";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Tools — Calculators, Converters & Developer Utilities | Ranburg",
    description:
    "Browse 38+ free online tools: revenue calculators, SEO utilities, developer formatters, social analytics, and Salesforce tools. Search, filter by category, instant results.",
  path: "/tools",
  keywords: [
    "free online tools",
    "developer tools",
    "SEO tools",
    "calculators online",
    "generators",
    "business tools",
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
              Free <span className="text-gradient-accent">Online Tools</span>
            </h1>
            <p className="mt-6 text-lg text-theme-muted">
              YouTube & Instagram analytics, revenue calculators, formatters, and Salesforce utilities —
              all free, instant, and processed in your browser.
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder placement="below-hero" className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <AllToolsNav />
            <ToolsHub />
          </div>
        </div>
      </section>
    </div>
  );
}

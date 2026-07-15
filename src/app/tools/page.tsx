import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import ToolsHub from "@/components/tools/ToolsHub";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

const TOOL_COUNT = TOOLS_CONFIG.length;

export const metadata: Metadata = buildMetadata({
  title: `Free Online Tools — ${TOOL_COUNT}+ Calculators & Utilities | Ranburg`,
  description: `Browse ${TOOL_COUNT}+ free online tools: revenue calculators, SEO utilities, developer formatters, social analytics, and Salesforce tools. Search, filter by category, instant results.`,
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
      <section className="relative overflow-hidden pb-8 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Free tools creators use daily</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl lg:text-5xl">
            Find the right tool. <span className="text-gradient-accent">Get results instantly.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-theme-muted sm:text-lg">
            Calculators, generators, SEO utilities, and social growth tools — free, fast, and built for creators.
          </p>
        </div>
      </section>

      <AdPlaceholder placement="below-hero" className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolsHub />
        </div>
      </section>
    </div>
  );
}

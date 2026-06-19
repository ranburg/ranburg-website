import type { Metadata } from "next";
import ToolsHub from "@/components/tools/ToolsHub";

export const metadata: Metadata = {
  title: "Free Online Tools — Calculators, Formatters & Utilities | Ranburg.com",
  description:
    "Browse 14+ free online tools: financial calculators, JSON/SQL formatters, case converters, glassmorphism CSS generator, and more. Fast, client-side, no signup.",
  keywords: [
    "online tools",
    "financial calculators",
    "JSON formatter",
    "developer utilities",
    "free web tools",
  ],
};

export default function ToolsPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Tools Directory
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Professional <span className="text-gradient-accent">Utilities</span> for
              Every Workflow
            </h1>
            <p className="mt-6 text-lg text-theme-muted">
              Financial calculators, developer formatters, text wizards, and design tools —
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

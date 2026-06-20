"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ToolSearch from "@/components/tools/ToolSearch";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { ArrowRight, Sparkles, Calculator, Code2, Wrench, Search } from "lucide-react";

const highlights = [
  { icon: Wrench, label: "40+ Free Tools" },
  { icon: Calculator, label: "Calculators & Converters" },
  { icon: Code2, label: "Developer Utilities" },
  { icon: Search, label: "SEO & Business Tools" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            100% Free · No Signup · Browser-Based
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-theme-heading sm:text-5xl lg:text-6xl">
            Free Online Tools for{" "}
            <span className="text-gradient-accent">Developers, Businesses</span>
            {" "}and Professionals
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">
            Calculators, formatters, social analytics, generators, and Salesforce utilities —
            instant results with no account required.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <ToolSearch showSuggestions showTags showCategoryFilter maxResults={8} enableKeyboardNav trackSearches />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/tools" size="lg" icon>
              Browse All Tools
            </Button>
            <Button href="/tools/calculators" variant="outline" size="lg">
              Calculators
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2 text-sm text-theme-muted">
                  <Icon className="h-4 w-4 text-accent" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="mx-auto mt-12 max-w-4xl">
          <AdPlaceholder placement="below-hero" />
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ToolSearch from "@/components/tools/ToolSearch";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { ArrowRight, Sparkles, Wrench, Calculator, Code2, Search } from "lucide-react";

const highlights = [
  { icon: Code2, label: "Developer Tools" },
  { icon: Calculator, label: "Calculators" },
  { icon: Search, label: "SEO Utilities" },
  { icon: Wrench, label: "30+ Free Tools" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
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
            {" "}and SEO Professionals
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">
            Explore free productivity, developer, SEO, calculator, and business tools designed to help you work faster and smarter.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <ToolSearch
              showSuggestions
              showTags
              maxResults={8}
              placeholder="Search 30+ free tools — JSON, regex, GST, QR code…"
            />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/tools" size="lg" icon>
              Browse All Tools
            </Button>
            <Button href="/tools/developer" variant="outline" size="lg">
              Developer Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
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

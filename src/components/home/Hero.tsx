"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ToolSearch from "@/components/tools/ToolSearch";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { ArrowRight, Sparkles, Youtube, Instagram, TrendingUp, DollarSign } from "lucide-react";

const highlights = [
  { icon: Youtube, label: "YouTube Channel Analytics" },
  { icon: Instagram, label: "Instagram Profile Analytics" },
  { icon: DollarSign, label: "Revenue Calculators" },
  { icon: TrendingUp, label: "Growth Insights" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-80 w-80 animate-pulse-glow rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            Free YouTube & Instagram Tools · No Signup
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-theme-heading sm:text-5xl lg:text-6xl">
            Analyze & Grow on{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">YouTube</span>
            {" "}&{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Instagram</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">
            Check any public channel or profile — subscribers, followers, revenue estimates, monetization status, and personalized growth tips.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/tools/youtube-channel-insights" size="lg" className="min-w-[220px]">
              <Youtube className="h-5 w-5" />
              YouTube Analytics
            </Button>
            <Button href="/tools/instagram-profile-insights" size="lg" className="min-w-[220px] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90">
              <Instagram className="h-5 w-5" />
              Instagram Analytics
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button href="/tools/youtube-revenue-calculator" variant="outline" size="sm">
              YouTube Revenue Calculator
            </Button>
            <Button href="/tools/instagram-revenue-calculator" variant="outline" size="sm">
              Instagram Revenue Calculator
            </Button>
            <Button href="/tools" variant="outline" size="sm">
              All Tools
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <ToolSearch
              showSuggestions
              showTags
              maxResults={8}
              placeholder="Search — @username, channel URL, calculators…"
            />
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

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ToolSearch from "@/components/tools/ToolSearch";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";

const TOOL_COUNT = TOOLS_CONFIG.length;

export default function Hero() {
  const [loan, setLoan] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return loan / n;
    return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loan, rate, years]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(16,185,129,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <motion.div
          className="absolute left-[12%] top-[28%] h-72 w-72 rounded-full bg-accent/15 blur-3xl"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[18%] right-[8%] h-64 w-64 rounded-full bg-accent-emerald/15 blur-3xl"
          animate={{ opacity: [0.25, 0.55, 0.25], y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="min-w-0"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-4 w-4" />
            Ranburg Tools
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-tight text-theme-heading sm:text-6xl lg:text-7xl">
            Ranburg
          </h1>
          <p className="mt-3 max-w-xl text-xl font-medium text-theme-heading sm:text-2xl">
            The free toolkit creators and builders keep open.
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-theme-muted sm:text-lg">
            {TOOL_COUNT}+ calculators, converters, and social utilities — instant results in your browser. No signup.
          </p>

          <div className="mt-8 max-w-xl">
            <ToolSearch showSuggestions showTags showCategoryFilter maxResults={6} enableKeyboardNav trackSearches />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button href="/tools" size="lg" icon>
              Explore tools
            </Button>
            <Button href="/tools/youtube-channel-insights" variant="outline" size="lg">
              Try YouTube Insights
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent/50 via-accent-emerald/30 to-transparent opacity-70 blur-[1px]" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--background)]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Live demo</p>
                <p className="mt-1 text-lg font-bold text-theme-heading">EMI pulse</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-2.5 py-1 text-xs font-medium text-accent-emerald">
                <Zap className="h-3.5 w-3.5" />
                Instant
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <DemoSlider label="Loan amount" value={loan} min={100000} max={10000000} step={50000} display={fmt(loan)} onChange={setLoan} />
              <DemoSlider label="Interest rate" value={rate} min={5} max={18} step={0.1} display={`${rate.toFixed(1)}%`} onChange={setRate} />
              <DemoSlider label="Tenure" value={years} min={1} max={30} step={1} display={`${years} yrs`} onChange={setYears} />
            </div>

            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Monthly EMI</p>
              <motion.p
                key={Math.round(emi)}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-1 text-3xl font-extrabold tabular-nums text-theme-heading sm:text-4xl"
              >
                {fmt(emi)}
              </motion.p>
            </div>

            <Link
              href="/tools/emi"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              Open full EMI calculator
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DemoSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2 text-sm">
        <span className="text-theme-muted">{label}</span>
        <span className="font-semibold tabular-nums text-theme-heading">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

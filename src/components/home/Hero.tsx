"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import ToolSearch from "@/components/tools/ToolSearch";
import { useCommandPaletteOptional } from "@/components/search/CommandPaletteProvider";
import { ArrowRight, Gauge, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { FEATURED_QUICK_CHIPS, TOOL_CATALOG_COUNT } from "@/lib/catalogDirectory";

export default function Hero() {
  const t = useTranslations("home");
  const palette = useCommandPaletteOptional();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(15,118,110,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(245,158,11,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-4 w-4" />
            {t("heroBrand")}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-theme-heading sm:text-5xl lg:text-[3.35rem]">
            {t("heroHeadline")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-theme-muted sm:text-lg">
            {t("heroSub")}
          </p>

          <div className="mx-auto mt-8 max-w-xl text-left">
            <ToolSearch showSuggestions showTags showCategoryFilter maxResults={6} enableKeyboardNav trackSearches />
            <button
              type="button"
              onClick={() => palette?.setOpen(true)}
              className="mt-2 text-xs text-theme-subtle transition hover:text-accent"
            >
              {t("searchHint")}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FEATURED_QUICK_CHIPS.map((chip) => (
              <Link
                key={chip.slug}
                href={`/tools/${chip.slug}`}
                className="rounded-full border border-theme bg-theme-surface/80 px-3.5 py-1.5 text-sm font-semibold text-theme-heading transition hover:border-accent/40 hover:bg-accent/10"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/tools" size="lg" icon>
              {t("ctaTools")}
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              {t("ctaContact")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <MetricBadge icon={Wrench} label={t("metricTools", { count: TOOL_CATALOG_COUNT })} />
            <MetricBadge icon={Gauge} label={t("metricSpeed")} />
            <MetricBadge icon={ShieldCheck} label={t("metricNoSignup")} />
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function MetricBadge({
  icon: Icon,
  label,
}: {
  icon: typeof Wrench;
  label: string;
}) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-theme bg-theme-surface/70 px-3.5 py-1.5 text-sm font-medium text-theme-heading">
      <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
      {label}
    </li>
  );
}

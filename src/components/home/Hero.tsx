import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SearchHeroPanel from "@/components/home/SearchHeroPanel";
import HeroSearch from "@/components/home/HeroSearch";
import { ArrowRight, FileText, Gauge, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { FEATURED_QUICK_CHIPS, TOOL_CATALOG_COUNT } from "@/lib/catalogDirectory";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";

const ASIDE_TOOLS = ["emi", "gst-calculator", "pdf-merge"] as const;

export default async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden pb-6 pt-10 sm:pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%)]" />
        <div className="absolute inset-0 bg-grid opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchHeroPanel
          eyebrow={
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              <Sparkles className="h-4 w-4" />
              {t("heroBrand")} · {t("metricTools", { count: TOOL_CATALOG_COUNT })}
            </p>
          }
          title={
            <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight text-theme-heading sm:text-4xl lg:text-[2.75rem]">
              {t("heroHeadline")}
            </h1>
          }
          subtitle={
            <p className="mt-3 max-w-xl text-base leading-relaxed text-theme-muted sm:text-lg">{t("heroSub")}</p>
          }
          search={<HeroSearch />}
          belowSearch={
            <div className="mt-5 flex flex-wrap gap-2">
              {FEATURED_QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip.slug}
                  href={`/tools/${chip.slug}`}
                  className="rounded-full border border-theme bg-[var(--surface-elevated)]/80 px-3.5 py-1.5 text-sm font-semibold text-theme-heading shadow-sm transition hover:border-accent/40 hover:bg-accent/10"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          }
          aside={<HeroFeaturedAside />}
        />

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricCard icon={Wrench} label={t("metricTools", { count: TOOL_CATALOG_COUNT })} hint="EMI, SIP, GST, PDF, and developer tools" />
          <MetricCard icon={Gauge} label={t("metricSpeed")} hint="Most tools finish in under a second" />
          <MetricCard icon={ShieldCheck} label={t("metricNoSignup")} hint="Files stay in your browser" />
        </ul>
      </div>
    </section>
  );
}

function HeroFeaturedAside() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-subtle">Jump in</p>
      {ASIDE_TOOLS.map((slug) => {
        const tool = getToolBySlug(slug);
        if (!tool) return null;
        const Icon = getToolIcon(tool.icon, tool.slug);
        return (
          <Link
            key={slug}
            href={`/tools/${slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-theme bg-[var(--surface-elevated)]/80 p-3.5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ring-2 ring-white/40 dark:ring-white/10 ${tool.gradient}`}>
              <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-theme-heading group-hover:text-accent">{tool.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-theme-muted">{tool.shortDescription}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-theme-subtle group-hover:text-accent" />
          </Link>
        );
      })}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-accent hover:underline"
      >
        <FileText className="h-4 w-4" />
        Browse the full catalog
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Wrench;
  label: string;
  hint: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-theme bg-[var(--surface-elevated)]/70 px-4 py-3.5 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span>
        <span className="block text-sm font-semibold text-theme-heading">{label}</span>
        <span className="mt-0.5 block text-xs text-theme-muted">{hint}</span>
      </span>
    </li>
  );
}

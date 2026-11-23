import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HeroSearch from "@/components/home/HeroSearch";
import { ArrowRight, ArrowUpRight, Gauge, ShieldCheck } from "lucide-react";
import { FEATURED_QUICK_CHIPS, TOOL_CATALOG_COUNT } from "@/lib/catalogDirectory";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { localeNames, locales } from "@/i18n/routing";
import { iconWell } from "@/components/tools/iconWell";

const ASIDE_TOOLS = ["instagram-profile-insights", "heic-to-jpg", "age-calculator"] as const;

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export default async function Hero() {
  const t = await getTranslations("home");
  const words = t("heroHeadline").split(" ");
  const lightUntil = Math.ceil(words.length / 2);

  const stats = [
    { value: String(TOOL_CATALOG_COUNT), suffix: "+", label: t("statTools"), hint: "EMI, SIP, GST, PDF, and developer tools" },
    { value: String(SEO_CATEGORY_HUBS.length), suffix: "", label: t("statCategories"), hint: "Finance, PDF, image, SEO, developer and more" },
    { value: String(locales.length), suffix: "", label: t("statLanguages"), hint: locales.map((code) => localeNames[code]).join(" · ") },
    { value: "0", suffix: "", label: t("statSignups"), hint: "Files stay in your browser" },
  ];

  return (
    <section className="relative pb-10 pt-10 sm:pt-16 lg:pt-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow rise-soft">
            <span className="status-dot" aria-hidden />
            {t("heroBrand")} · {t("metricTools", { count: TOOL_CATALOG_COUNT })}
          </p>

          {/* Words animate in with CSS only; the H1 text is in the first paint for LCP and crawlers. */}
          <h1 className="mt-7 text-[2.4rem] leading-[1.12] tracking-[-0.035em] text-theme-heading sm:text-6xl lg:text-[4.5rem]">
            {words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <span
                  className={`rise inline-block ${i < lightUntil ? "font-light" : "font-semibold"}`}
                  style={delay(60 + i * 55)}
                >
                  {word}
                </span>
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="rise-soft mx-auto mt-6 max-w-2xl text-base leading-relaxed text-theme-muted sm:text-lg" style={delay(520)}>
            {t("heroSub")}
          </p>
        </div>

        <div className="rise-soft relative mx-auto mt-10 max-w-3xl" style={delay(640)}>
          <div className="card spotlight relative z-10 p-3 shadow-[0_40px_90px_-50px_color-mix(in_srgb,var(--accent)_70%,transparent)] sm:p-4">
            <HeroSearch />
          </div>

          <div
            className="pointer-events-none absolute -right-4 -top-16 hidden select-none items-end gap-1 text-accent lg:flex xl:-right-28 rtl:-left-4 rtl:right-auto rtl:xl:-left-28"
            aria-hidden
          >
            <svg viewBox="0 0 60 64" className="h-14 w-12 rtl:-scale-x-100" fill="none">
              <path
                className="draw-line"
                pathLength={1}
                d="M52 6C30 4 12 18 14 52M14 52l-9-11M14 52l12-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hand float-slow -rotate-6 pb-8 text-2xl">{t("heroNote")}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-theme-muted">
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-accent" aria-hidden />
              {t("metricSpeed")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
              {t("metricNoSignup")}
            </span>
          </div>
        </div>

        <div className="rise-soft mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2" style={delay(760)}>
          {FEATURED_QUICK_CHIPS.map((chip) => (
            <Link
              key={chip.slug}
              href={`/tools/${chip.slug}`}
              className="rounded-full border border-theme-subtle bg-theme-surface px-4 py-1.5 text-sm text-theme-body transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
            >
              {chip.label}
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <div className="card spotlight p-5 sm:p-6" data-reveal="left">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-theme-subtle">Jump in</p>
            <div className="mt-4 space-y-2.5">
              {ASIDE_TOOLS.map((slug) => {
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                const Icon = getToolIcon(tool.icon, tool.slug);
                return (
                  <Link
                    key={slug}
                    href={`/tools/${slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-3 transition-all duration-300 hover:border-accent/50"
                  >
                    <div {...iconWell(tool.gradient, "h-11 w-11 rounded-xl transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110")}>
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-theme-heading transition-colors group-hover:text-accent">{tool.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-theme-muted">{tool.shortDescription}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                );
              })}
            </div>
            <Link
              href="/tools"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
            >
              Browse the full catalog
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-4" data-reveal="right">
            {stats.map((stat) => (
              <li key={stat.label} className="card spotlight flex flex-col justify-between p-5 sm:p-6">
                <p className="text-4xl font-light tabular-nums tracking-tight text-theme-heading sm:text-5xl lg:text-6xl">
                  <span data-countup={stat.value === "0" ? undefined : stat.value}>{stat.value}</span>
                  {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
                </p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-theme-heading sm:text-base">{stat.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-theme-muted sm:text-sm">{stat.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

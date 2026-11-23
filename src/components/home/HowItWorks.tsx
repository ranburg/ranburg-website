import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Download, MousePointerClick, SlidersHorizontal } from "lucide-react";

const STEP_ICONS = [MousePointerClick, SlidersHorizontal, Download] as const;

/** Numbered three-step explainer (reference-style process cards). */
export default async function HowItWorks() {
  const t = await getTranslations("home");
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden />
            {t("howEyebrow")}
          </p>
          <h2 className="section-heading mt-5">{t("howTitle")}</h2>
          <p className="section-lede mt-4">{t("howSub")}</p>
        </div>

        <ol className="relative mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li
                key={step.title}
                data-reveal="up"
                style={{ "--reveal-delay": `${i * 120}ms` } as CSSProperties}
                className="card spotlight group relative overflow-hidden p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-light tabular-nums text-accent sm:text-6xl">0{i + 1}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <h3 className="mt-10 text-xl font-medium text-theme-heading sm:text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-theme-muted sm:text-base">{step.body}</p>
                <span
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                  aria-hidden
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

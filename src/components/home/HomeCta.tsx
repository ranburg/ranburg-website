import { getTranslations } from "next-intl/server";
import Button from "@/components/ui/Button";

/** Closing call-to-action panel. */
export default async function HomeCta() {
  const t = await getTranslations("home");

  return (
    <section className="pb-8 pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-reveal="scale"
          className="card spotlight relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-24"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute inset-0 bg-grid opacity-60 mask-fade-b" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden />
              {t("ctaEyebrow")}
            </p>
            <h2 className="mt-6 text-4xl font-light leading-[1.08] tracking-[-0.035em] text-theme-heading sm:text-6xl">
              {t("ctaTitle")}
            </h2>
            <p className="section-lede mx-auto mt-5 max-w-xl">{t("ctaSub")}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="/tools" size="lg" icon>
                {t("ctaTools")}
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                {t("ctaContact")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

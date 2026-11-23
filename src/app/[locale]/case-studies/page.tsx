import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Case Studies & Success Stories | Ranburg LLP",
  description:
    "Revenue Cloud, OmniStudio, Industries Cloud, and enterprise integration case studies from certified Ranburg Salesforce consultants.",
  path: "/case-studies",
  keywords: ["Salesforce case studies", "Revenue Cloud implementation", "OmniStudio project", "Ranburg LLP"],
});

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Success Stories"
        title={
          <>
            Salesforce <span className="text-gradient-accent font-semibold">Case Studies</span>
          </>
        }
        lede="Real-world outcomes from Revenue Cloud, OmniStudio, Industries Cloud, and integration programs delivered by Ranburg LLP."
      />
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {CASE_STUDIES.map((study, i) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                data-reveal="up"
                style={{ "--reveal-delay": `${(i % 2) * 100}ms` } as React.CSSProperties}
                className="card spotlight group flex flex-col p-6 transition-[border-color] duration-500 hover:border-accent/50 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-light tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-theme-subtle">{study.industry}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h2 className="mt-8 text-2xl font-medium leading-snug tracking-tight text-theme-heading transition-colors group-hover:text-accent sm:text-3xl">{study.title}</h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-theme-muted sm:text-base">{study.excerpt}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {study.products.slice(0, 3).map((p) => (
                    <li key={p} className="rounded-full border border-theme-subtle bg-theme-surface px-3 py-1 text-xs text-theme-muted">{p}</li>
                  ))}
                </ul>
                <span className="mt-6 text-sm font-medium text-accent">Read case study</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

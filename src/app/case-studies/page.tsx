import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Case Studies & Success Stories | Ranburg LLP",
  description:
    "Revenue Cloud, OmniStudio, Industries Cloud, and enterprise integration case studies from certified Ranburg Salesforce consultants.",
  path: "/case-studies",
  keywords: ["Salesforce case studies", "Revenue Cloud implementation", "OmniStudio project", "Ranburg LLP"],
});

export default function CaseStudiesPage() {
  return (
    <div className="pb-24">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Success Stories</p>
          <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
            Salesforce <span className="text-gradient-accent">Case Studies</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-theme-muted">
            Real-world outcomes from Revenue Cloud, OmniStudio, Industries Cloud, and integration programs delivered by Ranburg LLP.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {CASE_STUDIES.map((study) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`} className="glass-card group block p-8 hover:border-accent/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{study.industry}</p>
                <h2 className="mt-2 text-xl font-bold text-theme-heading group-hover:text-accent">{study.title}</h2>
                <p className="mt-3 text-sm text-theme-muted line-clamp-3">{study.excerpt}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {study.products.slice(0, 3).map((p) => (
                    <li key={p} className="rounded-full bg-theme-surface px-2 py-0.5 text-xs text-theme-subtle">{p}</li>
                  ))}
                </ul>
                <span className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                  Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

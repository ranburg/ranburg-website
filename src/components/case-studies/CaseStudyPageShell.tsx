import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCaseStudyBySlug, CASE_STUDIES } from "@/lib/caseStudiesConfig";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { SITE } from "@/lib/siteConfig";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getServiceIcon } from "@/lib/serviceIcons";

interface CaseStudyPageShellProps {
  slug: string;
}

export default function CaseStudyPageShell({ slug }: CaseStudyPageShellProps) {
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const url = `${SITE.url}/case-studies/${slug}`;
  const related = SERVICES_CONFIG.filter((s) => study.relatedServices.includes(s.slug));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: "Case Studies", url: `${SITE.url}/case-studies` },
            { name: study.title, url },
          ]),
        ]}
      />
      <div className="pb-24">
        <section className="pb-10 pt-8 sm:pt-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Case Studies", href: "/case-studies" },
                { label: study.title },
              ]}
            />
            <p className="eyebrow rise-soft">
              <span className="status-dot" aria-hidden />
              {study.industry}
            </p>
            <h1 className="rise mt-6 text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-5xl">{study.title}</h1>
            <p className="rise-soft mt-5 text-lg leading-relaxed text-theme-muted">{study.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {study.products.map((p) => (
                <span key={p} className="rounded-full border border-theme-subtle bg-theme-surface px-3 py-1 text-xs text-theme-muted">{p}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="mx-auto max-w-4xl space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="card p-6 sm:p-8" data-reveal="up">
              <span className="text-sm tabular-nums text-accent">01</span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Client Challenge</h2>
              <p className="mt-4 text-base leading-[1.8] text-theme-muted">{study.challenge}</p>
            </div>
            <div className="card p-6 sm:p-8" data-reveal="up">
              <span className="text-sm tabular-nums text-accent">02</span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Solution Architecture</h2>
              <p className="mt-4 text-base leading-[1.8] text-theme-muted">{study.solution}</p>
              <p className="mt-4 text-sm text-theme-subtle">
                <strong className="text-theme-heading">Technology stack:</strong> {study.stack.join(" · ")}
              </p>
            </div>
            <div className="card p-6 sm:p-8" data-reveal="up">
              <span className="text-sm tabular-nums text-accent">03</span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Business Impact</h2>
              <ul className="mt-4 space-y-3">
                {study.impact.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-theme-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 sm:p-8" data-reveal="up">
              <span className="text-sm tabular-nums text-accent">04</span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Key Outcomes</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
                {study.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>

            {related.length > 0 && (
              <div className="pt-10">
                <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Related Services</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((rel) => {
                    const Icon = getServiceIcon(rel.icon);
                    return (
                      <Link key={rel.slug} href={`/services/${rel.slug}`} className="card spotlight group flex items-center gap-4 p-4 transition-colors duration-300 hover:border-accent/50">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rel.gradient}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="flex-1 font-medium text-theme-heading group-hover:text-accent">{rel.title}</span>
                        <ArrowRight className="h-4 w-4 text-accent" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card spotlight relative !mt-14 overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10 sm:py-16" data-reveal="scale">
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
              <h2 className="relative text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-4xl">Start Your Salesforce Project</h2>
              <p className="section-lede relative mx-auto mt-3 max-w-md">Discuss a similar initiative with Ranburg LLP consultants.</p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/contact" size="lg" icon>Schedule Consultation</Button>
                <Button href="/case-studies" size="lg" variant="secondary">More Case Studies</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
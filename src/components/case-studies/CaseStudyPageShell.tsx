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
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Case Studies", href: "/case-studies" },
                { label: study.title },
              ]}
            />
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{study.industry}</p>
            <h1 className="mt-4 text-3xl font-extrabold text-theme-heading sm:text-4xl">{study.title}</h1>
            <p className="mt-4 text-lg text-theme-muted">{study.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {study.products.map((p) => (
                <span key={p} className="rounded-full border border-theme-subtle px-3 py-1 text-xs text-theme-muted">{p}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-theme-heading">Client Challenge</h2>
              <p className="mt-4 leading-relaxed text-theme-muted">{study.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-theme-heading">Solution Architecture</h2>
              <p className="mt-4 leading-relaxed text-theme-muted">{study.solution}</p>
              <p className="mt-4 text-sm text-theme-subtle">
                <strong className="text-theme-heading">Technology stack:</strong> {study.stack.join(" · ")}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-theme-heading">Business Impact</h2>
              <ul className="mt-4 space-y-3">
                {study.impact.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-theme-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-theme-heading">Key Outcomes</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
                {study.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>

            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-theme-heading">Related Services</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((rel) => {
                    const Icon = getServiceIcon(rel.icon);
                    return (
                      <Link key={rel.slug} href={`/services/${rel.slug}`} className="glass-card group flex items-center gap-4 p-4 hover:border-accent/30">
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

            <div className="glass-card p-8 text-center">
              <h2 className="text-xl font-bold text-theme-heading">Start Your Salesforce Project</h2>
              <p className="mx-auto mt-3 max-w-md text-theme-muted">Discuss a similar initiative with Ranburg LLP consultants.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button href="/contact" icon>Schedule Consultation</Button>
                <Button href="/case-studies" variant="outline">More Case Studies</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
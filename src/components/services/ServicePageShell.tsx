import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getServiceBySlug, SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";
import { SITE } from "@/lib/siteConfig";
import { serviceJsonLd, faqJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import ServiceFaq from "@/components/services/ServiceFaq";

interface ServicePageShellProps {
  slug: string;
}

export default function ServicePageShell({ slug }: ServicePageShellProps) {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = getServiceIcon(service.icon);
  const url = `${SITE.url}/services/${slug}`;
  const related = SERVICES_CONFIG.filter((s) => service.relatedSlugs.includes(s.slug));

  return (
    <>
      <JsonLd data={[serviceJsonLd(service.title, service.shortDescription, url), faqJsonLd(service.faq)]} />

      <div className="pb-24">
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm text-theme-muted hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> All Services
            </Link>
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient}`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{service.badge}</span>
                <h1 className="mt-1 text-3xl font-extrabold text-theme-heading sm:text-4xl">{service.title}</h1>
                <p className="mt-3 text-lg text-theme-muted">{service.shortDescription}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {service.sections.map((section) => (
                <div key={section.heading} className="mb-10">
                  <h2 className="text-2xl font-bold text-theme-heading">{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mt-4 leading-relaxed text-theme-muted">{p}</p>
                  ))}
                </div>
              ))}
            </article>

            <ServiceFaq faq={service.faq} />

            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-bold text-theme-heading">Related Salesforce Services</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((rel) => {
                    const RelIcon = getServiceIcon(rel.icon);
                    return (
                      <Link key={rel.slug} href={`/services/${rel.slug}`} className="glass-card group flex items-center gap-4 p-4 hover:border-accent/30">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rel.gradient}`}>
                          <RelIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-theme-heading group-hover:text-accent">{rel.title}</p>
                          <p className="text-xs text-theme-subtle">{rel.badge}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-accent" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="glass-card mt-16 p-10 text-center">
              <h2 className="text-2xl font-bold text-theme-heading">Ready to Start Your Salesforce Project?</h2>
              <p className="mx-auto mt-4 max-w-xl text-theme-muted">
                Talk to certified Salesforce consultants at Ranburg LLP in Jaipur. Free discovery call for new engagements.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/contact" size="lg" icon>Get a Free Consultation</Button>
                <Link href="/tools" className="text-sm font-medium text-accent hover:underline">Explore Free Salesforce Tools →</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function getServiceMetadata(slug: string) {
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${slug}`,
    keywords: service.seo.keywords,
  });
}

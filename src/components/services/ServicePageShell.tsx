import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getServiceBySlug, SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";
import { SITE } from "@/lib/siteConfig";
import { serviceJsonLd, faqJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
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
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: "Services", url: `${SITE.url}/services` },
            { name: service.title, url },
          ]),
          serviceJsonLd(service.title, service.shortDescription, url),
          faqJsonLd(service.faq),
        ]}
      />

      <div className="pb-24">
        <section className="pb-10 pt-8 sm:pt-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: service.title },
              ]}
            />
            <div className="rise flex items-start gap-4 sm:gap-5">
              <div className={`float-slow flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-16 sm:w-16 ${service.gradient}`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">{service.badge}</span>
                <h1 className="mt-2 text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-5xl">{service.title}</h1>
                <p className="mt-4 text-lg leading-relaxed text-theme-muted">{service.shortDescription}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {service.sections.map((section) => (
                <div key={section.heading} className="mb-12" data-reveal="up">
                  <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mt-4 text-base leading-[1.8] text-theme-muted sm:text-lg">{p}</p>
                  ))}
                </div>
              ))}
            </article>

            <ServiceFaq faq={service.faq} />

            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl" data-reveal="up">Related Salesforce Services</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((rel) => {
                    const RelIcon = getServiceIcon(rel.icon);
                    return (
                      <Link key={rel.slug} href={`/services/${rel.slug}`} className="card spotlight group flex items-center gap-4 p-4 transition-colors duration-300 hover:border-accent/50">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rel.gradient}`}>
                          <RelIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-theme-heading group-hover:text-accent">{rel.title}</p>
                          <p className="text-xs text-theme-subtle">{rel.badge}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-theme-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card spotlight relative mt-16 overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10 sm:py-16" data-reveal="scale">
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
              <h2 className="relative text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-4xl">Ready to Start Your Salesforce Project?</h2>
              <p className="section-lede relative mx-auto mt-4 max-w-xl">
                Talk to certified Salesforce consultants at Ranburg LLP in Jaipur. Free discovery call for new engagements.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/contact" size="lg" icon>Get a Free Consultation</Button>
                <Link href="/tools/salesforce" className="text-sm font-medium text-accent hover:underline">Explore Free Salesforce Tools →</Link>
                <Link href="/case-studies" className="text-sm font-medium text-accent hover:underline">View Case Studies →</Link>
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

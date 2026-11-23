import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import Link from "next/link";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { SALESFORCE_TOOL_SECTIONS } from "@/lib/salesforceToolsHub";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getComingSoonTool } from "@/lib/toolComingSoonConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

const sfCard =
  "card spotlight group flex h-full flex-col overflow-hidden p-6 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1";
const sfArrow =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent";
import { iconWell } from "@/components/tools/iconWell";

export const metadata: Metadata = buildMetadata({
  title: "Free Salesforce Tools — Developer & Admin Utilities | Ranburg",
  description:
    "Salesforce tools for admins and developers: formula generators, SOQL builder, Apex helpers, admin utilities, and productivity tools. Free from Ranburg LLP.",
  path: "/tools/salesforce",
  keywords: [
    "Salesforce tools",
    "Salesforce developer tools",
    "Salesforce admin tools",
    "Salesforce productivity tools",
    "Salesforce formula generator",
    "SOQL builder",
  ],
});

const SEO_SECTIONS = [
  {
    heading: "Why Salesforce Professionals Need Dedicated Productivity Tools",
    paragraphs: [
      "Salesforce administrators and developers spend hours each week writing formulas, crafting SOQL queries, scheduling jobs, and validating automation. Generic text editors and spreadsheet scratchpads introduce syntax errors that surface only in sandbox testing — or worse, in production. Purpose-built Salesforce tools reduce rework, accelerate delivery, and help teams standardize patterns across orgs.",
      "Ranburg built this free Salesforce tool hub for admins and developers worldwide. Whether you configure formulas, craft SOQL queries, or schedule jobs, these utilities run entirely in your browser with no data uploaded to our servers.",
    ],
  },
  {
    heading: "Salesforce Admin Tools",
    paragraphs: [
      "Administrators benefit from cron expression generators, validation rule helpers, and governor limit calculators. Scheduling Apex and Flow jobs requires precise cron syntax unique to Salesforce — our scheduler tool outputs copy-ready expressions. Validation rule generators help draft criteria before you paste into Setup, reducing trial-and-error in complex cross-object formulas.",
      "Upcoming admin utilities include sharing rule generators and formula explainers that translate existing logic into plain English for audits and knowledge transfer.",
    ],
  },
  {
    heading: "Salesforce Developer Tools",
    paragraphs: [
      "Developers use our SOQL query builder to prototype selective queries before embedding them in Apex or Lightning Web Components. The Apex test class generator scaffolds bulkified test methods aligned to common patterns. Flow formula builders and date formula helpers bridge the gap between declarative admins and code-first developers.",
      "Future developer tools on our roadmap include Apex trigger generators with handler templates and OmniStudio DataRaptor formula builders for Industries Cloud programs.",
    ],
  },
  {
    heading: "Revenue Cloud and OmniStudio Utilities",
    paragraphs: [
      "Quote-to-cash teams use pricing calculators to model scenarios before configuration sessions. Explore the full tool library for more Salesforce admin and developer utilities.",
    ],
  },
];

export default async function SalesforceToolsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const salesforceTools = SALESFORCE_TOOL_SECTIONS.flatMap((section) =>
    section.slugs.map((slug) => getToolBySlug(slug)).filter(Boolean)
  );
  return (
    <div className="pb-24">
      <JsonLd
        data={collectionPageJsonLd(
          "Free Salesforce tools",
          "Salesforce tools for admins and developers: formula generators, SOQL builder, Apex helpers, and admin utilities.",
          `${SITE.url}/tools/salesforce`,
          salesforceTools.map((tool) => ({
            name: tool!.title,
            url: `${SITE.url}/tools/${tool!.slug}`,
          }))
        )}
      />
      <PageHero
        eyebrow="Salesforce Tool Hub"
        title={
          <>
            Free <span className="text-gradient-accent font-semibold">Salesforce</span> Developer & Admin Tools
          </>
        }
        lede={
          <>
            Salesforce productivity tools for formula builders, query builders, Apex helpers, and admin utilities.
            No signup required.
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/tools" size="lg" icon>Browse All Tools</Button>
          <Button href="/blog" size="lg" variant="secondary">Salesforce Guides</Button>
        </div>
      </PageHero>

      <section className="py-8">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          {SALESFORCE_TOOL_SECTIONS.map((section) => {
            const liveSlugs = [...new Set(section.slugs)];
            const comingSlugs = section.comingSoonSlugs ?? [];
            const hasLive = liveSlugs.some((s) => getToolBySlug(s));
            const hasComing = comingSlugs.length > 0;
            if (!hasLive && !hasComing) return null;

            return (
              <div key={section.id}>
                <h2 className="section-heading" data-reveal="up">{section.label}</h2>
                <p className="section-lede mt-3 max-w-2xl">{section.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {liveSlugs.map((slug) => {
                    const tool = getToolBySlug(slug);
                    if (!tool) return null;
                    const Icon = getToolIcon(tool.icon, tool.slug);
                    return (
                      <Link key={slug} href={`/tools/${tool.slug}`} data-reveal="up" className={`${sfCard} hover:border-accent/60`}>
                        <div className="mb-6 flex items-start justify-between">
                          <div {...iconWell(tool.gradient, "h-12 w-12 rounded-2xl")}>
                            <Icon className="h-6 w-6" strokeWidth={2.25} />
                          </div>
                          <span className={sfArrow}>
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-theme-heading transition-colors group-hover:text-accent">{tool.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-theme-muted">{tool.shortDescription}</p>
                        <span className="mt-5 text-sm font-medium text-accent">Open Tool</span>
                      </Link>
                    );
                  })}
                  {comingSlugs.map((slug) => {
                    const tool = getComingSoonTool(slug);
                    if (!tool) return null;
                    const Icon = getToolIcon(tool.icon, tool.slug);
                    return (
                      <Link key={slug} href={`/tools/${tool.slug}`} data-reveal="up" className={`${sfCard} hover:border-amber-500/60`}>
                        <div className="mb-6 flex items-start justify-between">
                          <div {...iconWell(tool.gradient, "h-12 w-12 rounded-2xl")}>
                            <Icon className="h-6 w-6" strokeWidth={2.25} />
                          </div>
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">Coming Soon</span>
                        </div>
                        <h3 className="text-lg font-medium text-theme-heading transition-colors group-hover:text-accent">{tool.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-theme-muted">{tool.shortDescription}</p>
                        <span className="mt-4 text-sm font-medium text-accent">Join waitlist →</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          {SEO_SECTIONS.map((s) => (
            <div key={s.heading} data-reveal="up">
              <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-base leading-[1.8] text-theme-muted sm:text-lg">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card spotlight relative overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10 sm:py-16" data-reveal="scale">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
            <h2 className="relative text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-4xl">Explore More Free Tools</h2>
            <p className="section-lede relative mx-auto mt-4 max-w-xl">
              Calculators, PDF utilities, SEO tools, and more — all free and browser-based.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/tools" size="lg" icon>Browse All Tools</Button>
              <Button href="/blog" variant="secondary" size="lg">Read Guides</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

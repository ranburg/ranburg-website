import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SALESFORCE_TOOL_SECTIONS } from "@/lib/salesforceToolsHub";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getComingSoonTool } from "@/lib/toolComingSoonConfig";
import { getToolIcon } from "@/lib/toolIcons";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

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
      "Ranburg LLP — a Salesforce consulting firm based in Jaipur, India — built this free Salesforce tool hub for the global community. Whether you configure Revenue Cloud CPQ, maintain OmniStudio Integration Procedures, or support Sales Cloud operations, these utilities run entirely in your browser with no data uploaded to our servers.",
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
      "Quote-to-cash teams use the Revenue Cloud pricing calculator to model scenarios before CPQ configuration sessions. OmniStudio practitioners leverage expression builders for FlexCard and Integration Procedure development. Ranburg consultants use these same tools on client engagements across telecommunications, insurance, and B2B software verticals.",
      "Explore our Revenue Cloud and OmniStudio consulting services when you need implementation partners — not just utilities.",
    ],
  },
];

export default function SalesforceToolsHubPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Salesforce Tool Hub</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-theme-heading sm:text-5xl">
            Free <span className="text-gradient-accent">Salesforce</span> Developer & Admin Tools
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-theme-muted">
            Salesforce productivity tools for formula builders, query builders, Apex helpers, and admin utilities —
            built by certified Ranburg consultants. No signup required.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" icon>Discuss Your Salesforce Project</Button>
            <Button href="/services/salesforce-development" variant="outline">Salesforce Development Services</Button>
          </div>
        </div>
      </section>

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
                <h2 className="text-2xl font-bold text-theme-heading">{section.label}</h2>
                <p className="mt-2 max-w-2xl text-theme-muted">{section.description}</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {liveSlugs.map((slug) => {
                    const tool = getToolBySlug(slug);
                    if (!tool) return null;
                    const Icon = getToolIcon(tool.icon);
                    return (
                      <Link key={slug} href={`/tools/${tool.slug}`} className="glass-card group flex h-full flex-col p-6 hover:border-accent/30">
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-theme-heading group-hover:text-accent">{tool.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-theme-muted">{tool.shortDescription}</p>
                        <span className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                          Open Tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    );
                  })}
                  {comingSlugs.map((slug) => {
                    const tool = getComingSoonTool(slug);
                    if (!tool) return null;
                    const Icon = getToolIcon(tool.icon);
                    return (
                      <Link key={slug} href={`/tools/${tool.slug}`} className="glass-card group flex h-full flex-col p-6 hover:border-amber-500/30">
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} opacity-80`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Coming Soon</span>
                        <h3 className="mt-1 text-lg font-bold text-theme-heading group-hover:text-accent">{tool.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-theme-muted">{tool.shortDescription}</p>
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

      <section className="border-t border-theme-subtle py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          {SEO_SECTIONS.map((s) => (
            <div key={s.heading}>
              <h2 className="text-2xl font-bold text-theme-heading">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-theme-muted">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 text-center">
            <h2 className="text-2xl font-bold text-theme-heading">Need Expert Salesforce Help?</h2>
            <p className="mx-auto mt-4 max-w-xl text-theme-muted">
              Ranburg LLP provides OmniStudio, Revenue Cloud, Industries Cloud, LWC, and integration services.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg" icon>Schedule Consultation</Button>
              <Button href="/case-studies" variant="outline" size="lg">View Case Studies</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

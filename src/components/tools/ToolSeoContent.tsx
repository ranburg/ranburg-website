import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";
import { getToolBySlug } from "@/lib/toolsConfig";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface ToolSeoContentProps {
  tool: ToolConfig;
}

/**
 * Server-rendered SEO body using native <details>.
 * Content stays in the HTML for crawlers even when sections are closed.
 */
export default function ToolSeoContent({ tool }: ToolSeoContentProps) {
  const seo = generateToolSeoSections(tool);
  const relatedTools = seo.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolConfig => Boolean(t));

  return (
    <article className="mt-14 space-y-3 border-t border-theme-subtle pt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm font-medium text-theme-subtle">Learn more about this tool</p>
        <p className="text-xs text-theme-subtle">
          Created by Ranburg · Updated {seo.lastUpdated}
        </p>
      </div>

      <SeoDetails title={`What is the ${tool.title}?`} open>
        {seo.whatIs.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
      </SeoDetails>

      <SeoDetails title={`Why use ${tool.title}?`} open>
        {seo.whyUse.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
      </SeoDetails>

      <SeoDetails title={`How to use ${tool.title}`} open>
        {seo.howItWorks.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
        <h3 id="how-to-use" className="mt-6 scroll-mt-28 text-base font-semibold text-theme-heading">
          Step-by-step
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-theme-muted">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </SeoDetails>

      {seo.comparison && (
        <SeoDetails title={seo.comparison.caption} open>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <caption className="sr-only">{seo.comparison.caption}</caption>
              <thead>
                <tr className="border-b border-theme-subtle">
                  <th scope="col" className="py-2 pr-3 font-semibold text-theme-heading">
                    Feature
                  </th>
                  <th scope="col" className="py-2 px-3 font-semibold text-theme-heading">
                    {seo.comparison.leftLabel}
                  </th>
                  <th scope="col" className="py-2 pl-3 font-semibold text-theme-heading">
                    {seo.comparison.rightLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {seo.comparison.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-theme-subtle/70">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-theme-heading">
                      {row.feature}
                    </th>
                    <td className="py-2.5 px-3 text-theme-muted">{row.left}</td>
                    <td className="py-2.5 pl-3 text-theme-muted">{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SeoDetails>
      )}

      <SeoDetails title="Examples">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.examples.map((ex) => (
            <li key={ex} className="leading-relaxed">
              {ex}
            </li>
          ))}
        </ul>
      </SeoDetails>

      <SeoDetails title="Benefits">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.benefits.map((b) => (
            <li key={b} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      </SeoDetails>

      <SeoDetails title="Common use cases">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.useCases.map((u) => (
            <li key={u} className="leading-relaxed">
              {u}
            </li>
          ))}
        </ul>
      </SeoDetails>

      <SeoDetails title="Supported devices & compatibility">
        <p className="leading-relaxed text-theme-muted">{seo.compatibility}</p>
      </SeoDetails>

      <SeoDetails title="Common issues & tips">
        <p className="leading-relaxed text-theme-muted">{seo.commonIssues}</p>
      </SeoDetails>

      <SeoDetails title="Privacy & security">
        <p className="leading-relaxed text-theme-muted">{seo.privacy}</p>
        <p className="mt-4 text-sm text-theme-muted">
          Read our{" "}
          <Link href="/privacy" className="font-medium text-accent hover:underline">
            Privacy Policy
          </Link>
          ,{" "}
          <Link href="/terms" className="font-medium text-accent hover:underline">
            Terms
          </Link>
          , and{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact
          </Link>{" "}
          pages for full details.
        </p>
      </SeoDetails>

      <SeoDetails title="Technical reference">
        <p className="leading-relaxed text-theme-muted">{tool.formula}</p>
      </SeoDetails>

      {relatedTools.length > 0 && (
        <SeoDetails title="Related tools" open>
          <p className="mb-3 text-sm text-theme-muted">
            Continue your workflow with these free Ranburg tools (no signup):
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relatedTools.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/tools/${related.slug}`}
                  prefetch
                  className="block rounded-lg border border-theme-subtle px-3 py-2.5 text-sm font-medium text-theme-heading transition-colors hover:border-accent hover:text-accent"
                >
                  {related.title}
                  <span className="mt-0.5 block text-xs font-normal text-theme-muted">
                    {related.shortDescription}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-theme-muted">
            Browse the full{" "}
            <Link href="/tools" className="font-medium text-accent hover:underline">
              tools directory
            </Link>
            {" "}or category hubs for more converters, calculators, and utilities.
          </p>
        </SeoDetails>
      )}

      <section
        className="overflow-hidden rounded-xl border border-theme-subtle"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="px-5 py-4">
          <h2 className="text-lg font-bold text-theme-heading sm:text-xl">Frequently Asked Questions</h2>
        </div>
        <div className="border-t border-theme-subtle">
          {seo.faq.map((item, i) => (
            <details
              key={i}
              className="group border-b border-theme-subtle last:border-b-0"
              open={i < 2}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-theme-heading" itemProp="name">
                  {item.question}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-theme-muted transition-transform group-open:rotate-180" />
              </summary>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p className="border-t border-theme-subtle px-5 py-4 text-sm leading-relaxed text-theme-muted" itemProp="text">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <AdPlaceholder placement="after-faq" />
    </article>
  );
}

function SeoDetails({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group overflow-hidden rounded-xl border border-theme-subtle">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left marker:content-none [&::-webkit-details-marker]:hidden">
        <h2 className="text-lg font-bold text-theme-heading sm:text-xl">{title}</h2>
        <ChevronDown className="h-5 w-5 shrink-0 text-theme-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-theme-subtle px-5 py-5">{children}</div>
    </details>
  );
}

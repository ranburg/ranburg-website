import { ChevronDown } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";
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

  return (
    <article className="mt-14 space-y-3 border-t border-theme-subtle pt-10">
      <p className="mb-4 text-sm font-medium text-theme-subtle">Learn more about this tool</p>

      <SeoDetails title={`What is the ${tool.title}?`} open>
        {seo.whatIs.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
      </SeoDetails>

      <SeoDetails title="How It Works" open>
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

      <SeoDetails title="Common Use Cases">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.useCases.map((u) => (
            <li key={u} className="leading-relaxed">
              {u}
            </li>
          ))}
        </ul>
      </SeoDetails>

      <SeoDetails title="Technical Reference">
        <p className="leading-relaxed text-theme-muted">{tool.formula}</p>
      </SeoDetails>

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
              open={i === 0}
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

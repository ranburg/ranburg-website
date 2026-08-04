import { Lightbulb } from "lucide-react";
import { TOOL_WORKED_EXAMPLES } from "@/lib/seoGrowthConfig";

/** Surfaces a unique worked example above the fold on priority tools. */
export default function WorkedExampleBanner({ slug }: { slug: string }) {
  const examples = TOOL_WORKED_EXAMPLES[slug];
  if (!examples?.length) return null;

  return (
    <aside className="mb-6 rounded-xl border border-theme-subtle bg-theme-surface/40 px-4 py-3.5 sm:px-5">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Quick example
          </p>
          <p className="mt-1 text-sm leading-relaxed text-theme-muted">{examples[0]}</p>
          {examples.length > 1 && (
            <p className="mt-2 text-xs text-theme-subtle">
              More worked examples and FAQs are below the calculator.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

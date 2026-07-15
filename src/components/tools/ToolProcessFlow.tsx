import type { ToolConfig } from "@/lib/toolsConfig";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

interface ToolProcessFlowProps {
  tool: ToolConfig;
}

/** Short outcome labels derived from the last how-to step + category. */
function getExpectedOutcomes(tool: ToolConfig): string[] {
  const last = tool.howToUse[tool.howToUse.length - 1] ?? "Instant results you can copy or download";
  const outcomes = [last.replace(/\.$/, "")];

  switch (tool.category) {
    case "financial":
      outcomes.push("Clear numbers you can trust for planning decisions");
      break;
    case "developer":
      outcomes.push("Copy-ready output for your IDE or docs");
      break;
    case "salesforce":
      outcomes.push("Paste-ready Salesforce config or code snippets");
      break;
    case "productivity":
      outcomes.push("Ready-to-use tags, captions, or metrics");
      break;
    case "design":
      outcomes.push("Downloadable files or converted assets");
      break;
    default:
      outcomes.push("Results in seconds — no signup required");
  }

  if (tool.formula && tool.formula.length < 80) {
    outcomes.push(`Based on: ${tool.formula}`);
  }

  return outcomes.slice(0, 3);
}

export default function ToolProcessFlow({ tool }: ToolProcessFlowProps) {
  const steps = tool.howToUse.slice(0, 5);
  const outcomes = getExpectedOutcomes(tool);

  if (steps.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-theme-heading">
            How it works
          </h2>
          <span className="inline-flex items-center gap-1 text-xs text-theme-subtle">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            About {steps.length} steps · free · no signup
          </span>
        </div>

        <ol className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0">
          {steps.map((step, i) => (
            <li key={i} className="flex min-w-0 flex-1 items-stretch gap-2 sm:gap-0">
              <div className="flex min-w-0 flex-1 gap-3 rounded-xl border border-theme-subtle/80 bg-[var(--background)]/60 p-3 sm:mx-1">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${tool.gradient}`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Step {i + 1}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-theme-heading">{step}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="mt-6 hidden h-4 w-4 shrink-0 text-theme-subtle sm:mx-0.5 sm:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">What you&apos;ll get</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {outcomes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-theme-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

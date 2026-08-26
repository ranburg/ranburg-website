import type { ToolConfig } from "@/lib/toolsConfig";
import { CheckCircle2 } from "lucide-react";

interface ToolProcessFlowProps {
  tool: ToolConfig;
}

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

  return outcomes.slice(0, 3);
}

export default function ToolProcessFlow({ tool }: ToolProcessFlowProps) {
  const steps = tool.howToUse.slice(0, 5);
  const outcomes = getExpectedOutcomes(tool);
  if (steps.length === 0) return null;

  return (
    <details className="group mt-10 rounded-2xl border border-theme-subtle bg-theme-surface/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-theme-heading sm:px-5">
        <span>How this tool works</span>
        <span className="text-xs font-normal text-theme-subtle group-open:hidden">Show steps</span>
        <span className="hidden text-xs font-normal text-theme-subtle group-open:inline">Hide</span>
      </summary>
      <div className="border-t border-theme-subtle px-4 py-4 sm:px-5 sm:py-5">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-[var(--background)]/50 p-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${tool.gradient}`}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-snug text-theme-muted">{step}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {outcomes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-theme-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getRecommendedTools } from "@/lib/toolRecommendations";
import { getToolIcon } from "@/lib/toolIcons";

/** Compact post-tool CTA to encourage multi-page sessions (time-on-site). */
export default function ToolNextSteps({
  currentSlug,
  limit = 3,
}: {
  currentSlug: string;
  limit?: number;
}) {
  const next = getRecommendedTools(currentSlug, limit);
  if (next.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-accent/25 bg-accent/5 px-4 py-5 sm:px-5"
      aria-label="Try related tools next"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden />
        <h2 className="text-sm font-bold text-theme-heading sm:text-base">
          Done? Try these next
        </h2>
        <span className="text-xs text-theme-muted">Free · No signup</span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {next.map((tool) => {
          const Icon = getToolIcon(tool.icon);
          return (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                prefetch
                className="group flex items-center gap-3 rounded-lg border border-theme-subtle/80 bg-theme-surface/60 px-3 py-2.5 transition-colors hover:border-accent hover:bg-accent/5"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-theme-heading group-hover:text-accent">
                    {tool.title}
                  </span>
                  <span className="block truncate text-xs text-theme-muted">
                    {tool.shortDescription}
                  </span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-theme-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRecommendedTools } from "@/lib/toolRecommendations";
import type { ToolConfig } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getToolUseCountPlaceholder } from "@/lib/toolSeoGenerator";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";

interface ToolRecommendationsProps {
  currentSlug: string;
  limit?: number;
  layout?: "sidebar" | "grid";
}

export default function ToolRecommendations({
  currentSlug,
  limit = 8,
  layout = "sidebar",
}: ToolRecommendationsProps) {
  const recommended = getRecommendedTools(currentSlug, limit);

  if (layout === "grid") {
    return (
      <section className="mt-16 border-t border-theme-subtle pt-16">
        <h2 className="text-2xl font-bold text-theme-heading">Related Tools</h2>
        <p className="mt-2 text-theme-muted">Explore more free utilities in the same category</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((tool: ToolConfig) => (
            <RelatedToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <aside className="space-y-4">
      <h3 className="text-lg font-bold text-theme-heading">Related Tools</h3>
      <p className="text-sm text-slate-500">More utilities you might find helpful</p>
      <div className="space-y-3">
        {recommended.map((tool: ToolConfig) => (
          <RelatedToolCard key={tool.slug} tool={tool} compact />
        ))}
      </div>
    </aside>
  );
}

function RelatedToolCard({ tool, compact }: { tool: ToolConfig; compact?: boolean }) {
  const Icon = getToolIcon(tool.icon);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      prefetch
      className="glass-card group flex items-center gap-4 p-4 transition-all hover:border-accent/30"
    >
      <div className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} ${compact ? "h-10 w-10" : "h-11 w-11"}`}>
        <Icon className={`text-white ${compact ? "h-5 w-5" : "h-5 w-5"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-theme-heading group-hover:text-accent">{tool.title}</p>
        {!compact && (
          <p className="truncate text-xs text-slate-500">{tool.shortDescription}</p>
        )}
        <p className="mt-0.5 text-xs text-theme-subtle">
          {seoCat?.label ?? tool.badge} · {getToolUseCountPlaceholder(tool.slug)}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}

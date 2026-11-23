import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getRecommendedTools } from "@/lib/toolRecommendations";
import type { ToolConfig } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getToolUseCountPlaceholder } from "@/lib/toolSeoGenerator";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { iconWell } from "@/components/tools/iconWell";

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
        <h2 className="section-heading" data-reveal="up">Related Tools</h2>
        <p className="section-lede mt-3" data-reveal="up">
          Keep going — open another free tool to continue your workflow
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal="up">
          {recommended.map((tool: ToolConfig) => (
            <RelatedToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <aside className="space-y-4">
      <h3 className="text-lg font-medium text-theme-heading">Related Tools</h3>
      <p className="text-sm text-theme-muted">More utilities you might find helpful</p>
      <div className="space-y-3">
        {recommended.map((tool: ToolConfig) => (
          <RelatedToolCard key={tool.slug} tool={tool} compact />
        ))}
      </div>
    </aside>
  );
}

function RelatedToolCard({ tool, compact }: { tool: ToolConfig; compact?: boolean }) {
  const Icon = getToolIcon(tool.icon, tool.slug);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      prefetch={false}
      className="card spotlight group flex items-center gap-4 p-4 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-accent/50"
    >
      <div {...iconWell(tool.gradient, compact ? "h-10 w-10 rounded-xl" : "h-11 w-11 rounded-xl")}>
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-theme-heading group-hover:text-accent">{tool.title}</p>
        {!compact && (
          <p className="truncate text-xs text-theme-muted">{tool.shortDescription}</p>
        )}
        <p className="mt-0.5 text-xs text-theme-subtle">
          {seoCat?.label ?? tool.badge} · {getToolUseCountPlaceholder(tool.slug)}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-theme-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180" />
    </Link>
  );
}

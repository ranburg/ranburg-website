import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRecommendedTools, type ToolConfig } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";

interface ToolRecommendationsProps {
  currentSlug: string;
}

export default function ToolRecommendations({ currentSlug }: ToolRecommendationsProps) {
  const recommended = getRecommendedTools(currentSlug, 3);

  return (
    <aside className="space-y-4">
      <h3 className="text-lg font-bold text-white">Recommended Utilities</h3>
      <p className="text-sm text-slate-500">Other tools you might find helpful</p>
      <div className="space-y-3">
        {recommended.map((tool: ToolConfig) => {
          const Icon = getToolIcon(tool.icon);
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="glass-card group flex items-center gap-4 p-4 transition-all hover:border-accent/30"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white group-hover:text-accent">
                  {tool.title}
                </p>
                <p className="truncate text-xs text-slate-500">{tool.badge}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { getToolUseCountPlaceholder } from "@/lib/toolSeoGenerator";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  slug: string;
  showCategory?: boolean;
  showUseCount?: boolean;
  className?: string;
}

export default function ToolCard({ slug, showCategory = true, showUseCount = true, className }: ToolCardProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const Icon = getToolIcon(tool.icon);
  const cat = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);

  return (
    <Link href={`/tools/${tool.slug}`} className={cn("group block h-full", className)}>
      <article className="glass-card relative flex h-full flex-col overflow-hidden p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:shadow-lg">
        <div
          className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
        />
        <div className="relative flex flex-1 flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
              <Icon className="h-6 w-6 text-white" aria-hidden />
            </div>
            {showUseCount && (
              <span className="rounded-full border border-theme-subtle bg-theme-surface px-2.5 py-1 text-xs text-theme-subtle">
                {getToolUseCountPlaceholder(tool.slug)}
              </span>
            )}
          </div>

          {showCategory && (seoCat || cat) && (
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {seoCat?.label ?? cat?.label}
            </span>
          )}

          <h3 className="mt-1 text-lg font-bold text-theme-heading transition-colors group-hover:text-accent">
            {tool.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-theme-muted">
            {tool.shortDescription}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Open Tool
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}

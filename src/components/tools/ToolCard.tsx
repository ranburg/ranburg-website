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
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface/40 p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-theme-surface/70 group-hover:shadow-md">
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}>
              <Icon className="h-5 w-5 text-white" aria-hidden />
            </div>
            {showUseCount && (
              <span className="text-xs text-theme-subtle">{getToolUseCountPlaceholder(tool.slug)}</span>
            )}
          </div>

          {showCategory && (seoCat || cat) && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              {seoCat?.label ?? cat?.label}
            </span>
          )}

          <h3 className="mt-1 text-base font-bold leading-snug text-theme-heading transition-colors group-hover:text-accent sm:text-lg">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-theme-muted">
            {tool.shortDescription}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Open
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}

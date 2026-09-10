import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { getToolUseCountPlaceholder } from "@/lib/toolSeoGenerator";
import { cn } from "@/lib/utils";
import { iconWell } from "@/components/tools/iconWell";

interface ToolCardProps {
  slug: string;
  showCategory?: boolean;
  showUseCount?: boolean;
  className?: string;
}

export default function ToolCard({ slug, showCategory = true, showUseCount = true, className }: ToolCardProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const Icon = getToolIcon(tool.icon, tool.slug);
  const cat = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);

  return (
    <Link href={`/tools/${tool.slug}`} prefetch={false} className={cn("group block h-full", className)}>
      <article className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-theme bg-[var(--surface-elevated)] p-5 shadow-[0_12px_32px_-16px_rgb(var(--shadow-color)/0.28)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-accent/80 group-hover:shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent)_30%,transparent),0_24px_48px_-16px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-[0.11] transition-opacity duration-300 group-hover:opacity-[0.2]`}
        />
        <div
          className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${tool.gradient} opacity-35 blur-2xl transition-opacity group-hover:opacity-55`}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div {...iconWell(tool.gradient, "h-14 w-14 rounded-2xl")}>
              <Icon className="h-7 w-7 drop-shadow" strokeWidth={2.25} aria-hidden />
            </div>
            {showUseCount && (
              <span className="rounded-full bg-theme-surface px-2 py-0.5 text-[11px] font-medium text-theme-subtle">
                {getToolUseCountPlaceholder(tool.slug)}
              </span>
            )}
          </div>

          {showCategory && (seoCat || cat) && (
            <span className="mb-2 inline-flex w-fit rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              {seoCat?.label ?? cat?.label}
            </span>
          )}

          <h3 className="text-base font-bold leading-snug text-theme-heading transition-colors group-hover:text-accent sm:text-lg">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-theme-muted">
            {tool.shortDescription}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Open tool
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}

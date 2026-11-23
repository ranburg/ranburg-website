import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { getToolUseCountPlaceholder } from "@/lib/toolSeoGenerator";
import { cn } from "@/lib/utils";
import { gradientStops, iconWell } from "@/components/tools/iconWell";

interface ToolCardProps {
  slug: string;
  showCategory?: boolean;
  showUseCount?: boolean;
  className?: string;
  /** Position in a grid — enables scroll-reveal with a per-column stagger. */
  revealIndex?: number;
}

export default function ToolCard({
  slug,
  showCategory = true,
  showUseCount = true,
  className,
  revealIndex,
}: ToolCardProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const Icon = getToolIcon(tool.icon, tool.slug);
  const cat = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);
  const glow = gradientStops(tool.gradient)[0];
  const reveal =
    revealIndex === undefined
      ? {}
      : {
          "data-reveal": "up",
          style: { "--reveal-delay": `${(revealIndex % 3) * 80}ms` } as CSSProperties,
        };

  return (
    <Link href={`/tools/${tool.slug}`} prefetch={false} className={cn("group block h-full", className)} {...reveal}>
      <article className="card spotlight relative flex h-full min-h-[220px] flex-col overflow-hidden p-5 transition-[border-color,transform,box-shadow] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:shadow-[0_28px_60px_-34px_color-mix(in_srgb,var(--accent)_70%,transparent)] sm:p-6">
        <div
          className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
          style={{ backgroundColor: glow }}
          aria-hidden
        />

        <div className="relative flex flex-1 flex-col">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div {...iconWell(tool.gradient, "h-12 w-12 rounded-2xl transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110")}>
              <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
            </div>
            <div className="flex items-center gap-2">
              {showUseCount && (
                <span className="rounded-full bg-theme-surface px-2.5 py-1 text-[11px] font-medium text-theme-subtle">
                  {getToolUseCountPlaceholder(tool.slug)}
                </span>
              )}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>

          {showCategory && (seoCat || cat) && (
            <span className="mb-2 inline-flex w-fit items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
              {seoCat?.label ?? cat?.label}
            </span>
          )}

          <h3 className="text-base font-medium leading-snug text-theme-heading transition-colors duration-300 group-hover:text-accent sm:text-lg">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-theme-muted">
            {tool.shortDescription}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-theme-subtle transition-colors duration-300 group-hover:text-accent">
            Open tool
          </span>
        </div>
      </article>
    </Link>
  );
}

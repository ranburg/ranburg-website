import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SearchHeroPanelProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  search: ReactNode;
  belowSearch?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** Shared stage for catalog titles + search — homepage, /tools, and category hubs. */
export default function SearchHeroPanel({
  eyebrow,
  title,
  subtitle,
  search,
  belowSearch,
  aside,
  className,
}: SearchHeroPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-theme shadow-[0_28px_70px_-32px_rgba(15,118,110,0.55)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-[var(--surface-elevated)] to-amber-400/20" />
        <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-28 right-[-10%] h-96 w-96 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-35" />
      </div>

      <div
        className={cn(
          "relative grid gap-8 p-6 sm:p-8 lg:p-12",
          aside && "lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-center"
        )}
      >
        <div className="min-w-0">
          {eyebrow}
          {title}
          {subtitle}
          <div className="mt-6 rounded-2xl border border-theme bg-[var(--surface-elevated)]/95 p-3 shadow-xl backdrop-blur-md sm:p-4">
            {search}
          </div>
          {belowSearch}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </div>
  );
}

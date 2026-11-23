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
    <div className={cn("card spotlight relative overflow-visible rounded-[1.75rem]", className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 right-[-8%] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-60 mask-fade-b" />
      </div>

      <div
        className={cn(
          "relative grid gap-8 p-6 sm:p-9 lg:p-12",
          aside && "lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-center"
        )}
      >
        <div className="min-w-0">
          {eyebrow}
          {title}
          {subtitle}
          <div className="mt-7 rounded-2xl border border-theme-subtle bg-[var(--surface)] p-3 sm:p-4">
            {search}
          </div>
          {belowSearch}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </div>
  );
}

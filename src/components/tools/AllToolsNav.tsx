"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getToolsByPopularity } from "@/lib/toolPopularity";
import { Search, ChevronDown, Wrench } from "lucide-react";

interface AllToolsNavProps {
  activeSlug?: string;
  className?: string;
  variant?: "sidebar" | "compact";
}

export default function AllToolsNav({
  activeSlug,
  className,
  variant = "sidebar",
}: AllToolsNavProps) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(false);

  const currentSlug =
    activeSlug ?? (pathname?.startsWith("/tools/") ? pathname.split("/tools/")[1]?.split("/")[0] : undefined);

  const tools = useMemo(() => getToolsByPopularity(), []);
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) => t.title.toLowerCase().includes(q) || t.slug.includes(q)
    );
  }, [tools, filter]);

  if (variant === "compact") {
    return (
      <div className={cn("lg:hidden", className)}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-xl border border-theme-subtle bg-theme-surface px-4 py-3 text-sm font-medium text-theme-heading"
        >
          <span className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-accent" />
            Browse all tools ({tools.length})
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
        {expanded && (
          <div className="mt-2 max-h-64 overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface">
            <div className="border-b border-theme-subtle p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter tools…"
                  className="w-full rounded-lg bg-theme-bg py-2 pl-9 pr-3 text-sm outline-none ring-accent focus:ring-1"
                />
              </div>
            </div>
            <nav className="max-h-52 overflow-y-auto p-2">
              {filtered.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  onClick={() => setExpanded(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    currentSlug === t.slug
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-theme-muted hover:bg-theme-bg hover:text-theme-heading"
                  )}
                >
                  {t.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className={cn("hidden lg:block", className)}>
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface/50">
        <div className="border-b border-theme-subtle p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Wrench className="h-3.5 w-3.5" />
            All Tools
          </p>
          <p className="mt-1 text-xs text-theme-subtle">Ordered by popularity</p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter…"
              className="w-full rounded-lg border border-theme-subtle bg-theme-bg py-2 pl-9 pr-3 text-sm outline-none focus:border-accent/50"
            />
          </div>
        </div>
        <nav className="max-h-[calc(100vh-14rem)] overflow-y-auto p-2" aria-label="All tools">
          <Link
            href="/tools"
            className={cn(
              "mb-1 block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/tools"
                ? "bg-accent/10 text-accent"
                : "text-theme-muted hover:bg-theme-bg hover:text-theme-heading"
            )}
          >
            Tools Hub
          </Link>
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                currentSlug === t.slug
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-theme-muted hover:bg-theme-bg hover:text-theme-heading"
              )}
            >
              {t.title}
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-theme-subtle">No tools match</p>
          )}
        </nav>
      </div>
    </aside>
  );
}

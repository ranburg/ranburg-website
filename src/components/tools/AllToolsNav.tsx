"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getToolsByPopularity, HERO_TOOL_SLUGS } from "@/lib/toolPopularity";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { Search, ChevronDown, Wrench, Sparkles } from "lucide-react";

interface AllToolsNavProps {
  activeSlug?: string;
  className?: string;
  variant?: "sidebar" | "compact";
}

function NavLink({
  slug,
  title,
  currentSlug,
  onClick,
  hero,
}: {
  slug: string;
  title: string;
  currentSlug?: string;
  onClick?: () => void;
  hero?: boolean;
}) {
  const tool = hero ? getToolBySlug(slug) : null;
  const Icon = tool ? getToolIcon(tool.icon) : null;

  return (
    <Link
      href={`/tools/${slug}`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        currentSlug === slug
          ? "bg-accent/10 font-medium text-accent"
          : hero
            ? "font-medium text-theme-heading hover:bg-accent/5 hover:text-accent"
            : "text-theme-muted hover:bg-theme-bg hover:text-theme-heading"
      )}
    >
      {hero && Icon && tool && (
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient}`}>
          <Icon className="h-3 w-3 text-white" />
        </span>
      )}
      <span className="truncate">{title}</span>
    </Link>
  );
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
  const heroSet = useMemo(() => new Set(HERO_TOOL_SLUGS), []);
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = tools.filter((t) => !heroSet.has(t.slug));
    if (!q) return list;
    return list.filter(
      (t) => t.title.toLowerCase().includes(q) || t.slug.includes(q)
    );
  }, [tools, filter, heroSet]);

  const heroTools = useMemo(
    () => HERO_TOOL_SLUGS.map((slug) => getToolBySlug(slug)).filter(Boolean),
    []
  );

  const showHero = !filter.trim();

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
          <div className="mt-2 max-h-80 overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface">
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
            <nav className="max-h-64 overflow-y-auto p-2">
              {showHero && (
                <div className="mb-2 border-b border-theme-subtle pb-2">
                  <p className="mb-1 flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                    <Sparkles className="h-3 w-3" /> Hero Tools
                  </p>
                  {heroTools.map((t) => (
                    <NavLink
                      key={t!.slug}
                      slug={t!.slug}
                      title={t!.title}
                      currentSlug={currentSlug}
                      onClick={() => setExpanded(false)}
                      hero
                    />
                  ))}
                </div>
              )}
              {filtered.map((t) => (
                <NavLink
                  key={t.slug}
                  slug={t.slug}
                  title={t.title}
                  currentSlug={currentSlug}
                  onClick={() => setExpanded(false)}
                />
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

          {showHero && (
            <div className="mb-2 rounded-lg border border-accent/15 bg-accent/5 p-1">
              <p className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="h-3 w-3" />
                Hero Tools
              </p>
              {heroTools.map((t) => (
                <NavLink key={t!.slug} slug={t!.slug} title={t!.title} currentSlug={currentSlug} hero />
              ))}
            </div>
          )}

          {filtered.map((t) => (
            <NavLink key={t.slug} slug={t.slug} title={t.title} currentSlug={currentSlug} />
          ))}
          {filtered.length === 0 && filter.trim() && (
            <p className="px-3 py-4 text-center text-sm text-theme-subtle">No tools match</p>
          )}
        </nav>
      </div>
    </aside>
  );
}

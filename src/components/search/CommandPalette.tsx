"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Search, X, Command } from "lucide-react";
import { searchToolsDetailed } from "@/lib/toolSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { SEARCH_SUGGESTIONS } from "@/lib/toolsHubConfig";
import { getRecentSearches, getPopularSearches, trackSearch } from "@/lib/toolAnalytics";
import { TOOL_CATEGORIES, type ToolCategoryId } from "@/lib/toolsConfig";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-accent/20 px-0.5 text-accent">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategoryId | "all">("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    } else {
      setRecentSearches(getRecentSearches(5));
      setPopularSearches(getPopularSearches());
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(
    () => searchToolsDetailed(query, category).slice(0, 10),
    [query, category]
  );
  const hasQuery = query.trim().length > 0;

  const selectResult = useCallback(
    (href: string) => {
      if (query.trim()) trackSearch(query);
      onClose();
    },
    [query, onClose]
  );

  useEffect(() => {
    if (!open || !hasQuery) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        const href = `/tools/${results[activeIndex].tool.slug}`;
        if (query.trim()) trackSearch(query);
        window.location.href = href;
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasQuery, results, activeIndex, query, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-start sm:p-4 sm:pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="dropdown-panel flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:max-h-[85dvh] sm:max-w-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-theme-subtle px-4">
          <Search className="h-4 w-4 shrink-0 text-theme-subtle" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search tools by name, category, or description…"
            className="flex-1 bg-transparent py-4 text-sm text-theme-heading placeholder:text-theme-subtle focus:outline-none"
            role="combobox"
            aria-expanded={hasQuery}
          />
          <kbd className="hidden rounded border border-theme-subtle px-1.5 py-0.5 text-xs text-theme-subtle sm:inline">Esc</kbd>
          <button type="button" onClick={onClose} className="text-theme-subtle hover:text-theme-heading" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-theme-subtle px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                category === "all" ? "bg-accent text-white" : "text-theme-muted hover:text-accent"
              )}
            >
              All
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  category === cat.id ? "bg-accent text-white" : "text-theme-muted hover:text-accent"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
        {!hasQuery && (
          <div className="border-b border-theme-subtle px-4 py-3 space-y-3">
            {recentSearches.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-theme-subtle">Recent searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-theme-subtle px-3 py-1 text-xs text-theme-muted hover:border-accent/40 hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-medium text-theme-subtle">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-theme-subtle px-3 py-1 text-xs text-theme-muted hover:border-accent/40 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-theme-subtle">Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-theme-subtle px-3 py-1 text-xs text-theme-muted hover:border-accent/40 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ul className="p-2" role="listbox">
          {hasQuery && results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-theme-muted">No tools found. Try another keyword.</li>
          )}
          {results.map(({ tool }, i) => {
            const Icon = getToolIcon(tool.icon);
            return (
              <li key={tool.slug} role="option" aria-selected={i === activeIndex}>
                <Link
                  href={`/tools/${tool.slug}`}
                  prefetch
                  onClick={() => selectResult(`/tools/${tool.slug}`)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5",
                    i === activeIndex ? "bg-accent/10" : "hover:bg-theme-surface"
                  )}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-theme-heading">
                      <HighlightText text={tool.title} query={query} />
                    </p>
                    <p className="truncate text-xs text-theme-subtle">
                      <HighlightText text={tool.shortDescription} query={query} />
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{tool.badge}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>

        <div className="hidden items-center gap-2 border-t border-theme-subtle px-4 py-2 text-xs text-theme-subtle sm:flex">
          <Command className="h-3 w-3" />
          <span>Ctrl+K or ⌘+K · ↑↓ navigate · Enter select</span>
        </div>
      </div>
    </div>
  );
}

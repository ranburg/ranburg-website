"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Search, X, Command, FileText, Wrench } from "lucide-react";
import { globalSearch, type GlobalSearchFilter, type SearchResult } from "@/lib/globalSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { SEARCH_SUGGESTIONS } from "@/lib/toolsHubConfig";
import { getRecentSearches, getPopularSearches, trackSearch } from "@/lib/toolAnalytics";
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

function ResultIcon({ result }: { result: SearchResult }) {
  if (result.type === "blog") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
        <FileText className="h-4 w-4 text-accent" />
      </div>
    );
  }
  if (result.type === "tool" && result.icon && result.gradient) {
    const Icon = getToolIcon(result.icon);
    return (
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${result.gradient}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-theme-surface">
      <Wrench className="h-4 w-4 text-theme-subtle" />
    </div>
  );
}

const FILTER_TABS: { id: GlobalSearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tool", label: "Tools" },
  { id: "blog", label: "Blogs" },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GlobalSearchFilter>("all");
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
    () => globalSearch(query, 12, filter),
    [query, filter]
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
        if (query.trim()) trackSearch(query);
        window.location.href = results[activeIndex].href;
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasQuery, results, activeIndex, query, onClose]);

  if (!open) return null;

  const emptyMessage =
    filter === "blog"
      ? "No blog posts found. Try another keyword."
      : filter === "tool"
        ? "No tools found. Try another keyword."
        : "No results found. Try another keyword.";

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
            placeholder="Search tools and blog posts…"
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
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilter(tab.id);
                  setActiveIndex(0);
                }}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  filter === tab.id ? "bg-accent text-white" : "text-theme-muted hover:text-accent"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!hasQuery && (
            <div className="space-y-3 border-b border-theme-subtle px-4 py-3">
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
              <li className="px-3 py-8 text-center text-sm text-theme-muted">{emptyMessage}</li>
            )}
            {results.map((result, i) => (
              <li key={`${result.type}-${result.href}`} role="option" aria-selected={i === activeIndex}>
                <Link
                  href={result.href}
                  prefetch
                  onClick={() => selectResult(result.href)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5",
                    i === activeIndex ? "bg-accent/10" : "hover:bg-theme-surface"
                  )}
                >
                  <ResultIcon result={result} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-theme-heading">
                      <HighlightText text={result.title} query={query} />
                    </p>
                    <p className="truncate text-xs text-theme-subtle">
                      <HighlightText text={result.description} query={query} />
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs",
                      result.type === "blog"
                        ? "bg-accent/10 text-accent"
                        : "bg-accent-emerald/10 text-accent-emerald"
                    )}
                  >
                    {result.badge}
                  </span>
                </Link>
              </li>
            ))}
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

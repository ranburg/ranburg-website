"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchToolsDetailed } from "@/lib/toolSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { SEARCH_SUGGESTIONS, SEARCH_TAGS } from "@/lib/toolsHubConfig";
import { getRecentSearches, getPopularSearches, trackSearch } from "@/lib/toolAnalytics";
import { TOOL_CATEGORIES, type ToolCategoryId } from "@/lib/toolsConfig";
import { cn } from "@/lib/utils";

interface ToolSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
  showResults?: boolean;
  maxResults?: number;
  value?: string;
  onQueryChange?: (query: string) => void;
  showSuggestions?: boolean;
  showTags?: boolean;
  compact?: boolean;
  enableKeyboardNav?: boolean;
  trackSearches?: boolean;
  showCategoryFilter?: boolean;
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

export default function ToolSearch({
  placeholder = "Search tools, calculators, Salesforce utilities…",
  className,
  onResultClick,
  showResults = true,
  maxResults = 8,
  value,
  onQueryChange,
  showSuggestions = false,
  showTags = false,
  compact = false,
  enableKeyboardNav = false,
  trackSearches = false,
  showCategoryFilter = false,
}: ToolSearchProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const [category, setCategory] = useState<ToolCategoryId | "all">("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [dropdownTop, setDropdownTop] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const query = value !== undefined ? value : internalQuery;
  const setQuery = (q: string) => {
    if (onQueryChange) onQueryChange(q);
    else setInternalQuery(q);
    setActiveIndex(0);
  };

  useEffect(() => {
    setRecentSearches(getRecentSearches(5));
    setPopularSearches(getPopularSearches());
  }, [query]);

  const results = useMemo(
    () => searchToolsDetailed(query, category).slice(0, maxResults),
    [query, category, maxResults]
  );
  const hasQuery = query.trim().length > 0;

  const updateDropdownPosition = useCallback(() => {
    if (!inputWrapRef.current || !isMobile) {
      setDropdownTop(null);
      return;
    }
    const rect = inputWrapRef.current.getBoundingClientRect();
    setDropdownTop(rect.bottom + 8);
  }, [isMobile]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!hasQuery || !isMobile) return;
    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [hasQuery, isMobile, updateDropdownPosition, query]);

  const selectResult = useCallback(
    (href: string) => {
      if (trackSearches && query.trim()) trackSearch(query);
      setQuery("");
      onResultClick?.();
    },
    [query, trackSearches, onResultClick]
  );

  useEffect(() => {
    if (!enableKeyboardNav || !hasQuery) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        window.location.href = `/tools/${results[activeIndex].tool.slug}`;
        selectResult(`/tools/${results[activeIndex].tool.slug}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableKeyboardNav, hasQuery, results, activeIndex, selectResult]);

  return (
    <div className={cn("relative", className)}>
      {showCategoryFilter && (
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              category === "all" ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted hover:text-accent"
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
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                category === cat.id ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted hover:text-accent"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {showTags && !hasQuery && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SEARCH_TAGS.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => setQuery(tag.query)}
              className="rounded-full border border-theme-subtle px-3 py-1 text-xs font-medium text-theme-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              #{tag.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative" ref={inputWrapRef}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={updateDropdownPosition}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border border-theme bg-theme-surface text-base text-theme-heading placeholder:text-theme-subtle focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 sm:text-sm",
            compact ? "py-2.5 pl-9 pr-9" : "py-3 pl-10 pr-10 sm:py-2.5"
          )}
          aria-label="Search tools"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded={showResults && hasQuery}
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-subtle hover:text-theme-heading"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!hasQuery && recentSearches.length > 0 && (
        <p className="mt-2 text-xs text-theme-subtle">
          Recent:{" "}
          {recentSearches.map((s, i) => (
            <button key={s} type="button" onClick={() => setQuery(s)} className="text-theme-muted hover:text-accent">
              {s}{i < recentSearches.length - 1 ? " · " : ""}
            </button>
          ))}
        </p>
      )}

      {showSuggestions && !hasQuery && (
        <p className="mt-2 text-xs text-theme-subtle">
          Popular: {popularSearches.slice(0, 6).join(" · ")}
        </p>
      )}

      {showResults && hasQuery && (() => {
        const dropdown = (
          <ul
            ref={listRef}
            className={cn(
              "z-[200] max-h-[min(50dvh,18rem)] overflow-y-auto overscroll-contain rounded-xl border border-theme-subtle bg-[var(--dropdown-bg)] p-2 shadow-xl",
              isMobile && dropdownTop !== null
                ? "fixed left-4 right-4"
                : "absolute left-0 right-0 top-full mt-2"
            )}
            style={isMobile && dropdownTop !== null ? { top: dropdownTop } : undefined}
            role="listbox"
          >
            {results.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-theme-muted">No tools found. Try another keyword.</li>
            ) : (
              results.map(({ tool }, i) => {
                const Icon = getToolIcon(tool.icon);
                return (
                  <li key={tool.slug} role="option" aria-selected={i === activeIndex}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      onClick={() => {
                        if (trackSearches) trackSearch(query);
                        setQuery("");
                        onResultClick?.();
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors sm:py-2.5",
                        i === activeIndex ? "bg-accent/10" : "hover:bg-theme-surface active:bg-theme-surface"
                      )}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-theme-heading">
                          <HighlightText text={tool.title} query={query} />
                        </p>
                        <p className="truncate text-xs text-theme-subtle">
                          <HighlightText text={tool.shortDescription} query={query} />
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        );
        return isMobile && typeof document !== "undefined"
          ? createPortal(dropdown, document.body)
          : dropdown;
      })()}
    </div>
  );
}

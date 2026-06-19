"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchTools } from "@/lib/toolSearch";
import { getToolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/utils";

interface ToolSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
  showResults?: boolean;
  maxResults?: number;
  value?: string;
  onQueryChange?: (query: string) => void;
}

export default function ToolSearch({
  placeholder = "Search tools by name, category, or keyword…",
  className,
  onResultClick,
  showResults = true,
  maxResults = 8,
  value,
  onQueryChange,
}: ToolSearchProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = value !== undefined ? value : internalQuery;
  const setQuery = (q: string) => {
    if (onQueryChange) onQueryChange(q);
    else setInternalQuery(q);
  };
  const results = useMemo(() => searchTools(query).slice(0, maxResults), [query, maxResults]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-theme bg-theme-surface py-2.5 pl-10 pr-10 text-sm text-theme-heading placeholder:text-theme-subtle focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          aria-label="Search tools"
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

      {showResults && hasQuery && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-theme-subtle bg-[var(--dropdown-bg)] p-2 shadow-xl">
          {results.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-theme-muted">No tools found for &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((tool) => {
              const Icon = getToolIcon(tool.icon);
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    onClick={() => {
                      setQuery("");
                      onResultClick?.();
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-theme-surface"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-theme-heading">{tool.title}</p>
                      <p className="truncate text-xs text-theme-subtle">{tool.shortDescription}</p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

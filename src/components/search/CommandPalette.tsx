"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, Command } from "lucide-react";
import { globalSearch } from "@/lib/globalSearch";
import { SEARCH_SUGGESTIONS } from "@/lib/toolsHubConfig";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => globalSearch(query, 10), [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="dropdown-panel w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-theme-subtle px-4">
          <Search className="h-4 w-4 shrink-0 text-theme-subtle" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, services, blog, case studies…"
            className="flex-1 bg-transparent py-4 text-sm text-theme-heading placeholder:text-theme-subtle focus:outline-none"
          />
          <kbd className="hidden rounded border border-theme-subtle px-1.5 py-0.5 text-xs text-theme-subtle sm:inline">Esc</kbd>
          <button type="button" onClick={onClose} className="text-theme-subtle hover:text-theme-heading" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!query && (
          <div className="border-b border-theme-subtle px-4 py-3">
            <p className="mb-2 text-xs font-medium text-theme-subtle">Suggested searches</p>
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
        )}

        <ul className="max-h-80 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-theme-muted">No tools found. Try another keyword.</li>
          )}
          {results.map((r) => (
            <li key={`${r.type}-${r.href}`}>
              <Link
                href={r.href}
                onClick={onClose}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-theme-surface"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-theme-heading">{r.title}</p>
                  <p className="truncate text-xs text-theme-subtle">{r.description}</p>
                </div>
                {r.badge && (
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{r.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 border-t border-theme-subtle px-4 py-2 text-xs text-theme-subtle">
          <Command className="h-3 w-3" />
          <span>Ctrl+K or ⌘+K to open anywhere</span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen, close: () => setOpen(false) };
}

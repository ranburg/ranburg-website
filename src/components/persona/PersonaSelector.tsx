"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersona } from "@/hooks/usePersona";

interface PersonaSelectorProps {
  className?: string;
  /** Compact for navbar; full for mobile drawer */
  variant?: "nav" | "stack";
  onNavigate?: () => void;
}

export default function PersonaSelector({
  className,
  variant = "nav",
  onNavigate,
}: PersonaSelectorProps) {
  const { persona, personas, mounted, selectPersona, clearPersona } = usePersona();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = !mounted ? "Select persona" : persona ? persona.shortLabel : "Select persona";

  const choose = (id: string) => {
    selectPersona(id);
    setOpen(false);
    onNavigate?.();
  };

  const reset = () => {
    clearPersona();
    setOpen(false);
    onNavigate?.();
  };

  if (variant === "stack") {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-theme-subtle">
          I am a
        </p>
        <div className="flex flex-col gap-1 px-2">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p.id)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                persona?.id === p.id
                  ? "bg-accent/10 text-accent"
                  : "text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
              )}
            >
              <span>{p.title}</span>
              {persona?.id === p.id && <Check className="h-4 w-4 shrink-0" aria-hidden />}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-theme-subtle hover:bg-theme-surface hover:text-theme-heading"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reset / View all
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex max-w-[14rem] items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface/50 px-2.5 py-2 text-sm transition-colors hover:border-accent/30 hover:text-theme-heading",
          open && "border-accent/40 bg-accent/5"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
      >
        <Users className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
        <span className="truncate text-theme-subtle">
          <span className="hidden text-theme-muted xl:inline">I am a: </span>
          <span className="font-medium text-theme-heading">{label}</span>
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 text-theme-subtle transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Select persona"
          className="dropdown-panel absolute end-0 z-50 mt-2 w-64 overflow-hidden rounded-xl py-1"
        >
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-theme-subtle">
            Customize your tools
          </p>
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={persona?.id === p.id}
              onClick={() => choose(p.id)}
              className={cn(
                "flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-theme-surface",
                persona?.id === p.id && "bg-accent/5"
              )}
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: p.theme.accent }}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-theme-heading">{p.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-xs text-theme-subtle">{p.description}</span>
              </span>
              {persona?.id === p.id && <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />}
            </button>
          ))}
          <div className="border-t border-theme-subtle">
            <button
              type="button"
              onClick={reset}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Reset / View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

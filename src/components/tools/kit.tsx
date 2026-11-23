"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small building blocks shared by the newer tool components. */

export function ToolStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-theme-subtle bg-theme-surface p-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              active ? "bg-accent text-on-accent" : "text-theme-muted hover:text-theme-heading"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FieldLabel({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-theme-body">{label}</span>
      {hint ? <span className="ms-2 text-xs text-theme-subtle">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function ToolNote({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-theme-subtle">{children}</p>;
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title ? <p className="text-sm font-medium text-theme-heading">{title}</p> : <span />}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export const ghostButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-sm font-medium text-theme-muted transition-colors duration-200 hover:border-accent/50 hover:text-theme-heading disabled:cursor-not-allowed disabled:opacity-40";

export const solidButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_color-mix(in_srgb,var(--accent)_40%,transparent)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40";

"use client";

import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

export function CopyResultPanel({
  title = "Result",
  text,
  emptyHint = "Generate to see output here.",
  className,
  children,
}: {
  title?: string;
  text: string;
  emptyHint?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-theme-heading">{title}</p>
        <CopyButton text={text} />
      </div>
      {children}
      {text ? (
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-theme-subtle/60 bg-[var(--background)]/60 p-3 text-sm text-theme-muted">
          {text}
        </pre>
      ) : (
        <p className="mt-2 text-sm text-theme-subtle">{emptyHint}</p>
      )}
    </div>
  );
}

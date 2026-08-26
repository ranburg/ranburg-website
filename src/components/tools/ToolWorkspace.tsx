import { cn } from "@/lib/utils";

/** Quiet surface for calculator inputs/results — no hover-lift. */
export function ToolSurface({
  children,
  className,
  title,
  hint,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  hint?: string;
}) {
  return (
    <div className={cn("tool-surface p-5 sm:p-7", className)}>
      {title && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-subtle">{title}</h2>
          {hint && <p className="text-xs text-theme-muted">{hint}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export function ToolWorkspace({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8", className)}>{children}</div>;
}

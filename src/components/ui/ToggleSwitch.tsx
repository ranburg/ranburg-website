import { cn } from "@/lib/utils";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
        checked ? "border-accent/40 bg-accent/10" : "border-theme-subtle bg-theme-surface/40 hover:border-accent/25",
        className
      )}
    >
      <span
        className={cn(
          "mt-0.5 relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-accent" : "bg-theme-subtle"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[2px]"
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-theme-heading">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-theme-muted">{description}</span>}
      </span>
    </button>
  );
}

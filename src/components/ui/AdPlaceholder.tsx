import { cn } from "@/lib/utils";

type AdPlacement =
  | "below-hero"
  | "sidebar"
  | "between-content"
  | "after-tool-mobile"
  | "between-sections"
  | "after-faq";

interface AdPlaceholderProps {
  placement: AdPlacement;
  className?: string;
}

const LABELS: Record<AdPlacement, string> = {
  "below-hero": "Advertisement",
  sidebar: "Advertisement",
  "between-content": "Advertisement",
  "after-tool-mobile": "Advertisement",
  "between-sections": "Advertisement",
  "after-faq": "Advertisement",
};

export default function AdPlaceholder({ placement, className }: AdPlaceholderProps) {
  return (
    <div
      role="complementary"
      aria-label="Advertisement placeholder"
      data-ad-placement={placement}
      className={cn(
        "ad-placeholder flex items-center justify-center rounded-xl border border-dashed border-theme-subtle bg-theme-surface/50 text-center",
        placement === "sidebar" && "min-h-[250px] w-full",
        placement === "below-hero" && "min-h-[90px] w-full",
        placement === "between-content" && "min-h-[120px] w-full my-8",
        placement === "after-tool-mobile" && "min-h-[100px] w-full lg:hidden my-8",
        placement === "between-sections" && "min-h-[90px] w-full my-12",
        placement === "after-faq" && "min-h-[120px] w-full my-8",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-theme-subtle">
        {LABELS[placement]}
      </span>
    </div>
  );
}

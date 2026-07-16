"use client";

import { useEffect, useRef } from "react";
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

const SIZE: Record<AdPlacement, string> = {
  sidebar: "min-h-[250px] w-full",
  "below-hero": "min-h-[90px] w-full",
  "between-content": "min-h-[120px] w-full my-8",
  "after-tool-mobile": "min-h-[100px] w-full my-8 lg:hidden",
  "between-sections": "min-h-[90px] w-full my-10",
  "after-faq": "min-h-[120px] w-full my-8",
};

/**
 * Renders a real AdSense unit when NEXT_PUBLIC_ADSENSE_CLIENT is set (ca-pub-…).
 * Otherwise shows a dashed placeholder so layout and UX stay stable pre-approval.
 */
export default function AdPlaceholder({ placement, className }: AdPlaceholderProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const enabled = Boolean(client && slot);
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense may be blocked */
    }
  }, [enabled]);

  if (!enabled) {
    return (
      <div
        role="complementary"
        aria-label="Advertisement placeholder"
        data-ad-placement={placement}
        className={cn(
          "ad-placeholder flex items-center justify-center rounded-xl border border-dashed border-theme-subtle bg-theme-surface/50 text-center",
          SIZE[placement],
          className
        )}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-theme-subtle">
          {LABELS[placement]}
        </span>
      </div>
    );
  }

  return (
    <div
      role="complementary"
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={cn("overflow-hidden rounded-xl text-center", SIZE[placement], className)}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

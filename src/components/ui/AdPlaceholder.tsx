"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/siteConfig";

type AdPlacement =
  | "below-hero"
  | "sidebar"
  | "between-content"
  | "after-tool-mobile"
  | "between-sections"
  | "after-faq"
  | "in-article";

interface AdPlaceholderProps {
  placement: AdPlacement;
  className?: string;
}

const SIZE: Record<AdPlacement, string> = {
  sidebar: "min-h-[250px] w-full",
  "below-hero": "min-h-[90px] w-full",
  "between-content": "min-h-[120px] w-full my-8",
  "after-tool-mobile": "min-h-[100px] w-full my-8 lg:hidden",
  "between-sections": "min-h-[90px] w-full my-10",
  "after-faq": "min-h-[120px] w-full my-8",
  "in-article": "min-h-[120px] w-full mt-14",
};

/**
 * Sparse AdSense display unit.
 * The adsbygoogle.js loader lives once in the root layout <head>.
 * Each placement renders the AdSense <ins> + push({}) for slot SITE.adsenseSlot.
 */
export default function AdPlaceholder({ placement, className }: AdPlaceholderProps) {
  const client = SITE.adsenseClient;
  const slot = SITE.adsenseSlot;
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle global injected by the layout loader
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense may be blocked by an extension or network policy */
    }
  }, []);

  return (
    <div
      role="complementary"
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={cn("overflow-hidden rounded-xl text-center", SIZE[placement], className)}
    >
      {/* Ad unit: client ca-pub-4423485654472888 / slot 4454149586 ("test") */}
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

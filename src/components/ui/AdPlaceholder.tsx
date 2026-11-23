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
  sidebar: "min-h-[280px] w-full",
  "below-hero": "min-h-[100px] w-full",
  "between-content": "min-h-[120px] w-full my-8",
  "after-tool-mobile": "min-h-[100px] w-full my-8",
  "between-sections": "min-h-[100px] w-full my-10",
  "after-faq": "min-h-[120px] w-full my-8",
  "in-article": "min-h-[120px] w-full my-10",
};

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { loaded?: boolean };
  }
}

/**
 * Sparse AdSense display unit (client + slot from SITE).
 * Loader script is injected once in the root layout <head>.
 */
export default function AdPlaceholder({ placement, className }: AdPlaceholderProps) {
  const client = SITE.adsenseClient;
  const slot = SITE.adsenseSlot;
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    const el = insRef.current;
    if (!el) return;
    // Already initialized by a previous mount / HMR.
    if (el.getAttribute("data-adsbygoogle-status")) {
      pushed.current = true;
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const pushAd = () => {
      if (cancelled || pushed.current || !insRef.current) return true;
      if (insRef.current.getAttribute("data-adsbygoogle-status")) {
        pushed.current = true;
        return true;
      }
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
        return true;
      } catch {
        return false;
      }
    };

    if (pushAd()) return;

    const timer = window.setInterval(() => {
      attempts += 1;
      if (pushAd() || attempts > 40) window.clearInterval(timer);
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={cn("w-full text-center", SIZE[placement], className)}
    >
      {/* Exact AdSense unit: ca-pub-4423485654472888 / 4454149586 */}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

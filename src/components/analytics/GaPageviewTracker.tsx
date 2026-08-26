"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackGaEvent } from "@/lib/ga";

function sendPageView(pagePath: string): void {
  trackGaEvent("page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Sends a GA4 page_view on every App Router navigation (including locale changes).
 * Root layout loads gtag with send_page_view: false to avoid a double hit on first load.
 */
export default function GaPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    let cancelled = false;

    const attempt = (n: number) => {
      if (cancelled) return;
      if (typeof window.gtag === "function") {
        sendPageView(pagePath);
        return;
      }
      if (n < 20) window.setTimeout(() => attempt(n + 1), 250);
    };

    attempt(0);
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/siteConfig";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? SITE.gaMeasurementId;

function sendGaPageView(pagePath: string): void {
  const pageTitle = document.title;
  const pageLocation = window.location.href;

  window.gtag?.("config", GA_ID, {
    send_page_view: false,
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
  });
  window.gtag?.("event", "page_view", {
    send_to: GA_ID,
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
    engagement_time_msec: 1,
  });
}

/**
 * Sends a GA4 page_view on every App Router navigation (including locale changes).
 * Root layout loads gtag with send_page_view: false to avoid a double hit on first load.
 * Meta Pixel PageView is only fired on client-side navigations (the pixel script already
 * records the first load).
 */
export default function GaPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    let cancelled = false;

    const attempt = (n: number) => {
      if (cancelled) return;
      const gtagReady = typeof window.gtag === "function";
      if (gtagReady) {
        sendGaPageView(pagePath);
        if (!isFirstLoad.current && typeof window.fbq === "function") {
          window.fbq("track", "PageView");
        }
        isFirstLoad.current = false;
        return;
      }
      if (n < 20) window.setTimeout(() => attempt(n + 1), 250);
      else isFirstLoad.current = false;
    };

    attempt(0);
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}

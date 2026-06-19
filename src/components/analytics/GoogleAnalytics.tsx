/**
 * Legacy component — GA is installed in src/app/layout.tsx <head> via siteConfig.gaMeasurementId.
 * Kept for optional client-side pageview tracking if needed later.
 */
"use client";

import Script from "next/script";
import { SITE } from "@/lib/siteConfig";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? SITE.gaMeasurementId;

export default function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

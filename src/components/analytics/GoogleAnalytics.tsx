/**
 * Loads GA after first paint so it does not compete with LCP on mobile.
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

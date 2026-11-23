import { NextResponse } from "next/server";
import { SITE } from "@/lib/siteConfig";

/**
 * ads.txt for Google AdSense.
 * Uses the site's AdSense publisher ID; NEXT_PUBLIC_ADSENSE_PUBLISHER_ID can override it.
 */
export async function GET() {
  const pub = (process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID?.trim() || SITE.adsenseClient).replace(/^ca-/, "");

  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : `# Replace with your AdSense publisher ID via NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-XXXXXXXX
# Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
# See https://support.google.com/adsense/answer/7532444
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

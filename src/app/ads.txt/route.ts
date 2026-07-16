import { NextResponse } from "next/server";

/**
 * ads.txt for Google AdSense.
 * Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-XXXXXXXX (without ca- prefix) in env.
 * Until set, serves a commented placeholder so the route exists for verification prep.
 */
export async function GET() {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID?.replace(/^ca-/, "").trim();

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

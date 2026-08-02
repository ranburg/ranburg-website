import { getIndexNowKey } from "@/lib/indexNow";

/**
 * Public IndexNow key file.
 * Engines fetch this to verify ownership before accepting URL submissions.
 * https://www.indexnow.org/documentation
 */
export async function GET() {
  const key = getIndexNowKey();
  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

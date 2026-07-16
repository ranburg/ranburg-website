import { getPriorityIndexUrls } from "@/lib/seoGrowthConfig";

/**
 * Machine-readable list for GSC URL Inspection batch.
 * GET /api/seo/priority-urls
 */
export async function GET() {
  const urls = getPriorityIndexUrls();
  return Response.json(
    {
      sitemap: "https://www.ranburg.com/sitemap.xml",
      instructions: [
        "In Google Search Console → Sitemaps, submit https://www.ranburg.com/sitemap.xml",
        "Then URL Inspection → request indexing for each URL below (start with the first 20 tools).",
        "Prefer www; ensure non-www redirects to https://www.ranburg.com",
      ],
      count: urls.length,
      urls,
    },
    {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    }
  );
}

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
      indexNow: "https://www.ranburg.com/api/seo/indexnow",
      keyLocation: "https://www.ranburg.com/indexnow-key.txt",
      instructions: [
        "Google: Search Console → Sitemaps → submit https://www.ranburg.com/sitemap.xml",
        "Google: URL Inspection → request indexing for each URL below (start with the first 20 tools).",
        "Bing: Webmaster Tools → add site (or import from GSC) → submit the same sitemap.",
        "Bing/Yandex: after deploy, call POST /api/seo/indexnow with Bearer INDEXNOW_SUBMIT_SECRET (or GET ?submit=1).",
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

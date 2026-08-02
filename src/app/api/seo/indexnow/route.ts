import {
  getDefaultIndexNowUrls,
  getIndexNowHost,
  getIndexNowKey,
  getIndexNowKeyLocation,
  isIndexNowSubmitAuthorized,
  submitIndexNow,
} from "@/lib/indexNow";

/**
 * IndexNow helper for Bing / Yandex / other IndexNow engines (not Google).
 *
 * GET  /api/seo/indexnow
 *   - Without auth → public status + setup instructions
 *   - With auth (Bearer INDEXNOW_SUBMIT_SECRET or CRON_SECRET) → submit priority URLs
 *     (used by Vercel Cron and manual pings)
 *
 * POST /api/seo/indexnow (auth required)
 *   - Optional body: { "urls": ["https://www.ranburg.com/tools/emi", ...] }
 *   - Defaults to priority URL list
 */
export async function GET(request: Request) {
  if (isIndexNowSubmitAuthorized(request)) {
    const result = await submitIndexNow(getDefaultIndexNowUrls());
    return Response.json(result, { status: result.ok ? 200 : 502 });
  }

  const url = new URL(request.url);
  if (url.searchParams.has("submit") || url.searchParams.has("secret")) {
    return Response.json(
      {
        ok: false,
        error:
          "Unauthorized. Set INDEXNOW_SUBMIT_SECRET (or CRON_SECRET) and pass Authorization: Bearer <secret>.",
      },
      { status: 401 }
    );
  }

  return Response.json(
    {
      engine: "IndexNow (Bing, Yandex, Seznam, Naver — not Google)",
      host: getIndexNowHost(),
      keyConfigured: Boolean(getIndexNowKey()),
      keyLocation: getIndexNowKeyLocation(),
      keyFileHint: "Open keyLocation in a browser — body must equal the IndexNow key.",
      defaultUrlCount: getDefaultIndexNowUrls().length,
      bingWebmaster: "https://www.bing.com/webmasters",
      sitemap: "https://www.ranburg.com/sitemap.xml",
      submit: {
        method: "POST or authenticated GET",
        path: "/api/seo/indexnow",
        auth: "Authorization: Bearer $INDEXNOW_SUBMIT_SECRET (or $CRON_SECRET)",
        body: '{ "urls": ["https://www.ranburg.com/tools/emi"] } // optional on POST; defaults to priority URLs',
        cron: "Vercel cron hits this path weekly with CRON_SECRET",
      },
      instructions: [
        "1. Verify https://www.ranburg.com in Bing Webmaster Tools (can import from Google Search Console).",
        "2. Submit sitemap https://www.ranburg.com/sitemap.xml in Bing Webmaster.",
        "3. Confirm key file loads: https://www.ranburg.com/indexnow-key.txt",
        "4. Set INDEXNOW_SUBMIT_SECRET and/or CRON_SECRET in Vercel.",
        "5. Ping after deploys: GET/POST /api/seo/indexnow with Bearer token.",
      ],
    },
    { headers: { "Cache-Control": "public, s-maxage=600" } }
  );
}

export async function POST(request: Request) {
  if (!isIndexNowSubmitAuthorized(request)) {
    return Response.json(
      {
        ok: false,
        error:
          "Unauthorized. Set INDEXNOW_SUBMIT_SECRET (or CRON_SECRET) and pass Authorization: Bearer <secret>.",
      },
      { status: 401 }
    );
  }

  let urls = getDefaultIndexNowUrls();
  try {
    const body = (await request.json()) as { urls?: unknown };
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      urls = body.urls.filter((u): u is string => typeof u === "string");
    }
  } catch {
    /* empty / non-JSON body → default priority list */
  }

  const result = await submitIndexNow(urls);
  return Response.json(result, { status: result.ok ? 200 : 502 });
}

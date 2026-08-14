import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Aggressive AI scrapers — never block search engines or social link-preview crawlers. */
const BLOCKED_BOT_UA =
  /GPTBot|ChatGPT-User|CCBot|ClaudeBot|Claude-Web|anthropic-ai|Bytespider|PetalBot|DataForSeoBot|cohere-ai|Diffbot|ImagesiftBot/i;

const SEARCH_BOT_UA =
  /Googlebot|Google-InspectionTool|Storebot-Google|bingbot|BingPreview|DuckDuckBot|Applebot|Yandex|Baiduspider|Slurp|ecosia|Bravebot/i;

export default function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  if (ua && BLOCKED_BOT_UA.test(ua) && !SEARCH_BOT_UA.test(ua)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except api, static files, and Next internals
    "/((?!api|_next|_vercel|.*\\..*|sitemap.*\\.xml|robots\\.txt|ads\\.txt|indexnow-key\\.txt|llms\\.txt|opengraph-image).*)",
  ],
};

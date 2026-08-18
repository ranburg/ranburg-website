import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except api, static files, and Next internals
    "/((?!api|_next|_vercel|.*\\..*|sitemap.*\\.xml|robots\\.txt|ads\\.txt|indexnow-key\\.txt|llms\\.txt|opengraph-image).*)",
  ],
};

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except api, static files, and Next internals
    "/((?!api|_next|_vercel|.*\\..*|sitemap.*\\.xml|robots\\.txt|ads\\.txt|indexnow-key\\.txt|opengraph-image).*)",
  ],
};

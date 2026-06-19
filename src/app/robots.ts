import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services/", "/tools/", "/blog/"],
        disallow: ["/web/login", "/web/database", "/web/session", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

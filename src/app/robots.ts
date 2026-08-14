import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";

/** AI / scraper bots that burn crawl budget without ranking benefit. Search engines stay on `*`. */
const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Bytespider",
  "PetalBot",
  "DataForSeoBot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services/",
          "/tools/",
          "/blog/",
          "/case-studies/",
          "/for/",
          "/about",
          "/contact",
          "/ads.txt",
          "/indexnow-key.txt",
          "/llms.txt",
        ],
        disallow: ["/web/login", "/web/database", "/web/session", "/api/"],
      },
      ...AI_CRAWLER_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: ["/"] as string[],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

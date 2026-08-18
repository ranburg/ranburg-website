import type { MetadataRoute } from "next";
import { SITE } from "@/lib/siteConfig";

/**
 * Explicit allow-list for AI search / LLM crawlers (GEO).
 * Search engines already match User-agent: *; these rules make GPTBot,
 * Claude, Gemini training, Perplexity, and related agents unambiguously allowed.
 */
const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Google-CloudVertexBot",
  "PerplexityBot",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
  "cohere-ai",
  "meta-externalagent",
  "FacebookBot",
  "Bytespider",
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
        allow: ["/"] as string[],
        disallow: ["/api/", "/web/login", "/web/database", "/web/session"],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

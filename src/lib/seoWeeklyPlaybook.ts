/**
 * Weekly Google Search Console iteration checklist (Phase 4).
 * Use every Monday; focus on queries in positions 8–20.
 */
export const SEO_WEEKLY_PLAYBOOK = {
  cadence: "weekly",
  gscReports: [
    "Performance → Queries: sort by impressions, filter position 8–20",
    "Performance → Pages: find CTR < 2% with impressions > 50",
    "Indexing → Pages: Crawled – not indexed / Discovered – not indexed",
    "Sitemaps: confirm sitemap.xml is Success with discovered URLs rising",
  ],
  actions: [
    {
      id: "title-ctr",
      when: "High impressions, CTR under 2%",
      do: "Rewrite title to match query intent: `{Primary Keyword} — Free Online | Ranburg`",
    },
    {
      id: "almost-page-one",
      when: "Average position 8–20 for a tool query",
      do: "Strengthen FAQ (People Also Ask), add internal links from category hub + related tools, ensure unique worked example is visible",
    },
    {
      id: "not-indexed",
      when: "Tool URL crawled/discovered but not indexed",
      do: "Request indexing in URL Inspection; check uniqueness vs similar tools; add 2–3 internal links from popular pages",
    },
    {
      id: "cannibalization",
      when: "Blog and tool compete for same query",
      do: "Keep tool as money page; make blog support with CTA; noindex thin auto blogs already handled for non-priority",
    },
  ],
  priorityToolsApi: "/api/seo/priority-urls",
  targetMonths: {
    month1: "50+ indexed URLs, 1–3k organic sessions",
    month3: "Full tool catalog indexed, 10–25k sessions",
    month6: "50k+ sessions, AdSense scaled",
  },
} as const;

# Ranburg SEO Growth Playbook

Reference for rankings → traffic → AdSense revenue. Engineering foundations shipped in commit `9101ad3` (production `main`). Do not chase head terms (e.g. “PDF merge”) before long-tail wins and indexation.

**Live site:** https://www.ranburg.com/  
**Money model:** Primary = Google AdSense on tool pages · Secondary = affiliates (later)

```
Fix indexation → Rank long-tail tool queries → Raise dwell time → AdSense + affiliates
```

---

## Goals

| Month | Indexed pages | Organic sessions / mo | Focus |
|------:|--------------:|----------------------:|-------|
| 1 | 50+ | 1–3k | Index + top 20 tools |
| 3 | 80+ tools + hubs | 10–25k | Long-tail first page |
| 6 | Full catalog + strong guides | 50k+ | AdSense scale |

**First-page definition:** Position ≤10 on intent-matched long-tail first; expand to head terms as authority grows.

---

## What shipped (code)

| Area | Behavior | Key files |
|------|----------|-----------|
| Sitemap index | `/sitemap.xml` indexes child sitemaps (pages, tools, categories, blog) | `src/app/sitemap.xml/route.ts`, `src/lib/sitemapXml.ts` |
| Coming-soon | `noindex`; excluded from tools sitemap | `src/app/tools/[slug]/page.tsx`, `sitemap-tools.xml` |
| Top-20 SEO | Primary keywords + unique worked examples | `src/lib/seoGrowthConfig.ts`, `toolPageSeo.ts`, `toolSeoGenerator.ts` |
| Thin blogs | Auto SEO-cluster / tool-guide posts for non-priority tools = `noindex` | `seoGrowthConfig.ts` (`shouldNoIndexBlogPost`) |
| Blog OG | `ogType: "article"` on posts | `src/app/blog/[slug]/page.tsx` |
| ads.txt | `/ads.txt` from publisher env | `src/app/ads.txt/route.ts` |
| AdSense UI | Real units when client + slot set | `src/components/ui/AdPlaceholder.tsx`, `layout.tsx` |
| Affiliates | CTA only if enabled | `src/components/ui/AffiliateCta.tsx` |
| GA4 | `tool_open`, `tool_result`, `copy_output`, `download` | `src/lib/ga.ts` |
| Distribution kit | Shorts scripts, directories, community templates | `src/lib/marketingDistribution.ts` |
| Weekly GSC playbook | Positions 8–20 iteration | `src/lib/seoWeeklyPlaybook.ts` |

### Live helper APIs

| Endpoint | Use |
|----------|-----|
| https://www.ranburg.com/api/seo/priority-urls | JSON list of URLs to request indexing in GSC |
| https://www.ranburg.com/api/seo/growth-kit | Shorts scripts, directory copy, weekly checklist |

---

## Phase 0 — Indexation (Week 1)

### Google Search Console (manual)

1. Preferred domain: `https://www.ranburg.com` (verify www + non-www).
2. Submit sitemap: `https://www.ranburg.com/sitemap.xml`
3. Request indexing for priority URLs from `/api/seo/priority-urls` (top 20 tools + hubs — not all 81 at once).
4. Monitor Coverage: Indexed / Discovered / Crawled-not-indexed / Excluded.

### Technical rules

- Coming-soon / waitlist tools must stay **noindex** and out of the tools sitemap.
- Every live tool needs unique title/description (spot-check duplicates in GSC).
- Ship `ads.txt` as soon as AdSense publisher ID exists.

---

## Phase 1 — Keyword clusters (top 20)

Title pattern: `{Primary Keyword} — Free Online | Ranburg`  
H1 matches primary keyword. Keep process flow; unique worked examples live in `TOOL_WORKED_EXAMPLES`.

| Cluster | Example queries | Primary URLs |
|---------|-----------------|--------------|
| India finance | emi calculator, sip calculator online, gst calculator, loan foreclosure calculator | `/tools/emi`, `/tools/sip`, `/tools/gst-calculator`, `/tools/loan-foreclosure-calculator` |
| Creator money | youtube revenue calculator, Instagram earnings, AdSense revenue | matching revenue / insights tools |
| Creator SEO | youtube/instagram hashtag generator, youtube tags generator | social generators |
| File utilities | jpg to png, image compressor, pdf merge, heic to jpg | image/PDF tools |
| Dev utilities | json formatter, password generator, qr code generator | developer tools |

### Priority tool slugs (GSC first)

Source of truth: `PRIORITY_INDEX_TOOL_SLUGS` in `src/lib/seoGrowthConfig.ts`

1. emi  
2. sip  
3. gst-calculator  
4. loan-foreclosure-calculator  
5. youtube-revenue-calculator  
6. youtube-channel-insights  
7. instagram-revenue-calculator  
8. instagram-profile-insights  
9. adsense-revenue-calculator  
10. youtube-hashtag-generator  
11. instagram-hashtag-generator  
12. youtube-tags-generator  
13. jpg-to-png  
14. image-compressor  
15. pdf-merge  
16. heic-to-jpg  
17. json-formatter  
18. password-generator  
19. qr-generator  
20. currency-converter  

Also index: `/`, `/tools`, and category hubs (`calculators`, `social-media`, `image`, `pdf`, `seo`, `developer`, `business`).

### Content quality

- Pause mass new auto-blogs.
- Keep/enrich guides for top 20 only; thin non-priority auto posts stay live but noindexed.
- Cornerstone guides to upgrade: EMI, SIP, GST, YT revenue, Image compressor.

---

## Phase 2 — Distribution (manual)

Use copy from `/api/seo/growth-kit` or `src/lib/marketingDistribution.ts`.

1. **YouTube Shorts / Reels** — 30–60s demos linking to the tool (8 scripts in growth kit).
2. **Reddit / Quora / IndieHackers** — value-first answers with free tool link (no spam).
3. **Product Hunt / AlternativeTo / tool directories** — list Ranburg as a free tools suite.
4. **Pinterest** — SIP/EMI/GST result pins (India finance).
5. **Backlinks** — Indian finance blogs; Salesforce admin blogs for SF tools; unique calculators in communities.

Every blog guide should CTA to the live tool (`featuredToolSlug`).

---

## Phase 3 — Monetization

### Environment variables (Vercel → redeploy)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…` | Loads adsbygoogle + real ad units |
| `NEXT_PUBLIC_ADSENSE_SLOT` | numeric slot id | Ad unit slot |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | `pub-…` | `/ads.txt` line |
| `NEXT_PUBLIC_AFFILIATE_ENABLED` | `true` | Shows affiliate CTA |
| Affiliate URL envs | (see `AffiliateCta`) | Hosting / VPN / creator links |

Until AdSense env is set, `AdPlaceholder` shows a layout placeholder and `/ads.txt` serves comments only.

### Ad placement rules

- Prefer after tool results + after FAQ / between content (1–2 units per tool page).
- Avoid ads in hero.
- Prefer manual units over aggressive Auto ads on result areas.

### Rough revenue

`Revenue ≈ (pageviews / 1000) × Page RPM`  
Forecast with https://www.ranburg.com/tools/adsense-revenue-calculator

Affiliates are secondary: hosting/domain (dev tools), VPN (EXIF), creator tools (YT/IG). Disclose in privacy/terms; one native CTA.

---

## Phase 4 — Weekly measurement

Playbook source: `src/lib/seoWeeklyPlaybook.ts`

Every week in GSC:

1. Queries: impressions high, **position 8–20** → FAQ, internal links, worked example.
2. Pages: impressions > 50 and **CTR &lt; 2%** → rewrite title to primary keyword pattern.
3. Indexing: crawled/discovered not indexed → uniqueness + internal links + URL Inspection.
4. Cannibalization: tool = money page; blog supports with CTA.

GA4 events to watch: `tool_open`, `tool_result`, `copy_output`, `download`.

---

## 30-day checklist

- [ ] Sitemap index submitted in GSC; coming-soon confirmed noindex
- [ ] Request indexing for top 20 tools + `/tools` + category hubs
- [ ] Finish AdSense; set env vars; verify `/ads.txt` and live units
- [ ] Upgrade 5 cornerstone guides (EMI, SIP, GST, YT revenue, Image compressor)
- [ ] Post 8 short-form demos (growth-kit scripts)
- [ ] Weekly: GSC query report → fix titles for CTR &lt; 2%

---

## What not to do

- Do not publish dozens more thin AI blogs hoping to rank.
- Do not spray AdSense units that hurt Core Web Vitals / policy.
- Do not chase competitive head terms before long-tail + backlinks.
- Do not leave waitlist/coming-soon pages indexed.

---

## Code map (quick)

```
src/lib/seoGrowthConfig.ts      # Priority slugs, keywords, worked examples, blog noindex
src/lib/seoWeeklyPlaybook.ts    # Weekly GSC actions
src/lib/marketingDistribution.ts
src/lib/ga.ts
src/app/sitemap.xml/route.ts
src/app/sitemap-*.xml/route.ts
src/app/ads.txt/route.ts
src/app/api/seo/priority-urls/route.ts
src/app/api/seo/growth-kit/route.ts
src/components/ui/AdPlaceholder.tsx
src/components/ui/AffiliateCta.tsx
```

Update priority tools / keywords in `seoGrowthConfig.ts` when the commercial mix changes; keep this doc in sync when strategy shifts.

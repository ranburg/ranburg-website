import { SITE } from "@/lib/siteConfig";
import { SEO_CLUSTER_BLOG_POSTS } from "@/lib/blogConfigSeoClusters";
import { TOOL_GUIDE_BLOG_POSTS } from "@/lib/blogConfigToolGuides";

/**
 * Top commercial-intent tools to request indexing first in Google Search Console.
 * Order ≈ revenue / search demand for Ranburg.
 */
export const PRIORITY_INDEX_TOOL_SLUGS = [
  "emi",
  "sip",
  "gst-calculator",
  "loan-foreclosure-calculator",
  "youtube-revenue-calculator",
  "youtube-channel-insights",
  "instagram-revenue-calculator",
  "instagram-profile-insights",
  "adsense-revenue-calculator",
  "youtube-hashtag-generator",
  "instagram-hashtag-generator",
  "youtube-tags-generator",
  "jpg-to-png",
  "image-compressor",
  "pdf-merge",
  "heic-to-jpg",
  "json-formatter",
  "password-generator",
  "qr-generator",
  "currency-converter",
] as const;

export type PriorityToolSlug = (typeof PRIORITY_INDEX_TOOL_SLUGS)[number];

/** Absolute URLs for GSC "Request indexing" batch. */
export function getPriorityIndexUrls(): string[] {
  return [
    SITE.url,
    `${SITE.url}/tools`,
    ...PRIORITY_INDEX_TOOL_SLUGS.map((slug) => `${SITE.url}/tools/${slug}`),
    `${SITE.url}/tools/calculators`,
    `${SITE.url}/tools/social-media`,
    `${SITE.url}/tools/image`,
    `${SITE.url}/tools/pdf`,
    `${SITE.url}/tools/seo`,
    `${SITE.url}/tools/developer`,
    `${SITE.url}/tools/business`,
  ];
}

/** Primary keyword targets per priority tool (Phase 1 SEO). */
export const TOOL_PRIMARY_KEYWORDS: Record<string, string> = {
  emi: "EMI calculator",
  sip: "SIP calculator online",
  "gst-calculator": "GST calculator",
  "loan-foreclosure-calculator": "loan foreclosure calculator",
  "youtube-revenue-calculator": "YouTube revenue calculator",
  "youtube-channel-insights": "YouTube channel analytics",
  "instagram-revenue-calculator": "Instagram earnings calculator",
  "instagram-profile-insights": "Instagram profile analytics",
  "adsense-revenue-calculator": "AdSense revenue calculator",
  "youtube-hashtag-generator": "YouTube hashtag generator",
  "instagram-hashtag-generator": "Instagram hashtag generator",
  "youtube-tags-generator": "YouTube tags generator",
  "jpg-to-png": "JPG to PNG converter",
  "image-compressor": "image compressor online",
  "pdf-merge": "PDF merge online",
  "heic-to-jpg": "HEIC to JPG converter",
  "json-formatter": "JSON formatter",
  "password-generator": "password generator",
  "qr-generator": "QR code generator",
  "currency-converter": "currency converter",
};

/** Worked examples unique to each priority tool (not generic templates). */
export const TOOL_WORKED_EXAMPLES: Record<string, string[]> = {
  emi: [
    "Example: ₹25,00,000 home loan at 8.5% for 20 years → monthly EMI ≈ ₹21,700. Adjust tenure to see how much interest you save by closing early.",
    "Compare a 15-year vs 20-year tenure before locking your bank offer — the chart updates instantly as you drag the sliders.",
    "Use purchasing-power view to understand what total payments mean in today's rupees after inflation.",
  ],
  sip: [
    "Example: ₹10,000/month SIP at 12% for 15 years. Project corpus, invested amount, and wealth gained side by side.",
    "Model a step-up SIP mentally by comparing two scenarios (e.g. ₹10k vs ₹15k monthly) and screenshot for your advisor.",
    "Check today's purchasing power of the maturity value so long-term goals stay realistic.",
  ],
  "gst-calculator": [
    "Example: ₹50,000 exclusive of GST at 18% → add CGST/SGST or IGST and see net vs gross instantly.",
    "Switch inclusive/exclusive modes when quoting clients so your invoice matches the GST regime.",
    "Use the breakdown table when filing or reconciling B2B invoices for the month.",
  ],
  "loan-foreclosure-calculator": [
    "Example: Outstanding ₹12L at 9% with 2% foreclosure charges — see whether closing now beats continuing EMIs.",
    "Model an extra annual prepayment and compare interest saved vs full foreclosure penalties.",
    "Bring bank sanction letter numbers into the sliders before you call the lender.",
  ],
  "youtube-revenue-calculator": [
    "Example: 1M monthly views at $2.50 RPM → estimate ad revenue, then layer sponsorship assumptions.",
    "Stress-test low/mid/high RPM bands for your niche (finance vs gaming) before pitching brands.",
    "Pair with Channel Insights to validate whether a public channel is near YPP thresholds.",
  ],
  "youtube-channel-insights": [
    "Paste any public channel URL or @handle to pull subscribers, views, and monetization signals.",
    "Use growth charts to spot channels accelerating before you collaborate or compete.",
    "Copy recommendations into your content calendar for the next 30 days.",
  ],
  "instagram-revenue-calculator": [
    "Example: 50k followers with mid-tier sponsorship rates — estimate monthly creator income ranges.",
    "Adjust engagement assumptions when negotiating reel vs carousel packages.",
    "Cross-check with Profile Insights on a public creator before outreach.",
  ],
  "instagram-profile-insights": [
    "Analyze a public profile for followers, posts, and sponsorship potential without logging in.",
    "Use growth projections when deciding whether to invest in a niche account.",
    "Export talking points for brand decks from the insight cards.",
  ],
  "adsense-revenue-calculator": [
    "Example: 100k pageviews at $4 Page RPM → forecast monthly AdSense earnings.",
    "Model India vs US traffic mixes to set realistic RPM expectations for your niche.",
    "Use scenarios when planning how many tool pages you need for a revenue goal.",
  ],
  "youtube-hashtag-generator": [
    "Enter a Shorts topic, pick tag count and mix, then copy a balanced set for discovery.",
    "Toggle off broad tags that feel spammy; keep niche + branded for relevance.",
    "Regenerate with Long-form preset when publishing full videos instead of Shorts.",
  ],
  "instagram-hashtag-generator": [
    "Set Reels vs feed, choose 15–30 tags, and blend broad/niche/branded for reach.",
    "Add a niche like “skincare” to pull trend-pack tags relevant to your vertical.",
    "Deselect overused tags before pasting into Instagram captions.",
  ],
  "youtube-tags-generator": [
    "Build comma-separated tags from topic + keyword + niche, then trim to your count.",
    "Toggle chips off to remove weak variants before pasting into YouTube Studio.",
    "Combine with the description generator for a full upload checklist.",
  ],
  "jpg-to-png": [
    "Drop a JPG screenshot, preview the PNG, and download lossless output for UI mockups.",
    "Use when a platform requires transparency-ready assets from camera photos.",
    "Keep processing local — files never upload to Ranburg servers.",
  ],
  "image-compressor": [
    "Compress a 4MB photo to under 500KB with quality ~75% and max width 1920 for blogs.",
    "Compare before/after size bars before downloading for WhatsApp or web.",
    "Batch everyday exports without desktop software.",
  ],
  "pdf-merge": [
    "Upload invoice + annexure PDFs, reorder if needed, and download one client-ready file.",
    "Merge scanned pages from phone into a single submission packet.",
    "All merging happens in-browser via pdf-lib.",
  ],
  "heic-to-jpg": [
    "Convert iPhone HEIC vacation photos to JPG for email and Windows PCs.",
    "Preview before download to confirm orientation and quality.",
    "Ideal when clients cannot open HEIC attachments.",
  ],
  "json-formatter": [
    "Paste minified API responses, pretty-print, and copy into docs or Postman.",
    "Catch trailing commas and invalid JSON during code review.",
    "Bookmark for daily backend debugging alongside regex and Base64 tools.",
  ],
  "password-generator": [
    "Generate a 16–24 character password with symbols for banking and email.",
    "Use the strength meter before saving to your password manager.",
    "Create one-off sandbox passwords without reuse.",
  ],
  "qr-generator": [
    "Create a Wi‑Fi or URL QR with logo overlay for event posters.",
    "Export PNG/SVG for print vs digital placements.",
    "Test scan distance by adjusting size before printing.",
  ],
  "currency-converter": [
    "Convert USD invoice amounts to INR for GST and accounting entries.",
    "Check mid-market style rates before international freelancing quotes.",
    "Refresh when planning travel budgets across multiple currencies.",
  ],
};

const PRIORITY_SET = new Set<string>(PRIORITY_INDEX_TOOL_SLUGS);

const AUTO_BLOG_SLUGS = new Set<string>([
  ...SEO_CLUSTER_BLOG_POSTS.map((p) => p.slug),
  ...TOOL_GUIDE_BLOG_POSTS.map((p) => p.slug),
]);

/**
 * Thin auto-generated blogs (non-priority tool guides / clusters) stay live for UX
 * but are noindexed so they do not dilute crawl budget or Helpful Content signals.
 * Hand-written posts and auto content tied to priority tools remain indexable.
 */
export function shouldNoIndexBlogPost(post: {
  slug: string;
  featuredToolSlug?: string;
  relatedTools: string[];
}): boolean {
  if (!AUTO_BLOG_SLUGS.has(post.slug)) return false;
  const featured = post.featuredToolSlug ?? post.relatedTools[0];
  if (featured && PRIORITY_SET.has(featured)) return false;
  return true;
}

export function isIndexableBlogPost(post: {
  slug: string;
  featuredToolSlug?: string;
  relatedTools: string[];
}): boolean {
  return !shouldNoIndexBlogPost(post);
}

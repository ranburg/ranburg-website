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
  "age-calculator",
  "percentage-calculator",
  "bmi-calculator",
  "discount-calculator",
  "rd-calculator",
  "calorie-calculator",
  "keyword-density-checker",
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

/** Primary keyword targets for tools (used in titles, descriptions, and content). */
export const TOOL_PRIMARY_KEYWORDS: Record<string, string> = {
  emi: "EMI calculator",
  sip: "SIP calculator",
  "home-loan-vs-mutual-fund": "home loan vs mutual fund",
  swp: "SWP calculator",
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
  "youtube-description-generator": "YouTube description generator",
  "jpg-to-png": "JPG to PNG converter",
  "png-to-jpg": "PNG to JPG converter",
  "webp-to-png": "WEBP to PNG converter",
  "png-to-webp": "PNG to WEBP converter",
  "image-compressor": "image compressor",
  "image-resizer": "image resizer",
  "crop-image": "crop image online",
  "heic-to-jpg": "HEIC to JPG converter",
  "svg-to-png": "SVG to PNG converter",
  "image-to-base64": "image to Base64",
  "base64-to-image": "Base64 to image",
  "remove-exif": "remove EXIF metadata",
  "image-converter": "image converter",
  "pdf-merge": "PDF merge",
  "pdf-split": "PDF split",
  "pdf-compressor": "PDF compressor",
  "pdf-to-jpg": "PDF to JPG",
  "jpg-to-pdf": "JPG to PDF",
  "word-to-pdf": "Word to PDF",
  "json-formatter": "JSON formatter",
  "text-diff-checker": "text diff checker",
  "markdown-preview": "Markdown live preview",
  "pdf-page-reorder": "PDF page reorder",
  "pdf-to-text": "PDF to text",
  "resume-builder": "resume builder",
  "pdf-signer": "PDF signer",
  "screen-recorder": "screen recorder",
  "color-background-remover": "background remover",
  "ppf-calculator": "PPF calculator",
  "ctc-in-hand-calculator": "CTC to in-hand calculator",
  "invoice-generator": "invoice generator",
  "sql-formatter": "SQL formatter",
  "password-generator": "password generator",
  "qr-generator": "QR code generator",
  "qr-code-generator": "QR code generator",
  "currency-converter": "currency converter",
  "age-calculator": "age calculator",
  "percentage-calculator": "percentage calculator",
  "bmi-calculator": "BMI calculator",
  "cagr-calculator": "CAGR calculator",
  "fd-calculator": "FD calculator",
  "unix-timestamp-converter": "unix timestamp converter",
  "utm-builder": "UTM builder",
  "discount-calculator": "discount calculator",
  "rd-calculator": "RD calculator",
  "calorie-calculator": "calorie calculator",
  "password-strength-checker": "password strength checker",
  "date-difference-calculator": "days between dates",
  "profit-margin-calculator": "profit margin calculator",
  "roi-calculator": "ROI calculator",
  "break-even-calculator": "break even calculator",
  "compound-interest-calculator": "compound interest calculator",
  "meta-tag-generator": "meta tag generator",
  "schema-markup-generator": "schema markup generator",
  "keyword-density-checker": "keyword density checker",
  "word-counter": "word counter",
  "case-converter": "case converter",
  "regex-tester": "regex tester",
  "base64-encoder": "Base64 encoder",
  "uuid-generator": "UUID generator",
  "credit-card-finder": "credit card finder",
  "rent-vs-buy-calculator": "rent vs buy calculator",
  "salary-hike-calculator": "salary hike calculator",
  "soql-builder": "SOQL builder",
  "formula-generator": "Salesforce formula generator",
  "apex-test-generator": "Apex test generator",
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
  "home-loan-vs-mutual-fund": [
    "Example: ₹75 lakh home, 20% down, 8.5% loan, ₹25,000 rent with 5% yearly hike. Match SIP to EMI + maintenance + utilities − rent and compare 20-year net worth.",
    "Turn off matched SIP to test a fixed monthly investment, or leave it on so both paths use the same cash each month.",
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

/** Unique PAA-style FAQs for money pages (merged on top of tool.faq). */
export const TOOL_UNIQUE_FAQS: Record<string, { question: string; answer: string }[]> = {
  emi: [
    {
      question: "What EMI to income ratio is considered safe in India?",
      answer:
        "Lenders typically prefer total EMIs under 40–50% of take-home pay. Use this EMI calculator with your actual offer rate, then leave a buffer for other loans, rent, and emergencies before you sign.",
    },
    {
      question: "Does this EMI calculator work for SBI, HDFC, and ICICI home loans?",
      answer:
        "Yes. Enter the principal, annual rate, and tenure from any Indian bank sanction letter. The formula is the standard reducing-balance EMI used by SBI, HDFC, ICICI, and most NBFCs. Confirm processing fees and floating-rate resets with the lender.",
    },
    {
      question: "How do I lower EMI without changing the loan amount?",
      answer:
        "Extend tenure to cut the monthly installment (total interest rises), negotiate a lower rate, or make a part-prepayment. Compare 15-year vs 20-year tenures here, then check the loan foreclosure calculator if you plan to close early.",
    },
  ],
  sip: [
    {
      question: "What is a good SIP return rate to assume?",
      answer:
        "Equity SIPs are often modelled at 10–12% long-term, hybrid at 8–10%, and debt lower. This SIP calculator lets you stress-test optimistic vs conservative rates so your goal amount stays realistic.",
    },
    {
      question: "SIP vs lump sum — which grows faster?",
      answer:
        "A lump sum invested at the start compounds on the full amount immediately. SIP averages purchase cost over time and is easier for salaried investors. Run both monthly SIP and a one-time equivalent in separate scenarios before you decide.",
    },
    {
      question: "Does this SIP calculator include expense ratio and tax?",
      answer:
        "No. Enter an expected net return after expense ratio. LTCG on equity funds and tax on debt funds are not deducted — treat the corpus as pre-tax guidance and confirm with your CA.",
    },
  ],
  "gst-calculator": [
    {
      question: "How do I calculate GST inclusive vs exclusive in India?",
      answer:
        "Exclusive: GST = amount × rate / 100. Inclusive: GST = amount − (amount × 100 / (100 + rate)). Switch modes on this GST calculator to match quotes vs invoices.",
    },
    {
      question: "When should I use CGST/SGST vs IGST?",
      answer:
        "Intra-state supplies split GST into CGST + SGST (or UTGST). Inter-state supplies use IGST at the same headline rate (5%, 12%, 18%, or 28%). The breakdown table shows both views.",
    },
    {
      question: "Does this GST calculator work for 5%, 12%, 18%, and 28%?",
      answer:
        "Yes. Pick the slab that applies to your HSN/SAC. Composition dealers and exempt supplies follow different rules — this tool is for standard GST math on taxable value.",
    },
  ],
  "loan-foreclosure-calculator": [
    {
      question: "Is it worth foreclosing a home loan in India?",
      answer:
        "Compare remaining interest vs foreclosure charges (often 0–2% plus GST on floating home loans). If interest saved is clearly larger and you still keep an emergency fund, foreclosure can win. Run your outstanding, rate, and fee here first.",
    },
    {
      question: "Foreclosure vs part-prepayment — which saves more?",
      answer:
        "Part-prepayment cuts principal and future interest while keeping the loan alive. Full foreclosure stops interest entirely but may trigger fees. Model both before you call the bank.",
    },
  ],
  "youtube-revenue-calculator": [
    {
      question: "What is a typical YouTube RPM in 2026?",
      answer:
        "RPM varies widely by niche and country. Finance and software often see higher RPM than entertainment or kids content. Use low/mid/high bands (for example $1–$8) rather than a single number when you forecast.",
    },
    {
      question: "Is YouTube revenue the same as AdSense RPM?",
      answer:
        "YouTube RPM is revenue per 1,000 video views after YouTube’s cut. AdSense Page RPM is for websites. Use the matching calculator — this page estimates YouTube; the AdSense revenue calculator is for sites.",
    },
    {
      question: "How much can I earn from 1 million YouTube views?",
      answer:
        "At $2.50 RPM, 1M views ≈ $2,500 before tax. Sponsorships and memberships are extra. Change RPM on this YouTube revenue calculator to match your niche.",
    },
  ],
  "instagram-revenue-calculator": [
    {
      question: "How much do Instagram influencers charge per post?",
      answer:
        "Nano creators may earn a few thousand rupees per reel; mid-tier (50k–200k) often charge more based on engagement, not just followers. This Instagram earnings calculator uses follower tiers and typical sponsorship ranges as a starting point.",
    },
    {
      question: "Do likes matter more than followers for Instagram income?",
      answer:
        "Brands look at engagement rate, saves, and story replies. A smaller highly engaged audience often prices better than a large inactive one. Pair this calculator with Instagram profile insights.",
    },
  ],
  "adsense-revenue-calculator": [
    {
      question: "What is a good AdSense RPM for a tools website?",
      answer:
        "Utility and finance pages in high-CPC geos often outperform generic blogs, but RPM still depends on traffic country, season, and ad density. Model $2–$8 Page RPM scenarios rather than copying another site’s screenshot.",
    },
    {
      question: "How many pageviews do I need to make $1,000 with AdSense?",
      answer:
        "At $4 Page RPM you need about 250,000 pageviews. This AdSense revenue calculator lets you reverse-plan traffic vs RPM so goals stay numeric.",
    },
  ],
  "youtube-hashtag-generator": [
    {
      question: "How many hashtags should I use on YouTube Shorts?",
      answer:
        "YouTube allows hashtags in the title and description. 3–8 relevant tags usually beat a long spam list. Generate a mix, then keep niche + branded tags that match the video.",
    },
    {
      question: "Do YouTube hashtags help ranking in 2026?",
      answer:
        "Hashtags help categorization and search for exact topics; watch time and title/thumbnail still dominate. Use this YouTube hashtag generator for discovery, not as a substitute for a clear title.",
    },
  ],
  "instagram-hashtag-generator": [
    {
      question: "How many Instagram hashtags should I use in 2026?",
      answer:
        "Instagram allows up to 30, but 5–15 highly relevant tags often perform better than maxing out. Blend broad, niche, and branded — then deselect anything off-topic.",
    },
    {
      question: "Should hashtags go in the caption or first comment?",
      answer:
        "Either can work. Captions keep tags with the post; first-comment keeps the caption cleaner. Generate the set here, then paste where your workflow prefers.",
    },
  ],
  "youtube-tags-generator": [
    {
      question: "Are YouTube tags still useful?",
      answer:
        "Tags are a secondary signal. They help with misspellings and synonyms when the title is already clear. Generate comma-separated tags, drop duplicates of the title, and stay under spammy repetition.",
    },
  ],
  "heic-to-jpg": [
    {
      question: "Why can’t Windows open my iPhone HEIC photos?",
      answer:
        "HEIC is Apple’s default camera format. Many Windows apps and email clients do not decode it. Convert HEIC to JPG with this free tool, then share or upload anywhere.",
    },
    {
      question: "Is converting HEIC to JPG lossless?",
      answer:
        "JPG is a lossy format. For email, WhatsApp, and Windows sharing the quality is typically excellent. Keep the original HEIC if you need a camera-quality archive.",
    },
  ],
  "jpg-to-png": [
    {
      question: "When should I convert JPG to PNG?",
      answer:
        "Use PNG when you need sharper graphics, screenshots, or a path to transparency. Photos often stay smaller as JPG. Convert JPG to PNG here when a designer or CMS requires PNG.",
    },
  ],
  "image-compressor": [
    {
      question: "What size should I compress images to for a website?",
      answer:
        "Aim under 200–500 KB for hero images and even smaller for cards. This image compressor lets you set quality and max width (for example 1920px) and compare before/after size.",
    },
    {
      question: "Does compressing images hurt SEO?",
      answer:
        "Oversized images slow LCP and hurt rankings. Sensible compression improves Core Web Vitals. Preview the result so text and faces stay sharp.",
    },
  ],
  "pdf-merge": [
    {
      question: "Can I merge PDFs without Adobe Acrobat?",
      answer:
        "Yes. This free PDF merge tool combines files in your browser with pdf-lib — no Acrobat, no account, and no upload to Ranburg servers.",
    },
    {
      question: "Is there a file limit for merging PDFs?",
      answer:
        "Limits depend on your device memory. For large scans, merge in smaller batches or compress PDFs first with the PDF compressor.",
    },
  ],
  "json-formatter": [
    {
      question: "Is this JSON formatter safe for API secrets?",
      answer:
        "Formatting runs in your browser with JSON.parse / JSON.stringify. We do not upload the payload. Still avoid pasting production secrets into any shared screen.",
    },
  ],
  "password-generator": [
    {
      question: "How long should a generated password be?",
      answer:
        "Use 16–24 characters with mixed case, numbers, and symbols for email and banking. Save the result in a password manager — do not reuse it.",
    },
    {
      question: "Are these passwords stored on Ranburg?",
      answer:
        "No. Generation is client-side. Refreshing the page creates a new password; we do not save what you generate.",
    },
  ],
  "qr-generator": [
    {
      question: "Can I create a Wi-Fi QR code for guests?",
      answer:
        "Yes. Encode the network name and password, then print the PNG/SVG. Test a scan from a second phone before you put it on a poster.",
    },
  ],
  "currency-converter": [
    {
      question: "Are these live mid-market exchange rates?",
      answer:
        "Rates come from a public FX source when the tool is online and are for planning, not bank settlement. Add your payment provider’s spread when quoting clients.",
    },
  ],
  "youtube-channel-insights": [
    {
      question: "Do I need to log into YouTube to analyze a channel?",
      answer:
        "No. Paste a public channel URL or @handle. Only public stats are requested — we never ask for your Google password.",
    },
  ],
  "instagram-profile-insights": [
    {
      question: "Can I analyze a private Instagram account?",
      answer:
        "No. Only public profiles can be fetched. We do not ask you to log into Instagram.",
    },
  ],
};

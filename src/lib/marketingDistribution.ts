import { SITE } from "@/lib/siteConfig";
import { PRIORITY_INDEX_TOOL_SLUGS, TOOL_PRIMARY_KEYWORDS } from "@/lib/seoGrowthConfig";

/** Short-form video scripts (30–60s) for YouTube Shorts / Reels / TikTok. */
export const SHORT_FORM_DEMO_SCRIPTS = PRIORITY_INDEX_TOOL_SLUGS.slice(0, 8).map((slug) => {
  const keyword = TOOL_PRIMARY_KEYWORDS[slug] ?? slug;
  const url = `${SITE.url}/tools/${slug}`;
  return {
    slug,
    title: `${keyword} in 30 seconds`,
    hook: `Stop guessing — here's a free ${keyword}.`,
    beats: [
      `Show the Ranburg tool UI for ${keyword}.`,
      "Enter one realistic example (India-friendly numbers where relevant).",
      "Highlight the result / download / copy action.",
      `CTA: Link in bio → ${url}`,
    ],
    caption: `Free ${keyword} — no signup. Try it: ${url} #Ranburg #FreeTools`,
    url,
  };
});

/** Directory / launch listing copy. */
export const DIRECTORY_LISTINGS = {
  productHunt: {
    name: "Ranburg",
    tagline: "81+ free browser tools for creators, finance & developers",
    description: `Ranburg is a free online toolkit: EMI/SIP/GST calculators, YouTube & Instagram analytics, hashtag generators, image/PDF utilities, and developer formatters. Everything runs in your browser — no account required.\n\nBuilt for people who bookmark tools and come back daily.`,
    topics: ["Productivity", "Developer Tools", "SEO Tools"],
    url: SITE.url,
  },
  alternativeTo: {
    name: "Ranburg",
    alternativesTo: ["TinyWow", "iLoveIMG", "Omni Calculator", "SmallSEOTools"],
    description:
      "Free all-in-one online tools suite focused on calculators, social analytics, and file utilities with privacy-first browser processing.",
    url: SITE.url,
  },
  indieHackers: {
    title: "Show IH: Ranburg — free tools site aiming for AdSense via SEO",
    body: `We shipped https://www.ranburg.com with 81+ free tools (finance calculators, YT/IG analytics, PDF/image utils).\n\nGoal: rank long-tail tool queries → AdSense.\nLooking for feedback on tool quality and which niches to double down on.`,
  },
};

/** Community reply templates (value-first, not spam). */
export const COMMUNITY_REPLY_TEMPLATES = [
  {
    context: "Someone asks for a free EMI / SIP calculator",
    reply: `You can try the free EMI/SIP calculators at ${SITE.url}/tools/emi and ${SITE.url}/tools/sip — runs in the browser, no signup.`,
  },
  {
    context: "Someone needs YouTube revenue / channel stats",
    reply: `For a quick public-channel read + revenue estimate: ${SITE.url}/tools/youtube-channel-insights and ${SITE.url}/tools/youtube-revenue-calculator.`,
  },
  {
    context: "Someone needs JPG/PNG or image compress",
    reply: `Browser-side converters/compressor (no upload to a server): ${SITE.url}/tools/jpg-to-png and ${SITE.url}/tools/image-compressor.`,
  },
];

/** Pinterest pin ideas for finance tools. */
export const PINTEREST_PIN_IDEAS = [
  {
    title: "EMI Calculator — Free Online",
    description: `Estimate monthly EMI for home/car loans. Free tool: ${SITE.url}/tools/emi`,
    board: "Personal Finance India",
  },
  {
    title: "SIP Returns Calculator",
    description: `Project SIP corpus online. Free: ${SITE.url}/tools/sip`,
    board: "Investing Basics",
  },
  {
    title: "GST Calculator India",
    description: `Inclusive/exclusive GST breakdown. Free: ${SITE.url}/tools/gst-calculator`,
    board: "Small Business India",
  },
];

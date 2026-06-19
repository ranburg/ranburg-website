import type { ToolConfig } from "./toolsConfig";
import { TOOLS_CONFIG } from "./toolsConfig";

export interface SeoCategoryHub {
  slug: string;
  label: string;
  headline: string;
  description: string;
  intro: string;
  icon: string;
  gradient: string;
  keywords: string[];
  relatedSlugs: string[];
  faq: { question: string; answer: string }[];
}

export const SEO_CATEGORY_SLUGS = [
  "seo",
  "developer",
  "text",
  "business",
  "calculators",
  "generators",
] as const;

export type SeoCategorySlug = (typeof SEO_CATEGORY_SLUGS)[number];

/** Maps each tool slug to one or more SEO category hubs */
export const TOOL_SEO_CATEGORY_MAP: Record<string, SeoCategorySlug[]> = {
  "linkedin-formatter": ["seo", "text", "business"],
  "lorem-ipsum": ["seo", "text", "generators"],
  "case-converter": ["seo", "text"],
  "glassmorphism-generator": ["seo", "generators"],
  "json-formatter": ["developer"],
  "sql-formatter": ["developer"],
  minifier: ["developer"],
  "regex-tester": ["developer"],
  "uuid-generator": ["developer", "generators"],
  "password-generator": ["developer", "generators"],
  "base64-encoder": ["developer", "text"],
  "image-converter": ["developer"],
  "pdf-tools": ["business"],
  "qr-generator": ["generators", "business"],
  "unit-converter": ["business", "calculators"],
  sip: ["calculators", "business"],
  swp: ["calculators", "business"],
  emi: ["calculators", "business"],
  "ltv-cac": ["calculators", "business"],
  "twitch-sub-revenue": ["calculators", "business"],
  "age-calculator": ["calculators"],
  "currency-converter": ["calculators", "business"],
  "gst-calculator": ["calculators", "business"],
  "cron-generator": ["developer", "generators"],
  "formula-generator": ["developer", "generators"],
  "soql-builder": ["developer", "generators"],
  "validation-rule-generator": ["developer", "generators"],
  "apex-test-generator": ["developer", "generators"],
  "flow-formula-builder": ["developer", "generators"],
  "date-formula-helper": ["developer"],
  "governor-limits-calculator": ["calculators", "developer"],
  "omnistudio-expression-builder": ["developer", "generators"],
  "revenue-cloud-pricing-calculator": ["calculators", "business"],
};

export const SEO_CATEGORY_HUBS: SeoCategoryHub[] = [
  {
    slug: "seo",
    label: "SEO Tools",
    headline: "Free SEO Tools for Content & Web Professionals",
    description:
      "Optimize content, formatting, and on-page elements with free SEO utilities — no signup, instant results in your browser.",
    intro: `Ranburg's free SEO tools help marketers, content writers, and web professionals polish copy, structure pages, and speed up everyday optimization tasks without expensive subscriptions. Whether you are drafting meta-friendly text, previewing social hooks, or generating placeholder content for wireframes, each tool runs entirely in your browser so your data stays private.

Our SEO toolkit focuses on practical utilities that support on-page SEO workflows: formatting LinkedIn posts for engagement, converting text cases for URLs and titles, generating Lorem Ipsum for design mockups, and building glassmorphism CSS for modern landing pages. These tools complement your primary SEO stack — they do not replace keyword research platforms, but they remove friction from content production.

Every tool is free, fast, and mobile-friendly. Results update instantly as you type, with one-click copy for easy paste into CMS, social schedulers, or code editors. Ranburg builds these utilities to demonstrate our engineering quality while helping professionals worldwide work smarter.

Bookmark your favorites and explore related developer and text tools to complete your workflow. New SEO utilities are added regularly based on search demand and user feedback.`,
    icon: "Search",
    gradient: "from-emerald-500 to-teal-500",
    keywords: ["SEO tools", "free SEO tools", "content optimization", "on-page SEO"],
    relatedSlugs: ["text", "developer", "generators"],
    faq: [
      { question: "Are Ranburg SEO tools free?", answer: "Yes. All SEO tools on Ranburg.com are free with no account required." },
      { question: "Is my content sent to a server?", answer: "Most tools process data locally in your browser. Your text never leaves your device unless a tool explicitly fetches external data." },
      { question: "Can I use these tools for client work?", answer: "Yes. You may use outputs freely for personal and commercial projects." },
      { question: "Do these tools replace Ahrefs or Semrush?", answer: "No. They complement keyword and analytics platforms by handling formatting, text, and utility tasks." },
      { question: "How often are new SEO tools added?", answer: "We publish new utilities based on search trends and user requests. Check the Recently Added section on the tools hub." },
    ],
  },
  {
    slug: "developer",
    label: "Developer Tools",
    headline: "Free Online Developer Tools",
    description:
      "Format JSON, test regex, encode Base64, build SOQL, and more — browser-based developer utilities trusted by engineers.",
    intro: `Ranburg developer tools are built for software engineers, Salesforce admins, and technical teams who need reliable utilities without installing desktop apps. From JSON and SQL formatters to regex testers, UUID generators, and Salesforce-specific builders, every tool delivers instant feedback in a clean interface optimized for daily development work.

Privacy matters: the majority of our developer utilities run client-side using modern browser APIs. Your source code, queries, and test data are not uploaded to Ranburg servers. This makes our tools safe for prototyping with sample data and debugging production-like payloads in sandbox environments.

The collection spans general-purpose utilities and Salesforce-specialized generators including SOQL builders, Apex test scaffolds, cron expression generators, and OmniStudio expression helpers. Whether you are a full-stack developer, DevOps engineer, or Salesforce consultant, you will find tools that save hours of repetitive formatting and boilerplate writing.

All tools are responsive, keyboard-friendly where applicable, and include SEO-rich documentation below each utility so you can learn while you work. Explore calculators and generators categories for related utilities, or use the site-wide search to jump directly to any tool.`,
    icon: "Code2",
    gradient: "from-blue-500 to-indigo-500",
    keywords: ["developer tools", "online dev tools", "JSON formatter", "regex tester"],
    relatedSlugs: ["generators", "calculators", "text"],
    faq: [
      { question: "Which programming languages are supported?", answer: "Tools target web standards: JavaScript regex, JSON, SQL formatting, Base64, and Salesforce-specific languages like SOQL and Apex." },
      { question: "Are developer tools free?", answer: "Yes. Every developer tool on Ranburg.com is free to use." },
      { question: "Can I use these at work?", answer: "Yes. Outputs are yours to use in personal and commercial projects." },
      { question: "Do tools work offline?", answer: "After the page loads, most tools work without network access except currency and similar API-backed utilities." },
      { question: "Where are Salesforce tools?", answer: "Salesforce-specific utilities appear here and in the dedicated Salesforce Tool Hub at /tools/salesforce." },
    ],
  },
  {
    slug: "text",
    label: "Text Tools",
    headline: "Free Online Text Tools",
    description:
      "Convert case, format LinkedIn posts, generate placeholder text, and encode strings — fast text utilities for writers and developers.",
    intro: `Text tools on Ranburg.com help writers, marketers, and developers manipulate strings quickly without spreadsheet formulas or one-off scripts. Convert between camelCase, snake_case, and Title Case; preview LinkedIn hooks; generate Lorem Ipsum paragraphs; or encode text to Base64 — all in one bookmarkable toolkit.

Each utility is designed for speed: paste your text, get results instantly, and copy with one click. Advanced options are available where power users need finer control, such as custom Lorem Ipsum counts or Unicode-aware case conversion. Because processing happens in your browser, confidential drafts and client copy remain on your device.

Text utilities bridge creative and technical workflows. Content teams use case converters for URL slugs and API field names. Social media managers preview LinkedIn formatting before publishing. Designers generate placeholder copy for Figma and Webflow mockups. Developers embed Base64 strings directly into HTML and CSS prototypes.

Explore related SEO and developer categories for overlapping utilities, or search the full catalog from the tools hub. Ranburg adds text tools based on real search demand to keep the collection practical and high-quality.`,
    icon: "Type",
    gradient: "from-violet-500 to-purple-500",
    keywords: ["text tools", "case converter", "text formatter", "online text utility"],
    relatedSlugs: ["seo", "developer", "generators"],
    faq: [
      { question: "Do text tools support Unicode and emoji?", answer: "Yes. Case conversion and encoding tools handle Unicode characters including emoji and accented letters." },
      { question: "Is there a character limit?", answer: "Browser memory applies practical limits, but typical article-length text works without issue." },
      { question: "Are text tools free?", answer: "Yes. All text utilities are free with no registration." },
      { question: "Can I format LinkedIn posts?", answer: "Yes. Use the LinkedIn Formatter for hook previews, character counts, and Unicode bold styling." },
      { question: "Which text tool is best for URLs?", answer: "The Case Converter produces kebab-case and snake_case slugs ideal for URLs and file names." },
    ],
  },
  {
    slug: "business",
    label: "Business Tools",
    headline: "Free Business & Productivity Tools",
    description:
      "Currency conversion, GST calculation, PDF utilities, and business metrics — free tools for founders, finance, and operations teams.",
    intro: `Business tools on Ranburg.com support founders, finance teams, freelancers, and operations professionals with calculators and utilities that simplify everyday decisions. Convert currencies with live ECB reference rates, calculate India GST inclusive and exclusive amounts, merge PDF documents client-side, or model SaaS metrics like LTV and CAC — without spreadsheets or paid SaaS subscriptions.

Our business toolkit emphasizes accuracy and transparency. Financial calculators display formulas and assumptions so you understand every output. GST tools support standard India tax slabs with CGST/SGST splits for intra-state transactions. PDF utilities process files locally, keeping contracts and invoices private on your machine.

Whether you are preparing investor updates, quoting international clients, or estimating creator revenue, these tools deliver fast answers you can screenshot, export, or discuss in meetings. Each page includes detailed SEO content, FAQs, and links to related calculators so you can explore the full Ranburg toolkit in one session.

Ranburg also offers custom software and Salesforce consulting for teams that outgrow spreadsheets. Business tools remain free forever as part of our commitment to useful, discoverable web utilities.`,
    icon: "BarChart3",
    gradient: "from-amber-500 to-orange-500",
    keywords: ["business tools", "GST calculator", "currency converter", "PDF tools"],
    relatedSlugs: ["calculators", "generators", "seo"],
    faq: [
      { question: "Are business calculators accurate?", answer: "Calculators use standard formulas documented on each page. Financial outputs are estimates, not professional tax or investment advice." },
      { question: "Is GST calculated for India only?", answer: "Yes. The GST calculator supports India CGST/SGST slabs at 5%, 12%, 18%, and 28%." },
      { question: "Are PDF files uploaded to Ranburg?", answer: "No. PDF merge and extract tools run entirely in your browser." },
      { question: "Can I use these for my company?", answer: "Yes. Commercial use of tool outputs is permitted." },
      { question: "Do you offer custom business software?", answer: "Yes. Contact Ranburg for Salesforce consulting and custom development engagements." },
    ],
  },
  {
    slug: "calculators",
    label: "Calculators",
    headline: "Free Online Calculators",
    description:
      "SIP, SWP, EMI, GST, age, currency, and SaaS metric calculators — accurate, instant, and free.",
    intro: `Ranburg calculators help individuals and businesses model financial scenarios, tax amounts, ages, and operational metrics in seconds. From mutual fund SIP projections and loan EMI breakdowns to India GST splits and live currency conversion, each calculator combines intuitive sliders and inputs with clear result cards and optional advanced settings like inflation adjustment.

Every calculator page documents the formula used, step-by-step instructions, benefits, common use cases, and FAQs — so you learn the math behind the numbers while getting instant answers. Charts and breakdowns appear where they add clarity, such as principal versus interest over loan tenure or corpus depletion in systematic withdrawal plans.

Calculators are optimized for mobile use, making them easy to reference in meetings, on calls with clients, or while comparison shopping for loans and investments. Results are indicative estimates; always consult qualified professionals for tax, legal, and investment decisions.

Browse related business and developer tools for PDF utilities, unit conversion, and Salesforce governor limit planning. New calculators are added based on organic search demand and user requests.`,
    icon: "Calculator",
    gradient: "from-cyan-500 to-blue-500",
    keywords: ["online calculator", "SIP calculator", "EMI calculator", "GST calculator"],
    relatedSlugs: ["business", "generators", "developer"],
    faq: [
      { question: "Are Ranburg calculators free?", answer: "Yes. All calculators are free with no account required." },
      { question: "Is financial output guaranteed?", answer: "No. Calculators provide estimates based on your inputs. Past performance does not guarantee future returns." },
      { question: "Which calculators support India?", answer: "GST, SIP/SWP (INR formatting), and EMI calculators are optimized for Indian users." },
      { question: "Can I share calculator results?", answer: "Yes. Screenshot or copy results freely." },
      { question: "How do live currency rates work?", answer: "The currency converter fetches ECB reference rates via the Frankfurter API on business days." },
    ],
  },
  {
    slug: "generators",
    label: "Generators",
    headline: "Free Online Generators",
    description:
      "UUID, password, QR code, Lorem Ipsum, Salesforce formula, and code generators — create output instantly.",
    intro: `Generator tools on Ranburg.com produce ready-to-use output in one click: cryptographically secure UUIDs, strong passwords, QR codes for URLs and WiFi, Lorem Ipsum placeholder text, CSS glassmorphism snippets, and Salesforce formulas, SOQL, Apex tests, and validation rules. Generators eliminate boilerplate so you ship faster.

Security-sensitive generators use crypto.getRandomValues() for randomness. Password and UUID tools never transmit secrets to our servers. QR codes render to canvas for PNG download. Salesforce generators follow platform syntax conventions documented on each page with copy-ready output.

Whether you need a quick QR code for a marketing campaign, bulk UUIDs for database seeding, or a validation rule template for a Salesforce sandbox, Ranburg generators deliver consistent quality with SEO-rich documentation below each tool. Related developer and calculator categories offer complementary utilities for formatting, testing, and financial modeling.

Explore the full catalog via search or category navigation. Generators are free, mobile-responsive, and updated as platforms evolve.`,
    icon: "Sparkles",
    gradient: "from-pink-500 to-rose-500",
    keywords: ["generator tools", "UUID generator", "QR code generator", "password generator"],
    relatedSlugs: ["developer", "text", "calculators"],
    faq: [
      { question: "Are generated passwords secure?", answer: "Yes. Passwords use crypto.getRandomValues() and are never stored or transmitted." },
      { question: "Can I generate bulk UUIDs?", answer: "Yes. The UUID generator supports up to 100 IDs per batch." },
      { question: "Do QR codes expire?", answer: "Static QR codes encode your data directly and work indefinitely." },
      { question: "Are Salesforce generators production-ready?", answer: "Outputs are starting points. Always review generated Apex, SOQL, and rules in a sandbox before deployment." },
      { question: "Are generators free?", answer: "Yes. Every generator on Ranburg.com is free." },
    ],
  },
];

export function isSeoCategorySlug(slug: string): slug is SeoCategorySlug {
  return (SEO_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function getSeoCategoryHub(slug: string): SeoCategoryHub | undefined {
  return SEO_CATEGORY_HUBS.find((c) => c.slug === slug);
}

export function getToolsForSeoCategory(slug: SeoCategorySlug): ToolConfig[] {
  return TOOLS_CONFIG.filter((t) => TOOL_SEO_CATEGORY_MAP[t.slug]?.includes(slug));
}

export function getPrimarySeoCategoryForTool(toolSlug: string): SeoCategoryHub | undefined {
  const slugs = TOOL_SEO_CATEGORY_MAP[toolSlug];
  if (!slugs?.length) {
    const tool = TOOLS_CONFIG.find((t) => t.slug === toolSlug);
    if (!tool) return undefined;
    const fallback: Record<string, SeoCategorySlug> = {
      financial: "calculators",
      developer: "developer",
      salesforce: "developer",
      design: "seo",
      productivity: "business",
    };
    return getSeoCategoryHub(fallback[tool.category] ?? "developer");
  }
  return getSeoCategoryHub(slugs[0]);
}

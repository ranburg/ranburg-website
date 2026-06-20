import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOPICS = [
  // YouTube Tools (10)
  { slug: "youtube-channel-stats-checker-free", title: "How to Check Any YouTube Channel Stats for Free (No Login)", keyword: "youtube channel stats checker", tools: ["youtube-channel-insights", "youtube-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  { slug: "youtube-rpm-explained", title: "YouTube RPM Explained: What Creators Earn Per 1,000 Views", keyword: "youtube rpm meaning", tools: ["youtube-revenue-calculator", "youtube-channel-insights"], category: "creators", cluster: "YouTube Tools" },
  { slug: "how-much-do-youtubers-make", title: "How Much Do YouTubers Make? Realistic Earnings by Niche", keyword: "how much do youtubers make", tools: ["youtube-revenue-calculator", "youtube-channel-insights"], category: "creators", cluster: "YouTube Tools" },
  { slug: "youtube-monetization-requirements-2026", title: "YouTube Monetization Requirements in 2026", keyword: "youtube monetization requirements", tools: ["youtube-channel-insights", "youtube-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  { slug: "grow-youtube-channel-0-to-1000-subscribers", title: "How to Grow a YouTube Channel from 0 to 1,000 Subscribers", keyword: "how to grow youtube channel", tools: ["youtube-channel-insights", "youtube-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  { slug: "youtube-shorts-vs-long-form-rpm", title: "YouTube Shorts vs Long-Form: Which Earns More Ad Revenue?", keyword: "youtube shorts rpm vs long form", tools: ["youtube-revenue-calculator", "youtube-channel-insights"], category: "creators", cluster: "YouTube Tools" },
  { slug: "estimate-youtube-ad-revenue-before-monetization", title: "How to Estimate YouTube Ad Revenue Before Monetization", keyword: "youtube revenue estimator", tools: ["youtube-revenue-calculator", "youtube-channel-insights"], category: "creators", cluster: "YouTube Tools" },
  { slug: "youtube-analytics-metrics-to-track", title: "YouTube Analytics Metrics Every Creator Should Track Weekly", keyword: "youtube analytics metrics", tools: ["youtube-channel-insights", "youtube-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  { slug: "youtube-sponsorship-rates-by-subscribers", title: "YouTube Sponsorship Rates: How to Price Brand Deals", keyword: "youtube sponsorship rates", tools: ["youtube-revenue-calculator", "instagram-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  { slug: "twitch-vs-youtube-streaming-income", title: "Twitch vs YouTube Streaming Income Comparison", keyword: "twitch vs youtube income", tools: ["twitch-sub-revenue", "youtube-revenue-calculator"], category: "creators", cluster: "YouTube Tools" },
  // Instagram Tools (10)
  { slug: "instagram-follower-count-checker", title: "How to Check Instagram Follower Count for Any Public Profile", keyword: "instagram follower count checker", tools: ["instagram-profile-insights", "instagram-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-engagement-rate-calculator", title: "Instagram Engagement Rate: How to Calculate It", keyword: "instagram engagement rate calculator", tools: ["instagram-profile-insights", "instagram-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-influencer-earnings", title: "How Much Do Instagram Influencers Make?", keyword: "instagram influencer earnings", tools: ["instagram-revenue-calculator", "instagram-profile-insights"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-reels-strategy", title: "Instagram Reels Strategy for Follower Growth", keyword: "instagram reels strategy", tools: ["instagram-profile-insights", "instagram-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "micro-vs-macro-influencer-rates", title: "Micro-Influencer vs Macro-Influencer Earnings", keyword: "micro influencer rates", tools: ["instagram-revenue-calculator", "instagram-profile-insights"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-sponsored-post-rates-2026", title: "How to Price Instagram Sponsored Posts in 2026", keyword: "instagram sponsored post rates", tools: ["instagram-revenue-calculator", "instagram-profile-insights"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-analytics-small-business", title: "Instagram Analytics for Small Businesses: 7 Key Metrics", keyword: "instagram analytics for business", tools: ["instagram-profile-insights", "qr-generator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "grow-instagram-followers-organically", title: "How to Grow Instagram Followers Organically", keyword: "how to grow instagram followers", tools: ["instagram-profile-insights", "instagram-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "instagram-affiliate-marketing-income", title: "Instagram Affiliate Marketing Income by Niche", keyword: "instagram affiliate marketing income", tools: ["instagram-revenue-calculator", "adsense-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  { slug: "creator-economy-youtube-instagram-revenue", title: "Creator Economy: YouTube and Instagram Revenue Streams", keyword: "creator economy income streams", tools: ["instagram-revenue-calculator", "youtube-revenue-calculator"], category: "creators", cluster: "Instagram Tools" },
  // SEO Tools (10)
  { slug: "linkedin-post-formatter-guide", title: "LinkedIn Post Formatter: Write Posts That Get More Engagement", keyword: "linkedin post formatter", tools: ["linkedin-formatter", "case-converter"], category: "seo", cluster: "SEO Tools" },
  { slug: "lorem-ipsum-generator-guide", title: "Lorem Ipsum Generator: When to Use Placeholder Text", keyword: "lorem ipsum generator", tools: ["lorem-ipsum", "linkedin-formatter"], category: "seo", cluster: "SEO Tools" },
  { slug: "title-case-vs-sentence-case-seo", title: "Title Case vs Sentence Case: SEO and Readability Best Practices", keyword: "title case vs sentence case", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "SEO Tools" },
  { slug: "on-page-seo-checklist-blog-posts", title: "On-Page SEO Checklist for Blog Posts", keyword: "on page seo checklist", tools: ["linkedin-formatter", "case-converter"], category: "seo", cluster: "SEO Tools" },
  { slug: "meta-description-examples-higher-ctr", title: "How to Optimize Meta Descriptions for Higher CTR", keyword: "meta description examples", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "SEO Tools" },
  { slug: "content-formatting-for-seo", title: "Content Formatting for SEO: Headings, Lists, and Readability", keyword: "content formatting seo", tools: ["case-converter", "lorem-ipsum"], category: "seo", cluster: "SEO Tools" },
  { slug: "glassmorphism-css-web-design", title: "Glassmorphism in Web Design: CSS Trends That Improve UX", keyword: "glassmorphism css", tools: ["glassmorphism-generator", "image-converter"], category: "seo", cluster: "SEO Tools" },
  { slug: "seo-friendly-social-media-captions", title: "How to Write SEO-Friendly Social Media Captions", keyword: "seo friendly social captions", tools: ["linkedin-formatter", "instagram-profile-insights"], category: "seo", cluster: "SEO Tools" },
  { slug: "programmatic-seo-tool-pages", title: "Programmatic SEO Basics: How Tool Pages Rank on Google", keyword: "programmatic seo tools", tools: ["linkedin-formatter", "lorem-ipsum"], category: "seo", cluster: "SEO Tools" },
  { slug: "internal-linking-strategy-tool-websites", title: "Internal Linking Strategy for Free Tool Websites", keyword: "internal linking strategy", tools: ["linkedin-formatter", "case-converter"], category: "seo", cluster: "SEO Tools" },
  // Business Calculators (10)
  { slug: "sip-calculator-india-guide", title: "SIP Calculator Guide: Estimate Mutual Fund Returns in India", keyword: "sip calculator india", tools: ["sip", "swp"], category: "calculators", cluster: "Business Calculators" },
  { slug: "swp-calculator-withdrawal-guide", title: "SWP Calculator: How Much Can You Withdraw Monthly?", keyword: "swp calculator", tools: ["swp", "sip"], category: "calculators", cluster: "Business Calculators" },
  { slug: "home-loan-emi-calculator-guide", title: "Home Loan EMI Calculator: Formula and Affordability Tips", keyword: "home loan emi calculator", tools: ["emi", "loan-foreclosure-calculator"], category: "calculators", cluster: "Business Calculators" },
  { slug: "gst-calculator-india-inclusive-exclusive", title: "GST Calculator India: Inclusive vs Exclusive GST Explained", keyword: "gst calculator india", tools: ["gst-calculator", "invoice-generator"], category: "calculators", cluster: "Business Calculators" },
  { slug: "gst-invoice-format-india", title: "How to Create a GST Invoice in India (Free Template)", keyword: "gst invoice format", tools: ["invoice-generator", "gst-calculator"], category: "calculators", cluster: "Business Calculators" },
  { slug: "loan-foreclosure-calculator-guide", title: "Loan Foreclosure Calculator: Is Early Closure Worth It?", keyword: "loan foreclosure calculator", tools: ["loan-foreclosure-calculator", "emi"], category: "calculators", cluster: "Business Calculators" },
  { slug: "ltv-cac-ratio-explained", title: "LTV to CAC Ratio Explained for SaaS and E-Commerce", keyword: "ltv cac ratio", tools: ["ltv-cac", "instagram-revenue-calculator"], category: "calculators", cluster: "Business Calculators" },
  { slug: "currency-converter-live-rates-guide", title: "Currency Converter Guide: How Exchange Rates Work", keyword: "currency converter live rates", tools: ["currency-converter", "gst-calculator"], category: "calculators", cluster: "Business Calculators" },
  { slug: "age-calculator-online-guide", title: "Age Calculator for Forms, Insurance, and HR", keyword: "age calculator online", tools: ["age-calculator", "emi"], category: "calculators", cluster: "Business Calculators" },
  { slug: "unit-converter-cheat-sheet", title: "Unit Converter Cheat Sheet for Business", keyword: "unit converter online", tools: ["unit-converter", "currency-converter"], category: "calculators", cluster: "Business Calculators" },
  // Developer Tools (10)
  { slug: "json-formatter-online-guide", title: "JSON Formatter Online: Pretty-Print and Validate JSON", keyword: "json formatter online", tools: ["json-formatter", "minifier"], category: "development", cluster: "Developer Tools" },
  { slug: "sql-formatter-beautify-queries", title: "SQL Formatter: How to Beautify SQL Queries", keyword: "sql formatter online", tools: ["sql-formatter", "json-formatter"], category: "development", cluster: "Developer Tools" },
  { slug: "javascript-minifier-page-speed", title: "JavaScript CSS Minifier: Does Minification Improve Speed?", keyword: "javascript minifier", tools: ["minifier", "json-formatter"], category: "development", cluster: "Developer Tools" },
  { slug: "regex-tester-common-patterns", title: "Regex Tester Guide: Common Patterns for Developers", keyword: "regex tester online", tools: ["regex-tester", "json-formatter"], category: "development", cluster: "Developer Tools" },
  { slug: "uuid-generator-api-databases", title: "UUID Generator: When to Use UUID v4 in APIs", keyword: "uuid generator", tools: ["uuid-generator", "password-generator"], category: "development", cluster: "Developer Tools" },
  { slug: "base64-encode-decode-guide", title: "Base64 Encode and Decode: Practical Use Cases", keyword: "base64 encode decode", tools: ["base64-encoder", "json-formatter"], category: "development", cluster: "Developer Tools" },
  { slug: "convert-image-to-webp-avif", title: "How to Convert Images to WebP and AVIF for Faster Sites", keyword: "convert image to webp", tools: ["image-converter", "minifier"], category: "development", cluster: "Developer Tools" },
  { slug: "cron-expression-generator-guide", title: "Cron Expression Generator: Schedule Jobs Without Guesswork", keyword: "cron expression generator", tools: ["cron-generator", "regex-tester"], category: "development", cluster: "Developer Tools" },
  { slug: "json-vs-xml-vs-yaml", title: "JSON vs XML vs YAML: Which Format Should Your API Use?", keyword: "json vs xml api", tools: ["json-formatter", "sql-formatter"], category: "development", cluster: "Developer Tools" },
  { slug: "free-developer-tools-online", title: "Developer Productivity Toolkit: 10 Free Browser Utilities", keyword: "free developer tools online", tools: ["json-formatter", "regex-tester"], category: "development", cluster: "Developer Tools" },
  // Text & Writing (10)
  { slug: "case-converter-online-guide", title: "Case Converter Online: Upper, Lower, Title, and Sentence Case", keyword: "case converter online", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "linkedin-hook-examples-formatting", title: "How to Write Better LinkedIn Hooks", keyword: "linkedin hook examples", tools: ["linkedin-formatter", "case-converter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "lorem-ipsum-alternatives", title: "Lorem Ipsum Alternatives for Designers and Writers", keyword: "lorem ipsum alternative", tools: ["lorem-ipsum", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "copywriting-formulas-blogs-ads", title: "Copywriting Formulas for Blogs, Ads, and Social Posts", keyword: "copywriting formulas", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "format-text-for-cms-publishing", title: "How to Clean and Format Text for CMS Publishing", keyword: "format text for cms", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "product-description-template-ecommerce", title: "Writing Product Descriptions for E-Commerce", keyword: "product description template", tools: ["lorem-ipsum", "invoice-generator"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "base64-text-encode-unicode", title: "Base64 for Text: Encoding Unicode Safely", keyword: "base64 text encode", tools: ["base64-encoder", "case-converter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "seo-headline-formulas", title: "Headline Writing for SEO: 12 Formulas That Increase Clicks", keyword: "seo headline formulas", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "repurpose-blog-into-social-posts", title: "How to Repurpose One Blog Post into 10 Social Updates", keyword: "repurpose blog content", tools: ["linkedin-formatter", "instagram-profile-insights"], category: "seo", cluster: "Text & Writing Tools" },
  { slug: "plain-language-writing-guide", title: "Plain Language Writing for Better Readability", keyword: "plain language writing", tools: ["case-converter", "linkedin-formatter"], category: "seo", cluster: "Text & Writing Tools" },
  // Online Generators (10)
  { slug: "qr-code-generator-free-guide", title: "QR Code Generator: Create QR Codes for Menus and Payments", keyword: "qr code generator free", tools: ["qr-generator", "password-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "strong-password-generator-guide", title: "Strong Password Generator: Create Secure Passwords", keyword: "strong password generator", tools: ["password-generator", "uuid-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "uuid-vs-guid-difference", title: "UUID vs GUID: What's the Difference?", keyword: "uuid vs guid", tools: ["uuid-generator", "password-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "glassmorphism-generator-css", title: "Glassmorphism CSS Generator: Copy-Paste UI Styles", keyword: "glassmorphism generator", tools: ["glassmorphism-generator", "image-converter"], category: "generators", cluster: "Online Generators" },
  { slug: "qr-code-business-cards-invoices", title: "How to Use QR Codes on Business Cards and Invoices", keyword: "qr code for business card", tools: ["qr-generator", "invoice-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "password-manager-vs-generator", title: "Password Manager vs Password Generator for Small Teams", keyword: "password manager vs generator", tools: ["password-generator", "uuid-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "lorem-ipsum-wireframes-mvp", title: "Lorem Ipsum Generator for Wireframes and MVP Pages", keyword: "lorem ipsum for wireframes", tools: ["lorem-ipsum", "glassmorphism-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "cron-job-examples-backups-reports", title: "Cron Job Examples for Backups, Reports, and API Sync", keyword: "cron job examples", tools: ["cron-generator", "json-formatter"], category: "generators", cluster: "Online Generators" },
  { slug: "free-online-generators-freelancers", title: "Free Online Generators Every Freelancer Should Bookmark", keyword: "free online generators", tools: ["qr-generator", "password-generator"], category: "generators", cluster: "Online Generators" },
  { slug: "generate-secure-api-keys", title: "How to Generate Secure API Keys for Side Projects", keyword: "generate api key", tools: ["uuid-generator", "password-generator"], category: "generators", cluster: "Online Generators" },
  // Digital Marketing (10)
  { slug: "free-social-media-analytics-tools", title: "Free Social Media Analytics Tools for Creators", keyword: "free social media analytics tools", tools: ["youtube-channel-insights", "instagram-profile-insights"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "creator-media-kit-template", title: "How to Build a Creator Media Kit Using Real Stats", keyword: "creator media kit template", tools: ["youtube-channel-insights", "instagram-profile-insights"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "linkedin-marketing-b2b-leads", title: "LinkedIn Marketing for B2B: Posts That Drive Leads", keyword: "linkedin marketing tips", tools: ["linkedin-formatter", "qr-generator"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "qr-code-marketing-campaigns", title: "QR Code Marketing Campaigns for Restaurants and Retail", keyword: "qr code marketing ideas", tools: ["qr-generator", "instagram-profile-insights"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "influencer-marketing-roi-formula", title: "How to Track ROI on Influencer Campaigns", keyword: "influencer marketing roi", tools: ["instagram-revenue-calculator", "ltv-cac"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "content-repurposing-youtube-instagram-linkedin", title: "Content Repurposing: YouTube to Instagram to LinkedIn", keyword: "content repurposing workflow", tools: ["youtube-channel-insights", "linkedin-formatter"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "small-business-digital-marketing-zero-budget", title: "Small Business Digital Marketing Stack on Zero Budget", keyword: "free marketing tools small business", tools: ["qr-generator", "invoice-generator"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "pdf-tools-client-proposals-invoices", title: "How to Use PDF Tools for Client Proposals and Invoices", keyword: "pdf tools online free", tools: ["pdf-tools", "invoice-generator"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "twitch-subscriber-revenue-guide", title: "Twitch Subscriber Revenue: How Streamers Estimate Income", keyword: "twitch sub revenue calculator", tools: ["twitch-sub-revenue", "youtube-revenue-calculator"], category: "digital-marketing", cluster: "Digital Marketing" },
  { slug: "digital-marketing-metrics-cheat-sheet", title: "Digital Marketing Metrics Cheat Sheet for Freelancers", keyword: "marketing metrics cheat sheet", tools: ["ltv-cac", "instagram-revenue-calculator"], category: "digital-marketing", cluster: "Digital Marketing" },
  // AdSense & Monetization (10)
  { slug: "adsense-revenue-calculator-guide", title: "Google AdSense Revenue Calculator: Estimate Blog Earnings", keyword: "adsense revenue calculator", tools: ["adsense-revenue-calculator", "youtube-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "good-adsense-rpm-2026", title: "What Is a Good RPM for AdSense in 2026?", keyword: "good adsense rpm", tools: ["adsense-revenue-calculator", "youtube-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "adsense-earnings-per-1000-views", title: "How Much Traffic for $100/Day with AdSense?", keyword: "adsense earnings per 1000 views", tools: ["adsense-revenue-calculator", "youtube-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "adsense-vs-youtube-ad-revenue", title: "AdSense vs YouTube Ad Revenue: Which Pays More?", keyword: "adsense vs youtube ads", tools: ["adsense-revenue-calculator", "youtube-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "increase-adsense-rpm-without-traffic", title: "How to Increase AdSense RPM Without More Traffic", keyword: "increase adsense rpm", tools: ["adsense-revenue-calculator", "linkedin-formatter"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "monetize-free-tool-website", title: "Website Monetization for Tool Sites: Ads and Affiliates", keyword: "monetize free tool website", tools: ["adsense-revenue-calculator", "qr-generator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "youtube-rpm-india-creators", title: "YouTube AdSense RPM by Country: India Creator Guide", keyword: "youtube rpm india", tools: ["youtube-revenue-calculator", "youtube-channel-insights"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "blog-niche-rpm-comparison", title: "Blog Niche RPM Comparison: Finance vs Tech vs Lifestyle", keyword: "blog niche rpm comparison", tools: ["adsense-revenue-calculator", "sip"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "forecast-annual-ad-revenue", title: "How to Forecast Annual Ad Revenue from Monthly Pageviews", keyword: "forecast ad revenue", tools: ["adsense-revenue-calculator", "instagram-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  { slug: "creator-income-diversification", title: "Creator Income Diversification: Ads, Sponsorships, Products", keyword: "creator income diversification", tools: ["youtube-revenue-calculator", "instagram-revenue-calculator"], category: "monetization", cluster: "AdSense & Monetization" },
  // Small Business Resources (10)
  { slug: "gst-invoice-rules-india-2026", title: "GST Invoice Rules for Small Businesses in India (2026)", keyword: "gst invoice rules india", tools: ["invoice-generator", "gst-calculator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "how-to-calculate-gst-services-goods", title: "How to Calculate GST on Services vs Goods", keyword: "how to calculate gst", tools: ["gst-calculator", "invoice-generator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "emi-vs-rent-calculator-2026", title: "Home Loan EMI vs Rent: Which Is Cheaper in 2026?", keyword: "emi vs rent calculator", tools: ["emi", "loan-foreclosure-calculator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "home-loan-prepayment-foreclosure-charges", title: "When to Prepay Your Home Loan: Foreclosure Charges Explained", keyword: "home loan prepayment rules", tools: ["loan-foreclosure-calculator", "emi"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "free-invoice-template-freelancers-india", title: "Free Invoice Template for Freelancers in India", keyword: "free invoice template india", tools: ["invoice-generator", "gst-calculator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "qr-code-upi-payment-small-shops", title: "How Small Shops Can Use QR Codes for UPI Payments", keyword: "qr code for upi payment", tools: ["qr-generator", "invoice-generator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "merge-pdf-online-free-business", title: "PDF Merge and Split for Business Documents", keyword: "merge pdf online free", tools: ["pdf-tools", "invoice-generator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "sip-vs-fd-vs-ppf-comparison", title: "SIP vs FD vs PPF: Where Should MSMEs Park Surplus Cash?", keyword: "sip vs fd vs ppf", tools: ["sip", "swp"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "startup-unit-economics-ltv-cac", title: "Startup Unit Economics: LTV, CAC, and Payback Period", keyword: "startup unit economics", tools: ["ltv-cac", "instagram-revenue-calculator"], category: "small-business", cluster: "Small Business Resources" },
  { slug: "free-tools-msmes-solopreneurs-india", title: "Essential Free Tools for Indian MSMEs and Solopreneurs", keyword: "free tools for small business india", tools: ["gst-calculator", "invoice-generator"], category: "small-business", cluster: "Small Business Resources" },
];

function angles(keyword, primaryTool) {
  const tool = primaryTool.replace(/-/g, " ");
  return [
    `Many professionals search for ${keyword} because spreadsheets and manual math slow down everyday decisions. Ranburg's free ${tool} delivers instant browser-based results without installing software.`,
    `Benchmarks for ${keyword} vary by industry, geography, and season. Track changes over time instead of relying on a single snapshot when planning campaigns, loans, or content strategy.`,
    `A common mistake is treating online estimates as legal, tax, or contract guarantees. Use Ranburg tools for planning and always confirm critical outcomes with official documents or qualified advisors.`,
    `Build a repeatable workflow: document inputs monthly, compare scenarios in the ${tool}, and pair results with related Ranburg utilities to strengthen decisions around ${keyword}.`,
  ];
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const header = `import type { BlogCategoryId } from "./blogCategories";

export interface SeoBlogTopic {
  slug: string;
  title: string;
  excerpt: string;
  keyword: string;
  searchIntent: string;
  tools: string[];
  category: BlogCategoryId;
  cluster: string;
  angle1: string;
  angle2: string;
  angle3: string;
  angle4: string;
  faqAccuracy: string;
  faq?: { question: string; answer: string }[];
}

export const SEO_BLOG_TOPICS: SeoBlogTopic[] = [
`;

const items = TOPICS.map((t) => {
  const a = angles(t.keyword, t.tools[0]);
  const excerpt = `${t.title}. Practical guide with step-by-step tips and Ranburg's free tools for ${t.keyword}.`;
  const uniqueTools = [...new Set(t.tools)];
  return `  {
    slug: "${esc(t.slug)}",
    title: "${esc(t.title)}",
    excerpt: "${esc(excerpt)}",
    keyword: "${esc(t.keyword)}",
    searchIntent: "Informational",
    tools: ${JSON.stringify(uniqueTools)},
    category: "${t.category}",
    cluster: "${esc(t.cluster)}",
    angle1: "${esc(a[0])}",
    angle2: "${esc(a[1])}",
    angle3: "${esc(a[2])}",
    angle4: "${esc(a[3])}",
    faqAccuracy: "${esc(`Results support planning around ${t.keyword} using industry-standard formulas and public data. Verify financial or compliance decisions with official sources.`)}",
  }`;
});

const out = header + items.join(",\n") + "\n];\n";
const target = path.join(__dirname, "..", "src", "lib", "seoBlogTopics.ts");
fs.writeFileSync(target, out);
console.log(`Wrote ${TOPICS.length} topics to ${target}`);

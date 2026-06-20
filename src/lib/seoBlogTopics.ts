import type { BlogCategoryId } from "./blogTypes";

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

type RawTopic = [string, string, string, string[], BlogCategoryId, string];

function buildAngles(keyword: string, primaryTool: string) {
  const tool = primaryTool.replace(/-/g, " ");
  return {
    angle1: `Professionals search for ${keyword} because manual research is slow and platform dashboards often lack comparison context. Ranburg's free ${tool} runs in your browser with instant results.`,
    angle2: `Benchmarks for ${keyword} shift by niche, season, and audience geography. Measure trends over weeks—not single snapshots—when planning content, loans, or campaigns.`,
    angle3: `Do not treat online estimates as tax, legal, or contract guarantees. Use Ranburg for planning; confirm critical decisions with official statements or qualified advisors.`,
    angle4: `Build a monthly workflow: record inputs, run the ${tool}, compare scenarios, and pair with related Ranburg utilities to improve decisions around ${keyword}.`,
    faqAccuracy: `Results support planning around ${keyword} using standard formulas and public data. Verify financial or compliance outcomes with official sources.`,
  };
}

function expand([slug, title, keyword, tools, category, cluster]: RawTopic): SeoBlogTopic {
  const uniqueTools = [...new Set(tools)];
  const angles = buildAngles(keyword, uniqueTools[0]);
  return {
    slug,
    title,
    excerpt: `${title}. Practical guide with step-by-step tips and Ranburg's free tools for ${keyword}.`,
    keyword,
    searchIntent: "Informational",
    tools: uniqueTools,
    category,
    cluster,
    ...angles,
  };
}

const RAW_TOPICS: RawTopic[] = [
  // YouTube Tools (10)
  ["youtube-channel-stats-checker-free", "How to Check Any YouTube Channel Stats for Free (No Login)", "youtube channel stats checker", ["youtube-channel-insights", "youtube-revenue-calculator"], "creators", "YouTube Tools"],
  ["youtube-rpm-explained", "YouTube RPM Explained: What Creators Earn Per 1,000 Views", "youtube rpm meaning", ["youtube-revenue-calculator", "youtube-channel-insights"], "creators", "YouTube Tools"],
  ["how-much-do-youtubers-make", "How Much Do YouTubers Make? Realistic Earnings by Niche", "how much do youtubers make", ["youtube-revenue-calculator", "youtube-channel-insights"], "creators", "YouTube Tools"],
  ["youtube-monetization-requirements-2026", "YouTube Monetization Requirements in 2026", "youtube monetization requirements", ["youtube-channel-insights", "youtube-revenue-calculator"], "creators", "YouTube Tools"],
  ["grow-youtube-channel-0-to-1000-subscribers", "How to Grow a YouTube Channel from 0 to 1,000 Subscribers", "how to grow youtube channel", ["youtube-channel-insights", "youtube-revenue-calculator"], "creators", "YouTube Tools"],
  ["youtube-shorts-vs-long-form-rpm", "YouTube Shorts vs Long-Form: Which Earns More Ad Revenue?", "youtube shorts rpm vs long form", ["youtube-revenue-calculator", "youtube-channel-insights"], "creators", "YouTube Tools"],
  ["estimate-youtube-ad-revenue-before-monetization", "How to Estimate YouTube Ad Revenue Before Monetization", "youtube revenue estimator", ["youtube-revenue-calculator", "youtube-channel-insights"], "creators", "YouTube Tools"],
  ["youtube-analytics-metrics-to-track", "YouTube Analytics Metrics Every Creator Should Track Weekly", "youtube analytics metrics", ["youtube-channel-insights", "youtube-revenue-calculator"], "creators", "YouTube Tools"],
  ["youtube-sponsorship-rates-by-subscribers", "YouTube Sponsorship Rates: How to Price Brand Deals", "youtube sponsorship rates", ["youtube-revenue-calculator", "instagram-revenue-calculator"], "creators", "YouTube Tools"],
  ["twitch-vs-youtube-streaming-income", "Twitch vs YouTube Streaming Income Comparison", "twitch vs youtube income", ["twitch-sub-revenue", "youtube-revenue-calculator"], "creators", "YouTube Tools"],
  // Instagram Tools (10)
  ["instagram-follower-count-checker", "How to Check Instagram Follower Count for Any Public Profile", "instagram follower count checker", ["instagram-profile-insights", "instagram-revenue-calculator"], "creators", "Instagram Tools"],
  ["instagram-engagement-rate-calculator", "Instagram Engagement Rate: How to Calculate It", "instagram engagement rate calculator", ["instagram-profile-insights", "instagram-revenue-calculator"], "creators", "Instagram Tools"],
  ["instagram-influencer-earnings", "How Much Do Instagram Influencers Make?", "instagram influencer earnings", ["instagram-revenue-calculator", "instagram-profile-insights"], "creators", "Instagram Tools"],
  ["instagram-reels-strategy", "Instagram Reels Strategy for Follower Growth", "instagram reels strategy", ["instagram-profile-insights", "instagram-revenue-calculator"], "creators", "Instagram Tools"],
  ["micro-vs-macro-influencer-rates", "Micro-Influencer vs Macro-Influencer Earnings", "micro influencer rates", ["instagram-revenue-calculator", "instagram-profile-insights"], "creators", "Instagram Tools"],
  ["instagram-sponsored-post-rates-2026", "How to Price Instagram Sponsored Posts in 2026", "instagram sponsored post rates", ["instagram-revenue-calculator", "instagram-profile-insights"], "creators", "Instagram Tools"],
  ["instagram-analytics-small-business", "Instagram Analytics for Small Businesses: 7 Key Metrics", "instagram analytics for business", ["instagram-profile-insights", "qr-generator"], "creators", "Instagram Tools"],
  ["grow-instagram-followers-organically", "How to Grow Instagram Followers Organically", "how to grow instagram followers", ["instagram-profile-insights", "instagram-revenue-calculator"], "creators", "Instagram Tools"],
  ["instagram-affiliate-marketing-income", "Instagram Affiliate Marketing Income by Niche", "instagram affiliate marketing income", ["instagram-revenue-calculator", "adsense-revenue-calculator"], "creators", "Instagram Tools"],
  ["creator-economy-youtube-instagram-revenue", "Creator Economy: YouTube and Instagram Revenue Streams", "creator economy income streams", ["instagram-revenue-calculator", "youtube-revenue-calculator"], "creators", "Instagram Tools"],
  // SEO Tools (10)
  ["linkedin-post-formatter-guide", "LinkedIn Post Formatter: Write Posts That Get More Engagement", "linkedin post formatter", ["linkedin-formatter", "case-converter"], "seo", "SEO Tools"],
  ["lorem-ipsum-generator-guide", "Lorem Ipsum Generator: When to Use Placeholder Text", "lorem ipsum generator", ["lorem-ipsum", "linkedin-formatter"], "seo", "SEO Tools"],
  ["title-case-vs-sentence-case-seo", "Title Case vs Sentence Case: SEO and Readability Best Practices", "title case vs sentence case", ["case-converter", "linkedin-formatter"], "seo", "SEO Tools"],
  ["on-page-seo-checklist-blog-posts", "On-Page SEO Checklist for Blog Posts", "on page seo checklist", ["linkedin-formatter", "case-converter"], "seo", "SEO Tools"],
  ["meta-description-examples-higher-ctr", "How to Optimize Meta Descriptions for Higher CTR", "meta description examples", ["case-converter", "linkedin-formatter"], "seo", "SEO Tools"],
  ["content-formatting-for-seo", "Content Formatting for SEO: Headings, Lists, and Readability", "content formatting seo", ["case-converter", "lorem-ipsum"], "seo", "SEO Tools"],
  ["glassmorphism-css-web-design", "Glassmorphism in Web Design: CSS Trends That Improve UX", "glassmorphism css", ["glassmorphism-generator", "image-converter"], "seo", "SEO Tools"],
  ["seo-friendly-social-media-captions", "How to Write SEO-Friendly Social Media Captions", "seo friendly social captions", ["linkedin-formatter", "instagram-profile-insights"], "seo", "SEO Tools"],
  ["programmatic-seo-tool-pages", "Programmatic SEO Basics: How Tool Pages Rank on Google", "programmatic seo tools", ["linkedin-formatter", "lorem-ipsum"], "seo", "SEO Tools"],
  ["internal-linking-strategy-tool-websites", "Internal Linking Strategy for Free Tool Websites", "internal linking strategy", ["linkedin-formatter", "case-converter"], "seo", "SEO Tools"],
  // Business Calculators (10)
  ["sip-calculator-india-guide", "SIP Calculator Guide: Estimate Mutual Fund Returns in India", "sip calculator india", ["sip", "swp"], "calculators", "Business Calculators"],
  ["swp-calculator-withdrawal-guide", "SWP Calculator: How Much Can You Withdraw Monthly?", "swp calculator", ["swp", "sip"], "calculators", "Business Calculators"],
  ["home-loan-emi-calculator-guide", "Home Loan EMI Calculator: Formula and Affordability Tips", "home loan emi calculator", ["emi", "loan-foreclosure-calculator"], "calculators", "Business Calculators"],
  ["gst-calculator-india-inclusive-exclusive", "GST Calculator India: Inclusive vs Exclusive GST Explained", "gst calculator india", ["gst-calculator", "invoice-generator"], "calculators", "Business Calculators"],
  ["gst-invoice-format-india", "How to Create a GST Invoice in India (Free Template)", "gst invoice format", ["invoice-generator", "gst-calculator"], "calculators", "Business Calculators"],
  ["loan-foreclosure-calculator-guide", "Loan Foreclosure Calculator: Is Early Closure Worth It?", "loan foreclosure calculator", ["loan-foreclosure-calculator", "emi"], "calculators", "Business Calculators"],
  ["ltv-cac-ratio-explained", "LTV to CAC Ratio Explained for SaaS and E-Commerce", "ltv cac ratio", ["ltv-cac", "instagram-revenue-calculator"], "calculators", "Business Calculators"],
  ["currency-converter-live-rates-guide", "Currency Converter Guide: How Exchange Rates Work", "currency converter live rates", ["currency-converter", "gst-calculator"], "calculators", "Business Calculators"],
  ["age-calculator-online-guide", "Age Calculator for Forms, Insurance, and HR", "age calculator online", ["age-calculator", "emi"], "calculators", "Business Calculators"],
  ["unit-converter-cheat-sheet", "Unit Converter Cheat Sheet for Business", "unit converter online", ["unit-converter", "currency-converter"], "calculators", "Business Calculators"],
  // Developer Tools (10)
  ["json-formatter-online-guide", "JSON Formatter Online: Pretty-Print and Validate JSON", "json formatter online", ["json-formatter", "minifier"], "development", "Developer Tools"],
  ["sql-formatter-beautify-queries", "SQL Formatter: How to Beautify SQL Queries", "sql formatter online", ["sql-formatter", "json-formatter"], "development", "Developer Tools"],
  ["javascript-minifier-page-speed", "JavaScript CSS Minifier: Does Minification Improve Speed?", "javascript minifier", ["minifier", "json-formatter"], "development", "Developer Tools"],
  ["regex-tester-common-patterns", "Regex Tester Guide: Common Patterns for Developers", "regex tester online", ["regex-tester", "json-formatter"], "development", "Developer Tools"],
  ["uuid-generator-api-databases", "UUID Generator: When to Use UUID v4 in APIs", "uuid generator", ["uuid-generator", "password-generator"], "development", "Developer Tools"],
  ["base64-encode-decode-guide", "Base64 Encode and Decode: Practical Use Cases", "base64 encode decode", ["base64-encoder", "json-formatter"], "development", "Developer Tools"],
  ["convert-image-to-webp-avif", "How to Convert Images to WebP and AVIF for Faster Sites", "convert image to webp", ["image-converter", "minifier"], "development", "Developer Tools"],
  ["cron-expression-generator-guide", "Cron Expression Generator: Schedule Jobs Without Guesswork", "cron expression generator", ["cron-generator", "regex-tester"], "development", "Developer Tools"],
  ["json-vs-xml-vs-yaml", "JSON vs XML vs YAML: Which Format Should Your API Use?", "json vs xml api", ["json-formatter", "sql-formatter"], "development", "Developer Tools"],
  ["free-developer-tools-online", "Developer Productivity Toolkit: 10 Free Browser Utilities", "free developer tools online", ["json-formatter", "regex-tester"], "development", "Developer Tools"],
  // Text & Writing Tools (10)
  ["case-converter-online-guide", "Case Converter Online: Upper, Lower, Title, and Sentence Case", "case converter online", ["case-converter", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  ["linkedin-hook-examples-formatting", "How to Write Better LinkedIn Hooks", "linkedin hook examples", ["linkedin-formatter", "case-converter"], "seo", "Text & Writing Tools"],
  ["lorem-ipsum-alternatives", "Lorem Ipsum Alternatives for Designers and Writers", "lorem ipsum alternative", ["lorem-ipsum", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  ["copywriting-formulas-blogs-ads", "Copywriting Formulas for Blogs, Ads, and Social Posts", "copywriting formulas", ["case-converter", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  ["format-text-for-cms-publishing", "How to Clean and Format Text for CMS Publishing", "format text for cms", ["case-converter", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  ["product-description-template-ecommerce", "Writing Product Descriptions for E-Commerce", "product description template", ["lorem-ipsum", "invoice-generator"], "seo", "Text & Writing Tools"],
  ["base64-text-encode-unicode", "Base64 for Text: Encoding Unicode Safely", "base64 text encode", ["base64-encoder", "case-converter"], "seo", "Text & Writing Tools"],
  ["seo-headline-formulas", "Headline Writing for SEO: 12 Formulas That Increase Clicks", "seo headline formulas", ["case-converter", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  ["repurpose-blog-into-social-posts", "How to Repurpose One Blog Post into 10 Social Updates", "repurpose blog content", ["linkedin-formatter", "instagram-profile-insights"], "seo", "Text & Writing Tools"],
  ["plain-language-writing-guide", "Plain Language Writing for Better Readability", "plain language writing", ["case-converter", "linkedin-formatter"], "seo", "Text & Writing Tools"],
  // Online Generators (10)
  ["qr-code-generator-free-guide", "QR Code Generator: Create QR Codes for Menus and Payments", "qr code generator free", ["qr-generator", "password-generator"], "generators", "Online Generators"],
  ["strong-password-generator-guide", "Strong Password Generator: Create Secure Passwords", "strong password generator", ["password-generator", "uuid-generator"], "generators", "Online Generators"],
  ["uuid-vs-guid-difference", "UUID vs GUID: What's the Difference?", "uuid vs guid", ["uuid-generator", "password-generator"], "generators", "Online Generators"],
  ["glassmorphism-generator-css", "Glassmorphism CSS Generator: Copy-Paste UI Styles", "glassmorphism generator", ["glassmorphism-generator", "image-converter"], "generators", "Online Generators"],
  ["qr-code-business-cards-invoices", "How to Use QR Codes on Business Cards and Invoices", "qr code for business card", ["qr-generator", "invoice-generator"], "generators", "Online Generators"],
  ["password-manager-vs-generator", "Password Manager vs Password Generator for Small Teams", "password manager vs generator", ["password-generator", "uuid-generator"], "generators", "Online Generators"],
  ["lorem-ipsum-wireframes-mvp", "Lorem Ipsum Generator for Wireframes and MVP Pages", "lorem ipsum for wireframes", ["lorem-ipsum", "glassmorphism-generator"], "generators", "Online Generators"],
  ["cron-job-examples-backups-reports", "Cron Job Examples for Backups, Reports, and API Sync", "cron job examples", ["cron-generator", "json-formatter"], "generators", "Online Generators"],
  ["free-online-generators-freelancers", "Free Online Generators Every Freelancer Should Bookmark", "free online generators", ["qr-generator", "password-generator"], "generators", "Online Generators"],
  ["generate-secure-api-keys", "How to Generate Secure API Keys for Side Projects", "generate api key", ["uuid-generator", "password-generator"], "generators", "Online Generators"],
  // Digital Marketing (10)
  ["free-social-media-analytics-tools", "Free Social Media Analytics Tools for Creators", "free social media analytics tools", ["youtube-channel-insights", "instagram-profile-insights"], "digital-marketing", "Digital Marketing"],
  ["creator-media-kit-template", "How to Build a Creator Media Kit Using Real Stats", "creator media kit template", ["youtube-channel-insights", "instagram-profile-insights"], "digital-marketing", "Digital Marketing"],
  ["linkedin-marketing-b2b-leads", "LinkedIn Marketing for B2B: Posts That Drive Leads", "linkedin marketing tips", ["linkedin-formatter", "qr-generator"], "digital-marketing", "Digital Marketing"],
  ["qr-code-marketing-campaigns", "QR Code Marketing Campaigns for Restaurants and Retail", "qr code marketing ideas", ["qr-generator", "instagram-profile-insights"], "digital-marketing", "Digital Marketing"],
  ["influencer-marketing-roi-formula", "How to Track ROI on Influencer Campaigns", "influencer marketing roi", ["instagram-revenue-calculator", "ltv-cac"], "digital-marketing", "Digital Marketing"],
  ["content-repurposing-youtube-instagram-linkedin", "Content Repurposing: YouTube to Instagram to LinkedIn", "content repurposing workflow", ["youtube-channel-insights", "linkedin-formatter"], "digital-marketing", "Digital Marketing"],
  ["small-business-digital-marketing-zero-budget", "Small Business Digital Marketing Stack on Zero Budget", "free marketing tools small business", ["qr-generator", "invoice-generator"], "digital-marketing", "Digital Marketing"],
  ["pdf-tools-client-proposals-invoices", "How to Use PDF Tools for Client Proposals and Invoices", "pdf tools online free", ["pdf-tools", "invoice-generator"], "digital-marketing", "Digital Marketing"],
  ["twitch-subscriber-revenue-guide", "Twitch Subscriber Revenue: How Streamers Estimate Income", "twitch sub revenue calculator", ["twitch-sub-revenue", "youtube-revenue-calculator"], "digital-marketing", "Digital Marketing"],
  ["digital-marketing-metrics-cheat-sheet", "Digital Marketing Metrics Cheat Sheet for Freelancers", "marketing metrics cheat sheet", ["ltv-cac", "instagram-revenue-calculator"], "digital-marketing", "Digital Marketing"],
  // AdSense & Monetization (10)
  ["adsense-revenue-calculator-guide", "Google AdSense Revenue Calculator: Estimate Blog Earnings", "adsense revenue calculator", ["adsense-revenue-calculator", "youtube-revenue-calculator"], "monetization", "AdSense & Monetization"],
  ["good-adsense-rpm-2026", "What Is a Good RPM for AdSense in 2026?", "good adsense rpm", ["adsense-revenue-calculator", "youtube-revenue-calculator"], "monetization", "AdSense & Monetization"],
  ["adsense-earnings-per-1000-views", "How Much Traffic for $100/Day with AdSense?", "adsense earnings per 1000 views", ["adsense-revenue-calculator", "youtube-revenue-calculator"], "monetization", "AdSense & Monetization"],
  ["adsense-vs-youtube-ad-revenue", "AdSense vs YouTube Ad Revenue: Which Pays More?", "adsense vs youtube ads", ["adsense-revenue-calculator", "youtube-revenue-calculator"], "monetization", "AdSense & Monetization"],
  ["increase-adsense-rpm-without-traffic", "How to Increase AdSense RPM Without More Traffic", "increase adsense rpm", ["adsense-revenue-calculator", "linkedin-formatter"], "monetization", "AdSense & Monetization"],
  ["monetize-free-tool-website", "Website Monetization for Tool Sites: Ads and Affiliates", "monetize free tool website", ["adsense-revenue-calculator", "qr-generator"], "monetization", "AdSense & Monetization"],
  ["youtube-rpm-india-creators", "YouTube AdSense RPM by Country: India Creator Guide", "youtube rpm india", ["youtube-revenue-calculator", "youtube-channel-insights"], "monetization", "AdSense & Monetization"],
  ["blog-niche-rpm-comparison", "Blog Niche RPM Comparison: Finance vs Tech vs Lifestyle", "blog niche rpm comparison", ["adsense-revenue-calculator", "sip"], "monetization", "AdSense & Monetization"],
  ["forecast-annual-ad-revenue", "How to Forecast Annual Ad Revenue from Monthly Pageviews", "forecast ad revenue", ["adsense-revenue-calculator", "instagram-revenue-calculator"], "monetization", "AdSense & Monetization"],
  ["creator-income-diversification", "Creator Income Diversification: Ads, Sponsorships, Products", "creator income diversification", ["youtube-revenue-calculator", "instagram-revenue-calculator"], "monetization", "AdSense & Monetization"],
  // Small Business Resources (10)
  ["gst-invoice-rules-india-2026", "GST Invoice Rules for Small Businesses in India (2026)", "gst invoice rules india", ["invoice-generator", "gst-calculator"], "small-business", "Small Business Resources"],
  ["how-to-calculate-gst-services-goods", "How to Calculate GST on Services vs Goods", "how to calculate gst", ["gst-calculator", "invoice-generator"], "small-business", "Small Business Resources"],
  ["emi-vs-rent-calculator-2026", "Home Loan EMI vs Rent: Which Is Cheaper in 2026?", "emi vs rent calculator", ["emi", "loan-foreclosure-calculator"], "small-business", "Small Business Resources"],
  ["home-loan-prepayment-foreclosure-charges", "When to Prepay Your Home Loan: Foreclosure Charges Explained", "home loan prepayment rules", ["loan-foreclosure-calculator", "emi"], "small-business", "Small Business Resources"],
  ["free-invoice-template-freelancers-india", "Free Invoice Template for Freelancers in India", "free invoice template india", ["invoice-generator", "gst-calculator"], "small-business", "Small Business Resources"],
  ["qr-code-upi-payment-small-shops", "How Small Shops Can Use QR Codes for UPI Payments", "qr code for upi payment", ["qr-generator", "invoice-generator"], "small-business", "Small Business Resources"],
  ["merge-pdf-online-free-business", "PDF Merge and Split for Business Documents", "merge pdf online free", ["pdf-tools", "invoice-generator"], "small-business", "Small Business Resources"],
  ["sip-vs-fd-vs-ppf-comparison", "SIP vs FD vs PPF: Where Should MSMEs Park Surplus Cash?", "sip vs fd vs ppf", ["sip", "swp"], "small-business", "Small Business Resources"],
  ["startup-unit-economics-ltv-cac", "Startup Unit Economics: LTV, CAC, and Payback Period", "startup unit economics", ["ltv-cac", "instagram-revenue-calculator"], "small-business", "Small Business Resources"],
  ["free-tools-msmes-solopreneurs-india", "Essential Free Tools for Indian MSMEs and Solopreneurs", "free tools for small business india", ["gst-calculator", "invoice-generator"], "small-business", "Small Business Resources"],
];

export const SEO_BLOG_TOPICS: SeoBlogTopic[] = RAW_TOPICS.map(expand);

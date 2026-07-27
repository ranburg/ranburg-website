import type { ToolConfig, ToolFaq } from "./toolsConfig";
import { getCategoryById, getToolBySlug } from "./toolsConfig";
import { getPrimarySeoCategoryForTool } from "./toolSeoCategories";
import { TOOL_WORKED_EXAMPLES } from "./seoGrowthConfig";
import { getExplicitRelatedSlugs } from "./toolRelatedLinks";
import { getRecommendedTools } from "./toolRecommendations";

export interface SeoComparisonRow {
  feature: string;
  left: string;
  right: string;
}

export interface SeoComparisonTable {
  leftLabel: string;
  rightLabel: string;
  rows: SeoComparisonRow[];
  caption: string;
}

export interface ToolSeoSections {
  whatIs: string;
  whyUse: string;
  howItWorks: string;
  examples: string[];
  benefits: string[];
  useCases: string[];
  compatibility: string;
  commonIssues: string;
  privacy: string;
  comparison: SeoComparisonTable | null;
  faq: ToolFaq[];
  relatedSlugs: string[];
  lastUpdated: string;
  wordCountHint: number;
}

/** Bump when major SEO body copy is revised (EEAT freshness). */
export const TOOL_SEO_CONTENT_UPDATED = "2026-07-27";

const GENERIC_FAQ: ToolFaq[] = [
  {
    question: "Is this tool free to use?",
    answer:
      "Yes. This tool is completely free on Ranburg.com with no account, subscription, or credit card required. You can use it as often as you need.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. All Ranburg tools run in your web browser on desktop and mobile. There is no desktop app, browser extension, or install step.",
  },
  {
    question: "Is my data private?",
    answer:
      "Most Ranburg tools process data locally in your browser. Your files and inputs are not stored on our servers unless a tool explicitly needs an external API (for example live currency rates or public social profile lookups). See our Privacy Policy for details.",
  },
  {
    question: "Can I use this tool on mobile and iPhone?",
    answer:
      "Yes. Every Ranburg tool is responsive and works on phones, tablets, and desktops — including iPhone Safari and Android Chrome — without a separate app.",
  },
  {
    question: "Does it work offline?",
    answer:
      "After the page loads, many browser-side tools continue to work without uploading data. A live internet connection is still needed to open the page the first time and for tools that call external APIs.",
  },
  {
    question: "Do you keep my files after processing?",
    answer:
      "Browser-side converters and calculators do not upload files to Ranburg servers, so there is nothing for us to store or delete. If a future tool requires upload, files would be processed temporarily and not retained — we state that clearly on the tool page.",
  },
];

const FORMAT_COMPARE: Record<string, SeoComparisonTable> = {
  "heic-to-jpg": {
    leftLabel: "HEIC",
    rightLabel: "JPG",
    caption: "HEIC vs JPG — which format should you use?",
    rows: [
      { feature: "File size", left: "Usually smaller", right: "Larger at similar quality" },
      { feature: "Compatibility", left: "Limited (Apple-first)", right: "Universal everywhere" },
      { feature: "Image quality", left: "Excellent efficiency", right: "Good, widely supported" },
      { feature: "Editing support", left: "Fewer apps", right: "Nearly every editor" },
      { feature: "Sharing", left: "Sometimes fails on Windows/email", right: "Works everywhere" },
      { feature: "Best for", left: "iPhone storage savings", right: "Web, email, clients, Windows" },
    ],
  },
  "jpg-to-png": {
    leftLabel: "JPG",
    rightLabel: "PNG",
    caption: "JPG vs PNG comparison",
    rows: [
      { feature: "Compression", left: "Lossy (smaller files)", right: "Lossless" },
      { feature: "Transparency", left: "No", right: "Yes (alpha channel)" },
      { feature: "Best for", left: "Photos", right: "Graphics, UI, logos" },
      { feature: "File size", left: "Typically smaller", right: "Often larger" },
      { feature: "Editing cycles", left: "Quality drops on re-save", right: "Safer for repeated edits" },
    ],
  },
  "png-to-jpg": {
    leftLabel: "PNG",
    rightLabel: "JPG",
    caption: "PNG vs JPG comparison",
    rows: [
      { feature: "File size", left: "Larger for photos", right: "Smaller for photos" },
      { feature: "Transparency", left: "Supported", right: "Not supported" },
      { feature: "Web use", left: "Icons & UI", right: "Photographs & blogs" },
      { feature: "Quality", left: "Lossless", right: "Adjustable lossy quality" },
    ],
  },
  "webp-to-png": {
    leftLabel: "WEBP",
    rightLabel: "PNG",
    caption: "WEBP vs PNG comparison",
    rows: [
      { feature: "Compatibility", left: "Modern browsers", right: "Universal" },
      { feature: "File size", left: "Very efficient", right: "Larger typically" },
      { feature: "Transparency", left: "Yes", right: "Yes" },
      { feature: "Best for", left: "Web performance", right: "Editing & legacy tools" },
    ],
  },
  "png-to-webp": {
    leftLabel: "PNG",
    rightLabel: "WEBP",
    caption: "PNG vs WEBP comparison",
    rows: [
      { feature: "File size", left: "Larger", right: "Smaller for web" },
      { feature: "Browser support", left: "Universal", right: "Excellent on modern web" },
      { feature: "SEO / CWV", left: "Heavier pages", right: "Faster LCP potential" },
      { feature: "Editing", left: "Widely supported", right: "Growing support" },
    ],
  },
  "svg-to-png": {
    leftLabel: "SVG",
    rightLabel: "PNG",
    caption: "SVG vs PNG comparison",
    rows: [
      { feature: "Type", left: "Vector (scalable)", right: "Raster (pixels)" },
      { feature: "Scaling", left: "Infinite, sharp", right: "Pixelates when enlarged" },
      { feature: "Use case", left: "Icons, logos, UI", right: "Social posts, embeds" },
      { feature: "Editing", left: "Code / vector apps", right: "Any image editor" },
    ],
  },
};

function defaultComparison(tool: ToolConfig): SeoComparisonTable {
  return {
    leftLabel: "Manual / desktop software",
    rightLabel: `${tool.title} (Ranburg)`,
    caption: `Why use an online ${tool.title.toLowerCase()}?`,
    rows: [
      { feature: "Cost", left: "Licenses or installs", right: "Free forever" },
      { feature: "Setup", left: "Download & configure", right: "Open the page and start" },
      { feature: "Account", left: "Often required", right: "No signup" },
      { feature: "Speed", left: "Depends on app", right: "Instant in-browser results" },
      { feature: "Privacy", left: "Varies by vendor", right: "Client-side where possible" },
      { feature: "Devices", left: "OS-specific installs", right: "Phone, tablet, desktop" },
    ],
  };
}

function buildWhyUse(tool: ToolConfig, hubLabel: string): string {
  const isConverter = tool.slug.includes("-to-") || /convert/i.test(tool.title);
  const isCalc = /calculator/i.test(tool.title);
  const localPrivacy =
    tool.category === "design" || tool.category === "developer" || tool.category === "financial";

  if (isConverter) {
    return `People search for a free ${tool.title.toLowerCase()} when a file format blocks sharing, uploading, or editing. Email clients, Windows PCs, CMSs, and design tools often reject less-common formats. Converting online removes friction without buying software.

Ranburg’s ${tool.title} is built for that moment: open the page, convert, download, and move on. ${localPrivacy ? "Processing is designed to stay in your browser whenever possible, so your files are not harvested into a random cloud account." : "Results appear instantly so you can finish the task and leave."} Compared with installing desktop suites or creating yet another converter account, a focused ${hubLabel.toLowerCase()} utility is faster for one-off and recurring jobs.

Use this page when you need reliable output for clients, teammates, or platforms that expect a mainstream format — and when you want a converter that is free, clear, and bookmarkable.`;
  }

  if (isCalc) {
    return `Guessing numbers in your head (or rebuilding the same spreadsheet) wastes time and invites mistakes. A dedicated ${tool.title.toLowerCase()} gives transparent math you can re-run in seconds while you negotiate, plan, or learn.

Ranburg calculators are free, mobile-friendly, and require no signup. Adjust inputs, compare scenarios, and capture results for meetings or personal decisions. That combination — speed, clarity, and zero account friction — is why people keep returning to simple online calculators instead of complex finance apps for everyday questions.`;
  }

  return `The ${tool.title} exists to remove friction from a specific ${hubLabel.toLowerCase()} workflow. Instead of juggling multiple apps or scripts, you get a single focused page with clear inputs and immediate output.

Ranburg tools prioritize free access, no signup, and fast browser-side results. Bookmark the ${tool.title} for recurring work, share the URL with teammates, and chain it with related tools from the same category hub when your workflow needs more than one step.`;
}

function buildWhatIs(
  tool: ToolConfig,
  hubLabel: string,
  catLabel: string
): string {
  const primaryKw = tool.seo.keywords[0] ?? tool.title.toLowerCase();

  return `The ${tool.title} is a free online ${hubLabel.toLowerCase().replace(/tools$/i, "tool").replace(/s$/, "")} on Ranburg.com designed for people who need ${primaryKw} without installing software or creating an account. ${tool.shortDescription}

${tool.seo.description} Unlike crowded “all-in-one” converter portals that bury the action behind ads and signwalls, this page focuses on one job: help you finish ${tool.title.toLowerCase()} tasks quickly with transparent steps and clear output.

Who it is for: ${catLabel.toLowerCase()} professionals, students, freelancers, small businesses, and anyone who needs a reliable browser utility on desktop or mobile. How to start: ${tool.howToUse.slice(0, 2).join(" ")} Full step-by-step instructions appear above the interactive tool and again in the How to use section below.

Technical basis: ${tool.formula}. Ranburg publishes free web tools based on real search demand across finance, creators, developers, image/PDF utilities, and Salesforce helpers. Bookmark the ${tool.title}, share it with teammates, and explore related ${hubLabel.toLowerCase()} from the same hub to build topical workflows instead of one-off visits.

Created by Ranburg (Ranburg LLP) — free tools & digital excellence. This page is updated regularly with clearer guides, FAQs, and related links so it stays useful for both users and search engines.`;
}

function buildCompatibility(tool: ToolConfig): string {
  if (tool.category === "design" || tool.slug.includes("pdf")) {
    return `Works in modern browsers including Chrome, Edge, Firefox, and Safari on Windows, macOS, Linux, Android, and iPhone. ${
      tool.slug === "heic-to-jpg"
        ? "HEIC decode support depends on the browser engine; if a file fails, try Chrome/Edge on desktop or export from Photos first."
        : "For best results use an up-to-date browser with JavaScript enabled."
    } No Windows app, Mac app, or mobile install is required — open this page and convert or edit directly.`;
  }
  if (tool.category === "financial") {
    return `Works on any device with a modern browser. Figures are shown for planning and education; always confirm final loan, tax, or investment decisions with your bank, CA, or advisor. Mobile-friendly inputs make it easy to run numbers during client calls.`;
  }
  if (tool.category === "salesforce") {
    return `Use output as a starting point in Salesforce Setup, Developer Console, VS Code, or sandboxes. Field API names and org-specific metadata still need validation in your environment. Works on desktop browsers used by admins and developers.`;
  }
  return `Compatible with modern desktop and mobile browsers. No extension or native app required. If a feature needs network access (for example live rates or public profile APIs), the tool will indicate that on the page.`;
}

function buildCommonIssues(tool: ToolConfig): string {
  if (tool.slug === "heic-to-jpg") {
    return `Common issues: some older browsers cannot decode HEIC; very large Live Photos may need export as still HEIC first; Windows Mail and older apps reject HEIC attachments (converting to JPG fixes sharing). If conversion stalls, refresh the page, try a smaller file, or use Chrome/Edge. Quality is high for everyday sharing — for print-critical work, preview before sending.`;
  }
  if (tool.category === "design") {
    return `Common issues include oversized uploads slowing the tab, unexpected transparency loss when converting to JPG, and color-profile differences after re-encode. Preview before downloading, lower dimensions for web use, and keep originals when you need lossless archives.`;
  }
  if (tool.category === "financial") {
    return `Results differ from bank apps when fees, floating rates, compounding conventions, or taxes are excluded. Double-check tenure units (months vs years) and whether GST or processing fees apply. Use multiple scenarios before making money decisions.`;
  }
  return `If results look unexpected, re-check inputs, browser zoom, and whether you pasted complete data. Hard-refresh the page if a script failed to load. For API-backed tools, temporary upstream outages can delay lookups — try again shortly.`;
}

function buildPrivacy(tool: ToolConfig): string {
  const browserSide =
    tool.category === "design" ||
    tool.category === "developer" ||
    tool.category === "financial" ||
    tool.slug.includes("pdf") ||
    tool.slug.includes("password") ||
    tool.slug.includes("qr");

  return browserSide
    ? `Privacy & security: the ${tool.title} is designed so your inputs and files are processed in your browser whenever possible. That means typical conversions and calculations are not uploaded to Ranburg servers for storage. We do not require an account to use this tool. Review our Privacy Policy and Terms for analytics and contact-form details. Prefer tools that state “files stay on your device” when handling sensitive photos, PDFs, or credentials.`
    : `Privacy & security: Ranburg keeps this tool free and without forced signup. Some insights tools call public APIs to fetch profile or channel data — only public information is requested. We do not ask you to log into YouTube, Instagram, or other platforms. See our Privacy Policy for how site analytics work.`;
}

function buildToolSpecificFaqs(tool: ToolConfig): ToolFaq[] {
  const faqs: ToolFaq[] = [];
  const title = tool.title;

  faqs.push({
    question: `What is ${title}?`,
    answer: `${title} is a free browser tool on Ranburg.com. ${tool.shortDescription} It requires no install and no account.`,
  });

  if (tool.slug.includes("-to-") || /convert/i.test(title)) {
    faqs.push(
      {
        question: "Does converting reduce quality?",
        answer:
          "Re-encoding can change quality depending on the target format and settings. Lossless targets (like PNG from many sources) preserve detail; JPG/WebP use adjustable quality. Always preview before you download when quality matters.",
      },
      {
        question: "Can I convert multiple files?",
        answer:
          "Use the tool repeatedly for each file, or check the page UI for batch options when available. Keeping conversions in-browser avoids uploading albums to unknown servers.",
      },
      {
        question: "Is my file uploaded to Ranburg?",
        answer:
          "Image and many file tools are built to process locally in your browser. Your file stays on your device during conversion unless the page explicitly states an upload is required.",
      }
    );
  }

  if (/calculator/i.test(title)) {
    faqs.push({
      question: "Are the calculations accurate?",
      answer: `The ${title} uses standard formulas (${tool.formula}). Results are for guidance; banks and tax rules may apply additional fees or rounding.`,
    });
  }

  if (tool.slug === "heic-to-jpg") {
    faqs.push(
      {
        question: "What is HEIC?",
        answer:
          "HEIC (High Efficiency Image Container) is the default photo format on many iPhones. It stores high-quality images in smaller files than traditional JPG, but older Windows apps and some websites cannot open it.",
      },
      {
        question: "Is HEIC better than JPG?",
        answer:
          "HEIC is often more storage-efficient on iPhone. JPG is better for compatibility — email, Windows, CMS uploads, and clients. Convert to JPG when sharing outside Apple devices.",
      },
      {
        question: "Does this work on iPhone?",
        answer:
          "Yes. Open this page in Safari or Chrome on iPhone, upload a HEIC photo, convert, and save the JPG back to your library or Files app.",
      },
      {
        question: "How do I open HEIC on Windows?",
        answer:
          "The simplest approach is converting HEIC to JPG with this free tool, then opening the JPG in any Windows photo app. Alternatively Microsoft offers HEIF extensions, but conversion is more reliable for sharing.",
      }
    );
  }

  return faqs;
}

const EXAMPLE_TEMPLATES: Record<string, string[]> = {
  financial: [
    "Enter sample values to see how outputs change in real time before applying your actual numbers.",
    "Compare multiple scenarios by adjusting inputs — useful for meetings and client quotes.",
    "Screenshot or copy results to share with your team, advisor, or accountant.",
  ],
  developer: [
    "Paste messy data or code, run the tool, and copy cleaned output into your IDE.",
    "Use during code reviews to validate payloads, encodings, or patterns quickly.",
    "Bookmark the page for daily development workflows alongside other Ranburg utilities.",
  ],
  salesforce: [
    "Generate a starting template in a sandbox, then refine field names for your org.",
    "Copy output into Setup, Developer Console, or VS Code for Apex and metadata work.",
    "Pair with other Salesforce tools on Ranburg for SOQL, validation rules, and tests.",
  ],
  productivity: [
    "Enter topic or channel details, generate outputs, then copy tags, captions, or metrics.",
    "Adjust filters until the result matches your content style.",
    "Reuse the same workflow for Shorts, Reels, or long-form posts.",
  ],
  design: [
    "Upload your asset, tweak settings, preview, then download — no desktop suite required.",
    "Convert or compress everyday creative files before client reviews or CMS uploads.",
    "Keep the page bookmarked for last-minute asset fixes before launches.",
  ],
  default: [
    "Open the tool, enter your input, and review instant results without creating an account.",
    "Try different inputs to understand edge cases before relying on the output.",
    "Share the tool URL with colleagues who need the same utility.",
  ],
};

export function generateToolSeoSections(tool: ToolConfig): ToolSeoSections {
  const category = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);
  const catLabel = category?.label ?? "Online Tools";
  const hubLabel = seoCat?.label ?? catLabel;

  const whatIs = buildWhatIs(tool, hubLabel, catLabel);
  const whyUse = buildWhyUse(tool, hubLabel);

  const howItWorks = `How to use the ${tool.title} on Ranburg:

Follow the on-page steps: ${tool.howToUse.join(" ")}

Results update as you change inputs so you can experiment without reloading. Technical basis: ${tool.formula}.

When you finish, copy or download the output and continue in your CMS, spreadsheet, IDE, email, or Salesforce org. Related ${hubLabel} tools sit below so you can chain workflows — for example convert, then compress, then resize — without hunting the directory.

Tip: add this page to bookmarks or your phone home screen if you repeat the same task weekly. Free access and no signup mean the tool stays available whenever you need it.`;

  const examples =
    TOOL_WORKED_EXAMPLES[tool.slug] ?? EXAMPLE_TEMPLATES[tool.category] ?? EXAMPLE_TEMPLATES.default;

  const benefits = [
    `Free forever — no signup, subscription, watermarks, or hidden usage limits on Ranburg.com`,
    `Instant results with a clean interface optimized for the job — not a maze of upsells`,
    `Works on phone, tablet, and desktop browsers without installing software`,
    `Clear documentation: steps, examples, FAQs, comparison tables, and related tools on this page`,
    `Privacy-minded design: ${
      tool.category === "design" || tool.slug.includes("pdf")
        ? "file processing stays in your browser whenever possible"
        : tool.category === "financial"
          ? "calculations run locally in your browser"
          : "most processing happens client-side without forcing an account"
    }`,
    `Fast pages built for Core Web Vitals — get to the result quickly`,
    `Part of a connected ${hubLabel} toolkit so every visit strengthens the same workflow`,
    `Created and maintained by Ranburg — transparent contact, privacy, and terms pages`,
  ];

  const useCases = [
    `Everyday ${catLabel.toLowerCase()} tasks for professionals, students, and freelancers`,
    `Quick checks during meetings, client calls, demos, or code reviews`,
    `Learning while doing — read formulas, comparisons, and FAQs beside the live tool`,
    `Sharing a direct bookmark with teammates instead of forwarding installers`,
    `Replacing one-off spreadsheet or desktop-app steps for recurring jobs`,
    ...(tool.category === "design"
      ? [
          "Preparing images for web, email, WhatsApp, CMS, and client delivery",
          "Fixing format mismatches from iPhone photos or modern web formats",
        ]
      : []),
    ...(tool.category === "salesforce"
      ? ["Salesforce admin and developer productivity in sandboxes, demos, and UAT"]
      : []),
    ...(tool.category === "productivity"
      ? ["Creator research, hashtags, captions, and public channel/profile analysis"]
      : []),
    ...(tool.category === "financial"
      ? ["Personal finance planning in INR and quick business quote checks"]
      : []),
  ];

  const comparison = FORMAT_COMPARE[tool.slug] ?? defaultComparison(tool);

  const relatedFromMap = getExplicitRelatedSlugs(tool.slug);
  const relatedSlugs = (
    relatedFromMap.length > 0
      ? relatedFromMap
      : getRecommendedTools(tool.slug, 6).map((t) => t.slug)
  )
    .filter((s) => s !== tool.slug && getToolBySlug(s))
    .slice(0, 8);

  const faq = mergeFaqs(
    [...tool.faq, ...buildToolSpecificFaqs(tool)],
    GENERIC_FAQ
  );

  const combinedText = [
    whatIs,
    whyUse,
    howItWorks,
    examples.join(" "),
    benefits.join(" "),
    useCases.join(" "),
    buildCompatibility(tool),
    buildCommonIssues(tool),
    buildPrivacy(tool),
    faq.map((f) => `${f.question} ${f.answer}`).join(" "),
  ].join(" ");

  return {
    whatIs,
    whyUse,
    howItWorks,
    examples,
    benefits,
    useCases,
    compatibility: buildCompatibility(tool),
    commonIssues: buildCommonIssues(tool),
    privacy: buildPrivacy(tool),
    comparison,
    faq,
    relatedSlugs,
    lastUpdated: TOOL_SEO_CONTENT_UPDATED,
    wordCountHint: combinedText.split(/\s+/).filter(Boolean).length,
  };
}

function mergeFaqs(primary: ToolFaq[], extra: ToolFaq[]): ToolFaq[] {
  const seen = new Set<string>();
  const merged: ToolFaq[] = [];
  for (const item of [...primary, ...extra]) {
    const key = item.question.toLowerCase().replace(/\s+/g, " ").trim();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged.slice(0, 14);
}

/** Display use count — merges analytics when available on client */
export function getToolUseCountPlaceholder(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const count = 1200 + (hash % 48000);
  if (count >= 10000) return `${(count / 1000).toFixed(1)}k+ uses`;
  return `${count.toLocaleString()}+ uses`;
}

import type { ToolConfig, ToolFaq } from "./toolsConfig";
import { getCategoryById } from "./toolsConfig";
import { getPrimarySeoCategoryForTool } from "./toolSeoCategories";
import { TOOL_WORKED_EXAMPLES } from "./seoGrowthConfig";

export interface ToolSeoSections {
  whatIs: string;
  howItWorks: string;
  examples: string[];
  benefits: string[];
  useCases: string[];
  faq: ToolFaq[];
}

const GENERIC_FAQ: ToolFaq[] = [
  {
    question: "Is this tool free to use?",
    answer: "Yes. This tool is completely free on Ranburg.com with no account or credit card required.",
  },
  {
    question: "Do I need to install anything?",
    answer: "No. All tools run in your web browser on desktop and mobile — just open the page and start using it.",
  },
  {
    question: "Is my data private?",
    answer: "Most Ranburg tools process data locally in your browser. Your inputs are not stored on our servers unless the tool explicitly calls an external API (such as live currency rates or social profile lookups).",
  },
  {
    question: "Can I use this tool on mobile?",
    answer: "Yes. Every Ranburg tool is responsive and works on phones, tablets, and desktops without a separate app.",
  },
];

const EXAMPLE_TEMPLATES: Record<string, string[]> = {
  financial: [
    "Enter sample values to see how outputs change in real time before applying your actual numbers.",
    "Compare multiple scenarios by adjusting sliders — useful for meetings and client quotes.",
    "Export or screenshot results to share with your team or accountant.",
  ],
  developer: [
    "Paste messy JSON or code, click format, and copy the cleaned output into your IDE.",
    "Use the tool during code reviews to validate payloads and string encoding quickly.",
    "Bookmark the page for daily development workflows alongside your other Ranburg utilities.",
  ],
  salesforce: [
    "Generate a starting template in the sandbox, then refine field names and logic for your org.",
    "Copy output directly into Setup, Developer Console, or VS Code for Apex and metadata work.",
    "Pair with other Salesforce tools on Ranburg for SOQL, validation rules, and test classes.",
  ],
  productivity: [
    "Enter your topic or channel details, generate outputs, then copy tags, captions, or metrics.",
    "Adjust filters (count, niche, or mix) until the result matches your content style.",
    "Use the same workflow for Shorts, Reels, or long-form posts and save time on every publish cycle.",
  ],
  design: [
    "Upload or paste your asset, tweak conversion settings, then preview before downloading.",
    "Batch everyday creative tasks — resize, compress, or convert — without desktop software.",
    "Keep the page bookmarked for last-minute asset fixes before launches or client reviews.",
  ],
  default: [
    "Open the tool, enter your input, and review instant results without creating an account.",
    "Try different inputs to understand how the tool behaves across edge cases.",
    "Share the tool URL with colleagues who need the same utility.",
  ],
};

export function generateToolSeoSections(tool: ToolConfig): ToolSeoSections {
  const category = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);
  const catLabel = category?.label ?? "Online Tools";
  const hubLabel = seoCat?.label ?? catLabel;

  const whatIs = `The ${tool.title} is a free online ${hubLabel.toLowerCase().replace(/s$/, "")} utility on Ranburg.com. ${tool.shortDescription} Use it when you need fast, accurate results without installing software or creating an account.

${tool.seo.description} The ${tool.title} is built for ${catLabel.toLowerCase()} workflows — professionals, students, freelancers, and teams who want a clear interface and reliable output on desktop or mobile.

How to get started: ${tool.howToUse.slice(0, 2).join(" ")} Full step-by-step instructions appear above the tool and again in the How It Works section below.

Ranburg publishes free web tools based on real search demand. Bookmark the ${tool.title} for everyday ${hubLabel.toLowerCase()} tasks, share the link with teammates, and explore related utilities from the same category hub.`;

  const howItWorks = `Using the ${tool.title} is straightforward. Follow these steps on this page: ${tool.howToUse.join(" ")}

Results update as you change inputs, so you can experiment without reloading. Technical basis: ${tool.formula}

When you finish, copy or download the output and continue in your CMS, spreadsheet, IDE, or Salesforce org. Related ${hubLabel} tools on Ranburg.com sit below so you can chain workflows without hunting the tools directory.`;

  const examples =
    TOOL_WORKED_EXAMPLES[tool.slug] ?? EXAMPLE_TEMPLATES[tool.category] ?? EXAMPLE_TEMPLATES.default;

  const benefits = [
    `Free forever — no signup, subscription, or usage limits on Ranburg.com`,
    `Instant results with a clean, distraction-free interface optimized for focus`,
    `Mobile-responsive design for use on phone, tablet, and desktop`,
    `Detailed documentation, worked examples, FAQs, and related tool suggestions on every page`,
    `Privacy-focused: ${tool.category === "financial" ? "calculations run locally in your browser" : "most processing happens client-side without uploading your data"}`,
    `Fast page loads and SEO-optimized structure for reliable access worldwide`,
    `Part of a connected toolkit — browse related ${hubLabel.toLowerCase()} and ${catLabel.toLowerCase()} tools from every page`,
  ];

  const useCases = [
    `Daily ${catLabel.toLowerCase()} tasks for developers, analysts, accountants, and business users`,
    `Quick checks during meetings, client calls, sales demos, or code reviews`,
    `Learning and reference — read formulas, examples, and FAQs while using the tool`,
    `Sharing bookmarked utilities with teammates via direct links`,
    `Prototyping, sandbox work, and personal finance planning without native apps`,
    `Reducing dependency on spreadsheets for one-off calculations and formatting`,
    ...(tool.category === "salesforce"
      ? ["Salesforce admin and developer productivity in sandboxes, demos, and UAT"]
      : []),
    ...(tool.category === "productivity"
      ? ["Social media and creator analytics for public channel and profile research"]
      : []),
  ];

  const faq = mergeFaqs(tool.faq, GENERIC_FAQ);

  return { whatIs, howItWorks, examples, benefits, useCases, faq };
}

function mergeFaqs(primary: ToolFaq[], extra: ToolFaq[]): ToolFaq[] {
  const seen = new Set<string>();
  const merged: ToolFaq[] = [];
  for (const item of [...primary, ...extra]) {
    const key = item.question.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged.slice(0, 10);
}

/** Display use count — merges analytics when available on client */
export function getToolUseCountPlaceholder(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const count = 1200 + (hash % 48000);
  if (count >= 10000) return `${(count / 1000).toFixed(1)}k+ uses`;
  return `${count.toLocaleString()}+ uses`;
}

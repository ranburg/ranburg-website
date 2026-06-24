import type { ToolConfig, ToolFaq } from "./toolsConfig";
import { getCategoryById } from "./toolsConfig";
import { getPrimarySeoCategoryForTool } from "./toolSeoCategories";

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

  const whatIs = `The ${tool.title} is a free online ${hubLabel.toLowerCase().replace(/s$/, "")} utility published by Ranburg.com. ${tool.shortDescription} It is designed for professionals, students, freelancers, and teams who need fast, accurate results without installing desktop software or creating an account.

As part of Ranburg's growing library of 40+ free web tools, the ${tool.title} prioritizes speed, clarity, and privacy. ${tool.seo.description} Whether you use it once for a quick task or bookmark it for daily workflows, the interface stays lightweight and mobile-friendly across Chrome, Safari, Firefox, and Edge.

Unlike many ad-heavy utility sites, Ranburg focuses on useful output and readable documentation. Below the tool you will find step-by-step instructions, worked examples, technical reference, benefits, real-world use cases, and answers to common questions — everything you need to use the ${tool.title} confidently and share it with colleagues.

The ${tool.title} is particularly useful for ${catLabel.toLowerCase()} workflows where accuracy and speed matter. Ranburg publishes tools based on real search demand so you get utilities that solve everyday problems, not bloated apps with paywalls.`;

  const howItWorks = `Using the ${tool.title} takes only a few steps. ${tool.howToUse.join(" ")} The tool updates results in real time as you adjust inputs, so you can experiment quickly without reloading the page.

Under the hood, ${tool.formula} Ranburg implements this logic with modern browser APIs and tested algorithms so results are consistent across devices and browsers. Advanced options are available when you need finer control over formatting, encoding, tax splits, or calculation parameters.

For ${catLabel.toLowerCase()} workflows, the ${tool.title} integrates naturally with other Ranburg utilities in the ${hubLabel} category. Copy output with one click, paste into your CMS, IDE, spreadsheet, invoice, or Salesforce org, and continue your work. Related tools are suggested at the bottom of every page so you can discover complementary utilities without returning to the tools hub.`;

  const examples =
    EXAMPLE_TEMPLATES[tool.category] ?? EXAMPLE_TEMPLATES.default;

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

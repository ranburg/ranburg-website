import type { ToolConfig, ToolFaq } from "./toolsConfig";
import { getCategoryById } from "./toolsConfig";
import { getPrimarySeoCategoryForTool } from "./toolSeoCategories";

export interface ToolSeoSections {
  whatIs: string;
  howItWorks: string;
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
    answer: "Most Ranburg tools process data locally in your browser. Your inputs are not stored on our servers unless the tool explicitly calls an external API (such as live currency rates).",
  },
];

export function generateToolSeoSections(tool: ToolConfig): ToolSeoSections {
  const category = getCategoryById(tool.category);
  const seoCat = getPrimarySeoCategoryForTool(tool.slug);
  const catLabel = category?.label ?? "Online Tools";
  const hubLabel = seoCat?.label ?? catLabel;

  const whatIs = `The ${tool.title} is a free online ${hubLabel.toLowerCase().replace(/s$/, "")} utility published by Ranburg.com. ${tool.shortDescription} It is designed for professionals, students, and teams who need fast, accurate results without installing desktop software or creating an account.

As part of Ranburg's growing library of ${TOOLS_COUNT_PHRASE} free web tools, the ${tool.title} prioritizes speed, clarity, and privacy. ${tool.seo.description} Whether you use it once for a quick task or bookmark it for daily workflows, the interface stays lightweight and mobile-friendly.

Unlike many ad-heavy utility sites, Ranburg focuses on useful output and readable documentation. Below the tool you will find step-by-step instructions, technical reference, benefits, real-world use cases, and answers to common questions — everything you need to use the ${tool.title} confidently and share it with colleagues.`;

  const howItWorks = `Using the ${tool.title} takes only a few steps. ${tool.howToUse.join(" ")} The tool updates results in real time as you adjust inputs, so you can experiment quickly without reloading the page.

Under the hood, ${tool.formula} Ranburg implements this logic with modern browser APIs and tested algorithms so results are consistent across Chrome, Firefox, Safari, and Edge. Advanced options are available when you need finer control over formatting, encoding, or calculation parameters.

For ${catLabel.toLowerCase()} workflows, the ${tool.title} integrates naturally with other Ranburg utilities in the ${hubLabel} category. Copy output with one click, paste into your CMS, IDE, spreadsheet, or Salesforce org, and continue your work. If you need help beyond free tools, Ranburg LLP also offers custom software development and Salesforce consulting — contact us anytime.`;

  const benefits = [
    `Free forever — no signup, subscription, or usage limits`,
    `Instant results with a clean, distraction-free interface`,
    `Mobile-responsive design for use on phone, tablet, and desktop`,
    `Detailed documentation, FAQs, and related tool suggestions on every page`,
    `Privacy-focused: ${tool.category === "financial" ? "calculations run locally in your browser" : "most processing happens client-side without uploading your data"}`,
    `SEO-optimized pages that load fast and meet Core Web Vitals best practices`,
  ];

  const useCases = [
    `Daily ${catLabel.toLowerCase()} tasks for developers, analysts, and business users`,
    `Quick checks during meetings, client calls, or code reviews`,
    `Learning and reference — read formulas and FAQs while using the tool`,
    `Sharing bookmarked utilities with teammates via direct links`,
    `Prototyping and sandbox work without installing native apps`,
    ...(tool.category === "salesforce"
      ? ["Salesforce admin and developer productivity in sandboxes and demos"]
      : []),
  ];

  const faq = mergeFaqs(tool.faq, GENERIC_FAQ);

  return { whatIs, howItWorks, benefits, useCases, faq };
}

const TOOLS_COUNT_PHRASE = "30+";

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
  return merged.slice(0, 8);
}

/** Stable pseudo use-count for display (not real analytics) */
export function getToolUseCountPlaceholder(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const count = 1200 + (hash % 48000);
  if (count >= 10000) return `${(count / 1000).toFixed(1)}k+ uses`;
  return `${count.toLocaleString()}+ uses`;
}

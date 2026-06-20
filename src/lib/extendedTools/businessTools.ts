import { makeTool } from "./makeTool";
import type { ToolConfig } from "../toolsConfig";

const bizFaq = [
  { question: "Is this calculator free?", answer: "Yes. All Ranburg business calculators are free." },
  { question: "Is output financial advice?", answer: "No. Results are estimates for planning. Consult professionals for tax and investment decisions." },
  { question: "Can I use this for my business?", answer: "Yes. Commercial use of calculator outputs is permitted." },
];

export const BUSINESS_TOOLS: ToolConfig[] = [
  makeTool({
    slug: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    shortDescription: "Calculate gross, operating, and net profit margins from revenue and costs.",
    category: "financial",
    icon: "Percent",
    gradient: "from-green-500 to-emerald-600",
    badge: "Business Calculator",
    popular: true,
    keywords: ["profit margin calculator", "gross margin", "net profit margin"],
    howToUse: ["Enter revenue and cost of goods sold.", "Add operating expenses for net margin.", "View margin percentages."],
    formula: "margin % = (profit / revenue) × 100",
    faq: bizFaq,
  }),
  makeTool({
    slug: "roi-calculator",
    title: "ROI Calculator",
    shortDescription: "Calculate return on investment percentage and net gain from any campaign or project.",
    category: "financial",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-indigo-600",
    badge: "Business Calculator",
    popular: true,
    keywords: ["roi calculator", "return on investment", "marketing roi"],
    howToUse: ["Enter investment cost and return value.", "View ROI percentage and net profit.", "Compare multiple scenarios."],
    formula: "ROI % = ((gain − cost) / cost) × 100",
    faq: bizFaq,
  }),
  makeTool({
    slug: "break-even-calculator",
    title: "Break-even Calculator",
    shortDescription: "Find break-even units and revenue for your product or service.",
    category: "financial",
    icon: "Scale",
    gradient: "from-amber-500 to-yellow-500",
    badge: "Business Calculator",
    keywords: ["break even calculator", "break even point", "breakeven analysis"],
    howToUse: ["Enter fixed costs, variable cost per unit, and price per unit.", "View break-even units and revenue.", "Model price changes."],
    formula: "break-even units = fixed costs / (price − variable cost)",
    faq: bizFaq,
  }),
];

/** QR alias config — same component as qr-generator */
export const QR_ALIAS_TOOL: ToolConfig = makeTool({
  slug: "qr-code-generator",
  title: "QR Code Generator",
  shortDescription: "Create custom QR codes with logo, colors, and PNG/SVG/JPG download.",
  category: "productivity",
  icon: "QrCode",
  gradient: "from-violet-500 to-purple-600",
  badge: "Generator",
  popular: true,
  keywords: ["qr code generator", "free qr code", "custom qr code", "qr code with logo"],
  howToUse: [
    "Enter a URL or text.",
    "Customize colors, style, and optional logo.",
    "Download as PNG, SVG, or JPG.",
  ],
  formula: "QR matrix encoding with error correction + optional center logo overlay",
  faq: [
    { question: "Can I add a logo to my QR code?", answer: "Yes. Upload a PNG or SVG logo and it will be centered with auto-scaling." },
    { question: "What download formats are supported?", answer: "PNG, SVG, and JPG." },
    { question: "Do QR codes expire?", answer: "Static QR codes encode your data directly and work indefinitely." },
    { question: "Is this free?", answer: "Yes. No signup required." },
  ],
  seoTitle: "QR Code Generator — Free Custom QR with Logo | Ranburg.com",
  seoDescription: "Free QR code generator with logo upload, custom colors, rounded dots, and PNG/SVG/JPG download. No signup.",
});

import type { ToolCategoryId } from "./toolsConfig";

export interface ComingSoonTool {
  slug: string;
  title: string;
  shortDescription: string;
  category: ToolCategoryId | "salesforce";
  icon: string;
  gradient: string;
  benefits: string[];
  useCases: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const COMING_SOON_TOOLS: ComingSoonTool[] = [
  {
    slug: "apex-trigger-generator",
    title: "Apex Trigger Generator",
    shortDescription: "Generate bulkified Apex trigger handlers with best-practice patterns.",
    category: "salesforce",
    icon: "Code2",
    gradient: "from-indigo-600 to-violet-600",
    benefits: ["Bulk-safe handler stubs", "Governor-limit aware patterns", "Test class scaffolding"],
    useCases: ["New object triggers", "Refactoring legacy triggers", "Admin-to-developer handoffs"],
    seo: {
      title: "Apex Trigger Generator | Coming Soon | Ranburg",
      description: "Free Salesforce Apex trigger generator — bulkified handlers, best practices, and test scaffolding. Join the waitlist.",
      keywords: ["Apex trigger generator", "Salesforce trigger template", "bulkified Apex"],
    },
  },
  {
    slug: "dataraptor-formula-builder",
    title: "DataRaptor Formula Builder",
    shortDescription: "Build and validate OmniStudio DataRaptor formulas and mappings.",
    category: "salesforce",
    icon: "Layers",
    gradient: "from-purple-600 to-indigo-600",
    benefits: ["Extract/Transform/Load helpers", "JSON mapping previews", "OmniStudio syntax hints"],
    useCases: ["Industries Cloud integrations", "OmniScript data flows", "Catalog enrichment"],
    seo: {
      title: "DataRaptor Formula Builder | Coming Soon | Ranburg",
      description: "OmniStudio DataRaptor formula builder for Salesforce Industries. Join the waitlist for early access.",
      keywords: ["DataRaptor formula", "OmniStudio tool", "Vlocity DataRaptor"],
    },
  },
  {
    slug: "sharing-rule-generator",
    title: "Sharing Rule Generator",
    shortDescription: "Draft criteria-based and owner-based sharing rules with documentation.",
    category: "salesforce",
    icon: "ShieldCheck",
    gradient: "from-emerald-600 to-teal-600",
    benefits: ["Criteria rule templates", "Security review checklist", "Share group suggestions"],
    useCases: ["Enterprise security design", "Sandbox provisioning", "Compliance audits"],
    seo: {
      title: "Salesforce Sharing Rule Generator | Coming Soon | Ranburg",
      description: "Generate Salesforce sharing rule drafts and security documentation. Free tool coming soon from Ranburg LLP.",
      keywords: ["Salesforce sharing rules", "security generator", "Salesforce admin tools"],
    },
  },
  {
    slug: "formula-explainer",
    title: "Salesforce Formula Explainer",
    shortDescription: "Paste any Salesforce formula and get a plain-English explanation.",
    category: "salesforce",
    icon: "FunctionSquare",
    gradient: "from-sky-500 to-blue-600",
    benefits: ["Line-by-line breakdown", "Null-handling notes", "Cross-object reference map"],
    useCases: ["Inherited org documentation", "Admin learning", "Validation rule reviews"],
    seo: {
      title: "Salesforce Formula Explainer | Coming Soon | Ranburg",
      description: "Explain Salesforce formulas in plain English. Free formula explainer tool coming soon — join the waitlist.",
      keywords: ["Salesforce formula explainer", "formula field help", "Salesforce admin tools"],
    },
  },
];

export function getComingSoonTool(slug: string): ComingSoonTool | undefined {
  return COMING_SOON_TOOLS.find((t) => t.slug === slug);
}

export function getAllComingSoonSlugs(): string[] {
  return COMING_SOON_TOOLS.map((t) => t.slug);
}

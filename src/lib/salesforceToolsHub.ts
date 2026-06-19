export interface SalesforceToolSection {
  id: string;
  label: string;
  description: string;
  slugs: string[];
}

export const SALESFORCE_TOOL_SECTIONS: SalesforceToolSection[] = [
  {
    id: "formula",
    label: "Formula Tools",
    description: "Build field formulas, date logic, and flow expressions.",
    slugs: ["formula-generator", "date-formula-helper", "flow-formula-builder"],
  },
  {
    id: "apex",
    label: "Apex Tools",
    description: "Generate test classes and validation rules faster.",
    slugs: ["apex-test-generator", "validation-rule-generator"],
  },
  {
    id: "soql",
    label: "SOQL Tools",
    description: "Compose and validate SOQL queries interactively.",
    slugs: ["soql-builder"],
  },
  {
    id: "flow",
    label: "Flow Tools",
    description: "Cron schedules and flow formula helpers.",
    slugs: ["cron-generator", "flow-formula-builder"],
  },
  {
    id: "admin",
    label: "Admin Tools",
    description: "Scheduler, governor limits, and validation utilities.",
    slugs: ["cron-generator", "governor-limits-calculator", "validation-rule-generator"],
  },
  {
    id: "revenue",
    label: "Revenue Cloud Tools",
    description: "Pricing calculators and OmniStudio expression builders.",
    slugs: ["revenue-cloud-pricing-calculator", "omnistudio-expression-builder"],
  },
];

/** SEO-friendly alternate slugs → canonical tool slugs */
export const TOOL_SLUG_REDIRECTS: Record<string, string> = {
  "sip-calculator": "sip",
  "swp-calculator": "swp",
  "emi-calculator": "emi",
  "salesforce-formula-generator": "formula-generator",
  "salesforce-cron-generator": "cron-generator",
  "governor-limit-calculator": "governor-limits-calculator",
  "revenue-cloud-calculator": "revenue-cloud-pricing-calculator",
};

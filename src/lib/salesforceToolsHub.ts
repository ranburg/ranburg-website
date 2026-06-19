export interface SalesforceToolSection {
  id: string;
  label: string;
  description: string;
  slugs: string[];
  comingSoonSlugs?: string[];
}

export const SALESFORCE_TOOL_SECTIONS: SalesforceToolSection[] = [
  {
    id: "admin",
    label: "Admin Tools",
    description: "Schedulers, governor limits, and validation utilities for Salesforce admins.",
    slugs: ["cron-generator", "governor-limits-calculator", "validation-rule-generator"],
  },
  {
    id: "developer",
    label: "Developer Tools",
    description: "Apex, SOQL, and test generation for Salesforce developers.",
    slugs: ["apex-test-generator", "soql-builder"],
  },
  {
    id: "formula",
    label: "Formula Tools",
    description: "Field formulas, date logic, and flow expressions.",
    slugs: ["formula-generator", "date-formula-helper", "flow-formula-builder"],
  },
  {
    id: "revenue",
    label: "Revenue Cloud Tools",
    description: "CPQ and pricing calculators for quote-to-cash teams.",
    slugs: ["revenue-cloud-pricing-calculator"],
  },
  {
    id: "omnistudio",
    label: "OmniStudio Tools",
    description: "Expression builders for Industries Cloud and OmniStudio programs.",
    slugs: ["omnistudio-expression-builder"],
  },
  {
    id: "flow",
    label: "Flow Tools",
    description: "Cron schedules and flow formula helpers.",
    slugs: ["flow-formula-builder"],
  },
  {
    id: "coming-soon",
    label: "Coming Soon Tools",
    description: "New Salesforce utilities in active development — join the waitlist.",
    slugs: [],
    comingSoonSlugs: ["apex-trigger-generator", "dataraptor-formula-builder", "sharing-rule-generator", "formula-explainer"],
  },
];

export const TOOL_SLUG_REDIRECTS: Record<string, string> = {
  "sip-calculator": "sip",
  "swp-calculator": "swp",
  "emi-calculator": "emi",
  "salesforce-formula-generator": "formula-generator",
  "salesforce-cron-generator": "cron-generator",
  "governor-limit-calculator": "governor-limits-calculator",
  "revenue-cloud-calculator": "revenue-cloud-pricing-calculator",
  "date-formula-generator": "date-formula-helper",
};

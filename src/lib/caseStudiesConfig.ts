export interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  industry: string;
  products: string[];
  stack: string[];
  challenge: string;
  solution: string;
  impact: string[];
  outcomes: string[];
  relatedServices: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "revenue-cloud-implementation",
    title: "Global B2B Revenue Cloud Implementation",
    excerpt: "Unified quote-to-cash for a multi-entity software vendor across three regions.",
    industry: "B2B Software",
    products: ["Revenue Cloud", "Sales Cloud", "Experience Cloud"],
    stack: ["CPQ", "Billing", "Subscription Management", "MuleSoft"],
    challenge:
      "A fast-growing ISV relied on spreadsheets and disconnected CPQ instances. Quotes took weeks, discount governance was inconsistent, and billing reconciliation required manual exports to ERP.",
    solution:
      "Ranburg LLP designed a single Revenue Cloud architecture with centralized product catalogs, approval workflows, and API-led integration to NetSuite. We phased rollout by region while maintaining parallel run for one quarter.",
    impact: [
      "42% reduction in quote cycle time",
      "99.2% invoice accuracy post go-live",
      "Single source of truth for product and pricing",
    ],
    outcomes: [
      "Executive CPQ dashboard for pipeline and discount leakage",
      "Automated renewal quotes 90 days before contract end",
      "Documented RACI for catalog ownership",
    ],
    relatedServices: ["revenue-cloud", "salesforce-integrations", "salesforce-consulting"],
    seo: {
      title: "Revenue Cloud Implementation Case Study | Ranburg LLP",
      description: "How Ranburg delivered Revenue Cloud CPQ and billing for a global B2B software company.",
      keywords: ["Revenue Cloud case study", "CPQ implementation", "quote to cash"],
    },
  },
  {
    slug: "omnistudio-transformation",
    title: "OmniStudio Digital Sales Transformation",
    excerpt: "Agent-guided selling and self-service for a telecommunications provider.",
    industry: "Telecommunications",
    products: ["Industries Cloud", "OmniStudio", "Experience Cloud"],
    stack: ["OmniScripts", "FlexCards", "DataRaptors", "Integration Procedures"],
    challenge:
      "Legacy BSS workflows forced agents through six systems to quote complex bundles. Digital channels could not expose the same product rules, causing channel conflict and high call center volume.",
    solution:
      "Ranburg implemented OmniStudio-guided journeys integrated with Revenue Cloud quoting APIs. FlexCard agent consoles and a self-service Experience Cloud site share the same orchestration layer.",
    impact: [
      "35% increase in digital order completion",
      "50% faster agent onboarding",
      "Reduced MACD defects in production",
    ],
    outcomes: [
      "Reusable OmniStudio component library with governance",
      "Regression suite for top 20 customer journeys",
      "OmniStudio Center of Excellence playbook",
    ],
    relatedServices: ["omnistudio-development", "experience-cloud", "salesforce-industries"],
    seo: {
      title: "OmniStudio Transformation Case Study | Ranburg",
      description: "Telecom OmniStudio implementation — guided selling, FlexCards, and digital self-service by Ranburg LLP.",
      keywords: ["OmniStudio case study", "Industries Cloud telecom", "Vlocity implementation"],
    },
  },
  {
    slug: "salesforce-industries-modernization",
    title: "Salesforce Industries Modernization",
    excerpt: "Insurance policy administration upgrade on Industries Cloud.",
    industry: "Insurance",
    products: ["Insurance Cloud", "Sales Cloud", "Service Cloud"],
    stack: ["Industries data model", "OmniStudio", "Marketing Cloud"],
    challenge:
      "A regional insurer ran policy admin on a 15-year-old custom platform. Agents lacked 360° member views and compliance reporting required manual spreadsheet consolidation.",
    solution:
      "Ranburg migrated core policy objects to Insurance Cloud with phased cutover by line of business. Integration Procedures connect claims feeds and broker portals via Experience Cloud.",
    impact: [
      "28% faster claims triage",
      "Unified member timeline for agents",
      "Audit-ready compliance reports",
    ],
    outcomes: [
      "Decommissioned two legacy middleware layers",
      "Broker portal NPS improved 18 points",
      "Documented data migration reconciliation",
    ],
    relatedServices: ["salesforce-industries", "salesforce-integrations", "managed-services"],
    seo: {
      title: "Salesforce Industries Modernization | Case Study | Ranburg",
      description: "Insurance Industries Cloud modernization — policy admin, portals, and integrations by Ranburg LLP.",
      keywords: ["Salesforce Industries case study", "Insurance Cloud", "Vlocity consultant"],
    },
  },
  {
    slug: "automotive-cloud-solution",
    title: "Automotive Cloud OEM & Dealer Solution",
    excerpt: "Vehicle lifecycle and dealer community for an automotive OEM.",
    industry: "Automotive",
    products: ["Automotive Cloud", "Experience Cloud", "Marketing Cloud"],
    stack: ["Vehicle 360", "Dealer community", "Lead routing", "Service appointments"],
    challenge:
      "An OEM struggled to connect dealer CRM data with national marketing campaigns. Vehicle ownership history was fragmented across DMS exports and spreadsheets.",
    solution:
      "Ranburg deployed Automotive Cloud with dealer Experience Cloud sites, entitlement-based sharing, and event-driven sync to dealer management systems.",
    impact: [
      "Dealer adoption above 85% in 90 days",
      "Unified VIN-level customer record",
      "Recall campaign reach improved 3x",
    ],
    outcomes: [
      "OEM-dealer data governance framework",
      "Self-service service booking for owners",
      "Executive fleet and loyalty dashboards",
    ],
    relatedServices: ["salesforce-industries", "experience-cloud", "salesforce-development"],
    seo: {
      title: "Automotive Cloud Case Study | Ranburg LLP",
      description: "Automotive Cloud OEM and dealer community implementation by certified Ranburg consultants.",
      keywords: ["Automotive Cloud case study", "Salesforce automotive", "dealer community"],
    },
  },
  {
    slug: "enterprise-salesforce-integration",
    title: "Enterprise Salesforce Integration Hub",
    excerpt: "API-led connectivity between Salesforce, SAP, and payment gateways.",
    industry: "Manufacturing",
    products: ["Sales Cloud", "Service Cloud", "MuleSoft Anypoint"],
    stack: ["REST APIs", "Platform Events", "SAP IDoc", "Stripe"],
    challenge:
      "Order status, inventory, and payments were siloed. Customer service agents toggled between five applications, and order updates lagged by up to 24 hours.",
    solution:
      "Ranburg architected an integration hub with idempotent APIs, dead-letter queues, and correlation IDs. Platform Events broadcast order milestones to Experience Cloud and Service Cloud consoles.",
    impact: [
      "Sub-minute order status in Salesforce",
      "60% reduction in agent handle time",
      "Zero duplicate payment incidents post launch",
    ],
    outcomes: [
      "OpenAPI catalog for all integration endpoints",
      "24/7 monitoring and alerting runbook",
      "Sandbox data masking for compliance",
    ],
    relatedServices: ["salesforce-integrations", "salesforce-development", "managed-services"],
    seo: {
      title: "Enterprise Salesforce Integration Case Study | Ranburg",
      description: "Salesforce SAP and payment integration architecture — API-led connectivity by Ranburg LLP India.",
      keywords: ["Salesforce integration case study", "SAP Salesforce", "API integration"],
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

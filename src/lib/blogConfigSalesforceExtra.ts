import type { BlogPost } from "./blogTypes";

export const EXTRA_SALESFORCE_BLOG_POSTS: BlogPost[] = [
  {
    slug: "revenue-cloud-vs-salesforce-cpq",
    title: "Revenue Cloud vs Salesforce CPQ: What Changed and What to Choose",
    excerpt:
      "Understand how Revenue Cloud evolved from Salesforce CPQ, what capabilities moved where, and how to plan your quote-to-cash roadmap in 2026.",
    date: "2026-03-22",
    readTime: "14 min",
    seo: {
      title: "Revenue Cloud vs Salesforce CPQ | Ranburg Guide",
      description:
        "Compare Revenue Cloud and legacy Salesforce CPQ. Licensing, architecture, and migration guidance from certified Ranburg consultants in India.",
      keywords: ["Revenue Cloud vs CPQ", "Salesforce CPQ", "Revenue Cloud", "quote to cash", "CPQ migration"],
    },
    sections: [
      { type: "h2", text: "From Salesforce CPQ to Revenue Cloud" },
      {
        type: "p",
        text: "For a decade, Salesforce CPQ (Steel Brick) was the standard for B2B configure-price-quote on Salesforce. Salesforce has repositioned quote-to-cash under Revenue Cloud — a broader suite spanning CPQ, Billing, Subscription Management, Salesforce Pricing, and consumption models. Existing CPQ customers often ask whether they must migrate, what features are equivalent, and how licensing changes. Ranburg LLP implements both legacy CPQ and modern Revenue Cloud programs from Jaipur, India, for global enterprises.",
      },
      {
        type: "p",
        text: "This guide clarifies naming, functional overlap, migration triggers, and architectural recommendations so architects and commercial operations leaders make informed platform decisions.",
      },
      { type: "h2", text: "What Salesforce CPQ Still Means" },
      {
        type: "p",
        text: "Salesforce CPQ refers to the configure-price-quote product: product bundles, option constraints, discount schedules, quote templates, and approval workflows. Many production orgs run CPQ successfully with years of customized product rules, Apex hooks, and ERP integrations. CPQ is not deprecated overnight — but new Salesforce roadmap investment emphasizes Revenue Cloud primitives, unified pricing engines, and tighter Billing integration.",
      },
      { type: "h2", text: "What Revenue Cloud Adds" },
      {
        type: "p",
        text: "Revenue Cloud unifies CPQ with contract lifecycle, subscription amendments, invoicing, payment application, and usage rating. Salesforce Pricing introduces centralized price books and promotion procedures decoupled from individual quote lines. Subscription Management models renewals, coterminous upgrades, and asset-based relationships. For software and subscription businesses, Revenue Cloud reduces middleware between quote and cash.",
      },
      { type: "h3", text: "Billing and CPQ Together" },
      {
        type: "p",
        text: "Legacy programs often integrated CPQ to external billing (Zuora, Oracle, SAP). Revenue Cloud Billing native on Salesforce appeals to organizations standardizing on one platform. Ranburg evaluates total cost of ownership: license uplift, re-implementation effort, and operational risk of big-bang migration vs phased coexistence.",
      },
      { type: "h2", text: "When to Stay on CPQ" },
      {
        type: "p",
        text: "Remain on CPQ when your org is stable, integrations are mature, billing stays external, and near-term roadmap does not require Subscription Management or Salesforce Pricing. Minimize change if a private equity hold period or regulatory freeze limits platform churn. Invest in org health: rule consolidation, test automation, and documentation.",
      },
      { type: "h2", text: "When to Migrate to Revenue Cloud" },
      {
        type: "p",
        text: "Migrate when launching subscription products, consolidating billing on Salesforce, adopting consumption pricing, or when Salesforce contract entitlements include Revenue Cloud SKUs replacing legacy CPQ renewals. Greenfield quote-to-cash programs should default to Revenue Cloud unless a specific CPQ gap is documented.",
      },
      { type: "h2", text: "Migration Approach" },
      {
        type: "p",
        text: "Ranburg recommends inventory of product rules, custom Apex, integrations, and quote document templates. Map CPQ objects to Revenue Cloud data model. Run parallel quoting in sandbox before cutover. Train revenue operations on amendment workflows. Use our Revenue Cloud Pricing Calculator and implementation guide resources on Ranburg.com.",
      },
      {
        type: "p",
        text: "Contact Ranburg LLP for Revenue Cloud assessments, CPQ remediation, and phased migration planning.",
      },
    ],
    faq: [
      { question: "Is Salesforce CPQ going away?", answer: "Salesforce invests in Revenue Cloud; CPQ capabilities persist but new features favor Revenue Cloud. Plan roadmap with your account team." },
      { question: "Can CPQ and Revenue Cloud coexist?", answer: "Yes during transition. Define which system owns quotes and contracts to avoid duplicate products." },
      { question: "Does Ranburg migrate CPQ to Revenue Cloud?", answer: "Yes. Ranburg LLP provides quote-to-cash consulting and implementation from India." },
      { question: "What about Industries Cloud CPQ?", answer: "Industries programs may integrate Industries catalogs with Revenue Cloud CPQ APIs — boundary design is critical." },
    ],
    relatedServices: ["revenue-cloud", "salesforce-consulting", "salesforce-industries"],
    relatedTools: ["revenue-cloud-pricing-calculator", "formula-generator"],
  },
  {
    slug: "salesforce-industries-implementation-guide",
    title: "Salesforce Industries Implementation Guide: From Discovery to Go-Live",
    excerpt:
      "A phased playbook for Industries Cloud programs — Vlocity data models, OmniStudio, integrations, governance, and adoption for telecom, insurance, and financial services.",
    date: "2026-03-25",
    readTime: "16 min",
    seo: {
      title: "Salesforce Industries Implementation Guide | Ranburg",
      description:
        "Step-by-step Salesforce Industries Cloud implementation guide. OmniStudio, Vlocity models, integrations, and go-live best practices from Ranburg LLP India.",
      keywords: [
        "Salesforce Industries implementation",
        "Vlocity implementation",
        "Industries Cloud guide",
        "OmniStudio implementation",
        "Ranburg LLP",
      ],
    },
    sections: [
      { type: "h2", text: "Why Industries Implementations Are Different" },
      {
        type: "p",
        text: "Salesforce Industries Cloud (built on Vlocity intellectual property) delivers vertical data models, integration packs, and OmniStudio experiences for telecommunications, insurance, health, financial services, and more. Unlike horizontal Sales Cloud rollouts, Industries programs touch product catalogs with deep attribute models, MACD workflows, policy administration patterns, and BSS/OSS integrations. Ranburg LLP specializes in these programs for clients worldwide from Jaipur, Rajasthan, India.",
      },
      { type: "h2", text: "Phase 1: Discovery and Current-State Assessment" },
      {
        type: "p",
        text: "Begin with business capabilities mapping: lead-to-order, fulfill, bill, care. Inventory legacy systems, data quality, and regulatory constraints. Ranburg facilitators run workshops with product, IT, and operations stakeholders. Deliverables include gap analysis, integration inventory, and phased roadmap with MVP scope.",
      },
      { type: "h2", text: "Phase 2: Architecture and Data Model Design" },
      {
        type: "p",
        text: "Define canonical product, customer, and asset models using Industries objects. Decide single-org vs multi-org strategy. Document API contracts to billing, provisioning, and ERP. Establish OmniStudio naming standards and promotion paths across sandboxes. Security and sharing models must account for partner and dealer communities.",
      },
      { type: "h3", text: "OmniStudio Governance" },
      {
        type: "p",
        text: "OmniScripts, FlexCards, DataRaptors, and Integration Procedures multiply quickly without governance. Ranburg implements component libraries, peer review, and automated regression for critical journeys before every release.",
      },
      { type: "h2", text: "Phase 3: Build and Integrate" },
      {
        type: "p",
        text: "Execute in agile sprints aligned to customer journeys — acquisition, change-of-service, retention. Integrate via REST, SOAP, platform events, or MuleSoft as appropriate. Use Industries integration packs where available to reduce custom code. Test attribute-driven products with realistic catalog volumes.",
      },
      { type: "h2", text: "Phase 4: Revenue Cloud and Industries Boundaries" },
      {
        type: "p",
        text: "Many Industries programs require Revenue Cloud for enterprise CPQ and billing. Define RACI: which cloud owns catalog, quote, order, invoice. OmniStudio orchestrates; CPQ calculates. Ranburg architects prevent duplicate pricing logic across DataRaptors and CPQ product rules.",
      },
      { type: "h2", text: "Phase 5: Testing and Performance" },
      {
        type: "p",
        text: "Industries UIs are component-heavy. Load-test OmniScripts with production-like data volumes. Monitor Integration Procedure timeouts and SOQL limits. Automate regression for MACD scenarios — the costliest defects appear in amendment and co-termed bundles.",
      },
      { type: "h2", text: "Phase 6: Adoption and Hypercare" },
      {
        type: "p",
        text: "Train agents and digital teams with role-based curricula. Monitor adoption dashboards and case deflection on self-service portals. Hypercare with war-room support for first 4–8 weeks post go-live. Transition to Ranburg managed services or staff augmentation for steady-state enhancements.",
      },
      {
        type: "p",
        text: "Explore Ranburg's OmniStudio tools, Industries service page, and contact us for a discovery workshop.",
      },
    ],
    faq: [
      { question: "How long does Industries implementation take?", answer: "MVPs often run 4–9 months; enterprise transformations span 12–24+ months depending on scope and integrations." },
      { question: "Do I need OmniStudio skills?", answer: "Yes for Industries experiences. Ranburg provides OmniStudio developers and training." },
      { question: "Vlocity vs Industries Cloud naming?", answer: "Salesforce rebranded Vlocity industry solutions as Industries Cloud; OmniStudio remains the experience layer." },
      { question: "Does Ranburg implement Industries in India?", answer: "Yes. Ranburg LLP is based in Jaipur and serves global Industries Cloud clients." },
    ],
    relatedServices: ["salesforce-industries", "omnistudio-development", "revenue-cloud"],
    relatedTools: ["omnistudio-expression-builder", "soql-builder"],
  },
];

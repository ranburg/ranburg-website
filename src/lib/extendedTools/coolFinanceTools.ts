import { makeTool } from "./makeTool";
import type { ToolConfig } from "../toolsConfig";

const disclaimerFaq = [
  {
    question: "Is this financial advice?",
    answer: "No. Ranburg tools provide educational estimates only. Confirm products, fees, and eligibility with banks or licensed advisors.",
  },
  {
    question: "Is it free?",
    answer: "Yes. No signup required.",
  },
];

export const COOL_FINANCE_TOOLS: ToolConfig[] = [
  makeTool({
    slug: "credit-card-finder",
    title: "Credit Card Finder",
    shortDescription:
      "Answer a short quiz about income, credit band, and spending — get ranked credit card matches for India, US, UK, Canada, Australia, Singapore, and UAE.",
    category: "financial",
    icon: "CreditCard",
    gradient: "from-teal-500 to-emerald-600",
    badge: "Smart Matcher",
    popular: true,
    keywords: [
      "best credit card for me",
      "credit card recommender",
      "credit card finder india",
      "best credit card based on spending",
    ],
    howToUse: [
      "Select your country.",
      "Enter monthly income and credit score band.",
      "Add typical spend by category (groceries, fuel, travel, etc.).",
      "Review ranked cards with estimated rewards fit.",
    ],
    formula: "score = estimated annual reward value − fee drag + preference boosts; filter by income & score band",
    faq: [
      ...disclaimerFaq,
      {
        question: "Which countries are supported?",
        answer: "India, United States, United Kingdom, Canada, Australia, Singapore, and UAE.",
      },
      {
        question: "Will I get approved?",
        answer: "We cannot guarantee approval. Results are planning matches based on typical issuer gates.",
      },
    ],
    seoTitle: "Credit Card Finder — Best Card for Your Spending | Ranburg",
    seoDescription:
      "Free credit card recommender. Tell us your country, income, score band, and spend categories — get ranked card matches for IN, US, UK, CA, AU, SG, and UAE.",
  }),
  makeTool({
    slug: "rent-vs-buy-calculator",
    title: "Rent vs Buy Calculator",
    shortDescription:
      "Should you rent or buy? Same-cash SIP comparison using city 10-year housing CAGRs, EMI, stamp duty, and sell-at-horizon.",
    category: "financial",
    icon: "Home",
    gradient: "from-cyan-500 to-teal-600",
    badge: "Housing",
    popular: true,
    keywords: ["rent vs buy calculator", "should I rent or buy", "home loan vs rent"],
    howToUse: [
      "This tool opens in live-in mode: buy the home you occupy vs rent a similar place and SIP the difference.",
      "Pick a city for a 10-year price CAGR, or set CAGR yourself.",
      "Match SIP to extra housing cash and compare net worth over your horizon.",
    ],
    formula:
      "Matched SIP = max(0, EMI + costs − comparable rent). Home net worth = property − loan + leftover vs rent. Optional sell-at-horizon net of selling costs.",
    faq: disclaimerFaq,
  }),
  makeTool({
    slug: "bill-split-calculator",
    title: "Bill Split Calculator",
    shortDescription: "Split restaurant or group bills with tip — see total and per-person share instantly.",
    category: "productivity",
    icon: "Users",
    gradient: "from-amber-500 to-orange-500",
    badge: "Everyday",
    popular: true,
    keywords: ["bill split calculator", "split the bill", "tip calculator"],
    howToUse: ["Enter bill amount.", "Set people and tip %.", "Share the per-person total."],
    formula: "each = bill × (1 + tip%) / people",
    faq: disclaimerFaq,
  }),
  makeTool({
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription: "Project how principal grows with compounding frequency — monthly, quarterly, or yearly.",
    category: "financial",
    icon: "TrendingUp",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Investing",
    popular: true,
    keywords: ["compound interest calculator", "compounding calculator", "future value calculator"],
    howToUse: ["Enter principal, rate, and years.", "Choose compounds per year.", "View future value and interest."],
    formula: "FV = P × (1 + r/n)^(n×t)",
    faq: disclaimerFaq,
  }),
  makeTool({
    slug: "sleep-calculator",
    title: "Sleep Cycle Calculator",
    shortDescription: "Pick a wake-up time and get suggested bedtimes aligned to ~90-minute sleep cycles.",
    category: "productivity",
    icon: "Moon",
    gradient: "from-indigo-500 to-slate-700",
    badge: "Wellness",
    keywords: ["sleep calculator", "sleep cycle calculator", "best time to sleep"],
    howToUse: ["Enter your wake-up time.", "Review 4–6 cycle bedtime options.", "Pick the one that fits your night."],
    formula: "bedtime ≈ wake − (cycles × 90 min) − 15 min",
    faq: [
      { question: "Is this medical advice?", answer: "No. It is a simple planning heuristic based on typical sleep cycles." },
      { question: "Is it free?", answer: "Yes." },
    ],
  }),
  makeTool({
    slug: "salary-hike-calculator",
    title: "Salary Hike Calculator",
    shortDescription: "See how a CTC hike translates to approximate monthly take-home after tax assumptions.",
    category: "financial",
    icon: "IndianRupee",
    gradient: "from-teal-500 to-cyan-600",
    badge: "Career",
    popular: true,
    keywords: ["salary hike calculator", "ctc hike calculator", "appraisal calculator india"],
    howToUse: ["Enter current CTC.", "Set hike % and tax/deduction estimate.", "View new CTC and monthly delta."],
    formula: "monthly delta ≈ (newCTC − oldCTC) × (1 − tax%) / 12",
    faq: disclaimerFaq,
  }),
  makeTool({
    slug: "color-contrast-checker",
    title: "Color Contrast Checker",
    shortDescription: "Check WCAG AA/AAA contrast between text and background colors for accessible UI design.",
    category: "design",
    icon: "Contrast",
    gradient: "from-teal-600 to-emerald-500",
    badge: "Accessibility",
    popular: true,
    keywords: ["color contrast checker", "wcag contrast", "accessibility contrast ratio"],
    howToUse: ["Pick foreground and background colors.", "Preview sample text.", "Read ratio and AA/AAA pass/fail."],
    formula: "contrast = (L1 + 0.05) / (L2 + 0.05) using relative luminance",
    faq: [
      { question: "What ratio do I need?", answer: "WCAG AA normal text needs at least 4.5:1; large text needs 3:1. AAA needs 7:1." },
      { question: "Is it free?", answer: "Yes." },
    ],
  }),
];

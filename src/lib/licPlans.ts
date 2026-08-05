/**
 * Illustrative LIC plan catalog for maturity estimates.
 * Bonus rates approximate published simple reversionary bonus bands (₹ per ₹1,000 SA).
 * Rates change every year — users can override. Not affiliated with LIC.
 */

export type LicPlanId =
  | "jeevan-labh-736"
  | "new-jeevan-anand-715"
  | "new-endowment-714"
  | "jeevan-lakshya-733"
  | "single-premium-endowment-717"
  | "jeevan-tarun-734"
  | "new-children-money-back-732"
  | "money-back-20"
  | "money-back-25"
  | "custom";

export interface LicTermOption {
  term: number;
  ppt: number;
  label: string;
}

export interface LicPlanDefinition {
  id: LicPlanId;
  name: string;
  planNumber: string;
  category: "Endowment" | "Limited pay" | "Money back" | "Child" | "Custom";
  blurb: string;
  terms: LicTermOption[];
  minSumAssured: number;
  /** Sum Assured on Maturity as fraction of basic SA (usually 1). */
  maturitySaFactor: number;
  /** Money-back: total interim % of SA paid before maturity (informational). */
  moneyBackPct?: number;
  notes: string;
}

function bandBonus(
  sa: number,
  low: number,
  mid: number,
  high: number
): number {
  if (sa >= 1000000) return high;
  if (sa >= 500000) return mid;
  return low;
}

/** Illustrative SRB ₹/1000 SA for planning (approx FY 2024-25 style bands). */
export function getPlanBonusRate(planId: LicPlanId, term: number, sumAssured: number): number {
  switch (planId) {
    case "jeevan-labh-736":
      if (term <= 16) return bandBonus(sumAssured, 40, 41, 42);
      if (term <= 21) return bandBonus(sumAssured, 44, 45, 46);
      return bandBonus(sumAssured, 47, 48, 49);
    case "new-jeevan-anand-715":
    case "jeevan-lakshya-733":
      if (term <= 15) return bandBonus(sumAssured, 38, 38, 39);
      if (term <= 20) return bandBonus(sumAssured, 42, 42, 43);
      return bandBonus(sumAssured, 46, 46, 47);
    case "new-endowment-714":
    case "jeevan-tarun-734":
    case "new-children-money-back-732":
      if (term <= 15) return bandBonus(sumAssured, 35, 35, 36);
      if (term <= 20) return bandBonus(sumAssured, 39, 39, 40);
      return bandBonus(sumAssured, 45, 45, 46);
    case "single-premium-endowment-717":
      if (term <= 15) return bandBonus(sumAssured, 38, 38, 39);
      if (term <= 20) return bandBonus(sumAssured, 43, 43, 44);
      return bandBonus(sumAssured, 48, 48, 49);
    case "money-back-20":
      return bandBonus(sumAssured, 39, 40, 41);
    case "money-back-25":
      return bandBonus(sumAssured, 44, 45, 46);
    case "custom":
    default:
      return 45;
  }
}

/** Illustrative FAB ₹/1000 SA — rough planning default by term length. */
export function getDefaultFab(term: number): number {
  if (term < 15) return 0;
  if (term < 20) return 15;
  if (term < 25) return 30;
  return 45;
}

export const LIC_PLANS: LicPlanDefinition[] = [
  {
    id: "jeevan-labh-736",
    name: "LIC Jeevan Labh",
    planNumber: "736 / 936",
    category: "Limited pay",
    blurb: "Limited premium endowment — pay for PPT, cover full term, maturity = SA + bonuses + FAB.",
    terms: [
      { term: 16, ppt: 10, label: "16 yr term / 10 yr PPT" },
      { term: 21, ppt: 15, label: "21 yr term / 15 yr PPT" },
      { term: 25, ppt: 16, label: "25 yr term / 16 yr PPT" },
    ],
    minSumAssured: 200000,
    maturitySaFactor: 1,
    notes: "Popular limited-pay plan. Bonuses accrue for the full policy term while premiums are paid only during PPT.",
  },
  {
    id: "new-jeevan-anand-715",
    name: "LIC New Jeevan Anand",
    planNumber: "715",
    category: "Endowment",
    blurb: "Endowment with whole-life cover after maturity (death benefit continues). Maturity pays SA + bonuses + FAB.",
    terms: [
      { term: 15, ppt: 15, label: "15 years (PPT = term)" },
      { term: 20, ppt: 20, label: "20 years (PPT = term)" },
      { term: 25, ppt: 25, label: "25 years (PPT = term)" },
      { term: 30, ppt: 30, label: "30 years (PPT = term)" },
      { term: 35, ppt: 35, label: "35 years (PPT = term)" },
    ],
    minSumAssured: 100000,
    maturitySaFactor: 1,
    notes: "After maturity, risk cover on SA typically continues for life (no further premiums). This calculator estimates the maturity payout only.",
  },
  {
    id: "new-endowment-714",
    name: "LIC New Endowment",
    planNumber: "714",
    category: "Endowment",
    blurb: "Classic participating endowment — regular premiums for the full term.",
    terms: [
      { term: 12, ppt: 12, label: "12 years" },
      { term: 15, ppt: 15, label: "15 years" },
      { term: 20, ppt: 20, label: "20 years" },
      { term: 25, ppt: 25, label: "25 years" },
      { term: 30, ppt: 30, label: "30 years" },
      { term: 35, ppt: 35, label: "35 years" },
    ],
    minSumAssured: 100000,
    maturitySaFactor: 1,
    notes: "Maturity = Basic Sum Assured + vested simple reversionary bonuses + FAB (if declared).",
  },
  {
    id: "jeevan-lakshya-733",
    name: "LIC Jeevan Lakshya",
    planNumber: "733",
    category: "Endowment",
    blurb: "Participating plan with annual income benefit on death during term; maturity like endowment.",
    terms: [
      { term: 13, ppt: 13, label: "13 years" },
      { term: 15, ppt: 15, label: "15 years" },
      { term: 20, ppt: 20, label: "20 years" },
      { term: 25, ppt: 25, label: "25 years" },
    ],
    minSumAssured: 100000,
    maturitySaFactor: 1,
    notes: "Maturity estimate uses SA + bonuses + FAB. Death-time annual income benefits are not modelled here.",
  },
  {
    id: "single-premium-endowment-717",
    name: "LIC Single Premium Endowment",
    planNumber: "717",
    category: "Endowment",
    blurb: "One-time premium endowment — PPT is effectively 1 year.",
    terms: [
      { term: 10, ppt: 1, label: "10 yr term / single premium" },
      { term: 15, ppt: 1, label: "15 yr term / single premium" },
      { term: 20, ppt: 1, label: "20 yr term / single premium" },
      { term: 25, ppt: 1, label: "25 yr term / single premium" },
    ],
    minSumAssured: 50000,
    maturitySaFactor: 1,
    notes: "Enter the single premium as annual premium × 1 (PPT = 1). Bonuses still accrue over the full term.",
  },
  {
    id: "jeevan-tarun-734",
    name: "LIC Jeevan Tarun",
    planNumber: "734",
    category: "Child",
    blurb: "Child plan with flexible survival / maturity options. Estimate uses endowment-style SA + bonus + FAB.",
    terms: [
      { term: 15, ppt: 15, label: "15 years" },
      { term: 20, ppt: 20, label: "20 years" },
      { term: 25, ppt: 25, label: "25 years" },
    ],
    minSumAssured: 75000,
    maturitySaFactor: 1,
    notes: "Actual survival benefit schedule depends on option chosen (A/B/C/D). Treat this as a maturity-style estimate.",
  },
  {
    id: "new-children-money-back-732",
    name: "LIC New Children’s Money Back",
    planNumber: "732",
    category: "Child",
    blurb: "Child money-back style participating plan.",
    terms: [
      { term: 20, ppt: 20, label: "20 years" },
      { term: 25, ppt: 25, label: "25 years" },
    ],
    minSumAssured: 100000,
    maturitySaFactor: 1,
    moneyBackPct: 30,
    notes: "Interim survival benefits may be paid before maturity. Maturity shown is SA + bonuses + FAB (does not subtract prior money-back already paid).",
  },
  {
    id: "money-back-20",
    name: "LIC Money Back (20 years)",
    planNumber: "Money Back 20",
    category: "Money back",
    blurb: "20-year money-back style — interim % of SA during term; maturity pays remaining SA + bonuses.",
    terms: [{ term: 20, ppt: 20, label: "20 yr term / 20 yr PPT" }],
    minSumAssured: 100000,
    maturitySaFactor: 0.4,
    moneyBackPct: 60,
    notes: "Illustrative: assumes ~60% of SA paid as survival benefits during term and ~40% of SA at maturity, plus full-term bonuses + FAB. Confirm your exact schedule.",
  },
  {
    id: "money-back-25",
    name: "LIC Money Back (25 years)",
    planNumber: "Money Back 25",
    category: "Money back",
    blurb: "25-year money-back style — interim survival benefits + maturity residue + bonuses.",
    terms: [{ term: 25, ppt: 25, label: "25 yr term / 25 yr PPT" }],
    minSumAssured: 100000,
    maturitySaFactor: 0.4,
    moneyBackPct: 60,
    notes: "Illustrative money-back split. Bonuses typically accrue on full basic SA for the term.",
  },
  {
    id: "custom",
    name: "Other / Custom plan",
    planNumber: "Custom",
    category: "Custom",
    blurb: "Enter your own term, PPT, and bonus rates for any other LIC participating plan.",
    terms: [
      { term: 15, ppt: 15, label: "15 / 15" },
      { term: 20, ppt: 20, label: "20 / 20" },
      { term: 25, ppt: 25, label: "25 / 25" },
      { term: 30, ppt: 30, label: "30 / 30" },
    ],
    minSumAssured: 50000,
    maturitySaFactor: 1,
    notes: "Use your policy bond for term/PPT and your bonus statement for rates.",
  },
];

export function getLicPlan(id: LicPlanId): LicPlanDefinition {
  return LIC_PLANS.find((p) => p.id === id) ?? LIC_PLANS[0];
}

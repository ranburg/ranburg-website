export type CardCountry = "IN" | "US" | "UK" | "CA" | "AU" | "SG" | "AE";
export type SpendCategory =
  | "groceries"
  | "fuel"
  | "dining"
  | "travel"
  | "online"
  | "utilities"
  | "entertainment"
  | "general";

export type CreditScoreBand = "excellent" | "good" | "fair" | "building";

export interface CreditCardProduct {
  id: string;
  name: string;
  issuer: string;
  country: CardCountry;
  annualFee: number;
  currency: string;
  minIncomeMonthly: number;
  minScore: CreditScoreBand;
  rewards: Partial<Record<SpendCategory, number>>;
  highlight: string;
  perks: string[];
  network: "Visa" | "Mastercard" | "Amex" | "RuPay" | "UnionPay";
  applyUrl?: string;
}

const SCORE_RANK: Record<CreditScoreBand, number> = {
  building: 1,
  fair: 2,
  good: 3,
  excellent: 4,
};

export const COUNTRY_OPTIONS: { code: CardCountry; label: string; currency: string }[] = [
  { code: "IN", label: "India", currency: "INR" },
  { code: "US", label: "United States", currency: "USD" },
  { code: "UK", label: "United Kingdom", currency: "GBP" },
  { code: "CA", label: "Canada", currency: "CAD" },
  { code: "AU", label: "Australia", currency: "AUD" },
  { code: "SG", label: "Singapore", currency: "SGD" },
  { code: "AE", label: "United Arab Emirates", currency: "AED" },
];

export const SPEND_CATEGORIES: { id: SpendCategory; label: string }[] = [
  { id: "groceries", label: "Groceries" },
  { id: "fuel", label: "Fuel / transit" },
  { id: "dining", label: "Dining / coffee" },
  { id: "travel", label: "Flights & hotels" },
  { id: "online", label: "Online shopping" },
  { id: "utilities", label: "Bills & utilities" },
  { id: "entertainment", label: "Streaming / entertainment" },
  { id: "general", label: "Everything else" },
];

/** Curated educational catalog — illustrative rewards, not live offers. */
export const CREDIT_CARDS: CreditCardProduct[] = [
  // India
  {
    id: "in-hdfc-regalia",
    name: "HDFC Regalia Gold",
    issuer: "HDFC Bank",
    country: "IN",
    annualFee: 2500,
    currency: "INR",
    minIncomeMonthly: 120000,
    minScore: "good",
    rewards: { travel: 4, dining: 3, online: 2, general: 1.5 },
    highlight: "Strong travel + lounge for mid-high spenders",
    perks: ["Airport lounge access", "Milestone fee waiver", "Reward points"],
    network: "Visa",
  },
  {
    id: "in-sbi-cashback",
    name: "SBI Cashback Card",
    issuer: "SBI Card",
    country: "IN",
    annualFee: 999,
    currency: "INR",
    minIncomeMonthly: 40000,
    minScore: "fair",
    rewards: { online: 5, general: 1 },
    highlight: "Simple 5% online cashback for e-commerce heavy users",
    perks: ["5% online cashback", "Easy redemption"],
    network: "Visa",
  },
  {
    id: "in-axis-ace",
    name: "Axis ACE",
    issuer: "Axis Bank",
    country: "IN",
    annualFee: 499,
    currency: "INR",
    minIncomeMonthly: 25000,
    minScore: "building",
    rewards: { utilities: 5, online: 4, dining: 2, general: 1 },
    highlight: "Bills + Google Pay friendly starter card",
    perks: ["Utility cashback", "Low fee"],
    network: "Visa",
  },
  {
    id: "in-amex-smartearn",
    name: "Amex SmartEarn",
    issuer: "American Express",
    country: "IN",
    annualFee: 495,
    currency: "INR",
    minIncomeMonthly: 35000,
    minScore: "fair",
    rewards: { online: 5, dining: 2, general: 1 },
    highlight: "Membership Rewards for online-first spend",
    perks: ["Welcome bonus", "MR points"],
    network: "Amex",
  },
  {
    id: "in-icici-sapphiro",
    name: "ICICI Sapphiro",
    issuer: "ICICI Bank",
    country: "IN",
    annualFee: 3500,
    currency: "INR",
    minIncomeMonthly: 150000,
    minScore: "good",
    rewards: { travel: 4, dining: 3, fuel: 2, general: 1 },
    highlight: "Premium dining and travel lifestyle card",
    perks: ["Lounge", "Golf", "Movie offers"],
    network: "Mastercard",
  },
  {
    id: "in-au-zenith",
    name: "AU Bank Zenith+",
    issuer: "AU Small Finance Bank",
    country: "IN",
    annualFee: 999,
    currency: "INR",
    minIncomeMonthly: 50000,
    minScore: "fair",
    rewards: { fuel: 3, groceries: 2, general: 1.5 },
    highlight: "Fuel + grocery tilt for daily drivers",
    perks: ["Fuel surcharge waiver", "Reward points"],
    network: "Visa",
  },
  // US
  {
    id: "us-chase-freedom",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    country: "US",
    annualFee: 0,
    currency: "USD",
    minIncomeMonthly: 3000,
    minScore: "good",
    rewards: { groceries: 5, dining: 3, general: 1 },
    highlight: "Rotating categories + solid everyday earn",
    perks: ["0% intro APR periods (when offered)", "Ultimate Rewards"],
    network: "Mastercard",
  },
  {
    id: "us-citi-double",
    name: "Citi Double Cash",
    issuer: "Citi",
    country: "US",
    annualFee: 0,
    currency: "USD",
    minIncomeMonthly: 2500,
    minScore: "fair",
    rewards: { general: 2 },
    highlight: "Flat 2% on everything — no category tracking",
    perks: ["Simple cash back", "No annual fee"],
    network: "Mastercard",
  },
  {
    id: "us-amex-gold",
    name: "Amex Gold",
    issuer: "American Express",
    country: "US",
    annualFee: 325,
    currency: "USD",
    minIncomeMonthly: 5000,
    minScore: "good",
    rewards: { dining: 4, groceries: 4, travel: 3, general: 1 },
    highlight: "Dining + grocery powerhouse if you hit credits",
    perks: ["Dining credits", "Uber Cash (terms apply)"],
    network: "Amex",
  },
  {
    id: "us-capital-one-venture",
    name: "Capital One Venture",
    issuer: "Capital One",
    country: "US",
    annualFee: 95,
    currency: "USD",
    minIncomeMonthly: 4000,
    minScore: "good",
    rewards: { travel: 2, general: 2 },
    highlight: "Simple miles for frequent travelers",
    perks: ["Travel eraser", "No foreign transaction fee"],
    network: "Visa",
  },
  {
    id: "us-discover-it",
    name: "Discover it Cash Back",
    issuer: "Discover",
    country: "US",
    annualFee: 0,
    currency: "USD",
    minIncomeMonthly: 2000,
    minScore: "building",
    rewards: { groceries: 5, fuel: 5, general: 1 },
    highlight: "Great for rebuilding / rotating 5% categories",
    perks: ["Cashback Match (new cardmembers, terms apply)", "No annual fee"],
    network: "Mastercard",
  },
  // UK
  {
    id: "uk-amex-platinum-cashback",
    name: "Amex Platinum Cashback Everyday",
    issuer: "American Express",
    country: "UK",
    annualFee: 25,
    currency: "GBP",
    minIncomeMonthly: 2000,
    minScore: "fair",
    rewards: { general: 1, online: 1.25 },
    highlight: "Straightforward cashback for UK everyday spend",
    perks: ["Cashback", "Purchase protection"],
    network: "Amex",
  },
  {
    id: "uk-barclaycard-rewards",
    name: "Barclaycard Rewards",
    issuer: "Barclays",
    country: "UK",
    annualFee: 0,
    currency: "GBP",
    minIncomeMonthly: 1500,
    minScore: "building",
    rewards: { general: 0.25, online: 0.5 },
    highlight: "No-fee starter rewards card",
    perks: ["No annual fee", "Section 75 protection"],
    network: "Visa",
  },
  {
    id: "uk-hsbc-reward",
    name: "HSBC Reward Credit Card",
    issuer: "HSBC",
    country: "UK",
    annualFee: 0,
    currency: "GBP",
    minIncomeMonthly: 1800,
    minScore: "fair",
    rewards: { groceries: 1, fuel: 1, general: 0.5 },
    highlight: "Everyday points for supermarket & fuel",
    perks: ["No annual fee", "Reward points"],
    network: "Visa",
  },
  // Canada
  {
    id: "ca-amex-cobalt",
    name: "Amex Cobalt",
    issuer: "American Express",
    country: "CA",
    annualFee: 155.94,
    currency: "CAD",
    minIncomeMonthly: 4000,
    minScore: "good",
    rewards: { dining: 5, groceries: 5, travel: 2, general: 1 },
    highlight: "Top Canadian earner for food & groceries",
    perks: ["MR points", "Dining multipliers"],
    network: "Amex",
  },
  {
    id: "ca-scotia-momentum",
    name: "Scotia Momentum Visa Infinite",
    issuer: "Scotiabank",
    country: "CA",
    annualFee: 120,
    currency: "CAD",
    minIncomeMonthly: 5000,
    minScore: "good",
    rewards: { groceries: 4, fuel: 2, utilities: 2, general: 1 },
    highlight: "Cash-back focused for Canadian households",
    perks: ["Cash back", "Scene+ partner perks (terms vary)"],
    network: "Visa",
  },
  {
    id: "ca-tangerine",
    name: "Tangerine Money-Back",
    issuer: "Tangerine",
    country: "CA",
    annualFee: 0,
    currency: "CAD",
    minIncomeMonthly: 2000,
    minScore: "fair",
    rewards: { groceries: 2, fuel: 2, general: 0.5 },
    highlight: "Pick your own 2% categories, no fee",
    perks: ["No annual fee", "Custom categories"],
    network: "Mastercard",
  },
  // Australia
  {
    id: "au-amex-explorer",
    name: "Amex Explorer",
    issuer: "American Express",
    country: "AU",
    annualFee: 395,
    currency: "AUD",
    minIncomeMonthly: 6000,
    minScore: "good",
    rewards: { travel: 3, dining: 2, general: 1 },
    highlight: "Travel credits for frequent flyers",
    perks: ["Lounge passes", "Travel credits"],
    network: "Amex",
  },
  {
    id: "au-cba-awards",
    name: "CommBank Awards",
    issuer: "Commonwealth Bank",
    country: "AU",
    annualFee: 0,
    currency: "AUD",
    minIncomeMonthly: 2500,
    minScore: "fair",
    rewards: { groceries: 1, fuel: 1, general: 0.5 },
    highlight: "No-fee everyday Australian rewards",
    perks: ["No annual fee", "Awards points"],
    network: "Mastercard",
  },
  {
    id: "au-anz-rewards",
    name: "ANZ Rewards Black",
    issuer: "ANZ",
    country: "AU",
    annualFee: 225,
    currency: "AUD",
    minIncomeMonthly: 5000,
    minScore: "good",
    rewards: { travel: 2, dining: 2, general: 1 },
    highlight: "Flexible points for mid-premium spenders",
    perks: ["Reward points", "Insurance pack"],
    network: "Visa",
  },
  // Singapore
  {
    id: "sg-dbs-woman",
    name: "DBS Woman's Card",
    issuer: "DBS",
    country: "SG",
    annualFee: 192.6,
    currency: "SGD",
    minIncomeMonthly: 3500,
    minScore: "good",
    rewards: { online: 4, dining: 4, general: 0.4 },
    highlight: "Online + dining miles for Singapore spend",
    perks: ["Miles", "Shopping privileges"],
    network: "Visa",
  },
  {
    id: "sg-citi-cashback",
    name: "Citi Cash Back+",
    issuer: "Citibank",
    country: "SG",
    annualFee: 192.6,
    currency: "SGD",
    minIncomeMonthly: 3000,
    minScore: "fair",
    rewards: { groceries: 8, dining: 6, fuel: 4, general: 0.25 },
    highlight: "Category cashback king for daily SG spend",
    perks: ["High category cashback", "Min spend rules"],
    network: "Visa",
  },
  {
    id: "sg-ocbc-365",
    name: "OCBC 365",
    issuer: "OCBC",
    country: "SG",
    annualFee: 192.6,
    currency: "SGD",
    minIncomeMonthly: 3000,
    minScore: "fair",
    rewards: { dining: 6, fuel: 5, groceries: 3, general: 0.3 },
    highlight: "Weekday dining & petrol specialist",
    perks: ["Dining cashback", "Petrol rebate"],
    network: "Visa",
  },
  // UAE
  {
    id: "ae-enbd-skywards",
    name: "Emirates Skywards Infinite",
    issuer: "Emirates NBD",
    country: "AE",
    annualFee: 1575,
    currency: "AED",
    minIncomeMonthly: 15000,
    minScore: "good",
    rewards: { travel: 4, dining: 2, general: 1 },
    highlight: "Miles for UAE travelers flying Emirates",
    perks: ["Skywards miles", "Lounge access"],
    network: "Visa",
  },
  {
    id: "ae-adcb-touchpoints",
    name: "ADCB TouchPoints Platinum",
    issuer: "ADCB",
    country: "AE",
    annualFee: 500,
    currency: "AED",
    minIncomeMonthly: 8000,
    minScore: "fair",
    rewards: { groceries: 2, fuel: 2, online: 2, general: 1 },
    highlight: "Flexible TouchPoints for everyday UAE spend",
    perks: ["TouchPoints", "Partner redemptions"],
    network: "Mastercard",
  },
  {
    id: "ae-mashreq-cashback",
    name: "Mashreq Cashback",
    issuer: "Mashreq",
    country: "AE",
    annualFee: 0,
    currency: "AED",
    minIncomeMonthly: 5000,
    minScore: "building",
    rewards: { online: 5, groceries: 2, general: 1 },
    highlight: "No-fee cashback for UAE online shoppers",
    perks: ["No annual fee", "Cashback"],
    network: "Visa",
  },
];

export interface CardQuizInput {
  country: CardCountry;
  monthlyIncome: number;
  score: CreditScoreBand;
  spendByCategory: Partial<Record<SpendCategory, number>>;
  preferNoFee: boolean;
  caresAboutTravel: boolean;
}

export interface RankedCard {
  card: CreditCardProduct;
  score: number;
  estimatedAnnualRewards: number;
  eligible: boolean;
  reasons: string[];
}

function meetsScore(user: CreditScoreBand, required: CreditScoreBand) {
  return SCORE_RANK[user] >= SCORE_RANK[required];
}

export function rankCreditCards(input: CardQuizInput): RankedCard[] {
  const totalSpend = Object.values(input.spendByCategory).reduce((a, b) => a + (b || 0), 0);

  return CREDIT_CARDS.filter((c) => c.country === input.country)
    .map((card) => {
      const eligible =
        input.monthlyIncome >= card.minIncomeMonthly && meetsScore(input.score, card.minScore);

      let estimated = 0;
      for (const [cat, amount] of Object.entries(input.spendByCategory) as [SpendCategory, number][]) {
        if (!amount) continue;
        const rate = card.rewards[cat] ?? card.rewards.general ?? 0.5;
        estimated += (amount * 12 * rate) / 100;
      }
      estimated = Math.max(0, estimated - card.annualFee * 0.5);

      const reasons: string[] = [];
      const topCats = Object.entries(input.spendByCategory)
        .filter(([, v]) => (v || 0) > 0)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 2)
        .map(([k]) => k as SpendCategory);

      for (const cat of topCats) {
        const rate = card.rewards[cat];
        if (rate && rate >= 2) reasons.push(`Strong ${cat} rewards (${rate}%)`);
      }
      if (card.annualFee === 0) reasons.push("No annual fee");
      if (input.caresAboutTravel && (card.rewards.travel || 0) >= 2) reasons.push("Travel-friendly earn");
      if (!eligible) reasons.push("May not meet typical income/score gates");

      let score = estimated;
      if (input.preferNoFee && card.annualFee === 0) score += totalSpend * 0.02;
      if (input.caresAboutTravel && (card.rewards.travel || 0) >= 2) score += 50;
      if (!eligible) score *= 0.35;

      return {
        card,
        score,
        estimatedAnnualRewards: Math.round(estimated),
        eligible,
        reasons: reasons.slice(0, 4),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

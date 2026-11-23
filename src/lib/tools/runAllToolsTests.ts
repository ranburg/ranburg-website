/**
 * Catalog wiring + helper math + HTTP smoke for every tool page.
 * Needs a running Next server (TOOLS_BASE_URL, else localhost:3001 / 3000).
 *
 * npm run test:tools
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  aspectRatio,
  bmiCategory,
  bmiMetric,
  buildUtmUrl,
  cagr,
  changePercent,
  discountPrice,
  fdMaturity,
  fromRoman,
  htmlEscape,
  htmlUnescape,
  inflateAmount,
  mean,
  numberToIndianWords,
  passwordStrength,
  percentOf,
  pxToRem,
  rdMaturity,
  simpleInterest,
  textToBinary,
  binaryToText,
  tipSplit,
  toRoman,
  uniqueLines,
  vatFromGross,
  vatFromNet,
  waterLiters,
  whatPercent,
} from "../demandMath";
import { rankCreditCards } from "../creditCardRecommender";
import { generateHashtags } from "../hashtagGenerator";
import { SEO_CATEGORY_SLUGS } from "../toolSeoCategories";
import { getAllComingSoonSlugs } from "../toolComingSoonConfig";
import { TOOLS_CONFIG } from "../toolsConfig";
import { sipFutureValue } from "../finance/sipProjection";
import { monthlyEmi } from "../finance/homeLoanVsSip";
import {
  buildBoxShadowCss,
  buildGradientCss,
  buildPalette,
  cgpaToPercentage,
  convertBase,
  fireProjection,
  formatClock,
  formatUtcOffset,
  homeLoanEligibility,
  jsonToTypescript,
  lumpsumGrowth,
  nextPomodoroPhase,
  percentageToCgpa,
  requiredMonthlySip,
  shadeScale,
  sharesToReachAverage,
  stockAverage,
  typingStats,
  xirr,
  zonedTimeToUtc,
} from "../plannerMath";

function registryKeys(file: string): string[] {
  const src = readFileSync(join(process.cwd(), file), "utf8");
  const block = src.split("= {")[1]?.split("};")[0];
  if (!block) throw new Error(`Could not parse keys from ${file}`);
  return [...block.matchAll(/^\s+"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
}

const baseKeys = registryKeys("src/components/tools/registry.ts");
const extendedKeys = registryKeys("src/components/tools/extendedRegistry.tsx");
const componentSlugs = new Set([...baseKeys, ...extendedKeys]);
const comingSoon = new Set(getAllComingSoonSlugs());
const configSlugs = TOOLS_CONFIG.map((t) => t.slug);
const uniqueConfig = new Set(configSlugs);

assert.equal(uniqueConfig.size, configSlugs.length, "duplicate TOOLS_CONFIG slugs");

const missingComponents: string[] = [];
for (const slug of uniqueConfig) {
  if (comingSoon.has(slug)) continue;
  if (!componentSlugs.has(slug)) missingComponents.push(slug);
}
assert.deepEqual(missingComponents, [], `tools without a renderer: ${missingComponents.join(", ")}`);

const orphanComponents = [...componentSlugs].filter((s) => !uniqueConfig.has(s));
assert.deepEqual(orphanComponents, [], `renderers without TOOLS_CONFIG: ${orphanComponents.join(", ")}`);

assert.ok(uniqueConfig.size >= 100, `expected a large catalog, got ${uniqueConfig.size}`);
assert.ok(componentSlugs.has("home-loan-vs-mutual-fund"));
assert.ok(componentSlugs.has("sip"));
assert.ok(componentSlugs.has("cagr-calculator"));

assert.equal(percentOf(18, 25000), 4500);
assert.equal(whatPercent(25, 200), 12.5);
assert.equal(changePercent(100, 125), 25);
assert.equal(bmiCategory(bmiMetric(70, 175)!), "Normal");
assert.ok(Math.abs((cagr(100, 200, 10) ?? 0) - (Math.pow(2, 0.1) - 1)) < 1e-12);
assert.ok(fdMaturity(100000, 7.1, 1, 4) > 100000);
assert.equal(simpleInterest(1000, 10, 2), 200);
assert.equal(vatFromNet(100, 18).gross, 118);
assert.ok(Math.abs(vatFromGross(118, 18).net - 100) < 1e-9);
assert.deepEqual(aspectRatio(1920, 1080), { w: 16, h: 9 });
assert.ok(buildUtmUrl("ranburg.com", "ig", "social", "launch")?.includes("utm_source=ig"));
assert.equal(uniqueLines("a\na\nb"), "a\nb");
assert.equal(htmlUnescape(htmlEscape("<x>")), "<x>");
assert.equal(discountPrice(200, 10).final, 180);
assert.ok(rdMaturity(5000, 7, 12) > 5000 * 12);
assert.ok(Math.abs(inflateAmount(100, 10, 1) - 110) < 1e-9);
assert.equal(toRoman(2026), "MMXXVI");
assert.equal(fromRoman("MMXXVI"), 2026);
assert.equal(binaryToText(textToBinary("Hi")), "Hi");
assert.equal(mean([2, 4, 6]), 4);
assert.equal(tipSplit(1000, 10, 4).each, 275);
assert.equal(pxToRem(32), 2);
assert.equal(passwordStrength("Aa1!aaaaaaa").score >= 4, true);
assert.ok(waterLiters(70) > 2);
assert.ok(numberToIndianWords(150000).includes("lakh"));

const sip = sipFutureValue({ monthlyInvestment: 10000, annualReturnPct: 12, years: 1 });
assert.ok(sip.futureValue > sip.totalInvested);
assert.ok(monthlyEmi(5000000, 8.5, 240) > 40000);

// Planner, design, developer and focus tools (plannerMath)
const near = (actual: number, expected: number, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

for (const slug of [
  "step-up-sip-calculator",
  "lumpsum-calculator",
  "goal-sip-calculator",
  "xirr-calculator",
  "stock-average-calculator",
  "fire-calculator",
  "home-loan-eligibility-calculator",
  "css-gradient-generator",
  "box-shadow-generator",
  "color-palette-generator",
  "json-to-typescript",
  "number-base-converter",
  "pomodoro-timer",
  "typing-speed-test",
  "time-zone-converter",
  "cgpa-to-percentage-calculator",
]) {
  assert.ok(componentSlugs.has(slug) && uniqueConfig.has(slug), `${slug} must be configured and rendered`);
}

near(lumpsumGrowth(100000, 12, 10).futureValue, 310584.82);
near(requiredMonthlySip({ target: 1e7, annualReturnPct: 12, years: 15 }).monthly, 19818.62);
const stepUp = sipFutureValue({ monthlyInvestment: 10000, annualReturnPct: 12, years: 20, stepUpPercent: 10 });
const flatSip = sipFutureValue({ monthlyInvestment: 10000, annualReturnPct: 12, years: 20 });
assert.ok(stepUp.futureValue > flatSip.futureValue * 1.9, "a 10% step-up should roughly double a 20-year SIP");

near(xirr([{ date: "2024-01-01", amount: -100000 }, { date: "2025-01-01", amount: 112000 }]) ?? 0, 0.11965, 1e-4);
near(
  xirr([
    { date: "2024-01-01", amount: -100000 },
    { date: "2025-01-01", amount: -100000 },
    { date: "2026-01-01", amount: 236000 },
  ]) ?? 0,
  0.11543,
  1e-4
);
assert.equal(xirr([{ date: "2024-01-01", amount: -100000 }]), null);

assert.equal(stockAverage([{ quantity: 10, price: 100 }, { quantity: 30, price: 80 }]).averagePrice, 85);
assert.equal(sharesToReachAverage(100, 500, 400, 450), 100);
assert.equal(sharesToReachAverage(100, 500, 400, 420), 400);
assert.equal(sharesToReachAverage(100, 500, 400, 390), null);

const fire = fireProjection({
  monthlyExpenses: 50000,
  currentCorpus: 1000000,
  monthlyInvestment: 40000,
  annualStepUpPct: 8,
  annualReturnPct: 11,
  inflationPct: 6,
  withdrawalRatePct: 4,
});
assert.equal(fire.fireNumberToday, 15000000);
near(fire.yearsToFire ?? 0, 15.75, 0.26);

const eligibility = homeLoanEligibility({
  monthlyIncome: 150000,
  existingEmis: 10000,
  emiShareOfIncomePct: 50,
  annualRatePct: 8.5,
  tenureYears: 20,
  downPaymentPct: 20,
});
assert.equal(eligibility.maxEmi, 65000);
near(eligibility.loanAmount, 7490004.59, 1);
near(eligibility.propertyBudget, eligibility.loanAmount / 0.8, 1);
near(monthlyEmi(eligibility.loanAmount, 8.5, 240), 65000, 0.01);

assert.equal(
  buildGradientCss("linear", 135, [
    { color: "#2ee6c8", position: 0 },
    { color: "#6366f1", position: 100 },
  ]),
  "linear-gradient(135deg, #2ee6c8 0%, #6366f1 100%)"
);
assert.equal(
  buildBoxShadowCss([{ x: 0, y: 12, blur: 32, spread: -8, color: "#000000", opacity: 35, inset: false }]),
  "0px 12px 32px -8px rgba(0, 0, 0, 0.35)"
);
assert.equal(buildPalette("#2ee6c8", "triadic").length, 5);
assert.equal(shadeScale("#2ee6c8").length, 10);

assert.equal(
  jsonToTypescript('[{"a":1},{"a":2,"b":true}]').code,
  "export type Root = RootItem[];\n\nexport interface RootItem {\n  a: number;\n  b?: boolean;\n}"
);
assert.ok(jsonToTypescript("{oops").error);
assert.equal(convertBase("255", 10, 16), "ff");
assert.equal(convertBase("ff", 16, 2), "11111111");
assert.equal(convertBase("0xFF", 16, 10), "255");
assert.equal(convertBase("-1010", 2, 10), "-10");
assert.equal(convertBase("12", 2, 10), null);

assert.equal(formatClock(1500), "25:00");
assert.equal(nextPomodoroPhase("focus", 4, 4), "long-break");
assert.equal(nextPomodoroPhase("focus", 3, 4), "short-break");
assert.equal(nextPomodoroPhase("long-break", 4, 4), "focus");
const typing = typingStats("hello wurld", "hello world", 6000);
assert.equal(Math.round(typing.grossWpm), 22);
assert.equal(Math.round(typing.netWpm), 20);
assert.equal(typing.errors, 1);
assert.equal(zonedTimeToUtc("2026-01-15T09:00", "Asia/Kolkata")?.toISOString(), "2026-01-15T03:30:00.000Z");
assert.equal(zonedTimeToUtc("2026-07-15T09:00", "America/New_York")?.toISOString(), "2026-07-15T13:00:00.000Z");
assert.equal(formatUtcOffset(19800000), "UTC+5:30");
near(cgpaToPercentage(8.4, "multiplier-9.5"), 79.8, 1e-9);
near(cgpaToPercentage(8.4, "minus-0.75"), 76.5, 1e-9);
near(cgpaToPercentage(3.6, "proportional", 4), 90, 1e-9);
near(percentageToCgpa(79.8, "multiplier-9.5"), 8.4, 1e-9);

const cards = rankCreditCards({
  country: "IN",
  monthlyIncome: 200000,
  score: "excellent",
  spendByCategory: { groceries: 20000, travel: 15000, general: 10000 },
  preferNoFee: false,
  caresAboutTravel: true,
});
assert.ok(cards.length > 0);
assert.ok(cards[0].card.country === "IN");

async function main() {
  const tags = await generateHashtags({
    topic: "personal finance",
    platform: "youtube",
    count: 12,
    mix: "balanced",
  });
  assert.ok(tags.hashtags.length > 0);
  assert.ok(tags.joined.includes("#"));

  async function detectBase(): Promise<string> {
    if (process.env.TOOLS_BASE_URL) return process.env.TOOLS_BASE_URL.replace(/\/$/, "");
    for (const origin of ["http://localhost:3001", "http://localhost:3000"]) {
      try {
        const res = await fetch(`${origin}/tools/sip`, { signal: AbortSignal.timeout(8000) });
        if (res.ok) return origin;
      } catch {
        /* try next */
      }
    }
    throw new Error("No Next server found. Start `npm run dev` or set TOOLS_BASE_URL.");
  }

  function looksBroken(status: number, html: string, title: string): string | null {
    if (status !== 200) return `HTTP ${status}`;
    if (/Internal Server Error|Application error/i.test(html)) return "server error in HTML";
    const lower = html.toLowerCase();
    if (lower.includes("this page could not be found") && !lower.includes(title.toLowerCase().slice(0, 12))) {
      return "404 page";
    }
    return null;
  }

  const base = await detectBase();
  const liveTools = TOOLS_CONFIG.filter((t) => !comingSoon.has(t.slug));
  const paths: { path: string; expect: string }[] = [
    ...liveTools.map((t) => ({ path: `/tools/${t.slug}`, expect: t.title })),
    ...getAllComingSoonSlugs().map((slug) => ({ path: `/tools/${slug}`, expect: "Coming" })),
    ...SEO_CATEGORY_SLUGS.map((slug) => ({ path: `/tools/${slug}`, expect: "tools" })),
  ];

  const failures: string[] = [];
  const concurrency = 6;
  for (let i = 0; i < paths.length; i += concurrency) {
    const batch = paths.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async ({ path, expect }) => {
        try {
          const res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(60000) });
          const html = await res.text();
          const err = looksBroken(res.status, html, expect);
          if (err) return `${path}: ${err}`;
          return null;
        } catch (e) {
          return `${path}: ${e instanceof Error ? e.message : String(e)}`;
        }
      })
    );
    for (const r of results) if (r) failures.push(r);
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    throw new Error(`${failures.length} tool page(s) failed of ${paths.length}`);
  }

  console.log(
    `all-tools checks passed: ${uniqueConfig.size} configs, ${componentSlugs.size} renderers, ${paths.length} HTTP 200s via ${base}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

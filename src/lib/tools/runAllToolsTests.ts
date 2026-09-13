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

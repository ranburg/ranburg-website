/**
 * Pure helpers for the planner / studio tool wave (step-up SIP, XIRR, FIRE, CSS studio,
 * JSON → TypeScript, time zones …). No React, no DOM — every function here is unit-tested
 * in src/lib/tools/runAllToolsTests.ts.
 */

import { hexToRgb, rgbToHex } from "./demandMath";

/* ------------------------------------------------------------------ */
/* Investing                                                           */
/* ------------------------------------------------------------------ */

export interface GrowthPoint {
  year: number;
  invested: number;
  value: number;
}

/** One-time investment compounded annually. */
export function lumpsumGrowth(
  principal: number,
  annualReturnPct: number,
  years: number
): { futureValue: number; gain: number; chart: GrowthPoint[] } {
  const p = Math.max(0, principal);
  const n = Math.max(0, Math.round(years));
  const r = annualReturnPct / 100;
  const chart: GrowthPoint[] = [];
  for (let y = 1; y <= n; y++) chart.push({ year: y, invested: p, value: p * Math.pow(1 + r, y) });
  const futureValue = p * Math.pow(1 + r, n);
  return { futureValue, gain: futureValue - p, chart };
}

/** Value of a future amount in today's money. */
export function presentValue(futureAmount: number, inflationPct: number, years: number): number {
  return futureAmount / Math.pow(1 + inflationPct / 100, Math.max(0, years));
}

/**
 * Monthly SIP needed to reach a target. Deposits at the start of each month,
 * monthly compounding — the same convention as the SIP calculator.
 */
export function requiredMonthlySip(params: {
  target: number;
  annualReturnPct: number;
  years: number;
  existingCorpus?: number;
}): { monthly: number; totalInvested: number; corpusFromExisting: number; months: number } {
  const months = Math.max(0, Math.round(params.years * 12));
  const i = params.annualReturnPct / 12 / 100;
  const existing = Math.max(0, params.existingCorpus ?? 0);
  const corpusFromExisting = existing * Math.pow(1 + i, months);
  const gap = Math.max(0, params.target - corpusFromExisting);
  if (months === 0) return { monthly: 0, totalInvested: 0, corpusFromExisting, months };
  const factor = i === 0 ? months : ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  const monthly = gap / factor;
  return { monthly, totalInvested: monthly * months, corpusFromExisting, months };
}

/** One-time amount that grows to the target with monthly compounding. */
export function requiredLumpsum(target: number, annualReturnPct: number, years: number): number {
  const months = Math.max(0, Math.round(years * 12));
  return target / Math.pow(1 + annualReturnPct / 12 / 100, months);
}

export interface CashFlow {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Negative = money invested, positive = money received / current value. */
  amount: number;
}

function xnpv(rate: number, flows: { t: number; amount: number }[]): number {
  let total = 0;
  for (const f of flows) total += f.amount / Math.pow(1 + rate, f.t);
  return total;
}

/**
 * Annualised return for irregular cash flows (same definition as spreadsheet XIRR).
 * Returns a decimal rate (0.12 = 12%) or null when there is no valid solution.
 */
export function xirr(cashFlows: CashFlow[]): number | null {
  const parsed = cashFlows
    .map((c) => ({ time: Date.parse(`${c.date}T00:00:00Z`), amount: c.amount }))
    .filter((c) => Number.isFinite(c.time) && Number.isFinite(c.amount) && c.amount !== 0);
  if (parsed.length < 2) return null;
  if (!parsed.some((c) => c.amount > 0) || !parsed.some((c) => c.amount < 0)) return null;

  const t0 = Math.min(...parsed.map((c) => c.time));
  const flows = parsed.map((c) => ({ t: (c.time - t0) / 86_400_000 / 365, amount: c.amount }));
  if (flows.every((f) => f.t === 0)) return null;

  // Scan for a sign change, then bisect. Robust for the usual invest-then-redeem pattern.
  const grid = [-0.9999, -0.99, -0.9, -0.75, -0.5, -0.25, -0.1, 0, 0.05, 0.1, 0.2, 0.35, 0.5, 1, 2, 5, 10, 50, 100, 1000];
  let bracket: [number, number] | null = null;
  let prev = xnpv(grid[0], flows);
  for (let k = 1; k < grid.length; k++) {
    const cur = xnpv(grid[k], flows);
    if (cur === 0) return grid[k];
    if (Number.isFinite(prev) && Number.isFinite(cur) && prev * cur < 0) {
      bracket = [grid[k - 1], grid[k]];
      break;
    }
    prev = cur;
  }
  if (!bracket) return null;
  let [lo, hi] = bracket;

  let fLo = xnpv(lo, flows);
  for (let iter = 0; iter < 200; iter++) {
    const mid = (lo + hi) / 2;
    const fMid = xnpv(mid, flows);
    if (Math.abs(fMid) < 1e-9 || hi - lo < 1e-12) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

export interface StockLot {
  quantity: number;
  price: number;
}

export function stockAverage(lots: StockLot[]): { totalQuantity: number; totalCost: number; averagePrice: number } {
  let totalQuantity = 0;
  let totalCost = 0;
  for (const lot of lots) {
    if (!(lot.quantity > 0) || !(lot.price >= 0)) continue;
    totalQuantity += lot.quantity;
    totalCost += lot.quantity * lot.price;
  }
  return { totalQuantity, totalCost, averagePrice: totalQuantity > 0 ? totalCost / totalQuantity : 0 };
}

/**
 * Shares to buy at `marketPrice` so the blended average becomes `targetAverage`.
 * Null when the target is unreachable (it must sit between the market price and the current average).
 */
export function sharesToReachAverage(
  currentQuantity: number,
  currentAverage: number,
  marketPrice: number,
  targetAverage: number
): number | null {
  if (currentQuantity <= 0 || marketPrice <= 0) return null;
  if (targetAverage === currentAverage) return 0;
  const lower = Math.min(marketPrice, currentAverage);
  const upper = Math.max(marketPrice, currentAverage);
  if (targetAverage <= lower || targetAverage >= upper) return null;
  return (currentQuantity * (currentAverage - targetAverage)) / (targetAverage - marketPrice);
}

export interface FirePoint {
  year: number;
  corpus: number;
  target: number;
}

/**
 * Month-by-month FIRE simulation in nominal money. The target rises with inflation;
 * FIRE is reached when the corpus first covers (annual expenses ÷ withdrawal rate).
 */
export function fireProjection(params: {
  monthlyExpenses: number;
  currentCorpus: number;
  monthlyInvestment: number;
  annualStepUpPct: number;
  annualReturnPct: number;
  inflationPct: number;
  withdrawalRatePct: number;
  maxYears?: number;
}): { fireNumberToday: number; yearsToFire: number | null; corpusAtFire: number | null; chart: FirePoint[] } {
  const maxYears = params.maxYears ?? 60;
  const swr = Math.max(0.1, params.withdrawalRatePct) / 100;
  const annualExpenses = Math.max(0, params.monthlyExpenses) * 12;
  const fireNumberToday = annualExpenses / swr;
  const monthlyReturn = params.annualReturnPct / 12 / 100;
  const inflation = params.inflationPct / 100;
  const stepUp = params.annualStepUpPct / 100;

  let corpus = Math.max(0, params.currentCorpus);
  let monthly = Math.max(0, params.monthlyInvestment);
  let yearsToFire: number | null = corpus >= fireNumberToday && fireNumberToday > 0 ? 0 : null;
  let corpusAtFire: number | null = yearsToFire === 0 ? corpus : null;
  const chart: FirePoint[] = [{ year: 0, corpus, target: fireNumberToday }];

  for (let y = 1; y <= maxYears; y++) {
    for (let m = 1; m <= 12; m++) {
      corpus = (corpus + monthly) * (1 + monthlyReturn);
      if (yearsToFire === null) {
        const elapsed = y - 1 + m / 12;
        const target = fireNumberToday * Math.pow(1 + inflation, elapsed);
        if (corpus >= target) {
          yearsToFire = elapsed;
          corpusAtFire = corpus;
        }
      }
    }
    chart.push({ year: y, corpus, target: fireNumberToday * Math.pow(1 + inflation, y) });
    monthly *= 1 + stepUp;
    if (yearsToFire !== null && y >= Math.ceil(yearsToFire) + 3) break;
  }

  return { fireNumberToday, yearsToFire, corpusAtFire, chart };
}

/** Largest loan whose EMI fits inside the share of income a lender allows for EMIs. */
export function homeLoanEligibility(params: {
  monthlyIncome: number;
  existingEmis: number;
  emiShareOfIncomePct: number;
  annualRatePct: number;
  tenureYears: number;
  downPaymentPct?: number;
}): { maxEmi: number; loanAmount: number; propertyBudget: number; totalInterest: number } {
  const maxEmi = Math.max(
    0,
    (Math.max(0, params.monthlyIncome) * params.emiShareOfIncomePct) / 100 - Math.max(0, params.existingEmis)
  );
  const months = Math.max(0, Math.round(params.tenureYears * 12));
  const r = params.annualRatePct / 12 / 100;
  let loanAmount = 0;
  if (months > 0) {
    if (r === 0) loanAmount = maxEmi * months;
    else {
      const pow = Math.pow(1 + r, months);
      loanAmount = (maxEmi * (pow - 1)) / (r * pow);
    }
  }
  const down = Math.min(95, Math.max(0, params.downPaymentPct ?? 0)) / 100;
  return {
    maxEmi,
    loanAmount,
    propertyBudget: loanAmount / (1 - down),
    totalInterest: Math.max(0, maxEmi * months - loanAmount),
  };
}

/* ------------------------------------------------------------------ */
/* Colour + CSS                                                        */
/* ------------------------------------------------------------------ */

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function normalizeHex(input: string): string | null {
  let h = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return `#${h.toLowerCase()}`;
}

export function hexToHsl(hex: string): Hsl | null {
  const norm = normalizeHex(hex);
  const rgb = norm ? hexToRgb(norm) : null;
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lig = Math.min(100, Math.max(0, l)) / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;
  let rgb: [number, number, number];
  if (hue < 60) rgb = [c, x, 0];
  else if (hue < 120) rgb = [x, c, 0];
  else if (hue < 180) rgb = [0, c, x];
  else if (hue < 240) rgb = [0, x, c];
  else if (hue < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgbToHex((rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255);
}

export type PaletteScheme = "analogous" | "complementary" | "split-complementary" | "triadic" | "tetradic" | "monochromatic";

export const PALETTE_SCHEMES: { id: PaletteScheme; label: string }[] = [
  { id: "analogous", label: "Analogous" },
  { id: "complementary", label: "Complementary" },
  { id: "split-complementary", label: "Split complementary" },
  { id: "triadic", label: "Triadic" },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochromatic", label: "Monochromatic" },
];

/** Five harmonious colours built by rotating the hue of the base colour. */
export function buildPalette(baseHex: string, scheme: PaletteScheme): string[] {
  const hsl = hexToHsl(baseHex);
  if (!hsl) return [];
  const { h, s, l } = hsl;
  const at = (dh: number, ds = 0, dl = 0) => hslToHex(h + dh, s + ds, l + dl);
  switch (scheme) {
    case "analogous":
      return [at(-40), at(-20), at(0), at(20), at(40)];
    case "complementary":
      return [at(0, 0, 18), at(0), at(0, 0, -18), at(180), at(180, 0, -18)];
    case "split-complementary":
      return [at(0, 0, 14), at(0), at(150), at(210), at(210, 0, -16)];
    case "triadic":
      return [at(0, 0, 14), at(0), at(120), at(240), at(240, 0, -16)];
    case "tetradic":
      return [at(0), at(90), at(180), at(270), at(0, 0, -20)];
    case "monochromatic":
      return [
        hslToHex(h, s, Math.min(92, l + 30)),
        hslToHex(h, s, Math.min(84, l + 15)),
        at(0),
        hslToHex(h, s, Math.max(16, l - 15)),
        hslToHex(h, s, Math.max(8, l - 30)),
      ];
  }
}

const SHADE_STEPS: { step: number; lightness: number }[] = [
  { step: 50, lightness: 96 },
  { step: 100, lightness: 91 },
  { step: 200, lightness: 82 },
  { step: 300, lightness: 71 },
  { step: 400, lightness: 60 },
  { step: 500, lightness: 50 },
  { step: 600, lightness: 41 },
  { step: 700, lightness: 33 },
  { step: 800, lightness: 25 },
  { step: 900, lightness: 17 },
];

/** 50–900 tint/shade ramp in the style of design-system colour scales. */
export function shadeScale(baseHex: string): { step: number; hex: string }[] {
  const hsl = hexToHsl(baseHex);
  if (!hsl) return [];
  return SHADE_STEPS.map(({ step, lightness }) => ({ step, hex: hslToHex(hsl.h, hsl.s, lightness) }));
}

/** Black or white — whichever reads better on the given background. */
export function readableTextColor(hex: string): "#000000" | "#ffffff" {
  const norm = normalizeHex(hex);
  const rgb = norm ? hexToRgb(norm) : null;
  if (!rgb) return "#ffffff";
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
  return luminance > 0.179 ? "#000000" : "#ffffff";
}

export type GradientType = "linear" | "radial" | "conic";

export interface GradientStop {
  color: string;
  position: number;
}

export function buildGradientCss(type: GradientType, angle: number, stops: GradientStop[]): string {
  const list = [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${Math.round(Math.min(100, Math.max(0, s.position)))}%`)
    .join(", ");
  const deg = Math.round(((angle % 360) + 360) % 360);
  if (type === "radial") return `radial-gradient(circle at center, ${list})`;
  if (type === "conic") return `conic-gradient(from ${deg}deg at center, ${list})`;
  return `linear-gradient(${deg}deg, ${list})`;
}

export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  /** 0–100 */
  opacity: number;
  inset: boolean;
}

export function buildBoxShadowCss(layers: ShadowLayer[]): string {
  if (layers.length === 0) return "none";
  return layers
    .map((layer) => {
      const norm = normalizeHex(layer.color);
      const rgb = (norm ? hexToRgb(norm) : null) ?? { r: 0, g: 0, b: 0 };
      const alpha = Math.round(Math.min(100, Math.max(0, layer.opacity))) / 100;
      const parts = [
        `${Math.round(layer.x)}px`,
        `${Math.round(layer.y)}px`,
        `${Math.max(0, Math.round(layer.blur))}px`,
        `${Math.round(layer.spread)}px`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
      ];
      return `${layer.inset ? "inset " : ""}${parts.join(" ")}`;
    })
    .join(", ");
}

/* ------------------------------------------------------------------ */
/* Developer                                                           */
/* ------------------------------------------------------------------ */

type TsNode =
  | { kind: "prim"; name: "string" | "number" | "boolean" | "null" | "unknown" }
  | { kind: "array"; element: TsNode }
  | { kind: "object"; fields: Map<string, { node: TsNode; optional: boolean }> }
  | { kind: "union"; members: TsNode[] };

function inferNode(value: unknown): TsNode {
  if (value === null) return { kind: "prim", name: "null" };
  if (Array.isArray(value)) {
    let element: TsNode = { kind: "prim", name: "unknown" };
    for (const item of value) element = mergeNodes(element, inferNode(item));
    return { kind: "array", element };
  }
  switch (typeof value) {
    case "string":
      return { kind: "prim", name: "string" };
    case "number":
      return { kind: "prim", name: "number" };
    case "boolean":
      return { kind: "prim", name: "boolean" };
    case "object": {
      const fields = new Map<string, { node: TsNode; optional: boolean }>();
      for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
        fields.set(key, { node: inferNode(v), optional: false });
      }
      return { kind: "object", fields };
    }
    default:
      return { kind: "prim", name: "unknown" };
  }
}

function mergeNodes(a: TsNode, b: TsNode): TsNode {
  if (a.kind === "prim" && a.name === "unknown") return b;
  if (b.kind === "prim" && b.name === "unknown") return a;
  if (a.kind === "prim" && b.kind === "prim" && a.name === b.name) return a;
  if (a.kind === "array" && b.kind === "array") return { kind: "array", element: mergeNodes(a.element, b.element) };
  if (a.kind === "object" && b.kind === "object") {
    const fields = new Map<string, { node: TsNode; optional: boolean }>();
    for (const [key, field] of a.fields) {
      const other = b.fields.get(key);
      fields.set(
        key,
        other
          ? { node: mergeNodes(field.node, other.node), optional: field.optional || other.optional }
          : { node: field.node, optional: true }
      );
    }
    for (const [key, field] of b.fields) {
      if (!fields.has(key)) fields.set(key, { node: field.node, optional: true });
    }
    return { kind: "object", fields };
  }
  const members: TsNode[] = [];
  const add = (node: TsNode) => {
    if (node.kind === "union") {
      node.members.forEach(add);
      return;
    }
    const idx = members.findIndex(
      (m) =>
        (m.kind === "prim" && node.kind === "prim" && m.name === node.name) ||
        (m.kind === "object" && node.kind === "object") ||
        (m.kind === "array" && node.kind === "array")
    );
    if (idx === -1) members.push(node);
    else if (members[idx].kind !== "prim") members[idx] = mergeNodes(members[idx], node);
  };
  add(a);
  add(b);
  return members.length === 1 ? members[0] : { kind: "union", members };
}

function pascalCase(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  const name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  if (!name) return "Item";
  return /^[0-9]/.test(name) ? `T${name}` : name;
}

function singular(name: string): string {
  if (/ies$/.test(name) && name.length > 4) return `${name.slice(0, -3)}y`;
  if (/(sses|xes|ches|shes)$/.test(name)) return name.slice(0, -2);
  if (/s$/.test(name) && !/ss$/.test(name) && name.length > 3) return name.slice(0, -1);
  return name;
}

/**
 * Infer TypeScript interfaces from a JSON sample. Objects inside arrays are merged,
 * so keys missing from some items become optional.
 */
export function jsonToTypescript(json: string, rootName = "Root"): { code: string; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { code: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }

  const root = pascalCase(rootName) || "Root";
  const declarations: string[] = [];
  const used = new Set<string>();
  const bySignature = new Map<string, string>();

  const unique = (base: string): string => {
    let name = base;
    let n = 2;
    while (used.has(name)) name = `${base}${n++}`;
    used.add(name);
    return name;
  };

  const render = (node: TsNode, hint: string): string => {
    switch (node.kind) {
      case "prim":
        return node.name;
      case "array": {
        const inner = render(node.element, singular(hint));
        return node.element.kind === "union" ? `(${inner})[]` : `${inner}[]`;
      }
      case "union":
        return node.members.map((m) => render(m, hint)).join(" | ");
      case "object":
        return declare(node, hint);
    }
  };

  const declare = (node: Extract<TsNode, { kind: "object" }>, hint: string): string => {
    const name = unique(pascalCase(hint));
    const slot = declarations.length;
    declarations.push("");
    const lines: string[] = [];
    for (const [key, field] of node.fields) {
      const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      lines.push(`  ${safeKey}${field.optional ? "?" : ""}: ${render(field.node, key)};`);
    }
    const body = lines.join("\n");
    const existing = bySignature.get(body);
    if (existing && lines.length > 0) {
      // Identical shape already declared — reuse it and drop this placeholder.
      declarations[slot] = "";
      used.delete(name);
      return existing;
    }
    bySignature.set(body, name);
    declarations[slot] = lines.length ? `export interface ${name} {\n${body}\n}` : `export interface ${name} {}`;
    return name;
  };

  const node = inferNode(parsed);
  if (node.kind === "object") {
    declare(node, root);
  } else {
    used.add(root);
    const type = render(node, node.kind === "array" ? `${root}Item` : root);
    declarations.unshift(`export type ${root} = ${type};`);
  }

  return { code: declarations.filter(Boolean).join("\n\n"), error: null };
}

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

/** Convert an integer between bases 2–36 with arbitrary precision. Null when the input is invalid. */
export function convertBase(input: string, fromBase: number, toBase: number): string | null {
  if (![fromBase, toBase].every((b) => Number.isInteger(b) && b >= 2 && b <= 36)) return null;
  let text = input.trim().toLowerCase().replace(/[\s_]/g, "");
  let negative = false;
  if (text.startsWith("-")) {
    negative = true;
    text = text.slice(1);
  }
  if (fromBase === 16) text = text.replace(/^0x/, "");
  if (fromBase === 2) text = text.replace(/^0b/, "");
  if (fromBase === 8) text = text.replace(/^0o/, "");
  if (!text) return null;

  const base = BigInt(fromBase);
  let value = BigInt(0);
  for (const ch of text) {
    const digit = DIGITS.indexOf(ch);
    if (digit < 0 || digit >= fromBase) return null;
    value = value * base + BigInt(digit);
  }
  const out = value.toString(toBase);
  return negative && value !== BigInt(0) ? `-${out}` : out;
}

/* ------------------------------------------------------------------ */
/* Focus + productivity                                                */
/* ------------------------------------------------------------------ */

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export type PomodoroPhase = "focus" | "short-break" | "long-break";

/** Phase that follows the one that just finished. */
export function nextPomodoroPhase(finished: PomodoroPhase, focusSessionsDone: number, longBreakEvery: number): PomodoroPhase {
  if (finished !== "focus") return "focus";
  const every = Math.max(1, Math.round(longBreakEvery));
  return focusSessionsDone > 0 && focusSessionsDone % every === 0 ? "long-break" : "short-break";
}

export function typingStats(
  typed: string,
  target: string,
  elapsedMs: number
): { grossWpm: number; netWpm: number; accuracy: number; correctChars: number; errors: number } {
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correctChars++;
  const errors = typed.length - correctChars;
  const minutes = elapsedMs / 60_000;
  const grossWpm = minutes > 0 ? typed.length / 5 / minutes : 0;
  const netWpm = minutes > 0 ? correctChars / 5 / minutes : 0;
  const accuracy = typed.length > 0 ? (correctChars / typed.length) * 100 : 100;
  return { grossWpm, netWpm, accuracy, correctChars, errors };
}

/** Offset (ms) of a time zone from UTC at a given instant. Positive = ahead of UTC. */
export function timeZoneOffsetMs(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** The instant at which the wall clock in `timeZone` shows the given local date-time (YYYY-MM-DDTHH:mm). */
export function zonedTimeToUtc(localDateTime: string, timeZone: string): Date | null {
  const m = localDateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const guess = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
  try {
    let utc = guess - timeZoneOffsetMs(timeZone, new Date(guess));
    const second = guess - timeZoneOffsetMs(timeZone, new Date(utc));
    if (second !== utc) utc = second;
    return new Date(utc);
  } catch {
    return null;
  }
}

export function formatUtcOffset(offsetMs: number): string {
  const sign = offsetMs < 0 ? "-" : "+";
  const abs = Math.abs(Math.round(offsetMs / 60_000));
  const h = Math.floor(abs / 60);
  const min = abs % 60;
  return `UTC${sign}${h}${min ? `:${String(min).padStart(2, "0")}` : ""}`;
}

export type CgpaMethod = "multiplier-9.5" | "minus-0.75" | "proportional" | "custom";

/** CGPA → percentage under the common conversion rules. Institutions differ — always confirm locally. */
export function cgpaToPercentage(cgpa: number, method: CgpaMethod, scale = 10, customMultiplier = 9.5): number {
  let pct: number;
  switch (method) {
    case "multiplier-9.5":
      pct = cgpa * 9.5;
      break;
    case "minus-0.75":
      pct = (cgpa - 0.75) * 10;
      break;
    case "proportional":
      pct = scale > 0 ? (cgpa / scale) * 100 : 0;
      break;
    case "custom":
      pct = cgpa * customMultiplier;
      break;
  }
  return Math.min(100, Math.max(0, pct));
}

export function percentageToCgpa(percentage: number, method: CgpaMethod, scale = 10, customMultiplier = 9.5): number {
  let cgpa: number;
  switch (method) {
    case "multiplier-9.5":
      cgpa = percentage / 9.5;
      break;
    case "minus-0.75":
      cgpa = percentage / 10 + 0.75;
      break;
    case "proportional":
      cgpa = (percentage / 100) * scale;
      break;
    case "custom":
      cgpa = customMultiplier > 0 ? percentage / customMultiplier : 0;
      break;
  }
  return Math.min(scale, Math.max(0, cgpa));
}

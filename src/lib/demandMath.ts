/** Pure helpers for high-demand calculators — kept free of React for easy checks. */

export function percentOf(percent: number, ofValue: number): number {
  return (percent / 100) * ofValue;
}

export function whatPercent(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return (part / whole) * 100;
}

export function changePercent(from: number, to: number): number | null {
  if (from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}

export function bmiMetric(kg: number, heightCm: number): number | null {
  if (heightCm <= 0) return null;
  const m = heightCm / 100;
  return kg / (m * m);
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function cagr(start: number, end: number, years: number): number | null {
  if (start <= 0 || years <= 0) return null;
  return Math.pow(end / start, 1 / years) - 1;
}

export function fdMaturity(principal: number, ratePct: number, years: number, compoundsPerYear: number): number {
  const n = Math.max(1, compoundsPerYear);
  const r = ratePct / 100;
  return principal * Math.pow(1 + r / n, n * years);
}

export function simpleInterest(principal: number, ratePct: number, years: number): number {
  return (principal * ratePct * years) / 100;
}

export function vatFromNet(net: number, ratePct: number): { vat: number; gross: number } {
  const vat = (net * ratePct) / 100;
  return { vat, gross: net + vat };
}

export function vatFromGross(gross: number, ratePct: number): { net: number; vat: number } {
  const net = gross / (1 + ratePct / 100);
  return { net, vat: gross - net };
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function aspectRatio(width: number, height: number): { w: number; h: number } {
  if (width <= 0 || height <= 0) return { w: 0, h: 0 };
  const g = gcd(width, height);
  return { w: Math.round(width / g), h: Math.round(height / g) };
}

export function workingDays(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function hoursBetween(startHHmm: string, endHHmm: string): number | null {
  const parse = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };
  const a = parse(startHHmm);
  const b = parse(endHHmm);
  if (a === null || b === null) return null;
  let diff = b - a;
  if (diff < 0) diff += 24 * 60;
  return diff / 60;
}

export function fleschReadingEase(text: string): { words: number; sentences: number; syllables: number; score: number } {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return { words: 0, sentences: 0, syllables: 0, score: 0 };
  const words = clean.split(/\s+/).filter(Boolean);
  const sentences = Math.max(1, (clean.match(/[.!?]+/g) ?? []).length);
  const countSyllables = (word: string) => {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return 0;
    const groups = w.match(/[aeiouy]+/g);
    let n = groups ? groups.length : 1;
    if (w.endsWith("e") && n > 1) n -= 1;
    return Math.max(1, n);
  };
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
  return { words: words.length, sentences, syllables, score };
}

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function belowThousand(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o ? `${TENS[t]} ${ONES[o]}` : TENS[t];
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest ? `${ONES[h]} hundred ${belowThousand(rest)}` : `${ONES[h]} hundred`;
}

export function numberToIndianWords(n: number): string {
  if (!Number.isFinite(n)) return "";
  const num = Math.floor(Math.abs(n));
  if (n < 0) return `minus ${numberToIndianWords(num)}`;
  if (num === 0) return "zero";
  const crore = Math.floor(num / 1e7);
  const lakh = Math.floor((num % 1e7) / 1e5);
  const thousand = Math.floor((num % 1e5) / 1000);
  const rest = num % 1000;
  const parts: string[] = [];
  if (crore) parts.push(`${belowThousand(crore)} crore`);
  if (lakh) parts.push(`${belowThousand(lakh)} lakh`);
  if (thousand) parts.push(`${belowThousand(thousand)} thousand`);
  if (rest) parts.push(belowThousand(rest));
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function buildUtmUrl(base: string, source: string, medium: string, campaign: string): string | null {
  try {
    const url = new URL(base.includes("://") ? base : `https://${base}`);
    if (source) url.searchParams.set("utm_source", source);
    if (medium) url.searchParams.set("utm_medium", medium);
    if (campaign) url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    return null;
  }
}

export function uniqueLines(text: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
  }
  return out.join("\n");
}

export function htmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function htmlUnescape(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function discountPrice(original: number, discountPct: number): { saved: number; final: number } {
  const saved = (original * discountPct) / 100;
  return { saved, final: original - saved };
}

/** Indian bank RD (quarterly compounding approximation). */
export function rdMaturity(monthly: number, ratePct: number, months: number): number {
  if (months <= 0) return 0;
  const i = ratePct / 400;
  if (i === 0) return monthly * months;
  return monthly * ((Math.pow(1 + i, months) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
}

export function inflateAmount(amount: number, ratePct: number, years: number): number {
  return amount * Math.pow(1 + ratePct / 100, years);
}

export function mifflinBmr(kg: number, heightCm: number, age: number, isMale: boolean): number {
  return 10 * kg + 6.25 * heightCm - 5 * age + (isMale ? 5 : -161);
}

export function tdee(bmr: number, activity: number): number {
  return bmr * activity;
}

export function calendarDays(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

const ROMAN_MAP: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  let num = Math.min(3999, Math.max(1, Math.floor(n)));
  let out = "";
  for (const [v, s] of ROMAN_MAP) {
    while (num >= v) {
      out += s;
      num -= v;
    }
  }
  return out;
}

export function fromRoman(input: string): number | null {
  const s = input.toUpperCase().replace(/[^MDCLXVI]/g, "");
  if (!s) return null;
  let i = 0;
  let total = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    const pair = ROMAN_MAP.find(([, g]) => g === two);
    if (pair && two.length === 2) {
      total += pair[0];
      i += 2;
      continue;
    }
    const one = ROMAN_MAP.find(([, g]) => g === s[i]);
    if (!one) return null;
    total += one[0];
    i += 1;
  }
  return total;
}

export function textToBinary(text: string): string {
  return [...text]
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

export function binaryToText(binary: string): string {
  const chunks = binary.trim().split(/\s+/).filter(Boolean);
  return chunks
    .map((c) => {
      const n = Number.parseInt(c, 2);
      return Number.isFinite(n) ? String.fromCharCode(n) : "";
    })
    .join("");
}

export function mean(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function tipSplit(bill: number, tipPct: number, people: number): { tip: number; total: number; each: number } {
  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  const n = Math.max(1, people);
  return { tip, total, each: total / n };
}

export function pxToRem(px: number, base = 16): number {
  return px / base;
}

export function passwordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { score, label: labels[score] ?? "Very weak" };
}

export function waterLiters(kg: number): number {
  return kg * 0.033;
}

/**
 * Catalog coverage: every live tool slug must have a renderer.
 * Usage: node scripts/check-tools.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function collectSlugs(file) {
  const text = fs.readFileSync(file, "utf8");
  return [...text.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}

const configFiles = [
  path.join(src, "lib/toolsConfig.ts"),
  ...fs.readdirSync(path.join(src, "lib/extendedTools")).map((n) => path.join(src, "lib/extendedTools", n)),
].filter((f) => f.endsWith(".ts") && !f.endsWith("index.ts") && !f.endsWith("makeTool.ts"));

const slugs = new Set();
for (const f of configFiles) {
  for (const s of collectSlugs(f)) slugs.add(s);
}

const coming = new Set(collectSlugs(path.join(src, "lib/toolComingSoonConfig.ts")));
const registry =
  fs.readFileSync(path.join(src, "components/tools/registry.ts"), "utf8") +
  fs.readFileSync(path.join(src, "components/tools/extendedRegistry.tsx"), "utf8");

const missing = [...slugs]
  .filter((s) => !coming.has(s))
  .filter((s) => {
    const quoted = new RegExp(`["']${s}["']\\s*:`);
    const ident = /^[a-z]+$/.test(s) && new RegExp(`(?:^|[\\s,{])${s}\\s*:`);
    return !quoted.test(registry) && !(ident && ident.test(registry));
  })
  .sort();
console.log("Live tool slugs:", slugs.size - coming.size, "(coming-soon:", coming.size + ")");
if (missing.length) {
  console.error("Missing renderer for:", missing.join(", "));
  process.exitCode = 1;
} else {
  console.log("All live slugs have a renderer key.");
}

const base = process.env.SMOKE_BASE || "http://localhost:3000";
const sample = [
  "/tools/emi",
  "/tools/heic-to-jpg",
  "/tools/percentage-calculator",
  "/tools/bmi-calculator",
  "/tools/fd-calculator",
  "/tools/discount-calculator",
  "/tools/rd-calculator",
  "/tools/calorie-calculator",
  "/tools/password-strength-checker",
  "/tools/unix-timestamp-converter",
  "/tools/keyword-density-checker",
  "/hi/tools/age-calculator",
  "/blog/percentage-calculator-online-guide",
  "/blog/discount-calculator-sale-price",
  "/blog/rd-calculator-india-guide",
];
const results = [];
for (const url of sample) {
  try {
    const res = await fetch(base + url, { redirect: "follow" });
    const html = await res.text();
    const hasH1 = /<h1[\s>]/i.test(html);
    results.push({ url, status: res.status, ok: res.ok && hasH1 });
  } catch (e) {
    results.push({ url, status: 0, ok: false, error: String(e.message || e) });
  }
}
console.log("HTTP smoke");
for (const r of results) console.log(r.ok ? "ok" : "FAIL", r.status, r.url, r.error || "");
if (results.some((r) => !r.ok)) process.exitCode = 1;

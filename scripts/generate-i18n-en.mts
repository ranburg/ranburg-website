import { writeFileSync, mkdirSync } from "fs";
import { TOOLS_CONFIG, type ToolConfig } from "../src/lib/toolsConfig";

const meta: Record<string, unknown> = {};
const ui: Record<string, Record<string, string>> = {};

for (const t of TOOLS_CONFIG) {
  const ext = t as ToolConfig & { seoTitle?: string; seoDescription?: string };
  meta[t.slug] = {
    title: t.title,
    shortDescription: t.shortDescription,
    seoTitle: ext.seoTitle ?? t.seo?.title ?? t.title,
    seoDescription: ext.seoDescription ?? t.seo?.description ?? t.shortDescription,
    howToUse: t.howToUse ?? [],
    faq: (t.faq ?? []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };
  ui[t.slug] = {
    title: t.title,
    shortDescription: t.shortDescription,
    calculate: "Calculate",
    reset: "Reset",
    copy: "Copy",
    download: "Download",
    results: "Results",
    inputs: "Inputs",
    formula: "Formula",
    example: "Example",
    disclaimer: "Illustrative only — not financial advice.",
  };
}

mkdirSync("messages/en", { recursive: true });
writeFileSync("messages/en/tools.meta.json", JSON.stringify(meta, null, 2));
writeFileSync("messages/en/tools.ui.json", JSON.stringify(ui, null, 2));
console.log("Wrote", Object.keys(meta).length, "tools");

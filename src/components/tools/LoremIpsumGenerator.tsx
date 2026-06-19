"use client";

import { useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence() {
  const len = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph() {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, generateSentence).join(" ");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState(false);

  const generate = () => {
    let result = "";
    if (mode === "words") {
      result = Array.from({ length: count }, randomWord).join(" ");
    } else if (mode === "sentences") {
      result = Array.from({ length: count }, generateSentence).join(" ");
    } else {
      const paragraphs = Array.from({ length: count }, generateParagraph);
      result = htmlOutput
        ? paragraphs.map((p) => `<p>${p}</p>`).join("\n")
        : paragraphs.join("\n\n");
    }
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          {(["paragraphs", "sentences", "words"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <CalculatorSlider label={`Number of ${mode}`} value={count} min={1} max={mode === "words" ? 200 : 20} step={1} onChange={setCount} />
        <AdvancedOptions>
          <label className="flex items-center gap-3 text-sm text-theme-muted">
            <input type="checkbox" checked={htmlOutput} onChange={(e) => setHtmlOutput(e.target.checked)} className="accent-accent" />
            HTML output (wrap paragraphs in &lt;p&gt; tags)
          </label>
        </AdvancedOptions>
        <button type="button" onClick={generate} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-theme-heading">
          Generate Lorem Ipsum
        </button>
      </div>

      {output && (
        <div className="glass-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-theme-body">Generated Text</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={10} className="input-field text-sm leading-relaxed" />
        </div>
      )}
    </div>
  );
}

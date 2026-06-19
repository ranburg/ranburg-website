"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const CASES = [
  { id: "lower", label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { id: "upper", label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { id: "title", label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: "sentence", label: "Sentence case", fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { id: "camel", label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: "pascal", label: "PascalCase", fn: (s: string) => { const c = s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, ch: string) => ch.toUpperCase()); return c.charAt(0).toUpperCase() + c.slice(1); } },
  { id: "snake", label: "snake_case", fn: (s: string) => s.trim().replace(/\s+/g, "_").replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "").replace(/__+/g, "_") },
  { id: "kebab", label: "kebab-case", fn: (s: string) => s.trim().replace(/\s+/g, "-").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "").replace(/--+/g, "-") },
];

export default function CaseConverter() {
  const [input, setInput] = useState("Hello World Example Text");

  const results = useMemo(
    () => CASES.map((c) => ({ ...c, result: c.fn(input) })),
    [input]
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="mb-2 block text-sm font-medium text-theme-body">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="input-field" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((item) => (
          <div key={item.id} className="glass-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{item.label}</span>
              <CopyButton text={item.result} label="Copy" className="!px-2 !py-1 text-xs" />
            </div>
            <p className="break-all font-mono text-sm text-theme-body">{item.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

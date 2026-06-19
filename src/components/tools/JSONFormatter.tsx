"use client";

import { useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
          return acc;
        },
        {} as Record<string, unknown>
      );
  }
  return obj;
}

function stripComments(json: string): string {
  return json.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

export default function JSONFormatter() {
  const [input, setInput] = useState('{\n  "name": "Ranburg",\n  "tools": ["sip", "swp"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [lenient, setLenient] = useState(false);
  const [minify, setMinify] = useState(false);

  const process = (mode: "format" | "minify") => {
    setError("");
    try {
      const raw = lenient ? stripComments(input) : input;
      let parsed = JSON.parse(raw);
      if (sortKeys) parsed = sortObjectKeys(parsed);
      const space = mode === "minify" ? 0 : indent;
      setOutput(JSON.stringify(parsed, null, space === 0 ? undefined : space));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="input-field font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="glass-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            className="input-field font-mono text-sm text-accent-emerald"
            placeholder="Formatted output appears here..."
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => process("format")} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90">
          Format
        </button>
        <button type="button" onClick={() => process("minify")} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/5">
          Minify
        </button>
        <button type="button" onClick={() => { setError(""); try { JSON.parse(lenient ? stripComments(input) : input); setError(""); setOutput("✓ Valid JSON"); } catch (e) { setError(e instanceof Error ? e.message : "Invalid"); } }} className="rounded-xl border border-accent-emerald/30 px-6 py-2.5 text-sm font-semibold text-accent-emerald hover:bg-accent-emerald/10">
          Validate
        </button>
      </div>

      <div className="glass-card p-6">
        <AdvancedOptions>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="radio" checked={indent === 2} onChange={() => setIndent(2)} className="accent-accent" /> 2 spaces
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="radio" checked={indent === 4} onChange={() => setIndent(4)} className="accent-accent" /> 4 spaces
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} className="accent-accent" />
            Sort object keys alphabetically
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={lenient} onChange={(e) => setLenient(e.target.checked)} className="accent-accent" />
            Lenient mode (strip comments)
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={minify} onChange={(e) => setMinify(e.target.checked)} className="accent-accent" />
            Default to minify on format
          </label>
        </AdvancedOptions>
      </div>
    </div>
  );
}

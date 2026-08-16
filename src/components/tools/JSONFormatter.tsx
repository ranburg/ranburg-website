"use client";

import { useToolUi } from "@/hooks/useToolUi";

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
  const { t } = useToolUi("json-formatter");
  const [input, setInput] = useState('{\n  "name": "Ranburg",\n  "tools": ["sip", "swp"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<2 | 4>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [lenient, setLenient] = useState(false);
  const [minify, setMinify] = useState(false);
  const [tree, setTree] = useState<unknown>(null);

  const process = (mode: "format" | "minify") => {
    setError("");
    try {
      const raw = lenient ? stripComments(input) : input;
      let parsed = JSON.parse(raw);
      if (sortKeys) parsed = sortObjectKeys(parsed);
      const space = mode === "minify" ? 0 : indent;
      setOutput(JSON.stringify(parsed, null, space === 0 ? undefined : space));
      setTree(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
      setTree(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-theme-body">{t("inputJson")}</label>
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
            <label className="text-sm font-medium text-theme-body">{t("output")}</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            className="input-field font-mono text-sm text-accent-emerald"
            placeholder={t("formattedOutputPlaceholder")}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => process("format")} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-theme-heading hover:bg-accent/90">
          {t("format")}
        </button>
        <button type="button" onClick={() => process("minify")} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold text-theme-heading hover:bg-white/5">
          {t("minify")}
        </button>
        <button type="button" onClick={() => { setError(""); try { const parsed = JSON.parse(lenient ? stripComments(input) : input); setError(""); setOutput("✓ Valid JSON"); setTree(parsed); } catch (e) { setError(e instanceof Error ? e.message : "Invalid"); setTree(null); } }} className="rounded-xl border border-accent-emerald/30 px-6 py-2.5 text-sm font-semibold text-accent-emerald hover:bg-accent-emerald/10">
          {t("validate")}
        </button>
      </div>

      <div className="glass-card p-6">
        <AdvancedOptions>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-theme-muted">
              <input type="radio" checked={indent === 2} onChange={() => setIndent(2)} className="accent-accent" /> {t("twoSpaces")}
            </label>
            <label className="flex items-center gap-2 text-sm text-theme-muted">
              <input type="radio" checked={indent === 4} onChange={() => setIndent(4)} className="accent-accent" /> {t("fourSpaces")}
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm text-theme-muted">
            <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} className="accent-accent" />
            {t("sortObjectKeys")}
          </label>
          <label className="flex items-center gap-3 text-sm text-theme-muted">
            <input type="checkbox" checked={lenient} onChange={(e) => setLenient(e.target.checked)} className="accent-accent" />
            {t("lenientMode")}
          </label>
          <label className="flex items-center gap-3 text-sm text-theme-muted">
            <input type="checkbox" checked={minify} onChange={(e) => setMinify(e.target.checked)} className="accent-accent" />
            {t("defaultMinify")}
          </label>
        </AdvancedOptions>
      </div>

      {tree !== null && (
        <div className="glass-card p-6">
          <p className="mb-3 text-sm font-medium text-theme-body">Tree view</p>
          <JsonTreeNode value={tree} name="root" depth={0} />
        </div>
      )}
    </div>
  );
}

function JsonTreeNode({ value, name, depth }: { value: unknown; name: string; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";
  if (!isObj) {
    const display = typeof value === "string" ? `"${value}"` : String(value);
    return (
      <div className="font-mono text-xs leading-6 text-theme-muted" style={{ paddingLeft: depth * 12 }}>
        <span className="text-accent">{name}</span>
        <span>: </span>
        <span className="text-accent-emerald">{display}</span>
      </div>
    );
  }
  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs text-theme-heading"
      >
        {open ? "▼" : "▶"} {name} {Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}
      </button>
      {open &&
        entries.map(([k, v]) => <JsonTreeNode key={k} name={k} value={v} depth={depth + 1} />)}
    </div>
  );
}

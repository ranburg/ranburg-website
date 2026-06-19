"use client";

import { useMemo, useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [text, setText] = useState("Order #12345 shipped on 2024-01-15. Ref: #67890.");
  const [replacement, setReplacement] = useState("");

  const flagStr = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flagStr);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      if (flags.g) {
        let m: RegExpExecArray | null;
        const copy = new RegExp(pattern, flagStr);
        while ((m = copy.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0].length) break;
        }
      } else {
        const m = re.exec(text);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      const replaced = replacement ? text.replace(re, replacement) : "";
      return { valid: true, matches, replaced, error: "" };
    } catch (e) {
      return { valid: false, matches: [], replaced: "", error: e instanceof Error ? e.message : "Invalid regex" };
    }
  }, [pattern, flagStr, flags.g, text, replacement]);

  const highlighted = useMemo(() => {
    if (!result.valid || result.matches.length === 0) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    const sorted = [...result.matches].sort((a, b) => a.index - b.index);
    for (const m of sorted) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
      parts.push({ text: m.match, match: true });
      last = m.index + m.match.length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
  }, [result, text]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="mb-2 block text-sm font-medium text-theme-body">Regular expression</label>
        <div className="flex gap-2">
          <span className="flex items-center rounded-l-xl border border-r-0 border-theme bg-theme-surface px-3 font-mono text-theme-muted">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="input-field flex-1 rounded-none font-mono text-sm"
            spellCheck={false}
          />
          <span className="flex items-center rounded-r-xl border border-l-0 border-theme bg-theme-surface px-3 font-mono text-sm text-accent">
            /{flagStr}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["g", "i", "m", "s"] as const).map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
              <input type="checkbox" checked={flags[f]} onChange={(e) => setFlags({ ...flags, [f]: e.target.checked })} className="accent-accent" />
              {f === "g" ? "global" : f === "i" ? "ignore case" : f === "m" ? "multiline" : "dotall"}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-theme-body">Test string</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="input-field font-mono text-sm" spellCheck={false} />
        </div>
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-theme-body">Highlighted matches</label>
          <div className="min-h-[240px] rounded-xl border border-theme bg-theme-surface p-4 font-mono text-sm leading-relaxed text-theme-body">
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : highlighted ? (
              highlighted.map((p, i) => (
                <span key={i} className={cn(p.match && "rounded bg-accent/30 text-accent")}>
                  {p.text}
                </span>
              ))
            ) : (
              <span className="text-theme-subtle">No matches</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <p className="text-sm font-medium text-theme-body">
          {result.valid ? `${result.matches.length} match${result.matches.length !== 1 ? "es" : ""}` : "—"}
        </p>
        {result.matches.length > 0 && (
          <ul className="mt-3 space-y-2">
            {result.matches.map((m, i) => (
              <li key={i} className="rounded-lg bg-theme-surface px-3 py-2 font-mono text-sm">
                <span className="text-accent">#{i + 1}</span> &quot;{m.match}&quot; at index {m.index}
                {m.groups.length > 0 && <span className="text-theme-muted"> — groups: [{m.groups.join(", ")}]</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <AdvancedOptions>
        <div>
          <label className="mb-2 block text-sm text-theme-muted">Replace with (preview)</label>
          <input value={replacement} onChange={(e) => setReplacement(e.target.value)} className="input-field font-mono text-sm" placeholder="$&" />
          {replacement && result.replaced && (
            <div className="mt-3 flex items-start justify-between gap-4">
              <pre className="flex-1 overflow-x-auto rounded-lg bg-theme-surface p-3 font-mono text-sm text-accent-emerald">{result.replaced}</pre>
              <CopyButton text={result.replaced} />
            </div>
          )}
        </div>
      </AdvancedOptions>
    </div>
  );
}

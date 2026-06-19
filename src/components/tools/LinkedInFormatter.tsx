"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const BOLD_MAP: Record<string, string> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("").forEach((c, i) => {
  const offset = c <= "Z" ? 0x1d400 - 65 : 0x1d41a - 97;
  BOLD_MAP[c] = String.fromCodePoint(c.charCodeAt(0) + offset);
});

function toBold(text: string): string {
  return text.split("").map((c) => BOLD_MAP[c] ?? c).join("");
}

function hookScore(text: string): number {
  const hook = text.split("\n")[0] ?? "";
  let score = 0;
  if (hook.length > 0 && hook.length <= 150) score += 30;
  if (hook.includes("?")) score += 20;
  if (/\d/.test(hook)) score += 15;
  if (text.split("\n").length > 3) score += 15;
  if (hook.length > 150) score -= 20;
  return Math.min(100, Math.max(0, score));
}

export default function LinkedInFormatter() {
  const [text, setText] = useState(
    "I spent 5 years building products that failed.\n\nThen I changed one thing.\n\nHere's what I learned about building software that actually ships 👇"
  );
  const [boldSelection, setBoldSelection] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const hook = text.split("\n")[0] ?? "";
    const score = hookScore(text);
    return { chars, hook, score, remaining: 3000 - chars };
  }, [text]);

  const preview = boldSelection ? toBold(text) : text;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card space-y-4 p-6">
        <label className="text-sm font-medium text-theme-body">Write Your Post</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="input-field text-sm leading-relaxed"
          maxLength={3000}
        />
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className={stats.chars > 3000 ? "text-red-400" : ""}>{stats.chars} / 3,000 chars</span>
          <span>Hook: {stats.hook.length} chars</span>
          <span className={stats.score >= 70 ? "text-accent-emerald" : stats.score >= 40 ? "text-accent" : "text-amber-400"}>
            Hook Score: {stats.score}/100
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBoldSelection(!boldSelection)}
            className="rounded-lg border border-theme px-3 py-1.5 text-xs font-medium text-theme-muted hover:text-slate-900 dark:hover:text-white"
          >
            {boldSelection ? "Normal Text" : "Bold (Unicode)"}
          </button>
          <CopyButton text={preview} label="Copy Post" />
        </div>
      </div>

      <div className="glass-card p-6">
        <p className="mb-4 text-sm font-medium text-theme-body">LinkedIn Preview</p>
        <div className="rounded-xl border border-theme bg-theme-surface p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-emerald" />
            <div>
              <p className="text-sm font-semibold text-theme-heading">Your Name</p>
              <p className="text-xs text-slate-500">Professional Title · 1h</p>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-theme-body">
            <span className="font-semibold text-theme-heading">{stats.hook}</span>
            {text.length > stats.hook.length && (
              <span className="text-slate-500">...see more</span>
            )}
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-accent/10 p-3 text-xs text-accent">
          Tip: Keep your hook under 150 characters and end with a curiosity gap before the fold.
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
  "ON", "GROUP BY", "ORDER BY", "HAVING", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "AS", "DISTINCT", "LIMIT",
  "OFFSET", "UNION", "ALL", "CASE", "WHEN", "THEN", "ELSE", "END", "NOT", "NULL",
  "IS", "IN", "BETWEEN", "LIKE", "EXISTS", "COUNT", "SUM", "AVG", "MAX", "MIN",
];

function formatSQL(sql: string, uppercase: boolean, indent: number): string {
  let formatted = sql.replace(/\s+/g, " ").trim();
  const pad = " ".repeat(indent);

  const breakBefore = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "UNION"];

  breakBefore.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${kw}`);
  });

  if (uppercase) {
    SQL_KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(regex, kw);
    });
  } else {
    SQL_KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(regex, kw.toLowerCase());
    });
  }

  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");
}

function minifySQL(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

export default function SQLFormatter() {
  const [input, setInput] = useState("SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC");
  const [output, setOutput] = useState("");
  const [uppercase, setUppercase] = useState(true);
  const [indent, setIndent] = useState<2 | 4>(2);

  const handleFormat = () => setOutput(formatSQL(input, uppercase, indent));
  const handleMinify = () => setOutput(minifySQL(input));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">SQL Query</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="input-field font-mono text-sm" spellCheck={false} />
        </div>
        <div className="glass-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Formatted Output</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={12} className="input-field font-mono text-sm text-accent-emerald" placeholder="Formatted SQL..." />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={handleFormat} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Format SQL</button>
        <button type="button" onClick={handleMinify} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/5">Minify</button>
      </div>

      <div className="glass-card p-6">
        <AdvancedOptions>
          <label className="flex items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-accent" />
            Uppercase keywords
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="radio" checked={indent === 2} onChange={() => setIndent(2)} className="accent-accent" /> 2-space indent
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="radio" checked={indent === 4} onChange={() => setIndent(4)} className="accent-accent" /> 4-space indent
            </label>
          </div>
        </AdvancedOptions>
      </div>
    </div>
  );
}

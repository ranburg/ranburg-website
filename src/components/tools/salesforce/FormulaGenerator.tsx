"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const TEMPLATES = {
  if: 'IF({field} > {value}, "True Value", "False Value")',
  case: "CASE({field}, \"A\", \"Result A\", \"B\", \"Result B\", \"Default\")",
  text: "TEXT({numberField})",
  date: "TODAY() + 7",
  blank: "BLANKVALUE({field}, \"Default\")",
  isblank: "ISBLANK({field})",
};

export default function FormulaGenerator() {
  const [type, setType] = useState<keyof typeof TEMPLATES>("if");
  const [field, setField] = useState("Amount");
  const [value, setValue] = useState("10000");

  const formula = TEMPLATES[type]
    .replace(/{field}/g, field)
    .replace(/{value}/g, value)
    .replace(/{numberField}/g, field);

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)} className={`rounded-lg px-4 py-2 text-sm font-medium uppercase ${type === t ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Field API Name</label>
          <input value={field} onChange={(e) => setField(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Comparison Value</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-theme-body">Generated Formula</span>
          <CopyButton text={formula} />
        </div>
        <code className="block font-mono text-accent-emerald">{formula}</code>
      </div>
    </div>
  );
}

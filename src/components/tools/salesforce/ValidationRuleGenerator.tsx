"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function ValidationRuleGenerator() {
  const [field, setField] = useState("Email");
  const [condition, setCondition] = useState("required");
  const [message, setMessage] = useState("Email is required before saving this record.");

  const formulas: Record<string, string> = {
    required: `ISBLANK(${field})`,
    email: `NOT(REGEX(${field}, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))`,
    range: `${field} < 0`,
    custom: `AND(ISBLANK(${field}), ISCHANGED(${field}))`,
  };

  const formula = formulas[condition] ?? formulas.required;

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Field API Name</label>
          <input value={field} onChange={(e) => setField(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Validation Type</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input-field mt-1">
            <option value="required">Required Field</option>
            <option value="email">Email Format</option>
            <option value="range">Range Check</option>
            <option value="custom">Custom Logic</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-theme-muted">Error Message</label>
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4 space-y-3">
        <div className="flex justify-between"><span className="text-sm text-theme-body">Formula (TRUE = block save)</span><CopyButton text={formula} /></div>
        <code className="block font-mono text-accent-emerald">{formula}</code>
        <p className="text-sm text-theme-muted">Error: {message}</p>
      </div>
    </div>
  );
}

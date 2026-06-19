"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function OmniStudioExpressionBuilder() {
  const [jsonPath, setJsonPath] = useState("Account.Name");
  const [transform, setTransform] = useState("uppercase");

  const expr = transform === "uppercase"
    ? `%${jsonPath}%`.toUpperCase()
    : transform === "concat"
    ? `CONCAT(%${jsonPath}%, ' - Processed')`
    : `IF(%${jsonPath}% != null, %${jsonPath}%, 'N/A')`;

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">JSON Path / Merge Field</label>
          <input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Transform</label>
          <select value={transform} onChange={(e) => setTransform(e.target.value)} className="input-field mt-1">
            <option value="uppercase">Uppercase</option>
            <option value="concat">Concatenate</option>
            <option value="conditional">Conditional</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between"><span className="text-sm text-theme-body">OmniStudio Expression</span><CopyButton text={expr} /></div>
        <code className="font-mono text-accent-emerald">{expr}</code>
      </div>
    </div>
  );
}

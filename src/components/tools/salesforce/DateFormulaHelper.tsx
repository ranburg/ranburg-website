"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const PRESETS = {
  "Add 30 days": "CloseDate + 30",
  "End of month": "DATE(YEAR(TODAY()), MONTH(TODAY()) + 1, 1) - 1",
  "Days since created": "TODAY() - DATEVALUE(CreatedDate)",
  "Age in years": "YEAR(TODAY()) - YEAR(Birthdate)",
};

export default function DateFormulaHelper() {
  const [preset, setPreset] = useState<keyof typeof PRESETS>("Add 30 days");
  const formula = PRESETS[preset];

  return (
    <div className="glass-card space-y-6 p-8">
      <div>
        <label className="text-sm text-theme-muted">Date Formula Preset</label>
        <select value={preset} onChange={(e) => setPreset(e.target.value as keyof typeof PRESETS)} className="input-field mt-1">
          {Object.keys(PRESETS).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between"><span className="text-sm text-theme-body">Formula</span><CopyButton text={formula} /></div>
        <code className="font-mono text-accent-emerald">{formula}</code>
      </div>
    </div>
  );
}

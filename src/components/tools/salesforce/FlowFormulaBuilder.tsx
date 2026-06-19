"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function FlowFormulaBuilder() {
  const [resource, setResource] = useState("varAmount");
  const [threshold, setThreshold] = useState("10000");

  const formula = `IF({!${resource}} > ${threshold}, "High Value", "Standard")`;

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Flow Resource</label>
          <input value={resource} onChange={(e) => setResource(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Threshold</label>
          <input value={threshold} onChange={(e) => setThreshold(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between"><span className="text-sm text-theme-body">Flow Formula</span><CopyButton text={formula} /></div>
        <code className="font-mono text-accent-emerald">{formula}</code>
      </div>
    </div>
  );
}

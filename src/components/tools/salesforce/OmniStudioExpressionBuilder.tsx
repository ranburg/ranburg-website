"use client";

import { useMemo, useState } from "react";
import { CopyResultPanel } from "@/components/tools/viz";

export default function OmniStudioExpressionBuilder() {
  const [jsonPath, setJsonPath] = useState("Account:Name");
  const [transform, setTransform] = useState("uppercase");
  const [suffix, setSuffix] = useState(" - Processed");
  const [fallback, setFallback] = useState("N/A");

  const expr = useMemo(() => {
    const path = `%${jsonPath}%`;
    if (transform === "uppercase") return `TOUPPER(${path})`;
    if (transform === "lowercase") return `TOLOWER(${path})`;
    if (transform === "concat") return `CONCAT(${path}, '${suffix.replace(/'/g, "\\'")}')`;
    return `IF(${path} != null, ${path}, '${fallback.replace(/'/g, "\\'")}')`;
  }, [jsonPath, transform, suffix, fallback]);

  return (
    <div className="space-y-6 rounded-xl border border-theme-subtle bg-theme-surface/40 p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">JSON Path / Merge Field</label>
          <input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} className="input-field mt-1" placeholder="Account:Name" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Transform</label>
          <select value={transform} onChange={(e) => setTransform(e.target.value)} className="input-field mt-1">
            <option value="uppercase">Uppercase (TOUPPER)</option>
            <option value="lowercase">Lowercase (TOLOWER)</option>
            <option value="concat">Concatenate</option>
            <option value="conditional">Null fallback</option>
          </select>
        </div>
        {transform === "concat" && (
          <div className="sm:col-span-2">
            <label className="text-sm text-theme-muted">Suffix text</label>
            <input value={suffix} onChange={(e) => setSuffix(e.target.value)} className="input-field mt-1" />
          </div>
        )}
        {transform === "conditional" && (
          <div className="sm:col-span-2">
            <label className="text-sm text-theme-muted">Fallback when null</label>
            <input value={fallback} onChange={(e) => setFallback(e.target.value)} className="input-field mt-1" />
          </div>
        )}
      </div>
      <CopyResultPanel title="OmniStudio Expression" text={expr} />
      <p className="text-xs text-theme-subtle">
        Uses function wrappers around <code className="text-theme-muted">%{`{path}`}%</code> merge fields — path case is preserved.
      </p>
    </div>
  );
}

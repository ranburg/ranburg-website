"use client";

import { useMemo, useState } from "react";
import { CopyResultPanel } from "@/components/tools/viz";

type TemplateKey = "addDays" | "endOfMonth" | "daysSince" | "ageYears" | "between";

const LABELS: Record<TemplateKey, string> = {
  addDays: "Add days",
  endOfMonth: "End of month from today",
  daysSince: "Days since date",
  ageYears: "Age in years",
  between: "Days between two dates",
};

export default function DateFormulaHelper() {
  const [template, setTemplate] = useState<TemplateKey>("addDays");
  const [field, setField] = useState("CloseDate");
  const [field2, setField2] = useState("CreatedDate");
  const [days, setDays] = useState("30");

  const formula = useMemo(() => {
    const f = field.trim() || "CloseDate";
    const f2 = field2.trim() || "CreatedDate";
    const n = days.trim() || "30";
    switch (template) {
      case "addDays":
        return `${f} + ${n}`;
      case "endOfMonth":
        return "DATE(YEAR(TODAY()), MONTH(TODAY()) + 1, 1) - 1";
      case "daysSince":
        return `TODAY() - DATEVALUE(${f})`;
      case "ageYears":
        return `YEAR(TODAY()) - YEAR(${f})`;
      case "between":
        return `${f2} - ${f}`;
      default:
        return f;
    }
  }, [template, field, field2, days]);

  return (
    <div className="space-y-6 rounded-xl border border-theme-subtle bg-theme-surface/40 p-5 sm:p-8">
      <div>
        <label className="text-sm text-theme-muted">Template</label>
        <select value={template} onChange={(e) => setTemplate(e.target.value as TemplateKey)} className="input-field mt-1">
          {(Object.keys(LABELS) as TemplateKey[]).map((k) => (
            <option key={k} value={k}>
              {LABELS[k]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Primary date field</label>
          <input value={field} onChange={(e) => setField(e.target.value)} className="input-field mt-1" placeholder="CloseDate" />
        </div>
        {template === "addDays" && (
          <div>
            <label className="text-sm text-theme-muted">Days to add</label>
            <input value={days} onChange={(e) => setDays(e.target.value)} className="input-field mt-1" />
          </div>
        )}
        {template === "between" && (
          <div>
            <label className="text-sm text-theme-muted">Second date field</label>
            <input value={field2} onChange={(e) => setField2(e.target.value)} className="input-field mt-1" />
          </div>
        )}
      </div>
      <CopyResultPanel title="Salesforce formula" text={formula} />
    </div>
  );
}

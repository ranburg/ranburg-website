"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";

const LIMITS = { soql: 100, dml: 150, dmlRows: 50000, cpu: 10000, heap: 6 };

export default function GovernorLimitsCalculator() {
  const [records, setRecords] = useState(200);
  const [soqlPerRecord, setSoqlPerRecord] = useState(1);
  const [dmlPerRecord, setDmlPerRecord] = useState(1);

  const usage = useMemo(() => ({
    soql: records * soqlPerRecord,
    dml: records * dmlPerRecord,
    dmlRows: records * dmlPerRecord,
  }), [records, soqlPerRecord, dmlPerRecord]);

  const pct = (used: number, limit: number) => Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="glass-card space-y-6 p-8">
      <CalculatorSlider label="Records in Loop" value={records} min={1} max={5000} step={10} onChange={setRecords} />
      <CalculatorSlider label="SOQL per Record" value={soqlPerRecord} min={0} max={5} step={1} onChange={setSoqlPerRecord} />
      <CalculatorSlider label="DML per Record" value={dmlPerRecord} min={0} max={5} step={1} onChange={setDmlPerRecord} />
      <div className="space-y-3">
        {[
          { label: "SOQL Queries", used: usage.soql, limit: LIMITS.soql },
          { label: "DML Statements", used: usage.dml, limit: LIMITS.dml },
          { label: "DML Rows", used: usage.dmlRows, limit: LIMITS.dmlRows },
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-theme-muted">{item.label}</span>
              <span className={pct(item.used, item.limit) > 80 ? "text-red-400" : "text-accent-emerald"}>
                {item.used} / {item.limit} ({pct(item.used, item.limit)}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${pct(item.used, item.limit)}%` }} />
            </div>
          </div>
        ))}
      </div>
      {usage.soql > LIMITS.soql && (
        <p className="text-sm text-red-400">⚠ SOQL limit exceeded. Query outside the loop or use batch Apex.</p>
      )}
    </div>
  );
}

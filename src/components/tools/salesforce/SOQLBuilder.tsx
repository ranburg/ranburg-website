"use client";

import { useMemo, useState } from "react";
import { CopyResultPanel } from "@/components/tools/viz";

const PRESETS = ["Id", "Name", "CreatedDate", "LastModifiedDate", "OwnerId", "Industry", "Email", "Phone", "Status", "Amount"];

export default function SOQLBuilder() {
  const [objectName, setObjectName] = useState("Account");
  const [fieldList, setFieldList] = useState<string[]>(["Id", "Name", "Industry"]);
  const [customField, setCustomField] = useState("");
  const [where, setWhere] = useState("Industry = 'Technology'");
  const [orderBy, setOrderBy] = useState("Name ASC");
  const [limit, setLimit] = useState(100);
  const [mode, setMode] = useState<"select" | "aggregate">("select");
  const [aggregateFn, setAggregateFn] = useState("COUNT");
  const [aggregateField, setAggregateField] = useState("Id");
  const [groupBy, setGroupBy] = useState("Industry");

  const fields = fieldList.join(", ");

  const soql = useMemo(() => {
    if (mode === "aggregate") {
      const agg = aggregateFn === "COUNT" ? "COUNT()" : `${aggregateFn}(${aggregateField})`;
      return `SELECT ${groupBy}, ${agg}\nFROM ${objectName}${where ? `\nWHERE ${where}` : ""}\nGROUP BY ${groupBy}${orderBy ? `\nORDER BY ${orderBy}` : ""}\nLIMIT ${limit}`;
    }
    return `SELECT ${fields || "Id"}\nFROM ${objectName}${where ? `\nWHERE ${where}` : ""}${orderBy ? `\nORDER BY ${orderBy}` : ""}\nLIMIT ${limit}`;
  }, [mode, fields, objectName, where, orderBy, limit, aggregateFn, aggregateField, groupBy]);

  const toggleField = (f: string) => {
    setFieldList((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const addCustom = () => {
    const v = customField.trim();
    if (!v) return;
    setFieldList((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setCustomField("");
  };

  return (
    <div className="space-y-6 rounded-xl border border-theme-subtle bg-theme-surface/40 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {(["select", "aggregate"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${mode === m ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted"}`}
          >
            {m === "select" ? "Select query" : "Aggregate mode"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">sObject</label>
          <input value={objectName} onChange={(e) => setObjectName(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">LIMIT</label>
          <input type="number" value={limit} onChange={(e) => setLimit(+e.target.value)} className="input-field mt-1" />
        </div>
      </div>

      {mode === "select" ? (
        <div>
          <label className="text-sm text-theme-muted">Fields</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleField(f)}
                className={`rounded-full border px-3 py-1 text-sm ${fieldList.includes(f) ? "border-accent bg-accent/10 text-accent" : "border-theme-subtle text-theme-muted"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={customField} onChange={(e) => setCustomField(e.target.value)} className="input-field" placeholder="Custom field API name" />
            <button type="button" onClick={addCustom} className="shrink-0 rounded-lg border border-theme-subtle px-3 text-sm font-medium text-theme-heading">
              Add
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-theme-muted">Aggregate</label>
            <select value={aggregateFn} onChange={(e) => setAggregateFn(e.target.value)} className="input-field mt-1">
              {["COUNT", "SUM", "AVG", "MIN", "MAX"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-theme-muted">Field (for SUM/AVG/…)</label>
            <input value={aggregateField} onChange={(e) => setAggregateField(e.target.value)} className="input-field mt-1" disabled={aggregateFn === "COUNT"} />
          </div>
          <div>
            <label className="text-sm text-theme-muted">GROUP BY</label>
            <input value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="input-field mt-1" />
          </div>
        </div>
      )}

      <div>
        <label className="text-sm text-theme-muted">WHERE Clause</label>
        <input value={where} onChange={(e) => setWhere(e.target.value)} className="input-field mt-1" />
      </div>
      <div>
        <label className="text-sm text-theme-muted">ORDER BY</label>
        <input value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="input-field mt-1" />
      </div>

      <CopyResultPanel title="SOQL Query" text={soql} />
    </div>
  );
}

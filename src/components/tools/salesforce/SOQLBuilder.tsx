"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function SOQLBuilder() {
  const [objectName, setObjectName] = useState("Account");
  const [fields, setFields] = useState("Id, Name, Industry");
  const [where, setWhere] = useState("Industry = 'Technology'");
  const [orderBy, setOrderBy] = useState("Name ASC");
  const [limit, setLimit] = useState(100);

  const soql = `SELECT ${fields}\nFROM ${objectName}${where ? `\nWHERE ${where}` : ""}${orderBy ? `\nORDER BY ${orderBy}` : ""}\nLIMIT ${limit}`;

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">sObject</label>
          <input value={objectName} onChange={(e) => setObjectName(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">LIMIT</label>
          <input type="number" value={limit} onChange={(e) => setLimit(+e.target.value)} className="input-field mt-1" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-theme-muted">SELECT Fields</label>
          <input value={fields} onChange={(e) => setFields(e.target.value)} className="input-field mt-1" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-theme-muted">WHERE Clause</label>
          <input value={where} onChange={(e) => setWhere(e.target.value)} className="input-field mt-1" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-theme-muted">ORDER BY</label>
          <input value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-theme-body">SOQL Query</span>
          <CopyButton text={soql} />
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm text-accent-emerald">{soql}</pre>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { FieldLabel, Panel, ToolNote, ToolStack, ghostButton } from "@/components/tools/kit";
import { convertBase, jsonToTypescript } from "@/lib/plannerMath";

const SAMPLE_JSON = `{
  "id": 1042,
  "name": "Ranburg Invoice",
  "paid": false,
  "tags": ["gst", "export"],
  "customer": {
    "id": 77,
    "email": "billing@example.com",
    "address": null
  },
  "items": [
    { "sku": "A-100", "qty": 2, "price": 1499.5 },
    { "sku": "B-220", "qty": 1, "price": 899, "discount": 10 }
  ]
}`;

export function JsonToTypescriptTool() {
  const [json, setJson] = useState(SAMPLE_JSON);
  const [rootName, setRootName] = useState("Invoice");

  const result = useMemo(() => jsonToTypescript(json, rootName || "Root"), [json, rootName]);

  const format = () => {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
    } catch {
      /* leave invalid JSON untouched; the error is shown below */
    }
  };

  return (
    <ToolStack>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="JSON input"
          action={
            <div className="flex gap-2">
              <button type="button" className={ghostButton} onClick={format}>
                Format
              </button>
              <button type="button" className={ghostButton} onClick={() => setJson(SAMPLE_JSON)}>
                Sample
              </button>
            </div>
          }
        >
          <textarea
            aria-label="JSON input"
            spellCheck={false}
            className="input-field min-h-[22rem] resize-y font-mono text-sm leading-relaxed"
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
        </Panel>
        <Panel title="TypeScript" action={<CopyButton text={result.code} label="Copy types" toolSlug="json-to-typescript" />}>
          {result.error ? (
            <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-300">
              Invalid JSON: {result.error}
            </p>
          ) : (
            <pre className="max-h-[26rem] min-h-[22rem] overflow-auto rounded-xl border border-theme-subtle bg-[var(--background)] p-4 font-mono text-sm leading-relaxed text-theme-body">
              {result.code}
            </pre>
          )}
        </Panel>
      </div>
      <div className="max-w-xs">
        <FieldLabel label="Root type name">
          <input
            type="text"
            spellCheck={false}
            className="input-field font-mono text-sm"
            value={rootName}
            onChange={(e) => setRootName(e.target.value.replace(/[^A-Za-z0-9_ ]/g, ""))}
          />
        </FieldLabel>
      </div>
      <ToolNote>
        Types are inferred from the sample you paste. Objects inside an array are merged, so a key missing from some items becomes
        optional. A <code className="font-mono">null</code> value is typed as <code className="font-mono">null</code> — widen it by
        hand if the real field can hold data. Nothing leaves your browser.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

const BASES = [
  { base: 2, label: "Binary", hint: "base 2" },
  { base: 8, label: "Octal", hint: "base 8" },
  { base: 10, label: "Decimal", hint: "base 10" },
  { base: 16, label: "Hexadecimal", hint: "base 16" },
] as const;

function group(value: string, size: number): string {
  const negative = value.startsWith("-");
  const digits = negative ? value.slice(1) : value;
  const out: string[] = [];
  for (let end = digits.length; end > 0; end -= size) out.unshift(digits.slice(Math.max(0, end - size), end));
  return `${negative ? "-" : ""}${out.join(" ")}`;
}

export function NumberBaseTool() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [customBase, setCustomBase] = useState(36);

  const valid = convertBase(input, fromBase, 10) !== null;

  return (
    <ToolStack>
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <FieldLabel label="Number">
          <input
            type="text"
            spellCheck={false}
            autoCapitalize="off"
            className="input-field font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-invalid={!valid}
          />
        </FieldLabel>
        <FieldLabel label="Input base">
          <select className="input-field" value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>
            {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
              <option key={b} value={b}>
                {b}
                {b === 2 ? " — binary" : b === 8 ? " — octal" : b === 10 ? " — decimal" : b === 16 ? " — hex" : ""}
              </option>
            ))}
          </select>
        </FieldLabel>
      </div>
      {!valid && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-300">
          That is not a valid base-{fromBase} whole number. Use digits 0–{fromBase <= 10 ? fromBase - 1 : `9 and letters a–${"abcdefghijklmnopqrstuvwxyz"[fromBase - 11]}`}.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {BASES.map(({ base, label, hint }) => {
          const value = convertBase(input, fromBase, base) ?? "";
          const shown = value ? (base === 2 ? group(value, 4) : base === 16 ? group(value.toUpperCase(), 4) : value) : "—";
          return (
            <Panel key={base} title={`${label} · ${hint}`} action={<CopyButton text={base === 16 ? value.toUpperCase() : value} toolSlug="number-base-converter" />}>
              <p className="break-all font-mono text-lg text-theme-heading">{shown}</p>
            </Panel>
          );
        })}
      </div>
      <Panel
        title={`Custom base ${customBase}`}
        action={<CopyButton text={convertBase(input, fromBase, customBase) ?? ""} toolSlug="number-base-converter" />}
      >
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="range"
            min={2}
            max={36}
            step={1}
            value={customBase}
            aria-label="Custom output base"
            onChange={(e) => setCustomBase(Number(e.target.value))}
            className="max-w-xs"
          />
          <p className="break-all font-mono text-lg text-theme-heading">{convertBase(input, fromBase, customBase) ?? "—"}</p>
        </div>
      </Panel>
      <ToolNote>
        Whole numbers of any length are supported (arbitrary precision), including negatives. Prefixes like 0x, 0b and 0o are
        accepted for their matching input base; spaces and underscores are ignored.
      </ToolNote>
    </ToolStack>
  );
}

"use client";

import { useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    const list = Array.from({ length: Math.min(100, Math.max(1, quantity)) }, () => {
      const id = generateUUID();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(list);
  }, [quantity, uppercase]);

  const format = (id: string) => (uppercase ? id.toUpperCase() : id.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" /> Generate UUID
          </button>
          <CopyButton text={uuids.join("\n")} label="Copy all" />
        </div>

        <div className="mt-6 space-y-2">
          {uuids.map((id, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl bg-theme-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <code className="min-w-0 break-all font-mono text-sm text-accent sm:text-lg">{format(id)}</code>
              <CopyButton text={format(id)} label="Copy" />
            </div>
          ))}
        </div>
      </div>

      <AdvancedOptions>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Quantity (1–100)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-field"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 self-end text-sm text-theme-muted">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-accent" />
            Uppercase format
          </label>
        </div>
      </AdvancedOptions>
    </div>
  );
}

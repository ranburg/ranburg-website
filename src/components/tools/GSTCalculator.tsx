"use client";

import { useMemo, useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import { cn } from "@/lib/utils";

const GST_RATES = [5, 12, 18, 28];

export default function GSTCalculator() {
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState(18);
  const [showSplit, setShowSplit] = useState(true);

  const result = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) return null;
    if (mode === "exclusive") {
      const gst = num * (rate / 100);
      const gross = num + gst;
      return { net: num, gst, gross, cgst: gst / 2, sgst: gst / 2 };
    }
    const net = num / (1 + rate / 100);
    const gst = num - net;
    return { net, gst, gross: num, cgst: gst / 2, sgst: gst / 2 };
  }, [amount, rate, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["exclusive", "inclusive"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium transition",
              mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
            )}
          >
            GST {m === "exclusive" ? "Exclusive" : "Inclusive"}
          </button>
        ))}
      </div>

      <div className="glass-card space-y-6 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-theme-body">
            {mode === "exclusive" ? "Amount (before GST)" : "Amount (including GST)"}
          </label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field text-lg font-semibold" min={0} />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-theme-body">GST Rate</label>
          <div className="flex flex-wrap gap-2">
            {GST_RATES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-semibold transition",
                  rate === r ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
                )}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="Net amount" value={result.net} />
          <ResultCard label={`GST (${rate}%)`} value={result.gst} highlight />
          <ResultCard label="Gross total" value={result.gross} variant="emerald" />
        </div>
      )}

      <AdvancedOptions>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={showSplit} onChange={(e) => setShowSplit(e.target.checked)} className="accent-accent" />
          Show CGST / SGST split (intra-state)
        </label>
        {showSplit && result && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="CGST (50%)" value={result.cgst} />
            <ResultCard label="SGST (50%)" value={result.sgst} />
          </div>
        )}
      </AdvancedOptions>
    </div>
  );
}

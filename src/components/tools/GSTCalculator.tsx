"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import { formatCurrency, cn } from "@/lib/utils";

const GST_RATES = [0, 5, 12, 18, 28];

interface LineItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

function newLine(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    hsn: "",
    qty: 1,
    rate: 0,
    gstRate: 18,
  };
}

export default function GSTCalculator() {
  const [mode, setMode] = useState<"quick" | "invoice">("quick");
  const [taxType, setTaxType] = useState<"intra" | "inter">("intra");
  const [pricingMode, setPricingMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState(18);
  const [lines, setLines] = useState<LineItem[]>([
    { id: "1", description: "Product / Service", hsn: "9983", qty: 1, rate: 10000, gstRate: 18 },
  ]);
  const [cessRate, setCessRate] = useState(0);

  const quickResult = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) return null;
    const cess = num * (cessRate / 100);
    if (pricingMode === "exclusive") {
      const gst = num * (rate / 100);
      const gross = num + gst + cess;
      const half = gst / 2;
      return { net: num, gst, cess, gross, cgst: half, sgst: half, igst: gst };
    }
    const net = num / (1 + rate / 100);
    const gst = num - net;
    const gross = num + cess;
    const half = gst / 2;
    return { net, gst, cess, gross, cgst: half, sgst: half, igst: gst };
  }, [amount, rate, pricingMode, cessRate]);

  const invoiceResult = useMemo(() => {
    let taxable = 0;
    let totalGst = 0;
    let totalCess = 0;
    const rows = lines.map((line) => {
      const base = line.qty * line.rate;
      let net = base;
      let gst = 0;
      if (pricingMode === "inclusive" && line.gstRate > 0) {
        net = base / (1 + line.gstRate / 100);
        gst = base - net;
      } else {
        gst = net * (line.gstRate / 100);
      }
      const cess = net * (cessRate / 100);
      taxable += net;
      totalGst += gst;
      totalCess += cess;
      const half = gst / 2;
      return {
        ...line,
        net,
        gst,
        cess,
        gross: net + gst + cess,
        cgst: half,
        sgst: half,
        igst: gst,
      };
    });
    return {
      rows,
      taxable,
      totalGst,
      totalCess,
      grandTotal: taxable + totalGst + totalCess,
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      igst: totalGst,
    };
  }, [lines, pricingMode, cessRate]);

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["quick", "invoice"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium transition",
              mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
            )}
          >
            {m === "quick" ? "Quick Calculator" : "Multi-Line Invoice"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTaxType("intra")}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-medium",
            taxType === "intra" ? "bg-accent/15 text-accent" : "border border-theme-subtle text-theme-muted"
          )}
        >
          Intra-state (CGST + SGST)
        </button>
        <button
          type="button"
          onClick={() => setTaxType("inter")}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-medium",
            taxType === "inter" ? "bg-accent/15 text-accent" : "border border-theme-subtle text-theme-muted"
          )}
        >
          Inter-state (IGST)
        </button>
        <button
          type="button"
          onClick={() => setPricingMode(pricingMode === "exclusive" ? "inclusive" : "exclusive")}
          className="rounded-lg border border-theme-subtle px-4 py-2 text-xs font-medium text-theme-muted hover:text-accent"
        >
          Prices are GST-{pricingMode}
        </button>
      </div>

      {mode === "quick" ? (
        <>
          <div className="glass-card space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-theme-body">
                {pricingMode === "exclusive" ? "Taxable amount (before GST)" : "Amount (including GST)"}
              </label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field text-lg font-semibold" min={0} />
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-theme-body">GST Rate</label>
              <div className="flex flex-wrap gap-2">
                {GST_RATES.filter((r) => r > 0).map((r) => (
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

          {quickResult && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label="Taxable value" value={quickResult.net} />
              <ResultCard label={`GST (${rate}%)`} value={quickResult.gst} highlight />
              {taxType === "intra" ? (
                <>
                  <ResultCard label="CGST (50%)" value={quickResult.cgst} />
                  <ResultCard label="SGST (50%)" value={quickResult.sgst} />
                </>
              ) : (
                <ResultCard label="IGST" value={quickResult.igst} />
              )}
              {quickResult.cess > 0 && <ResultCard label={`Cess (${cessRate}%)`} value={quickResult.cess} />}
              <ResultCard label="Grand total" value={quickResult.gross} variant="emerald" />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="glass-card overflow-x-auto p-4">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-theme-subtle text-left text-xs uppercase tracking-wider text-theme-subtle">
                  <th className="pb-3 pr-2">Description</th>
                  <th className="pb-3 pr-2">HSN/SAC</th>
                  <th className="pb-3 pr-2">Qty</th>
                  <th className="pb-3 pr-2">Rate (₹)</th>
                  <th className="pb-3 pr-2">GST %</th>
                  <th className="pb-3 pr-2 text-right">Taxable</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {invoiceResult.rows.map((row) => (
                  <tr key={row.id} className="border-b border-theme-subtle/50">
                    <td className="py-2 pr-2">
                      <input
                        value={row.description}
                        onChange={(e) => updateLine(row.id, { description: e.target.value })}
                        className="input-field py-1.5 text-sm"
                        placeholder="Item name"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        value={row.hsn}
                        onChange={(e) => updateLine(row.id, { hsn: e.target.value })}
                        className="input-field py-1.5 text-sm w-20"
                        placeholder="9983"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={row.qty}
                        min={1}
                        onChange={(e) => updateLine(row.id, { qty: Number(e.target.value) })}
                        className="input-field py-1.5 text-sm w-16"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={row.rate}
                        min={0}
                        onChange={(e) => updateLine(row.id, { rate: Number(e.target.value) })}
                        className="input-field py-1.5 text-sm w-24"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <select
                        value={row.gstRate}
                        onChange={(e) => updateLine(row.id, { gstRate: Number(e.target.value) })}
                        className="input-field py-1.5 text-sm"
                      >
                        {GST_RATES.map((r) => (
                          <option key={r} value={r}>
                            {r}%
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-2 text-right text-theme-muted">{formatCurrency(row.net)}</td>
                    <td className="py-2 text-right font-medium text-theme-heading">{formatCurrency(row.gross)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => setLines((prev) => prev.filter((l) => l.id !== row.id))}
                        className="text-theme-subtle hover:text-red-500"
                        aria-label="Remove line"
                        disabled={lines.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => setLines((prev) => [...prev, newLine()])}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add line item
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label="Total taxable" value={invoiceResult.taxable} />
            <ResultCard label="Total GST" value={invoiceResult.totalGst} highlight />
            {taxType === "intra" ? (
              <>
                <ResultCard label="CGST" value={invoiceResult.cgst} />
                <ResultCard label="SGST" value={invoiceResult.sgst} />
              </>
            ) : (
              <ResultCard label="IGST" value={invoiceResult.igst} />
            )}
            {invoiceResult.totalCess > 0 && <ResultCard label="Cess" value={invoiceResult.totalCess} />}
            <ResultCard label="Grand total" value={invoiceResult.grandTotal} variant="emerald" />
          </div>
        </>
      )}

      <AdvancedOptions>
        <div>
          <label className="mb-2 block text-sm font-medium text-theme-body">Cess rate (%)</label>
          <input
            type="number"
            value={cessRate}
            min={0}
            max={100}
            step={0.5}
            onChange={(e) => setCessRate(Number(e.target.value))}
            className="input-field w-32"
          />
        </div>
        <p className="text-xs text-theme-subtle">
          Use intra-state for CGST+SGST (same state). Use inter-state for IGST (different states). HSN/SAC codes help with GST filing and e-invoices.
        </p>
      </AdvancedOptions>
    </div>
  );
}

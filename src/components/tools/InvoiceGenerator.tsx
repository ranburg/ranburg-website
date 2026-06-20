"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Printer } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  gstRate: number;
}

function newLine(): LineItem {
  return { id: crypto.randomUUID(), description: "", qty: 1, rate: 0, gstRate: 18 };
}

export default function InvoiceGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [business, setBusiness] = useState({
    name: "Your Business Name",
    gstin: "",
    address: "City, State, PIN",
    email: "billing@example.com",
    phone: "",
  });
  const [client, setClient] = useState({
    name: "Client Name",
    gstin: "",
    address: "Client address",
  });
  const [meta, setMeta] = useState({
    invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "Thank you for your business.",
  });
  const [lines, setLines] = useState<LineItem[]>([
    { id: "1", description: "Professional services", qty: 1, rate: 10000, gstRate: 18 },
  ]);
  const [taxType, setTaxType] = useState<"intra" | "inter">("intra");

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalGst = 0;
    const rows = lines.map((line) => {
      const amount = line.qty * line.rate;
      const gst = amount * (line.gstRate / 100);
      subtotal += amount;
      totalGst += gst;
      return { ...line, amount, gst, total: amount + gst };
    });
    const half = totalGst / 2;
    return {
      rows,
      subtotal,
      totalGst,
      grandTotal: subtotal + totalGst,
      cgst: half,
      sgst: half,
      igst: totalGst,
    };
  }, [lines]);

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${meta.invoiceNo}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse;margin:24px 0}
      th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.totals{text-align:right;margin-top:16px}
      h1{margin:0} .muted{color:#666;font-size:14px}</style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-4 p-6">
          <h3 className="font-semibold text-theme-heading">Your Business</h3>
          {(["name", "gstin", "address", "email", "phone"] as const).map((field) => (
            <input
              key={field}
              value={business[field]}
              onChange={(e) => setBusiness({ ...business, [field]: e.target.value })}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="input-field"
            />
          ))}
        </div>
        <div className="glass-card space-y-4 p-6">
          <h3 className="font-semibold text-theme-heading">Bill To</h3>
          {(["name", "gstin", "address"] as const).map((field) => (
            <input
              key={field}
              value={client[field]}
              onChange={(e) => setClient({ ...client, [field]: e.target.value })}
              placeholder={field === "gstin" ? "GSTIN (optional)" : field.charAt(0).toUpperCase() + field.slice(1)}
              className="input-field"
            />
          ))}
        </div>
      </div>

      <div className="glass-card grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">Invoice #</label>
          <input value={meta.invoiceNo} onChange={(e) => setMeta({ ...meta, invoiceNo: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">Date</label>
          <input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">Due date</label>
          <input type="date" value={meta.dueDate} onChange={(e) => setMeta({ ...meta, dueDate: e.target.value })} className="input-field" />
        </div>
      </div>

      <div className="flex gap-2">
        {(["intra", "inter"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTaxType(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-medium",
              taxType === t ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted"
            )}
          >
            {t === "intra" ? "CGST + SGST" : "IGST"}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-theme-subtle text-left text-xs uppercase text-theme-subtle">
              <th className="pb-3 pr-2">Description</th>
              <th className="pb-3 pr-2">Qty</th>
              <th className="pb-3 pr-2">Rate</th>
              <th className="pb-3 pr-2">GST %</th>
              <th className="pb-3 pr-2 text-right">Amount</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-b border-theme-subtle/50">
                <td className="py-2 pr-2">
                  <input value={line.description} onChange={(e) => updateLine(line.id, { description: e.target.value })} className="input-field py-1.5" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={1} value={line.qty} onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) })} className="input-field py-1.5 w-16" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={0} value={line.rate} onChange={(e) => updateLine(line.id, { rate: Number(e.target.value) })} className="input-field py-1.5 w-24" />
                </td>
                <td className="py-2 pr-2">
                  <select value={line.gstRate} onChange={(e) => updateLine(line.id, { gstRate: Number(e.target.value) })} className="input-field py-1.5">
                    {[0, 5, 12, 18, 28].map((r) => (
                      <option key={r} value={r}>{r}%</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2 text-right font-medium">{formatCurrency(line.qty * line.rate)}</td>
                <td className="py-2">
                  <button type="button" onClick={() => setLines((p) => p.filter((l) => l.id !== line.id))} disabled={lines.length <= 1} className="text-theme-subtle hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={() => setLines((p) => [...p, newLine()])} className="mt-3 inline-flex items-center gap-2 text-sm text-accent hover:underline">
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      <div ref={printRef} className="glass-card p-8">
        <div className="flex flex-wrap justify-between gap-6 border-b border-theme-subtle pb-6">
          <div>
            <h2 className="text-2xl font-bold text-theme-heading">INVOICE</h2>
            <p className="mt-1 text-sm text-theme-muted">#{meta.invoiceNo}</p>
            <p className="text-sm text-theme-muted">Date: {meta.date}</p>
            {meta.dueDate && <p className="text-sm text-theme-muted">Due: {meta.dueDate}</p>}
          </div>
          <div className="text-right text-sm text-theme-muted">
            <p className="font-semibold text-theme-heading">{business.name}</p>
            {business.gstin && <p>GSTIN: {business.gstin}</p>}
            <p>{business.address}</p>
            {business.email && <p>{business.email}</p>}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-theme-subtle">Bill To</p>
            <p className="mt-1 font-medium text-theme-heading">{client.name}</p>
            {client.gstin && <p className="text-theme-muted">GSTIN: {client.gstin}</p>}
            <p className="text-theme-muted">{client.address}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
        <table className="mt-8 w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-theme-subtle text-left text-xs uppercase text-theme-subtle">
              <th className="pb-2">Description</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Rate</th>
              <th className="pb-2">GST</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {totals.rows.map((row) => (
              <tr key={row.id} className="border-b border-theme-subtle/50">
                <td className="py-2">{row.description || "—"}</td>
                <td className="py-2">{row.qty}</td>
                <td className="py-2">{formatCurrency(row.rate)}</td>
                <td className="py-2">{row.gstRate}%</td>
                <td className="py-2 text-right">{formatCurrency(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="mt-6 ml-auto max-w-full space-y-1 text-sm sm:max-w-xs">
          <div className="flex justify-between"><span className="text-theme-muted">Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          {taxType === "intra" ? (
            <>
              <div className="flex justify-between"><span className="text-theme-muted">CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
              <div className="flex justify-between"><span className="text-theme-muted">SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
            </>
          ) : (
            <div className="flex justify-between"><span className="text-theme-muted">IGST</span><span>{formatCurrency(totals.igst)}</span></div>
          )}
          <div className="flex justify-between border-t border-theme-subtle pt-2 text-base font-bold">
            <span>Grand Total</span><span className="text-accent">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>

        {meta.notes && (
          <p className="mt-8 text-sm text-theme-muted">
            <span className="font-medium">Notes: </span>{meta.notes}
          </p>
        )}
      </div>

      <textarea
        value={meta.notes}
        onChange={(e) => setMeta({ ...meta, notes: e.target.value })}
        rows={2}
        className="input-field w-full"
        placeholder="Payment terms or notes"
      />
    </div>
  );
}

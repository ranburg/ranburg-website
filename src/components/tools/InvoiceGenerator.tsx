"use client";

import { useMemo, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Printer, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatInvoiceMoney,
  getInvoiceCountry,
  INVOICE_COLOR_PRESETS,
  INVOICE_COUNTRIES,
  type InvoiceCountry,
} from "@/lib/invoiceCountryProfiles";

interface LineItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  taxRate: number;
}

function newLine(taxRate: number): LineItem {
  return { id: crypto.randomUUID(), description: "", hsn: "", qty: 1, rate: 0, taxRate };
}

export default function InvoiceGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState<InvoiceCountry>("IN");
  const profile = getInvoiceCountry(country);

  const [business, setBusiness] = useState<Record<string, string>>({
    name: "Your Business Name",
    address: "City, Region",
    email: "billing@example.com",
    phone: "",
    gstin: "",
    pan: "",
    lut: "",
    placeOfSupply: "",
    ein: "",
    state: "",
    salesTaxId: "",
    vatNumber: "",
    companyNumber: "",
    businessNumber: "",
    province: "",
    abn: "",
    acn: "",
    uen: "",
    gstReg: "",
    trn: "",
    tradeLicense: "",
    vatId: "",
    handelsregister: "",
    siret: "",
    kvk: "",
  });
  const [client, setClient] = useState<Record<string, string>>({
    name: "Client Name",
    address: "Client address",
    gstin: "",
    placeOfSupply: "",
    state: "",
    taxExemptId: "",
    vatNumber: "",
    province: "",
    abn: "",
    uen: "",
    trn: "",
    vatId: "",
  });
  const [meta, setMeta] = useState({
    invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "Thank you for your business.",
    reverseCharge: false,
    taxExempt: false,
  });
  const [lines, setLines] = useState<LineItem[]>([
    { id: "1", description: "Professional services", hsn: "", qty: 1, rate: 1000, taxRate: 18 },
  ]);
  const [taxType, setTaxType] = useState<"intra" | "inter">("intra");
  const [accent, setAccent] = useState<string>(INVOICE_COLOR_PRESETS[0].accent);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const money = (n: number) => formatInvoiceMoney(n, profile.locale, profile.currency);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    const rows = lines.map((line) => {
      const amount = line.qty * line.rate;
      const effectiveRate = meta.taxExempt || meta.reverseCharge ? 0 : line.taxRate;
      const tax = amount * (effectiveRate / 100);
      subtotal += amount;
      totalTax += tax;
      return { ...line, amount, tax, total: amount + tax, effectiveRate };
    });
    const half = totalTax / 2;
    return {
      rows,
      subtotal,
      totalTax,
      grandTotal: subtotal + totalTax,
      cgst: half,
      sgst: half,
      igst: totalTax,
    };
  }, [lines, meta.taxExempt, meta.reverseCharge]);

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const onCountryChange = (code: InvoiceCountry) => {
    const next = getInvoiceCountry(code);
    setCountry(code);
    setLines((prev) => prev.map((l) => ({ ...l, taxRate: next.defaultTaxRate })));
    setMeta((m) => ({ ...m, reverseCharge: false, taxExempt: false }));
  };

  const onLogo = (file: File | null) => {
    if (!file) {
      setLogoDataUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${meta.invoiceNo}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse;margin:24px 0}
      th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.totals{text-align:right;margin-top:16px}
      h1{margin:0;color:${accent}} .muted{color:#666;font-size:14px} img.logo{max-height:64px;max-width:180px;object-fit:contain}
      .accent{color:${accent}} .bar{height:4px;background:${accent};margin-bottom:24px}</style></head>
      <body><div class="bar"></div>${content.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleDownloadPdf = async () => {
    const el = printRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      const x = (pageWidth - w) / 2;
      pdf.addImage(img, "PNG", x, 10, w, h);
      pdf.save(`${meta.invoiceNo || "invoice"}.pdf`);
    } catch {
      handlePrint();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">Country & branding</h3>
        <div className="flex flex-wrap gap-2">
          {INVOICE_COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onCountryChange(c.code)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                country === c.code ? "bg-accent text-white" : "border border-theme text-theme-muted"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-theme-subtle">Accent color</p>
            <div className="flex flex-wrap items-center gap-2">
              {INVOICE_COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  title={p.name}
                  onClick={() => setAccent(p.accent)}
                  className={cn("h-8 w-8 rounded-full border-2", accent === p.accent ? "border-theme-heading" : "border-transparent")}
                  style={{ background: p.accent }}
                />
              ))}
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-theme bg-transparent"
                aria-label="Custom accent"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-theme-subtle">Logo (stays in your browser)</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-theme px-3 py-2 text-sm text-theme-muted hover:border-accent/40">
              <ImagePlus className="h-4 w-4" />
              {logoDataUrl ? "Change logo" : "Upload logo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onLogo(e.target.files?.[0] ?? null)} />
            </label>
            {logoDataUrl && (
              <button type="button" className="ml-3 text-xs text-red-500" onClick={() => setLogoDataUrl(null)}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-3 p-6">
          <h3 className="font-semibold text-theme-heading">Your business</h3>
          <input value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} placeholder="Business name" className="input-field" />
          <input value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} placeholder="Address" className="input-field" />
          <input value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} placeholder="Email" className="input-field" />
          <input value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} placeholder="Phone" className="input-field" />
          {profile.sellerFields.map((f) => (
            <input
              key={f.key}
              value={business[f.key] ?? ""}
              onChange={(e) => setBusiness({ ...business, [f.key]: e.target.value })}
              placeholder={`${f.label}${f.requiredHint ? " (recommended)" : " (optional)"}`}
              className="input-field"
            />
          ))}
        </div>
        <div className="glass-card space-y-3 p-6">
          <h3 className="font-semibold text-theme-heading">Bill to</h3>
          <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Client name" className="input-field" />
          <input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} placeholder="Client address" className="input-field" />
          {profile.clientFields.map((f) => (
            <input
              key={f.key}
              value={client[f.key] ?? ""}
              onChange={(e) => setClient({ ...client, [f.key]: e.target.value })}
              placeholder={f.placeholder ? `${f.label} — ${f.placeholder}` : f.label}
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

      <div className="flex flex-wrap gap-2">
        {profile.showIntraInter &&
          (["intra", "inter"] as const).map((t) => (
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
        {profile.taxMode === "vat" && (
          <label className="inline-flex items-center gap-2 rounded-lg border border-theme px-3 py-2 text-xs text-theme-muted">
            <input type="checkbox" checked={meta.reverseCharge} onChange={(e) => setMeta({ ...meta, reverseCharge: e.target.checked })} />
            Reverse charge (0% VAT on lines)
          </label>
        )}
        {profile.taxMode === "sales_tax" && (
          <label className="inline-flex items-center gap-2 rounded-lg border border-theme px-3 py-2 text-xs text-theme-muted">
            <input type="checkbox" checked={meta.taxExempt} onChange={(e) => setMeta({ ...meta, taxExempt: e.target.checked })} />
            Tax exempt
          </label>
        )}
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-theme-subtle text-left text-xs uppercase text-theme-subtle">
              <th className="pb-3 pr-2">Description</th>
              {profile.showHsn && <th className="pb-3 pr-2">HSN/SAC</th>}
              <th className="pb-3 pr-2">Qty</th>
              <th className="pb-3 pr-2">Rate</th>
              <th className="pb-3 pr-2">{profile.taxLabels.primary} %</th>
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
                {profile.showHsn && (
                  <td className="py-2 pr-2">
                    <input value={line.hsn} onChange={(e) => updateLine(line.id, { hsn: e.target.value })} className="input-field w-24 py-1.5" placeholder="Code" />
                  </td>
                )}
                <td className="py-2 pr-2">
                  <input type="number" min={1} value={line.qty} onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) })} className="input-field w-16 py-1.5" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={0} value={line.rate} onChange={(e) => updateLine(line.id, { rate: Number(e.target.value) })} className="input-field w-24 py-1.5" />
                </td>
                <td className="py-2 pr-2">
                  <select value={line.taxRate} onChange={(e) => updateLine(line.id, { taxRate: Number(e.target.value) })} className="input-field py-1.5">
                    {profile.taxRates.map((r) => (
                      <option key={r} value={r}>
                        {r}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2 text-right font-medium">{money(line.qty * line.rate)}</td>
                <td className="py-2">
                  <button type="button" onClick={() => setLines((p) => p.filter((l) => l.id !== line.id))} disabled={lines.length <= 1} className="text-theme-subtle hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={() => setLines((p) => [...p, newLine(profile.defaultTaxRate)])} className="mt-3 inline-flex items-center gap-2 text-sm text-accent hover:underline">
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>

      <textarea
        value={meta.notes}
        onChange={(e) => setMeta({ ...meta, notes: e.target.value })}
        rows={2}
        className="input-field w-full"
        placeholder={profile.notesPlaceholder}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> {downloading ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl border border-theme px-5 py-2.5 text-sm font-medium text-theme-heading hover:border-accent/40">
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      <div ref={printRef} className="rounded-2xl border border-theme bg-white p-8 text-slate-900 shadow-sm">
        <div className="mb-6 h-1 rounded-full" style={{ background: accent }} />
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-start gap-4">
            {logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoDataUrl} alt="Logo" className="logo max-h-16 max-w-[180px] object-contain" />
            )}
            <div>
              <h2 className="text-2xl font-bold" style={{ color: accent }}>
                INVOICE
              </h2>
              <p className="mt-1 text-sm text-slate-600">#{meta.invoiceNo}</p>
              <p className="text-sm text-slate-600">Date: {meta.date}</p>
              {meta.dueDate && <p className="text-sm text-slate-600">Due: {meta.dueDate}</p>}
              <p className="mt-1 text-xs text-slate-500">{profile.label} · {profile.currency}</p>
            </div>
          </div>
          <div className="max-w-xs text-right text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{business.name}</p>
            <SellerExtras business={business} profileCode={country} />
            <p>{business.address}</p>
            {business.email && <p>{business.email}</p>}
            {business.phone && <p>{business.phone}</p>}
          </div>
        </div>

        <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Bill to</p>
            <p className="mt-1 font-medium text-slate-900">{client.name}</p>
            <ClientExtras client={client} profileCode={country} />
            <p className="text-slate-600">{client.address}</p>
          </div>
          {(meta.reverseCharge || meta.taxExempt) && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              {meta.reverseCharge && <p>VAT reverse charge applies — customer accounts for VAT.</p>}
              {meta.taxExempt && <p>Sale marked tax-exempt{client.taxExemptId ? ` (ID: ${client.taxExemptId})` : ""}.</p>}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="mt-8 w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="pb-2">Description</th>
                {profile.showHsn && <th className="pb-2">HSN/SAC</th>}
                <th className="pb-2">Qty</th>
                <th className="pb-2">Rate</th>
                <th className="pb-2">{profile.taxLabels.primary}</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {totals.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-2">{row.description || "—"}</td>
                  {profile.showHsn && <td className="py-2">{row.hsn || "—"}</td>}
                  <td className="py-2">{row.qty}</td>
                  <td className="py-2">{money(row.rate)}</td>
                  <td className="py-2">{row.effectiveRate}%</td>
                  <td className="py-2 text-right">{money(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-6 max-w-full space-y-1 text-sm sm:max-w-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </div>
          <TaxBreakdown profileCode={country} taxType={taxType} totals={totals} money={money} labels={profile.taxLabels} />
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
            <span>Grand total</span>
            <span style={{ color: accent }}>{money(totals.grandTotal)}</span>
          </div>
        </div>

        {meta.notes && (
          <p className="mt-8 text-sm text-slate-600">
            <span className="font-medium">Notes: </span>
            {meta.notes}
          </p>
        )}
      </div>
    </div>
  );
}

function SellerExtras({ business, profileCode }: { business: Record<string, string>; profileCode: InvoiceCountry }) {
  const rows: string[] = [];
  if (profileCode === "IN") {
    if (business.gstin) rows.push(`GSTIN: ${business.gstin}`);
    if (business.pan) rows.push(`PAN: ${business.pan}`);
    if (business.lut) rows.push(`LUT: ${business.lut}`);
    if (business.placeOfSupply) rows.push(`Place of supply: ${business.placeOfSupply}`);
  } else if (profileCode === "US") {
    if (business.ein) rows.push(`EIN: ${business.ein}`);
    if (business.state) rows.push(`State: ${business.state}`);
    if (business.salesTaxId) rows.push(`Sales tax ID: ${business.salesTaxId}`);
  } else if (profileCode === "UK") {
    if (business.vatNumber) rows.push(`VAT: ${business.vatNumber}`);
    if (business.companyNumber) rows.push(`Co. #: ${business.companyNumber}`);
  } else if (profileCode === "CA") {
    if (business.businessNumber) rows.push(`BN: ${business.businessNumber}`);
    if (business.province) rows.push(`Province: ${business.province}`);
  } else if (profileCode === "AU") {
    if (business.abn) rows.push(`ABN: ${business.abn}`);
    if (business.acn) rows.push(`ACN: ${business.acn}`);
  } else if (profileCode === "SG") {
    if (business.uen) rows.push(`UEN: ${business.uen}`);
    if (business.gstReg) rows.push(`GST Reg: ${business.gstReg}`);
  } else if (profileCode === "AE") {
    if (business.trn) rows.push(`TRN: ${business.trn}`);
    if (business.tradeLicense) rows.push(`License: ${business.tradeLicense}`);
  } else {
    if (business.vatId) rows.push(`VAT ID: ${business.vatId}`);
    if (business.handelsregister) rows.push(business.handelsregister);
    if (business.siret) rows.push(`SIRET: ${business.siret}`);
    if (business.kvk) rows.push(`KvK: ${business.kvk}`);
  }
  return (
    <>
      {rows.map((r) => (
        <p key={r}>{r}</p>
      ))}
    </>
  );
}

function ClientExtras({ client, profileCode }: { client: Record<string, string>; profileCode: InvoiceCountry }) {
  const rows: string[] = [];
  if (profileCode === "IN") {
    if (client.gstin) rows.push(`GSTIN: ${client.gstin}`);
    if (client.placeOfSupply) rows.push(`State: ${client.placeOfSupply}`);
  } else if (profileCode === "US") {
    if (client.state) rows.push(`State: ${client.state}`);
    if (client.taxExemptId) rows.push(`Exempt ID: ${client.taxExemptId}`);
  } else if (profileCode === "UK" && client.vatNumber) rows.push(`VAT: ${client.vatNumber}`);
  else if (profileCode === "CA" && client.province) rows.push(`Province: ${client.province}`);
  else if (profileCode === "AU" && client.abn) rows.push(`ABN: ${client.abn}`);
  else if (profileCode === "SG" && client.uen) rows.push(`UEN: ${client.uen}`);
  else if (profileCode === "AE" && client.trn) rows.push(`TRN: ${client.trn}`);
  else if (client.vatId) rows.push(`VAT ID: ${client.vatId}`);
  return (
    <>
      {rows.map((r) => (
        <p key={r} className="text-slate-600">
          {r}
        </p>
      ))}
    </>
  );
}

function TaxBreakdown({
  profileCode,
  taxType,
  totals,
  money,
  labels,
}: {
  profileCode: InvoiceCountry;
  taxType: "intra" | "inter";
  totals: { totalTax: number; cgst: number; sgst: number; igst: number };
  money: (n: number) => string;
  labels: { primary: string; splitA?: string; splitB?: string };
}) {
  if (profileCode === "IN") {
    if (taxType === "intra") {
      return (
        <>
          <div className="flex justify-between">
            <span className="text-slate-500">{labels.splitA}</span>
            <span>{money(totals.cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{labels.splitB}</span>
            <span>{money(totals.sgst)}</span>
          </div>
        </>
      );
    }
    return (
      <div className="flex justify-between">
        <span className="text-slate-500">IGST</span>
        <span>{money(totals.igst)}</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{labels.primary}</span>
      <span>{money(totals.totalTax)}</span>
    </div>
  );
}

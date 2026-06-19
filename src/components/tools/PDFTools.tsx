"use client";

import { useState } from "react";
import { Download, FileUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "merge" | "extract";

function parsePageRange(spec: string, total: number): number[] {
  const pages = new Set<number>();
  for (const part of spec.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(total, b); i++) pages.add(i - 1);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) pages.add(n - 1);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

export default function PDFTools() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [pageSpec, setPageSpec] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list).filter((f) => f.type === "application/pdf")]);
  };

  const process = async () => {
    if (files.length === 0) {
      setStatus("Please upload at least one PDF file.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();

      if (mode === "merge") {
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const pages = await out.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => out.addPage(p));
        }
      } else {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const indices = parsePageRange(pageSpec, doc.getPageCount());
        if (indices.length === 0) throw new Error("No valid pages in range.");
        const pages = await out.copyPages(doc, indices);
        pages.forEach((p) => out.addPage(p));
      }

      const pdfBytes = await out.save();
      const blob = new Blob([Uint8Array.from(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = mode === "merge" ? "merged.pdf" : "extracted.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("PDF downloaded successfully.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "PDF processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["merge", "extract"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium capitalize transition",
              mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
            )}
          >
            {m === "merge" ? "Merge PDFs" : "Extract Pages"}
          </button>
        ))}
      </div>

      <div className="glass-card p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-theme-subtle px-6 py-12 transition hover:border-accent/40">
          <FileUp className="mb-3 h-10 w-10 text-theme-subtle" />
          <span className="text-sm font-medium text-theme-heading">Drop PDF files or click to upload</span>
          <span className="mt-1 text-xs text-theme-subtle">Processed locally — never uploaded to a server</span>
          <input type="file" accept="application/pdf" multiple={mode === "merge"} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-theme-surface px-4 py-2 text-sm">
                <span className="truncate text-theme-body">{f.name}</span>
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-theme-subtle hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {mode === "extract" && (
          <div className="mt-4">
            <label className="mb-2 block text-sm text-theme-muted">Page numbers (e.g. 1,3,5-7)</label>
            <input value={pageSpec} onChange={(e) => setPageSpec(e.target.value)} className="input-field font-mono text-sm" />
          </div>
        )}

        <button
          type="button"
          onClick={process}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {loading ? "Processing…" : "Download PDF"}
        </button>

        {status && <p className="mt-4 text-sm text-theme-muted">{status}</p>}
      </div>
    </div>
  );
}

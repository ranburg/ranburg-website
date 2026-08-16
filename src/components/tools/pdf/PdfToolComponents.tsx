"use client";

import { useToolUi } from "@/hooks/useToolUi";

import { useState } from "react";
import { Download } from "lucide-react";
import FileDropzone, { FileList } from "@/components/tools/shared/FileDropzone";
import { BeforeAfterBar } from "@/components/tools/viz";
import { downloadBlob } from "@/lib/imageProcessing";
import {
  compressPdfWithJpegPages,
  loadPdfJs,
  PDF_COMPRESS_PRESETS,
  type PdfCompressPreset,
} from "@/lib/pdfCompress";

async function loadPdfLib() {
  return import("pdf-lib");
}

export function PdfMergeTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const merge = async () => {
    if (files.length < 2) {
      setStatus("Upload at least 2 PDF files.");
      return;
    }
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const out = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const pages = await out.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "merged.pdf");
      setStatus("Merged successfully.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Merge failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfToolShell files={files} setFiles={setFiles} onRun={merge} loading={loading} status={status} label="Merge PDFs" multiple />
  );
}

export function PdfSplitTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const split = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const count = src.getPageCount();
      for (let i = 0; i < count; i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const bytes = await out.save();
        downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), `page-${i + 1}.pdf`);
      }
      setStatus(`Split into ${count} files.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Split failed.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={split} loading={loading} status={status} label="Split PDF" />;
}

export function PdfCompressorTool() {
  const { t } = useToolUi("pdf-tools");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState<PdfCompressPreset>("balanced");
  const [sizes, setSizes] = useState<{ before: number; after: number } | null>(null);

  const compress = async () => {
    if (!files[0]) return;
    setLoading(true);
    setSizes(null);
    try {
      const before = files[0].size;
      const data = await files[0].arrayBuffer();
      const bytes = await compressPdfWithJpegPages(data, preset, (page, total) => {
        setStatus(`Compressing page ${page} of ${total}…`);
      });
      const after = bytes.byteLength;
      setSizes({ before, after });
      const saved = before > 0 ? Math.round(((before - after) / before) * 100) : 0;
      downloadBlob(
        new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }),
        files[0].name.replace(/\.pdf$/i, "") + "-compressed.pdf"
      );
      setStatus(
        saved > 0
          ? `Compressed — about ${saved}% smaller (${formatBytes(before)} → ${formatBytes(after)}). Pages are saved as images so text is no longer selectable.`
          : `Output is ${formatBytes(after)}. Try Smallest if the file is still large, or the PDF may already be optimized.`
      );
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell
        files={files}
        setFiles={setFiles}
        onRun={compress}
        loading={loading}
        status={status}
        label="Compress PDF"
        hideButton
      />
      <div>
        <p className="mb-2 text-sm font-medium text-theme-heading">Compression</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(PDF_COMPRESS_PRESETS) as PdfCompressPreset[]).map((key) => {
            const item = PDF_COMPRESS_PRESETS[key];
            const active = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                  active
                    ? "border-accent bg-accent/10 text-theme-heading"
                    : "border-theme-subtle text-theme-muted hover:border-accent/40"
                }`}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-0.5 block text-xs">{item.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={compress}
        disabled={loading || !files[0]}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {loading ? "Compressing…" : "Compress PDF"}
      </button>
      {sizes && <BeforeAfterBar before={sizes.before} after={sizes.after} beforeLabel="Original" afterLabel="Compressed" />}
      <p className="text-xs text-theme-subtle">
        Scanned and photo PDFs shrink the most. Each page is re-encoded as JPEG in your browser — nothing is uploaded.
      </p>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfPageExtractorTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const extract = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const indices = parsePageRange(range, src.getPageCount());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "extracted.pdf");
      setStatus("Pages extracted.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Extract failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell files={files} setFiles={setFiles} onRun={extract} loading={loading} status={status} label="Extract pages" hideButton />
      <input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 1-3, 5" className="input-field" />
      <button type="button" onClick={extract} disabled={loading} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Extract</button>
    </div>
  );
}

export function PdfPageRemoverTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [remove, setRemove] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const total = src.getPageCount();
      const removeSet = new Set(parsePageRange(remove, total));
      const keep = [...Array(total).keys()].filter((i) => !removeSet.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "edited.pdf");
      setStatus("Pages removed.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell files={files} setFiles={setFiles} onRun={run} loading={loading} status={status} label="Remove pages" hideButton />
      <input value={remove} onChange={(e) => setRemove(e.target.value)} placeholder="Pages to remove: 2, 4-6" className="input-field" />
      <button type="button" onClick={run} disabled={loading} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Remove & Download</button>
    </div>
  );
}

export function JpgToPdfTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type === "image/png";
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const out = await pdf.save();
      downloadBlob(new Blob([Uint8Array.from(out)], { type: "application/pdf" }), "images.pdf");
      setStatus("PDF created.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={convert} loading={loading} status={status} label="Create PDF" multiple accept="image/jpeg,image/png,.jpg,.png" />;
}

export function WordToPdfTool() {
  const { t } = useToolUi("pdf-tools" );
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Document");
  const [status, setStatus] = useState("");

  const onTxt = async (file: File) => {
    const content = await file.text();
    setText(content);
    if (!title || title === "Document") setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const convert = async () => {
    if (!text.trim()) return;
    try {
      const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.4;
      const pageWidth = 595;
      const pageHeight = 842;
      const maxWidth = pageWidth - margin * 2;
      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      page.drawText(title, { x: margin, y, size: 18, font, color: rgb(0, 0, 0) });
      y -= 36;
      const words = text.split(/\s+/);
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
          page.drawText(line, { x: margin, y, size: fontSize, font });
          y -= lineHeight;
          line = word;
          if (y < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        } else line = test;
      }
      if (line) page.drawText(line, { x: margin, y, size: fontSize, font });
      const out = await pdf.save();
      downloadBlob(new Blob([Uint8Array.from(out)], { type: "application/pdf" }), "document.pdf");
      setStatus("PDF downloaded.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-theme-muted">
        Creates a PDF from <strong className="text-theme-heading">plain text</strong> (paste or .txt). Does not parse .docx — paste from Word instead.
      </p>
      <FileDropzone accept=".txt,text/plain" onFiles={(f) => f[0] && onTxt(f[0])} hint="Optional .txt upload" />
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Document title" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className="input-field" placeholder="Paste text from Word or any document…" />
      <button type="button" onClick={convert} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
        Create PDF
      </button>
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}

export function PdfToJpgTool() {
  const { t } = useToolUi("pdf-tools" );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const pdfjs = await loadPdfJs();
      const data = await files[0].arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        await page.render({ canvasContext: ctx, viewport }).promise;
        canvas.toBlob((blob) => blob && downloadBlob(blob, `page-${i}.jpg`), "image/jpeg", 0.92);
      }
      setStatus(`Converted ${pdf.numPages} page(s).`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Conversion failed. Try a smaller PDF.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={convert} loading={loading} status={status} label="Convert to JPG" />;
}

export function PdfPageReorderTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onFiles = async (next: File[]) => {
    setFiles(next);
    if (!next[0]) {
      setOrder([]);
      return;
    }
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await next[0].arrayBuffer());
      setOrder([...Array(src.getPageCount()).keys()]);
      setStatus(`${src.getPageCount()} pages loaded.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Could not read PDF.");
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setOrder((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const run = async () => {
    if (!files[0] || order.length === 0) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, order);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "reordered.pdf");
      setStatus("Reordered PDF downloaded.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Reorder failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDropzone accept="application/pdf,.pdf" onFiles={onFiles} hint="Drag and drop — processed in your browser" />
      <FileList files={files} onRemove={() => { setFiles([]); setOrder([]); }} />
      {order.length > 0 && (
        <ol className="space-y-2">
          {order.map((pageIndex, i) => (
            <li
              key={`${pageIndex}-${i}`}
              className="flex items-center justify-between rounded-xl border border-theme-subtle bg-theme-surface/50 px-4 py-2 text-sm"
            >
              <span className="font-medium text-theme-heading">
                Position {i + 1}: original page {pageIndex + 1}
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => move(i, -1)} className="rounded-lg border border-theme-subtle px-2 py-1 text-xs" disabled={i === 0}>
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="rounded-lg border border-theme-subtle px-2 py-1 text-xs"
                  disabled={i === order.length - 1}
                >
                  Down
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <button type="button" onClick={run} disabled={loading || !files[0]} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? "Processing…" : "Download reordered PDF"}
      </button>
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}

export function PdfToTextTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const extract = async () => {
    if (!files[0]) return;
    setLoading(true);
    setText("");
    try {
      const pdfjs = await loadPdfJs();
      const data = await files[0].arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const parts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Reading page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        parts.push(`--- Page ${i} ---\n${pageText}`);
      }
      const out = parts.join("\n\n");
      setText(out);
      setStatus(out.trim() ? `Extracted text from ${pdf.numPages} page(s).` : "No selectable text found (likely a scanned PDF).");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    downloadBlob(new Blob([text], { type: "text/plain" }), "extracted.txt");
  };

  return (
    <div className="space-y-4">
      <PdfToolShell files={files} setFiles={setFiles} onRun={extract} loading={loading} status={status} label="Extract text" />
      {text && (
        <>
          <textarea value={text} readOnly rows={16} className="input-field font-mono text-sm" />
          <button type="button" onClick={downloadTxt} className="rounded-xl border border-theme-subtle px-5 py-2.5 text-sm font-semibold text-theme-heading">
            Download .txt
          </button>
        </>
      )}
    </div>
  );
}

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

function PdfToolShell({
  files,
  setFiles,
  onRun,
  loading,
  status,
  label,
  multiple = false,
  accept = "application/pdf,.pdf",
  hideButton = false,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onRun: () => void;
  loading: boolean;
  status: string;
  label: string;
  multiple?: boolean;
  accept?: string;
  hideButton?: boolean;
}) {
  return (
    <div className="space-y-6">
      <FileDropzone
        accept={accept}
        multiple={multiple}
        onFiles={(f) => setFiles((prev) => (multiple ? [...prev, ...f] : f))}
        hint="Drag and drop — processed in your browser"
      />
      <FileList files={files} onRemove={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))} />
      {!hideButton && (
        <button type="button" onClick={onRun} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          <Download className="h-4 w-4" />{loading ? "Processing…" : label}
        </button>
      )}
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}
